import { Hono } from "hono"
import { eq, sql } from "drizzle-orm"
import { trainers } from "../db/schema"
import { walletAuth } from "../middleware/auth"
import type { AppEnv } from "../types"

export const trainerRoutes = new Hono<AppEnv>()

trainerRoutes.get("/:wallet", async (c) => {
  const db = c.get("db")
  const wallet = c.req.param("wallet").toLowerCase()

  const [trainer] = await db
    .select()
    .from(trainers)
    .where(eq(trainers.wallet, wallet))
    .limit(1)

  if (!trainer) return c.json({ error: "Trainer not found" }, 404)
  return c.json({ trainer })
})

trainerRoutes.post("/connect", walletAuth, async (c) => {
  const db = c.get("db")
  const wallet = c.req.header("x-wallet-address")!.toLowerCase()
  const now = new Date().toISOString()

  await db
    .insert(trainers)
    .values({ wallet, firstSeen: now, lastSeen: now })
    .onConflictDoUpdate({
      target: trainers.wallet,
      set: { lastSeen: now },
    })

  const [trainer] = await db
    .select()
    .from(trainers)
    .where(eq(trainers.wallet, wallet))
    .limit(1)

  return c.json({ trainer })
})
