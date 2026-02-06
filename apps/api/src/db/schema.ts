import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const agents = sqliteTable("agents", {
  tokenId: text("token_id").primaryKey(),
  name: text("name").notNull(),
  owner: text("owner").notNull(),
  agentWallet: text("agent_wallet").notNull(),
  level: integer("level").notNull().default(1),
  stage: text("stage").notNull().default("Rookie"),
  capabilities: text("capabilities").notNull().default(""),
  version: text("version").notNull().default("1.0.0"),
  description: text("description").notNull().default(""),
  tokenUri: text("token_uri").notNull(),
  mintedAt: text("minted_at").notNull(),
  blockNumber: text("block_number").notNull(),
  txHash: text("tx_hash").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  index("idx_agents_owner").on(t.owner),
  index("idx_agents_name").on(t.name),
  index("idx_agents_level").on(t.level),
  index("idx_agents_minted_at").on(t.mintedAt),
])

export const trainers = sqliteTable("trainers", {
  wallet: text("wallet").primaryKey(),
  agentCount: integer("agent_count").notNull().default(0),
  firstSeen: text("first_seen")
    .notNull()
    .default(sql`(datetime('now'))`),
  lastSeen: text("last_seen")
    .notNull()
    .default(sql`(datetime('now'))`),
  totalMints: integer("total_mints").notNull().default(0),
})

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  wallet: text("wallet"),
  tokenId: text("token_id"),
  metadata: text("metadata"),
  blockNumber: text("block_number"),
  txHash: text("tx_hash"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  index("idx_activities_type").on(t.type),
  index("idx_activities_wallet").on(t.wallet),
  index("idx_activities_created_at").on(t.createdAt),
])

export const syncState = sqliteTable("sync_state", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
})
