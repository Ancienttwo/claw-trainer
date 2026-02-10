import { createMiddleware } from "hono/factory"
import { eq } from "drizzle-orm"
import { sessions } from "../db/schema"
import type { AppEnv } from "../types"

export const sessionAuth = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header("authorization")
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null
  if (!token) return await next()

  const db = c.get("db")
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, token))
    .limit(1)

  if (!session) return await next()

  if (new Date(session.expiresAt) < new Date()) return await next()

  c.set("auth", {
    role: "trainer" as const,
    authMethod: "session" as const,
    id: session.twitterId,
    wallet: session.wallet ?? undefined,
    sessionId: session.id,
  })

  await next()
})
