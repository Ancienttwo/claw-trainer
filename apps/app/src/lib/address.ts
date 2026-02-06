/**
 * Address display and linking utilities.
 */

const PREFIX_LENGTH = 6
const SUFFIX_LENGTH = 4
const BSCSCAN_URL = "https://bscscan.com"

export function truncateAddress(address: string): string {
  if (address.length <= PREFIX_LENGTH + SUFFIX_LENGTH) return address
  return `${address.slice(0, PREFIX_LENGTH)}...${address.slice(-SUFFIX_LENGTH)}`
}

export function bscscanAddressUrl(address: string): string {
  return `${BSCSCAN_URL}/address/${address}`
}

export function bscscanTxUrl(hash: string): string {
  return `${BSCSCAN_URL}/tx/${hash}`
}
