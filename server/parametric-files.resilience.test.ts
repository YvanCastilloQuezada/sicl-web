/**
 * F1c — resilience: guardas estáticas del pre-commit (ADR-0001, SQLite).
 *
 * El test original verificaba que .githooks/pre-commit contuviera las
 * guardas Map (`memoryParametricFiles.has(...)`, `memoryParametricFiles.set(...)`).
 * Tras F1b el hook migró a guardas SQLite. Este test verifica las nuevas:
 *
 *   1. UNIQUE INDEX parametric_files_artifactId_unique en 0003_db_persistence.sql
 *   2. status != 'ARCHIVED' en server/db.ts
 *   3. INSERT INTO parametric_files en server/db.ts
 *   4. canArchiveParametricFile en server/db.ts
 *   5. CREATE TABLE IF NOT EXISTS parametric_files en 0003_db_persistence.sql
 *
 * Además verifica que el hook invoque los 3 tests correctos.
 */
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const read = (p: string) => readFileSync(p, "utf8");

describe("resilience: guardas estáticas del pre-commit (SQLite)", () => {
  it("pre-commit existe y bloquea las 5 regresiones ADR-0001", () => {
    expect(existsSync(".githooks/pre-commit")).toBe(true);
    const hook = read(".githooks/pre-commit");

    // Guarda 1: UNIQUE INDEX en la migración
    expect(hook).toMatch(/parametric_files_artifactId_unique/);
    expect(hook).toMatch(/0003_db_persistence\.sql/);

    // Guarda 2: filtro ARCHIVED en db.ts
    expect(hook).toMatch(/status != 'ARCHIVED'/);
    expect(hook).toMatch(/server\/db\.ts/);

    // Guarda 3: INSERT INTO parametric_files
    expect(hook).toMatch(/INSERT INTO parametric_files/);

    // Guarda 4: canArchiveParametricFile
    expect(hook).toMatch(/canArchiveParametricFile/);

    // Guarda 5: CREATE TABLE IF NOT EXISTS (idempotencia)
    expect(hook).toMatch(/CREATE TABLE IF NOT EXISTS parametric_files/);
  });

  it("pre-commit invoca los 3 tests de contrato ADR-0001", () => {
    const hook = read(".githooks/pre-commit");
    expect(hook).toMatch(/server\/db\.memory\.parametric-files\.test\.ts/);
    expect(hook).toMatch(/server\/parametric-files\.contract\.test\.ts/);
    expect(hook).toMatch(/server\/parametric\/archiveAuthorization\.test\.ts/);
  });

  it("hook es ejecutable", () => {
    const { statSync } = require("node:fs") as typeof import("node:fs");
    const mode = statSync(".githooks/pre-commit").mode;
    // Al menos uno de owner/group/other exec
    expect(mode & 0o111).toBeGreaterThan(0);
  });

  it("hook usa set -Eeuo pipefail", () => {
    const hook = read(".githooks/pre-commit");
    expect(hook).toMatch(/set -Eeuo pipefail/);
  });

  it("hook termina con PRE-COMMIT_OK", () => {
    const hook = read(".githooks/pre-commit");
    expect(hook).toMatch(/PRE-COMMIT_OK/);
  });
});
