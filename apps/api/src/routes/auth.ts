import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { verifyMessage, type Address } from "viem"
import { sessions } from "../db/schema"
import { sessionAuth } from "../middleware/session-auth"
import type { AppEnv } from "../types"

const SESSION_DURATION_DAYS = 7

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

export const authRoutes = new Hono<AppEnv>()

authRoutes.get("/twitter", (c) => {
  const state = generateToken().slice(0, 16)
  return c.json({ url: `/api/auth/twitter/callback?state=${state}&mock=true` })
})

authRoutes.get("/twitter/callback", async (c) => {
  const handle = c.req.query("handle") ?? `trainer_${Date.now().toString(36)}`
  const avatar = c.req.query("avatar") ?? ""
  const twitterId = c.req.query("twitter_id") ?? `mock_${handle}`
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 86400000).toISOString()

  const db = c.get("db")
  await db
    .insert(sessions)
    .values({ twitterId, twitterHandle: handle, twitterAvatar: avatar, sessionToken: token, expiresAt })
    .onConflictDoUpdate({
      target: sessions.twitterId,
      set: { twitterHandle: handle, sessionToken: token, expiresAt },
    })

  return c.json({ sessionToken: token, expiresAt, user: { twitterId, twitterHandle: handle, twitterAvatar: avatar } })
})

authRoutes.post("/bind-wallet", sessionAuth, async (c) => {
  const auth = c.get("auth")
  if (!auth?.sessionId) return c.json({ error: "Session required" }, 401)

  const body = await c.req.json<{ wallet: string; signature: string; message: string }>()
  const valid = await verifyMessage({
    address: body.wallet as Address,
    message: body.message,
    signature: body.signature as `0x${string}`,
  })
  if (!valid) return c.json({ error: "Invalid signature" }, 401)

  const db = c.get("db")
  await db.update(sessions).set({ wallet: body.wallet.toLowerCase() }).where(eq(sessions.id, auth.sessionId))

  const [session] = await db.select().from(sessions).where(eq(sessions.id, auth.sessionId)).limit(1)
  return c.json({ session })
})

authRoutes.get("/me", sessionAuth, (c) => {
  const auth = c.get("auth")
  if (!auth) return c.json({ session: null })
  return c.json({ auth })
})

authRoutes.post("/logout", sessionAuth, async (c) => {
  const auth = c.get("auth")
  if (auth?.sessionId) {
    const db = c.get("db")
    await db.delete(sessions).where(eq(sessions.id, auth.sessionId))
  }
  return c.json({ ok: true })
})
