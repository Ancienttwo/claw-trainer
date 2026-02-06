/**
 * Address display and linking utilities.
 */

const ADDRESS_PREFIX_LENGTH = 6
const ADDRESS_SUFFIX_LENGTH = 4
const TX_HASH_PREFIX_LENGTH = 10
const TX_HASH_SUFFIX_LENGTH = 8
const BSCSCAN_URL = "https://testnet.bscscan.com"

export function truncateAddress(address: string): string {
  if (address.length <= ADDRESS_PREFIX_LENGTH + ADDRESS_SUFFIX_LENGTH) return address
  return `${address.slice(0, ADDRESS_PREFIX_LENGTH)}...${address.slice(-ADDRESS_SUFFIX_LENGTH)}`
}

export function truncateTxHash(hash: string): string {
  return `${hash.slice(0, TX_HASH_PREFIX_LENGTH)}...${hash.slice(-TX_HASH_SUFFIX_LENGTH)}`
}

export function bscscanAddressUrl(address: string): string {
  return `${BSCSCAN_URL}/address/${address}`
}

export function bscscanTxUrl(hash: string): string {
  return `${BSCSCAN_URL}/tx/${hash}`
}
