import { describe, expect, it } from "vitest";
import {
  applyAgkCommand,
  deriveAgkPlan,
  materializeD63Geometry,
  createAgkState,
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
  it("propagates HOSTS dependency and preserves identities", () => {
    const wall = { objectId: "wall-1", geometry: { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 4000, depth_mm: 200, radius_mm: null }, x_mm: 1000, y_mm: 2000, z_mm: 0, height_mm: 2800 } };
    const window = { objectId: "window-1", geometry: { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 1200, depth_mm: 200, radius_mm: null }, x_mm: 2200, y_mm: 2000, z_mm: 900, height_mm: 1200 } };
    const initial = createAgkState([wall, window], [{ kind: "HOSTS", hostObjectId: "wall-1", dependentObjectId: "window-1" }]);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    const moved = applyAgkCommand(initial.value, { kind: "MOVE", objectId: "wall-1", delta_mm: { x: 600, y: 0, z: 0 } });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    expect(moved.value.affectedObjectIds).toEqual(["wall-1", "window-1"]);
    expect(moved.value.state.objects.map((object) => [object.objectId, object.geometry.x_mm])).toEqual([["wall-1", 1600], ["window-1", 2800]]);
    expect(moved.value.state.dependencies).toEqual([{ kind: "HOSTS", hostObjectId: "wall-1", dependentObjectId: "window-1" }]);
    expect(deriveAgkPlan(moved.value.state).map((item) => [item.objectId, item.x_mm])).toEqual([["wall-1", 1600], ["window-1", 2800]]);
  });

  it("rejects invalid HOSTS graphs before commit", () => {
    const wall = { objectId: "wall-1", geometry: { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 1000, depth_mm: 200, radius_mm: null }, x_mm: 0, y_mm: 0, z_mm: 0, height_mm: 2800 } };
    expect(createAgkState([wall], [{ kind: "HOSTS", hostObjectId: "wall-1", dependentObjectId: "missing" }])).toEqual({ ok: false, code: "DEPENDENCY_OBJECT_NOT_FOUND" });
    expect(createAgkState([wall], [{ kind: "HOSTS", hostObjectId: "wall-1", dependentObjectId: "wall-1" }])).toEqual({ ok: false, code: "DEPENDENCY_SELF_REFERENCE" });
  });

  it("rejects a dependency cycle before committed state exists", () => {
    const geometry = { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 1000, depth_mm: 200, radius_mm: null }, x_mm: 0, y_mm: 0, z_mm: 0, height_mm: 2800 };
    expect(createAgkState(
      [{ objectId: "a", geometry }, { objectId: "b", geometry }, { objectId: "c", geometry }],
      [
        { kind: "HOSTS", hostObjectId: "a", dependentObjectId: "b" },
        { kind: "HOSTS", hostObjectId: "b", dependentObjectId: "c" },
        { kind: "HOSTS", hostObjectId: "c", dependentObjectId: "a" },
      ]
    )).toEqual({ ok: false, code: "DEPENDENCY_CYCLE" });
  });

  it("gives graph-equivalent reordered states the same stateId", () => {
    const a = { objectId: "a", geometry: { kind: "EXTRUDED_RECTANGLE" as const, profile: { width_mm: 1000, depth_mm: 200, radius_mm: null }, x_mm: 0, y_mm: 0, z_mm: 0, height_mm: 2800 } };
    const b = { objectId: "b", geometry: { ...a.geometry, x_mm: 1000 } };
    const first = createAgkState([a, b], [{ kind: "HOSTS", hostObjectId: "a", dependentObjectId: "b" }]);
    const second = createAgkState([b, a], [{ kind: "HOSTS", hostObjectId: "a", dependentObjectId: "b" }]);
    expect(first.ok && second.ok && first.value.stateId).toBe(second.ok ? second.value.stateId : "invalid");
  });

  it("deep-freezes committed geometry and records transaction provenance", () => {
    const initial = materializeD63Geometry("space-1", input);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    expect(Object.isFrozen(initial.value.objects[0])).toBe(true);
    expect(Object.isFrozen(initial.value.objects[0].geometry)).toBe(true);
    expect(Object.isFrozen(initial.value.objects[0].geometry.profile)).toBe(true);
    const moved = applyAgkCommand(initial.value, { kind: "MOVE", objectId: "space-1", delta_mm: { x: 600, y: 0, z: 0 } });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    expect(moved.value.provenance).toEqual({
      kind: "AGK_COMMAND_COMMITTED",
      transactionId: moved.value.transactionId,
      beforeStateId: initial.value.stateId,
      afterStateId: moved.value.state.stateId,
      command: { kind: "MOVE", objectId: "space-1", delta_mm: { x: 600, y: 0, z: 0 } },
      affectedObjectIds: ["space-1"],
    });
  });

});
