import { describe, expect, it } from "vitest";
import {
  assessPerformanceEvidence,
  buildIntegratedTrace,
  buildP8NegativeControls,
  createCleanProjectBoundary,
  createIntegratedDecisionTrace,
  validateIntegratedPracticeBoundary,
} from "./arkiIntegratedPracticeBoundary";

describe("P8.1 integrated practice boundary", () => {
  it("rejects historical UPAO contamination and answer-key leakage", () => {
    const result = buildP8NegativeControls();
    expect(result.contaminatedRejected).toBe(true);
    expect(result.answerKeyRejected).toBe(true);
  });

  it("requires the complete purpose-to-canonical trace", () => {
    const result = buildIntegratedTrace("PROJECT-B", [
      { traceId: "t-purpose", stage: "PURPOSE", entityId: "purpose", derivedFrom: [], sourceRefs: ["client"], state: "INPUT", epistemicState: "HUMAN_CONFIRMED" },
      { traceId: "t-requirement", stage: "REQUIREMENT", entityId: "requirement", derivedFrom: ["purpose"], sourceRefs: ["client"], state: "DERIVED", epistemicState: "DERIVED" },
      { traceId: "t-program", stage: "PROGRAM", entityId: "program", derivedFrom: ["requirement"], sourceRefs: ["a21"], state: "DERIVED", epistemicState: "DERIVED" },
      { traceId: "t-relationship", stage: "RELATIONSHIP", entityId: "relationship", derivedFrom: ["program"], sourceRefs: ["a21"], state: "DERIVED", epistemicState: "DERIVED" },
      { traceId: "t-candidate", stage: "CANDIDATE", entityId: "candidate", derivedFrom: ["relationship"], sourceRefs: ["gdi"], state: "DERIVED", epistemicState: "HYPOTHESIS" },
      { traceId: "t-model", stage: "CANONICAL_MODEL", entityId: "model", derivedFrom: ["candidate"], sourceRefs: ["s1"], state: "OBSERVED", epistemicState: "HYPOTHESIS" },
    ]);
    expect(result.state).toBe("PASS");
    expect(result.missingStages).toEqual([]);
  });

  it("does not promote proxy performance to compliance", () => {
    const result = assessPerformanceEvidence([{ evidenceId: "proxy", metric: "daylight", evidenceClass: "PROXY", sourceRefs: ["open-meteo"], independentlyValidated: false, humanReviewState: "PENDING_HUMAN_REVIEW" }]);
    expect(result.state).toBe("PASS_WITH_OBSERVATIONS");
    expect(result.noAutomaticCompliance).toBe(true);
  });

  it("validates the integrated boundary only with explicit safeguards", () => {
    const boundary = createCleanProjectBoundary("PROJECT-B", [{ id: "client-purpose", kind: "CLIENT_FACT", statement: "Design a community building", state: "PROJECT_FACT", sourceRefs: ["client-brief"] }]);
    const trace = buildIntegratedTrace("PROJECT-B", ["PURPOSE", "REQUIREMENT", "PROGRAM", "RELATIONSHIP", "CANDIDATE", "CANONICAL_MODEL"].map((stage, index) => ({ traceId: `trace-${index}`, stage, entityId: `entity-${index}`, derivedFrom: index ? [`entity-${index - 1}`] : [], sourceRefs: ["source"], state: index === 0 ? "INPUT" as const : "DERIVED" as const, epistemicState: index === 0 ? "PROJECT_FACT" as const : "HYPOTHESIS" as const })));
    const coordination = { projectId: "PROJECT-B", state: "PASS_WITH_OBSERVATIONS" as const, disciplineStates: { ARCHITECTURE: "REQUIRES_SPECIALIST_REVIEW" as const }, affectedSystems: [], missingEvidence: ["specialist review"], specialistReviewRequired: true as const, noAutomaticApproval: true as const, provenance: ["test"] };
    const performance = assessPerformanceEvidence([]);
    const decision = createIntegratedDecisionTrace("PROJECT-B", ["Human architect must confirm the selected branch"]);
    expect(validateIntegratedPracticeBoundary(boundary, trace, coordination, performance, decision)).toBe(true);
  });
});
