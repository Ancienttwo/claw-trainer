import { z } from "zod"
import { agentConfigSchema } from "./agent"

export const mintRequestSchema = z.object({
	agentConfig: agentConfigSchema,
	ownerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
})

export type MintRequest = z.infer<typeof mintRequestSchema>
