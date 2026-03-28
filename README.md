# mcp-github-copilot

MCP server for GitHub Copilot — query any Copilot model programmatically via the official [`@github/copilot-sdk`](https://github.com/github/copilot-sdk).

## Requirements

- Node.js >= 20
- GitHub Copilot subscription
- GitHub Copilot CLI installed and authenticated (`gh auth login` + `gh extension install github/gh-copilot`)

## Installation

```bash
npm install -g @kud/mcp-github-copilot
```

## Tools

### `query`

Send a prompt to GitHub Copilot and get a response.

| Parameter     | Type   | Required | Description                                                               |
| ------------- | ------ | -------- | ------------------------------------------------------------------------- |
| `prompt`      | string | yes      | The prompt to send                                                        |
| `model`       | string | no       | Model ID (e.g. `gpt-5`, `claude-sonnet-4.6`). Defaults to Copilot default |
| `attachments` | array  | no       | File or image attachments (see below)                                     |

**Attachment types:**

```json
{ "type": "file", "path": "/absolute/path/to/file.ts" }
{ "type": "blob", "data": "<base64>", "mimeType": "image/png" }
```

Vision-capable models (all Claude and GPT-5+ variants) will process image attachments.

### `list_models`

Returns all available Copilot models with their capabilities, context limits, and billing multipliers.

## Claude Desktop setup

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github-copilot": {
      "command": "mcp-github-copilot"
    }
  }
}
```

Or with `npx` (no global install needed):

```json
{
  "mcpServers": {
    "github-copilot": {
      "command": "npx",
      "args": ["-y", "@kud/mcp-github-copilot"]
    }
  }
}
```

## Development

```bash
npm install
npm run dev        # run from source with tsx
npm run build      # compile to dist/
npm test           # run tests
npm run typecheck  # type-check without emitting
```

## License

MIT
