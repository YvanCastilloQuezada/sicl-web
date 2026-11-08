/**
 * F1b — verificación de persistencia real sobre SQLite (sicl.db).
 * No mockea: cierra y reabre la conexión para comprobar que los datos
 * sobreviven al reinicio del proceso.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let originalPath: string | undefined;
let tmpDir: string;
let dbFile: string;

beforeEach(async () => {
  originalPath = process.env.SICL_WEB_DB_PATH;
  tmpDir = mkdtempSync(join(tmpdir(), "sicl-db-sqlite-"));
  dbFile = join(tmpDir, "sicl.db");
  process.env.SICL_WEB_DB_PATH = dbFile;
  const { closeDb } = await import("./db");
  closeDb();
});

afterEach(async () => {
  const { closeDb } = await import("./db");
  closeDb();
  if (originalPath === undefined) delete process.env.SICL_WEB_DB_PATH;
  else process.env.SICL_WEB_DB_PATH = originalPath;
  if (tmpDir) rmSync(tmpDir, { recursive: true, force: true });
});

describe("db.ts (F1b) — persistencia SQLite", () => {
  it("crea sicl.db y aplica 0003 al primer getDb", async () => {
    const { getDb } = await import("./db");
    await getDb();
    expect(existsSync(dbFile)).toBe(true);
  });

  it("insertSiclProject + getSiclProject sobreviven al reinicio", async () => {
    const db1 = await import("./db");
    await db1.insertSiclProject({
      ownerId: 7,
      projectId: "PRJ-PERSIST",
      name: "Persistente",
      snapshot: JSON.stringify({ a: 1 }),
    });
    expect(await db1.getSiclProject(7, "PRJ-PERSIST")).toBeDefined();
    db1.closeDb();

    const db2 = await import("./db");
    const found = await db2.getSiclProject(7, "PRJ-PERSIST");
    expect(found?.projectId).toBe("PRJ-PERSIST");
    expect(found?.name).toBe("Persistente");
    expect(found?.createdAt).toBeInstanceOf(Date);
  });

  it("updateSiclProject respeta version optimista", async () => {
    const { insertSiclProject, updateSiclProject, getSiclProject } = await import("./db");
    await insertSiclProject({ ownerId: 1, projectId: "PRJ-V", name: "V", snapshot: "{}" });
    expect(await updateSiclProject(1, "PRJ-V", 1, '{"v":2}')).toBe(true);
    expect(await updateSiclProject(1, "PRJ-V", 1, '{"v":3}')).toBe(false);
    const p = await getSiclProject(1, "PRJ-V");
    expect(p?.version).toBe(2);
  });

  it("upsertUser crea y actualiza sin duplicar", async () => {
    const { upsertUser, getUserByOpenId } = await import("./db");
    await upsertUser({ openId: "u-1", name: "A", email: "a@x" });
    await upsertUser({ openId: "u-1", name: "A2" });
    const u = await getUserByOpenId("u-1");
    expect(u?.name).toBe("A2");
    expect(u?.email).toBe("a@x");
  });

  it("saveArkiCommandSession crea y actualiza por sessionId", async () => {
    const { saveArkiCommandSession, listArkiCommandSessions } = await import("./db");
    const base = {
      ownerId: 1, projectId: "P", sessionId: "S-1",
      commandName: "create_wall", parameters: "{}", previewResult: "{}",
    };
    await saveArkiCommandSession(base);
    await saveArkiCommandSession({ ...base, commandName: "create_door" });
    const list = await listArkiCommandSessions(1, "P");
    expect(list).toHaveLength(1);
    expect(list[0].commandName).toBe("create_door");
  });

  it("insertFederatedAssistantHandoff + review a HUMAN_REVIEW", async () => {
    const { insertFederatedAssistantHandoff, listFederatedAssistantHandoffs, reviewFederatedAssistantHandoff } = await import("./db");
    const h = await insertFederatedAssistantHandoff({
      ownerId: 1, sourceProduct: "AR", targetProduct: "LU",
      sourceAssistantId: "arki-1", request: "r", status: "HUMAN_REVIEW",
      sourceCommit: "abc", evidenceJson: "{}", traceJson: "{}",
    } as any);
    expect(h.handoffId).toMatch(/^ARLU-/);
    expect(await reviewFederatedAssistantHandoff(1, h.handoffId, "APPROVED", "rev-1", "ok")).toBe(true);
    const list = await listFederatedAssistantHandoffs(1, "APPROVED");
    expect(list).toHaveLength(1);
  });

  it("listSiclProjects siembra UPAO-001 para owner sin proyectos", async () => {
    const { listSiclProjects } = await import("./db");
    const list = await listSiclProjects(999);
    expect(list.some((p) => p.projectId === "UPAO-001")).toBe(true);
  });
});
