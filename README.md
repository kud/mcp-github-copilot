<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![npm](https://img.shields.io/npm/v/@kud/mcp-github-copilot?style=flat-square&color=CB3837)
![MIT](https://img.shields.io/badge/licence-MIT-22C55E?style=flat-square)

**MCP server for GitHub Copilot — query any Copilot model programmatically via the official SDK.**

<a href="https://kud.io/projects/mcp-github-copilot">Website</a> · <a href="https://kud.io/projects/mcp-github-copilot/docs">Documentation</a>

</div>

## Features

- **No extra API key** — uses your existing GitHub Copilot CLI credentials automatically.
- **Any model** — target GPT-5, Codex, Claude Sonnet, or any model your subscription grants.
- **File and image attachments** — attach local files or base64 blobs alongside a prompt.
- **Model discovery** — list available models with context window limits and billing multipliers.
- **Streaming progress** — sends MCP progress notifications for each streamed chunk.

## Install

```sh
npm install -g @kud/mcp-github-copilot
```

## Usage

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "mcp-github-copilot": {
      "command": "mcp-github-copilot"
    }
  }
}
```

### Tools

| Tool          | Description                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`       | Send a prompt to a Copilot model and return the response. Accepts an optional `model` name and optional `attachments` (file paths or base64 blobs). |
| `list_models` | List all available Copilot models with capabilities, context window limits, and billing multipliers.                                                |

## Development

```sh
git clone https://github.com/kud/mcp-github-copilot.git
cd mcp-github-copilot
npm install
npm run dev
```

📚 **Full documentation → [mcp-github-copilot/docs](https://kud.io/projects/mcp-github-copilot/docs)**
