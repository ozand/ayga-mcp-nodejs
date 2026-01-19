# Ayga MCP Client (Node.js) v3.2.0

Modern, lightweight MCP client with **6 consolidated AI tools** - optimized for LLM context windows.

## What's New in v3.2.0

- **API Key Validation**: Validates `ayga_live_*` key format on startup
- **Rate Limit Checking**: New `ayga_check_limits` tool to check your quota
- **Better Error Messages**: Clear warnings for deprecated key formats

See [Migration Guide](docs/MIGRATION.md) for upgrading from legacy keys.

## What's New in v3.0.0

**Context-Optimized Architecture**: Reduced from 40+ individual tools to 6 consolidated tools, saving ~80% context tokens while maintaining full functionality.

| Tool | Engines | Default |
|------|---------|---------|
| `ask_ai` | perplexity, chatgpt, claude, gemini, copilot, grok, deepseek, deepai | perplexity |
| `search_web` | google_search, bing_search, duckduckgo, yandex_search, yahoo_search, baidu_search, google_trends, rambler_search, you_search | google_search |
| `get_social` | instagram_profile, instagram_post, instagram_tag, instagram_geo, tiktok_profile, pinterest_search, reddit_posts, reddit_comments | instagram_profile |
| `get_video` | youtube_search, youtube_video, youtube_comments, youtube_channel_videos, youtube_channel_about | youtube_search |
| `translate` | google_translate, bing_translate, yandex_translate | google_translate |
| `extract` | text_extractor, article_extractor, link_extractor | text_extractor |

## Quick Start

### Install via npx (recommended)

```bash
npx @ayga/mcp-client
```

### VS Code Copilot Configuration

Add to `%APPDATA%\Code\User\mcp.json`:

```json
{
  "inputs": [
    {
      "id": "REDIS_API_KEY",
      "type": "promptString",
      "description": "ayga-mcp-client Redis API key",
      "password": true
    }
  ],
  "servers": {
    "ayga": {
      "type": "stdio",
      "command": "npx",
      "args": ["@ayga/mcp-client@latest"],
      "env": {
        "REDIS_API_KEY": "${input:REDIS_API_KEY}"
      }
    }
  }
}
```

### Claude Desktop Configuration

Add to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ayga": {
      "command": "npx",
      "args": ["@ayga/mcp-client@latest"],
      "env": {
        "REDIS_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Usage Examples

### Basic Usage (uses default engine)

```
ask_ai query="What is quantum computing?"
search_web query="latest AI news"
get_video query="Python tutorials"
translate query="Hello world"
```

### With Specific Engine

```
ask_ai query="Explain transformers" engine="claude"
search_web query="weather today" engine="duckduckgo"
get_social query="@openai" engine="instagram_profile"
get_video query="dQw4w9WgXcQ" engine="youtube_video"
```

### With Timeout

```
ask_ai query="Complex analysis" engine="perplexity" timeout=120
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_API_KEY` | API key for authentication | (required) |
| `API_URL` | Backend API URL | https://redis.ayga.tech |
| `DEFAULT_AI_ENGINE` | Default for ask_ai | perplexity |
| `DEFAULT_SEARCH_ENGINE` | Default for search_web | google_search |
| `DEFAULT_SOCIAL_ENGINE` | Default for get_social | instagram_profile |
| `DEFAULT_VIDEO_ENGINE` | Default for get_video | youtube_search |
| `DEFAULT_TRANSLATION_ENGINE` | Default for translate | google_translate |
| `DEFAULT_EXTRACTION_ENGINE` | Default for extract | text_extractor |
| `DYNAMIC_PARSERS` | Enable dynamic parser loading | true |

## Architecture

```
+-------------------------------------+
|     VS Code / Claude Desktop        |
+-----------------+-------------------+
                  | MCP stdio
+-----------------v-------------------+
|  @ayga/mcp-client (Node.js)         |
|  - 6 consolidated tools             |
|  - 36 parser engines                |
|  - JWT authentication               |
+-----------------+-------------------+
                  | HTTPS REST API
+-----------------v-------------------+
|  redis_wrapper (Python/FastAPI)     |
|  https://redis.ayga.tech            |
+-----------------+-------------------+
                  | Redis Queue
+-----------------v-------------------+
|         A-Parser (Windows)          |
+-------------------------------------+
```

## Tool Reference

### ask_ai
Query AI models for answers, analysis, and research.

**Engines**: perplexity, chatgpt, claude, gemini, copilot, grok, deepseek, deepai

```
ask_ai query="What are the benefits of Rust?" engine="claude"
```

### search_web
Search the web or get trends data.

**Engines**: google_search, bing_search, duckduckgo, yandex_search, yahoo_search, baidu_search, google_trends, rambler_search, you_search

```
search_web query="best programming languages 2026"
search_web query="AI" engine="google_trends"
```

### get_social
Get data from social media platforms.

**Engines**: instagram_profile, instagram_post, instagram_tag, instagram_geo, tiktok_profile, pinterest_search, reddit_posts, reddit_comments

```
get_social query="@openai" engine="instagram_profile"
get_social query="machine learning" engine="reddit_posts"
```

### get_video
Search and get YouTube content.

**Engines**: youtube_search, youtube_video, youtube_comments, youtube_channel_videos, youtube_channel_about

```
get_video query="Python crash course"
get_video query="https://youtube.com/watch?v=..." engine="youtube_comments"
```

### translate
Translate text between languages.

**Engines**: google_translate, bing_translate, yandex_translate

```
translate query="Hello, how are you?"
translate query="Bonjour" engine="yandex_translate"
```

### extract
Extract content from web pages.

**Engines**: text_extractor, article_extractor, link_extractor

```
extract query="https://example.com/article" engine="article_extractor"
extract query="https://example.com" engine="link_extractor"
```

### ayga_check_limits (New in v3.2.0)
Check your API key rate limits and remaining quota.

```
ayga_check_limits _placeholder=true
```

Returns:
```json
{
  "key_id": "abc123...",
  "minute": { "used": 5, "limit": 60, "remaining": 55 },
  "day": { "used": 100, "limit": 1000, "remaining": 900 }
}
```

### list_parsers
List all available parsers and their categories.

```
list_parsers _placeholder=true
```

## Migration from v2.x

**v2.x (40+ tools)**:
```
search_perplexity query="What is MCP?"
search_google_search query="latest news"
search_youtube_video query="..."
```

**v3.x (6 consolidated tools)**:
```
ask_ai query="What is MCP?"                    # uses default: perplexity
ask_ai query="What is MCP?" engine="perplexity"  # explicit
search_web query="latest news"                 # uses default: google_search
get_video query="..." engine="youtube_video"
```

## Getting API Key

### New Users (Recommended)

Get an `ayga_live_` key from the Telegram bot:

1. Open Telegram
2. Find [@aygamcp_bot](https://t.me/aygamcp_bot)
3. Send `/newkey` command
4. Copy the key (shown only once!)

### Legacy Users

See [Migration Guide](docs/MIGRATION.md) for upgrading from legacy keys.

## License

MIT

## Links

- **API Backend**: https://redis.ayga.tech
- **Python Version**: https://pypi.org/project/ayga-mcp-client/
- **GitHub**: https://github.com/ozand/ayga-mcp-nodejs
- **Issues**: https://github.com/ozand/ayga-mcp-nodejs/issues
