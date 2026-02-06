/**
 * Agent config parser and validator.
 * Validates JSON input against the AgentConfig schema.
 */

import { isAddress, type Address } from "viem"
import type {
  AgentConfig,
  ConfigValidationError,
} from "@contracts/modules/nfa-mint"

const NAME_MIN_LENGTH = 1
const NAME_MAX_LENGTH = 32
const NAME_PATTERN = /^[a-zA-Z0-9-]+$/
const VERSION_PATTERN = /^\d+\.\d+\.\d+$/
const CAPABILITIES_MIN = 1
const CAPABILITIES_MAX = 10
const PERSONALITY_MAX_LENGTH = 500
const DOMAIN_KNOWLEDGE_MAX_LENGTH = 2000

type ParseResult =
  | { success: true; data: AgentConfig }
  | { success: false; errors: ConfigValidationError[] }

function validateName(name: unknown): ConfigValidationError | null {
  if (typeof name !== "string") {
    return { field: "name", message: "Name must be a string" }
  }
  if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    return { field: "name", message: `Name must be ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} characters` }
  }
  if (!NAME_PATTERN.test(name)) {
    return { field: "name", message: "Name must be alphanumeric with hyphens only" }
  }
  return null
}

function validateVersion(version: unknown): ConfigValidationError | null {
  if (typeof version !== "string") {
    return { field: "version", message: "Version must be a string" }
  }
  if (!VERSION_PATTERN.test(version)) {
    return { field: "version", message: "Version must be semver format (e.g. 1.0.0)" }
  }
  return null
}

function validateCapabilities(caps: unknown): ConfigValidationError | null {
  if (!Array.isArray(caps)) {
    return { field: "capabilities", message: "Capabilities must be an array" }
  }
  if (caps.length < CAPABILITIES_MIN || caps.length > CAPABILITIES_MAX) {
    return { field: "capabilities", message: `Must have ${CAPABILITIES_MIN}-${CAPABILITIES_MAX} capabilities` }
  }
  const allStrings = caps.every((c: unknown) => typeof c === "string" && c.length > 0)
  if (!allStrings) {
    return { field: "capabilities", message: "Each capability must be a non-empty string" }
  }
  return null
}

function validatePersonality(personality: unknown): ConfigValidationError | null {
  if (typeof personality !== "string" || personality.length === 0) {
    return { field: "personality", message: "Personality must be a non-empty string" }
  }
  if (personality.length > PERSONALITY_MAX_LENGTH) {
    return { field: "personality", message: `Personality must be at most ${PERSONALITY_MAX_LENGTH} characters` }
  }
  return null
}

function validateDomainKnowledge(dk: unknown): ConfigValidationError | null {
  if (typeof dk !== "string" || dk.length === 0) {
    return { field: "domainKnowledge", message: "Domain knowledge must be a non-empty string" }
  }
  if (dk.length > DOMAIN_KNOWLEDGE_MAX_LENGTH) {
    return { field: "domainKnowledge", message: `Domain knowledge must be at most ${DOMAIN_KNOWLEDGE_MAX_LENGTH} characters` }
  }
  return null
}

function validateWallet(wallet: unknown): ConfigValidationError | null {
  if (typeof wallet !== "string") {
    return { field: "walletMapping", message: "Wallet address must be a string" }
  }
  if (!isAddress(wallet)) {
    return { field: "walletMapping", message: "Invalid Ethereum address" }
  }
  return null
}

export function parseAgentConfig(raw: unknown): ParseResult {
  if (typeof raw !== "object" || raw === null) {
    return { success: false, errors: [{ field: "root", message: "Input must be a JSON object" }] }
  }

  const obj = raw as Record<string, unknown>
  const validators = [
    validateName(obj.name),
    validateVersion(obj.version),
    validateCapabilities(obj.capabilities),
    validatePersonality(obj.personality),
    validateDomainKnowledge(obj.domainKnowledge),
    validateWallet(obj.walletMapping),
  ]

  const errors = validators.filter((e): e is ConfigValidationError => e !== null)

  if (errors.length > 0) {
    return { success: false, errors }
  }

  return {
    success: true,
    data: {
      name: obj.name as string,
      version: obj.version as string,
      capabilities: obj.capabilities as string[],
      personality: obj.personality as string,
      domainKnowledge: obj.domainKnowledge as string,
      walletMapping: obj.walletMapping as Address,
    },
  }
}

export function parseAgentConfigFromString(jsonString: string): ParseResult {
  try {
    const parsed: unknown = JSON.parse(jsonString)
    return parseAgentConfig(parsed)
  } catch {
    return { success: false, errors: [{ field: "root", message: "Invalid JSON" }] }
  }
}
