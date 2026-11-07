-- ARKI Identity — SQLite única (F1a)
-- Emisión/verificación/revocación de tokens opacos + credenciales locales.
-- NO modifica tablas existentes (users, arki_command_sessions, etc.).
--
-- Nota de diseño:
-- arki_identity_sessions.user_id NO es FK a arki_identity_credentials.
-- Un token puede emitirse para:
--   (a) un usuario local (con credencial en arki_identity_credentials)
--   (b) un usuario de la tabla existente `users` (SICL Web)
--   (c) un sujeto de servicio (ej. 'bridge-local' como client, sin usuario)
-- Forzar la FK rompería los casos (b) y (c).
-- Solo client_id es FK real: todo token pertenece a un cliente registrado.

CREATE TABLE IF NOT EXISTS arki_identity_clients (
  client_id   TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'revoked')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS arki_identity_credentials (
  user_id       TEXT PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  password_salt BLOB NOT NULL,
  password_hash BLOB NOT NULL,
  enabled       INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0,1)),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS arki_identity_sessions (
  session_id  TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  client_id   TEXT NOT NULL,
  token_hash  TEXT NOT NULL UNIQUE,
  scopes      TEXT NOT NULL,
  expires_at  TEXT NOT NULL,
  revoked_at  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES arki_identity_clients(client_id)
);

CREATE INDEX IF NOT EXISTS idx_identity_sessions_token
  ON arki_identity_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_identity_sessions_user
  ON arki_identity_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_identity_sessions_client
  ON arki_identity_sessions(client_id);

CREATE TABLE IF NOT EXISTS arki_identity_audit (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  client_id  TEXT,
  action     TEXT NOT NULL CHECK (action IN ('issue','verify','revoke','deny','login','logout')),
  detail     TEXT,
  ts         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_identity_audit_ts
  ON arki_identity_audit(ts);

-- Cliente seed: bridge-local (el Bridge consultará este token)
INSERT OR IGNORE INTO arki_identity_clients (client_id, client_name, status)
VALUES ('bridge-local', 'ARKI Bridge (loopback)', 'active');
