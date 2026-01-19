/**
 * Consolidated Tool Definitions
 * 
 * Instead of 40+ individual tools, we define 6 category-based tools
 * with an optional 'engine' parameter for specific parser selection.
 */

import type { ParserConfig } from "./parsers.js";

/**
 * Tool category configuration
 */
export interface ToolCategory {
    id: string;
    name: string;
    description: string;
    categories: string[];  // Parser categories to include
    defaultEngine: string; // Default parser ID if engine not specified
    defaultEnvVar: string; // Environment variable for default override
    queryDescription: string; // Description for the query parameter
}

/**
 * Consolidated tool definitions
 */
export const TOOL_CATEGORIES: ToolCategory[] = [
    {
        id: "ask_ai",
        name: "Ask AI",
        description: "Query AI models like Perplexity, ChatGPT, Google AI, Kimi, DeepAI, Copilot for answers and analysis",
        categories: ["FreeAI"],
        defaultEngine: "perplexity",
        defaultEnvVar: "DEFAULT_AI_ENGINE",
        queryDescription: "Question or prompt for the AI model",
    },
    {
        id: "search_web",
        name: "Web Search", 
        description: "Search the web using Google, Bing, DuckDuckGo, Yandex, Baidu, Yahoo, Rambler, You.com or get Google Trends data",
        categories: ["SE", "Analytics"],
        defaultEngine: "google_search",
        defaultEnvVar: "DEFAULT_SEARCH_ENGINE",
        queryDescription: "Search query",
    },
    {
        id: "get_social",
        name: "Social Media",
        description: "Get data from social platforms: Instagram profiles/posts/tags/geo, TikTok, Reddit posts/comments, Telegram groups, Pinterest",
        categories: ["Social", "Visual"],
        defaultEngine: "instagram_profile",
        defaultEnvVar: "DEFAULT_SOCIAL_ENGINE",
        queryDescription: "Username, URL, or search query",
    },
    {
        id: "get_video",
        name: "Video Data",
        description: "Search YouTube videos, get video details, comments, or channel information",
        categories: ["YouTube"],
        defaultEngine: "youtube_search",
        defaultEnvVar: "DEFAULT_VIDEO_ENGINE",
        queryDescription: "Search query or video/channel URL",
    },
    {
        id: "translate",
        name: "Translate",
        description: "Translate text using Google Translate, DeepL, Bing, or Yandex",
        categories: ["Translation"],
        defaultEngine: "google_translate",
        defaultEnvVar: "DEFAULT_TRANSLATION_ENGINE",
        queryDescription: "Text to translate",
    },
    {
        id: "extract",
        name: "Extract Content",
        description: "Extract text, articles, or links from web pages",
        categories: ["Content"],
        defaultEngine: "text_extractor",
        defaultEnvVar: "DEFAULT_EXTRACTION_ENGINE",
        queryDescription: "URL of the web page",
    },
];

/**
 * Get parsers for a tool category
 */
export function getParsersForTool(
    toolId: string,
    allParsers: ParserConfig[]
): ParserConfig[] {
    const tool = TOOL_CATEGORIES.find(t => t.id === toolId);
    if (!tool) return [];
    
    return allParsers.filter(p => tool.categories.includes(p.category));
}

/**
 * Get default engine for a tool, checking ENV first
 */
export function getDefaultEngine(toolId: string): string {
    const tool = TOOL_CATEGORIES.find(t => t.id === toolId);
    if (!tool) return "";
    
    // Check environment variable first
    const envValue = process.env[tool.defaultEnvVar];
    if (envValue) {
        return envValue;
    }
    
    return tool.defaultEngine;
}

/**
 * Find which tool a parser belongs to
 */
export function findToolForParser(
    parserId: string,
    allParsers: ParserConfig[]
): ToolCategory | undefined {
    const parser = allParsers.find(p => p.id === parserId);
    if (!parser) return undefined;
    
    return TOOL_CATEGORIES.find(t => t.categories.includes(parser.category));
}

/**
 * Build MCP tool schema for a consolidated tool
 */
export function buildToolSchema(
    tool: ToolCategory,
    availableEngines: string[]
): object {
    return {
        name: tool.id,
        description: tool.description,
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: tool.queryDescription,
                },
                engine: {
                    type: "string",
                    description: `Specific engine to use. Available: ${availableEngines.join(", ")}. Default: ${getDefaultEngine(tool.id)}`,
                    enum: availableEngines,
                },
                timeout: {
                    type: "number",
                    description: "Timeout in seconds (default: 60)",
                },
            },
            required: ["query"],
        },
    };
}
