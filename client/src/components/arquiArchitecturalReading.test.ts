import { describe, expect, it } from "vitest";
import { readArchitecturalResult, summarizeArchitecturalReading } from "./arquiArchitecturalReading";
import type { SpatialDesignOrganization } from "./arquiSpatialRealization";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";
import type { ArchitecturalRealizationPlan } from "./arquiControlledRealization";

const rect = (x0: number, y0: number, x1: number, y1: number) => ({ type: "polygon", coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]] });
const basePlan = { strategyId: "strategy-a", steps: [], executionStatus: "PREPARED", humanAuthorityRequired: true } as unknown as ArchitecturalRealizationPlan;
const org = (family: string): SpatialDesignOrganization => ({ id: "spatial-org-strategy-a", strategyId: "strategy-a", strategyFamily: family, partiId: "strategy-a", spatialUnits: [], relationships: [], generativeIntents: [], programZones: [], accessStructure: [], circulationStructure: [], massVoidStructure: [], verticalStructure: [], siteAnchors: [], orientationIntent: "unknown", unresolvedElements: [], realizability: "PARTIALLY_REALIZABLE", intentPreserved: true, noGeometryMutation: true, noExecution: true, provenance: [] });
const representation = (family: "courtyard" | "linear", overlapMasses = false): SpatialRepresentation => {
  const masses = family === "courtyard" ? [0, 1, 2, 3] : [0, 1];
  return { id: "rep-1", alternative_id: "UPAO-001-A-GDI", spatial_scope: "edificacion", representation_version: "S2", generator_version: "S2", coordinate_system: "local", units: "m", input_fingerprint: "x", north_degrees: 0, elements: [
    { id: "site", element_type: "SiteBoundary", geometry: rect(0, 0, 30, 30) },
    { id: "footprint", element_type: "BuildingFootprint", geometry: family === "courtyard" ? { type: "multipolygon", coordinates: [[[[2, 2], [8, 2], [8, 8], [2, 8], [2, 2]]], [[[12, 2], [18, 2], [18, 8], [12, 8], [12, 2]]]] } : rect(5, 5, 20, 12), parent_id: "site", metadata: { strategy: family } },
    ...masses.map((index) => ({ id: `mass-${index}`, element_type: "BuildingMass" as const, geometry: overlapMasses ? rect(5, 5, 12, 12) : rect(2 + index * 5, 2, 6 + index * 5, 8), parent_id: "footprint", metadata: { height: 10, floor_count: 3 } })),
    { id: "circulation", element_type: "CirculationElement", geometry: { type: "line", coordinates: [[1, 1], [5, 5]] }, parent_id: "site", metadata: { access_point: [1, 1] } },
  ] };
};

describe("A15 architectural reading", () => {
  it("reads actual courtyard geometry and preserves central void at element level", () => {
    const reading = readArchitecturalResult(representation("courtyard"), org("COURTYARD"), basePlan);
    expect(reading.observedMassVoid.centralVoid).toBe("OBSERVED");
    expect(reading.correspondence.find((item) => item.expected === "CENTRAL_VOID")?.status).toBe("PRESERVED");
    expect(reading.noMutation).toBe(true);
  });
  it("does not promote unsupported linear spine expectation into observation", () => {
    const reading = readArchitecturalResult(representation("linear"), org("LINEAR_BAR"), basePlan);
    expect(reading.correspondence.find((item) => item.expected === "LINEAR_SPINE")?.status).toBe("NOT_REALIZED");
    expect(reading.observedCirculation.status).toBe("OBSERVED");
  });
  it("keeps program semantics unknown when actual geometry has no validated assignment", () => {
    const reading = readArchitecturalResult(representation("courtyard"), org("COURTYARD"), basePlan);
    expect(reading.correspondence.find((item) => item.expected === "PROGRAM_ZONES")?.status).toBe("UNVERIFIABLE");
    expect(reading.unverifiableElements).toContain("PROGRAM_ZONES");
  });
  it("exposes overlap contradiction instead of reconciling it", () => {
    const reading = readArchitecturalResult(representation("courtyard", true), org("COURTYARD"), basePlan);
    expect(reading.contradictions.length).toBeGreaterThan(0);
    expect(reading.contradictions[0].expected).toBe("SEPARATED_MASSES");
  });
  it("summarizes correspondence without quality or winner semantics", () => {
    const summary = summarizeArchitecturalReading(readArchitecturalResult(representation("courtyard"), org("COURTYARD"), basePlan));
    expect(summary.preserved).toBeGreaterThan(0);
    expect(summary.unverifiable).toBeGreaterThan(0);
  });
});
