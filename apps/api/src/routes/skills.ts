import { Hono } from "hono"
import { eq, desc, and, like, sql } from "drizzle-orm"
import { skills, skillPurchases } from "../db/schema"
import { sessionAuth } from "../middleware/session-auth"
import { unifiedAuth } from "../middleware/unified-auth"
import { dualAuth } from "../middleware/dual-auth"
import type { AppEnv } from "../types"

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const MAX_FILE_BYTES = 10 * 1024 * 1024

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

function parsePagination(query: { page?: string; limit?: string }) {
  const page = Math.max(1, Number(query.page ?? 1))
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(query.limit ?? DEFAULT_PAGE_SIZE)))
  return { page, limit, offset: (page - 1) * limit }
}

export const skillRoutes = new Hono<AppEnv>()

// GET / — Paginated list with filters
skillRoutes.get("/", async (c) => {
  const db = c.get("db")
  const { page, limit, offset } = parsePagination({
    page: c.req.query("page"),
    limit: c.req.query("limit"),
  })
  const tag = c.req.query("tag")
  const author = c.req.query("author")

  const conditions = [eq(skills.status, "active")]
  if (tag) conditions.push(like(skills.tags, `%${tag}%`))
  if (author) conditions.push(eq(skills.authorAddress, author.toLowerCase()))

  const rows = await db
    .select()
    .from(skills)
    .where(and(...conditions))
    .orderBy(desc(skills.createdAt))
    .limit(limit)
    .offset(offset)

  return c.json({ skills: rows, page, limit })
})

// GET /my — Skills I authored
skillRoutes.get("/my", sessionAuth, unifiedAuth, async (c) => {
  const auth = c.get("auth")!
  const db = c.get("db")
  const { page, limit, offset } = parsePagination({
    page: c.req.query("page"),
    limit: c.req.query("limit"),
  })

  const rows = await db
    .select()
    .from(skills)
    .where(eq(skills.authorAddress, (auth.wallet ?? auth.id).toLowerCase()))
    .orderBy(desc(skills.createdAt))
    .limit(limit)
    .offset(offset)

  return c.json({ skills: rows, page, limit })
})

// GET /purchased — Skills I purchased (Human or Agent)
skillRoutes.get("/purchased", dualAuth, async (c) => {
  const auth = c.get("auth")!
  const db = c.get("db")
  const { page, limit, offset } = parsePagination({
    page: c.req.query("page"),
    limit: c.req.query("limit"),
  })

  const rows = await db
    .select({ skill: skills, purchase: skillPurchases })
    .from(skillPurchases)
    .innerJoin(skills, eq(skillPurchases.skillId, skills.id))
    .where(eq(skillPurchases.buyerAddress, (auth.wallet ?? auth.id).toLowerCase()))
    .orderBy(desc(skillPurchases.createdAt))
    .limit(limit)
    .offset(offset)

  return c.json({ purchases: rows, page, limit })
})

// GET /:slug — Single skill detail
skillRoutes.get("/:slug", async (c) => {
  const db = c.get("db")
  const slug = c.req.param("slug")

  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.slug, slug))
    .limit(1)

  if (!skill) return c.json({ error: "Skill not found" }, 404)
  return c.json({ skill })
})

// POST /upload — Upload a new skill (.zip via multipart)
skillRoutes.post("/upload", sessionAuth, unifiedAuth, async (c) => {
  const auth = c.get("auth")!
  const body = await c.req.parseBody()

  const file = body.file
  if (!(file instanceof File)) return c.json({ error: "File is required" }, 400)
  if (file.size > MAX_FILE_BYTES) return c.json({ error: "File exceeds 10MB limit" }, 400)
  if (!file.name.endsWith(".zip")) return c.json({ error: "Only .zip files are allowed" }, 400)

  const name = typeof body.name === "string" ? body.name.trim() : ""
  if (!name) return c.json({ error: "Name is required" }, 400)

  const description = typeof body.description === "string" ? body.description : ""
  const price = Number(body.price ?? 0)
  const tags = typeof body.tags === "string" ? body.tags : ""
  const version = typeof body.version === "string" && body.version ? body.version : "1.0.0"
  const slug = toSlug(name)

  const r2Key = `skills/${slug}/${version}/skill.zip`
  const fileBuffer = await file.arrayBuffer()

  await c.env.SKILLS_BUCKET.put(r2Key, fileBuffer)

  const db = c.get("db")
  const [skill] = await db
    .insert(skills)
    .values({
      slug,
      name,
      description,
      authorAddress: (auth.wallet ?? auth.id).toLowerCase(),
      price,
      r2Key,
      fileSize: file.size,
      version,
      tags,
    })
    .returning()

  return c.json({ skill }, 201)
})

// POST /:id/purchase — Purchase a skill (Human or Agent)
skillRoutes.post("/:id/purchase", dualAuth, async (c) => {
  const auth = c.get("auth")!
  const db = c.get("db")
  const id = Number(c.req.param("id"))
  if (Number.isNaN(id)) return c.json({ error: "Invalid skill ID" }, 400)

  const [skill] = await db.select().from(skills).where(eq(skills.id, id)).limit(1)
  if (!skill) return c.json({ error: "Skill not found" }, 404)

  const buyer = (auth.wallet ?? auth.id).toLowerCase()
  const body = await c.req.json<{ agentTokenId?: string }>().catch((): { agentTokenId?: string } => ({}))

  const [purchase] = await db
    .insert(skillPurchases)
    .values({
      skillId: id,
      buyerAddress: buyer,
      agentTokenId: body.agentTokenId ?? null,
      pricePaid: skill.price,
    })
    .onConflictDoNothing()
    .returning()

  if (!purchase) return c.json({ error: "Already purchased" }, 409)

  await db
    .update(skills)
    .set({ downloadCount: sql`${skills.downloadCount} + 1` })
    .where(eq(skills.id, id))

  return c.json({ purchase }, 201)
})

// GET /:id/download — Download skill zip from R2 (Human or Agent)
skillRoutes.get("/:id/download", dualAuth, async (c) => {
  const auth = c.get("auth")!
  const db = c.get("db")
  const id = Number(c.req.param("id"))
  if (Number.isNaN(id)) return c.json({ error: "Invalid skill ID" }, 400)

  const [skill] = await db.select().from(skills).where(eq(skills.id, id)).limit(1)
  if (!skill) return c.json({ error: "Skill not found" }, 404)

  // Free skills skip purchase check
  if (skill.price > 0) {
    const buyer = (auth.wallet ?? auth.id).toLowerCase()
    const [purchase] = await db
      .select()
      .from(skillPurchases)
      .where(and(eq(skillPurchases.skillId, id), eq(skillPurchases.buyerAddress, buyer)))
      .limit(1)

    if (!purchase) return c.json({ error: "Purchase required" }, 403)
  }

  const object = await c.env.SKILLS_BUCKET.get(skill.r2Key)
  if (!object) return c.json({ error: "File not found in storage" }, 404)

  const filename = `${skill.slug}-${skill.version}.zip`
  return new Response(object.body, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
})
