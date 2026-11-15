import { describe, expect, it } from "vitest";
import {
  createDesignFunnel,
  createDemoCandidates,
  funnelLimitsForStep,
  promoteToFinalFour,
  promoteToSixteen,
  promoteToNine,
  selectForDevelopment,
  completeDeepEvaluation,
  FUNNEL_STEPS,
  type FunnelStep,
} from "./arkiDesignFunnel";

function candidatesFor(step: FunnelStep) {
  // createDemoCandidates devuelve 9. Para 16 o 25, extendemos con copias.
  const base = createDemoCandidates("TEST-PROJECT");
  if (step <= base.length) return base.slice(0, step);
  return Array.from({ length: step }, (_, index) => ({
    ...base[index % base.length],
    id: `C-${String(index + 1).padStart(2, "0")}`,
    variantId: `V-${index % 4}`,
    shapeType: ["COURTYARD", "L_SHAPE", "U_SHAPE", "LINEAR"][index % 4],
    floors: 3 + (index % 8),
  }));
}

describe("Funnel 16→4→1", () => {
  it("funnelLimitsForStep devuelve los límites correctos", () => {
    expect(funnelLimitsForStep(1)).toEqual({ explorer: 1, finalists: 1, selected: 1 });
    expect(funnelLimitsForStep(4)).toEqual({ explorer: 4, finalists: 1, selected: 1 });
    expect(funnelLimitsForStep(9)).toEqual({ explorer: 9, finalists: 4, selected: 1 });
    expect(funnelLimitsForStep(16)).toEqual({ explorer: 16, finalists: 4, selected: 1 });
    expect(funnelLimitsForStep(25)).toEqual({ explorer: 25, finalists: 4, selected: 1 });
  });

  it("FUNNEL_STEPS contiene 1, 4, 9, 16, 25", () => {
    expect(FUNNEL_STEPS).toEqual([1, 4, 9, 16, 25]);
  });

  it("createDesignFunnel acepta 9 (default)", () => {
    const state = createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(9),
    });
    expect(state.stage).toBe("DESIGN_EXPLORER_9");
    expect(state.waitState).toBe("AWAITING_9_TO_4_SELECTION");
    expect(state.candidates).toHaveLength(9);
  });

  it("createDesignFunnel acepta 16 explícito", () => {
    const state = createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(16),
      step: 16,
    });
    expect(state.candidates).toHaveLength(16);
    expect(state.stage).toBe("DESIGN_EXPLORER_16");
    expect(state.waitState).toBe("AWAITING_16_TO_9_SELECTION");
  });

  it("createDesignFunnel acepta 25 explícito", () => {
    const state = createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(25),
      step: 25,
    });
    expect(state.candidates).toHaveLength(25);
    expect(state.stage).toBe("DESIGN_EXPLORER_25");
    expect(state.waitState).toBe("AWAITING_25_TO_16_SELECTION");
  });

  it("createDesignFunnel rechaza 12 (no es step válido)", () => {
    // candidatesFor(16).slice(0, 12) devuelve 12 candidatos, que NO es un step válido.
    expect(() => createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(16).slice(0, 12),
    })).toThrow(/INVALID_FUNNEL_STEP|FUNNEL_REQUIRES/);
  });

  it("ejecuta las cuatro autorizaciones humanas 25→16→9→4→1", () => {
    const state25 = createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(25),
      step: 25,
    });

    const ids16 = state25.candidates.slice(0, 16).map((c) => c.id);
    const state16 = promoteToSixteen(state25, ids16, "human-1", "Primera selección");
    expect(state16.stage).toBe("DESIGN_EXPLORER_16");
    expect(state16.waitState).toBe("AWAITING_16_TO_9_SELECTION");
    expect(state16.events.at(-1)?.type).toBe("HUMAN_DESIGN_SELECTION");

    const ids9 = state16.candidates
      .filter((c) => c.stage === "DESIGN_EXPLORER_16")
      .slice(0, 9).map((c) => c.id);
    const state9 = promoteToNine(state16, ids9, "human-2", "Segunda selección");
    expect(state9.stage).toBe("DESIGN_EXPLORER_9");
    expect(state9.waitState).toBe("AWAITING_9_TO_4_SELECTION");

    const ids4 = state9.candidates
      .filter((c) => c.stage === "DESIGN_EXPLORER_9")
      .slice(0, 4).map((c) => c.id);
    const state4 = promoteToFinalFour(state9, ids4, "human-3", "Tercera selección");
    expect(state4.stage).toBe("FINALIST_4");
    expect(state4.waitState).toBe("AWAITING_4_TO_1_SELECTION");

    const results = Object.fromEntries(ids4.map((id) => [
      id, { status: "READY" as const, findings: [], unknowns: [] },
    ]));
    const evaluated = completeDeepEvaluation(state4, results);

    const selectedId = ids4[0];
    const winner = selectForDevelopment(evaluated, selectedId, "human-4", "Cuarta selección");
    expect(winner.stage).toBe("SELECTED_FOR_DEVELOPMENT");
    expect(winner.waitState).toBe("NONE");
    expect(winner.selectedCandidateId).toBe(selectedId);

    const decisions = winner.events.filter((event) =>
      event.type === "HUMAN_DESIGN_SELECTION"
    );
    expect(decisions).toHaveLength(4);
    expect(decisions.map((event) =>
      event.type === "HUMAN_DESIGN_SELECTION" ? event.selectionStage : ""
    )).toEqual(["25_TO_16", "16_TO_9", "9_TO_4", "4_TO_1"]);

    expect(winner.candidates).toHaveLength(25);
    expect(winner.candidates.filter((c) => c.stage === "SELECTED_FOR_DEVELOPMENT")).toHaveLength(1);
  });

  it("rechaza saltarse la etapa 25→16", () => {
    const state = createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(25),
      step: 25,
    });
    expect(() => promoteToNine(state, state.candidates.slice(0, 9).map((c) => c.id), "human"))
      .toThrow("INVALID_16_TO_9_STAGE");
    expect(() => promoteToFinalFour(state, state.candidates.slice(0, 4).map((c) => c.id), "human"))
      .toThrow("INVALID_9_TO_4_STAGE");
  });

  it("exige exactamente 16 candidatos en 25→16", () => {
    const state = createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(25),
      step: 25,
    });
    expect(() => promoteToSixteen(state, state.candidates.slice(0, 15).map((c) => c.id), "human"))
      .toThrow("SELECTION_REQUIRES_16");
  });
});
