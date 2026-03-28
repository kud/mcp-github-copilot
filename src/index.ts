#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CopilotClient, approveAll } from "@github/copilot-sdk"
import { z } from "zod"

const client = new CopilotClient()

export const ok = (data: unknown) => ({
  content: [
    {
      type: "text" as const,
      text: typeof data === "string" ? data : JSON.stringify(data, null, 2),
    },
  ],
})

export const err = (msg: string) => ({
  content: [{ type: "text" as const, text: `Error: ${msg}` }],
})

// ─── Query ───

export const query = async ({
  prompt,
  model,
}: {
  prompt: string
  model?: string
}) => {
  try {
    const session = await client.createSession({
      ...(model ? { model } : {}),
      onPermissionRequest: approveAll,
    })

    const chunks: string[] = []

    const result = await new Promise<string>((resolve, reject) => {
      session.on("assistant.message", (event) => {
        chunks.push(event.data.content)
      })
      session.on("session.idle", () => {
        resolve(chunks.join(""))
      })
      session.on("session.error" as never, (event: unknown) => {
        reject(new Error(String(event)))
      })
      session.send({ prompt }).catch(reject)
    })

    await session.disconnect()
    return ok(result)
  } catch (e) {
    return err(e instanceof Error ? e.message : String(e))
  }
}

// ─── List Models ───

export const listModels = async () => {
  try {
    const session = await client.createSession({
      onPermissionRequest: approveAll,
    })
    const models = await (
      session as unknown as { listModels?: () => Promise<unknown> }
    ).listModels?.()
    await session.disconnect()
    return models
      ? ok(models)
      : err("listModels not supported by this CLI version")
  } catch (e) {
    return err(e instanceof Error ? e.message : String(e))
  }
}

const server = new McpServer({ name: "mcp-github-copilot", version: "1.0.0" })

// ─── Query ───
server.registerTool(
  "query",
  {
    description:
      "Send a prompt to GitHub Copilot and return the response. Uses logged-in Copilot CLI credentials automatically.",
    inputSchema: {
      prompt: z.string().describe("The prompt to send to Copilot"),
      model: z
        .string()
        .optional()
        .describe(
          "Model to use (e.g. gpt-5, gpt-5.3-codex, claude-sonnet-4.5). Defaults to Copilot default.",
        ),
    },
  },
  query,
)

// ─── List Models ───
server.registerTool(
  "list_models",
  {
    description: "List available Copilot models.",
    inputSchema: {},
  },
  listModels,
)

const main = async () => {
  await client.start()
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("mcp-github-copilot running")
}

process.on("SIGINT", async () => {
  await client.stop()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  await client.stop()
  process.exit(0)
})

main().catch((e) => {
  console.error("Fatal:", e)
  process.exit(1)
})
