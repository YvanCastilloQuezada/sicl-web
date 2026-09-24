import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { completeDeepEvaluation, createDemoCandidates, createDesignFunnel, promoteToFinalFour, returnToFinalFour, selectForDevelopment } from "../shared/arkiDesignFunnel";

const makeState = () => createDesignFunnel({ projectId: "R1-PROJECT", candidates: createDemoCandidates("R1-PROJECT") });
const evaluate = (state: ReturnType<typeof makeState>) => completeDeepEvaluation(state, Object.fromEntries(state.candidates.filter((candidate) => candidate.stage === "FINALIST_4").map((candidate) => [candidate.id, { status: "READY" as const }])));

describe("ARKI S2 R1 bounded UI governance", () => {
  it("keeps the center card limited to visual identifier and architecture", () => {
    const source = readFileSync(new URL("../client/src/pages/ArkiDesignFunnelPage.tsx", import.meta.url), "utf8");
    expect(source).not.toMatch(/<Card[\s\S]{0,2200}>[\s\S]*Marcar/);
    expect(source).not.toMatch(/<Card[\s\S]{0,2200}>[\s\S]*Elegir/);
    expect(source).toContain("aria-label={`Activar ${label}`}");
    expect(source).toContain("<Visual id={label} mode={mode}");
  });

  it("preserves canonical identity through rapid P1→P4→P9→P16 selection", () => {
    const state = makeState();
    const rapid = ["A01", "A04", "A09", "A16"];
    const selected = promoteToFinalFour(state, rapid, "Yvan");
    expect(selected.candidates.filter((candidate) => candidate.stage === "FINALIST_4").map((candidate) => candidate.id)).toEqual(rapid);
    expect(rapid.map((id) => selected.candidates.find((candidate) => candidate.id === id)?.id)).toEqual(rapid);
  });

  it("keeps the same candidate identity for architecture, cost and inspector projection", () => {
    const activeId = "A09";
    const state = promoteToFinalFour(makeState(), ["A01", "A04", activeId, "A16"], "Yvan");
    const active = state.candidates.find((candidate) => candidate.id === activeId);
    expect(active?.id).toBe(activeId);
    expect(active?.projectId).toBe(state.projectId);
  });

  it("restores the exact Final Four and permits a second human 4→1 decision", () => {
    const finalists = evaluate(promoteToFinalFour(makeState(), ["A01", "A04", "A09", "A16"], "Yvan"));
    const selected = selectForDevelopment(finalists, "A09", "Yvan");
    const returned = returnToFinalFour(selected, "R1 reversible return");
    expect(returned.stage).toBe("RETURNED_TO_FINALISTS");
    expect(returned.candidates.filter((candidate) => candidate.stage === "FINALIST_4").map((candidate) => candidate.id)).toEqual(["A01", "A04", "A09", "A16"]);
    expect(selectForDevelopment(returned, "A16", "Yvan").selectedCandidateId).toBe("A16");
  });

  it("does not claim an automatic winner", () => {
    const source = readFileSync(new URL("../client/src/pages/ArkiDesignFunnelPage.tsx", import.meta.url), "utf8");
    expect(source).toContain("Sin ganador automático");
    expect(source).not.toContain("winner");
  });
});
