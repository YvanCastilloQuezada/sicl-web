import { describe, expect, it } from "vitest";
import { generateHouseA21S1FloorPlan, runS1Proof, validateS1FloorPlan } from "./src/components/arkiConstructiveSpatialGeneration";

describe("ARKI-S1 constructive spatial generation", () => {
  it("proves room containment, non-overlap and target-area tolerance", () => {
    const proof = runS1Proof();
    expect(proof.containment).toBe(true);
    expect(proof.nonOverlap).toBe(true);
    expect(proof.targetArea).toBe(true);
  });
  it("proves geometric adjacency and door connections", () => {
    const proof = runS1Proof();
    expect(proof.adjacency).toBe(true);
    expect(proof.doorConnection).toBe(true);
  });
  it("proves wall closure and partitions without construction-document claims", () => {
    const proof = runS1Proof();
    expect(proof.wallClosure).toBe(true);
    expect(proof.plan.walls.length).toBeGreaterThan(0);
    expect(proof.plan.partitions.length).toBeGreaterThan(0);
    expect(proof.noConstructionClaim).toBe(true);
    expect(proof.plan.permitReady).toBe(false);
    expect(proof.plan.constructionReady).toBe(false);
  });
  it("proves circulation, stairs, shaft continuity and accessible-route geometry", () => {
    const proof = runS1Proof();
    expect(proof.circulation).toBe(true);
    expect(proof.stair).toBe(true);
    expect(proof.shafts).toBe(true);
    expect(proof.routes).toBe(true);
    expect(proof.plan.stair.fromLevel).toBe("N1");
    expect(proof.plan.stair.toLevel).toBe("N2");
    expect(proof.plan.shafts.every((shaft) => shaft.levelIds.length === 2)).toBe(true);
  });
  it("preserves parent immutability and unknown states", () => {
    const proof = runS1Proof();
    expect(proof.parentImmutable).toBe(true);
    expect(proof.unknowns).toBe(true);
    expect(proof.plan.preservedUnknowns).toContain("Elevator manufacturer dimensions");
    expect(proof.plan.validations.find((item) => item.id === "UNKNOWN_PRESERVATION")?.unknown).toBe(true);
  });
  it("is deterministic and remains a hypothesis", () => {
    const first = generateHouseA21S1FloorPlan();
    const second = generateHouseA21S1FloorPlan();
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(validateS1FloorPlan(first)).toBe(true);
    expect(first.status).toBe("HYPOTHESIS");
    expect(first.representationKind).toBe("CONCEPTUAL_FLOOR_PLAN");
    expect(first.humanReviewRequired).toBe(true);
  });
});
