import { Hono } from "hono"
import { eq, like, desc, or } from "drizzle-orm"
import { agents, reputationFeedback } from "../db/schema"
import { dualAuth } from "../middleware/dual-auth"
import type { AppEnv } from "../types"

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const SEARCH_LIMIT = 20

function escapeSqlWildcards(input: string): string {
  return input.replace(/[%_]/g, "\\$&")
}

export const agentRoutes = new Hono<AppEnv>()

agentRoutes.get("/", async (c) => {
  const db = c.get("db")
  const page = Math.max(1, Number(c.req.query("page") ?? 1))
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(c.req.query("limit") ?? DEFAULT_PAGE_SIZE)))
  const offset = (page - 1) * limit
  const level = c.req.query("level")
  const stage = c.req.query("stage")

  let query = db.select().from(agents).$dynamic()

  if (level) query = query.where(eq(agents.level, Number(level)))
  if (stage) query = query.where(eq(agents.stage, stage))

  const rows = await query
    .orderBy(desc(agents.mintedAt))
    .limit(limit)
    .offset(offset)

  return c.json({ agents: rows, page, limit })
})

agentRoutes.get("/search", async (c) => {
  const db = c.get("db")
  const q = c.req.query("q")
  if (!q) return c.json({ agents: [] })

  const pattern = `%${escapeSqlWildcards(q)}%`
  const rows = await db
    .select()
    .from(agents)
    .where(or(like(agents.name, pattern), like(agents.capabilities, pattern)))
    .limit(SEARCH_LIMIT)

  return c.json({ agents: rows })
})

agentRoutes.get("/owner/:wallet", async (c) => {
  const db = c.get("db")
  const wallet = c.req.param("wallet").toLowerCase()

  const rows = await db
    .select()
    .from(agents)
    .where(eq(agents.owner, wallet))
    .orderBy(desc(agents.mintedAt))

  return c.json({ agents: rows })
})

agentRoutes.get("/:tokenId", async (c) => {
  const db = c.get("db")
  const tokenId = c.req.param("tokenId")

  if (!/^\d+$/.test(tokenId)) {
    return c.json({ error: "Invalid tokenId format" }, 400)
  }

  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.tokenId, tokenId))
    .limit(1)

  if (!agent) return c.json({ error: "Agent not found" }, 404)
  return c.json({ agent })
})

agentRoutes.get("/:tokenId/reputation", async (c) => {
  const db = c.get("db")
  const tokenId = c.req.param("tokenId")

  if (!/^\d+$/.test(tokenId)) {
    return c.json({ error: "Invalid tokenId format" }, 400)
  }

  const rows = await db
    .select()
    .from(reputationFeedback)
    .where(eq(reputationFeedback.agentId, tokenId))
    .orderBy(desc(reputationFeedback.id))

  return c.json({ feedback: rows })
})

agentRoutes.get("/:tokenId/learning", async (c) => {
  const db = c.get("db")
  const tokenId = c.req.param("tokenId")

  if (!/^\d+$/.test(tokenId)) {
    return c.json({ error: "Invalid tokenId format" }, 400)
  }

  const [agent] = await db
    .select({
      learningRoot: agents.learningRoot,
      totalInteractions: agents.totalInteractions,
      learningEvents: agents.learningEvents,
      confidenceScore: agents.confidenceScore,
      learningVelocity: agents.learningVelocity,
    })
    .from(agents)
    .where(eq(agents.tokenId, tokenId))
    .limit(1)

  if (!agent) return c.json({ error: "Agent not found" }, 404)
  return c.json({ learning: agent })
})

agentRoutes.post("/:tokenId/status", dualAuth, async (c) => {
  const db = c.get("db")
  const tokenId = c.req.param("tokenId")

  if (!/^\d+$/.test(tokenId)) {
    return c.json({ error: "Invalid tokenId format" }, 400)
  }

  const body = await c.req.json<{ status: string }>()
  const validStatuses = ["Active", "Paused", "Terminated"]
  if (!validStatuses.includes(body.status)) {
    return c.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, 400)
  }

  const [agent] = await db
    .select({ tokenId: agents.tokenId, owner: agents.owner })
    .from(agents)
    .where(eq(agents.tokenId, tokenId))
    .limit(1)

  if (!agent) return c.json({ error: "Agent not found" }, 404)

  const auth = c.get("auth")
  if (auth?.role === "trainer" && auth.wallet !== agent.owner) {
    return c.json({ error: "Not the agent owner" }, 403)
  }

  await db
    .update(agents)
    .set({ status: body.status, updatedAt: new Date().toISOString() })
    .where(eq(agents.tokenId, tokenId))

  return c.json({ success: true, status: body.status })
})
