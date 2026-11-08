/**
 * F1b — carga sobre SQLite (reemplaza el test Map.has O(1) original).
 *
 * Con SQLite, `artifactId` es UNIQUE INDEX (B-tree). La verificación de
 * duplicado es O(log n). El test mide 5000 inserciones únicas + 5000
 * rechazos de duplicados, con presupuesto de 10s (más realista que el
 * 3s del test Map original, porque SQLite tiene I/O de disco con WAL).
 *
 * Nota: el test Map original medía `Map.has` puro; con SQLite el costo
 * es distinto y no comparable 1:1. Se mantiene el objetivo (5000+5000
 * sin degradación catastrófica) con presupuesto ajustado a SQLite.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let originalPath: string | undefined;
let tmpDir: string;

beforeEach(async () => {
  originalPath = process.env.SICL_WEB_DB_PATH;
  tmpDir = mkdtempSync(join(tmpdir(), "sicl-load-"));
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

const N = 5000;

describe("load: artifactId UNIQUE INDEX no degrada (SQLite)", () => {
  it("5000 inserts únicos + 5000 rechazos por duplicado < 10s", async () => {
    const { insertParametricFile } = await import("./db");
    const start = Date.now();

    for (let i = 0; i < N; i++) {
      await insertParametricFile(baseFile(`ART-${i}`));
    }
    let rejections = 0;
    for (let i = 0; i < N; i++) {
      try {
        await insertParametricFile(baseFile(`ART-${i}`));
      } catch {
        rejections++;
      }
    }
    const elapsed = Date.now() - start;

    expect(rejections).toBe(N);
    expect(elapsed).toBeLessThan(10_000);
  }, 30_000);
});
