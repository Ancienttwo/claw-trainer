import { z } from "zod"

export const agentConfigSchema = z.object({
	name: z.string().min(1).max(64),
	version: z.string().regex(/^\d+\.\d+\.\d+$/),
	capabilities: z.array(z.string()).min(1).max(20),
	wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
	ownerSignature: z.string(),
})

export type AgentConfig = z.infer<typeof agentConfigSchema>
