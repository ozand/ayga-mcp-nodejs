#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { PARSERS, getParserById } from "./parsers.js";

// Configuration
const API_URL = process.env.API_URL || "https://redis.ayga.tech";
const API_KEY = process.env.REDIS_API_KEY;

interface TaskResult {
    success: number;
    info: Record<string, any>;
    sources?: any[];
    data?: any;
}

class AygaMCPServer {
    private server: Server;
    private jwtToken?: string;
    private tokenExpiry?: number;

    constructor() {
        this.server = new Server(
            {
                name: "ayga-mcp-client",
                version: "2.0.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupHandlers();
        this.setupErrorHandlers();
    }

    private log(message: string, level: "info" | "error" | "debug" = "info") {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }

    private async getJWT(): Promise<string> {
        // Return cached token if still valid (with 5 min buffer)
        if (this.jwtToken && this.tokenExpiry && Date.now() < this.tokenExpiry - 300000) {
            return this.jwtToken;
        }

        if (!API_KEY) {
            throw new Error("REDIS_API_KEY environment variable is required");
        }

        this.log("Exchanging API key for JWT token");

        try {
            const response = await fetch(`${API_URL}/auth/exchange`, {
                method: "POST",
                headers: {
                    "X-API-Key": API_KEY,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Auth failed (${response.status}): ${errorText}`);
            }

            const data = await response.json() as { access_token: string; expires_in?: number };
            this.jwtToken = data.access_token;
            // Set expiry (default 3600s, use 3000s to be safe)
            this.tokenExpiry = Date.now() + (data.expires_in || 3000) * 1000;

            this.log("JWT token obtained successfully");
            return this.jwtToken;
        } catch (error) {
            this.log(`Authentication error: ${error}`, "error");
            throw error;
        }
    }

    private async submitParserTask(
        parserId: string,
        query: string,
        timeout: number = 60
    ): Promise<TaskResult> {
        const parser = getParserById(parserId);
        if (!parser) {
            throw new Error(`Unknown parser: ${parserId}`);
        }

        const token = await this.getJWT();
        const taskId = crypto.randomUUID();

        this.log(`Submitting task ${taskId} to parser ${parser.name}`);

        // Prepare task data for A-Parser
        const taskData = JSON.stringify([
            taskId,
            parser.aparserName,
            "default",
            query,
            {},
            {},
        ]);

        try {
            // Submit task to Redis queue
            const submitResponse = await fetch(
                `${API_URL}/structures/list/aparser_redis_api/lpush`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ value: taskData }),
                }
            );

            if (!submitResponse.ok) {
                const errorText = await submitResponse.text();
                throw new Error(`Task submission failed (${submitResponse.status}): ${errorText}`);
            }

            this.log(`Task ${taskId} submitted, waiting for result (timeout: ${timeout}s)`);

            // Poll for result
            return await this.waitForResult(taskId, timeout, token);
        } catch (error) {
            this.log(`Task submission error: ${error}`, "error");
            throw error;
        }
    }

    private async waitForResult(
        taskId: string,
        timeout: number,
        token: string
    ): Promise<TaskResult> {
        const startTime = Date.now();
        const pollInterval = 2000; // 2 seconds
        let attempts = 0;

        while (Date.now() - startTime < timeout * 1000) {
            attempts++;

            try {
                const response = await fetch(
                    `${API_URL}/kv/aparser_redis_api:${taskId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json() as { value: string };
                    const result = JSON.parse(data.value) as TaskResult;

                    this.log(`Task ${taskId} completed after ${attempts} attempts`);
                    return result;
                }

                // 404 means task not ready yet, continue polling
                if (response.status === 404) {
                    await new Promise((resolve) => setTimeout(resolve, pollInterval));
                    continue;
                }

                // Other errors
                const errorText = await response.text();
                throw new Error(`Failed to get result (${response.status}): ${errorText}`);
            } catch (error) {
                // Network errors - retry
                this.log(`Poll attempt ${attempts} failed: ${error}, retrying...`, "debug");
                await new Promise((resolve) => setTimeout(resolve, pollInterval));
            }
        }

        throw new Error(`Timeout waiting for result after ${timeout}s (${attempts} attempts)`);
    }

    private setupHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const tools: any[] = PARSERS.map((parser) => ({
                name: `search_${parser.id}`,
                description: `${parser.description} (Category: ${parser.category})`,
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: parser.category === "Translation"
                                ? "Text to translate"
                                : "Search query or URL",
                        },
                        timeout: {
                            type: "number",
                            description: "Timeout in seconds (default: 60)",
                            default: 60,
                        },
                    },
                    required: ["query"],
                },
            }));

            // Add list_parsers tool
            tools.push({
                name: "list_parsers",
                description: "List all available parsers with their categories",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            });

            return { tools };
        });

        // Call tool
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                // Handle list_parsers tool
                if (name === "list_parsers") {
                    const category = args?.category as string | undefined;
                    let parsers = PARSERS;

                    if (category) {
                        parsers = PARSERS.filter((p) => p.category === category);
                    }

                    const categories = [...new Set(PARSERS.map((p) => p.category))];
                    const result = {
                        total: parsers.length,
                        categories: categories,
                        parsers: parsers.map((p) => ({
                            id: p.id,
                            name: p.name,
                            category: p.category,
                            description: p.description,
                        })),
                    };

                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    };
                }

                // Handle parser tools
                if (name.startsWith("search_")) {
                    const parserId = name.replace("search_", "");
                    const query = args?.query as string;
                    const timeout = (args?.timeout as number) || 60;

                    if (!query) {
                        throw new Error("Query parameter is required");
                    }

                    this.log(`Executing ${name} with query: ${query.substring(0, 50)}...`);

                    const result = await this.submitParserTask(parserId, query, timeout);

                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    };
                }

                throw new Error(`Unknown tool: ${name}`);
            } catch (error) {
                this.log(`Tool execution error: ${error}`, "error");

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(
                                {
                                    error: error instanceof Error ? error.message : String(error),
                                    tool: name,
                                    timestamp: new Date().toISOString(),
                                },
                                null,
                                2
                            ),
                        },
                    ],
                    isError: true,
                };
            }
        });
    }

    private setupErrorHandlers() {
        this.server.onerror = (error) => {
            this.log(`Server error: ${error}`, "error");
        };

        process.on("SIGINT", async () => {
            this.log("Received SIGINT, shutting down...");
            await this.server.close();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            this.log("Received SIGTERM, shutting down...");
            await this.server.close();
            process.exit(0);
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);

        this.log("Ayga MCP Server v2.0.0 started");
        this.log(`API URL: ${API_URL}`);
        this.log(`Total parsers: ${PARSERS.length}`);
        this.log("Server ready on stdio transport");
    }
}

// Entry point
const server = new AygaMCPServer();
server.run().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
