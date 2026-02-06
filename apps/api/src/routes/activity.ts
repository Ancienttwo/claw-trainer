import { Hono } from "hono"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { activities } from "../db/schema"
import { walletAuth } from "../middleware/auth"
import type { AppEnv } from "../types"

const trackSchema = z.object({
  type: z.string(),
  wallet: z.string().optional(),
  tokenId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const activityRoutes = new Hono<AppEnv>()

activityRoutes.get("/recent", async (c) => {
  const db = c.get("db")
  const limit = Math.min(50, Math.max(1, Number(c.req.query("limit") ?? 20)))
  const type = c.req.query("type")

  let query = db.select().from(activities).$dynamic()
  if (type) query = query.where(eq(activities.type, type))

  const rows = await query.orderBy(desc(activities.createdAt)).limit(limit)
  return c.json({ activities: rows })
})

activityRoutes.post("/track", walletAuth, zValidator("json", trackSchema), async (c) => {
  const db = c.get("db")
  const body = c.req.valid("json")
  const wallet = c.req.header("x-wallet-address")?.toLowerCase()

  await db.insert(activities).values({
    type: body.type,
    wallet: body.wallet ?? wallet,
    tokenId: body.tokenId,
    metadata: body.metadata ? JSON.stringify(body.metadata) : null,
  })

  return c.json({ ok: true })
})
