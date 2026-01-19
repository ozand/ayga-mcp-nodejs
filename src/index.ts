#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { PARSERS as STATIC_PARSERS, type ParserConfig } from "./parsers.js";
import { ParserRegistry, getRegistry } from "./parser-registry.js";
import { 
    TOOL_CATEGORIES, 
    getParsersForTool, 
    getDefaultEngine, 
    buildToolSchema 
} from "./tool-definitions.js";

// Configuration
const API_URL = process.env.API_URL || "https://redis.ayga.tech";
const API_KEY = process.env.REDIS_API_KEY;

// Dynamic parser loading (set DYNAMIC_PARSERS=false to disable)
const ENABLE_DYNAMIC = process.env.DYNAMIC_PARSERS !== "false";

// API Key format validation
const VALID_KEY_PREFIX = "ayga_live_";

interface TaskResult {
    success: number;
    info: Record<string, any>;
    sources?: any[];
    data?: any;
}

interface RateLimitStatus {
    key_id: string;
    name?: string;
    status?: string;
    minute: {
        used: number;
        limit: number;
        remaining: number;
        resets_in: number;
    };
    day: {
        used: number;
        limit: number;
        remaining: number;
        date: string;
    };
}

class AygaMCPServer {
    private server: Server;
    private registry: ParserRegistry;

    constructor() {
        this.server = new Server(
            {
            name: "ayga-mcp-client",
            version: "3.2.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.registry = getRegistry({
            apiUrl: API_URL,
            apiKey: API_KEY,
            enableDynamic: ENABLE_DYNAMIC,
        });

        this.setupHandlers();
        this.setupErrorHandlers();
        this.validateApiKey();
    }

    /**
     * Validate API key format on startup.
     * Warns if key doesn't match expected format but allows legacy keys.
     */
    private validateApiKey(): void {
        if (!API_KEY) {
            this.log("Warning: REDIS_API_KEY not set. API calls will fail.", "error");
            return;
        }

        if (!API_KEY.startsWith(VALID_KEY_PREFIX)) {
            this.log(
                `Warning: API key does not match expected format '${VALID_KEY_PREFIX}*'. ` +
                "Legacy keys are deprecated. Get a new key at https://t.me/aygamcp_bot",
                "error"
            );
        }
    }

    private log(message: string, level: "info" | "error" | "debug" = "info") {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }

    private getAuthHeaders(): Record<string, string> {
        /**
         * Returns authentication headers for API requests.
         * Uses X-API-Key directly - no JWT exchange needed.
         */
        if (!API_KEY) {
            throw new Error("REDIS_API_KEY environment variable is required");
        }
        
        return {
            "X-API-Key": API_KEY,
            "Content-Type": "application/json",
        };
    }

