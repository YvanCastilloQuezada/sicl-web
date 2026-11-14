import { describe, expect, it } from "vitest";
import {
  createDesignFunnel,
  createDemoCandidates,
  funnelLimitsForStep,
  promoteToFinalFour,
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
    expect(state.stage).toBe("DESIGN_EXPLORER_9");
  });

  it("createDesignFunnel acepta 25 explícito", () => {
    const state = createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(25),
      step: 25,
    });
    expect(state.candidates).toHaveLength(25);
    expect(state.stage).toBe("DESIGN_EXPLORER_9");
  });

  it("createDesignFunnel rechaza 12 (no es step válido)", () => {
    // candidatesFor(16).slice(0, 12) devuelve 12 candidatos, que NO es un step válido.
    expect(() => createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(16).slice(0, 12),
    })).toThrow(/INVALID_FUNNEL_STEP|FUNNEL_REQUIRES/);
  });

  it("16→4→1 completo", () => {
    const state = createDesignFunnel({
      projectId: "TEST-PROJECT",
      candidates: candidatesFor(16),
      step: 16,
    });
    expect(state.candidates).toHaveLength(16);

    // 16 → 4
    const finalFourIds = state.candidates.slice(0, 4).map((c) => c.id);
    const afterPromote = promoteToFinalFour(state, finalFourIds, "test-human");
    expect(afterPromote.stage).toBe("FINALIST_4");
    expect(afterPromote.waitState).toBe("AWAITING_4_TO_1_SELECTION");
    expect(afterPromote.candidates.filter((c) => c.stage === "FINALIST_4")).toHaveLength(4);

    // Deep evaluation
    const results = Object.fromEntries(finalFourIds.map((id) => [id, { status: "READY" as const, findings: [], unknowns: [] }]));
    const afterEval = completeDeepEvaluation(afterPromote, results);
    expect(afterEval.candidates.filter((c) => c.stage === "FINALIST_4")).toHaveLength(4);

    // 4 → 1
    const selectedId = finalFourIds[0];
    const afterSelect = selectForDevelopment(afterEval, selectedId, "test-human", "chosen");
    expect(afterSelect.stage).toBe("SELECTED_FOR_DEVELOPMENT");
    expect(afterSelect.waitState).toBe("NONE");
    expect(afterSelect.selectedCandidateId).toBe(selectedId);
  });
});
