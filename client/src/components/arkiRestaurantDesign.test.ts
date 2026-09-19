import { describe, expect, it } from "vitest";
import { buildRestaurantDesign, evaluateRestaurantAgainstTypology, restaurantAreaSummary, validateRestaurantDesign } from "./arkiRestaurantDesign";

describe("ARKI restaurant 500 on 20x40m lot", () => {
  it("realizes the requested aforo and program geometry", () => {
    const design = buildRestaurantDesign();
    const result = validateRestaurantDesign(design);
    expect(result.sitePass).toBe(true);
    expect(result.aforoPass).toBe(true);
    expect(result.diningSeatCount).toBe(500);
    expect(design.spaces.filter((space) => space.programId === "KITCHEN")).toHaveLength(1);
    expect(design.spaces.filter((space) => space.programId === "STAIR")).toHaveLength(4);
  });

  it("separates public, service and evacuation flows", () => {
    const design = buildRestaurantDesign();
    const result = validateRestaurantDesign(design);
    expect(result.mainAccessPass).toBe(true);
    expect(result.publicCirculationPass).toBe(true);
    expect(result.serviceCirculationPass).toBe(true);
    expect(result.independentEvacuationPass).toBe(true);
    expect(design.spaces.some((space) => space.programId === "SERVICE_RECEIVING")).toBe(true);
    expect(design.spaces.some((space) => space.programId === "SERVICE_CIRCULATION" && space.flow === "SERVICE")).toBe(true);
    expect(design.routes.find((route) => route.id === "SERVICE-ROUTE-N1")?.roomIds).toEqual(["SERVICE-LOADING", "SERVICE-RECEIVING", "SERVICE-SIDE-LANE-N1", "SERVICE-SUPPORT-N1", "KITCHEN-N1"]);
    expect(design.functionalOrganigram.relations.some((relation) => relation.relation === "INDEPENDENT_SERVICE_CIRCUIT")).toBe(true);
  });

  it("records accessible entry, parking, openings and wall thickness", () => {
    const result = validateRestaurantDesign();
    expect(result.parkingPass).toBe(true);
    expect(result.openingEndpointPass).toBe(true);
    expect(result.wallThicknessPass).toBe(true);
    expect(result.evacuationDoorWidthRecorded).toBe(true);
  });

  it("keeps the proposal epistemically honest", () => {
    const design = buildRestaurantDesign();
    const summary = restaurantAreaSummary(design);
    expect(summary.siteM2).toBe(800);
    expect(summary.diningSeats).toBe(500);
    expect(summary.coveredConceptualM2).toBeGreaterThan(900);
    expect(validateRestaurantDesign(design).noClaimOfPermitDocumentation).toBe(true);
    expect(design.validation.humanReviewRequired).toBe(true);
  });

  it("re-evaluates the restaurant profile and requires a spatial area for each operational flow", () => {
    const evaluation = evaluateRestaurantAgainstTypology();
    expect(evaluation.typology).toBe("RESTAURANT");
    expect(evaluation.sourceFamilies).toEqual(["NEUFERT", "PLAZOLA"]);
    expect(evaluation.flowChecks).toHaveLength(7);
    expect(evaluation.flowChecks.every((check) => check.status === "PASS" && check.areaM2 > 0)).toBe(true);
    expect(evaluation.circulationAreas).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "PUBLIC-SPINE-N1", kind: "PUBLIC", widthM: 3 }),
      expect.objectContaining({ id: "SERVICE-SIDE-LANE-N1", kind: "SERVICE", widthM: 3 }),
      expect.objectContaining({ id: "VERTICAL-EGRESS", kind: "EMERGENCY", widthM: 2 }),
    ]));
    expect(evaluation.missingFunctionalAreas).toEqual([]);
    expect(evaluation.humanReviewRequired).toBe(true);
  });

  it("integrates functional units and levels without duplicating the restaurant geometry", () => {
    const design = buildRestaurantDesign();
    expect(design.levels.map((level) => level.levelId)).toEqual(["N1", "N2"]);
    expect(design.levels.every((level) => level.spaceIds.length > 0)).toBe(true);
    expect(design.functionalUnits.map((unit) => unit.functionalUnitId)).toEqual([
      "UNIT-PUBLIC-ARRIVAL",
      "UNIT-PRODUCTION-SERVICE",
      "UNIT-SANITARY-SUPPORT",
      "UNIT-EGRESS-VERTICAL",
    ]);
    expect(design.functionalUnits.find((unit) => unit.functionalUnitId === "UNIT-PUBLIC-ARRIVAL")?.levelIds).toEqual(["N1", "N2"]);
    expect(design.functionalUnits.find((unit) => unit.functionalUnitId === "UNIT-EGRESS-VERTICAL")?.levelIds).toEqual(["N1", "N2"]);
    expect(design.functionalUnits.every((unit) => unit.humanReviewRequired && unit.provenance.length > 0)).toBe(true);
    expect(design.levels.every((level) => level.noGeometryDuplication === undefined)).toBe(true);
  });
});
