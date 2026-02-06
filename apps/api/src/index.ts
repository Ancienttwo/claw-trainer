import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { agentRoutes } from "./routes/agent"
import { mintRoutes } from "./routes/mint"
import { healthRoutes } from "./routes/health"

const app = new Hono().basePath("/api")

// Middleware
app.use("*", logger())
app.use(
	"*",
	cors({
		origin: ["http://localhost:5173", "http://localhost:4321"],
		allowMethods: ["GET", "POST", "PUT", "DELETE"],
	}),
)

// Routes
app.route("/health", healthRoutes)
app.route("/agent", agentRoutes)
app.route("/mint", mintRoutes)

const port = Number(process.env.PORT) || 3001

console.log(`ClawTrainer API running on http://localhost:${port}`)

export default {
	port,
	fetch: app.fetch,
}
