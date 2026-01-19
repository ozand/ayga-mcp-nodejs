# Migration Guide: Legacy Keys to ayga_live_ Keys

## Overview

Starting with version 3.2.0, the Ayga MCP Client uses a new API key format (`ayga_live_*`) for authentication. This guide helps you migrate from legacy keys.

## What Changed

### Old Format (Deprecated)
```
REDIS_API_KEY=your_legacy_key_here
```

### New Format (Recommended)
```
REDIS_API_KEY=ayga_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Why Migrate?

The new `ayga_live_` keys provide:

1. **Per-Key Rate Limits** - Each key has its own minute/day limits
2. **Usage Tracking** - Monitor usage per parser
3. **Self-Service** - Check your limits with `ayga_check_limits` tool
4. **Better Security** - Keys can be suspended/revoked instantly
5. **Audit Trail** - Full request logging per key

## Migration Steps

### Step 1: Get a New API Key

Contact the Ayga Telegram bot to create a new key:

1. Open Telegram
2. Find [@aygamcp_bot](https://t.me/aygamcp_bot)
3. Send `/newkey` command
4. Copy the generated key (shown only once!)

### Step 2: Update Your Configuration

#### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "ayga": {
      "command": "npx",
      "args": ["-y", "@ayga/mcp-client"],
      "env": {
        "REDIS_API_KEY": "ayga_live_YOUR_NEW_KEY_HERE"
      }
    }
  }
}
```

#### VS Code (`settings.json`)

```json
{
  "mcp.servers": {
    "ayga": {
      "command": "npx",
      "args": ["-y", "@ayga/mcp-client"],
      "env": {
        "REDIS_API_KEY": "ayga_live_YOUR_NEW_KEY_HERE"
      }
    }
  }
}
```

#### Environment Variable

```bash
export REDIS_API_KEY="ayga_live_YOUR_NEW_KEY_HERE"
```

### Step 3: Verify Your Key

After updating, you can verify your key works using the new `ayga_check_limits` tool:

```
User: Check my API limits
AI: [calls ayga_check_limits tool]
Result:
{
  "key_id": "abc123def456",
  "minute": { "used": 0, "limit": 60, "remaining": 60 },
  "day": { "used": 0, "limit": 1000, "remaining": 1000 }
}
```

## Backward Compatibility

**Legacy keys still work** but you will see a warning on startup:

```
[WARN] API key does not match expected format 'ayga_live_*'. 
Legacy keys are deprecated. Get a new key at https://t.me/aygamcp_bot
```

The client will continue to function, but we recommend migrating to benefit from the new features.

## Troubleshooting

### "API key not found" Error

Your legacy key may have been revoked. Contact [@aygamcp_bot](https://t.me/aygamcp_bot) to get a new key.

### Rate Limit Errors

New keys have configurable limits. Default is 60/minute and 1000/day. Contact support if you need higher limits.

### Key Shows as "suspended"

Your key may have been suspended for policy violations. Contact support for assistance.

## Need Help?

- Telegram Bot: [@aygamcp_bot](https://t.me/aygamcp_bot)
- Email: support@ayga.tech
- GitHub Issues: https://github.com/ozand/ayga-mcp-nodejs/issues
