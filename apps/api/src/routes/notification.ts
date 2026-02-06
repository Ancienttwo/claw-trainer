import { Hono } from "hono"
import { eq, and, desc, gt } from "drizzle-orm"
import { notifications } from "../db/schema"
import { sessionAuth } from "../middleware/session-auth"
import { unifiedAuth } from "../middleware/unified-auth"
import type { AppEnv } from "../types"

export const notificationRoutes = new Hono<AppEnv>()

notificationRoutes.get("/", sessionAuth, unifiedAuth, async (c) => {
  const auth = c.get("auth")!
  const since = c.req.query("since")
  const db = c.get("db")

  const conditions = [
    eq(notifications.recipientRole, auth.role),
    eq(notifications.recipientId, auth.id),
  ]

  if (since) conditions.push(gt(notifications.createdAt, since))

  const rows = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(50)

  return c.json({ notifications: rows })
})

notificationRoutes.post("/:id/read", sessionAuth, unifiedAuth, async (c) => {
  const auth = c.get("auth")!
  const id = Number(c.req.param("id"))
  const db = c.get("db")

  const [notif] = await db.select().from(notifications).where(eq(notifications.id, id)).limit(1)
  if (!notif) return c.json({ error: "Notification not found" }, 404)

  if (notif.recipientId !== auth.id || notif.recipientRole !== auth.role) {
    return c.json({ error: "Not your notification" }, 403)
  }

  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id))
  return c.json({ ok: true })
})
