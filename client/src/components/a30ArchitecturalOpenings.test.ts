import { describe, expect, it } from "vitest";
import { generateVerifiedResidentialPlan } from "./residentialConstructivePlan";
import { deriveA30OpeningConnections, deriveA30OpeningObservations, legacyOpeningEvidence, openingBindingForSyntheticFixture, summarizeA30OpeningAudit, type A30OpeningEvidence } from "./a30ArchitecturalOpenings";
import { verifyAccessibleRouteA30 } from "./a30AccessibleRouteVerification";

describe("A30 architectural opening intelligence", () => {
  it("classifies legacy HOUSE-001 opening records as partial and not geometrically bound", () => {
    const plan = generateVerifiedResidentialPlan();
    const audit = summarizeA30OpeningAudit(plan);
    expect(audit.classification).toBe("PARTIAL_BUT_REUSABLE");
    expect(audit.existingOpenings).toHaveLength(plan.openings.length);
    expect(audit.existingOpenings.every((opening) => opening.bindingState === "UNKNOWN")).toBe(true);
    expect(audit.existingOpenings.every((opening) => opening.role === "UNKNOWN" && opening.traversability === "UNKNOWN")).toBe(true);
  });

  it("binds a synthetic traversable opening to a real shared A29 boundary", () => {
    const plan = generateVerifiedResidentialPlan();
    const evidence: A30OpeningEvidence = { openingId: "O-001", hostSpaceId: "BATH", relatedSpaceId: "HALL-N2", levelId: "N2", extent: { x1: 3.5, y1: 4, x2: 3.5, y2: 4.8 }, role: "PASSAGE_CANDIDATE", traversability: "TRAVERSABLE", sourceAlternativeId: plan.alternativeId, geometryVersion: "HOUSE-001-EXPLICIT:v1", evidenceRefs: ["TEST_FIXTURE:O-001"], provenance: ["human supplied test fixture"], epistemicState: "FACT", humanReviewState: "REQUIRED" };
    const observation = openingBindingForSyntheticFixture(plan, evidence);
    expect(observation.bindingState).toBe("VALID");
    expect(observation.boundaryId).toBeTruthy();
    const connection = deriveA30OpeningConnections(plan, [observation])[0];
    expect(connection.state).toBe("CONNECTION_OBSERVED");
    expect(connection.traversability).toBe("TRAVERSABLE");
  });

  it("rejects an opening that floats off the claimed boundary", () => {
    const plan = generateVerifiedResidentialPlan();
    const evidence = { ...legacyOpeningEvidence(plan)[2], openingId: "O-OFF", hostSpaceId: "BED-01", relatedSpaceId: "HALL-N2", extent: { x1: 1, y1: 3.6, x2: 1.9, y2: 3.6 }, role: "PASSAGE_CANDIDATE" as const, traversability: "TRAVERSABLE" as const, evidenceRefs: ["TEST_FIXTURE:O-OFF"], provenance: ["human supplied test fixture"] };
    expect(openingBindingForSyntheticFixture(plan, evidence).bindingState).toBe("INVALID");
  });

  it("keeps non-traversable and unknown openings from becoming circulation connections", () => {
    const plan = generateVerifiedResidentialPlan();
    const base = { ...legacyOpeningEvidence(plan)[2], openingId: "O-002", hostSpaceId: "BATH", relatedSpaceId: "HALL-N2", levelId: "N2", extent: { x1: 3.5, y1: 4, x2: 3.5, y2: 4.8 }, role: "UNKNOWN" as const, evidenceRefs: ["TEST_FIXTURE:O-002"], provenance: ["human supplied test fixture"] };
    expect(deriveA30OpeningConnections(plan, [openingBindingForSyntheticFixture(plan, { ...base, traversability: "NON_TRAVERSABLE" })])[0].state).toBe("CONNECTION_UNVERIFIED");
    expect(deriveA30OpeningConnections(plan, [openingBindingForSyntheticFixture(plan, { ...base, openingId: "O-003", traversability: "UNKNOWN" })])[0].state).toBe("CONNECTION_UNVERIFIED");
  });

  it("proves the positive boundary-opening-connection-circulation chain without certifying accessibility", () => {
    const plan = generateVerifiedResidentialPlan();
    const evidence: A30OpeningEvidence[] = [{ ...legacyOpeningEvidence(plan)[2], openingId: "O-004", hostSpaceId: "BATH", relatedSpaceId: "HALL-N2", levelId: "N2", extent: { x1: 3.5, y1: 4, x2: 3.5, y2: 4.8 }, role: "PASSAGE_CANDIDATE", traversability: "TRAVERSABLE", evidenceRefs: ["TEST_FIXTURE:O-004"], provenance: ["human supplied test fixture"] }];
    const routePlan = { ...plan, routes: [{ ...plan.routes[0], roomIds: ["HALL-N2", "BATH"] }] };
    const result = verifyAccessibleRouteA30(routePlan, "ACCESSIBLE-ROUTE-CONCEPT", undefined, evidence);
    expect(result.accessibilityAssessment.complianceStatus).toBe("NOT_ASSESSED");
    expect(result.noAutomaticApproval).toBe(true);
    expect(result.provenance).toContain("A29 ArchitecturalConnectionObservation");
  });
});
