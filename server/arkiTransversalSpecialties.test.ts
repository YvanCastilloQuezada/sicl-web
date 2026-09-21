import { describe, expect, it } from "vitest";
import { ARKI_SPECIALTY_PROJECT_PROFILES, ARKI_TRANSVERSAL_SPECIALTIES, buildSpecialtyCoordinationPlan, validateAuthorizedExchangeHost } from "./arkiTransversalSpecialties";
import { buildProfessionalReviewGate, professionalAuthorityContract, recordProfessionalReview } from "./arkiProfessionalReview";

describe("ARKI transversal specialty system", () => {
  it("covers hospital and airport profiles from the supplied specialist list", () => {
    expect(ARKI_TRANSVERSAL_SPECIALTIES.length).toBeGreaterThanOrEqual(40);
    expect(ARKI_SPECIALTY_PROJECT_PROFILES.HOSPITAL).toContain("MEDICAL-GASES");
    expect(ARKI_SPECIALTY_PROJECT_PROFILES.HOSPITAL).toContain("SOMA");
    expect(ARKI_SPECIALTY_PROJECT_PROFILES.AIRPORT).toContain("AIRSIDE");
    expect(ARKI_SPECIALTY_PROJECT_PROFILES.AIRPORT).toContain("PASSENGER-FLOW");
  });

  it("blocks a country plan without verified normative sources", () => {
    const plan = buildSpecialtyCoordinationPlan("HOSPITAL", { country: "PE", codeFamilies: ["RNE"], sourceIds: [] });
    expect(plan.status).toBe("BLOCKED_UNKNOWN");
    expect(plan.unknowns).toContain("No verified normative sources were supplied");
  });

  it("requires host capabilities before claiming Revit/Dynamo/IFC validation", () => {
    expect(validateAuthorizedExchangeHost({ format: "RVT", capabilities: ["revit-export"] }).status).toBe("HOST_CAPABILITIES_INSUFFICIENT");
    expect(validateAuthorizedExchangeHost({ format: "DYN", hostId: "revit-host-01", hostVersion: "2026", capabilities: ["dynamo-run", "revit-transaction-guard"] }).status).toBe("HOST_CAPABILITIES_SUFFICIENT");
  });

  it("preserves specialist review and external signature as final authority", () => {
    expect(professionalAuthorityContract().performanceClaim).toContain("No accuracy percentage");
    expect(buildProfessionalReviewGate({ projectId: "H-1", specialtyId: "STRUCTURAL", role: "STRUCTURAL_ENGINEER", packageVersion: "v1", evidenceIds: [], calculations: [], openUnknowns: [] }).status).toBe("NOT_READY");
    const review = recordProfessionalReview({ projectId: "H-1", specialtyId: "STRUCTURAL", role: "STRUCTURAL_ENGINEER", packageVersion: "v1", evidenceIds: ["calc-1"], calculations: ["structural-model-1"], openUnknowns: [], proposedCorrections: [], reviewerIdentity: "Engineer A", licenseOrCredentialReference: "LICENSE-1", decision: "ACCEPT" });
    expect(review.status).toBe("APPROVED_FOR_SIGNATURE");
    expect(review.signatureState).toBe("EXTERNAL_SIGNATURE_REQUIRED");
    expect(review.signed).toBe(false);
  });
});
