// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { deriveMasses, spatialToRenderer } from "./UPAO001MassingViewer3D";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";

const representation = (alternative_id: string, masses: Array<{ id: string; x: number; y: number; width: number; depth: number; height: number; floors: number }>): SpatialRepresentation => ({
  id: `SR-${alternative_id}`, alternative_id, spatial_scope: "edificacion", representation_version: "1.0", generator_version: "upao001-spatial-v1", coordinate_system: "LOCAL_ENU", units: "m", input_fingerprint: "a".repeat(64), north_degrees: 0,
  elements: [
    { id: `${alternative_id}-site`, element_type: "SiteBoundary", geometry: { type: "polygon", coordinates: [[[0, 0], [40, 0], [40, 30], [0, 30], [0, 0]]] } },
    ...masses.map((mass) => ({ id: mass.id, element_type: "BuildingMass" as const, geometry: { type: "volume", coordinates: [[mass.x, mass.y, 0], [mass.x + mass.width, mass.y, 0], [mass.x + mass.width, mass.y + mass.depth, 0], [mass.x, mass.y + mass.depth, 0], [mass.x, mass.y, mass.height], [mass.x + mass.width, mass.y, mass.height], [mass.x + mass.width, mass.y + mass.depth, mass.height], [mass.x, mass.y + mass.depth, mass.height]] }, metadata: { footprint_reference: `${alternative_id}-footprint`, base_elevation: 0, height: mass.height, floor_count: mass.floors, floor_to_floor_height: 3.2 } })),
  ],
});

describe("UPAO001MassingViewer3D derivation", () => {
  it("uses BuildingMass footprint and explicit height semantics", () => {
    const [mass] = deriveMasses(representation("UPAO-001-A", [{ id: "mass-a", x: 10, y: 8, width: 20, depth: 14, height: 16, floors: 5 }]));
    expect(mass.element.id).toBe("mass-a");
    expect(mass.ring).toEqual([[10, 8], [30, 8], [30, 22], [10, 22]]);
    expect(mass.base).toBe(0);
    expect(mass.height).toBe(16);
    expect(mass.floorCount).toBe(5);
  });

  it("maps LOCAL_ENU axes deterministically to renderer axes", () => {
    expect(spatialToRenderer([3, 4, 5])).toEqual([3, 5, -4]);
  });

  it("preserves stable spatial IDs and omits malformed masses without fabrication", () => {
    const item = representation("UPAO-001-A", [{ id: "BuildingMass:valid", x: 10, y: 8, width: 20, depth: 14, height: 16, floors: 5 }]);
    item.elements.push({ id: "BuildingMass:invalid", element_type: "BuildingMass", geometry: { type: "volume", coordinates: [] }, metadata: { height: 0, base_elevation: 0 } });
    expect(deriveMasses(item).map((mass) => mass.element.id)).toEqual(["BuildingMass:valid"]);
  });

  it("derives distinct volumetric configurations for A, B and C", () => {
    const a = deriveMasses(representation("UPAO-001-A", [{ id: "a", x: 10, y: 8, width: 20, depth: 14, height: 16, floors: 5 }]));
    const b = deriveMasses(representation("UPAO-001-B", [
      { id: "b1", x: 8, y: 6, width: 8, depth: 18, height: 12.8, floors: 4 },
      { id: "b2", x: 24, y: 6, width: 8, depth: 18, height: 12.8, floors: 4 },
      { id: "b3", x: 16, y: 6, width: 8, depth: 5, height: 12.8, floors: 4 },
      { id: "b4", x: 16, y: 19, width: 8, depth: 5, height: 12.8, floors: 4 },
    ]));
    const c = deriveMasses(representation("UPAO-001-C", [
      { id: "c1", x: 9, y: 8, width: 8, depth: 14, height: 9.6, floors: 3 },
      { id: "c2", x: 23, y: 8, width: 8, depth: 14, height: 9.6, floors: 3 },
    ]));
    expect(a).toHaveLength(1); expect(b).toHaveLength(4); expect(c).toHaveLength(2);
    expect(a[0].height).not.toBe(c[0].height);
    expect(b[0].ring[0][0]).not.toBe(b[1].ring[0][0]);
    expect(c[0].ring[0][0] + c[0].ring[2][0]).toBeLessThan(c[1].ring[0][0] + c[1].ring[2][0]);
  });
});
