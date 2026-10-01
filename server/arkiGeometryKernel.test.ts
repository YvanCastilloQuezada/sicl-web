import { describe, expect, it } from "vitest";
import {
  applyAgkCommand,
  deriveAgkPlan,
  materializeD63Geometry,
} from "./arkiGeometryKernel";

const input = {
  geometry: {
    type: "Polygon",
    coordinates: [[[1, 2], [4, 2], [4, 6], [1, 6], [1, 2]]],
  },
  coordinateSystem: "LOCAL_PROJECT_2D",
  units: "m",
  baseElevation_mm: 0,
  verticalExtent_mm: 2800,
};

describe("AGK-001 operational spine", () => {
  it("materializes the current D6.3 rectangle through AGK deterministically", () => {
    const a = materializeD63Geometry("space-1", input);
    const b = materializeD63Geometry("space-1", input);
    expect(a).toEqual(b);
    expect(a.ok && a.value.objects[0].geometry).toEqual({
      kind: "EXTRUDED_RECTANGLE",
      profile: { width_mm: 3000, depth_mm: 4000, radius_mm: null },
      x_mm: 1000,
      y_mm: 2000,
      z_mm: 0,
      height_mm: 2800,
    });
  });

  it("commits MOVE +600 mm atomically and derives plan from the committed state", () => {
    const initial = materializeD63Geometry("space-1", input);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;

    const moved = applyAgkCommand(initial.value, {
      kind: "MOVE",
      objectId: "space-1",
      delta_mm: { x: 600, y: 0, z: 0 },
    });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;

    expect(initial.value.objects[0].geometry.x_mm).toBe(1000);
    expect(moved.value.state.objects[0].geometry.x_mm).toBe(1600);
    expect(moved.value.state.revision).toBe(1);
    expect(moved.value.beforeStateId).toBe(initial.value.stateId);
    expect(moved.value.afterStateId).toBe(moved.value.state.stateId);
    expect(deriveAgkPlan(moved.value.state)).toEqual([{
      objectId: "space-1",
      kind: "RECTANGLE",
      x_mm: 1600,
      y_mm: 2000,
      width_mm: 3000,
      depth_mm: 4000,
    }]);
  });

  it("produces the same transaction identity for the same state and command", () => {
    const initial = materializeD63Geometry("space-1", input);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    const command = { kind: "MOVE" as const, objectId: "space-1", delta_mm: { x: 600, y: 0, z: 0 } };
    expect(applyAgkCommand(initial.value, command)).toEqual(applyAgkCommand(initial.value, command));
  });

  it("fails closed without producing a partial state", () => {
    const initial = materializeD63Geometry("space-1", input);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;

    expect(applyAgkCommand(initial.value, {
      kind: "MOVE",
      objectId: "missing",
      delta_mm: { x: 600, y: 0, z: 0 },
    })).toEqual({ ok: false, code: "OBJECT_NOT_FOUND" });

    expect(applyAgkCommand(initial.value, {
      kind: "MOVE",
      objectId: "space-1",
      delta_mm: { x: 0.5, y: 0, z: 0 },
    })).toEqual({ ok: false, code: "MOVE_DELTA_NOT_INTEGER" });

    expect(initial.value.revision).toBe(0);
    expect(initial.value.objects[0].geometry.x_mm).toBe(1000);
  });
});
