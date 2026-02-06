/**
 * On-chain base64 tokenURI builder (Nouns DAO pattern).
 * Encodes ERC-721 metadata as a data URI.
 */

import type { AgentConfig } from "@contracts/modules/nfa-mint"

const INITIAL_STAGE = "Rookie"
const INITIAL_LEVEL = 1

interface TokenMetadata {
  name: string
  description: string
  attributes: ReadonlyArray<{ trait_type: string; value: string | number }>
}

function buildMetadata(config: AgentConfig): TokenMetadata {
  return {
    name: `NFA: ${config.name}`,
    description: "Non-Fungible Agent on ClawTrainer.ai",
    attributes: [
      { trait_type: "Version", value: config.version },
      { trait_type: "Capabilities", value: config.capabilities.join(", ") },
      { trait_type: "Stage", value: INITIAL_STAGE },
      { trait_type: "Level", value: INITIAL_LEVEL },
    ],
  }
}

export function buildTokenUri(config: AgentConfig): string {
  const metadata = buildMetadata(config)
  const json = JSON.stringify(metadata)
  const base64 = btoa(json)
  return `data:application/json;base64,${base64}`
}
