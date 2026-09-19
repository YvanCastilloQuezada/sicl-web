import { describe, expect, it } from "vitest";
import { buildRnePeruContext, buildRneRequirement, RNE_OFFICIAL_SOURCE_IDS, RNE_PERU_SOURCES, validateRneOfficialSourceRegistry, verifyRnePeruCompliance, type RneHumanComplianceReview, type RneProjectEvidence } from "./rnePeruCompliance";

const review: RneHumanComplianceReview = { reviewerId: "ARCH-PE-001", reviewerRole: "ARCHITECT", confirmationId: "REVIEW-2026-001", reviewedAt: "2026-09-19T00:00:00Z", confirmed: true, reviewState: "CONFIRMED" };
const requirement = buildRneRequirement(RNE_OFFICIAL_SOURCE_IDS.G010, "RNE-G010-RESIDENTIAL-CONTEXT-01", "Project context and applicable design conditions");
const evidence: RneProjectEvidence = { requirementId: requirement.requirementId, result: "PASS", evidenceRefs: ["evidence://UPAO-001/rne/g010/01"], modelRefs: ["CanonicalBuildingModel:UPAO-001:MODEL-01"] };

describe("RNE Peru compliance verification", () => {
  it("registers official Peru sources as verified source metadata", () => {
    expect(validateRneOfficialSourceRegistry()).toBe(true);
    expect(RNE_PERU_SOURCES.map((source) => source.jurisdiction)).toEqual(["PERU", "PERU", "PERU", "PERU"]);
    expect(RNE_PERU_SOURCES.find((source) => source.sourceId === RNE_OFFICIAL_SOURCE_IDS.E030)?.amendmentReference).toBe("RM-217-2026-VIVIENDA");
  });

  it("returns VERIFIED only with complete evidence and confirmed professional review", () => {
    const result = verifyRnePeruCompliance({ context: buildRnePeruContext(), sources: [RNE_PERU_SOURCES[1]], requirements: [requirement], evidence: [evidence], humanReview: review });
    expect(result.status).toBe("VERIFIED");
    expect(result.blockers).toEqual([]);
    expect(result.noAutomaticApproval).toBe(true);
    expect(result.professionalVerificationRequired).toBe(true);
  });

  it("does not mark compliance verified when the human review is missing", () => {
    const result = verifyRnePeruCompliance({ context: buildRnePeruContext(), sources: [RNE_PERU_SOURCES[1]], requirements: [requirement], evidence: [evidence], humanReview: null });
    expect(result.status).toBe("NOT_ASSESSED");
    expect(result.blockers).toContain("HUMAN_COMPLIANCE_REVIEW_REQUIRED");
  });

  it("does not mark a failed geometric/model evidence package verified", () => {
    const result = verifyRnePeruCompliance({ context: buildRnePeruContext(), sources: [RNE_PERU_SOURCES[1]], requirements: [requirement], evidence: [{ ...evidence, result: "FAIL", modelRefs: [] }], humanReview: review });
    expect(result.status).toBe("NOT_ASSESSED");
    expect(result.blockers).toEqual(expect.arrayContaining(["EVIDENCE_NOT_PASS:RNE-G010-RESIDENTIAL-CONTEXT-01", "MODEL_REFERENCE_MISSING:RNE-G010-RESIDENTIAL-CONTEXT-01"]));
  });

  it("preserves unresolved conflicts as a blocker", () => {
    const result = verifyRnePeruCompliance({ context: buildRnePeruContext(), sources: [RNE_PERU_SOURCES[1]], requirements: [requirement], evidence: [evidence], humanReview: review, conflicts: ["conflict:rne:g010:project-use"] });
    expect(result.status).toBe("NOT_ASSESSED");
    expect(result.blockers).toContain("UNRESOLVED_REGULATORY_CONFLICTS");
  });
});
