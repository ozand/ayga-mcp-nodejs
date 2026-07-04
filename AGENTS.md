# AGENTS.md — Ayga MCP Client (Node.js)

## Required reading
- `README.md` — Contains setup instructions for Claude Desktop and VS Code Copilot.
- `package.json` — Lists confirmed package dependencies, dev dependencies, and available scripts.

## Project overview
This is the Node.js implementation of the **Ayga MCP Client**. It exposes **6 consolidated AI tools** (`ask_ai`, `search_web`, `get_video`, `get_social`, `translate`, `extract`) as well as `ayga_check_limits` and `list_parsers`.
It communicates with the `redis_wrapper` backend using stateless `X-API-Key` authentication (no JWT exchange needed).

## File structure
- `src/index.ts` — Main entry point where the MCP server is initialized and tools are declared.
- `src/test.ts` — Local CLI-based test script.
- `package.json` — NPM project configuration and build scripts.
- `tsconfig.json` — TypeScript configuration.

## Environment setup
No `.env` file is required. The client relies on system or configuration-level environments:
- `REDIS_API_KEY` — Loaded by the host client (e.g., Claude Desktop, VS Code) to authenticate requests.

Install dependencies:
```bash
npm install
```

## How to run
Run the developer version using TSX:
```bash
npm run dev
```

## Build and test commands
Build the TypeScript files to `dist/`:
```bash
npm run build
```

Run local tests (uses TSX to execute `src/test.ts`):
```bash
npm test
```

## Tech stack conventions
- **TypeScript**: Strictly type-check all inputs. Use TypeScript for all source code under `src/`.
- **Model Context Protocol (MCP)**: Implements `@modelcontextprotocol/sdk`. Register tools using the `server.tool()` or equivalent pattern.

## Code style guidelines
- Always use ES Modules (`import/export` syntax).
- Prefer absolute clarity in tool parameter schemas (Zod or Pydantic equivalents in JS/TS).
- Strictly return clean, human-readable content blocks from tools to avoid AI formatting issues.

## Security considerations
- **NEVER hardcode API keys.** The `REDIS_API_KEY` must be passed via environment config.
- Ensure `dist/` is ignored in git and only generated during prepublish/build steps.
