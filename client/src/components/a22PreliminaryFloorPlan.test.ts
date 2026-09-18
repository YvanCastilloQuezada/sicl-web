import { describe, expect, it } from "vitest";
import { buildHouseA21Proof } from "./a21ArchitecturalProgram";
import { reviewA21Compliance, translateA21ZonesToPreliminaryPlan, validateA22PreliminaryPlan } from "./a22PreliminaryFloorPlan";

describe("A22 preliminary floor plan from A21", () => {
  it("translates validated functional zones into explicit preliminary spaces", () => {
    const plan = translateA21ZonesToPreliminaryPlan(buildHouseA21Proof());
    expect(validateA22PreliminaryPlan(plan)).toBe(true);
    expect(plan.geometryState).toBe("PRELIMINARY_DERIVED");
    expect(plan.spaces.map((space) => space.programItemId)).toEqual(expect.arrayContaining(["LIVING_DINING", "KITCHEN", "MAIN_BEDROOM", "BEDROOM_2", "UPPER_CIRCULATION"]));
    expect(plan.spaces.every((space) => space.source === "A21_ZONE_TRANSLATION")).toBe(true);
  });

  it("checks containment, overlap and minimum dimensions without claiming construction compliance", () => {
    const plan = translateA21ZonesToPreliminaryPlan();
    expect(plan.constraints.filter((item) => item.kind === "CONTAINMENT").every((item) => item.state === "PASS")).toBe(true);
    expect(plan.constraints.filter((item) => item.kind === "OVERLAP").every((item) => item.state === "PASS")).toBe(true);
    expect(plan.constraints.filter((item) => item.kind === "MINIMUM_DIMENSION").every((item) => item.state === "PASS")).toBe(true);
    expect(plan.constraints.find((item) => item.kind === "VERTICAL_CONTINUITY")?.state).toBe("NOT_ASSESSED");
    expect(plan.constructionDocumentation).toBe("NOT_GENERATED");
  });

  it("does not fabricate adjacency or geometry from missing zones", () => {
    const proof = buildHouseA21Proof();
    const plan = translateA21ZonesToPreliminaryPlan({ ...proof, zones: proof.zones.filter((zone) => zone.zoneType !== "PRIVATE") });
    expect(plan.spaces.some((space) => space.zoneId.startsWith("MISSING-PRIVATE"))).toBe(true);
    expect(validateA22PreliminaryPlan(plan)).toBe(true);
  });

  it("reports normative applicability as insufficient context until source and project facts are verified", () => {
    const review = reviewA21Compliance();
    expect(review.overall).toBe("NOT_ASSESSED");
    expect(review.assessments).toHaveLength(3);
    expect(review.assessments.every((assessment) => assessment.state === "INSUFFICIENT_CONTEXT")).toBe(true);
    expect(review.assessments.every((assessment) => assessment.complianceStatus === "NOT_ASSESSED" && assessment.noAutomaticApproval)).toBe(true);
  });
});
