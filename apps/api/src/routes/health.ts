import { Hono } from "hono"
import type { AppEnv } from "../types"

export const healthRoutes = new Hono<AppEnv>()

healthRoutes.get("/", async (c) => {
  const db = c.get("db")
  let dbStatus = "unknown"
  try {
    const result = await c.env.DB.prepare("SELECT 1").first()
    dbStatus = result ? "connected" : "error"
  } catch {
    dbStatus = "error"
  }

  return c.json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    service: "claw-trainer-api",
    db: dbStatus,
    timestamp: new Date().toISOString(),
  })
})
