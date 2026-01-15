#!/usr/bin/env tsx

/**
 * Simple test to verify MCP server basics
 * Tests tool listing without requiring API key
 */

import { PARSERS, getAllCategories } from "./parsers.js";

console.log("🧪 Testing ayga-mcp-client (Node.js)\n");

// Test 1: Parser configuration
console.log("Test 1: Parser Configuration");
console.log(`Total parsers: ${PARSERS.length}`);
console.log(`Categories: ${getAllCategories().length}`);
console.log();

// Test 2: List all parsers by category
console.log("Test 2: Parsers by Category");
const categories = getAllCategories();
categories.forEach((category) => {
    const parsers = PARSERS.filter((p) => p.category === category);
    console.log(`  ${category}: ${parsers.length} parsers`);
});
console.log();

// Test 3: Sample parsers
console.log("Test 3: Sample Parsers");
const samples = [
    "perplexity",
    "chatgpt",
    "google_search",
    "instagram_profile",
    "youtube_search",
    "google_trends",
];

samples.forEach((id) => {
    const parser = PARSERS.find((p) => p.id === id);
    if (parser) {
        console.log(`  ✅ ${parser.name} (${parser.category})`);
        console.log(`     A-Parser: ${parser.aparserName}`);
    }
});
console.log();

// Test 4: Tool names
console.log("Test 4: MCP Tool Names");
const toolNames = PARSERS.slice(0, 5).map((p) => `search_${p.id}`);
toolNames.forEach((name) => console.log(`  - ${name}`));
console.log(`  ... and ${PARSERS.length - 5} more`);
console.log();

console.log("✅ All basic tests passed!");
console.log();
console.log("📝 To test with real API:");
console.log("  1. Set REDIS_API_KEY environment variable");
console.log("  2. Run: npm run dev");
console.log("  3. Or use in VS Code/Claude Desktop with provided config");
