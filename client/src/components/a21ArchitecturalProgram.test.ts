import { describe, expect, it } from "vitest";
import { buildHouseA21Comparison, buildHouseA21Proof, buildA21NegativeControls, validateHouseA21Proof } from "./a21ArchitecturalProgram";

describe("A21 HOUSE-A21 P0R/P1/P2", () => {
  it("derives a traceable graph from human intent without geometry", () => {
    const proof = buildHouseA21Proof();
    expect(validateHouseA21Proof(proof)).toBe(true);
    expect(proof.relationships.length).toBeGreaterThanOrEqual(7);
    expect(proof.humanSourcedEdges).toHaveLength(proof.relationships.length);
    expect(proof.geometryCreated).toBe(false);
    expect(proof.explanation).toContain("Has pedido separar");
    expect(proof.levelOrganization.map((level) => level.levelId)).toEqual(["N1", "N2"]);
  });

  it("produces functional zoning hypotheses, not a floor plan or a winner", () => {
    const proof = buildHouseA21Proof();
    expect(proof.zones.map((zone) => zone.zoneType)).toEqual(expect.arrayContaining(["PUBLIC", "PRIVATE", "SERVICE", "TRANSITION", "ACCESS", "OUTDOOR"]));
    expect(proof.zones.every((zone) => zone.status === "PROPOSED" && zone.noGeometryMutation && zone.noDecision)).toBe(true);
    expect(proof.winnerCreated).toBe(false);
    expect(proof.regulatoryClaimCreated).toBe(false);
  });

  it("preserves the required negative controls", () => {
    const controls = buildA21NegativeControls();
    expect(controls.missingIntent).toEqual({ relationshipCount: 0, state: "UNKNOWN" });
    expect(controls.conflict).toMatchObject({ conflictCount: 2, preserved: true });
    expect(controls.labelOnly.inferredAdjacency).toBe(false);
    expect(controls.geometry).toEqual({ polygons: 0, positions: 0, dimensions: 0, openings: 0, doors: 0, windows: 0, walls: 0 });
  });

  it("compares against existing HOUSE-001 read-only without reversing causality", () => {
    const comparison = buildHouseA21Comparison();
    expect(comparison.a29Result).toBe("GEOMETRIC_ADJACENCY_OBSERVED");
    expect(comparison.a20Result).toBe("NOT_USED_FOR_P1_P2");
    expect(comparison.notes.join(" ")).toContain("never from existing rectangles");
  });
});
