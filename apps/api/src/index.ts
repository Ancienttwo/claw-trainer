import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { dbMiddleware } from "./middleware/db"
import { agentRoutes } from "./routes/agent"
import { trainerRoutes } from "./routes/trainer"
import { activityRoutes } from "./routes/activity"
import { syncRoutes } from "./routes/sync"
import { healthRoutes } from "./routes/health"
import { authRoutes } from "./routes/auth"
import { questRoutes } from "./routes/quest"
import { notificationRoutes } from "./routes/notification"
import { claimRoutes } from "./routes/claim"
import { syncEvents } from "./services/indexer"
import { createDb } from "./db/client"
import type { AppEnv } from "./types"

const app = new Hono<AppEnv>().basePath("/api")

app.use("*", logger())

app.use("*", (c, next) => {
  const origins = c.env.CORS_ORIGINS?.split(",") ?? [
    "http://localhost:5173",
    "http://localhost:4321",
  ]
  return cors({ origin: origins, allowMethods: ["GET", "POST", "PUT", "DELETE"] })(c, next)
})

app.use("*", dbMiddleware)

app.route("/health", healthRoutes)
app.route("/agents", agentRoutes)
app.route("/trainers", trainerRoutes)
app.route("/activities", activityRoutes)
app.route("/sync", syncRoutes)
app.route("/auth", authRoutes)
app.route("/quests", questRoutes)
app.route("/notifications", notificationRoutes)
app.route("/claim", claimRoutes)

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: AppEnv["Bindings"], ctx: ExecutionContext) {
    const db = createDb(env.DB)
    ctx.waitUntil(syncEvents(db, env))
  },
}
