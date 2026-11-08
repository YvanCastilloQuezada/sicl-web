/**
 * F1b — contrato ADR-0001 sobre SQLite.
 *
 * El test anterior hacía grep literal sobre server/db.ts buscando
 * `memoryParametricFiles.has(...)`. Ese identificador ya no existe:
 * F1b migró el backend a SQLite. El contrato se cumple ahora por:
 *   1. UNIQUE INDEX parametric_files_artifactId_unique (0003_db_persistence.sql)
 *   2. SELECT ... WHERE status != 'ARCHIVED' en listParametricFiles
 *   3. canArchiveParametricFile (importado desde ./parametric/archiveAuthorization)
 *
 * Este test verifica el contrato en el esquema SQL y en el comportamiento,
 * no la implementación concreta.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let originalPath: string | undefined;
let tmpDir: string;

beforeEach(async () => {
  originalPath = process.env.SICL_WEB_DB_PATH;
  tmpDir = mkdtempSync(join(tmpdir(), "sicl-contract-"));
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
  fileName: `${artifactId}.ifc`,
  format: "IFC",
  sizeBytes: 100,
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

describe("contrato ADR-0001 — artifactId global (SQLite)", () => {
  it("0003_db_persistence.sql define UNIQUE INDEX en parametric_files.artifactId", () => {
    const sql = readFileSync(
      "drizzle/sqlite/migrations/0003_db_persistence.sql",
      "utf8",
    );
    expect(sql).toMatch(
      /CREATE UNIQUE INDEX IF NOT EXISTS parametric_files_artifactId_unique\s+ON parametric_files\s*\(\s*artifactId\s*\)/i,
    );
  });

  it("db.ts importa canArchiveParametricFile (guarda de archivado)", () => {
    const src = readFileSync("server/db.ts", "utf8");
    expect(src).toMatch(/import\s*\{\s*canArchiveParametricFile\s*\}\s*from\s*"\.\/parametric\/archiveAuthorization"/);
  });

  it("listParametricFiles filtra status != 'ARCHIVED' en la query SQL", async () => {
    const { insertParametricFile, archiveParametricFile, listParametricFiles } = await import("./db");
    await insertParametricFile(baseFile("ART-A"));
    await insertParametricFile(baseFile("ART-B"));
    expect(await archiveParametricFile(1, "P-1", "ART-A")).toBe(true);
    const list = await listParametricFiles(1, "P-1");
    expect(list.map((f) => f.artifactId)).toEqual(["ART-B"]);
  });

  it("el contrato global se enforcea entre owners y projects distintos", async () => {
    const { insertParametricFile } = await import("./db");
    await insertParametricFile({ ...baseFile("ART-GLOBAL"), ownerId: 1, projectId: "P-1" });
    await expect(
      insertParametricFile({ ...baseFile("ART-GLOBAL"), ownerId: 2, projectId: "P-2" }),
    ).rejects.toThrow(/globally unique/);
  });

  it("canArchiveParametricFile rechaza archive cross-owner", async () => {
    const { insertParametricFile, archiveParametricFile } = await import("./db");
    await insertParametricFile(baseFile("ART-X"));
    expect(await archiveParametricFile(2, "P-1", "ART-X")).toBe(false);
    expect(await archiveParametricFile(1, "P-2", "ART-X")).toBe(false);
  });
});
