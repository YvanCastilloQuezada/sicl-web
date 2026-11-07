/**
 * ARKI Identity — SQLite storage.
 * Única base de datos: data/memory/identity.sqlite (configurable).
 * Sin dependencia de MySQL, MO08 ni Manus.
 */
import Database from "better-sqlite3";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type ClientStatus = "active" | "revoked";
export type AuditAction = "issue" | "verify" | "revoke" | "deny" | "login" | "logout";

export interface ClientRow {
  client_id: string;
  client_name: string;
  status: ClientStatus;
  created_at: string;
}

export interface SessionRow {
  session_id: string;
  user_id: string;
  client_id: string;
  token_hash: string;
  scopes: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

export interface CredentialRow {
  user_id: string;
  username: string;
  password_salt: Buffer;
  password_hash: Buffer;
  enabled: number;
  created_at: string;
}

let _db: Database.Database | null = null;
let _initialized = false;

function dbPath(): string {
  const raw = process.env.ARKI_IDENTITY_DB_PATH
    || resolve(process.cwd(), "data/memory/identity.sqlite");
  const abs = resolve(raw);
  mkdirSync(dirname(abs), { recursive: true });
  return abs;
}

function migrationSql(): string {
  // Migración 0001 embebida para evitar dependencia de cwd en tests y runtime.
  return readFileSync(
    resolve(process.cwd(), "drizzle/sqlite/migrations/0001_arki_identity.sql"),
    "utf8",
  );
}

export function getDb(): Database.Database {
  if (_db) return _db;
  const path = dbPath();
  _db = new Database(path);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  if (!_initialized) {
    _db.exec(migrationSql());
    _initialized = true;
  }
  return _db;
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
    _initialized = false;
  }
}

export function dbExists(): boolean {
  return existsSync(dbPath());
}
