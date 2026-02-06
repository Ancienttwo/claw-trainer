/**
 * Decodes on-chain base64 data URIs (Nouns DAO pattern) into structured metadata.
 */

const DATA_URI_PREFIX = "data:application/json;base64,"
const NFA_NAME_PREFIX = "NFA: "

export interface NfaAttribute {
  trait_type: string
  value: string | number
}

export interface NfaMetadata {
  name: string
  description: string
  attributes: NfaAttribute[]
}

export function decodeTokenUri(dataUri: string): NfaMetadata {
  const base64 = dataUri.replace(DATA_URI_PREFIX, "")
  const json = atob(base64)
  return JSON.parse(json) as NfaMetadata
}

function findAttribute(
  metadata: NfaMetadata,
  traitType: string,
): NfaAttribute | undefined {
  return metadata.attributes.find((a) => a.trait_type === traitType)
}

export function getAgentName(metadata: NfaMetadata): string {
  return metadata.name.startsWith(NFA_NAME_PREFIX)
    ? metadata.name.slice(NFA_NAME_PREFIX.length)
    : metadata.name
}

export function getCapabilities(metadata: NfaMetadata): string[] {
  const attr = findAttribute(metadata, "Capabilities")
  if (!attr || typeof attr.value !== "string") return []
  return attr.value.split(",").map((s) => s.trim())
}

export function getLevel(metadata: NfaMetadata): number {
  const attr = findAttribute(metadata, "Level")
  return typeof attr?.value === "number" ? attr.value : 1
}

export function getStage(metadata: NfaMetadata): string {
  const attr = findAttribute(metadata, "Stage")
  return typeof attr?.value === "string" ? attr.value : "Rookie"
}

export function getVersion(metadata: NfaMetadata): string {
  const attr = findAttribute(metadata, "Version")
  return typeof attr?.value === "string" ? attr.value : "1.0.0"
}
