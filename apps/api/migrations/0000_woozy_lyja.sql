CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`wallet` text,
	`token_id` text,
	`metadata` text,
	`block_number` text,
	`tx_hash` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_activities_type` ON `activities` (`type`);--> statement-breakpoint
CREATE INDEX `idx_activities_wallet` ON `activities` (`wallet`);--> statement-breakpoint
CREATE INDEX `idx_activities_created_at` ON `activities` (`created_at`);--> statement-breakpoint
CREATE TABLE `agents` (
	`token_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`owner` text NOT NULL,
	`agent_wallet` text NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`stage` text DEFAULT 'Rookie' NOT NULL,
	`capabilities` text DEFAULT '' NOT NULL,
	`version` text DEFAULT '1.0.0' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`token_uri` text NOT NULL,
	`minted_at` text NOT NULL,
	`block_number` text NOT NULL,
	`tx_hash` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_agents_owner` ON `agents` (`owner`);--> statement-breakpoint
CREATE INDEX `idx_agents_name` ON `agents` (`name`);--> statement-breakpoint
CREATE INDEX `idx_agents_level` ON `agents` (`level`);--> statement-breakpoint
CREATE INDEX `idx_agents_minted_at` ON `agents` (`minted_at`);--> statement-breakpoint
CREATE TABLE `sync_state` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trainers` (
	`wallet` text PRIMARY KEY NOT NULL,
	`agent_count` integer DEFAULT 0 NOT NULL,
	`first_seen` text DEFAULT (datetime('now')) NOT NULL,
	`last_seen` text DEFAULT (datetime('now')) NOT NULL,
	`total_mints` integer DEFAULT 0 NOT NULL
);
