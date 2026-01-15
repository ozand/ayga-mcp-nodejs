# Ayga MCP Client (Node.js)

Modern, lightweight MCP client for Redis API with **40 AI parsers** across **9 categories**.

## 🚀 Quick Start

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

## 📦 Available Parsers (40 total)

### AI Chat (8)
- `search_perplexity` - Perplexity AI with sources
- `search_chatgpt` - ChatGPT with web search
- `search_claude` - Anthropic Claude
- `search_gemini` - Google Gemini
- `search_copilot` - Microsoft Copilot
- `search_grok` - xAI Grok
- `search_deepseek` - DeepSeek AI
- `search_deepai` - DeepAI

### Search Engines (8)
- `search_google_search` - Google Search
- `search_bing_search` - Bing Search
- `search_duckduckgo` - DuckDuckGo
- `search_yahoo_search` - Yahoo Search
- `search_yandex_search` - Yandex Search
- `search_baidu_search` - Baidu Search
- `search_rambler_search` - Rambler Search
- `search_you_search` - You.com

### Instagram (4)
- `search_instagram_profile` - User profiles
- `search_instagram_post` - Individual posts
- `search_instagram_tag` - Hashtag pages
- `search_instagram_geo` - Location pages

### TikTok (1)
- `search_tiktok_profile` - User profiles and videos

### YouTube (5)
- `search_youtube_search` - Search videos
- `search_youtube_video` - Video details
- `search_youtube_comments` - Video comments
- `search_youtube_channel_videos` - Channel videos
- `search_youtube_channel_about` - Channel info

### Google Trends (1)
- `search_google_trends` - Trends data

### Pinterest (1)
- `search_pinterest_search` - Search pins

### Reddit (2)
- `search_reddit_posts` - Search posts
- `search_reddit_comments` - Post comments

### Translation (3)
- `search_google_translate` - Google Translate
- `search_bing_translate` - Bing Translator
- `search_yandex_translate` - Yandex Translator

### HTML Content (3)
- `search_link_extractor` - Extract links
- `search_article_extractor` - Extract articles (Mozilla Readability)
- `search_text_extractor` - Extract text content

## 💡 Usage Examples

### In Claude Desktop/VS Code

```
@ayga list_parsers
@ayga search_perplexity query="What is MCP protocol?"
@ayga search_google_trends query="AI trends 2026"
@ayga search_youtube_search query="Python tutorials" timeout=90
@ayga search_google_translate query="Hello world"
```

### Command Line

```bash
# Set API key
export REDIS_API_KEY="your-api-key"

# Run server
npx @ayga/mcp-client
```

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     VS Code / Claude Desktop        │
└─────────────┬───────────────────────┘
              │ MCP stdio
┌─────────────▼───────────────────────┐
│  @ayga/mcp-client (Node.js)         │
│  - 40 parsers                       │
│  - MCP protocol                     │
│  - JWT authentication               │
└─────────────┬───────────────────────┘
              │ HTTPS REST API
┌─────────────▼───────────────────────┐
│  redis_wrapper (Python/FastAPI)     │
│  https://redis.ayga.tech            │
└─────────────┬───────────────────────┘
              │ Redis Queue
┌─────────────▼───────────────────────┐
│         A-Parser (Windows)          │
└─────────────────────────────────────┘
```

## 🔑 Getting API Key

1. Visit https://redis.ayga.tech
2. Sign up or log in
3. Generate API key
4. Use in configuration

## 🆚 vs Python Version

| Feature          | Node.js (2.0.0)        | Python (1.4.1)               |
| ---------------- | ---------------------- | ---------------------------- |
| **Installation** | `npx @ayga/mcp-client` | `uvx ayga-mcp-client==1.4.1` |
| **Startup**      | ~50-100ms              | ~716ms                       |
| **Dependencies** | MCP SDK only           | mcp, httpx, pydantic         |
| **Size**         | ~500 lines             | ~1200 lines                  |
| **Runtime**      | Node.js 18+            | Python 3.11+                 |
| **Parsers**      | ✅ All 40               | ✅ All 40                     |

## 📄 License

MIT

## 🔗 Links

- **API Backend**: https://redis.ayga.tech
- **Python Version**: https://pypi.org/project/ayga-mcp-client/
- **GitHub**: https://github.com/ozand/ayga-mcp-nodejs
- **Issues**: https://github.com/ozand/ayga-mcp-nodejs/issues
