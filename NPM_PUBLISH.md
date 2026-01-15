# npm Publish Instructions

## Prerequisites

1. **npm account**: https://www.npmjs.com/signup
2. **npm login**: `npm login`
3. **Package name available**: `@ayga/mcp-client` should be free

## Pre-publish Checklist

- [x] Code complete and tested
- [x] TypeScript compiles without errors
- [x] package.json has correct metadata
- [x] README.md is comprehensive
- [x] CHANGELOG.md is updated
- [x] LICENSE file exists (MIT)
- [x] .gitignore excludes node_modules and dist from npm
- [x] GitHub repository created: https://github.com/ozand/ayga-mcp-nodejs
- [x] GitHub release v2.0.0 published

## Publishing Steps

### 1. Login to npm (if not already)

```bash
npm login
# Enter username, password, email
```

### 2. Test package locally

```bash
# Dry run to see what will be published
npm publish --dry-run

# Expected output:
# @ayga/mcp-client@2.0.0
# - dist/
# - README.md
# - LICENSE
# - package.json
```

### 3. Publish to npm

```bash
npm publish --access public
```

**Expected result**:
```
+ @ayga/mcp-client@2.0.0
✓ Package published successfully
View at: https://www.npmjs.com/package/@ayga/mcp-client
```

### 4. Verify publication

```bash
# Check on npm
npm view @ayga/mcp-client

# Test installation
npx @ayga/mcp-client@latest --help
```

## After Publishing

1. **Update Python ayga-mcp-client README**:
   - Add link to Node.js version
   - Add comparison table
   - Mention npx installation option

2. **Update redis_wrapper docs**:
   - Add Node.js MCP client to documentation
   - Update integration guides

3. **Announce**:
   - GitHub Discussions
   - Twitter/Social media
   - MCP community channels

## Troubleshooting

### Error: Package name taken
```bash
# Try alternative names:
# @ayga/redis-mcp-client
# @ozand/ayga-mcp-client
```

### Error: Authentication failed
```bash
npm logout
npm login
# Re-enter credentials
```

### Error: 2FA required
```bash
# Use npm token or authenticator app
npm publish --otp=123456
```

## Version Updates (future)

```bash
# Patch (bug fixes)
npm version patch
npm publish

# Minor (new features)
npm version minor
npm publish

# Major (breaking changes)
npm version major
npm publish
```

## Current Status

✅ GitHub repository: https://github.com/ozand/ayga-mcp-nodejs
✅ GitHub release v2.0.0: https://github.com/ozand/ayga-mcp-nodejs/releases/tag/v2.0.0
⏳ npm package: Awaiting publication

**Ready to publish!** Run: `npm publish --access public`
