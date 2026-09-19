import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { verifyD71Effects } from "./arkiD71EffectVerification";
import { compareD72Candidates } from "./arkiD72ArchitecturalComparison";

describe("D7.2 architectural comparison", () => {
  it("compares at least two feasible candidates before any preference", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const d71 = verifyD71Effects(d64);
    const result = compareD72Candidates(d64, d71);
    expect(result.gate).toBe("PASS");
    expect(result.l9).toBe("DEMONSTRATED");
    expect(result.feasibleSet.length).toBeGreaterThanOrEqual(2);
    expect(result.nonDominatedTradeoffSet.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps comparison separate from selection and judgment", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const result = compareD72Candidates(d64, verifyD71Effects(d64));
    expect(result.automaticWinner).toBe("NONE");
    expect(result.architecturalJudgment).toBe("HUMAN_REQUIRED");
    expect(result.profiles.every((profile) => profile.regulatoryStatus === "UNKNOWN")).toBe(true);
    expect(result.profiles.every((profile) => profile.knownPerformanceEffects === "NOT_EVALUATED")).toBe(true);
  });
});
