import { createMiddleware } from "hono/factory"
import { verifyMessage, type Address } from "viem"
import { eq } from "drizzle-orm"
import { agents } from "../db/schema"
import type { AppEnv } from "../types"

const MAX_AGE_MS = 5 * 60 * 1000
const PREFIX = "clawtrainer-agent"

function parseAgentMessage(message: string) {
  const parts = message.split(":")
  if (parts.length !== 3 || parts[0] !== PREFIX) return null
  const timestamp = Number(parts[2])
  if (Number.isNaN(timestamp)) return null
  return { wallet: parts[1], timestamp }
}

async function tryAgentAuth(c: {
  req: { header: (name: string) => string | undefined }
  get: (key: "db") => AppEnv["Variables"]["db"]
}) {
  const wallet = c.req.header("x-agent-address")
  const signature = c.req.header("x-agent-signature")
  const message = c.req.header("x-agent-message")
  if (!wallet || !signature || !message) return null

  const parsed = parseAgentMessage(message)
  if (!parsed) return null
  if (parsed.wallet.toLowerCase() !== wallet.toLowerCase()) return null

  const age = Date.now() - parsed.timestamp
  if (age > MAX_AGE_MS || age < -MAX_AGE_MS) return null

  const valid = await verifyMessage({
    address: wallet as Address,
    message,
    signature: signature as `0x${string}`,
  })
  if (!valid) return null

  const db = c.get("db")
  const [agent] = await db
    .select({ tokenId: agents.tokenId })
    .from(agents)
    .where(eq(agents.agentWallet, wallet.toLowerCase()))
    .limit(1)
  if (!agent) return null

  return {
    role: "agent" as const,
    authMethod: "agentWallet" as const,
    id: agent.tokenId,
    wallet: wallet.toLowerCase(),
  }
}

export const agentAuth = createMiddleware<AppEnv>(async (c, next) => {
  const existing = c.get("auth")
  if (existing) return await next()

  const auth = await tryAgentAuth(c)
  if (auth) {
    c.set("auth", auth)
    return await next()
  }

  await next()
})

export { tryAgentAuth }
