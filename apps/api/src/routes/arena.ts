import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { eq, desc, and, sql } from "drizzle-orm"
import { bets, faucetBalances, agents } from "../db/schema"
import { sessionAuth } from "../middleware/session-auth"
import { unifiedAuth } from "../middleware/unified-auth"
import { nfaGate } from "../middleware/nfa-gate"
import type { AppEnv } from "../types"

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const CACHE_TTL_MS = 60_000
const FAUCET_AMOUNT = 1000
const FAUCET_COOLDOWN_MS = 24 * 60 * 60 * 1000
const USER_AGENT = "Mozilla/5.0 (compatible; ClawTrainer/1.0)"
const GAMMA_MARKETS_PATH = "/markets"
const LEADERBOARD_LIMIT = 50

interface MarketCacheEntry {
  data: unknown
  ts: number
}

interface GammaMarket {
  question: string
  slug: string
  image: string
  outcomePrices: string
  volume24hr: number
  liquidity: number
  endDate: string
  clobTokenIds: string
  active: boolean
}

const marketCache = new Map<string, MarketCacheEntry>()

function getCached(key: string): unknown | null {
  const entry = marketCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    marketCache.delete(key)
    return null
  }
  return entry.data
}

function setCache(key: string, data: unknown) {
  marketCache.set(key, { data, ts: Date.now() })
}

async function fetchGammaJson(url: string): Promise<GammaMarket[] | null> {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
  if (!res.ok) return null
  const ct = res.headers.get("content-type") ?? ""
  if (!ct.includes("application/json")) return null
  return (await res.json()) as GammaMarket[]
}

function parseMarket(raw: GammaMarket) {
  return {
    question: raw.question,
    slug: raw.slug,
    image: raw.image,
    outcomePrices: JSON.parse(raw.outcomePrices) as number[],
    volume24hr: raw.volume24hr,
    liquidity: raw.liquidity,
    endDate: raw.endDate,
    clobTokenIds: JSON.parse(raw.clobTokenIds) as string[],
    active: raw.active,
  }
}

const betBodySchema = z.object({
  agentTokenId: z.string().min(1),
  marketSlug: z.string().min(1),
  marketQuestion: z.string().min(1),
  clobTokenId: z.string().min(1),
  direction: z.enum(["yes", "no"]),
  amount: z.number().positive(),
})

export const arenaRoutes = new Hono<AppEnv>()

arenaRoutes.get("/markets", async (c) => {
  const cached = getCached("markets:active")
  if (cached) return c.json({ markets: cached })

  const url = `${c.env.POLYMARKET_GAMMA_URL}${GAMMA_MARKETS_PATH}?active=true&closed=false&limit=50`
  const raw = await fetchGammaJson(url)
  if (!raw) return c.json({ error: "Polymarket API unavailable" }, 502)

  const markets = raw.map(parseMarket)
  setCache("markets:active", markets)

  return c.json({ markets })
})

arenaRoutes.get("/markets/:slug", async (c) => {
  const slug = c.req.param("slug")
  const cacheKey = `market:${slug}`
  const cached = getCached(cacheKey)
  if (cached) return c.json({ market: cached })

  const url = `${c.env.POLYMARKET_GAMMA_URL}${GAMMA_MARKETS_PATH}?slug=${encodeURIComponent(slug)}`
  const raw = await fetchGammaJson(url)
  if (!raw) return c.json({ error: "Polymarket API unavailable" }, 502)
  if (raw.length === 0) return c.json({ error: "Market not found" }, 404)

  const market = parseMarket(raw[0])
  setCache(cacheKey, market)

  return c.json({ market })
})

arenaRoutes.get("/price/:tokenId", async (c) => {
  const tokenId = c.req.param("tokenId")
  const url = `${c.env.POLYMARKET_CLOB_URL}/price?token_id=${encodeURIComponent(tokenId)}&side=buy`
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
  if (!res.ok) return c.json({ error: "Polymarket CLOB unavailable" }, 502)
  const ct = res.headers.get("content-type") ?? ""
  if (!ct.includes("application/json")) return c.json({ error: "Polymarket CLOB unavailable" }, 502)

  const data: unknown = await res.json()
  return c.json({ price: data })
})

