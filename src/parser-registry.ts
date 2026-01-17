/**
 * Dynamic Parser Registry
 * 
 * Fetches parser configurations from the Python API and caches them.
 * Falls back to static parsers on failure.
 */

import { ParserConfig, PARSERS as STATIC_PARSERS } from "./parsers.js";

interface ApiParserResponse {
    id: string;
    name: string;
    description: string;
    category: string;
    aparser_name: string;
    parameters?: Record<string, any>;
    enabled?: boolean;
}

interface ParserListResponse {
    parsers: ApiParserResponse[];
    count: number;
    categories: string[];
}

interface ParserOptionsResponse {
    defaults: {
        timeout: number;
        proxy: string | null;
        user_agent: string | null;
    };
    overrides: Record<string, ParserOptions>;
}

export interface ParserOptions {
    parser_id: string;
    timeout: number;
    enabled: boolean;
    proxy?: string;
    user_agent?: string;
    custom_params?: Record<string, any>;
}

export interface RegistryConfig {
    apiUrl: string;
    apiKey?: string;
    cacheTtlMs: number;
    enableDynamic: boolean;
}

const DEFAULT_CONFIG: RegistryConfig = {
    apiUrl: process.env.API_URL || "https://redis.ayga.tech",
    apiKey: process.env.REDIS_API_KEY,
    cacheTtlMs: 5 * 60 * 1000, // 5 minutes
    enableDynamic: process.env.DYNAMIC_PARSERS !== "false",
};

export class ParserRegistry {
    private parsers: ParserConfig[] = [];
    private parserOptions: Map<string, ParserOptions> = new Map();
    private defaultOptions: ParserOptions = {
        parser_id: "default",
        timeout: 60,
        enabled: true,
    };
    private lastFetch: number = 0;
    private lastOptionsFetch: number = 0;
    private fetchPromise: Promise<ParserConfig[]> | null = null;
    private optionsFetchPromise: Promise<void> | null = null;
    private config: RegistryConfig;
    private initialized: boolean = false;

