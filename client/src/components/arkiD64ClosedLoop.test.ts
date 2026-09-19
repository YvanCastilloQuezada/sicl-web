import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";

describe("D6.4 closed loop", () => {
  it("mutates generated candidates through the existing controlled S2 adapter", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d63 = synthesizeD63Candidates(d62.synthesis.contextualStrategies);
    const result = runD64ClosedLoop(d63.candidates);
    expect(result.l7).toBe("DEMONSTRATED");
    expect(result.evaluations.length).toBe(d63.candidates.length);
    expect(result.evaluations.some((evaluation) => evaluation.feasible)).toBe(true);
    expect(result.evaluations.every((evaluation) => evaluation.humanReviewRequired)).toBe(true);
  });

  it("keeps unknown consequences and prevents an automatic winner", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const result = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    expect(result.automaticWinner).toBe("NONE");
    expect(result.humanDecisionRequired).toBe(true);
    expect(result.evaluations.every((evaluation) => evaluation.newDeficits.length > 0)).toBe(true);
  });
});
