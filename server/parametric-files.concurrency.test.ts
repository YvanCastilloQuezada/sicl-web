/**
 * F1b — concurrencia sobre SQLite (reemplaza el test Map original).
 *
 * Con el backend Map, cada worker tenía un Map aislado. Con SQLite hay un
 * único archivo y locks reales. El test verifica:
 *   - 10 inserciones del MISMO artifactId → exactamente 1 OK, 9 rechazos.
 *   - 10 artifactIds DISTINTOS → los 10 OK.
 *
 * better-sqlite3 es síncrono, así que "concurrencia" aquí significa
 * serialización correcta: el índice UNIQUE garantiza 1 ganador y los
 * demás ven el conflicto. No hay carrera real porque no hay await entre
 * el SELECT y el INSERT.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let originalPath: string | undefined;
let tmpDir: string;

beforeEach(async () => {
  originalPath = process.env.SICL_WEB_DB_PATH;
  tmpDir = mkdtempSync(join(tmpdir(), "sicl-concurrency-"));
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

const WORKERS = 10;

describe("concurrency: artifactId global (SQLite)", () => {
  it("10 workers mismo artifactId → 1 OK, 9 rechazos", async () => {
    const { insertParametricFile } = await import("./db");
    const results = await Promise.allSettled(
      Array.from({ length: WORKERS }, () => insertParametricFile(baseFile("ART-SAME"))),
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const ko = results.filter((r) => r.status === "rejected").length;
    expect(ok).toBe(1);
    expect(ko).toBe(WORKERS - 1);
  }, 30_000);

  it("10 distinct artifactIds → todos OK (sin falsos positivos)", async () => {
    const { insertParametricFile } = await import("./db");
    const results = await Promise.allSettled(
      Array.from({ length: WORKERS }, (_, i) =>
        insertParametricFile(baseFile(`ART-${i}`)),
      ),
    );
    expect(results.every((r) => r.status === "fulfilled")).toBe(true);
  }, 30_000);
});
