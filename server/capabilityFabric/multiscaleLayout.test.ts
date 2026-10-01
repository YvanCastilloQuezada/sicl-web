import { describe, expect, it } from "vitest";
import { layoutCapabilityFamily, validateLayoutProblem } from "./multiscaleLayout";

describe("multiscale layout capability", () => {
  it("preserves the same layout grammar while specializing by scale", () => {
    expect(layoutCapabilityFamily("INTERIOR")).toEqual(expect.arrayContaining([
      "LAYOUT_GENERATION", "SPACE_ALLOCATION", "CIRCULATION_LAYOUT",
    ]));
    expect(layoutCapabilityFamily("NEIGHBORHOOD")).toEqual(expect.arrayContaining([
      "LAYOUT_GENERATION", "LAND_USE_ALLOCATION", "PARCEL_LAYOUT", "STREET_NETWORK_LAYOUT",
    ]));
    expect(layoutCapabilityFamily("NATION")).toEqual(expect.arrayContaining([
      "LAYOUT_GENERATION", "REGIONAL_ALLOCATION", "SETTLEMENT_SYSTEM_LAYOUT",
      "INFRASTRUCTURE_CORRIDOR_LAYOUT", "SERVICE_COVERAGE",
    ]));
  });

  it("requires jurisdiction and demand evidence at regional/national scales", () => {
    expect(validateLayoutProblem({
      problemId: "national-health-network",
      scale: "NATION",
      entityKinds: ["FACILITY", "SETTLEMENT", "INFRASTRUCTURE"],
      objectives: ["SERVICE_EQUITY", "ACCESSIBILITY", "RESILIENCE"],
      constraints: ["Protected areas", "Budget envelope"],
      boundaryRef: "country-boundary",
      networkRefs: ["national-road-network"],
      demandRefs: [],
      jurisdictionRefs: [],
      canonicalMutation: false,
    })).toEqual(expect.arrayContaining([
      "LAYOUT_JURISDICTION_REQUIRED",
      "LAYOUT_DEMAND_EVIDENCE_REQUIRED",
    ]));
  });
});
