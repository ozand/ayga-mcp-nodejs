# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-15

### Added
- Initial Node.js/TypeScript implementation
- MCP protocol support via @modelcontextprotocol/sdk
- 40 AI parsers across 10 categories:
  - AI Chat: 8 parsers (Perplexity, ChatGPT, Claude, Gemini, Copilot, Grok, DeepSeek, DeepAI)
  - Search Engines: 8 parsers (Google, Bing, DuckDuckGo, Yahoo, Yandex, Baidu, Rambler, You.com)
  - Instagram: 4 parsers (Profile, Post, Tag, Geo)
  - TikTok: 1 parser (Profile)
  - YouTube: 5 parsers (Search, Video, Comments, Channel Videos, Channel About)
  - Google Trends: 1 parser
  - Pinterest: 1 parser (Search)
  - Reddit: 2 parsers (Posts, Comments)
  - Translation: 3 parsers (Google, Bing, Yandex)
  - HTML Content: 3 parsers (Link Extractor, Article Extractor, Text Extractor)
- JWT authentication with token caching
- Automatic task polling with configurable timeout
- `list_parsers` tool for discovering available parsers
- Comprehensive error handling and logging
- Support for VS Code Copilot and Claude Desktop

### Changed
- Complete rewrite from Python to Node.js
- Simplified architecture (thin MCP client)
- Faster startup (~50ms vs ~716ms)
- Smaller footprint (~500 lines vs ~1200 lines)
- Native Node.js fetch API (no external HTTP client)

### Technical
- TypeScript with strict mode
- ES2022 modules
- Node.js 18+ requirement
- Published to npm as @ayga/mcp-client
