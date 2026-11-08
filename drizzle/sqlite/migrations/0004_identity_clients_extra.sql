-- ARKI Identity — clientes adicionales y usuario admin inicial
-- Fase OIDC. Idempotente (IF NOT EXISTS / INSERT OR IGNORE).

-- Cliente `deep`: integración IA externa (Deep).
INSERT OR IGNORE INTO arki_identity_clients (client_id, client_name, status)
VALUES ('deep', 'Deep (asistente IA externo)', 'active');

-- Cliente `Yvan_Castillo-cli`: CLI personal del owner.
INSERT OR IGNORE INTO arki_identity_clients (client_id, client_name, status)
VALUES ('Yvan_Castillo-cli', 'CLI de Yvan Castillo', 'active');

-- Usuario admin pre-habilitado. Sin password local (no se puede login con
-- password: password_hash es un marcador). Solo entra por OIDC Gitea,
-- mapeado por email. enabled=1 → puede pedir tokens opacos desde el día 1.
-- El `password_salt`/`password_hash` se rellenan con bytes dummy; el login
-- local por password para este usuario está efectivamente bloqueado porque
-- nadie conoce la password (no se generó a partir de un texto conocido).
INSERT OR IGNORE INTO arki_identity_credentials
  (user_id, username, password_salt, password_hash, enabled)
VALUES (
  'yvan-oidc-bootstrap',
  'Yvan_Castillo@hotmail.com',
  x'00',
  x'00',
  1
);
