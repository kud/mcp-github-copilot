```
 ██████╗ ██╗████████╗██╗  ██╗██╗   ██╗██████╗      ██████╗ ██████╗ ██████╗ ██╗██╗      ██████╗ ████████╗
██╔════╝ ██║╚══██╔══╝██║  ██║██║   ██║██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗██║██║     ██╔═══██╗╚══██╔══╝
██║  ███╗██║   ██║   ███████║██║   ██║██████╔╝    ██║     ██║   ██║██████╔╝██║██║     ██║   ██║   ██║
██║   ██║██║   ██║   ██╔══██║██║   ██║██╔══██╗    ██║     ██║   ██║██╔═══╝ ██║██║     ██║   ██║   ██║
╚██████╔╝██║   ██║   ██║  ██║╚██████╔╝██████╔╝    ╚██████╗╚██████╔╝██║     ██║███████╗╚██████╔╝   ██║
 ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝      ╚═════╝ ╚═════╝╚═╝     ╚═╝╚══════╝ ╚═════╝    ╚═╝
```

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-1.27-purple?logo=anthropic)](https://modelcontextprotocol.io/)
[![npm](https://img.shields.io/npm/v/@kud/mcp-github-copilot?color=CB3837&logo=npm)](https://www.npmjs.com/package/@kud/mcp-github-copilot)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Query any GitHub Copilot model from your AI assistant — no extra API key required.**

[Features](#features) • [Quick Start](#quick-start) • [Installation](#installation) • [Tools](#available-tools) • [Development](#development)

</div>

---

## Features

- 🤖 **Query any Copilot model** — Claude, GPT-5, Codex, and more via the official `@github/copilot-sdk`
- 🔍 **Discover models** — list all available models with capabilities, context limits, and billing multipliers
- 🚀 **Zero extra config** — uses your existing GitHub Copilot CLI credentials automatically
- 🖼️ **Image attachments** — attach files or base64 images for vision-capable models
- ⚡ **Modern Stack** — TypeScript 5+, ESM, Zod schemas, MCP 1.27
- 📦 **MCP Protocol** — native integration with Claude Desktop, Claude Code CLI, Cursor, and more

---

## Quick Start

### Prerequisites

- Node.js 20+
- GitHub Copilot subscription
- GitHub Copilot CLI installed and authenticated

```bash
gh extension install github/gh-copilot
gh auth login
```

### Install

```bash
npm install -g @kud/mcp-github-copilot
```

### Minimal Claude Code config

```yaml
github-copilot:
  transport: stdio
  command: npx
  args:
    - -y
    - "@kud/mcp-github-copilot"
```

---

## Installation

<details>
<summary><strong>Claude Code CLI</strong></summary>

```bash
claude mcp add --transport stdio --scope user github-copilot \
  -- npx --yes @kud/mcp-github-copilot@latest
```

Verify: `claude mcp list` should show `github-copilot`

</details>

<details>
<summary><strong>Claude Desktop — macOS</strong></summary>

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github-copilot": {
      "command": "npx",
      "args": ["--yes", "@kud/mcp-github-copilot@latest"]
    }
  }
}
```

Restart Claude Desktop.

</details>

<details>
<summary><strong>Claude Desktop — Windows</strong></summary>

Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github-copilot": {
      "command": "npx",
      "args": ["--yes", "@kud/mcp-github-copilot@latest"]
    }
  }
}
```

Restart Claude Desktop.

</details>

<details>
<summary><strong>Cursor</strong></summary>

In Cursor settings → MCP → Add server:

```json
{
  "github-copilot": {
    "command": "npx",
    "args": ["--yes", "@kud/mcp-github-copilot@latest"]
  }
}
```

</details>

<details>
<summary><strong>Windsurf</strong></summary>

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "github-copilot": {
      "command": "npx",
      "args": ["--yes", "@kud/mcp-github-copilot@latest"]
    }
  }
}
```

</details>

<details>
<summary><strong>VSCode (with Copilot)</strong></summary>

Edit `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "github-copilot": {
      "type": "stdio",
      "command": "npx",
      "args": ["--yes", "@kud/mcp-github-copilot@latest"]
    }
  }
}
```

</details>

---

## Available Tools

### Querying

| Tool    | Description                                                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `query` | Send a prompt to a Copilot model and return the response. Supports optional model selection and file/image attachments. |

### Discovery

| Tool          | Description                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `list_models` | List all available Copilot models with capabilities, context window limits, and billing multipliers. |

**Total: 2 Tools**

---

## Image Attachments

The `query` tool accepts an optional `attachments` array for vision-capable models (Claude, GPT-5+):

**File attachment** — reads from disk:

```json
{
  "type": "file",
  "path": "/absolute/path/to/screenshot.png"
}
```

**Blob attachment** — inline base64 data:

```json
{
  "type": "blob",
  "data": "<base64-encoded-content>",
  "mimeType": "image/png"
}
```

Both support an optional `displayName` field.

---

## Example Conversations

> **"What Copilot models do I have access to?"**
> → Calls `list_models`, returns all models with context limits and pricing.

> **"Ask GPT-5 to explain the difference between TCP and UDP."**
> → Calls `query` with `model: "gpt-5"`.

> **"Use Claude Sonnet to review this code and suggest improvements."**
> → Calls `query` with `model: "claude-sonnet-4.6"` and the code as the prompt.

> **"What's in this screenshot?"**
> → Calls `query` with a `blob` attachment containing the image.

> **"Get a second opinion from Codex on this algorithm."**
> → Calls `query` with `model: "gpt-5.3-codex"`.

---

## Development

### Project structure

```
mcp-github-copilot/
├── src/
│   └── index.ts        # MCP server — all tools in one file
├── dist/               # Compiled output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Scripts