    constructor(config: Partial<RegistryConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Get all parsers, fetching from API if cache is stale
     */
    async getParsers(): Promise<ParserConfig[]> {
        if (!this.config.enableDynamic) {
            return STATIC_PARSERS;
        }

        const now = Date.now();
        const cacheValid = this.initialized && (now - this.lastFetch) < this.config.cacheTtlMs;

        if (cacheValid) {
            return this.parsers;
        }

        // Deduplicate concurrent fetch requests
        if (this.fetchPromise) {
            return this.fetchPromise;
        }

        this.fetchPromise = this.fetchParsers();

        try {
            const result = await this.fetchPromise;
            return result;
        } finally {
            this.fetchPromise = null;
        }
    }

    /**
     * Get a parser by ID
     */
    async getParserById(id: string): Promise<ParserConfig | undefined> {
        const parsers = await this.getParsers();
        return parsers.find(p => p.id === id);
    }

    /**
     * Get a parser by A-Parser name
     */
    async getParserByAParserName(name: string): Promise<ParserConfig | undefined> {
        const parsers = await this.getParsers();
        return parsers.find(p => p.aparserName === name);
    }

    /**
     * Get parsers by category
     */
    async getParsersByCategory(category: string): Promise<ParserConfig[]> {
        const parsers = await this.getParsers();
        return parsers.filter(p => p.category === category);
    }

    /**
     * Get all categories
     */
    async getCategories(): Promise<string[]> {
        const parsers = await this.getParsers();
        return [...new Set(parsers.map(p => p.category))];
    }

    /**
     * Force refresh of parser cache
     */
    async refresh(): Promise<ParserConfig[]> {
        this.lastFetch = 0;
        this.fetchPromise = null;
        return this.getParsers();
    }

    /**
     * Get static parsers (no API call)
     */
    getStaticParsers(): ParserConfig[] {
        return STATIC_PARSERS;
    }

    /**
     * Get options for a specific parser
     */
    async getParserOptions(parserId: string): Promise<ParserOptions> {
        await this.ensureOptionsFetched();
        return this.parserOptions.get(parserId.toLowerCase()) || {
            ...this.defaultOptions,
            parser_id: parserId,
        };
    }

    /**
     * Get timeout for a parser
     */
    async getParserTimeout(parserId: string): Promise<number> {
        const options = await this.getParserOptions(parserId);
        return options.timeout;
    }

    /**
     * Check if parser is enabled
     */
    async isParserEnabled(parserId: string): Promise<boolean> {
        const options = await this.getParserOptions(parserId);
        return options.enabled;
    }

    /**
     * Ensure options are fetched
     */
    private async ensureOptionsFetched(): Promise<void> {
        if (!this.config.enableDynamic) {
            return;
        }

        const now = Date.now();
        const cacheValid = (now - this.lastOptionsFetch) < this.config.cacheTtlMs;

        if (cacheValid && this.parserOptions.size > 0) {
            return;
        }

        if (this.optionsFetchPromise) {
            await this.optionsFetchPromise;
            return;
        }

        this.optionsFetchPromise = this.fetchOptions();
        try {
            await this.optionsFetchPromise;
        } finally {
            this.optionsFetchPromise = null;
        }
    }

    /**
     * Fetch parser options from API
     */
    private async fetchOptions(): Promise<void> {
        try {
            this.log("Fetching parser options from API...");

            const response = await fetch(`${this.config.apiUrl}/parsers/options`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(this.config.apiKey ? { "X-API-Key": this.config.apiKey } : {}),
                },
            });

            if (!response.ok) {
                this.log(`Options API returned ${response.status}`, "debug");
                return;
            }

            const data = await response.json() as ParserOptionsResponse;

            // Update default options
            if (data.defaults) {
                this.defaultOptions = {
                    parser_id: "default",
                    timeout: data.defaults.timeout || 60,
                    enabled: true,
                    proxy: data.defaults.proxy || undefined,
                    user_agent: data.defaults.user_agent || undefined,
                };
            }

            // Update per-parser options
            if (data.overrides) {
                for (const [parserId, options] of Object.entries(data.overrides)) {
                    this.parserOptions.set(parserId.toLowerCase(), options);
                }
            }

            this.lastOptionsFetch = Date.now();
            this.log(`Loaded options for ${this.parserOptions.size} parsers`);

        } catch (error) {
            this.log(`Failed to fetch parser options: ${error}`, "debug");
            // Options are optional, use defaults
        }
    }

    /**
     * Fetch parsers from API
     */
    private async fetchParsers(): Promise<ParserConfig[]> {
        try {
            this.log("Fetching parsers from API...");

            const response = await fetch(`${this.config.apiUrl}/parsers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(this.config.apiKey ? { "X-API-Key": this.config.apiKey } : {}),
                },
            });

            if (!response.ok) {
                throw new Error(`API returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json() as ParserListResponse;
            
            // Transform API response to ParserConfig format
            const parsers = data.parsers
                .filter(p => p.enabled !== false)
                .map(p => this.transformParser(p));

            this.parsers = parsers;
            this.lastFetch = Date.now();
            this.initialized = true;

            this.log(`Loaded ${parsers.length} parsers from API`);
            return parsers;

        } catch (error) {
            this.log(`Failed to fetch parsers: ${error}`, "error");
            
            // Fall back to static parsers
            if (!this.initialized) {
                this.parsers = STATIC_PARSERS;
                this.initialized = true;
                this.log(`Falling back to ${STATIC_PARSERS.length} static parsers`);
            }

            return this.parsers;
        }
    }

    /**
     * Transform API parser response to ParserConfig
     */
    private transformParser(apiParser: ApiParserResponse): ParserConfig {
        return {
            id: apiParser.id,
            name: apiParser.name,
            description: apiParser.description,
            category: apiParser.category,
            aparserName: apiParser.aparser_name,
        };
    }

    private log(message: string, level: "info" | "error" | "debug" = "info") {
        if (process.env.DEBUG || level === "error") {
            const timestamp = new Date().toISOString();
            console.error(`[${timestamp}] [ParserRegistry] [${level.toUpperCase()}] ${message}`);
        }
    }
}

// Singleton instance
let registryInstance: ParserRegistry | null = null;

/**
 * Get the global parser registry instance
 */
export function getRegistry(config?: Partial<RegistryConfig>): ParserRegistry {
    if (!registryInstance || config) {
        registryInstance = new ParserRegistry(config);
    }
    return registryInstance;
}

/**
 * Reset the global registry (for testing)
 */
export function resetRegistry(): void {
    registryInstance = null;
}
