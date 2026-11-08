/**
 * F1b — el antiguo test "memory" ahora valida la guarda ADR-0001
 * sobre SQLite (sicl.db temporal), no sobre Map.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let originalPath: string | undefined;
let tmpDir: string;

beforeEach(async () => {
  originalPath = process.env.SICL_WEB_DB_PATH;
  tmpDir = mkdtempSync(join(tmpdir(), "sicl-db-parametric-"));
  process.env.SICL_WEB_DB_PATH = join(tmpDir, "sicl.db");
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

const baseFile = (artifactId: string) => ({
  ownerId: 1,
  projectId: "P-1",
  artifactId,
  fileName: `${artifactId}.json`,
  format: "json",
  sizeBytes: 10,
  checksum: "x".repeat(64),
  parsed: 0,
  declaredDependencies: "[]",
  capabilities: "[]",
  hostRequired: null,
  status: "INSPECTED" as const,
  storageKey: `k-${artifactId}`,
  storageUrl: `u-${artifactId}`,
  humanReviewRequired: 1,
});

describe("db.ts (F1b) — parametric_files + ADR-0001", () => {
  it("insertParametricFile persiste y lista", async () => {
    const { insertParametricFile, listParametricFiles } = await import("./db");
    const stored = await insertParametricFile(baseFile("ART-001"));
    expect(stored.artifactId).toBe("ART-001");
    expect(stored.id).toBeGreaterThan(0);
    const list = await listParametricFiles(1, "P-1");
    expect(list).toHaveLength(1);
    expect(list[0].artifactId).toBe("ART-001");
  });

  it("rechaza artifactId duplicado globalmente (ADR-0001)", async () => {
    const { insertParametricFile } = await import("./db");
    await insertParametricFile(baseFile("ART-DUP"));
    await expect(insertParametricFile(baseFile("ART-DUP"))).rejects.toThrow(/globally unique/);
  });

  it("archiveParametricFile marca ARCHIVED y lo excluye del listado", async () => {
    const { insertParametricFile, listParametricFiles, archiveParametricFile } = await import("./db");
    await insertParametricFile(baseFile("ART-ARCH"));
    expect(await archiveParametricFile(1, "P-1", "ART-ARCH")).toBe(true);
    const list = await listParametricFiles(1, "P-1");
    expect(list.find((f) => f.artifactId === "ART-ARCH")).toBeUndefined();
  });

  it("archiveParametricFile rechaza owner/project ajenos", async () => {
    const { insertParametricFile, archiveParametricFile } = await import("./db");
    await insertParametricFile(baseFile("ART-OWN"));
    expect(await archiveParametricFile(2, "P-1", "ART-OWN")).toBe(false);
    expect(await archiveParametricFile(1, "P-2", "ART-OWN")).toBe(false);
  });

  it("archiveParametricFile devuelve false si no existe", async () => {
    const { archiveParametricFile } = await import("./db");
    expect(await archiveParametricFile(1, "P-1", "ART-NOPE")).toBe(false);
  });

  it("listParametricFiles filtra por owner y project", async () => {
    const { insertParametricFile, listParametricFiles } = await import("./db");
    await insertParametricFile(baseFile("ART-A"));
    await insertParametricFile({ ...baseFile("ART-B"), projectId: "P-2" });
    const p1 = await listParametricFiles(1, "P-1");
    const p2 = await listParametricFiles(1, "P-2");
    expect(p1.map((f) => f.artifactId)).toEqual(["ART-A"]);
    expect(p2.map((f) => f.artifactId)).toEqual(["ART-B"]);
  });
});
