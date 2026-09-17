import { describe, expect, it } from "vitest";
import type { SpatialRepresentation } from "../components/UPAO001SpatialViewer";
import { analyticalSolarShadows, preservesRepresentation } from "./analyticalSolarShadows";

const representation: SpatialRepresentation = {
  id: "SR-UPAO-001-B",
  alternative_id: "UPAO-001-B",
  spatial_scope: "edificacion",
  representation_version: "s2-v1",
  generator_version: "upao-v1",
  coordinate_system: "LOCAL_ENU",
  units: "m",
  input_fingerprint: "fixture",
  north_degrees: 0,
  elements: [
    { id: "mass-a", element_type: "BuildingMass", geometry: { type: "polygon", coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]] }, metadata: { height: 10 } },
    { id: "mass-b", element_type: "BuildingMass", geometry: { type: "polygon", coordinates: [[[20, 0], [30, 0], [30, 10], [20, 10], [20, 0]]] }, metadata: { height: 5 } },
  ],
};

describe("analyticalSolarShadows", () => {
  it("projects opposite the solar azimuth in LOCAL_ENU", () => {
    const result = analyticalSolarShadows(representation, 0, 45);
    expect(result.status).toBe("AVAILABLE");
    expect(result.direction[0]).toBeCloseTo(0);
    expect(result.direction[1]).toBeCloseTo(-1);
    expect(result.shadows).toHaveLength(2);
  });

  it("makes shadows longer as positive solar elevation decreases", () => {
    const high = analyticalSolarShadows(representation, 90, 60);
    const low = analyticalSolarShadows(representation, 90, 30);
    expect(low.shadows[0].length).toBeGreaterThan(high.shadows[0].length);
  });

  it("returns no direct shadow below the horizon", () => {
    const result = analyticalSolarShadows(representation, 180, 0);
    expect(result.status).toBe("NO_DIRECT_SOLAR_SHADOW");
    expect(result.shadows).toHaveLength(0);
  });

  it("preserves the source representation", () => {
    const before = JSON.stringify(representation);
    analyticalSolarShadows(representation, 270, 20);
    expect(preservesRepresentation(representation, before)).toBe(true);
  });
});
