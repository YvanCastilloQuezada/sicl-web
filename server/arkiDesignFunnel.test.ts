import { describe, expect, it } from "vitest";
import { createDemoCandidates, createDesignFunnel, completeDeepEvaluation, promoteToFinalFour, selectForDevelopment, returnToFinalFour, setComparisonMode } from "../shared/arkiDesignFunnel";

const makeState = () => createDesignFunnel({ projectId: "P-001", candidates: createDemoCandidates("P-001"), timestamp: "2026-01-01T00:00:00.000Z" });

describe("ARKI Design Funnel S1", () => {
  it("creates the canonical 16-candidate waiting state", () => {
    const state = makeState();
    expect(state.candidates).toHaveLength(16);
    expect(state.waitState).toBe("AWAITING_16_TO_4_SELECTION");
  });
  it("requires exactly four human-selected candidates", () => {
    expect(() => promoteToFinalFour(makeState(), ["A01", "A02", "A03"], "Yvan")).toThrow("SELECTION_REQUIRES_4");
    expect(() => promoteToFinalFour(makeState(), ["A01", "A01", "A02", "A03"], "Yvan")).toThrow("DUPLICATE_CANDIDATE_SELECTION");
  });
  it("promotes four and preserves the other twelve", () => {
    const state = promoteToFinalFour(makeState(), ["A01", "A07", "A11", "A14"], "Yvan", "Comparación de patios y circulación");
    expect(state.stage).toBe("FINALIST_4");
    expect(state.candidates.filter((candidate) => candidate.stage === "FINALIST_4")).toHaveLength(4);
    expect(state.candidates.filter((candidate) => candidate.stage === "ARCHIVED")).toHaveLength(12);
    expect(state.events[0].type).toBe("HUMAN_DESIGN_SELECTION");
  });
  it("rejects cross-project and stale selections", () => {
    const state = makeState();
    const foreign = { ...state.candidates[0], projectId: "OTHER" };
    expect(() => promoteToFinalFour({ ...state, candidates: [foreign, ...state.candidates.slice(1)] }, ["A01", "A02", "A03", "A04"], "Yvan")).toThrow("CROSS_PROJECT_SELECTION");
    const finalists = promoteToFinalFour(state, ["A01", "A02", "A03", "A04"], "Yvan");
    expect(() => promoteToFinalFour(finalists, ["A01", "A02", "A03", "A04"], "Yvan")).toThrow("INVALID_16_TO_4_STAGE");
  });
  it("requires deeper evaluation before the 4-to-1 decision", () => {
    const finalists = promoteToFinalFour(makeState(), ["A01", "A02", "A03", "A04"], "Yvan");
    expect(() => selectForDevelopment(finalists, "A01", "Yvan")).toThrow("INVALID_4_TO_1_STAGE");
    const evaluated = completeDeepEvaluation(finalists, { A01: { status: "READY", findings: ["Buena circulación"] }, A02: { status: "READY" }, A03: { status: "READY" }, A04: { status: "BLOCKED", findings: ["Solver estructural no disponible"] } });
    expect(evaluated.waitState).toBe("AWAITING_4_TO_1_SELECTION");
    expect(evaluated.candidates.find((candidate) => candidate.id === "A04")?.stage).toBe("BLOCKED");
  });
  it("selects one without automatic winner and preserves three finalists", () => {
    const evaluated = completeDeepEvaluation(promoteToFinalFour(makeState(), ["A01", "A02", "A03", "A04"], "Yvan"), { A01: { status: "READY" }, A02: { status: "READY" }, A03: { status: "READY" }, A04: { status: "READY" } });
    const selected = selectForDevelopment(evaluated, "A03", "Yvan");
    expect(selected.stage).toBe("SELECTED_FOR_DEVELOPMENT");
    expect(selected.selectedCandidateId).toBe("A03");
    expect(selected.candidates.filter((candidate) => candidate.stage === "ARCHIVED")).toHaveLength(15);
    expect(selected.events.filter((event) => event.type === "HUMAN_DESIGN_SELECTION")).toHaveLength(2);
  });
  it("supports reversible return to the Final Four", () => {
    const evaluated = completeDeepEvaluation(promoteToFinalFour(makeState(), ["A01", "A02", "A03", "A04"], "Yvan"), { A01: { status: "READY" }, A02: { status: "READY" }, A03: { status: "READY" }, A04: { status: "READY" } });
    const selected = selectForDevelopment(evaluated, "A03", "Yvan");
    const returned = returnToFinalFour(selected, "Falla técnica crítica detectada");
    expect(returned.stage).toBe("RETURNED_TO_FINALISTS");
    expect(returned.candidates.filter((candidate) => candidate.stage === "FINALIST_4")).toHaveLength(4);
  });
  it("exposes only implemented comparison modes", () => {
    expect(setComparisonMode(makeState(), "PLAN").comparisonMode).toBe("PLAN");
    expect(() => setComparisonMode(makeState(), "DAYLIGHT")).toThrow("COMPARISON_MODE_NOT_IMPLEMENTED");
  });
});
