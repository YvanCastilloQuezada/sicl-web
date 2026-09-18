import { describe, expect, it } from "vitest";
import { authorizeS2Operation, executeS2Operation, proposeS2Operation, runS2Proof } from "./src/components/arkiAdvancedSpatialEditing";
import { generateHouseA21S1FloorPlan } from "./src/components/arkiConstructiveSpatialGeneration";

describe("ARKI-S2 advanced spatial editing", () => {
  it("requires explicit human authorization before mutation", () => {
    const proof = runS2Proof();
    expect(proof.unauthorized.state).toBe("BLOCKED");
    expect(proof.unauthorized.errors).toContain("HUMAN_AUTHORIZATION_REQUIRED");
  });
  it("supports MOVE_ROOM with impact analysis and fresh readback", () => {
    const proof = runS2Proof();
    expect(proof.authorized.state).toBe("EXECUTED");
    expect(proof.authorized.operation.impact?.collision).toBe("PASS");
    expect(proof.authorized.operation.impact?.containment).toBe("PASS");
    expect(proof.authorized.freshReadback).toBe(true);
    expect(proof.meaningfulChange).toBe(true);
  });
  it("preserves parent immutability and child lineage", () => {
    const proof = runS2Proof();
    expect(proof.parentImmutable).toBe(true);
    expect(proof.lineage).toBe(true);
    expect(proof.authorized.child?.provenance.some((item) => item.includes("S2 child"))).toBe(true);
  });
  it("blocks containment/collision conflicts without silently repairing them", () => {
    const proof = runS2Proof();
    expect(proof.conflict.state).toBe("BLOCKED");
    expect(proof.conflict.errors).toContain("ROOM_GEOMETRY_INVALID");
    expect(proof.noSilentRepair).toBe(true);
  });
  it("supports resize, offset, reshape and edit proposals through one operation contract", () => {
    const parent = generateHouseA21S1FloorPlan();
    for (const kind of ["RESIZE_ROOM", "OFFSET_ROOM", "RESHAPE_SPATIAL_ELEMENT", "EDIT_ROOM"] as const) {
      const parameters = kind === "RESHAPE_SPATIAL_ELEMENT" || kind === "EDIT_ROOM" ? { points: [[1, 8], [3.5, 8], [3.5, 10], [1, 10]] } : { dx: 0, dy: 0, width: 2.5, depth: 2 };
      const operation = authorizeS2Operation(proposeS2Operation(parent, kind, "S1:N1:ACCESS", parameters, `Human proposal ${kind}`), true);
      expect(operation.authorization).toBe("AUTHORIZED");
      expect(operation.actor).toBe("HUMAN_ARCHITECT");
      expect(operation.parentId).toBe(parent.id);
    }
  });
  it("preserves UNKNOWN after recomputation and does not claim compliance", () => {
    const proof = runS2Proof();
    expect(proof.unknownPreserved).toBe(true);
    expect(proof.authorized.child?.preservedUnknowns).toContain("Regulatory compliance");
    expect(proof.authorized.child?.constructionReady).toBe(false);
  });
});
