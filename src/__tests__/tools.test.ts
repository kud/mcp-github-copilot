import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSend, mockDisconnect, mockStart, mockStop, mockOn } = vi.hoisted(
  () => ({
    mockSend: vi.fn(),
    mockDisconnect: vi.fn(),
    mockStart: vi.fn(),
    mockStop: vi.fn(),
    mockOn: vi.fn((event: string, handler: (e: unknown) => void) => {
      if (event === "assistant.message")
        setTimeout(
          () => handler({ data: { content: "Hello from Copilot" } }),
          0,
        )
      if (event === "session.idle") setTimeout(() => handler({}), 10)
    }),
  }),
)

vi.mock("@github/copilot-sdk", () => ({
  CopilotClient: class {
    start = mockStart
    stop = mockStop
    createSession = vi.fn().mockResolvedValue({
      on: mockOn,
      send: mockSend,
      disconnect: mockDisconnect,
    })
  },
  approveAll: vi.fn(),
}))

vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  McpServer: class {
    registerTool = vi.fn()
    connect = vi.fn()
  },
}))

vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
  StdioServerTransport: class {},
}))

import { ok, err, query } from "../index.js"

const text = (result: { content: Array<{ text: string }> }) =>
  result.content[0].text

describe("ok / err helpers", () => {
  it("ok wraps string directly", () => {
    expect(text(ok("hello"))).toBe("hello")
  })

  it("ok serializes objects", () => {
    expect(text(ok({ x: 1 }))).toContain('"x": 1')
  })

  it("err prefixes with Error:", () => {
    expect(text(err("oops"))).toBe("Error: oops")
  })
})

describe("query", () => {
  beforeEach(() => {
    mockSend.mockResolvedValue(undefined)
    mockDisconnect.mockResolvedValue(undefined)
    mockStart.mockResolvedValue(undefined)
  })

  it("returns response from assistant.message events", async () => {
    const result = await query({ prompt: "hello" })
    expect(text(result)).toContain("Hello from Copilot")
  })

  it("calls disconnect after response", async () => {
    await query({ prompt: "hello" })
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it("returns error when send rejects", async () => {
    mockSend.mockRejectedValueOnce(new Error("network error"))
    const result = await query({ prompt: "hello" })
    expect(text(result)).toContain("Error:")
  })
})
