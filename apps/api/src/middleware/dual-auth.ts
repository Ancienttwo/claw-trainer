import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import { verifyMessage, type Address } from "viem"
import { eq } from "drizzle-orm"
import { agents, sessions } from "../db/schema"
import type { AppEnv } from "../types"

const MAX_AGE_MS = 5 * 60 * 1000

function parseMessage(message: string, prefix: string) {
  const parts = message.split(":")
  if (parts.length !== 3 || parts[0] !== prefix) return null
  const timestamp = Number(parts[2])
  if (Number.isNaN(timestamp)) return null
  return { wallet: parts[1], timestamp }
}

function isTimestampValid(timestamp: number) {
  const age = Date.now() - timestamp
  return age <= MAX_AGE_MS && age >= -MAX_AGE_MS
}

async function verifySignature(wallet: string, message: string, signature: string) {
  return verifyMessage({
    address: wallet as Address,
    message,
    signature: signature as `0x${string}`,
  })
}

/**
 * dualAuth — unified authentication middleware.
 *
 * Resolution order:
 *   1. Bearer token (session) → role: trainer
 *   2. x-agent-* headers (agentWallet signature) → role: agent (skip NFA gate)
 *   3. x-wallet-* headers (trainer wallet signature) → role: trainer + NFA gate inline
 *   4. None → 401
 */
export const dualAuth = createMiddleware<AppEnv>(async (c, next) => {
  const db = c.get("db")

  // 1. Session auth (Bearer token)
  const bearer = c.req.header("authorization")
  const token = bearer?.startsWith("Bearer ") ? bearer.slice(7) : null
  if (token) {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionToken, token))
      .limit(1)

    if (session && new Date(session.expiresAt) >= new Date()) {
      c.set("auth", {
        role: "trainer" as const,
        authMethod: "session" as const,
        id: session.twitterId,
        wallet: session.wallet ?? undefined,
        sessionId: session.id,
      })
      return await next()
    }
  }

  // 2. Agent auth (agentWallet signature)
  const agentWallet = c.req.header("x-agent-address")
  const agentSig = c.req.header("x-agent-signature")
  const agentMsg = c.req.header("x-agent-message")
  if (agentWallet && agentSig && agentMsg) {
    const parsed = parseMessage(agentMsg, "clawtrainer-agent")
    if (parsed && parsed.wallet.toLowerCase() === agentWallet.toLowerCase() && isTimestampValid(parsed.timestamp)) {
      const valid = await verifySignature(agentWallet, agentMsg, agentSig)
      if (valid) {
        const [agent] = await db
          .select({ tokenId: agents.tokenId })
          .from(agents)
          .where(eq(agents.agentWallet, agentWallet.toLowerCase()))
          .limit(1)

        if (agent) {
          c.set("auth", {
            role: "agent" as const,
            authMethod: "agentWallet" as const,
            id: agent.tokenId,
            wallet: agentWallet.toLowerCase(),
          })
          return await next()
        }
      }
    }
  }

  // 3. Wallet auth (trainer wallet signature) + inline NFA gate
  const wallet = c.req.header("x-wallet-address")
  const walletSig = c.req.header("x-wallet-signature")
  const walletMsg = c.req.header("x-wallet-message")
  if (wallet && walletSig && walletMsg) {
    const parsed = parseMessage(walletMsg, "clawtrainer")
    if (parsed && parsed.wallet.toLowerCase() === wallet.toLowerCase() && isTimestampValid(parsed.timestamp)) {
      const valid = await verifySignature(wallet, walletMsg, walletSig)
      if (valid) {
        const [agent] = await db
          .select({ tokenId: agents.tokenId })
          .from(agents)
          .where(eq(agents.owner, wallet.toLowerCase()))
          .limit(1)

        if (!agent) {
          throw new HTTPException(403, { message: "NFA ownership required. Mint your first agent to unlock this feature." })
        }

        c.set("auth", {
          role: "trainer" as const,
          authMethod: "wallet" as const,
          id: agent.tokenId,
          wallet: wallet.toLowerCase(),
        })
        return await next()
      }
    }
  }

  throw new HTTPException(401, { message: "Authentication required" })
})
