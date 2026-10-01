import { describe, expect, it } from "vitest";
import { generateDynamicBuilding } from "../../shared/arkiDynamicFamilies";
import { createAgkState } from "../arkiGeometryKernel";
import { compileDynamicBuildingToAgk } from "./familyCompiler";

describe("AGK-003 dynamic family compiler", () => {
  it("compiles a linear ARKI family into one deterministic AGK feature and state", () => {
    const building = generateDynamicBuilding({
      familyId: "FAM-INDUSTRY",
      variantId: "WAREHOUSE",
      parameters: { areaM2: 3000, floors: 1 },
    });
    const first = compileDynamicBuildingToAgk(building, "building-001");
    const second = compileDynamicBuildingToAgk({ ...building, id: "different-proposal-uuid" }, "building-001");
    expect(first).toEqual(second);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.feature.producesObjectId).toBe("building-001");
    expect(first.object.geometry.kind).toBe("EXTRUDED_RECTANGLE");
    const state = createAgkState([first.object], [], first.causalModel);
    expect(state.ok).toBe(true);
  });

  it("does not promote proposal UUID or unifiedGeometry as AGK truth", () => {
    const building = generateDynamicBuilding({ familyId: "FAM-INDUSTRY", variantId: "WAREHOUSE" });
    const altered = { ...building, id: "arbitrary", unifiedGeometry: { ...building.unifiedGeometry, model3d: { ...building.unifiedGeometry.model3d, massing: "tampered-description" } } };
    expect(compileDynamicBuildingToAgk(building, "canonical-1")).toEqual(
      compileDynamicBuildingToAgk(altered, "canonical-1"),
    );
  });

  it("fails closed instead of flattening courtyard mass into a rectangle", () => {
    const building = generateDynamicBuilding({ familyId: "FAM-HEALTH", variantId: "GENERAL" });
    expect(compileDynamicBuildingToAgk(building, "hospital-1")).toEqual({
      ok: false,
      code: "FAMILY_GEOMETRY_STRATEGY_UNSUPPORTED",
    });
  });

  it("fails closed for non-proposal state", () => {
    const building = generateDynamicBuilding({ familyId: "FAM-INDUSTRY", variantId: "WAREHOUSE" });
    expect(compileDynamicBuildingToAgk({ ...building, projectStateMutation: "NOT_REQUESTED", humanReviewRequired: false as true }, "x")).toEqual({
      ok: false,
      code: "FAMILY_NOT_PROPOSAL_ONLY",
    });
  });
});


describe("AGK-003 executable feature regeneration", () => {
  it("keeps MOVE feature parameters and committed geometry identical", () => {
    const building = generateDynamicBuilding({ familyId: "FAM-INDUSTRY", variantId: "WAREHOUSE" });
    const compiled = compileDynamicBuildingToAgk(building, "moving-1");
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;
    const initial = createAgkState([compiled.object], [], compiled.causalModel);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    const { applyAgkCommand } = require("../arkiGeometryKernel") as typeof import("../arkiGeometryKernel");
    const moved = applyAgkCommand(initial.value, { kind: "MOVE", objectId: "moving-1", delta_mm: { x: 600, y: 200, z: 0 } });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    const feature = moved.value.state.causalModel!.features[0];
    const object = moved.value.state.objects[0];
    expect(feature.parameters.x_mm).toBe(600);
    expect(feature.parameters.y_mm).toBe(200);
    expect(object.geometry.x_mm).toBe(feature.parameters.x_mm);
    expect(object.geometry.y_mm).toBe(feature.parameters.y_mm);
  });

  it("rebuilds width, depth and height from one SET_FEATURE_PARAMETER path", () => {
    const building = generateDynamicBuilding({ familyId: "FAM-INDUSTRY", variantId: "WAREHOUSE" });
    const compiled = compileDynamicBuildingToAgk(building, "resize-1");
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;
    const initial = createAgkState([compiled.object], [], compiled.causalModel);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    const { applyAgkCommand } = require("../arkiGeometryKernel") as typeof import("../arkiGeometryKernel");
    let state = initial.value;
    for (const [parameter, value] of [["width_mm", 50000], ["depth_mm", 40000], ["height_mm", 6800]] as const) {
      const changed = applyAgkCommand(state, { kind: "SET_FEATURE_PARAMETER", featureId: compiled.feature.featureId, parameter, value });
      expect(changed.ok).toBe(true);
      if (!changed.ok) return;
      state = changed.value.state;
    }
    const f = state.causalModel!.features[0];
    const g = state.objects[0].geometry;
    expect([g.profile.width_mm, g.profile.depth_mm, g.height_mm]).toEqual([
      f.parameters.width_mm, f.parameters.depth_mm, f.parameters.height_mm,
    ]);
  });

  it("rejects a causal state whose feature recipe disagrees with geometry", () => {
    const building = generateDynamicBuilding({ familyId: "FAM-INDUSTRY", variantId: "WAREHOUSE" });
    const compiled = compileDynamicBuildingToAgk(building, "mismatch-1");
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;
    const bad = { ...compiled.object, geometry: { ...compiled.object.geometry, height_mm: compiled.object.geometry.height_mm + 1 } };
    expect(createAgkState([bad], [], compiled.causalModel)).toEqual({ ok: false, code: "FEATURE_GEOMETRY_MISMATCH" });
  });
});
