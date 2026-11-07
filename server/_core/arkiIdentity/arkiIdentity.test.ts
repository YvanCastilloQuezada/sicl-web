import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Tests de arkiIdentity/. Aislamiento por DB temporal en cada test.
 * No toca data/memory/ real ni MySQL ni el Bridge.
 */

let originalDbPath: string | undefined;
let tempDir: string;

beforeAll(() => {
  originalDbPath = process.env.ARKI_IDENTITY_DB_PATH;
  tempDir = mkdtempSync(join(tmpdir(), "arki-identity-test-"));
  process.env.ARKI_IDENTITY_DB_PATH = join(tempDir, "identity.sqlite");
  process.env.ARKI_IDENTITY_ENABLE = "1";
});

afterAll(() => {
  if (originalDbPath === undefined) delete process.env.ARKI_IDENTITY_DB_PATH;
  else process.env.ARKI_IDENTITY_DB_PATH = originalDbPath;
  delete process.env.ARKI_IDENTITY_ENABLE;
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
});

// Importar DESPUÉS de setear env vars
import {
  issueToken,
  verifyToken,
  revokeByToken,
  revokeBySessionId,
  createCredential,
  verifyCredential,
  closeDb,
  getDb,
  identityEnabled,
} from "./index";

function resetDb() {
  closeDb();
  const db = getDb();
  db.exec("DELETE FROM arki_identity_sessions");
  db.exec("DELETE FROM arki_identity_audit");
  db.exec("DELETE FROM arki_identity_credentials");
  db.exec("DELETE FROM arki_identity_clients");
  db.exec(
    "INSERT INTO arki_identity_clients (client_id, client_name, status) VALUES ('bridge-local','ARKI Bridge (loopback)','active')",
  );
}

beforeEach(() => {
  resetDb();
});

describe("arkiIdentity — issuer", () => {
  it("emite token opaco de 43 chars y lo persiste", () => {
    const issued = issueToken({
      userId: "u-1",
      clientId: "bridge-local",
      scopes: ["git:read", "files:read"],
    });
    expect(issued.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(issued.sessionId).toBeTruthy();
    expect(issued.scopes).toEqual(["git:read", "files:read"]);
    expect(new Date(issued.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it("rechaza cliente desconocido", () => {
    expect(() =>
      issueToken({ userId: "u-1", clientId: "nope", scopes: ["git:read"] }),
    ).toThrow(/IDENTITY_UNKNOWN_CLIENT/);
  });

  it("rechaza cliente revocado", () => {
    const db = getDb();
    db.prepare("UPDATE arki_identity_clients SET status='revoked' WHERE client_id='bridge-local'").run();
    expect(() =>
      issueToken({ userId: "u-1", clientId: "bridge-local", scopes: ["git:read"] }),
    ).toThrow(/IDENTITY_CLIENT_REVOKED/);
  });

  it("rechaza scopes vacíos", () => {
    expect(() =>
      issueToken({ userId: "u-1", clientId: "bridge-local", scopes: [] }),
    ).toThrow(/IDENTITY_INVALID_SCOPES/);
  });
});

describe("arkiIdentity — verify", () => {
  it("verifica token válido", () => {
    const { token } = issueToken({ userId: "u-2", clientId: "bridge-local", scopes: ["git:read"] });
    const id = verifyToken(token);
    expect(id).not.toBeNull();
    expect(id!.userId).toBe("u-2");
    expect(id!.clientId).toBe("bridge-local");
    expect(id!.scopes).toEqual(["git:read"]);
  });

  it("rechaza token con formato inválido", () => {
    expect(verifyToken("short")).toBeNull();
    expect(verifyToken(null)).toBeNull();
    expect(verifyToken(123)).toBeNull();
  });

  it("rechaza token desconocido", () => {
    const fake = "a".repeat(43);
    expect(verifyToken(fake)).toBeNull();
  });

  it("rechaza token expirado", () => {
    const { token } = issueToken({
      userId: "u-3",
      clientId: "bridge-local",
      scopes: ["git:read"],
      ttlSeconds: 1,
    });
    // forzar expiración manual
    const db = getDb();
    db.prepare("UPDATE arki_identity_sessions SET expires_at = ?").run(
      new Date(Date.now() - 60_000).toISOString(),
    );
    expect(verifyToken(token)).toBeNull();
  });

  it("rechaza token revocado", () => {
    const { token } = issueToken({ userId: "u-4", clientId: "bridge-local", scopes: ["git:read"] });
    expect(revokeByToken(token)).toBe(true);
    expect(verifyToken(token)).toBeNull();
  });
});

describe("arkiIdentity — revoke", () => {
  it("revokeByToken devuelve true una sola vez", () => {
    const { token } = issueToken({ userId: "u-5", clientId: "bridge-local", scopes: ["git:read"] });
    expect(revokeByToken(token)).toBe(true);
    expect(revokeByToken(token)).toBe(false);
  });

  it("revokeBySessionId funciona", () => {
    const { token, sessionId } = issueToken({
      userId: "u-6", clientId: "bridge-local", scopes: ["git:read"],
    });
    expect(revokeBySessionId(sessionId)).toBe(true);
    expect(verifyToken(token)).toBeNull();
  });

  it("revokeBySessionId rechaza id inválido", () => {
    expect(revokeBySessionId("")).toBe(false);
    expect(revokeBySessionId("no-existe")).toBe(false);
  });
});

describe("arkiIdentity — credentials (scrypt)", () => {
  it("crea y verifica credencial válida", async () => {
    const { userId } = await createCredential({ username: "arki", password: "hunter2!!" });
    expect(userId).toBeTruthy();
    const ok = await verifyCredential("arki", "hunter2!!");
    expect(ok).toBe(userId);
  });

  it("rechaza contraseña incorrecta", async () => {
    await createCredential({ username: "arki", password: "hunter2!!" });
    expect(await verifyCredential("arki", "wrongpass")).toBeNull();
  });

  it("rechaza username duplicado", async () => {
    await createCredential({ username: "arki", password: "hunter2!!" });
    await expect(createCredential({ username: "arki", password: "otherpass!" })).rejects.toThrow(
      /IDENTITY_USERNAME_TAKEN/,
    );
  });

  it("rechaza password corta", async () => {
    await expect(createCredential({ username: "x", password: "short" })).rejects.toThrow(
      /IDENTITY_INVALID_PASSWORD/,
    );
  });

  it("rechaza credencial deshabilitada", async () => {
    const { userId } = await createCredential({ username: "arki", password: "hunter2!!" });
    const { disableCredential } = await import("./auth");
    expect(disableCredential(userId)).toBe(true);
    expect(await verifyCredential("arki", "hunter2!!")).toBeNull();
  });
});

describe("arkiIdentity — flag", () => {
  it("identityEnabled refleja env var", () => {
    expect(identityEnabled()).toBe(true);
    process.env.ARKI_IDENTITY_ENABLE = "0";
    expect(identityEnabled()).toBe(false);
    process.env.ARKI_IDENTITY_ENABLE = "1";
    expect(identityEnabled()).toBe(true);
  });
});
