import { Hono } from "hono"
import { eq, desc, and } from "drizzle-orm"
import { quests, notifications } from "../db/schema"
import { sessionAuth } from "../middleware/session-auth"
import { unifiedAuth } from "../middleware/unified-auth"
import { nfaGate } from "../middleware/nfa-gate"
import type { AppEnv } from "../types"
import { validateAcceptance, createNotification } from "../services/quest-rules"

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

export const questRoutes = new Hono<AppEnv>()

questRoutes.get("/", async (c) => {
  const db = c.get("db")
  const page = Math.max(1, Number(c.req.query("page") ?? 1))
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(c.req.query("limit") ?? DEFAULT_PAGE_SIZE)))
  const status = c.req.query("status")
  const acceptableBy = c.req.query("acceptableBy")

  let query = db.select().from(quests).$dynamic()

  if (status) query = query.where(eq(quests.status, status))
  if (acceptableBy) query = query.where(eq(quests.acceptableBy, acceptableBy))

  const rows = await query
    .orderBy(desc(quests.createdAt))
    .limit(limit)
    .offset((page - 1) * limit)

  return c.json({ quests: rows, page, limit })
})

questRoutes.get("/:id", async (c) => {
  const db = c.get("db")
  const id = Number(c.req.param("id"))
  if (Number.isNaN(id)) return c.json({ error: "Invalid quest ID" }, 400)

  const [quest] = await db.select().from(quests).where(eq(quests.id, id)).limit(1)
  if (!quest) return c.json({ error: "Quest not found" }, 404)

  return c.json({ quest })
})

questRoutes.post("/", sessionAuth, unifiedAuth, nfaGate, async (c) => {
  const auth = c.get("auth")!
  const body = await c.req.json<{
    title: string
    description: string
    requiredCapabilities: string[]
    rewardPoints: number
    acceptableBy: "agent" | "human"
  }>()

  const db = c.get("db")
  const [quest] = await db
    .insert(quests)
    .values({
      publisherRole: auth.role,
      publisherId: auth.id,
      title: body.title,
      description: body.description,
      requiredCapabilities: body.requiredCapabilities.join(","),
      rewardPoints: body.rewardPoints,
      acceptableBy: body.acceptableBy,
    })
    .returning()

  return c.json({ quest }, 201)
})

questRoutes.post("/:id/accept", sessionAuth, unifiedAuth, nfaGate, async (c) => {
  const auth = c.get("auth")!
  const db = c.get("db")
  const id = Number(c.req.param("id"))

  const [quest] = await db.select().from(quests).where(eq(quests.id, id)).limit(1)
  if (!quest) return c.json({ error: "Quest not found" }, 404)
  if (quest.status !== "open") return c.json({ error: "Quest is not open" }, 400)

  const validation = validateAcceptance(quest, auth)
  if (!validation.valid) return c.json({ error: validation.reason }, 403)

  const [updated] = await db
    .update(quests)
    .set({ status: "in_progress", acceptedBy: auth.id, acceptedByRole: auth.role, updatedAt: new Date().toISOString() })
    .where(and(eq(quests.id, id), eq(quests.status, "open")))
    .returning()

  if (!updated) return c.json({ error: "Quest already accepted" }, 409)

  await createNotification(db, {
    recipientRole: quest.publisherRole,
    recipientId: quest.publisherId,
    type: "quest_accepted",
    questId: id,
    message: `Your quest "${quest.title}" has been accepted`,
  })

  return c.json({ quest: updated })
})

questRoutes.post("/:id/complete", sessionAuth, unifiedAuth, async (c) => {
  const auth = c.get("auth")!
  const db = c.get("db")
  const id = Number(c.req.param("id"))

  const [quest] = await db.select().from(quests).where(eq(quests.id, id)).limit(1)
  if (!quest) return c.json({ error: "Quest not found" }, 404)
  if (quest.status !== "in_progress") return c.json({ error: "Quest is not in progress" }, 400)
  if (quest.acceptedBy !== auth.id) return c.json({ error: "Only the acceptor can complete" }, 403)

  const [updated] = await db
    .update(quests)
    .set({ status: "completed", updatedAt: new Date().toISOString() })
    .where(eq(quests.id, id))
    .returning()

  await createNotification(db, {
    recipientRole: quest.publisherRole,
    recipientId: quest.publisherId,
    type: "quest_completed",
    questId: id,
    message: `Quest "${quest.title}" has been completed`,
  })

  return c.json({ quest: updated })
})

questRoutes.post("/:id/cancel", sessionAuth, unifiedAuth, async (c) => {
  const auth = c.get("auth")!
  const db = c.get("db")
  const id = Number(c.req.param("id"))

  const [quest] = await db.select().from(quests).where(eq(quests.id, id)).limit(1)
  if (!quest) return c.json({ error: "Quest not found" }, 404)
  if (quest.publisherId !== auth.id) return c.json({ error: "Only the publisher can cancel" }, 403)
  if (quest.status === "completed") return c.json({ error: "Cannot cancel a completed quest" }, 400)

  const [updated] = await db
    .update(quests)
    .set({ status: "cancelled", updatedAt: new Date().toISOString() })
    .where(eq(quests.id, id))
    .returning()

  return c.json({ quest: updated })
})
