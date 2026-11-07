import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import express from "express";
import type { Server } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Tests de httpRoutes. Aislamiento por DB temporal y puerto efímero.
 * Solo prueba introspección — no toca el Bridge real ni requiere SICL Web corriendo.
 */

let originalDbPath: string | undefined;
let originalEnable: string | undefined;
let originalKey: string | undefined;
let tempDir: string;

const TEST_KEY = randomBytes(32).toString("hex");

beforeAll(() => {
  originalDbPath = process.env.ARKI_IDENTITY_DB_PATH;
  originalEnable = process.env.ARKI_IDENTITY_ENABLE;
  originalKey = process.env.ARKI_IDENTITY_INTERNAL_KEY;
  tempDir = mkdtempSync(join(tmpdir(), "arki-identity-http-test-"));
  process.env.ARKI_IDENTITY_DB_PATH = join(tempDir, "identity.sqlite");
  process.env.ARKI_IDENTITY_ENABLE = "1";
  process.env.ARKI_IDENTITY_INTERNAL_KEY = TEST_KEY;
});

afterAll(() => {
  if (originalDbPath === undefined) delete process.env.ARKI_IDENTITY_DB_PATH;
  else process.env.ARKI_IDENTITY_DB_PATH = originalDbPath;
  if (originalEnable === undefined) delete process.env.ARKI_IDENTITY_ENABLE;
  else process.env.ARKI_IDENTITY_ENABLE = originalEnable;
  if (originalKey === undefined) delete process.env.ARKI_IDENTITY_INTERNAL_KEY;
  else process.env.ARKI_IDENTITY_INTERNAL_KEY = originalKey;
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});

// Importar DESPUÉS de setear env
import { issueToken, closeDb, getDb } from "./index";
import { registerArkiIdentityRoutes } from "./httpRoutes";

interface Ctx {
  server: Server;
  url: string;
}

let ctx: Ctx;

function resetDb() {
  closeDb();
  const db = getDb();
  db.exec("DELETE FROM arki_identity_sessions");
  db.exec("DELETE FROM arki_identity_audit");
  db.exec("DELETE FROM arki_identity_clients");
  db.exec(
    "INSERT INTO arki_identity_clients (client_id, client_name, status) VALUES ('bridge-local','ARKI Bridge (loopback)','active')",
  );
}

beforeAll(async () => {
  const app = express();
  app.use(express.json());
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
});

beforeEach(() => {
  resetDb();
});

async function call(
  body: unknown,
  headers: Record<string, string> = {},
): Promise<{ status: number; json: unknown }> {
  const res = await fetch(`${ctx.url}/api/internal/identity/introspect`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

describe("POST /api/internal/identity/introspect", () => {
  it("token válido + key correcta → 200 { valid: true, ... }", async () => {
    const { token, sessionId } = issueToken({
      userId: "u-1",
      clientId: "bridge-local",
      scopes: ["git:read", "files:read"],
    });
    const r = await call({ token }, { "X-Internal-Key": TEST_KEY });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({
      valid: true,
      subject: "u-1",
      client_id: "bridge-local",
      scopes: ["git:read", "files:read"],
    });
    expect((r.json as { expires_at: string }).expires_at).toBeTruthy();
    // sessionId no debe aparecer en la respuesta
    expect(JSON.stringify(r.json)).not.toContain(sessionId);
  });

  it("token inválido (43 'a') + key correcta → 200 { valid: false }", async () => {
    const fake = "a".repeat(43);
    const r = await call({ token: fake }, { "X-Internal-Key": TEST_KEY });
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ valid: false });
  });

  it("token revocado + key correcta → 200 { valid: false }", async () => {
    const { token } = issueToken({
      userId: "u-2",
      clientId: "bridge-local",
      scopes: ["git:read"],
    });
    const { revokeByToken } = await import("./index");
    expect(revokeByToken(token)).toBe(true);
    const r = await call({ token }, { "X-Internal-Key": TEST_KEY });
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ valid: false });
  });

  it("sin X-Internal-Key → 403", async () => {
    const { token } = issueToken({
      userId: "u-3",
      clientId: "bridge-local",
      scopes: ["git:read"],
    });
    const r = await call({ token });
    expect(r.status).toBe(403);
    expect(r.json).toEqual({ error: "FORBIDDEN" });
  });

  it("X-Internal-Key incorrecta → 403", async () => {
    const { token } = issueToken({
      userId: "u-4",
      clientId: "bridge-local",
      scopes: ["git:read"],
    });
    const r = await call({ token }, { "X-Internal-Key": "wrong-key" });
    expect(r.status).toBe(403);
    expect(r.json).toEqual({ error: "FORBIDDEN" });
  });

  it("body sin token → 400", async () => {
    const r = await call({}, { "X-Internal-Key": TEST_KEY });
    expect(r.status).toBe(400);
    expect(r.json).toEqual({ error: "INVALID_BODY" });
  });

  it("token con formato inválido (corto) → 200 { valid: false }", async () => {
    const r = await call({ token: "short" }, { "X-Internal-Key": TEST_KEY });
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ valid: false });
  });

  it("IDENTITY_DISABLED → 503", async () => {
    const saved = process.env.ARKI_IDENTITY_ENABLE;
    process.env.ARKI_IDENTITY_ENABLE = "0";
    try {
      const r = await call({ token: "a".repeat(43) }, { "X-Internal-Key": TEST_KEY });
      expect(r.status).toBe(503);
      expect(r.json).toEqual({ error: "IDENTITY_DISABLED" });
    } finally {
      if (saved === undefined) delete process.env.ARKI_IDENTITY_ENABLE;
      else process.env.ARKI_IDENTITY_ENABLE = saved;
    }
  });
});
