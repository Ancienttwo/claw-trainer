import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import { verifyMessage, type Address } from "viem"
import { eq } from "drizzle-orm"
import { agents } from "../db/schema"
import type { AppEnv } from "../types"

const MAX_AGE_MS = 5 * 60 * 1000

function parseWalletMessage(message: string) {
  const parts = message.split(":")
  if (parts.length !== 3 || parts[0] !== "clawtrainer") return null
  const timestamp = Number(parts[2])
  if (Number.isNaN(timestamp)) return null
  return { wallet: parts[1], timestamp }
}

async function tryWalletAuth(c: { req: { header: (name: string) => string | undefined }; get: (key: "db") => AppEnv["Variables"]["db"] }) {
  const wallet = c.req.header("x-wallet-address")
  const signature = c.req.header("x-wallet-signature")
  const message = c.req.header("x-wallet-message")
  if (!wallet || !signature || !message) return null

  const parsed = parseWalletMessage(message)
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
    .select()
    .from(agents)
    .where(eq(agents.owner, wallet.toLowerCase()))
    .limit(1)

  const role = agent ? "agent" as const : "trainer" as const
  const id = agent ? agent.tokenId : wallet.toLowerCase()

  return { role, id, wallet: wallet.toLowerCase() }
}

export const unifiedAuth = createMiddleware<AppEnv>(async (c, next) => {
  const existing = c.get("auth")
  if (existing) return await next()

  const walletAuth = await tryWalletAuth(c)
  if (walletAuth) {
    c.set("auth", walletAuth)
    return await next()
  }

  throw new HTTPException(401, { message: "Authentication required" })
})