| Script                | Description                             |
| --------------------- | --------------------------------------- |
| `npm run build`       | Compile TypeScript to `dist/`           |
| `npm run build:watch` | Watch mode                              |
| `npm run dev`         | Run directly via tsx (no build needed)  |
| `npm test`            | Run tests                               |
| `npm run test:watch`  | Watch mode tests                        |
| `npm run coverage`    | Test coverage report                    |
| `npm run inspect`     | Open MCP Inspector against built server |
| `npm run inspect:dev` | Open MCP Inspector via tsx              |
| `npm run typecheck`   | Type-check without emitting             |
| `npm run clean`       | Remove `dist/`                          |

### Dev workflow

```bash
git clone https://github.com/kud/mcp-github-copilot.git
cd mcp-github-copilot
npm install
npm run build
npm test
```

Use the MCP Inspector to test tools interactively:

```bash
npm run inspect
# Opens http://localhost:5173
```

---

## How it works

This MCP server bridges your AI assistant and GitHub Copilot via the official `@github/copilot-sdk`:

1. On startup, it spawns the Copilot CLI server and connects via JSON-RPC over stdio
2. Each `query` call creates a fresh Copilot session, sends the prompt (with optional attachments), collects the response, then disconnects
3. `list_models` queries the CLI for available models — results are cached automatically to avoid rate limiting
4. Authentication is handled entirely by the Copilot CLI — log in once with `gh auth login` and this MCP inherits it

---

## Troubleshooting

**Server not showing in the MCP list**

- Ensure the Copilot CLI extension is installed: `gh extension list`
- Check Node.js version: `node --version` (must be ≥ 20)
- Try running manually: `npx @kud/mcp-github-copilot`

**Authentication errors**

- Run `gh auth status` to verify you're logged in
- Run `gh copilot --version` to confirm the extension is available

**"Model not found" errors**

- Use `list_models` to see your available models — only models enabled on your subscription will appear

**MCP Inspector logs**

```bash
npm run inspect
```

---

## Security best practices

- ✅ No API keys to manage — credentials live in your `gh` CLI auth store
- ✅ Never commit `.mcp.json` (gitignored by default)
- ✅ Use `GITHUB_TOKEN` env var if you need to override the logged-in user

---

## Tech Stack

|                   |                                   |
| ----------------- | --------------------------------- |
| **Runtime**       | Node.js ≥ 20                      |
| **Language**      | TypeScript 5+ (ESM)               |
| **Protocol**      | Model Context Protocol (MCP) 1.27 |
| **Copilot SDK**   | `@github/copilot-sdk`             |
| **Schema**        | Zod                               |
| **Tests**         | Vitest                            |
| **Module System** | ESM (`"type": "module"`)          |

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-change`
3. Make your changes and add tests
4. Run `npm run build && npm test`
5. Open a pull request

---

## License

MIT — see [LICENSE](LICENSE).

---

## Acknowledgments

Built on top of the [official GitHub Copilot SDK](https://github.com/github/copilot-sdk) and the [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic.

---

## Resources

- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [@kud/mcp-github-copilot on npm](https://www.npmjs.com/package/@kud/mcp-github-copilot)

---

## Support

- 🐛 [Report a bug](https://github.com/kud/mcp-github-copilot/issues)
- 💡 [Request a feature](https://github.com/kud/mcp-github-copilot/issues)

---

<div align="center">

Made with ❤️ for GitHub Copilot users

⭐ Star this repo if it's useful to you · [↑ Back to top](#)

</div>
