import { describe, expect, it } from "vitest";
import { deriveArchitecturalSpaceSemantics, answerArchitecturalSpaceQuestion } from "./arquiArchitecturalSpaces";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";
import type { SpatialDesignOrganization } from "./arquiSpatialRealization";

const organization = { id: "org-a", strategyId: "strategy-a", partiId: "parti-a", strategyFamily: "COURTYARD", spatialUnits: [], relationships: [], generativeIntents: [], provenance: [] } as unknown as SpatialDesignOrganization;
const representation = { alternative_id: "UPAO-001-A", elements: [{ id: "SZ-01", element_type: "SpatialZone", geometry: { type: "polygon", coordinates: [[[0, 0], [4, 0], [4, 3], [0, 0]]] }, metadata: { level_reference: "LEVEL_01" }, labels: { en: "Zone" } }], north_degrees: 0, units: "m", provenance: "TEST_FIXTURE" } as unknown as SpatialRepresentation;
const fixture = [{ id: "LIVING", name: "Living", spaceType: "LIVING", quantity: 1, targetArea: 24, adjacency: [{ target: "DINING", relation: "REQUIRED_ADJACENCY" }] }, { id: "BEDROOM", name: "Bedroom", spaceType: "BEDROOM", quantity: 2 }, { id: "BATH", name: "Bathroom", spaceType: "BATHROOM", quantity: 1 }];

describe("P1 architectural space semantics", () => {
  it("expands quantities into distinct stable instances", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    expect(result.counts.programItems).toBe(3);
    expect(result.counts.spaceInstances).toBe(4);
    expect(result.spaces.filter((space) => space.programItemId === "BEDROOM").map((space) => space.spaceId)).toEqual(["BEDROOM-01", "BEDROOM-02"]);
  });
  it("preserves explicit program-to-space lineage", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    expect(result.lineage[0].programItemId).toBe("LIVING");
    expect(result.lineage[0].spaceId).toBe("LIVING-01");
    expect(result.lineage[0].status).toBe("SPATIALLY_REFERENCED");
  });
  it("keeps missing target area UNKNOWN rather than zero or a default", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    const bedroom = result.spaces.find((space) => space.programItemId === "BEDROOM");
    expect(bedroom?.targetArea).toBeUndefined();
    expect(bedroom?.unknowns).toContain("TARGET_AREA");
    expect(result.counts.unknownTargetArea).toBe(3);
  });
  it("keeps semantic spaces distinct from geometric rooms", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    expect(result.spaces.some((space) => space.realizationStatus === "SEMANTIC_SPACE")).toBe(true);
    expect(result.spaces.some((space) => space.realizationStatus === "GEOMETRICALLY_REALIZED")).toBe(false);
    expect(result.noRoomInference).toBe(true);
  });
  it("references existing SpatialZone without renaming it into a room", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    const living = result.spaces.find((space) => space.programItemId === "LIVING");
    expect(living?.spatialZoneId).toBe("SZ-01");
    expect(living?.boundaryStatus).toBe("DERIVED_BOUNDARY");
    expect(living?.spaceType).toBe("LIVING");
  });
  it("preserves adjacency as requirement, not observed fact", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    const living = result.spaces.find((space) => space.programItemId === "LIVING");
    expect(living?.relationshipRequirements[0]).toEqual({ target: "DINING", relation: "REQUIRED_ADJACENCY" });
    expect(living?.observedRelationships).toEqual([]);
  });
  it("answers bounded ARQUI questions with epistemic state", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    const answer = answerArchitecturalSpaceQuestion("What area is required for this space?", result);
    expect(answer.answer).toBe("SPACE_AREA_STATE");
    expect((answer.data.spaces as Array<Record<string, unknown>>).some((space) => space.relation === "UNKNOWN")).toBe(true);
  });
  it("preserves target/actual separation", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    const living = result.spaces.find((space) => space.programItemId === "LIVING");
    expect(living?.targetArea).toBe(24);
    expect(typeof living?.actualArea).toBe("number");
    expect(living?.targetArea).not.toBe(living?.actualArea);
  });
  it("does not create decisions or mutate geometry", () => {
    const before = JSON.stringify(representation);
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    expect(result.noDecision).toBe(true);
    expect(result.noGeometryMutation).toBe(true);
    expect(JSON.stringify(representation)).toBe(before);
  });
  it("marks project fixture provenance separately from project facts", () => {
    const result = deriveArchitecturalSpaceSemantics(undefined, representation, organization, fixture);
    expect(result.provenance).toContain("P1 derived program-space semantics");
    expect(result.programItems[0].provenance[0]).toContain("TEST_FIXTURE");
  });
});
