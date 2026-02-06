import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { agentConfigSchema } from "../schemas/agent"

export const agentRoutes = new Hono()

// POST /api/agent/parse - Parse and validate agent.json
agentRoutes.post("/parse", zValidator("json", agentConfigSchema), (c) => {
	const config = c.req.valid("json")
	return c.json({
		valid: true,
		agent: config,
	})
})

// GET /api/agent/:tokenId - Get agent metadata by tokenId
agentRoutes.get("/:tokenId", (c) => {
	const tokenId = c.req.param("tokenId")
	// TODO: Fetch from contract + IPFS
	return c.json({
		tokenId,
		message: "Not implemented yet",
	})
})
