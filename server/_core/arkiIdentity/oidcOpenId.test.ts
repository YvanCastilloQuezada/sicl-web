/**
 * F1c.1 — tests de la integración OIDC ↔ /api/identity/token.
 *
 * Verifica que el JWT emitido por el callback OIDC (openId con prefijo
 * "arki-oidc-gitea:<username>") es aceptado por /api/identity/token y
 * resuelve el userId correcto.
 *
 * No reproduce el flujo OAuth2 contra Gitea (eso requiere Gitea real).
 * Solo verifica el contrato entre ambos handlers a nivel de código.
 */
import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import type { Server } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let originalDbPath: string | undefined;
let originalEnable: string | undefined;
let originalJwtSecret: string | undefined;
let tempDir: string;
let ctx: { server: Server; url: string };

const TEST_JWT_SECRET = "test-jwt-secret-for-oidc-integration-32b";

beforeAll(async () => {
  originalDbPath = process.env.ARKI_IDENTITY_DB_PATH;
  originalEnable = process.env.ARKI_IDENTITY_ENABLE;
  originalJwtSecret = process.env.JWT_SECRET;
  tempDir = mkdtempSync(join(tmpdir(), "arki-oidc-openid-test-"));
  process.env.ARKI_IDENTITY_DB_PATH = join(tempDir, "identity.sqlite");
  process.env.ARKI_IDENTITY_ENABLE = "1";
  process.env.JWT_SECRET = TEST_JWT_SECRET;

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  const { registerArkiIdentityRoutes } = await import("./httpRoutes");
  registerArkiIdentityRoutes(app);

  await new Promise<void>((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => resolve());
    server.on("error", reject);
    ctx = { server: server as unknown as Server, url: "" };
  });
  const addr = ctx.server.address();
  if (!addr || typeof addr === "string") throw new Error("No address");
  ctx.url = `http://127.0.0.1:${addr.port}`;
});

afterAll(async () => {
  if (ctx?.server) {
    await new Promise<void>((resolve) => ctx.server.close(() => resolve()));
  }
  if (originalDbPath === undefined) delete process.env.ARKI_IDENTITY_DB_PATH;
  else process.env.ARKI_IDENTITY_DB_PATH = originalDbPath;
  if (originalEnable === undefined) delete process.env.ARKI_IDENTITY_ENABLE;
  else process.env.ARKI_IDENTITY_ENABLE = originalEnable;
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});

beforeEach(async () => {
  const { closeDb, getDb } = await import("./storage");
  closeDb();
  const db = getDb();
  db.exec("DELETE FROM arki_identity_sessions");
  db.exec("DELETE FROM arki_identity_credentials");
  db.exec("DELETE FROM arki_identity_clients");
  db.exec(
    "INSERT INTO arki_identity_clients (client_id, client_name, status) VALUES ('bridge-local','ARKI Bridge (loopback)','active')",
  );
});

async function createSessionJwtForOidc(email: string): Promise<string> {
  const { createSessionJwt } = await import("./auth");
  return createSessionJwt({
    openId: `arki-oidc-gitea:${email}`,
    appId: "arki-local",
    name: email,
  });
}

async function callToken(
  cookie: string,
  body: unknown,
): Promise<{ status: number; json: unknown }> {
  const res = await fetch(`${ctx.url}/api/identity/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

describe("OIDC ↔ /api/identity/token (openId = arki-oidc-gitea:<email>)", () => {
  it("JWT OIDC con usuario enabled=1 → 200 + token opaco 43-char", async () => {
    const { getDb } = await import("./storage");
    const db = getDb();
    db.prepare(
      `INSERT INTO arki_identity_credentials
         (user_id, username, password_salt, password_hash, enabled)
       VALUES (?, ?, x'00', x'00', 1)`,
    ).run("oidc-user-1", "yvancastillo2@gmail.com");

    const jwt = await createSessionJwtForOidc("yvancastillo2@gmail.com");
    const r = await callToken(
      `arki_identity_session=${jwt}`,
      { client_id: "bridge-local", scopes: ["git:read"], ttl_seconds: 3600 },
    );
    expect(r.status).toBe(200);
    const body = r.json as { token: string; scopes: string[] };
    expect(body.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(body.scopes).toEqual(["git:read"]);
  });

  it("JWT OIDC con usuario enabled=0 → 401 INVALID_SESSION_SUBJECT", async () => {
    const { getDb } = await import("./storage");
    const db = getDb();
    db.prepare(
      `INSERT INTO arki_identity_credentials
         (user_id, username, password_salt, password_hash, enabled)
       VALUES (?, ?, x'00', x'00', 0)`,
    ).run("oidc-user-2", "disabled@example.com");

    const jwt = await createSessionJwtForOidc("disabled@example.com");
    const r = await callToken(
      `arki_identity_session=${jwt}`,
      { client_id: "bridge-local", scopes: ["git:read"] },
    );
    expect(r.status).toBe(401);
    expect(r.json).toEqual({ error: "INVALID_SESSION_SUBJECT" });
  });

  it("JWT OIDC con email no existente en DB → 401", async () => {
    const jwt = await createSessionJwtForOidc("no-existe@example.com");
    const r = await callToken(
      `arki_identity_session=${jwt}`,
      { client_id: "bridge-local", scopes: ["git:read"] },
    );
    expect(r.status).toBe(401);
    expect(r.json).toEqual({ error: "INVALID_SESSION_SUBJECT" });
  });

  it("JWT local (arki-local:) sigue funcionando (regresión)", async () => {
    const { getDb } = await import("./storage");
    const { createSessionJwt } = await import("./auth");
    const db = getDb();
    db.prepare(
      `INSERT INTO arki_identity_credentials
         (user_id, username, password_salt, password_hash, enabled)
       VALUES (?, ?, x'00', x'00', 1)`,
    ).run("local-user-1", "localuser");

    const jwt = await createSessionJwt({
      openId: "arki-local:localuser",
      appId: "arki-local",
      name: "localuser",
    });
    const r = await callToken(
      `arki_identity_session=${jwt}`,
      { client_id: "bridge-local", scopes: ["git:read"] },
    );
    expect(r.status).toBe(200);
    expect((r.json as { token: string }).token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });
});
