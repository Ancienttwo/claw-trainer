-- Dual-entry auth: Agent can autonomously claim faucet, place bets, purchase skills
-- using their agentWallet keypair signature.

-- 1. Unique index on agent_wallet for agentAuth lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_agents_agent_wallet ON agents(agent_wallet);

-- 2. Source column to track human vs agent-initiated bets
ALTER TABLE bets ADD COLUMN source TEXT NOT NULL DEFAULT 'human';

-- 3. Index on source for leaderboard autonomy ratio query
CREATE INDEX IF NOT EXISTS idx_bets_source ON bets(source);
