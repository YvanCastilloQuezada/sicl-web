import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import type { Server } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Tests de F5 — login/logout local con cookie JWT HS256.
 * Aislamiento por DB temporal y puerto efímero.
 */

let originalDbPath: string | undefined;
let originalEnable: string | undefined;
let originalJwt: string | undefined;
let tempDir: string;

const TEST_JWT_SECRET = "x".repeat(48); // >= 32

beforeAll(() => {
  originalDbPath = process.env.ARKI_IDENTITY_DB_PATH;
  originalEnable = process.env.ARKI_IDENTITY_ENABLE;
  originalJwt = process.env.JWT_SECRET;
  tempDir = mkdtempSync(join(tmpdir(), "arki-identity-login-test-"));
  process.env.ARKI_IDENTITY_DB_PATH = join(tempDir, "identity.sqlite");
  process.env.ARKI_IDENTITY_ENABLE = "1";
  process.env.JWT_SECRET = TEST_JWT_SECRET;
});

afterAll(() => {
  if (originalDbPath === undefined) delete process.env.ARKI_IDENTITY_DB_PATH;
  else process.env.ARKI_IDENTITY_DB_PATH = originalDbPath;
  if (originalEnable === undefined) delete process.env.ARKI_IDENTITY_ENABLE;
  else process.env.ARKI_IDENTITY_ENABLE = originalEnable;
  if (originalJwt === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwt;
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});

import { createCredential, closeDb, getDb } from "./index";
import { registerArkiIdentityRoutes } from "./httpRoutes";

interface Ctx { server: Server; url: string; }
let ctx: Ctx;

function resetDb() {
  closeDb();
  const db = getDb();
  db.exec("DELETE FROM arki_identity_sessions");
  db.exec("DELETE FROM arki_identity_audit");
  db.exec("DELETE FROM arki_identity_credentials");
  db.exec("DELETE FROM arki_identity_clients");
  db.exec("DELETE FROM arki_identity_login_attempts");
  db.exec("INSERT INTO arki_identity_clients (client_id, client_name, status) VALUES ('web-session','Web','active')");
}

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
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
  if (ctx?.server) await new Promise<void>((resolve) => ctx.server.close(() => resolve()));
});

beforeEach(() => resetDb());

async function post(path: string, body: unknown, cookie?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cookie) headers["Cookie"] = cookie;
  const res = await fetch(`${ctx.url}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const setCookie = res.headers.get("set-cookie");
  const json = await res.json().catch(() => null);
  return { status: res.status, json, setCookie };
}

describe("POST /api/identity/login", () => {
  it("login válido → 200 + cookie con JWT HS256", async () => {
    await createCredential({ username: "arki", password: "hunter2!!" });
    const r = await post("/api/identity/login", { username: "arki", password: "hunter2!!" });
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ ok: true, username: "arki" });
    expect(r.setCookie).toBeTruthy();
    expect(r.setCookie!).toMatch(/^arki_identity_session=/);
    expect(r.setCookie!).toMatch(/HttpOnly/i);
    expect(r.setCookie!).toMatch(/SameSite=Strict/i);
    // El valor de la cookie debe ser un JWT de 3 partes
    const jwt = r.setCookie!.split(";")[0].split("=").slice(1).join("=");
    expect(jwt.split(".").length).toBe(3);
  });

  it("password incorrecta → 401", async () => {
    await createCredential({ username: "arki", password: "hunter2!!" });
    const r = await post("/api/identity/login", { username: "arki", password: "wrong" });
    expect(r.status).toBe(401);
    expect(r.json).toEqual({ error: "INVALID_CREDENTIALS" });
    expect(r.setCookie).toBeNull();
  });

  it("usuario inexistente → 401", async () => {
    const r = await post("/api/identity/login", { username: "nadie", password: "x" });
    expect(r.status).toBe(401);
  });

  it("body sin username → 400", async () => {
    const r = await post("/api/identity/login", { password: "x" });
    expect(r.status).toBe(400);
    expect(r.json).toEqual({ error: "INVALID_BODY" });
  });

  it("identity disabled → 503", async () => {
    process.env.ARKI_IDENTITY_ENABLE = "0";
    try {
      const r = await post("/api/identity/login", { username: "a", password: "b" });
      expect(r.status).toBe(503);
    } finally {
      process.env.ARKI_IDENTITY_ENABLE = "1";
    }
  });

  it("3 fallos en 15 min → bloqueo en el 4º intento", async () => {
    await createCredential({ username: "brute", password: "correct!!" });
    for (let i = 0; i < 3; i++) {
      const r = await post("/api/identity/login", { username: "brute", password: "wrong" });
      expect(r.status).toBe(401);
    }
    const r = await post("/api/identity/login", { username: "brute", password: "wrong" });
    expect(r.status).toBe(429);
    expect(r.json).toEqual({ error: "TOO_MANY_ATTEMPTS" });
    // Incluso con la contraseña correcta, sigue bloqueado por rate limit
    const blocked = await post("/api/identity/login", { username: "brute", password: "correct!!" });
    expect(blocked.status).toBe(429);
  });
});

describe("POST /api/identity/logout", () => {
  it("logout → revoca JWT y borra cookie", async () => {
    await createCredential({ username: "logout-user", password: "hunter2!!" });
    const login = await post("/api/identity/login", {
      username: "logout-user",
      password: "hunter2!!",
    });
    expect(login.status).toBe(200);
    const cookiePair = login.setCookie!.split(";")[0];
    const jwt = cookiePair.slice("arki_identity_session=".length);
    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(jwt, new TextEncoder().encode(TEST_JWT_SECRET), {
      algorithms: ["HS256"],
    });
    expect(typeof payload.jti).toBe("string");

    const r = await post("/api/identity/logout", {}, cookiePair);
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ ok: true });
    expect(r.setCookie).toMatch(/arki_identity_session=;/);

    const db = (await import("./storage")).getDb();
    const revoked = db.prepare(
      "SELECT 1 FROM arki_identity_audit WHERE action='logout' AND detail=? LIMIT 1",
    ).get(`jwt_jti=${payload.jti}`);
    expect(revoked).toBeTruthy();
  });
});

describe("JWT compatible con sdk.verifySession", () => {
  it("JWT emitido verifica con jose usando el mismo secret", async () => {
    await createCredential({ username: "verify-me", password: "hunter2!!" });
    const r = await post("/api/identity/login", { username: "verify-me", password: "hunter2!!" });
    expect(r.status).toBe(200);
    const jwt = r.setCookie!.split(";")[0].split("=").slice(1).join("=");
    // Verificar manualmente con jose
    const { jwtVerify } = await import("jose");
    const secret = new TextEncoder().encode(TEST_JWT_SECRET);
    const { payload } = await jwtVerify(jwt, secret, { algorithms: ["HS256"] });
    expect(payload.openId).toBe("arki-local:verify-me");
    expect(payload.appId).toBeTruthy();
    expect(payload.name).toBe("verify-me");
  });
});
