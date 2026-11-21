import type { GeneratedBuilding } from "../../shared/arkiDynamicFamilies";
import type { AgkCausalModel, AgkFeature } from "./types";
import type { AgkOperationalObject } from "../arkiGeometryKernel";

export type AgkFamilyCompileFailure =
  | "FAMILY_NOT_PROPOSAL_ONLY"
  | "FAMILY_DIMENSION_INVALID"
  | "FAMILY_UNIT_PRECISION_UNSUPPORTED"
  | "FAMILY_GEOMETRY_STRATEGY_UNSUPPORTED";

export type AgkFamilyCompileResult =
  | { ok: true; object: AgkOperationalObject; causalModel: AgkCausalModel; feature: AgkFeature }
  | { ok: false; code: AgkFamilyCompileFailure };

function exactMillimetres(metres: number): number | null {
  if (!Number.isFinite(metres) || metres <= 0) return null;
  const mm = metres * 1000;
  return Number.isInteger(mm) ? mm : null;
}

/**
 * Compiles a proposal-only Dynamic Family candidate into AGK operational input.
 * The GeneratedBuilding UUID and unifiedGeometry are deliberately NOT used as
 * canonical geometry identity or truth. The caller supplies the architectural
 * objectId; AGK owns the operational realization.
 */
export function compileDynamicBuildingToAgk(
  building: GeneratedBuilding,
  objectId: string,
): AgkFamilyCompileResult {
  if (
    building.status !== "GENERATED_CANDIDATE" ||
    building.projectStateMutation !== "NOT_REQUESTED" ||
    building.humanReviewRequired !== true
  ) return { ok: false, code: "FAMILY_NOT_PROPOSAL_ONLY" };

  if (!objectId.trim()) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };

  // AGK-003 first vertical slice: rectangular/linear conceptual mass only.
  // Courtyard, arena and podium/tower strategies require multiple solids /
  // void semantics and must not be silently flattened to one rectangle.
  if (building.geometry2d.type !== "LINEAR_MASS") {
    return { ok: false, code: "FAMILY_GEOMETRY_STRATEGY_UNSUPPORTED" };
  }

  const width_mm = exactMillimetres(building.geometry2d.widthM);
  const depth_mm = exactMillimetres(building.geometry2d.depthM);
  const height_mm = exactMillimetres(building.geometry3d.heightM);
  if (width_mm === null || depth_mm === null || height_mm === null) {
    const raw = [building.geometry2d.widthM, building.geometry2d.depthM, building.geometry3d.heightM];
    return { ok: false, code: raw.some(v => !Number.isFinite(v) || v <= 0)
      ? "FAMILY_DIMENSION_INVALID"
      : "FAMILY_UNIT_PRECISION_UNSUPPORTED" };
  }

  const feature: AgkFeature = Object.freeze({
    featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
    kind: "EXTRUDE_RECTANGLE",
    producesObjectId: objectId,
    parameters: Object.freeze({ width_mm, depth_mm, height_mm, x_mm: 0, y_mm: 0, z_mm: 0 }),
    inputFeatureIds: Object.freeze([]),
  });

  const object: AgkOperationalObject = Object.freeze({
    objectId,
    geometry: Object.freeze({
      kind: "EXTRUDED_RECTANGLE",
      profile: Object.freeze({ width_mm, depth_mm, radius_mm: null }),
      x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
    }),
  });

  return {
    ok: true,
    object,
    feature,
    causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }),
  };
}
