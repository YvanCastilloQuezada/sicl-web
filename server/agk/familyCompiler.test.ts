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
