/**
 * NFA Mint Module — Interface Contract
 *
 * IMMUTABLE: Changes here require spec update + downstream rewrite.
 *
 * Defines the types and function signatures for the NFA minting flow:
 * parseAgentConfig -> uploadManifest -> mintNFA -> verifyMint
 */

import type { Address, Hash, Hex } from 'viem'

// --- Types ---

/** Raw agent configuration provided by the trainer */
export interface AgentConfig {
  name: string
  version: string
  capabilities: string[]
  personality: string
  domainKnowledge: string
  walletMapping: Address
}

/** Service manifest uploaded to IPFS, referenced by tokenURI */
export interface ServiceManifest {
  name: string
  version: string
  capabilities: string[]
  wallet: Address
  ownerSignature: Hex
}

/** Parameters for the mint transaction */
export interface MintParams {
  agentConfig: AgentConfig
  ownerAddress: Address
  fundAmount: bigint
}

/** Successful mint result */
export interface MintResult {
  tokenId: bigint
  txHash: Hash
  tokenURI: string
  agentWallet: Address
}

/** Validation error returned from parseAgentConfig */
export interface ConfigValidationError {
  field: string
  message: string
}

/** Mint flow step for progress tracking */
export type MintStep =
  | 'parse'
  | 'check-duplicate'
  | 'sign'
  | 'upload'
  | 'mint'
  | 'verify'

/** Structured error from any mint flow step */
export interface MintFlowError {
  step: MintStep
  code: 'INVALID_CONFIG' | 'DUPLICATE_AGENT' | 'INSUFFICIENT_FUNDS' | 'CONTRACT_REVERT' | 'WALLET_DISCONNECTED' | 'UPLOAD_FAILED'
  message: string
  details?: unknown
}

// --- Type Guards ---

export function isAgentConfig(value: unknown): value is AgentConfig {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.name === 'string' &&
    typeof obj.version === 'string' &&
    Array.isArray(obj.capabilities) &&
    obj.capabilities.every((c: unknown) => typeof c === 'string') &&
    typeof obj.personality === 'string' &&
    typeof obj.domainKnowledge === 'string' &&
    typeof obj.walletMapping === 'string' &&
    obj.walletMapping.startsWith('0x')
  )
}

export function isMintResult(value: unknown): value is MintResult {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.tokenId === 'bigint' &&
    typeof obj.txHash === 'string' &&
    typeof obj.tokenURI === 'string' &&
    typeof obj.agentWallet === 'string'
  )
}

// --- Function Signatures ---

/**
 * Parse and validate raw agent configuration input.
 *
 * @param raw - Unknown input to be validated as AgentConfig
 * @returns Validated AgentConfig
 * @throws MintFlowError with code INVALID_CONFIG listing missing/invalid fields
 */
export type ParseAgentConfig = (raw: unknown) => AgentConfig

/**
 * Compute deterministic agentId from name + owner.
 *
 * @param name - Agent name
 * @param owner - Owner wallet address
 * @returns keccak256(name + owner) as bigint tokenId
 */
export type ComputeAgentId = (name: string, owner: Address) => bigint

/**
 * Build and sign a service manifest with EIP-712 owner signature,
 * then upload to IPFS.
 *
 * @param config - Validated agent config
 * @param ownerAddress - Trainer's wallet address (signer)
 * @returns IPFS URI string (ipfs://CID)
 * @throws MintFlowError with code UPLOAD_FAILED
 */
export type UploadManifest = (
  config: AgentConfig,
  ownerAddress: Address,
) => Promise<string>

/**
 * Execute the full mint flow:
 * 1. Parse config
 * 2. Check for duplicate agentId on-chain
 * 3. Estimate gas and check balance
 * 4. Sign EIP-712 and upload manifest to IPFS
 * 5. Send mint transaction to IdentityRegistry
 * 6. Wait for confirmation and return result
 *
 * @param params - Mint parameters (config, owner, fund amount)
 * @returns MintResult on success
 * @throws MintFlowError on any step failure
 */
export type MintNFA = (params: MintParams) => Promise<MintResult>

/**
 * Verify a completed mint by reading on-chain state.
 *
 * @param tokenId - The minted token ID
 * @returns true if token exists, owner matches, and tokenURI is set
 * @throws MintFlowError with code CONTRACT_REVERT if verification read fails
 */
export type VerifyMint = (tokenId: bigint) => Promise<boolean>
