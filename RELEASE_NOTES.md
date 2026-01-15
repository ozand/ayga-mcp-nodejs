# Ayga MCP Client v2.0.0 - Node.js Release

We're excited to announce **ayga-mcp-client v2.0.0** - a complete Node.js/TypeScript rewrite!

## 🎉 What's New

### Complete Node.js Rewrite
- **Faster**: ~50ms startup vs ~716ms (Python version)
- **Lighter**: ~500 lines vs ~1200 lines
- **Simpler**: No Python dependencies, just Node.js 18+

### 40 AI Parsers Across 10 Categories

**AI Chat (8)**
- Perplexity, ChatGPT, Claude, Gemini, Copilot, Grok, DeepSeek, DeepAI

**Search Engines (8)**
- Google, Bing, DuckDuckGo, Yahoo, Yandex, Baidu, Rambler, You.com

**Social Media**
- Instagram (4): Profile, Post, Tag, Geo
- TikTok (1): Profile
- YouTube (5): Search, Video, Comments, Channel Videos, Channel About
- Reddit (2): Posts, Comments
- Pinterest (1): Search

**Other**
- Google Trends (1)
- Translation (3): Google, Bing, Yandex
- HTML Content (3): Link Extractor, Article Extractor, Text Extractor

### Easy Installation

```bash
# Via npx (recommended)
npx @ayga/mcp-client@latest

# Or global install
npm install -g @ayga/mcp-client
```

### VS Code/Claude Desktop Ready

```json
{
  "servers": {
    "ayga": {
      "command": "npx",
      "args": ["@ayga/mcp-client@latest"],
      "env": {
        "REDIS_API_KEY": "your-key"
      }
    }
  }
}
```

## 📊 Comparison

| Feature      | Node.js v2.0.0         | Python v1.4.1         |
| ------------ | ---------------------- | --------------------- |
| Installation | `npx @ayga/mcp-client` | `uvx ayga-mcp-client` |
| Startup      | ~50ms                  | ~716ms                |
| Size         | ~500 lines             | ~1200 lines           |
| Runtime      | Node.js 18+            | Python 3.11+          |
| Parsers      | ✅ All 40               | ✅ All 40              |

## 🔗 Links

- **npm**: https://www.npmjs.com/package/@ayga/mcp-client
- **GitHub**: https://github.com/ozand/ayga-mcp-nodejs
- **API Backend**: https://redis.ayga.tech
- **Python Version**: https://pypi.org/project/ayga-mcp-client/

## 🙏 Migration Note

Both Python (v1.4.1) and Node.js (v2.0.0) versions are maintained. They share the same backend API and functionality. Choose based on your preference:

- **Node.js**: Better for MCP ecosystem (most servers use npx)
- **Python**: Established, battle-tested, feature-complete

---

**Full Changelog**: https://github.com/ozand/ayga-mcp-nodejs/blob/main/CHANGELOG.md
