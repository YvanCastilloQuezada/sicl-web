import { describe, expect, it } from "vitest";
import { fromV5KnowledgeUnit } from "./arkiKnowledgeStore";
import { ARKI_V5_KNOWLEDGE_UNITS, ARKI_V5_RESEARCH_DELTA, buildV5MutationReassessment, deriveV5JourneyValidity, summarizeV5Delta, validateV5KnowledgeUnit } from "./arkiV5ResearchDelta";

describe("ARKI v5.0 research delta", () => {
  it("preserves incremental research status and does not activate HAZARD as a primitive", () => {
    expect(ARKI_V5_RESEARCH_DELTA.implementationAuthority).toBe("RESEARCH_CHECKPOINT_ONLY");
    expect(ARKI_V5_RESEARCH_DELTA.hazardPrimitive).toBe("CANDIDATE_NOT_IMPLEMENTED");
    expect(ARKI_V5_RESEARCH_DELTA.noParallelEngine).toBe(true);
    expect(ARKI_V5_KNOWLEDGE_UNITS.every(validateV5KnowledgeUnit)).toBe(true);
  });

  it("derives journey validity and preserves missing evidence", () => {
    const journey = deriveV5JourneyValidity({ journeyId: "J-1", subjectId: "WASTE", segments: [{ id: "S-1", from: "KITCHEN", to: "WASTE", subjectId: "WASTE", process: "dirty return", interfaceIds: ["DOOR-1"], conditionRequirements: ["controlled"], controls: ["door"], temporalRole: "TRAVEL", evidence: [{ id: "E-1", source: "candidate geometry", evidenceState: "SOURCE_DERIVED_HYPOTHESIS" }] }], requiredConditions: ["capacity", "cleaning"], missingEvidence: ["cleaning protocol"], status: "VALIDATED" });
    expect(journey.derivedView).toBe(true);
    expect(journey.status).toBe("PARTIAL");
  });

  it("scopes mutation reevaluation rather than re-evaluating everything", () => {
    const reassessment = buildV5MutationReassessment({ mutationId: "M-1", changedElementIds: ["WASTE"], affectedCapabilityIds: ["WASTE"], affectedScenarioIds: ["MAINTENANCE"], reevaluatedClaimIds: ["WASTE_GEOMETRY"], preservedClaimIds: ["DINING"], unknownClaimIds: ["RNE"] });
    expect(reassessment.humanReviewRequired).toBe(true);
    expect(reassessment.preservedClaimIds).toContain("DINING");
  });

  it("maps v5 units into K4 as source-derived candidates", () => {
    const record = fromV5KnowledgeUnit(ARKI_V5_KNOWLEDGE_UNITS[0]);
    expect(record.origin).toBe("SOURCE_DERIVED");
    expect(record.validation).toBe("CANDIDATE");
    expect(record.noAutomaticDecision).toBe(true);
  });

  it("reports v5 counts", () => {
    const summary = summarizeV5Delta();
    expect(summary.version).toBe("5.0");
    expect(summary.knowledgeUnits).toBe(5);
    expect(summary.invariantCount).toBe(38);
    expect(summary.hazardPrimitive).toBe("CANDIDATE_NOT_IMPLEMENTED");
  });
});
