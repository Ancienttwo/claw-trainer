/**
 * On-chain base64 tokenURI builder (Nouns DAO pattern).
 * ERC-8004 compliant agentURI JSON format.
 */

import type { AgentConfig } from "@contracts/modules/nfa-mint"

const INITIAL_STAGE = "Rookie"
const INITIAL_LEVEL = 1

interface TokenMetadata {
  name: string
  description: string
  image?: string
  services?: Array<{ type: string; endpoint: string }>
  active: boolean
  attributes: ReadonlyArray<{ trait_type: string; value: string | number }>
}

function buildMetadata(config: AgentConfig): TokenMetadata {
  return {
    name: `NFA: ${config.name}`,
    description: "Non-Fungible Agent on ClawTrainer.ai",
    active: true,
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
  const bytes = new TextEncoder().encode(json)
  const binary = String.fromCodePoint(...bytes)
  const base64 = btoa(binary)
  return `data:application/json;base64,${base64}`
}

/** Build BAP-578 agent metadata struct for activate() call */
export function buildBap578Metadata(config: AgentConfig) {
  return {
    persona: JSON.stringify({
      personality: config.personality,
      domainKnowledge: config.domainKnowledge,
    }),
    experience: `${config.name} v${config.version} - ${config.capabilities.join(", ")}`,
    voiceHash: "",
    animationURI: "",
    vaultURI: "",
    vaultHash: "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  }
}
