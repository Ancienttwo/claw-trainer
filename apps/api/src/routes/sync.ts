import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { syncState } from "../db/schema"
import { syncEvents } from "../services/indexer"
import type { AppEnv } from "../types"

export const syncRoutes = new Hono<AppEnv>()

syncRoutes.get("/status", async (c) => {
  const db = c.get("db")

  const [row] = await db
    .select()
    .from(syncState)
    .where(eq(syncState.key, "last_synced_block"))
    .limit(1)

  return c.json({
    lastSyncedBlock: row?.value ?? null,
    timestamp: new Date().toISOString(),
  })
})

syncRoutes.post("/trigger", async (c) => {
  const db = c.get("db")
  const result = await syncEvents(db, c.env)
  return c.json(result)
})
