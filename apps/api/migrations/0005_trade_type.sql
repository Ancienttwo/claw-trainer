ALTER TABLE bets ADD COLUMN trade_type TEXT NOT NULL DEFAULT 'paper';
CREATE INDEX IF NOT EXISTS idx_bets_market_slug ON bets(market_slug);
CREATE INDEX IF NOT EXISTS idx_bets_trade_type ON bets(trade_type);
