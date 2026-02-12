import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core"
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
  // BAP-578 fields
  erc8004AgentId: text("erc8004_agent_id"),
  status: text("status").notNull().default("Active"),
  persona: text("persona"),
  experience: text("experience"),
  voiceHash: text("voice_hash"),
  animationUri: text("animation_uri"),
  vaultUri: text("vault_uri"),
  vaultHash: text("vault_hash"),
  logicAddress: text("logic_address"),
  agentBalance: text("agent_balance"),
  learningRoot: text("learning_root"),
  totalInteractions: integer("total_interactions").notNull().default(0),
  learningEvents: integer("learning_events").notNull().default(0),
  confidenceScore: integer("confidence_score").notNull().default(0),
  learningVelocity: integer("learning_velocity").notNull().default(0),
}, (t) => [
  index("idx_agents_owner").on(t.owner),
  uniqueIndex("idx_agents_agent_wallet").on(t.agentWallet),
  index("idx_agents_name").on(t.name),
  index("idx_agents_level").on(t.level),
  index("idx_agents_minted_at").on(t.mintedAt),
  index("idx_agents_status").on(t.status),
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

// ─── Arena Tables ─────────────────────────────────────

export const bets = sqliteTable("bets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentTokenId: text("agent_token_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  marketSlug: text("market_slug").notNull(),
  marketQuestion: text("market_question").notNull(),
  clobTokenId: text("clob_token_id").notNull(),
  direction: text("direction").notNull(),
  amount: real("amount").notNull(),
  entryPrice: real("entry_price").notNull(),
  source: text("source").notNull().default("human"),
  tradeType: text("trade_type").notNull().default("paper"),
  status: text("status").notNull().default("open"),
  payout: real("payout"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  settledAt: text("settled_at"),
}, (t) => [
  index("idx_bets_agent").on(t.agentTokenId),
  index("idx_bets_status").on(t.status),
  index("idx_bets_source").on(t.source),
  index("idx_bets_wallet").on(t.walletAddress),
  index("idx_bets_market_slug").on(t.marketSlug),
  index("idx_bets_trade_type").on(t.tradeType),
])

export const faucetBalances = sqliteTable("faucet_balances", {
  agentTokenId: text("agent_token_id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  balance: real("balance").notNull().default(0),
  lastClaimAt: text("last_claim_at"),
})

export const leaderboardSnapshots = sqliteTable("leaderboard_snapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentTokenId: text("agent_token_id").notNull(),
  date: text("date").notNull(),
  totalPnl: real("total_pnl").notNull().default(0),
  winRate: real("win_rate").notNull().default(0),
  totalBets: integer("total_bets").notNull().default(0),
  rank: integer("rank"),
}, (t) => [
  uniqueIndex("idx_leaderboard_agent_date").on(t.agentTokenId, t.date),
])

// ─── Skill Store Tables ───────────────────────────────

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  authorAddress: text("author_address").notNull(),
  price: real("price").notNull().default(0),
  r2Key: text("r2_key").notNull(),
  fileSize: integer("file_size").notNull().default(0),
  downloadCount: integer("download_count").notNull().default(0),
  rating: real("rating").notNull().default(0),
  version: text("version").notNull().default("1.0.0"),
  tags: text("tags").notNull().default(""),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  index("idx_skills_author").on(t.authorAddress),
  index("idx_skills_status").on(t.status),
  index("idx_skills_tags").on(t.tags),
])

export const skillPurchases = sqliteTable("skill_purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  skillId: integer("skill_id").notNull(),
  buyerAddress: text("buyer_address").notNull(),
  agentTokenId: text("agent_token_id"),
  pricePaid: real("price_paid").notNull().default(0),
  downloadExpiresAt: text("download_expires_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
}, (t) => [
  index("idx_purchases_skill").on(t.skillId),
  index("idx_purchases_buyer").on(t.buyerAddress),
  uniqueIndex("idx_purchases_unique").on(t.skillId, t.buyerAddress),
])

// ─── BAP-578 Reputation Tables ──────────────────────────

export const reputationFeedback = sqliteTable("reputation_feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentId: text("agent_id").notNull(),
  clientAddress: text("client_address").notNull(),
  feedbackIndex: integer("feedback_index").notNull(),
  value: integer("value").notNull(),
  valueDecimals: integer("value_decimals").notNull(),
  tag1: text("tag1"),
  tag2: text("tag2"),
  isRevoked: integer("is_revoked").notNull().default(0),
  createdAt: text("created_at").notNull(),
}, (t) => [
  index("idx_reputation_agent").on(t.agentId),
  index("idx_reputation_client").on(t.clientAddress),
])
