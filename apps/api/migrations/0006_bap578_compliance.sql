-- BAP-578 compliance: new agent columns + reputation table

ALTER TABLE agents ADD COLUMN erc8004_agent_id TEXT;
ALTER TABLE agents ADD COLUMN status TEXT NOT NULL DEFAULT 'Active';
ALTER TABLE agents ADD COLUMN persona TEXT;
ALTER TABLE agents ADD COLUMN experience TEXT;
ALTER TABLE agents ADD COLUMN voice_hash TEXT;
ALTER TABLE agents ADD COLUMN animation_uri TEXT;
ALTER TABLE agents ADD COLUMN vault_uri TEXT;
ALTER TABLE agents ADD COLUMN vault_hash TEXT;
ALTER TABLE agents ADD COLUMN logic_address TEXT;
ALTER TABLE agents ADD COLUMN agent_balance TEXT;
ALTER TABLE agents ADD COLUMN learning_root TEXT;
ALTER TABLE agents ADD COLUMN total_interactions INTEGER NOT NULL DEFAULT 0;
ALTER TABLE agents ADD COLUMN learning_events INTEGER NOT NULL DEFAULT 0;
ALTER TABLE agents ADD COLUMN confidence_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE agents ADD COLUMN learning_velocity INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

CREATE TABLE IF NOT EXISTS reputation_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id TEXT NOT NULL,
  client_address TEXT NOT NULL,
  feedback_index INTEGER NOT NULL,
  value INTEGER NOT NULL,
  value_decimals INTEGER NOT NULL,
  tag1 TEXT,
  tag2 TEXT,
  is_revoked INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reputation_agent ON reputation_feedback(agent_id);
CREATE INDEX IF NOT EXISTS idx_reputation_client ON reputation_feedback(client_address);
