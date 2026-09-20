import { describe, expect, it } from "vitest";
import { replayP81WithP82Semantics, runP82AdversarialCases } from "./arkiP82SemanticGate";

describe("P8.2 applicability, sufficiency and legitimate non-plurality", () => {
  it("reclassifies the real P8.1 replay without changing project facts", () => {
    const replay = replayP81WithP82Semantics();
    expect(replay.p81Preserved).toBe(true);
    expect(replay.after.d62.result).toBe("SINGLE_FEASIBLE_OPTION");
    expect(replay.after.d72.result).toBe("NOT_APPLICABLE");
    expect(replay.after.coordination.result).toBe("SPECIALIST_INPUT_REQUIRED");
    expect(replay.after.performance.result).toBe("PARTIAL");
    expect(replay.after.humanDecision.result).toBe("HUMAN_DECISION_REQUIRED");
    expect(replay.projectStatus).toBe("INTEGRATED_CHAIN_DEMONSTRATED_WITH_EXTERNAL_DEPENDENCIES");
    expect(replay.acceptance).toBe(true);
    expect(replay.noStrategyExpansion).toBe(true);
    expect(replay.noCandidateFabrication).toBe(true);
    expect(replay.noK1).toBe(true);
  });

  it("distinguishes capability failure from legitimate non-plurality", () => {
    const cases = runP82AdversarialCases();
    expect(cases.generationFailure.result).toBe("CAPABILITY_FAILURE");
    expect(cases.legitimateSingle.result).toBe("SINGLE_FEASIBLE_OPTION");
    expect(cases.comparisonCapabilityFailure.result).toBe("CAPABILITY_FAILURE");
    expect(cases.comparisonNotApplicable.result).toBe("NOT_APPLICABLE");
  });

  it("preserves external and human authority boundaries", () => {
    const cases = runP82AdversarialCases();
    expect(cases.specialistInputRequired.result).toBe("SPECIALIST_INPUT_REQUIRED");
    expect(cases.capabilityGap.result).toBe("CAPABILITY_FAILURE");
    expect(cases.humanDecisionRequired.result).toBe("HUMAN_DECISION_REQUIRED");
  });

  it("separates missing specialist input from an absent coordination capability", () => {
    const cases = runP82AdversarialCases();
    expect(cases.specialistBoundaryWithCapability.result).toBe("SPECIALIST_INPUT_REQUIRED");
    expect(cases.specialistBoundaryWithCapability.capabilityAvailable).toBe(true);
    expect(cases.specialistBoundaryWithoutCapability.result).toBe("CAPABILITY_FAILURE");
    expect(cases.specialistBoundaryWithoutCapability.capabilityAvailable).toBe(false);
    expect(cases.specialistBoundaryWithCapability.nextResolutionPath.join(" ")).toContain("Supply project-specific specialist data");
    expect(cases.specialistBoundaryWithoutCapability.nextResolutionPath.join(" ")).toContain("missing coordination representation capability");
  });
});
