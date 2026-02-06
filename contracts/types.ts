/**
 * Shared Type Definitions — ClawTrainer.ai
 *
 * IMMUTABLE: Changes here require downstream rewrites
 */

// Agent identity configuration
export interface AgentConfig {
  name: string
  version: string
  capabilities: string[]
  wallet: `0x${string}`
  ownerSignature: string
}

// NFA (Non-Fungible Agent) on-chain data
export interface NFA {
  tokenId: bigint
  agentId: string
  owner: `0x${string}`
  agentWallet: `0x${string}`
  tokenURI: string
  level: number
  reputationScore: number
}

// Molt evolution stages
export type MoltStage = 'rookie' | 'pro' | 'cyber'

// Service manifest stored on IPFS
export interface ServiceManifest {
  name: string
  version: string
  capabilities: string[]
  wallet: `0x${string}`
  ownerSignature: string
}

// Reputation data
export interface ReputationData {
  agentId: string
  exp: number
  level: number
  badges: string[]
  lastUpdated: number
}
