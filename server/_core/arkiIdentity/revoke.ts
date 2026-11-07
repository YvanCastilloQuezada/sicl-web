/**
 * ARKI Identity — revocación de sesiones.
 */
import { getDb } from "./storage";
import { hashToken, isValidTokenFormat } from "./issuer";

export function revokeByToken(token: unknown): boolean {
  if (!isValidTokenFormat(token)) return false;
  const db = getDb();
  const tokenHash = hashToken(token);
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `UPDATE arki_identity_sessions
          SET revoked_at = ?
        WHERE token_hash = ?
          AND revoked_at IS NULL`,
    )
    .run(now, tokenHash);

  if (result.changes === 0) return false;

  const row = db
    .prepare("SELECT session_id, client_id FROM arki_identity_sessions WHERE token_hash = ? LIMIT 1")
    .get(tokenHash) as { session_id: string; client_id: string } | undefined;
  if (row) {
    db.prepare(
      `INSERT INTO arki_identity_audit (session_id, client_id, action, detail) VALUES (?, ?, 'revoke', 'by_token')`,
    ).run(row.session_id, row.client_id);
  }
  return true;
}

export function revokeBySessionId(sessionId: string): boolean {
  if (!sessionId || typeof sessionId !== "string") return false;
  const db = getDb();
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `UPDATE arki_identity_sessions
          SET revoked_at = ?
        WHERE session_id = ?
          AND revoked_at IS NULL`,
    )
    .run(now, sessionId);
  if (result.changes === 0) return false;
  const row = db
    .prepare("SELECT client_id FROM arki_identity_sessions WHERE session_id = ? LIMIT 1")
    .get(sessionId) as { client_id: string } | undefined;
  db.prepare(
    `INSERT INTO arki_identity_audit (session_id, client_id, action, detail) VALUES (?, ?, 'revoke', 'by_session')`,
  ).run(sessionId, row?.client_id ?? null);
  return true;
}
