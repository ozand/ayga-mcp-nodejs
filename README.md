# Ayga MCP Client (Node.js) v3.3.0

> **Paid Service**: This is a paid Ayga service. Get your API key at [@aygamcp_bot](https://t.me/aygamcp_bot).

MCP client with **6 consolidated AI tools** for Claude Desktop and VS Code Copilot.

## Quick Start

1. Get API key: [@aygamcp_bot](https://t.me/aygamcp_bot) → `/newkey`
2. Configure your IDE (see below)
3. Use tools: `ask_ai`, `search_web`, `get_video`, `get_social`, `translate`, `extract`

## Available Tools

| Tool | Description | Default Engine |
|------|-------------|----------------|
| `ask_ai` | Query AI models | perplexity |
| `search_web` | Web search and trends | google_search |
| `get_video` | YouTube content | youtube_search |
| `get_social` | Social media data | instagram_profile |
| `translate` | Text translation | google_translate |
| `extract` | Web page extraction | text_extractor |
| `ayga_check_limits` | Check your rate limits | - |
| `list_parsers` | List all available parsers | - |

## Configuration

### VS Code Copilot

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

### Claude Desktop

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

## Usage

```bash
# Basic usage (default engine)
ask_ai query="What is quantum computing?"
search_web query="latest AI news"
get_video query="Python tutorials"

# With specific engine
ask_ai query="Explain transformers" engine="chatgpt"
search_web query="weather" engine="duckduckgo_search"

# Check your rate limits
ayga_check_limits _placeholder=true
```

## Environment Variables

| Variable | Required | Default |
|----------|----------|---------|
| `REDIS_API_KEY` | Yes | - |
| `API_URL` | No | https://redis.ayga.tech |

## Architecture

```
+-------------------------------------+
|     VS Code / Claude Desktop        |
+-----------------+-------------------+
                  | MCP stdio
+-----------------v-------------------+
|  @ayga/mcp-client (Node.js)         |
|  - 6 consolidated tools             |
|  - 40+ parser engines               |
+-----------------+-------------------+
                  | HTTPS
+-----------------v-------------------+
|  Ayga API (redis.ayga.tech)         |
+-----------------+-------------------+
                  |
+-----------------v-------------------+
|           Parser Backend            |
+-------------------------------------+
```

## Available Engines

| Tool | Engines |
|------|---------|
| `ask_ai` | perplexity, googleai, chatgpt, kimi, deepai, copilot |
| `search_web` | google_search, bing_search, duckduckgo_search, yandex_search, baidu_search, yahoo_search, rambler_search, you_search, google_trends |
| `get_video` | youtube_search, youtube_video, youtube_suggest, youtube_comments, youtube_channel_videos, youtube_channel_about |
| `get_social` | instagram_profile, instagram_post, instagram_tag, instagram_geo, instagram_search, tiktok_profile, reddit_posts, reddit_post_info, reddit_comments, telegram_group, pinterest_search |
| `translate` | google_translate, deepl_translate, bing_translate, yandex_translate |
| `extract` | text_extractor, article_extractor, link_extractor |

## Support

- Telegram: [@aygamcp_bot](https://t.me/aygamcp_bot)
- Email: support@ayga.tech
- GitHub: https://github.com/ozand/ayga-mcp-nodejs/issues

## License

MIT