arenaRoutes.post(
  "/bet",
  sessionAuth,
  unifiedAuth,
  nfaGate,
  zValidator("json", betBodySchema),
  async (c) => {
    const auth = c.get("auth")!
    const body = c.req.valid("json")
    const db = c.get("db")

    const [balance] = await db
      .select()
      .from(faucetBalances)
      .where(eq(faucetBalances.agentTokenId, body.agentTokenId))
      .limit(1)

    if (!balance || balance.balance < body.amount) {
      return c.json({ error: "Insufficient faucet balance" }, 400)
    }

    const priceUrl = `${c.env.POLYMARKET_CLOB_URL}/price?token_id=${encodeURIComponent(body.clobTokenId)}&side=buy`
    const priceRes = await fetch(priceUrl, { headers: { "User-Agent": USER_AGENT } })
    if (!priceRes.ok) return c.json({ error: "Failed to fetch entry price" }, 502)
    const priceCt = priceRes.headers.get("content-type") ?? ""
    if (!priceCt.includes("application/json")) return c.json({ error: "Failed to fetch entry price" }, 502)

    const priceData = (await priceRes.json()) as { price: number }
    const entryPrice = priceData.price

    await db
      .update(faucetBalances)
      .set({ balance: sql`${faucetBalances.balance} - ${body.amount}` })
      .where(eq(faucetBalances.agentTokenId, body.agentTokenId))

    const [bet] = await db
      .insert(bets)
      .values({
        agentTokenId: body.agentTokenId,
        walletAddress: auth.wallet!,
        marketSlug: body.marketSlug,
        marketQuestion: body.marketQuestion,
        clobTokenId: body.clobTokenId,
        direction: body.direction,
        amount: body.amount,
        entryPrice,
      })
      .returning()

    return c.json({ bet }, 201)
  },
)

arenaRoutes.get("/bets/:agentId", async (c) => {
  const db = c.get("db")
  const agentId = c.req.param("agentId")
  const page = Math.max(1, Number(c.req.query("page") ?? 1))
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(c.req.query("limit") ?? DEFAULT_PAGE_SIZE)))
  const status = c.req.query("status")

  const conditions = [eq(bets.agentTokenId, agentId)]
  if (status) conditions.push(eq(bets.status, status))

  const rows = await db
    .select()
    .from(bets)
    .where(and(...conditions))
    .orderBy(desc(bets.createdAt))
    .limit(limit)
    .offset((page - 1) * limit)

  return c.json({ bets: rows, page, limit })
})

arenaRoutes.post("/faucet/claim", sessionAuth, unifiedAuth, nfaGate, async (c) => {
  const auth = c.get("auth")!
  const db = c.get("db")
  const agentTokenId = auth.id

  const [existing] = await db
    .select()
    .from(faucetBalances)
    .where(eq(faucetBalances.agentTokenId, agentTokenId))
    .limit(1)

  if (existing?.lastClaimAt) {
    const elapsed = Date.now() - new Date(existing.lastClaimAt).getTime()
    if (elapsed < FAUCET_COOLDOWN_MS) {
      const retryAfterMs = FAUCET_COOLDOWN_MS - elapsed
      return c.json({ error: "Cooldown active", retryAfterMs }, 429)
    }
  }

  const now = new Date().toISOString()
  const newBalance = (existing?.balance ?? 0) + FAUCET_AMOUNT

  if (existing) {
    await db
      .update(faucetBalances)
      .set({ balance: newBalance, lastClaimAt: now })
      .where(eq(faucetBalances.agentTokenId, agentTokenId))
  } else {
    await db.insert(faucetBalances).values({
      agentTokenId,
      walletAddress: auth.wallet!,
      balance: FAUCET_AMOUNT,
      lastClaimAt: now,
    })
  }

  return c.json({ balance: newBalance, claimedAt: now })
})

arenaRoutes.get("/leaderboard", async (c) => {
  const db = c.get("db")

  const rows = await db.all(sql`
    SELECT
      b.agent_token_id AS "agentTokenId",
      a.name AS "agentName",
      a.owner,
      COUNT(*) AS "totalBets",
      SUM(CASE WHEN b.status = 'won' THEN 1 ELSE 0 END) AS "wins",
      ROUND(
        CAST(SUM(CASE WHEN b.status = 'won' THEN 1 ELSE 0 END) AS REAL)
        / NULLIF(SUM(CASE WHEN b.status IN ('won', 'lost') THEN 1 ELSE 0 END), 0),
        4
      ) AS "winRate",
      ROUND(
        SUM(CASE
          WHEN b.status = 'won' THEN COALESCE(b.payout, 0) - b.amount
          WHEN b.status = 'lost' THEN -b.amount
          ELSE 0
        END),
        2
      ) AS "totalPnl"
    FROM ${bets} b
    LEFT JOIN ${agents} a ON b.agent_token_id = a.token_id
    GROUP BY b.agent_token_id
    ORDER BY "totalPnl" DESC
    LIMIT ${LEADERBOARD_LIMIT}
  `)

  return c.json({ leaderboard: rows })
})
