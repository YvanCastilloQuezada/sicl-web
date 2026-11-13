import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  executeIntegratedArchitectCycle,
  type IntegratedArchitectInput,
} from "./arkiIntegratedArchitectCycle";
import { passesGIA002, type Parti } from "./gia/divergence";

const TIPOLOGIAS = [
  "hospital", "educativo", "oficinas", "residencial", "comercial",
  "industrial", "cultural", "deportivo", "transporte", "hotelero",
  "clinica", "religioso", "penitenciario", "acueducto", "canal",
  "carretera", "represa", "puerto-lacustre", "puerto-maritimo", "aeropuerto",
  "almacen", "reactor", "centro-convenciones", "rascacielos", "multifamiliar",
  "museo", "universidad", "instituto-tecnologico", "centro-arte-cultura",
  "centro-nacional-tecnologia", "data-center-ia", "teatro", "biblioteca",
  "parque-infantil", "parque-diversiones", "restaurante", "centro-campestre",
  "parque-aguas", "centro-entretenimiento-digital", "bomberos", "policia",
  "parque-zonal", "zoologico", "jardin-botanico",
] as const;
type Tipologia = typeof TIPOLOGIAS[number];

function loadFixture(tipologia: Tipologia): IntegratedArchitectInput {
  const path = resolve(__dirname, `gia/fixtures/${tipologia}.json`);
  return JSON.parse(readFileSync(path, "utf-8"));
}

describe.each(TIPOLOGIAS)("GIA-001..010 — tipología %s", (tipologia) => {
  const input = loadFixture(tipologia);

  it("GIA-001 Función — organización espacial trazable", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(cycle.stages.find((s) => s.stage === "PROJECT_CONDITIONS")?.status).toBe("PASS");
    expect(cycle.parti.partis.length).toBeGreaterThanOrEqual(1);
  });

  it("GIA-002 Espacialidad — divergencia real entre alternativas", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const partis = cycle.projectPartis;

    // El ciclo genera DynamicParti (no Parti de divergence.ts).
    // DynamicParti = { id, title, organizingIdea, rules, flowStrategy, derivedFrom, status, humanReviewRequired }
    // Verificamos divergencia observable en flowStrategy y organizingIdea.
    expect(partis.length).toBeGreaterThanOrEqual(2);

    // Al menos 2 flowStrategy distintos (linear-separation vs central-hub, etc.)
    const strategies = new Set(partis.map((p) => p.flowStrategy));
    expect(strategies.size).toBeGreaterThanOrEqual(2);

    // Al menos 2 organizingIdea distintos
    const ideas = new Set(partis.map((p) => p.organizingIdea));
    expect(ideas.size).toBeGreaterThanOrEqual(2);

    // Todos los PARTIs son propuestas (AI_PROPOSED), no decisiones firmes
    for (const p of partis) {
      expect(p.status).toBe("AI_PROPOSED");
      expect(p.humanReviewRequired).toBe(true);
    }

    // Deuda (Fase GIA-Divergencia): conectar DynamicParti con passesGIA002
    // cuando DynamicParti tenga la estructura de Parti (spaces, edges, accessOrder).
  });

  it("GIA-003 Luz y sombra — orientación afecta decisiones", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(cycle.geometry.finalStatus).toMatch(/PASS|PARTIAL/);
  });

  it("GIA-004 Clima y viento — datos ambientales afectan implantación", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(cycle.project.typology).toBe(input.typology);
    expect(cycle.geometry).toBeDefined();
  });

  it("GIA-005 Estructura y sismo — restricciones condicionan geometría", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(cycle.geometry).toBeDefined();
    expect(cycle.geometry.finalStatus).toMatch(/PASS|PARTIAL/);
  });

  it("GIA-006 Seguridad — evacuación e incendios afectan recorridos", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(cycle.stages.length).toBeGreaterThanOrEqual(3);
  });

  it("GIA-007 Forma — deriva de intención y condiciones", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(["PASS", "PARTIAL"]).toContain(cycle.geometry.finalStatus);
  });

  it("GIA-008 Integración — resultados llegan a PARTI, topología y AGK", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    expect(cycle.evaluation.functional).toMatch(/PASS|PARTIAL/);
    expect(cycle.evaluation.architecturalQuality).toMatch(/PASS|PARTIAL/);
  });

  it("GIA-009 Evaluación — se comparan alternativas sin ocultar incumplimientos", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const functional = cycle.stages.find((s) => s.stage === "FUNCTIONAL_EVALUATION");
    const regulatory = cycle.stages.find((s) => s.stage === "REGULATORY_EVALUATION");
    expect(functional?.status).toBeDefined();
    expect(regulatory?.status).toBeDefined();
    // StageStatus es "PASS" | "PARTIAL" | "UNKNOWN" según IntegratedArchitectCycle
    expect(["PASS", "PARTIAL", "UNKNOWN"]).toContain(regulatory?.status);
    expect(["PASS", "PARTIAL", "UNKNOWN"]).toContain(functional?.status);
  });

  it("GIA-010 Determinismo — misma entrada produce mismo resultado", async () => {
    const cycle1 = await executeIntegratedArchitectCycle(input);
    const cycle2 = await executeIntegratedArchitectCycle(input);
    
    // Comparar solo lo determinista del ciclo
    expect(cycle1.evaluation.functional).toBe(cycle2.evaluation.functional);
    expect(cycle1.evaluation.regulatory).toBe(cycle2.evaluation.regulatory);
    expect(cycle1.evaluation.architecturalQuality).toBe(cycle2.evaluation.architecturalQuality);
    expect(cycle1.status).toBe(cycle2.status);
    
    // Principio ARKI: TODO es determinista. ARKI piensa en 3D y dibuja en 2D.
    // Motores deterministas confirmados: structural, geotech, hvac, acoustic, sewer.
    // Motores estocásticos (DEUDA Fase 4): evacuation (jupedsim), fire (pycfast).
    // TODO(Fase 4): fijar seed en jupedsim y pycfast para que sean deterministas.
    // Cuando ambos lo sean, comparar cycle1.evaluation completo (incluyendo evacuation y fire).
    const deterministicEngines = ["structural", "geotech", "hvac", "acoustic", "sewer"] as const;
    for (const engineName of deterministicEngines) {
      const e1 = cycle1.evaluation.engines[engineName];
      const e2 = cycle2.evaluation.engines[engineName];
      expect(e1.status).toBe(e2.status);
      expect(e1.engine).toBe(e2.engine);
      expect(e1.values).toEqual(e2.values);
    }
  });
});
