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

  // NUEVO: soportar polígonos reales (L_SHAPE, U_SHAPE, CLUSTER, COURTYARD)
  // NUEVO: FLOATING_SLAB (para cubiertas flotantes)
  if (building.geometry2d.shapeType === "FLOATING_ROOF") {
    const height_mm = exactMillimetres(building.geometry3d.heightM);
    if (height_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const width_mm = exactMillimetres(building.geometry2d.widthM);
    const depth_mm = exactMillimetres(building.geometry2d.depthM);
    if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const thickness_mm = 300;

    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "FLOATING_SLAB",
      producesObjectId: objectId,
      parameters: Object.freeze({ width_mm, depth_mm, height_mm, thickness_mm, x_mm: 0, y_mm: 0, z_mm: 0 }),
      inputFeatureIds: Object.freeze([]),
    });

    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "FLOATING_SLAB",
        profile: Object.freeze({ width_mm, depth_mm, thickness_mm }),
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });

    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // NUEVO: EXTRUDED_ARC (para edificios curvos)
  if (building.geometry2d.shapeType === "ARC") {
    const height_mm = exactMillimetres(building.geometry3d.heightM);
    if (height_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const radius_mm = Math.round(Math.sqrt(building.geometry2d.footprintM2 / Math.PI) * 1000);

    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "EXTRUDE_ARC",
      producesObjectId: objectId,
      parameters: Object.freeze({ radius_mm, startAngle_rad: 0, endAngle_rad: Math.PI, height_mm, x_mm: 0, y_mm: 0, z_mm: 0 }),
      inputFeatureIds: Object.freeze([]),
    });

    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "EXTRUDED_ARC",
        profile: Object.freeze({ radius_mm, startAngle_rad: 0, endAngle_rad: Math.PI }),
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });

    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // NUEVO: SLOPED_ROOF (para techos inclinados)
  if (building.geometry2d.shapeType === "SLOPED_ROOF") {
    const height_mm = exactMillimetres(building.geometry3d.heightM);
    if (height_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const width_mm = exactMillimetres(building.geometry2d.widthM);
    const depth_mm = exactMillimetres(building.geometry2d.depthM);
    if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const slopeAngle_rad = Math.PI / 6; // 30 grados

    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "SLOPED_ROOF",
      producesObjectId: objectId,
      parameters: Object.freeze({ width_mm, depth_mm, height_mm, slopeAngle_rad, x_mm: 0, y_mm: 0, z_mm: 0 }),
      inputFeatureIds: Object.freeze([]),
    });

    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "SLOPED_ROOF",
        profile: Object.freeze({ width_mm, depth_mm, slopeAngle_rad }),
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });

    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // NUEVO: VOID_EXTRUSION (para patios interiores complejos)
  if (building.geometry2d.shapeType === "VOID_EXTRUSION") {
    const height_mm = exactMillimetres(building.geometry3d.heightM);
    if (height_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const width_mm = exactMillimetres(building.geometry2d.widthM);
    const depth_mm = exactMillimetres(building.geometry2d.depthM);
    if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };

    const outerPolygon_mm = [
      { x_mm: 0, y_mm: 0 },
      { x_mm: width_mm, y_mm: 0 },
      { x_mm: width_mm, y_mm: depth_mm },
      { x_mm: 0, y_mm: depth_mm },
    ];
    const innerPolygons_mm = [[
      { x_mm: Math.round(width_mm * 0.3), y_mm: Math.round(depth_mm * 0.3) },
      { x_mm: Math.round(width_mm * 0.7), y_mm: Math.round(depth_mm * 0.3) },
      { x_mm: Math.round(width_mm * 0.7), y_mm: Math.round(depth_mm * 0.7) },
      { x_mm: Math.round(width_mm * 0.3), y_mm: Math.round(depth_mm * 0.7) },
    ]];

    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "VOID_EXTRUSION",
      producesObjectId: objectId,
      parameters: Object.freeze({ outerPolygon_mm, innerPolygons_mm, height_mm, x_mm: 0, y_mm: 0, z_mm: 0 }),
      inputFeatureIds: Object.freeze([]),
    });

    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "VOID_EXTRUSION",
        profile: Object.freeze({ outerPolygon_mm, innerPolygons_mm }),
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });

    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // NUEVO: EXTRUDED_CIRCLE (para estadios, arenas, cúpulas)
  if (building.geometry2d.shapeType === "CIRCLE") {
    const height_mm = exactMillimetres(building.geometry3d.heightM);
    if (height_mm === null) {
      return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    }
    const radius_mm = Math.round(Math.sqrt(building.geometry2d.footprintM2 / Math.PI) * 1000);

    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "EXTRUDE_CIRCLE",
      producesObjectId: objectId,
      parameters: Object.freeze({ radius_mm, height_mm, x_mm: 0, y_mm: 0, z_mm: 0 }),
      inputFeatureIds: Object.freeze([]),
    });

    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "EXTRUDED_CIRCLE",
        profile: Object.freeze({ radius_mm }),
        x_mm: 0,
        y_mm: 0,
        z_mm: 0,
        height_mm,
      }),
    });

    return {
      ok: true,
      object,
      feature,
      causalModel: Object.freeze({
        features: Object.freeze([feature]),
        constraints: Object.freeze([]),
      }),
    };
  }

  // NUEVO: MULTI_SOLID (para clusters de edificios)
  if (building.geometry2d.shapeType === "CLUSTER") {
    const height_mm = exactMillimetres(building.geometry3d.heightM);
    if (height_mm === null) {
      return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    }
    const width_mm = exactMillimetres(building.geometry2d.widthM);
    const depth_mm = exactMillimetres(building.geometry2d.depthM);
    if (width_mm === null || depth_mm === null) {
      return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    }

    // Dos bloques: uno a la izquierda y otro a la derecha
    const blockW = Math.round(width_mm * 0.45);
    const blockD = Math.round(depth_mm * 0.45);
    const solids = [
      { width_mm: blockW, depth_mm: blockD, height_mm, x_mm: 0, y_mm: 0, z_mm: 0 },
      { width_mm: blockW, depth_mm: blockD, height_mm, x_mm: width_mm - blockW, y_mm: depth_mm - blockD, z_mm: 0 },
    ];

    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "MULTI_SOLID",
      producesObjectId: objectId,
      parameters: Object.freeze({ solids }),
      inputFeatureIds: Object.freeze([]),
    });

    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "MULTI_SOLID",
        solids,
      }),
    });

    return {
      ok: true,
      object,
      feature,
      causalModel: Object.freeze({
        features: Object.freeze([feature]),
        constraints: Object.freeze([]),
      }),
    };
  }

  if (building.geometry2d.polygon && building.geometry2d.polygon.length >= 3) {
    const height_mm = exactMillimetres(building.geometry3d.heightM);
    if (height_mm === null) {
      return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    }

    const polygon_mm = building.geometry2d.polygon.map((p) => ({
      x_mm: Math.round(p.x * 1000),
      y_mm: Math.round(p.y * 1000),
    }));

    const voids_mm = (building.geometry2d.voids ?? []).map((voidPolygon) =>
      voidPolygon.map((p) => ({
        x_mm: Math.round(p.x * 1000),
        y_mm: Math.round(p.y * 1000),
      }))
    );

    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "EXTRUDE_POLYGON",
      producesObjectId: objectId,
      parameters: Object.freeze({ polygon_mm, voids_mm, height_mm, x_mm: 0, y_mm: 0, z_mm: 0 }),
      inputFeatureIds: Object.freeze([]),
    });

    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "EXTRUDED_POLYGON",
        profile: Object.freeze({ polygon_mm, voids_mm }),
        x_mm: 0,
        y_mm: 0,
        z_mm: 0,
        height_mm,
      }),
    });

    return {
      ok: true,
      object,
      feature,
      causalModel: Object.freeze({
        features: Object.freeze([feature]),
        constraints: Object.freeze([]),
      }),
    };
  }


  // AGK-003 first vertical slice: rectangular/linear conceptual mass only.
  // Courtyard, arena and podium/tower strategies require multiple solids /
  // void semantics and must not be silently flattened to one rectangle.
  // COMPACT sin polígono se trata como rectángulo (fallback).
  // COMPACT y LINEAR se tratan como rectángulos
  if (building.geometry2d.type !== "LINEAR_MASS" && building.geometry2d.shapeType !== "COMPACT" && building.geometry2d.shapeType !== "LINEAR") {
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
