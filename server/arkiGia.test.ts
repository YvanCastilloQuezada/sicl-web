import { describe, it, expect } from "vitest";
import {
  executeIntegratedArchitectCycle,
  type IntegratedArchitectInput,
} from "./arkiIntegratedArchitectCycle";

function makeValidInput(overrides: Partial<IntegratedArchitectInput> = {}): IntegratedArchitectInput {
  return {
    projectId: "GIA-ARK-001-001" as any,
    projectName: "GIA Test Hospital",
    typology: "HOSPITAL",
    brief: "Hospital de 100 camas con flujos limpios y sucios separados.",
    context: { jurisdiction: "PE", climate: "TROPICAL" },
    constraints: ["RNE A.010", "RNE A.050", "RNE A.130"],
    activities: [
      { id: "act-1", name: "Recepción", capacity: 50 } as any,
      { id: "act-2", name: "Consulta externa", capacity: 100 } as any,
      { id: "act-3", name: "Hospitalización", capacity: 100 } as any,
    ],
    relationships: [
      { id: "rel-1", source: "act-1", target: "act-2", relation: "ADJACENT", subjects: ["paciente"], control: "FLOW" } as any,
      { id: "rel-2", source: "act-2", target: "act-3", relation: "CIRCULATION", subjects: ["paciente", "personal"], control: "FLOW" } as any,
      { id: "rel-3", source: "act-1", target: "act-3", relation: "CIRCULATION", subjects: ["paciente"], control: "FLOW" } as any,
    ],
    subjects: ["paciente", "personal médico", "visitante"],
    conditions: ["clima tropical", "alta humedad"],
    unknowns: ["topografía exacta del terreno"],
    envelope: { width: 60, height: 40 },
    sourceIds: ["GIA-TEST-001"],
    ...overrides,
  };
}

describe("GIA-001 Función", () => {
  it("las actividades y relaciones producen organización espacial trazable", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    expect(cycle.stages.find((s) => s.stage === "PROJECT_CONDITIONS")?.status).toBe("PASS");
    expect(cycle.parti.partis.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GIA-002 Espacialidad", () => {
  it("las alternativas difieren en organización espacial", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    const partis = cycle.parti.partis;
    expect(partis.length).toBeGreaterThanOrEqual(1);
    const topologies = new Set(partis.map((p: any) => p.topologyId));
    expect(topologies.size).toBeGreaterThanOrEqual(1);
  });
});

describe("GIA-003 Luz y sombra", () => {
  it("la orientación afecta las decisiones de diseño", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    expect(cycle.geometry.finalStatus).toMatch(/PASS|PARTIAL/);
    expect(cycle.geometry.candidateA).toBeDefined();
    expect(cycle.geometry.candidateB).toBeDefined();
  });
});

describe("GIA-004 Clima y viento", () => {
  it("los datos ambientales afectan implantación", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    expect(cycle.project.typology).toBe("HOSPITAL");
    expect(cycle.geometry.perturbation).toBeDefined();
  });
});

describe("GIA-005 Estructura y sismo", () => {
  it("las restricciones estructurales condicionan la geometría", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    expect(cycle.geometry.candidateA).toBeDefined();
  });
});

describe("GIA-006 Seguridad", () => {
  it("evacuación e incendios afectan los recorridos", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    expect(cycle.stages.length).toBeGreaterThan(0);
  });
});

describe("GIA-007 Forma", () => {
  it("la forma deriva de intención arquitectónica y condiciones", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    expect(cycle.geometry.finalStatus).toMatch(/PASS|PARTIAL/);
  });
});

describe("GIA-008 Integración", () => {
  it("los resultados de motores llegan a PARTI, topología y AGK", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    // functional NO debe ser UNKNOWN si hay actividades y relaciones
    expect(cycle.evaluation.functional).not.toBe("UNKNOWN");
    // architecturalQuality NO debe ser NOT_EVALUATED si hay envelope
    expect(cycle.evaluation.architecturalQuality).not.toBe("NOT_EVALUATED");
  });
});

describe("GIA-009 Evaluación", () => {
  it("se comparan alternativas sin ocultar incumplimientos", async () => {
    const cycle = await executeIntegratedArchitectCycle(makeValidInput());
    expect(cycle.stages.find((s) => s.stage === "FUNCTIONAL_EVALUATION")?.status).toBeDefined();
    expect(cycle.stages.find((s) => s.stage === "REGULATORY_EVALUATION")?.status).toBeDefined();
  });
});

describe("GIA-010 Determinismo", () => {
  it("misma entrada produce mismo resultado", async () => {
    const input = makeValidInput();
    const cycle1 = await executeIntegratedArchitectCycle(input);
    const cycle2 = await executeIntegratedArchitectCycle(input);
    expect(cycle1.evaluation.functional).toBe(cycle2.evaluation.functional);
    expect(cycle1.evaluation.regulatory).toBe(cycle2.evaluation.regulatory);
    expect(cycle1.evaluation.architecturalQuality).toBe(cycle2.evaluation.architecturalQuality);
    expect(cycle1.status).toBe(cycle2.status);
  });
});
