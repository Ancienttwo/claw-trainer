CREATE TABLE claim_codes (
  code TEXT PRIMARY KEY,
  token_id TEXT NOT NULL,
  agent_wallet TEXT NOT NULL,
  claimed_by_twitter TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_claim_codes_token ON claim_codes(token_id);
CREATE INDEX idx_claim_codes_wallet ON claim_codes(agent_wallet);

CREATE TABLE trainer_agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  twitter_id TEXT NOT NULL,
  token_id TEXT NOT NULL,
  claim_code TEXT NOT NULL,
  claimed_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX idx_trainer_agents_unique ON trainer_agents(twitter_id, token_id);
CREATE INDEX idx_trainer_agents_twitter ON trainer_agents(twitter_id);
