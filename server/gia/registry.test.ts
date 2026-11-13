import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";

const FIXTURES_DIR = resolve(__dirname, "fixtures");

// Extraer TIPOLOGIAS del mismo archivo que arkiGia.test.ts
// (se lee en runtime para no duplicar la lista)
function getTipologiasFromTest(): string[] {
  const src = readFileSync(resolve(__dirname, "../arkiGia.test.ts"), "utf-8");
  const match = src.match(/const TIPOLOGIAS = \[(.*?)\] as const;/s);
  if (!match) throw new Error("TIPOLOGIAS no encontrado en arkiGia.test.ts");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function getFixturesFromDisk(): string[] {
  return readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort();
}

describe("Registry de tipologías — integridad", () => {
  const tipologias = getTipologiasFromTest();
  const fixtures = getFixturesFromDisk();

  it("TIPOLOGIAS y fixtures están sincronizados", () => {
    const tipologiasSet = new Set(tipologias);
    const fixturesSet = new Set(fixtures);

    const enTipologiasNoFixture = [...tipologiasSet].filter((t) => !fixturesSet.has(t));
    const enFixtureNoTipologias = [...fixturesSet].filter((t) => !tipologiasSet.has(t));

    expect(enTipologiasNoFixture, `En TIPOLOGIAS pero sin fixture: ${enTipologiasNoFixture}`).toEqual([]);
    expect(enFixtureNoTipologias, `En fixtures pero sin TIPOLOGIAS: ${enFixtureNoTipologias}`).toEqual([]);
  });

  it("no hay duplicados en TIPOLOGIAS", () => {
    const duplicados = tipologias.filter((t, i) => tipologias.indexOf(t) !== i);
    expect(duplicados, `Duplicados: ${duplicados}`).toEqual([]);
  });

  it("todos los fixtures tienen projectId válido y único", () => {
    const projectIds = new Map<string, string>();
    const errores: string[] = [];

    for (const f of fixtures) {
      const data = JSON.parse(readFileSync(resolve(FIXTURES_DIR, `${f}.json`), "utf-8"));
      const pid = data.projectId;

      // Formato XXX-XXX-XXX-XXX
      if (!/^[A-Z]{3}-[A-Z]{3}-\d{3}-\d{3}$/.test(pid)) {
        errores.push(`${f}: projectId inválido '${pid}'`);
      }

      // Único
      if (projectIds.has(pid)) {
        errores.push(`${f}: projectId duplicado '${pid}' (ya en ${projectIds.get(pid)})`);
      }
      projectIds.set(pid, f);
    }

    expect(errores, errores.join("\n")).toEqual([]);
  });

  it("todos los fixtures tienen typology único", () => {
    const typologies = new Map<string, string>();
    const errores: string[] = [];

    for (const f of fixtures) {
      const data = JSON.parse(readFileSync(resolve(FIXTURES_DIR, `${f}.json`), "utf-8"));
      const typ = data.typology;

      if (typologies.has(typ)) {
        errores.push(`${f}: typology duplicado '${typ}' (ya en ${typologies.get(typ)})`);
      }
      typologies.set(typ, f);
    }

    expect(errores, errores.join("\n")).toEqual([]);
  });

  it("hay al menos 44 tipologías", () => {
    expect(tipologias.length).toBeGreaterThanOrEqual(44);
    expect(fixtures.length).toBeGreaterThanOrEqual(44);
  });
});
