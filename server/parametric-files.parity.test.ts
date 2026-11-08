/**
 * F1c — parity vs golden fixtures (ADR-0001, artifactId global).
 *
 * Este test reemplaza el `describe.skip` de F1b. En lugar de comparar dos
 * backends (Map vs SQLite, ya inexistente), ejecuta los casos del golden
 * `__fixtures__/parametric-files.golden.json` contra el backend SQLite
 * actual y verifica que el contrato se sigue cumpliendo exactamente.
 *
 * Si el comportamiento de db.ts cambia, este test falla.
 * Si el contrato cambia de forma intencional, se actualiza el golden
 * en un commit aparte, con revisión explícita.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

interface GoldenInput {
  ownerId: number;
  projectId: string;
  artifactId: string;
}

interface GoldenStep {
  op: "insertParametricFile" | "archiveParametricFile" | "listParametricFiles";
  input?: GoldenInput;
  args?: Array<number | string>;
  expect: {
    ok: boolean;
    artifactId?: string;
    status?: string;
    result?: boolean;
    artifactIds?: string[];
    errorMatch?: string;
  };
}

interface GoldenCase {
  id: string;
  description: string;
  steps: GoldenStep[];
}

interface GoldenFile {
  schemaVersion: number;
  description: string;
  cases: GoldenCase[];
}

const GOLDEN: GoldenFile = JSON.parse(
  readFileSync("server/__fixtures__/parametric-files.golden.json", "utf8"),
);

const baseFile = (input: GoldenInput) => ({
  ownerId: input.ownerId,
  projectId: input.projectId,
  artifactId: input.artifactId,
  fileName: `${input.artifactId}.ifc`,
  format: "IFC",
  sizeBytes: 100,
  checksum: "x".repeat(64),
  parsed: 0,
  declaredDependencies: "[]",
  capabilities: "[]",
  hostRequired: null,
  status: "INSPECTED" as const,
  storageKey: `k-${input.artifactId}`,
  storageUrl: `u-${input.artifactId}`,
  humanReviewRequired: 1,
});

let originalPath: string | undefined;
let tmpDir: string;

beforeEach(async () => {
  originalPath = process.env.SICL_WEB_DB_PATH;
  tmpDir = mkdtempSync(join(tmpdir(), "sicl-golden-"));
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

async function runStep(step: GoldenStep): Promise<unknown> {
  const db = await import("./db");
  switch (step.op) {
    case "insertParametricFile":
      if (!step.input) throw new Error("insertParametricFile requires input");
      return db.insertParametricFile(baseFile(step.input));
    case "archiveParametricFile": {
      const [ownerId, projectId, artifactId] = step.args ?? [];
      if (
        typeof ownerId !== "number" ||
        typeof projectId !== "string" ||
        typeof artifactId !== "string"
      ) {
        throw new Error("archiveParametricFile requires [ownerId, projectId, artifactId]");
      }
      return db.archiveParametricFile(ownerId, projectId, artifactId);
    }
    case "listParametricFiles": {
      const [ownerId, projectId] = step.args ?? [];
      if (typeof ownerId !== "number" || typeof projectId !== "string") {
        throw new Error("listParametricFiles requires [ownerId, projectId]");
      }
      return db.listParametricFiles(ownerId, projectId);
    }
    default:
      throw new Error(`Unknown op: ${step.op satisfies never}`);
  }
}

function expectStep(step: GoldenStep, result: unknown): void {
  const exp = step.expect;

  if (!exp.ok) {
    throw new Error("expect.ok=false requires throw path; use try/catch in caller");
  }

  if (exp.artifactId !== undefined) {
    expect(result).toMatchObject({ artifactId: exp.artifactId });
  }
  if (exp.status !== undefined) {
    expect(result).toMatchObject({ status: exp.status });
  }
  if (exp.result !== undefined) {
    expect(result).toBe(exp.result);
  }
  if (exp.artifactIds !== undefined) {
    const arr = result as Array<{ artifactId: string }>;
    expect(arr.map((r) => r.artifactId).sort()).toEqual([...exp.artifactIds].sort());
  }
}

describe("parity vs golden — ADR-0001 (artifactId global, SQLite)", () => {
  it("golden schemaVersion es soportada", () => {
    expect(GOLDEN.schemaVersion).toBe(1);
    expect(GOLDEN.cases.length).toBeGreaterThan(0);
  });

  for (const c of GOLDEN.cases) {
    it(`${c.id}: ${c.description}`, async () => {
      for (let i = 0; i < c.steps.length; i++) {
        const step = c.steps[i];
        const label = `${c.id} step[${i}] ${step.op}`;

        if (step.expect.ok === false) {
          // Esperamos throw
          let thrown: unknown = null;
          try {
            await runStep(step);
          } catch (e) {
            thrown = e;
          }
          expect(thrown, `${label}: esperaba throw pero no lo hubo`).not.toBeNull();
          if (step.expect.errorMatch) {
            expect(String((thrown as Error).message), `${label}: error no matchea`).toMatch(
              new RegExp(step.expect.errorMatch, "i"),
            );
          }
        } else {
          const result = await runStep(step);
          expectStep(step, result);
        }
      }
    });
  }
});
