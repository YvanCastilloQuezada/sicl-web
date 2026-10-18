import { describe, expect, it } from "vitest";
import { runLocalChaosSuite, runLocalChaosScenario } from "./chaos/ChaosEngine";
import { observeExperience, proposeExperienceOptimization } from "./experience/ExperienceAgent";

describe("Entertainment OS agents", () => {
  it("produces an experience proposal without executing actions", () => {
    const observation = observeExperience([
      { timestamp: "2026-08-27T00:00:00.000Z", eventId: "TRIVIA_DEMO-1", executionId: "exec-1", instanceId: "local", state: "LIVE", action: "QR_READY", result: "OBSERVED", error: null, recovery: null, durationMs: 1000 },
      { timestamp: "2026-08-27T00:00:02.000Z", eventId: "TRIVIA_DEMO-1", executionId: "exec-2", instanceId: "local", state: "LIVE", action: "QR_SCAN", result: "BLOCKED", error: "expired", recovery: null, durationMs: 2000 },
    ]);
    const proposal = proposeExperienceOptimization(observation);
    expect(proposal.mode).toBe("PROPOSE_ONLY");
    expect(proposal.actionsExecuted).toBe(false);
    expect(observation.errors).toBe(1);
  });

  it("runs all controlled chaos scenarios and preserves core", () => {
    const results = runLocalChaosSuite();
    expect(results).toHaveLength(11);
    expect(results.every((result) => result.detected && result.reported && result.coreIntact)).toBe(true);
    expect(runLocalChaosScenario("DATABASE_FAIL").fallback).toBe("SAFE_STOP");
    expect(runLocalChaosScenario("QR_FAIL").fallback).toBe("SAFE_FALLBACK");
  });
});
