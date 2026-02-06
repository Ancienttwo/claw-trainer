import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { mintRequestSchema } from "../schemas/mint"

export const mintRoutes = new Hono()

// POST /api/mint/prepare - Prepare mint transaction data
mintRoutes.post("/prepare", zValidator("json", mintRequestSchema), (c) => {
	const { agentConfig, ownerAddress } = c.req.valid("json")

	// TODO: Upload metadata to IPFS, return tokenURI
	// TODO: Encode contract call data

	return c.json({
		tokenURI: "ipfs://placeholder",
		contractAddress: process.env.IDENTITY_REGISTRY_ADDRESS || "0x0",
		ownerAddress,
		agentName: agentConfig.name,
	})
})
