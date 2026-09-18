import { describe, expect, it } from "vitest";
import { isExplicitArchitecturalSpaceElement, readArchitecturalSpaceGeometry, validateArchitecturalSpaceGeometry } from "./architecturalSpaceGeometry";
import { readArchitecturalResult } from "./arquiArchitecturalReading";
import type { SpatialElement, SpatialRepresentation } from "./UPAO001SpatialViewer";

const element = (geometry: Record<string, unknown>, metadata: Record<string, unknown> = {}): SpatialElement => ({ id: "SZ-ARCH-001", element_type: "SpatialZone", geometry: geometry as SpatialElement["geometry"], parent_id: "MASS-01", level: 1, metadata: { space_role: "architectural_space", space_id: "BEDROOM-01", program_item_id: "BEDROOM", geometry_provenance: "TEST_FIXTURE", ...metadata } });
const valid = element({ type: "polygon", coordinates: [[[0, 0], [4, 0], [4, 3], [0, 0]]] });
const representation = (items: SpatialElement[]): SpatialRepresentation => ({ id: "SR-TEST", alternative_id: "UPAO-001-A", spatial_scope: "edificacion", representation_version: "1.0", generator_version: "TEST", coordinate_system: "LOCAL_ENU", units: "m", input_fingerprint: "test", north_degrees: 0, elements: items });
const plan: any = { strategyId: "strategy-a" };
const organization: any = { id: "org-a", strategyId: "strategy-a", partiId: "parti-a", strategyFamily: "COMPACT_VERTICAL" };

describe("ASI-G1 canonical architectural-space geometry", () => {
  it("accepts only explicit architectural-space metadata", () => {
    expect(isExplicitArchitecturalSpaceElement(valid)).toBe(true);
    expect(isExplicitArchitecturalSpaceElement({ ...valid, metadata: { program: "residential" } })).toBe(false);
  });
  it("validates closed non-zero bounded polygons", () => {
    expect(validateArchitecturalSpaceGeometry(valid)).toEqual({ valid: true });
    expect(validateArchitecturalSpaceGeometry(element({ type: "polygon", coordinates: [[[0, 0], [4, 0], [4, 3]]] }))).toEqual({ valid: false, reason: "POLYGON_MUST_BE_CLOSED" });
    expect(validateArchitecturalSpaceGeometry(element({ type: "polygon", coordinates: [[[0, 0], [0, 0], [0, 0], [0, 0]]] }))).toEqual({ valid: false, reason: "NON_ZERO_AREA_REQUIRED" });
  });
  it("derives actual area from geometry and preserves coordinate context", () => {
    const observation = readArchitecturalSpaceGeometry(representation([valid]))[0];
    expect(observation.actualArea).toBe(6);
    expect(observation.geometryType).toBe("polygon");
    expect(observation.boundaryStatus).toBe("EXPLICIT_BOUNDARY");
    expect(observation.coordinateSystem).toBe("LOCAL_ENU");
    expect(observation.units).toBe("m");
    expect(observation.provenance).toContain("TEST_FIXTURE");
  });
  it("rejects invalid geometry without silent repair or area claim", () => {
    const invalid = element({ type: "polygon", coordinates: [[[0, 0], [4, 0], [4, 3]]] });
    const observation = readArchitecturalSpaceGeometry(representation([invalid]))[0];
    expect(observation.epistemicStatus).toBe("UNKNOWN");
    expect(observation.actualArea).toBeUndefined();
    expect(observation.realizationStatus).toBe("UNKNOWN");
  });
  it("keeps historical SpatialZone without explicit role out of ASI-G1", () => {
    const historical = { ...valid, id: "SZ-HIST", metadata: { program: "residential" } };
    expect(readArchitecturalSpaceGeometry(representation([historical]))).toEqual([]);
  });
  it("makes A15 freshly observe actual bounded space geometry", () => {
    const reading = readArchitecturalResult(representation([valid]), organization, plan);
    expect(reading.observedSpaceGeometry).toHaveLength(1);
    expect(reading.observedSpaceGeometry[0].spaceId).toBe("BEDROOM-01");
    expect(reading.observedSpaceGeometry[0].actualArea).toBe(6);
    expect(reading.observedSpaceGeometry[0].epistemicStatus).toBe("OBSERVED");
  });
  it("does not infer geometry from target area", () => {
    expect(readArchitecturalSpaceGeometry(representation([]))).toHaveLength(0);
  });
});
