import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Contrato estático (ADR-0001): artifactId global.
 * Lee los archivos vigentes y falla si alguien cambia el contrato.
 */

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

describe("contrato estático: artifactId global", () => {
  it("server/db.ts: Map.has + clave artifactId + canArchiveParametricFile + ne(ARCHIVED)", () => {
    const s = read("server/db.ts");
    expect(s).toMatch(/memoryParametricFiles\.has\(file\.artifactId\)/);
    expect(s).toMatch(/memoryParametricFiles\.set\(file\.artifactId, stored\)/);
    expect(s).toMatch(/canArchiveParametricFile/);
    expect(s).toMatch(/ne\(parametricFiles\.status, "ARCHIVED"\)/);
  });

  it("drizzle/schema.ts: artifactId .unique()", () => {
    const s = read("drizzle/schema.ts");
    expect(s).toMatch(/artifactId:\s*varchar\([^)]*\)\.notNull\(\)\.unique\(\)/);
  });

  it("drizzle/sqlite/migrations/0000_initial.sql: UNIQUE(artifactId) global", () => {
    const s = read("drizzle/sqlite/migrations/0000_initial.sql");
    expect(s).toMatch(
      /CREATE UNIQUE INDEX `parametric_files_artifactId_unique` ON `parametric_files` \(`artifactId`\)/,
    );
  });

  it("drizzle/sqlite/migrations/0000_initial.sql: sin índice compuesto", () => {
    const s = read("drizzle/sqlite/migrations/0000_initial.sql");
    expect(s).not.toMatch(/parametric_files_owner_artifact_unique/);
  });

  it("server/parametric/archiveAuthorization.ts: comprueba ownerId+projectId", () => {
    const s = read("server/parametric/archiveAuthorization.ts");
    expect(s).toMatch(/current\.ownerId === ownerId/);
    expect(s).toMatch(/current\.projectId === projectId/);
  });
});
