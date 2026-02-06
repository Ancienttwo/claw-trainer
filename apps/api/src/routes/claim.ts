import { Hono } from "hono"
import { eq, and, isNull, gt, sql } from "drizzle-orm"
import { claimCodes, trainerAgents, agents } from "../db/schema"
import { walletAuth } from "../middleware/auth"
import { sessionAuth } from "../middleware/session-auth"
import type { AppEnv } from "../types"

const EXPIRY_HOURS = 72
const MAX_ACTIVE_CODES = 5
const CODE_BYTES = 4

export const claimRoutes = new Hono<AppEnv>()

function generateCode(): string {
  const bytes = new Uint8Array(CODE_BYTES)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

function expiresAt(): string {
  return new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000).toISOString()
}

// POST /claim/codes — wallet auth, agent creates a claim code
claimRoutes.post("/codes", walletAuth, async (c) => {
  const wallet = c.req.header("x-wallet-address")!
  const body = await c.req.json<{ tokenId: string }>()
  const db = c.get("db")

  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.tokenId, body.tokenId))
    .limit(1)

  if (!agent) return c.json({ error: "Agent not found" }, 404)

  if (agent.agentWallet.toLowerCase() !== wallet.toLowerCase()) {
    return c.json({ error: "Wallet does not own this agent" }, 403)
  }

  const activeCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(claimCodes)
    .where(
      and(
        eq(claimCodes.agentWallet, wallet.toLowerCase()),
        isNull(claimCodes.claimedByTwitter),
        gt(claimCodes.expiresAt, new Date().toISOString()),
      ),
    )

  if (activeCount[0].count >= MAX_ACTIVE_CODES) {
    return c.json({ error: "Max active codes reached (5)" }, 429)
  }

  const code = generateCode()
  const expires = expiresAt()

  await db.insert(claimCodes).values({
    code,
    tokenId: body.tokenId,
    agentWallet: wallet.toLowerCase(),
    expiresAt: expires,
  })

  return c.json({ code, url: `/claim/${code}`, expiresAt: expires }, 201)
})

// GET /claim/codes/:code — public, returns code status + agent preview
claimRoutes.get("/codes/:code", async (c) => {
  const code = c.req.param("code")
  const db = c.get("db")

  const [row] = await db
    .select()
    .from(claimCodes)
    .where(eq(claimCodes.code, code))
    .limit(1)

  if (!row) return c.json({ error: "Code not found" }, 404)

  const status = resolveStatus(row)

  const [agent] = await db
    .select({
      name: agents.name,
      level: agents.level,
      stage: agents.stage,
      capabilities: agents.capabilities,
    })
    .from(agents)
    .where(eq(agents.tokenId, row.tokenId))
    .limit(1)

  return c.json({ status, agent: agent ?? null, expiresAt: row.expiresAt })
})

function resolveStatus(row: { claimedByTwitter: string | null; expiresAt: string }): string {
  if (row.claimedByTwitter) return "claimed"
  if (new Date(row.expiresAt) < new Date()) return "expired"
  return "valid"
}

// POST /claim/redeem — session auth, trainer claims a code
claimRoutes.post("/redeem", sessionAuth, async (c) => {
  const auth = c.get("auth")
  if (!auth) return c.json({ error: "Authentication required" }, 401)

  const body = await c.req.json<{ code: string }>()
  const db = c.get("db")

  const result = await db
    .update(claimCodes)
    .set({ claimedByTwitter: auth.id })
    .where(
      and(
        eq(claimCodes.code, body.code),
        isNull(claimCodes.claimedByTwitter),
        gt(claimCodes.expiresAt, new Date().toISOString()),
      ),
    )
    .returning()

  if (result.length === 0) {
    return c.json({ error: "Code already claimed or expired" }, 409)
  }

  const claimed = result[0]

  await db
    .insert(trainerAgents)
    .values({
      twitterId: auth.id,
      tokenId: claimed.tokenId,
      claimCode: body.code,
    })
    .onConflictDoNothing()

  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.tokenId, claimed.tokenId))
    .limit(1)

  return c.json({ ok: true, agent: agent ?? null })
})

// GET /claim/my-agents — session auth, list trainer's claimed agents
claimRoutes.get("/my-agents", sessionAuth, async (c) => {
  const auth = c.get("auth")
  if (!auth) return c.json({ error: "Authentication required" }, 401)

  const rows = await c.get("db")
    .select({
      tokenId: agents.tokenId,
      name: agents.name,
      owner: agents.owner,
      agentWallet: agents.agentWallet,
      level: agents.level,
      stage: agents.stage,
      capabilities: agents.capabilities,
      version: agents.version,
      claimedAt: trainerAgents.claimedAt,
    })
    .from(trainerAgents)
    .innerJoin(agents, eq(trainerAgents.tokenId, agents.tokenId))
    .where(eq(trainerAgents.twitterId, auth.id))

  return c.json({ agents: rows })
})
