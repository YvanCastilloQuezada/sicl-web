import { describe, expect, it } from "vitest";
import { buildRestaurantWasteRepair, validateRestaurantWasteRepair } from "./arkiWasteGeometryRepair";

describe("ARKI automatic bounded waste geometry repair", () => {
  it("creates an explicit waste-return space inside the same canonical site", () => {
    const repair = buildRestaurantWasteRepair();
    const waste = repair.candidate.spaces.find((space) => space.id === "WASTE-RETURN-N1");
    expect(waste?.areaM2).toBe(15);
    expect(waste?.zone).toBe("SERVICE");
    expect(repair.candidate.site).toEqual(repair.original.site);
    expect(repair.candidate.alternativeId).not.toBe(repair.original.alternativeId);
  });

  it("connects kitchen, waste room, support and service lane with actual openings and a route", () => {
    const repair = buildRestaurantWasteRepair();
    expect(repair.candidate.openings.filter((opening) => opening.id.includes("WASTE")).length).toBe(3);
    expect(repair.candidate.routes.some((route) => route.id === "WASTE-RETURN-ROUTE-N1" && route.roomIds.includes("KITCHEN-N1") && route.roomIds.includes("SERVICE-SIDE-LANE-N1"))).toBe(true);
    expect(repair.validation.checks.WASTE_SPACE).toBe("PASS");
    expect(repair.validation.checks.ROUTE_CONTINUITY).toBe("PASS");
    expect(repair.validation.checks.DOOR_CONNECTIONS).toBe("PASS");
  });

  it("resolves geometry without falsely resolving operational or regulatory evidence", () => {
    const repair = buildRestaurantWasteRepair();
    expect(repair.validation.status).toBe("GEOMETRICALLY_RESOLVED");
    expect(repair.validation.checks.OPERATIONAL_CAPACITY).toBe("UNKNOWN");
    expect(repair.validation.checks.RNE_WASTE_COMPLIANCE).toBe("UNKNOWN");
    expect(repair.journey.status).toBe("PARTIAL");
    expect(repair.reassessment.unknownClaimIds).toContain("RNE_WASTE_COMPLIANCE");
  });

  it("preserves the original alternative and exposes dependency-scoped reassessment", () => {
    const repair = buildRestaurantWasteRepair();
    expect(repair.original.spaces.some((space) => space.id === "WASTE-RETURN-N1")).toBe(false);
    expect(repair.candidate.spaces.some((space) => space.id === "WASTE-RETURN-N1")).toBe(true);
    expect(repair.reassessment.affectedCapabilityIds).toContain("CAP-RESTAURANT-WASTE");
    expect(repair.reassessment.preservedClaimIds).toContain("DINING_CAPACITY");
  });

  it("rejects a candidate with insufficient waste area", () => {
    const repair = buildRestaurantWasteRepair();
    const invalid = { ...repair.candidate, spaces: repair.candidate.spaces.map((space) => space.id === "WASTE-RETURN-N1" ? { ...space, areaM2: 4, footprint: { ...space.footprint, maxX: 13 } } : space) };
    const result = validateRestaurantWasteRepair(repair.original, invalid);
    expect(result.status).toBe("CONFLICTING");
    expect(result.errors).toContain("WASTE_GEOMETRY_INVALID");
  });
});