    private async submitParserTask(
        parserId: string,
        query: string,
        timeout: number = 60
    ): Promise<TaskResult> {
        const parser = await this.registry.getParserById(parserId);
        if (!parser) {
            throw new Error(`Unknown parser: ${parserId}`);
        }

        const taskId = crypto.randomUUID();
        const headers = this.getAuthHeaders();

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
                    headers,
                    body: JSON.stringify({ value: taskData }),
                }
            );

            if (!submitResponse.ok) {
                const errorText = await submitResponse.text();
                throw new Error(`Task submission failed (${submitResponse.status}): ${errorText}`);
            }

            this.log(`Task ${taskId} submitted, waiting for result (timeout: ${timeout}s)`);

            // Poll for result
            return await this.waitForResult(taskId, timeout, headers);
        } catch (error) {
            this.log(`Task submission error: ${error}`, "error");
            throw error;
        }
    }

    private async waitForResult(
        taskId: string,
        timeout: number,
        headers: Record<string, string>
    ): Promise<TaskResult> {
        const startTime = Date.now();
        const pollInterval = 2000; // 2 seconds
        let attempts = 0;

        while (Date.now() - startTime < timeout * 1000) {
            attempts++;

            try {
                const response = await fetch(
                    `${API_URL}/kv/aparser_redis_api:${taskId}`,
                    { headers }
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

                // Rate limit - wait and retry
                if (response.status === 429) {
                    const retryAfter = parseInt(response.headers.get("Retry-After") || "5");
                    this.log(`Rate limited, waiting ${retryAfter}s...`, "debug");
                    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
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

    /**
     * Check current rate limit status for the API key.
     * Calls the /me/limits endpoint.
     */
    private async checkLimits(): Promise<RateLimitStatus> {
        const headers = this.getAuthHeaders();
        
        try {
            const response = await fetch(`${API_URL}/me/limits`, { headers });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to check limits (${response.status}): ${errorText}`);
            }
            
            return await response.json() as RateLimitStatus;
        } catch (error) {
            this.log(`Error checking limits: ${error}`, "error");
            throw error;
        }
    }

    private setupHandlers() {
        // List available tools - 6 consolidated tools instead of 40+
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const parsers = await this.registry.getParsers();
            const tools: any[] = [];

            // Build consolidated tools from categories
            for (const toolCat of TOOL_CATEGORIES) {
                const engines = getParsersForTool(toolCat.id, parsers).map(p => p.id);
                if (engines.length > 0) {
                    tools.push(buildToolSchema(toolCat, engines));
                }
            }

            // Add list_parsers utility tool
            tools.push({
                name: "list_parsers",
                description: "List all available parsers with their categories",
                inputSchema: {
                    type: "object",
                    properties: {
                        _placeholder: {
                            type: "boolean",
                            description: "Placeholder. Always pass true.",
                        },
                    },
                    required: ["_placeholder"],
                },
            });

            // Add ayga_check_limits utility tool
            tools.push({
                name: "ayga_check_limits",
                description: "Check current rate limit status for your API key. Returns used/remaining requests for minute and day windows.",
                inputSchema: {
                    type: "object",
                    properties: {
                        _placeholder: {
                            type: "boolean",
                            description: "Placeholder. Always pass true.",
                        },
                    },
                    required: ["_placeholder"],
                },
            });

            this.log(`Registered ${tools.length} consolidated tools (${parsers.length} parsers available)`);
            return { tools };
        });

        // Call tool
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                // Handle list_parsers utility tool
                if (name === "list_parsers") {
                    const parsers = await this.registry.getParsers();
                    const categories = await this.registry.getCategories();
                    
                    // Group parsers by consolidated tool
                    const toolMapping: Record<string, { tool: string; parsers: string[] }> = {};
                    for (const toolCat of TOOL_CATEGORIES) {
                        const engines = getParsersForTool(toolCat.id, parsers);
                        if (engines.length > 0) {
                            toolMapping[toolCat.id] = {
                                tool: toolCat.name,
                                parsers: engines.map(e => e.id),
                            };
                        }
                    }

                    const result = {
                        total: parsers.length,
                        consolidatedTools: TOOL_CATEGORIES.length,
                        categories: categories,
                        toolMapping: toolMapping,
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

                // Handle ayga_check_limits utility tool
                if (name === "ayga_check_limits") {
                    this.log("Checking API key rate limits...");
                    
                    const limits = await this.checkLimits();
                    
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    key_id: limits.key_id,
                                    name: limits.name,
                                    status: limits.status,
                                    minute: {
                                        used: limits.minute.used,
                                        limit: limits.minute.limit,
                                        remaining: limits.minute.remaining,
                                        resets_in_seconds: limits.minute.resets_in,
                                    },
                                    day: {
                                        used: limits.day.used,
                                        limit: limits.day.limit,
                                        remaining: limits.day.remaining,
                                        date: limits.day.date,
                                    },
                                    message: limits.minute.remaining > 0 
                                        ? `OK: ${limits.minute.remaining} requests remaining this minute`
                                        : `Warning: Rate limit reached. Resets in ${limits.minute.resets_in}s`,
                                }, null, 2),
                            },
                        ],
                    };
                }

                // Handle consolidated tools (ask_ai, search_web, get_social, etc.)
                const toolCat = TOOL_CATEGORIES.find(t => t.id === name);
                if (toolCat) {
                    const query = args?.query as string;
                    const timeout = (args?.timeout as number) || 60;
                    
                    // Get engine - use provided or default
                    let engine = args?.engine as string | undefined;
                    if (!engine) {
                        engine = getDefaultEngine(name);
                    }

                    if (!query) {
                        throw new Error("Query parameter is required");
                    }

                    this.log(`Executing ${name} with engine=${engine}, query: ${query.substring(0, 50)}...`);

                    const result = await this.submitParserTask(engine, query, timeout);

                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(result, null, 2),
                            },
                        ],
                    };
                }

                throw new Error(`Unknown tool: ${name}. Available: ${TOOL_CATEGORIES.map(t => t.id).join(", ")}, list_parsers, ayga_check_limits`);
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

        // Pre-fetch parsers
        const parsers = await this.registry.getParsers();

        this.log("Ayga MCP Server v3.2.0 started (stateless auth)");
        this.log(`API URL: ${API_URL}`);
        this.log(`Auth: X-API-Key (direct, no JWT exchange)`);
        this.log(`Dynamic loading: ${ENABLE_DYNAMIC ? "enabled" : "disabled"}`);
        this.log(`Total parsers: ${parsers.length}`);
        this.log("Server ready on stdio transport");
    }
}

// Entry point
const server = new AygaMCPServer();
server.run().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
