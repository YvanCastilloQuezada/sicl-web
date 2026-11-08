/**
 * @deprecated MO08 legacy. Reemplazado por arkiIdentity/storage.ts (sesiones SQLite).
 * Reemplazo: server/_core/arkiIdentity/storage.ts
 *
 * NO USAR. NO ELIMINAR todavía. Deuda documentada para eliminar
 * tras la fase de reconciliación sicl-web ↔ sicl-core ↔ arki-acs.
 * Ver: server/_core/arkiIdentity/README.md § Deuda técnica
 */
/** MO-08G: transactional, fail-closed local session persistence.
 * Not wired into production authentication. Explicit migration required.
 * Requires mysql2 and an independently provisioned user mapping.
 */
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import mysql from "mysql2/promise";

export const MO08_SESSION_SCHEMA = `CREATE TABLE IF NOT EXISTS arki_local_sessions (
  session_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  revoked_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX arki_local_sessions_user_idx (user_id),
  INDEX arki_local_sessions_exp_idx (expires_at)
) ENGINE=InnoDB`;

export function hashLocalSession(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
export function issueOpaqueLocalToken(): string {
  return randomBytes(32).toString("base64url");
}
export function validLocalToken(token: unknown): token is string {
  return typeof token === "string" && /^[A-Za-z0-9_-]{43}$/.test(token);
}

export class ArkiLocalSqlSessions {
  constructor(private readonly pool: mysql.Pool) {}
  async issue(userId: number, ttlSeconds = 3600): Promise<string> {
    if (!Number.isSafeInteger(userId) || userId < 1 ||
        !Number.isSafeInteger(ttlSeconds) || ttlSeconds < 60 || ttlSeconds > 86400) {
      throw new Error("INVALID_SESSION_PARAMETERS");
    }
    const token = issueOpaqueLocalToken();
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute(
        "INSERT INTO arki_local_sessions (session_hash,user_id,expires_at) VALUES (?,?,DATE_ADD(UTC_TIMESTAMP(3), INTERVAL ? SECOND))",
        [hashLocalSession(token), userId, ttlSeconds],
      );
      await conn.commit();
      return token;
    } catch (error) { await conn.rollback(); throw error; }
    finally { conn.release(); }
  }
  async verify(token: unknown): Promise<number | null> {
    if (!validLocalToken(token)) return null;
    const [rows] = await this.pool.execute<mysql.RowDataPacket[]>(
      "SELECT user_id FROM arki_local_sessions WHERE session_hash=? AND revoked_at IS NULL AND expires_at > UTC_TIMESTAMP(3) LIMIT 1",
      [hashLocalSession(token)],
    );
    return rows.length === 1 && Number.isSafeInteger(rows[0].user_id) ? rows[0].user_id : null;
  }
  async revoke(token: unknown): Promise<boolean> {
    if (!validLocalToken(token)) return false;
    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      "UPDATE arki_local_sessions SET revoked_at=UTC_TIMESTAMP(3) WHERE session_hash=? AND revoked_at IS NULL",
      [hashLocalSession(token)],
    );
    return result.affectedRows === 1;
  }
  async revokeAll(userId: number): Promise<number> {
    if (!Number.isSafeInteger(userId) || userId < 1) throw new Error("INVALID_USER_ID");
    const [result] = await this.pool.execute<mysql.ResultSetHeader>(
      "UPDATE arki_local_sessions SET revoked_at=UTC_TIMESTAMP(3) WHERE user_id=? AND revoked_at IS NULL",
      [userId],
    );
    return result.affectedRows;
  }
}
