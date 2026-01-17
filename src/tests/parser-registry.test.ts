/**
 * Tests for parser-registry.ts
 * 
 * Run with: npx tsx src/tests/parser-registry.test.ts
 */

import { ParserRegistry, getRegistry, resetRegistry } from "../parser-registry.js";
import { PARSERS } from "../parsers.js";

// Simple test framework
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
    try {
        const result = fn();
        if (result instanceof Promise) {
            result
                .then(() => {
                    console.log(`✅ ${name}`);
                    passed++;
                })
                .catch((err) => {
                    console.log(`❌ ${name}: ${err}`);
                    failed++;
                });
        } else {
            console.log(`✅ ${name}`);
            passed++;
        }
    } catch (err) {
        console.log(`❌ ${name}: ${err}`);
        failed++;
    }
}

function assert(condition: boolean, message?: string) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

// Tests

test("ParserRegistry constructor creates instance", () => {
    const registry = new ParserRegistry();
    assert(registry !== null);
});

test("ParserRegistry with custom config", () => {
    const registry = new ParserRegistry({
        apiUrl: "http://localhost:8111",
        cacheTtlMs: 1000,
        enableDynamic: false,
    });
    assert(registry !== null);
});

test("getStaticParsers returns parsers", () => {
    const registry = new ParserRegistry();
    const parsers = registry.getStaticParsers();
    assert(parsers.length > 0, "Should have parsers");
    assertEqual(parsers.length, PARSERS.length);
});

test("getParsers returns parsers (static mode)", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const parsers = await registry.getParsers();
    assert(parsers.length > 0, "Should have parsers");
    assertEqual(parsers.length, PARSERS.length);
});

test("getParserById finds parser", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const parser = await registry.getParserById("perplexity");
    assert(parser !== undefined, "Should find perplexity");
    assertEqual(parser?.id, "perplexity");
    assertEqual(parser?.aparserName, "FreeAI::Perplexity");
});

test("getParserById returns undefined for unknown", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const parser = await registry.getParserById("unknown_parser");
    assert(parser === undefined, "Should not find unknown parser");
});

test("getParserByAParserName finds parser", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const parser = await registry.getParserByAParserName("FreeAI::ChatGPT");
    assert(parser !== undefined, "Should find ChatGPT");
    assertEqual(parser?.id, "chatgpt");
});

test("getParsersByCategory filters correctly", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const aiParsers = await registry.getParsersByCategory("AI Chat");
    assert(aiParsers.length > 0, "Should have AI Chat parsers");
    assert(aiParsers.every(p => p.category === "AI Chat"), "All should be AI Chat");
});

test("getCategories returns unique categories", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const categories = await registry.getCategories();
    assert(categories.length > 0, "Should have categories");
    assert(categories.includes("AI Chat"), "Should include AI Chat");
    assert(categories.includes("Search Engines"), "Should include Search Engines");
    // Check uniqueness
    const unique = new Set(categories);
    assertEqual(categories.length, unique.size, "Categories should be unique");
});

test("getRegistry returns singleton", () => {
    resetRegistry();
    const r1 = getRegistry({ enableDynamic: false });
    const r2 = getRegistry();
    assert(r1 === r2, "Should return same instance");
});

test("resetRegistry clears singleton", () => {
    const r1 = getRegistry({ enableDynamic: false });
    resetRegistry();
    const r2 = getRegistry({ enableDynamic: false });
    assert(r1 !== r2, "Should be different instances after reset");
});

test("getParserOptions returns default options", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const options = await registry.getParserOptions("perplexity");
    assert(options !== undefined, "Should return options");
    assertEqual(options.parser_id, "perplexity");
    assertEqual(options.timeout, 60);
    assertEqual(options.enabled, true);
});

test("getParserTimeout returns timeout", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const timeout = await registry.getParserTimeout("chatgpt");
    assertEqual(timeout, 60);
});

test("isParserEnabled returns true by default", async () => {
    resetRegistry();
    const registry = getRegistry({ enableDynamic: false });
    const enabled = await registry.isParserEnabled("gemini");
    assertEqual(enabled, true);
});

// Run summary after async tests complete
setTimeout(() => {
    console.log(`\n--- Results ---`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    if (failed > 0) {
        process.exit(1);
    }
}, 1000);
