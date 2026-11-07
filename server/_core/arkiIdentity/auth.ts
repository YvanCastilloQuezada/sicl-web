/**
 * ARKI Identity — credenciales locales (portado de MO08, storage SQLite).
 * scrypt + salt 32B. Sin MySQL, sin guard "NODE_ENV !== production".
 * La activación se controla con ARKI_IDENTITY_ENABLE=1 (ver index.ts).
 */
import { randomBytes, scrypt as scryptCb, timingSafeEqual, randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { getDb, type CredentialRow } from "./storage";

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const SALT_BYTES = 32;
const HASH_BYTES = 64;

export interface CreateCredentialInput {
  userId?: string;
  username: string;
  password: string;
}

export async function createCredential(input: CreateCredentialInput): Promise<{ userId: string }> {
  if (!input.username || typeof input.username !== "string" || input.username.length > 64) {
    throw new Error("IDENTITY_INVALID_USERNAME");
  }
  if (!input.password || typeof input.password !== "string" || input.password.length < 8) {
    throw new Error("IDENTITY_INVALID_PASSWORD");
  }
  const db = getDb();
  const existing = db
    .prepare("SELECT user_id FROM arki_identity_credentials WHERE username = ? LIMIT 1")
    .get(input.username);
  if (existing) throw new Error("IDENTITY_USERNAME_TAKEN");

  const userId = input.userId ?? randomUUID();
  const salt = randomBytes(SALT_BYTES);
  const hash = await scrypt(input.password, salt, HASH_BYTES);

  db.prepare(
    `INSERT INTO arki_identity_credentials
       (user_id, username, password_salt, password_hash, enabled)
     VALUES (?, ?, ?, ?, 1)`,
  ).run(userId, input.username, salt, hash);

  db.prepare(
    `INSERT INTO arki_identity_audit (action, detail) VALUES ('login', ?)`,
  ).run(`credential_created=${input.username}`);

  return { userId };
}

export async function verifyCredential(username: string, password: string): Promise<string | null> {
  if (!username || !password) return null;
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM arki_identity_credentials WHERE username = ? AND enabled = 1 LIMIT 1")
    .get(username) as CredentialRow | undefined;
  if (!row) return null;

  const candidate = await scrypt(password, row.password_salt, HASH_BYTES);
  if (candidate.length !== row.password_hash.length) return null;
  if (!timingSafeEqual(candidate, row.password_hash)) return null;

  db.prepare(
    `INSERT INTO arki_identity_audit (action, detail) VALUES ('login', ?)`,
  ).run(`credential_ok=${username}`);
  return row.user_id;
}

export function disableCredential(userId: string): boolean {
  const db = getDb();
  const r = db
    .prepare("UPDATE arki_identity_credentials SET enabled = 0 WHERE user_id = ?")
    .run(userId);
  return r.changes > 0;
}
