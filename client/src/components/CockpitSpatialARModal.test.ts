import { describe, expect, it } from "vitest";
import { hasValidRenderGeometry } from "./CockpitSpatialARModal";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";

type Element = SpatialRepresentation["elements"][number];
const make = (element_type: string, type: string, coordinates: unknown, metadata?: Record<string, unknown>): Element => ({
  id: "test-element", element_type, geometry: { type, coordinates }, metadata,
});

describe("Cockpit AR render geometry gate", () => {
  it("accepts finite 3D volume with positive height", () => {
    const volume = [[0,0,0],[4,0,0],[4,3,0],[0,3,0],[0,0,8],[4,0,8],[4,3,8],[0,3,8]];
    expect(hasValidRenderGeometry(make("BuildingMass", "volume", volume, { height: 8 }))).toBe(true);
  });
  it("rejects volume with invalid coordinates or missing/nonpositive height", () => {
    expect(hasValidRenderGeometry(make("BuildingMass", "volume", [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,2],[1,0,2]], { height: 2 }))).toBe(true);
    expect(hasValidRenderGeometry(make("BuildingMass", "volume", [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,2],[1,0,2]], { height: 0 }))).toBe(false);
    expect(hasValidRenderGeometry(make("BuildingMass", "volume", [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,2],[1,0,2]], { height: 2 }))).toBe(false);
  });
  it("accepts a standard GeoJSON Polygon and rejects a degenerate exterior ring", () => {
    expect(hasValidRenderGeometry(make("BuildingFootprint", "polygon", [[[0,0],[4,0],[4,3],[0,3],[0,0]]]))).toBe(true);
    expect(hasValidRenderGeometry(make("BuildingFootprint", "polygon", [[[0,0],[0,0],[0,0],[0,0]]]))).toBe(false);
  });
  it("accepts only a single-part MultiPolygon and blocks unsupported element types", () => {
    expect(hasValidRenderGeometry(make("SpatialZone", "multipolygon", [[[[1,1],[4,1],[4,3],[1,3],[1,1]]]]))).toBe(true);
    expect(hasValidRenderGeometry(make("SpatialZone", "multipolygon", [[[[1,1],[4,1],[4,3],[1,3],[1,1]]]], [[[[5,5],[8,5],[8,8],[5,5]]]]))).toBe(false);
    expect(hasValidRenderGeometry(make("BuildingFootprint", "polygon", [[[0,0],[4,0],[4,4],[0,4],[0,0]], [[1,1],[2,1],[2,2],[1,1]]]))).toBe(false);
    expect(hasValidRenderGeometry(make("SiteBoundary", "polygon", [[[0,0],[4,0],[4,4],[0,0]]]))).toBe(false);
    expect(hasValidRenderGeometry(make("SpatialZone", "point", [1,2]))).toBe(false);
  });
});
