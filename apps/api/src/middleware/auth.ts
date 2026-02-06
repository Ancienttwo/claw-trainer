import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import { verifyMessage, type Address } from "viem"
import type { AppEnv } from "../types"

/**
 * Lightweight wallet auth: client signs a message, server verifies.
 * Headers: x-wallet-address, x-wallet-signature
 * Message format: "clawtrainer:{wallet}:{timestamp}"
 * Timestamp must be within 5 minutes.
 */

const MAX_AGE_MS = 5 * 60 * 1000

function parseMessage(message: string): { wallet: string; timestamp: number } | null {
  const parts = message.split(":")
  if (parts.length !== 3 || parts[0] !== "clawtrainer") return null
  const timestamp = Number(parts[2])
  if (Number.isNaN(timestamp)) return null
  return { wallet: parts[1], timestamp }
}

export const walletAuth = createMiddleware<AppEnv>(async (c, next) => {
  const wallet = c.req.header("x-wallet-address")
  const signature = c.req.header("x-wallet-signature")
  const message = c.req.header("x-wallet-message")

  if (!wallet || !signature || !message) {
    throw new HTTPException(401, { message: "Missing auth headers: x-wallet-address, x-wallet-signature, x-wallet-message" })
  }

  const parsed = parseMessage(message)
  if (!parsed) {
    throw new HTTPException(401, { message: "Invalid message format. Expected: clawtrainer:{wallet}:{timestamp}" })
  }

  if (parsed.wallet.toLowerCase() !== wallet.toLowerCase()) {
    throw new HTTPException(401, { message: "Wallet mismatch between header and signed message" })
  }

  const age = Date.now() - parsed.timestamp
  if (age > MAX_AGE_MS || age < -MAX_AGE_MS) {
    throw new HTTPException(401, { message: "Signature expired" })
  }

  const valid = await verifyMessage({
    address: wallet as Address,
    message,
    signature: signature as `0x${string}`,
  })

  if (!valid) {
    throw new HTTPException(401, { message: "Invalid signature" })
  }

  await next()
})
