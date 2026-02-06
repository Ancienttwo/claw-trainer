import { Hono } from "hono"
import { eq, like, desc, or } from "drizzle-orm"
import { agents } from "../db/schema"
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
