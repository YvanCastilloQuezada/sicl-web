import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { verifyD71Effects } from "./arkiD71EffectVerification";

describe("D7.1 closed-loop effect verification", () => {
  it("verifies expected versus actual geometric effects and dependency closure", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const result = verifyD71Effects(d64);
    expect(result.gate).toBe("PASS");
    expect(result.l8).toBe("DEMONSTRATED");
    expect(result.observations.length).toBe(4);
    expect(result.observations.every((item) => item.evidence.length > 0)).toBe(true);
    expect(result.observations.every((item) => item.unknown.length > 0)).toBe(true);
  });

  it("proves local success is not global success", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const result = verifyD71Effects(runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates));
    expect(result.adversarialLocalSuccess.present).toBe(true);
    expect(result.adversarialLocalSuccess.reason).toContain("no unconditional success");
  });
});
