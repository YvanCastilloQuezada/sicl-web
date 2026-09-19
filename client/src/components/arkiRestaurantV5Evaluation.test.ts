import { describe, expect, it } from "vitest";
import { evaluateRestaurantV5WasteRepair, validateRestaurantV5WasteRepair } from "./arkiRestaurantV5Evaluation";

describe("ARKI v5 restaurant waste repair evaluation", () => {
  it("creates a forked alternative with an explicit waste room", () => {
    const evaluation = evaluateRestaurantV5WasteRepair();
    const result = validateRestaurantV5WasteRepair(evaluation);
    expect(result.alternativeForkCreated).toBe(true);
    expect(result.wasteSpaceAdded).toBe(true);
    expect(result.geometricRepairPass).toBe(true);
  });

  it("adds one route and three openings while preserving the original geometry", () => {
    const evaluation = evaluateRestaurantV5WasteRepair();
    const result = validateRestaurantV5WasteRepair(evaluation);
    expect(result.wasteRouteAdded).toBe(true);
    expect(result.wasteOpeningsAdded).toBe(true);
    expect(result.originalV4GeometryStillComparable).toBe(true);
    expect(result.sameCanonicalSite).toBe(true);
  });

  it("does not convert geometric repair into operational or regulatory certainty", () => {
    const evaluation = evaluateRestaurantV5WasteRepair();
    const result = validateRestaurantV5WasteRepair(evaluation);
    expect(result.operationalUnknownPreserved).toBe(true);
    expect(result.rneUnknownPreserved).toBe(true);
    expect(evaluation.status).toBe("GEOMETRICALLY_RESOLVED_WITH_OPERATIONAL_UNKNOWN");
    expect(result.humanReviewRequired).toBe(true);
    expect(result.noPermitClaim).toBe(true);
  });
});
