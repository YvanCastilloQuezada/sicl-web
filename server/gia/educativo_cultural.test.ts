import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  executeIntegratedArchitectCycle,
  type IntegratedArchitectInput,
} from "../arkiIntegratedArchitectCycle";

const EDU_CULT_TIPOLOGIAS = ["universidad", "instituto-tecnologico", "centro-arte-cultura"] as const;
type EduCultTipologia = typeof EDU_CULT_TIPOLOGIAS[number];

function loadFixture(tipologia: EduCultTipologia): IntegratedArchitectInput {
  const path = resolve(__dirname, `fixtures/${tipologia}.json`);
  return JSON.parse(readFileSync(path, "utf-8"));
}

describe.each(EDU_CULT_TIPOLOGIAS)("Sub-fase E — %s (educativo/cultural)", (tipologia) => {
  const input = loadFixture(tipologia);

  it("tiene al menos 3 activities y 2 relationships", () => {
    expect(input.activities.length).toBeGreaterThanOrEqual(3);
    expect(input.relationships.length).toBeGreaterThanOrEqual(2);
  });

  it("ejecuta el ciclo integrado sin error", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(cycle.project.typology).toBe(input.typology);
    expect(cycle.status).toBeDefined();
  });

  it("genera al menos 2 DynamicParti (divergencia)", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(cycle.projectPartis.length).toBeGreaterThanOrEqual(2);
    const strategies = new Set(cycle.projectPartis.map((p) => p.flowStrategy));
    expect(strategies.size).toBeGreaterThanOrEqual(2);
  });
});
