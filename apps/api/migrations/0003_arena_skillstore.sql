-- Arena: Bets
CREATE TABLE IF NOT EXISTS `bets` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `agent_token_id` text NOT NULL,
  `wallet_address` text NOT NULL,
  `market_slug` text NOT NULL,
  `market_question` text NOT NULL,
  `clob_token_id` text NOT NULL,
  `direction` text NOT NULL,
  `amount` real NOT NULL,
  `entry_price` real NOT NULL,
  `status` text NOT NULL DEFAULT 'open',
  `payout` real,
  `created_at` text NOT NULL DEFAULT (datetime('now')),
  `settled_at` text
);
CREATE INDEX IF NOT EXISTS `idx_bets_agent` ON `bets` (`agent_token_id`);
CREATE INDEX IF NOT EXISTS `idx_bets_status` ON `bets` (`status`);
CREATE INDEX IF NOT EXISTS `idx_bets_wallet` ON `bets` (`wallet_address`);

-- Arena: Faucet Balances
CREATE TABLE IF NOT EXISTS `faucet_balances` (
  `agent_token_id` text PRIMARY KEY NOT NULL,
  `wallet_address` text NOT NULL,
  `balance` real NOT NULL DEFAULT 0,
  `last_claim_at` text
);

-- Arena: Leaderboard Snapshots
CREATE TABLE IF NOT EXISTS `leaderboard_snapshots` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `agent_token_id` text NOT NULL,
  `date` text NOT NULL,
  `total_pnl` real NOT NULL DEFAULT 0,
  `win_rate` real NOT NULL DEFAULT 0,
  `total_bets` integer NOT NULL DEFAULT 0,
  `rank` integer
);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_leaderboard_agent_date` ON `leaderboard_snapshots` (`agent_token_id`, `date`);

-- Skill Store: Skills
CREATE TABLE IF NOT EXISTS `skills` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `name` text NOT NULL,
  `description` text NOT NULL DEFAULT '',
  `author_address` text NOT NULL,
  `price` real NOT NULL DEFAULT 0,
  `r2_key` text NOT NULL,
  `file_size` integer NOT NULL DEFAULT 0,
  `download_count` integer NOT NULL DEFAULT 0,
  `rating` real NOT NULL DEFAULT 0,
  `version` text NOT NULL DEFAULT '1.0.0',
  `tags` text NOT NULL DEFAULT '',
  `status` text NOT NULL DEFAULT 'active',
  `created_at` text NOT NULL DEFAULT (datetime('now')),
  `updated_at` text NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS `idx_skills_author` ON `skills` (`author_address`);
CREATE INDEX IF NOT EXISTS `idx_skills_status` ON `skills` (`status`);
CREATE INDEX IF NOT EXISTS `idx_skills_tags` ON `skills` (`tags`);

-- Skill Store: Purchases
CREATE TABLE IF NOT EXISTS `skill_purchases` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `skill_id` integer NOT NULL,
  `buyer_address` text NOT NULL,
  `agent_token_id` text,
  `price_paid` real NOT NULL DEFAULT 0,
  `download_expires_at` text,
  `created_at` text NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS `idx_purchases_skill` ON `skill_purchases` (`skill_id`);
CREATE INDEX IF NOT EXISTS `idx_purchases_buyer` ON `skill_purchases` (`buyer_address`);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_purchases_unique` ON `skill_purchases` (`skill_id`, `buyer_address`);
