import { describe, expect, it } from "vitest";
import { generateVerifiedResidentialPlan } from "./residentialConstructivePlan";
import { validateA30Verification, verifyAccessibleRouteA30 } from "./a30AccessibleRouteVerification";

describe("A30 automated accessible-route verification", () => {
  it("verifies explicit route evidence while preserving incomplete vertical transitions", () => {
    const result = verifyAccessibleRouteA30(generateVerifiedResidentialPlan());
    expect(result.status).toBe("INCOMPLETE");
    expect(result.checks.find((check) => check.id === "A30-NODES")?.state).toBe("PASS");
    expect(result.checks.find((check) => check.id === "A30-WIDTH")?.state).toBe("PASS");
    expect(result.checks.find((check) => check.id === "A30-CONTINUITY")?.state).toBe("INCOMPLETE");
    expect(result.complianceStatus).toBe("NOT_ASSESSED");
    expect(validateA30Verification(result)).toBe(true);
  });

  it("detects a width conflict only when a jurisdictional profile is supplied", () => {
    const result = verifyAccessibleRouteA30(generateVerifiedResidentialPlan(), undefined, { id: "TEST-PROFILE", jurisdictionRef: "TEST-JURISDICTION", ruleVersion: "TEST-1", clearWidthMinimum: 1.2, sourceRefs: ["TEST-RULE"], humanReviewState: "CONFIRMED" });
    expect(result.accessibilityAssessment.conflicts.some((conflict) => conflict.startsWith("CLEAR_WIDTH_BELOW_PROFILE:"))).toBe(true);
    expect(result.complianceStatus).toBe("NOT_ASSESSED");
    expect(result.noAutomaticApproval).toBe(true);
  });

  it("reports a missing route without fabricating a path or BIM entity", () => {
    const result = verifyAccessibleRouteA30(generateVerifiedResidentialPlan(), "MISSING-ROUTE");
    expect(result.status).toBe("INCOMPLETE");
    expect(result.checks[0].detail).toBe("Route not found");
    expect(result.noBimEntitiesCreated).toBe(true);
    expect(result.decisionCreated).toBeUndefined();
  });

  it("does not claim that route width alone proves accessibility", () => {
    const result = verifyAccessibleRouteA30(generateVerifiedResidentialPlan());
    expect(result.checks.find((check) => check.id === "A30-WIDTH")?.detail).toContain("normative sufficiency is not assessed");
    expect(result.accessibilityAssessment.complianceStatus).toBe("NOT_ASSESSED");
  });
});
