#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js"
import type { ServerNotification } from "@modelcontextprotocol/sdk/types.js"
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

type Attachment =
  | { type: "file"; path: string; displayName?: string }
  | { type: "blob"; data: string; mimeType: string; displayName?: string }

export const query = async (
  {
    prompt,
    model,
    attachments,
  }: {
    prompt: string
    model?: string
    attachments?: Attachment[]
  },
  extra?: RequestHandlerExtra<never, ServerNotification>,
) => {
  try {
    const session = await client.createSession({
      ...(model ? { model } : {}),
      onPermissionRequest: approveAll,
    })

    const chunks: string[] = []
    let chunkIndex = 0

    const result = await new Promise<string>((resolve, reject) => {
      session.on("assistant.message", (event) => {
        chunks.push(event.data.content)
        if (extra?._meta?.progressToken !== undefined) {
          extra
            .sendNotification({
              method: "notifications/progress",
              params: {
                progressToken: extra._meta.progressToken,
                progress: ++chunkIndex,
              },
            })
            .catch(() => {})
        }
      })
      session.on("session.idle", () => {
        resolve(chunks.join(""))
      })
      session.on("session.error" as never, (event: unknown) => {
        reject(new Error(String(event)))
      })
      session
        .send({ prompt, ...(attachments ? { attachments } : {}) })
        .catch(reject)
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
    const models = await client.listModels()
    return ok(models)
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
      attachments: z
        .array(
          z.discriminatedUnion("type", [
            z.object({
              type: z.literal("file"),
              path: z.string().describe("Absolute path to the file"),
              displayName: z.string().optional(),
            }),
            z.object({
              type: z.literal("blob"),
              data: z.string().describe("Base64-encoded content"),
              mimeType: z.string().describe("MIME type (e.g. image/png)"),
              displayName: z.string().optional(),
            }),
          ]),
        )
        .optional()
        .describe("File or image attachments to include with the prompt"),
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
