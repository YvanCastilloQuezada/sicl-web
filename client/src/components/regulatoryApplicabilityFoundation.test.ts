import { describe, expect, it } from "vitest";
import { assessRegulatoryApplicability, buildAccessibilityRegulatoryTrace, confirmApplicability, preserveRegulatoryConflict, validateRegulatoryFoundation, type RegulatoryRequirementReference, type RegulatorySourceReference } from "./regulatoryApplicabilityFoundation";
import type { AccessibilityRouteInput } from "./accessibilityAssessment";

const source: RegulatorySourceReference = { sourceId: "TEST-ACCESSIBILITY-RULE-01", sourceTitle: "Synthetic controlled accessibility fixture", sourceType: "TECHNICAL_STANDARD", issuingAuthority: "TEST_AUTHORITY", jurisdiction: "TEST_JURISDICTION", publicationDate: "2026-01-01", effectiveDate: "2026-02-01", version: "TEST_V1", amendmentReference: "TEST_AMENDMENT_NONE", sourceLocator: "fixture://TEST-ACCESSIBILITY-RULE-01#section-1", provenance: ["TEST_FIXTURE", "HUMAN_SUPPLIED_TEST_INPUT", "NOT_REAL_REGULATION", "NOT_LEGAL_ADVICE"], verificationState: "VERIFIED", humanReviewState: "CONFIRMED" };
const requirement: RegulatoryRequirementReference = { requirementId: "TEST-REQ-WIDTH-01", sourceId: source.sourceId, sourceLocator: "fixture://TEST-ACCESSIBILITY-RULE-01#section-1", subject: "ROUTE_CLEAR_WIDTH", parameter: "clear_width", operator: ">=", value: 1.2, unit: "m", tolerance: "NONE_AS_EXPLICITLY_MODELED", conditions: ["TEST_ONLY"], applicability: "UNKNOWN", epistemicState: "IDENTIFIED", provenance: ["TEST_FIXTURE", "HUMAN_SUPPLIED_TEST_INPUT"], humanReviewState: "PENDING_HUMAN_REVIEW" };
const route: AccessibilityRouteInput = { routeId: "ROUTE-01", originNodeId: "ACCESS-01", destinationNodeId: "SPACE-01", edgeIds: ["EDGE-01"], profile: { id: "TEST-PROFILE", jurisdictionRef: "TEST_JURISDICTION", ruleVersion: "TEST_V1", sourceRefs: [source.sourceId], humanReviewState: "CONFIRMED" }, measurements: { "EDGE-01": { clearWidth: 1.4, evidenceRefs: ["measurement://EDGE-01"] } }, humanReviewState: "PENDING_HUMAN_REVIEW" };

describe("A20-P3R regulatory applicability foundation", () => {
  it("represents a complete synthetic source and candidate applicability", () => {
    const result = assessRegulatoryApplicability(source, requirement, { jurisdiction: "TEST_JURISDICTION", spatialScope: "edificacion", projectUseType: "TEST_USE", projectStage: "TEST_STAGE" }, ["regulatory-evidence://fixture-1"]);
    expect(result.state).toBe("APPLICABLE_CANDIDATE");
    expect(result.humanReviewState).toBe("PENDING_HUMAN_REVIEW");
    expect(validateRegulatoryFoundation(source, requirement, result)).toBe(true);
    expect(result.complianceStatus).toBe("NOT_ASSESSED");
    expect(confirmApplicability(result, true).state).toBe("HUMAN_CONFIRMED_APPLICABLE");
  });

  it("preserves missing jurisdiction and version as insufficient context", () => {
    const incomplete = { ...source, jurisdiction: undefined, version: undefined, verificationState: "UNKNOWN" as const, humanReviewState: "NOT_STARTED" as const };
    const result = assessRegulatoryApplicability(incomplete, requirement, { spatialScope: "edificacion", projectUseType: "TEST_USE", projectStage: "TEST_STAGE" });
    expect(result.state).toBe("INSUFFICIENT_CONTEXT");
    expect(result.missingContext).toEqual(expect.arrayContaining(["JURISDICTION", "SOURCE_JURISDICTION", "SOURCE_VERSION", "SOURCE_VERIFICATION"]));
    expect(result.complianceStatus).toBe("NOT_ASSESSED");
  });

  it("does not apply a source from a wrong jurisdiction", () => {
    const result = assessRegulatoryApplicability(source, requirement, { jurisdiction: "OTHER_JURISDICTION", spatialScope: "edificacion", projectUseType: "TEST_USE", projectStage: "TEST_STAGE" });
    expect(result.state).toBe("NOT_APPLICABLE");
    expect(result.reasons).toContain("JURISDICTION_MISMATCH");
    expect(result.noAutomaticApproval).toBe(true);
  });

  it("preserves conflicting requirements and never chooses an automatic winner", () => {
    const conflict = preserveRegulatoryConflict([requirement, { ...requirement, requirementId: "TEST-REQ-WIDTH-02", sourceId: "TEST-ACCESSIBILITY-RULE-02", value: 1.5 }], "Synthetic contradiction for controlled test");
    expect(conflict?.state).toBe("CONFLICT_PRESERVED");
    expect(conflict?.automaticWinner).toBe(false);
    expect(conflict?.humanReviewRequired).toBe(true);
  });

  it("links A20-P2 route evidence without turning it into compliance", () => {
    const trace = buildAccessibilityRegulatoryTrace(route, [requirement.requirementId], [source.sourceId, "regulatory-evidence://fixture-1"]);
    expect(trace.routeId).toBe("ROUTE-01");
    expect(trace.jurisdictionRef).toBe("TEST_JURISDICTION");
    expect(trace.ruleVersion).toBe("TEST_V1");
    expect(trace.requirementRefs).toEqual([requirement.requirementId]);
    expect(trace.evidenceRefs).toContain("measurement://EDGE-01");
    expect(trace.complianceStatus).toBe("NOT_ASSESSED");
  });
});
