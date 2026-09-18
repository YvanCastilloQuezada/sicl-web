import { describe, expect, it } from "vitest";
import { applyRoomOperation, generateVerifiedResidentialPlan } from "./residentialConstructivePlan";

describe("residential constructive spatial model", () => {
  it("generates explicit rooms, walls, openings, cores and routes", () => {
    const plan = generateVerifiedResidentialPlan();
    expect(plan.validation.conflicts).toEqual([]);
    expect(plan.rooms.every((room) => room.status === "EXPLICIT_GEOMETRY")).toBe(true);
    expect(plan.walls.length).toBeGreaterThan(0);
    expect(plan.openings.filter((opening) => opening.kind === "DOOR")).toHaveLength(5);
    expect(plan.cores.map((core) => core.kind)).toEqual(["STAIR", "SERVICE_DUCT"]);
    expect(plan.adjacency.every((edge) => edge.evidence === "GEOMETRIC_OPENING")).toBe(true);
    expect(plan.carbonSummary.carbonLowKgCo2e).toBeGreaterThan(0);
    expect(plan.carbonSummary.carbonHighKgCo2e).toBeGreaterThan(plan.carbonSummary.carbonLowKgCo2e);
    expect(plan.carbonSummary.carbonIsNotLca).toBe(true);
  });

  it("applies safe room operations and rejects collision or out-of-site changes", () => {
    const plan = generateVerifiedResidentialPlan();
    const moved = applyRoomOperation(plan, "RESIZE_ROOM", "BED-01", { width: 4.4 });
    expect(moved.ok).toBe(true);
    expect(moved.plan.rooms.find((room) => room.id === "BED-01")?.areaM2).toBeCloseTo(13.2);
    const collision = applyRoomOperation(plan, "MOVE_ROOM", "BED-01", { dx: 5 });
    expect(collision.ok).toBe(false);
    expect(collision.errors).toContain("ROOM_OVERLAP");
    const outside = applyRoomOperation(plan, "OFFSET_ROOM", "BED-01", { dx: -5 });
    expect(outside.ok).toBe(false);
    expect(outside.errors).toContain("ROOM_OUTSIDE_SITE");
  });
});
