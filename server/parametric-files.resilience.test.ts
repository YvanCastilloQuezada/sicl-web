import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Resilience: verifica que las guardas estaticas existen.
 * No ejecuta el hook (lento); solo valida que esta y contiene las comprobaciones.
 */

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");
const exists = (p: string) => existsSync(join(ROOT, p));

describe("resilience: guardas estaticas", () => {
  it("pre-commit existe y bloquea las 4 regresiones V8", () => {
    expect(exists(".githooks/pre-commit")).toBe(true);
    const s = read(".githooks/pre-commit");
    expect(s).toMatch(/memoryParametricFiles\.has\(file\.artifactId\)/);
    expect(s).toMatch(/memoryParametricFiles\.set\(file\.artifactId, stored\)/);
    expect(s).toMatch(/canArchiveParametricFile/);
    expect(s).toMatch(/ne\(parametricFiles\.status, "ARCHIVED"\)/);
  });

  it("CI existe y tiene los greps del contrato", () => {
    const p = ".github/workflows/parametric-v10.yml";
    expect(exists(p)).toBe(true);
    const s = read(p);
    expect(s).toMatch(/memoryParametricFiles\.has\(file\.artifactId\)/);
    expect(s).toMatch(/CREATE UNIQUE INDEX `parametric_files_artifactId_unique`/);
  });

  it("ADR-0001 existe", () => {
    expect(exists("docs/adr/0001-artifactid-global.md")).toBe(true);
  });

  it("runbook existe", () => {
    expect(exists("docs/runbooks/artifactid.md")).toBe(true);
  });

  it("playbook de incidente existe", () => {
    expect(exists("docs/runbooks/incident-artifactid-duplicates.md")).toBe(true);
  });
});
