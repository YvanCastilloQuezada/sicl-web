-- ARKI Identity — lockout persistente para login local (F7.3)
-- Se registra cada intento fallido; lockout si >3 en 15 min.

CREATE TABLE IF NOT EXISTS arki_identity_login_attempts (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  username  TEXT NOT NULL,
  ip        TEXT,
  success   INTEGER NOT NULL DEFAULT 0,
  ts        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_user_ts
  ON arki_identity_login_attempts(username, ts);
