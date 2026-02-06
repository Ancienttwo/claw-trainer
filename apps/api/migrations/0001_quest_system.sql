-- Quest System: sessions, quests, notifications

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  twitter_id TEXT NOT NULL UNIQUE,
  twitter_handle TEXT NOT NULL,
  twitter_avatar TEXT NOT NULL DEFAULT '',
  wallet TEXT,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_wallet ON sessions(wallet);

CREATE TABLE quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  publisher_role TEXT NOT NULL CHECK(publisher_role IN ('agent', 'trainer')),
  publisher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_capabilities TEXT NOT NULL DEFAULT '',
  reward_points INTEGER NOT NULL DEFAULT 0,
  acceptable_by TEXT NOT NULL CHECK(acceptable_by IN ('agent', 'human')),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
  accepted_by TEXT,
  accepted_by_role TEXT CHECK(accepted_by_role IN ('agent', 'trainer')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_quests_publisher ON quests(publisher_role, publisher_id);
CREATE INDEX idx_quests_acceptable_by ON quests(acceptable_by);

CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_role TEXT NOT NULL CHECK(recipient_role IN ('agent', 'trainer')),
  recipient_id TEXT NOT NULL,
  type TEXT NOT NULL,
  quest_id INTEGER REFERENCES quests(id),
  message TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_role, recipient_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_role, recipient_id, read);
