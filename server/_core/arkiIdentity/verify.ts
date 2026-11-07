/**
 * ARKI Identity — verificación de tokens.
 * Acepta token opaco (43 chars) y devuelve identidad + scopes si válido.
 */
import { getDb } from "./storage";
import { hashToken, isValidTokenFormat } from "./issuer";

export interface VerifiedIdentity {
  sessionId: string;
  userId: string;
  clientId: string;
  scopes: string[];
  expiresAt: string;
}

interface SessionDbRow {
  session_id: string;
  user_id: string;
  client_id: string;
  token_hash: string;
  scopes: string;
  expires_at: string;
  revoked_at: string | null;
}

export function verifyToken(token: unknown): VerifiedIdentity | null {
  if (!isValidTokenFormat(token)) return null;
  const db = getDb();
  const tokenHash = hashToken(token);
  const row = db
    .prepare(
      `SELECT session_id, user_id, client_id, token_hash, scopes, expires_at, revoked_at
         FROM arki_identity_sessions
        WHERE token_hash = ?
        LIMIT 1`,
    )
    .get(tokenHash) as SessionDbRow | undefined;

  if (!row) {
    db.prepare(
      `INSERT INTO arki_identity_audit (client_id, action, detail) VALUES (NULL, 'deny', 'unknown_token')`,
    ).run();
    return null;
  }
  if (row.revoked_at) {
    db.prepare(
      `INSERT INTO arki_identity_audit (session_id, client_id, action, detail) VALUES (?, ?, 'deny', 'revoked')`,
    ).run(row.session_id, row.client_id);
    return null;
  }
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    db.prepare(
      `INSERT INTO arki_identity_audit (session_id, client_id, action, detail) VALUES (?, ?, 'deny', 'expired')`,
    ).run(row.session_id, row.client_id);
    return null;
  }

  let scopes: string[] = [];
  try {
    const parsed = JSON.parse(row.scopes);
    if (Array.isArray(parsed) && parsed.every((s) => typeof s === "string")) {
      scopes = parsed;
    }
  } catch {
    return null;
  }

  db.prepare(
    `INSERT INTO arki_identity_audit (session_id, client_id, action, detail) VALUES (?, ?, 'verify', ?)`,
  ).run(row.session_id, row.client_id, `scopes=${JSON.stringify(scopes)}`);

  return {
    sessionId: row.session_id,
    userId: row.user_id,
    clientId: row.client_id,
    scopes,
    expiresAt: row.expires_at,
  };
}

export function hasScope(identity: VerifiedIdentity, scope: string): boolean {
  return identity.scopes.includes(scope);
}

export function requireScope(identity: VerifiedIdentity, scope: string): void {
  if (!hasScope(identity, scope)) {
    const err = new Error("IDENTITY_FORBIDDEN") as Error & { code?: string };
    err.code = "IDENTITY_FORBIDDEN";
    throw err;
  }
}

/**
 * Forma estable para introspección externa (Bridge, futuros clientes).
 * Nunca incluye el token en claro, el hash, ni datos sensibles del sujeto.
 */
export interface IntrospectResponse {
  valid: boolean;
  subject?: string;
  client_id?: string;
  scopes?: string[];
  expires_at?: string;
}

export function introspect(token: unknown): IntrospectResponse {
  const identity = verifyToken(token);
  if (!identity) return { valid: false };
  return {
    valid: true,
    subject: identity.userId,
    client_id: identity.clientId,
    scopes: identity.scopes,
    expires_at: identity.expiresAt,
  };
}
