import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core"
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

// ─── Quest System Tables ────────────────────────────────

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  twitterId: text("twitter_id").notNull().unique(),
  twitterHandle: text("twitter_handle").notNull(),
  twitterAvatar: text("twitter_avatar").notNull().default(""),
  wallet: text("wallet"),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  index("idx_sessions_token").on(t.sessionToken),
  index("idx_sessions_wallet").on(t.wallet),
])

export const quests = sqliteTable("quests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  publisherRole: text("publisher_role").notNull(),
  publisherId: text("publisher_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requiredCapabilities: text("required_capabilities").notNull().default(""),
  rewardPoints: integer("reward_points").notNull().default(0),
  acceptableBy: text("acceptable_by").notNull(),
  status: text("status").notNull().default("open"),
  acceptedBy: text("accepted_by"),
  acceptedByRole: text("accepted_by_role"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  index("idx_quests_status").on(t.status),
  index("idx_quests_publisher").on(t.publisherRole, t.publisherId),
  index("idx_quests_acceptable_by").on(t.acceptableBy),
])

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipientRole: text("recipient_role").notNull(),
  recipientId: text("recipient_id").notNull(),
  type: text("type").notNull(),
  questId: integer("quest_id"),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  index("idx_notifications_recipient").on(t.recipientRole, t.recipientId),
  index("idx_notifications_unread").on(t.recipientRole, t.recipientId, t.read),
])

// ─── Claim Code Tables ─────────────────────────────────

export const claimCodes = sqliteTable("claim_codes", {
  code: text("code").primaryKey(),
  tokenId: text("token_id").notNull(),
  agentWallet: text("agent_wallet").notNull(),
  claimedByTwitter: text("claimed_by_twitter"),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  index("idx_claim_codes_token").on(t.tokenId),
  index("idx_claim_codes_wallet").on(t.agentWallet),
])

export const trainerAgents = sqliteTable("trainer_agents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  twitterId: text("twitter_id").notNull(),
  tokenId: text("token_id").notNull(),
  claimCode: text("claim_code").notNull(),
  claimedAt: text("claimed_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  uniqueIndex("idx_trainer_agents_unique").on(t.twitterId, t.tokenId),
  index("idx_trainer_agents_twitter").on(t.twitterId),
])
