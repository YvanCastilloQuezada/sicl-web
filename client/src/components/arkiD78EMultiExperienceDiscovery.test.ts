import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { verifyD71Effects } from "./arkiD71EffectVerification";
import { runD78EMultiExperienceDiscovery } from "./arkiD78EMultiExperienceDiscovery";

describe("D7.8E multi-experience discovery", () => {
  it("compares multiple experiences without supplying a target pattern", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const d71 = verifyD71Effects(d64);
    const result = runD78EMultiExperienceDiscovery(d71.observations, ["freshReadback", "bounded S2 mutation", "dependency UNKNOWN"]);
    expect(result.experiences.length).toBe(3);
    expect(result.antiFixture).toBe(true);
    expect(result.oracleLeakage).toBe(false);
    expect(result.repeat.repeat).toBe("PASS");
    expect(result.variant.variant).toBe("PASS");
    expect(result.counterexample.counterexample).toBe("PASS");
  });

  it("does not promote repeated execution effects to architectural learning", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const result = runD78EMultiExperienceDiscovery(verifyD71Effects(d64).observations, []);
    expect(result.patterns.every((pattern) => pattern.classification !== "NOVEL_PATTERN_CANDIDATE")).toBe(true);
    expect(result.learningCandidate).toBeNull();
    expect(result.k1).toBe("NOT_CREATED");
    expect(result.gate).toBe("NO_VALID_LEARNING_EVENT_OBSERVED");
  });
});
