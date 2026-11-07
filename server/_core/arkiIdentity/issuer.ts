/**
 * ARKI Identity — emisión de tokens opacos.
 * Reutiliza el formato de arkiLocalSqlSessions: 32 bytes -> base64url (43 chars).
 * Almacena SHA-256(token), nunca el token en claro.
 */
import { randomBytes, createHash, randomUUID } from "node:crypto";
import { getDb, type SessionRow } from "./storage";

const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;

export interface IssuedToken {
  token: string;
  sessionId: string;
  expiresAt: string;
  scopes: string[];
}

export interface IssueOptions {
  userId: string;
  clientId: string;
  scopes: string[];
  ttlSeconds?: number;
}

export function generateOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function isValidTokenFormat(token: unknown): token is string {
  return typeof token === "string" && TOKEN_RE.test(token);
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function defaultTtl(): number {
  const raw = process.env.ARKI_IDENTITY_TOKEN_TTL_SECONDS;
  const n = raw ? Number(raw) : 86400;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 86400;
}

export function issueToken(opts: IssueOptions): IssuedToken {
  if (!opts.userId || typeof opts.userId !== "string") {
    throw new Error("IDENTITY_INVALID_USER");
  }
  if (!opts.clientId || typeof opts.clientId !== "string") {
    throw new Error("IDENTITY_INVALID_CLIENT");
  }
  if (!Array.isArray(opts.scopes) || opts.scopes.length === 0) {
    throw new Error("IDENTITY_INVALID_SCOPES");
  }
  const db = getDb();
  const client = db
    .prepare("SELECT client_id, status FROM arki_identity_clients WHERE client_id = ?")
    .get(opts.clientId) as { client_id: string; status: string } | undefined;
  if (!client) throw new Error("IDENTITY_UNKNOWN_CLIENT");
  if (client.status !== "active") throw new Error("IDENTITY_CLIENT_REVOKED");

  const token = generateOpaqueToken();
  const tokenHash = hashToken(token);
  const sessionId = randomUUID();
  const ttl = opts.ttlSeconds ?? defaultTtl();
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
  const scopesJson = JSON.stringify(opts.scopes);

  db.prepare(
    `INSERT INTO arki_identity_sessions
       (session_id, user_id, client_id, token_hash, scopes, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(sessionId, opts.userId, opts.clientId, tokenHash, scopesJson, expiresAt);

  db.prepare(
    `INSERT INTO arki_identity_audit (session_id, client_id, action, detail)
     VALUES (?, ?, 'issue', ?)`,
  ).run(sessionId, opts.clientId, `scopes=${scopesJson}`);

  return { token, sessionId, expiresAt, scopes: opts.scopes };
}

export function listSessionsForUser(userId: string): SessionRow[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM arki_identity_sessions WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as SessionRow[];
}
