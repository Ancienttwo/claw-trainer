import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"
import { eq } from "drizzle-orm"
import { agents } from "../db/schema"
import type { AppEnv } from "../types"

export const nfaGate = createMiddleware<AppEnv>(async (c, next) => {
  const auth = c.get("auth")
  if (!auth) throw new HTTPException(401, { message: "Authentication required" })

  const wallet = auth.wallet
  if (!wallet) throw new HTTPException(403, { message: "Wallet required for NFA verification" })

  const db = c.get("db")
  const [agent] = await db
    .select({ tokenId: agents.tokenId })
    .from(agents)
    .where(eq(agents.owner, wallet))
    .limit(1)

  if (!agent) {
    throw new HTTPException(403, { message: "NFA ownership required. Mint your first agent to unlock this feature." })
  }

  await next()
})
