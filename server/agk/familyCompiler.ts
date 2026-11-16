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

  const shapeType = building.geometry2d.shapeType;
  const height_mm = exactMillimetres(building.geometry3d.heightM);
  if (height_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
  const width_mm = exactMillimetres(building.geometry2d.widthM);
  const depth_mm = exactMillimetres(building.geometry2d.depthM);

  // ============================================================
  // MAPEO EXPLÍCITO DE 120 SHAPES A 8 TIPOS DE FEATURE AGK
  // ============================================================

  // 1. EXTRUDED_RECTANGLE
  const rectangleShapes = ["COMPACT", "LINEAR", "RECTANGLE_LONG", "CANOPY"];
  if (rectangleShapes.includes(shapeType)) {
    if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
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
    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }


  // 9. OVERHANG (volados: CANOPY, FLOATING_ROOF, GALLERY, TERRACE)
  const overhangShapes = ["CANOPY", "FLOATING_ROOF", "GALLERY", "TERRACE"];
  if (overhangShapes.includes(shapeType)) {
    if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const thickness_mm = 300;
    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "OVERHANG",
      producesObjectId: objectId,
      parameters: Object.freeze({ width_mm, depth_mm, height_mm, thickness_mm, supportId: objectId, x_mm: 0, y_mm: 0, z_mm: 0 }),
      inputFeatureIds: Object.freeze([]),
    });
    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "OVERHANG",
        profile: Object.freeze({ width_mm, depth_mm, thickness_mm }),
        supportId: objectId,
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });
    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // 10. BRIDGE (puentes: BRIDGE, ARCH_BRIDGE, SUSPENSION_BRIDGE, CABLE_STAY)
  const bridgeShapes = ["BRIDGE", "ARCH_BRIDGE", "SUSPENSION_BRIDGE", "CABLE_STAY"];
  if (bridgeShapes.includes(shapeType)) {
    if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const thickness_mm = 300;
    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "BRIDGE",
      producesObjectId: objectId,
      parameters: Object.freeze({ width_mm, depth_mm, height_mm, thickness_mm, startSupportId: objectId + "-START", endSupportId: objectId + "-END", x_mm: 0, y_mm: 0, z_mm: 0 }),
      inputFeatureIds: Object.freeze([]),
    });
    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "BRIDGE",
        profile: Object.freeze({ width_mm, depth_mm, thickness_mm }),
        startSupportId: objectId + "-START",
        endSupportId: objectId + "-END",
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });
    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // 2. EXTRUDED_POLYGON (para shapes con polygon generado en geometryFor)
  const polygonShapes = [
    "L_SHAPE", "U_SHAPE", "T_SHAPE", "I_SHAPE", "H_SHAPE", "E_SHAPE",
    "COURTYARD", "ATRIUM", "DOUBLE_COURTYARD", "CLOISTER", "TRIPLE_COURTYARD",
    "QUADRANGLE", "PENTAGON", "HEXAGON", "HEXAGON_IRREGULAR", "OCTAGON", "NONAGON", "DECAGON",
    "PODIUM_TOWER", "TWIN_TOWERS", "CAMPUS", "MIXED_COMPLEX", "TRIPLE_TOWERS", "QUAD_TOWERS", "SKYLINE",
    "ELLIPSE", "SPIRAL", "HELIX", "WAVE", "CRESCENT", "RING",
    "ZIGZAG", "BRIDGE", "G_SHAPE", "J_SHAPE", "N_SHAPE",
    "A_SHAPE", "C_SHAPE", "K_SHAPE", "M_SHAPE", "V_SHAPE", "W_SHAPE", "Y_SHAPE", "S_SHAPE",
    "EIGHT_SHAPE", "THREE_SHAPE", "SIX_SHAPE", "NINE_SHAPE",
    "STAR", "CROSS", "DIAMOND", "TRAPEZOID", "PARALLELOGRAM", "RHOMBUS",
    "GRID_2X2", "GRID_3X3", "RADIAL", "CONCENTRIC",
    "SETBACK_TOWER", "TWISTED_TOWER", "TAPERED_TOWER",
    "DOME", "VAULT",
    "Z_SHAPE", "SQUARE", "PATIO_IRREGULAR",
    "L_TOWER", "T_TOWER", "U_TOWER", "H_TOWER",
    "PARABOLA", "HYPERBOLA", "SINE_WAVE", "COSINE_WAVE",
    "STAIRCASE", "RAMP", "TERRACE", "GALLERY",
    "BASEBALL_DIAMOND", "FOOTBALL_FIELD", "TENNIS_COURT",
    "B_SHAPE", "D_SHAPE", "F_SHAPE", "L_SHAPE_ALT",
    "ZERO_SHAPE", "ONE_SHAPE", "TWO_SHAPE", "FOUR_SHAPE",
    "ELLIPSE_TILTED", "TRAPEZOID_IRREGULAR", "KITE",
    "MEGA_TOWER", "SUPERTALL", "MIXED_TOWER",
    "BARREL_VAULT", "HYPAR", "GRID_SHELL",
    "ARCH_BRIDGE", "SUSPENSION_BRIDGE", "CABLE_STAY",
    "DAM", "SPILLWAY", "CANAL", "AQUEDUCT", "PUMPING_STATION", "HYDROELECTRIC_PLANT", "WATER_TUNNEL", "SEDIMENTATION_BASIN",
    "STADIUM_BOWL", "ARENA_OVAL", "AMPHITHEATER", "HIPPODROME", "VELODROME", "SPORTS_PLEX",
  ];
  if (polygonShapes.includes(shapeType) && building.geometry2d.polygon) {
    const polygon_mm = building.geometry2d.polygon.map((p) => ({
      x_mm: Math.round(p.x * 1000),
      y_mm: Math.round(p.y * 1000),
    }));
    const voids_mm = (building.geometry2d.voids ?? []).map((v) =>
      v.map((p) => ({ x_mm: Math.round(p.x * 1000), y_mm: Math.round(p.y * 1000) }))
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
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });
    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // 3. EXTRUDED_CIRCLE
  const circleShapes = ["CIRCLE", "DOME"];
  if (circleShapes.includes(shapeType)) {
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
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });
    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // 4. MULTI_SOLID
  const multiSolidShapes = ["CLUSTER", "PODIUM_TOWER", "TWIN_TOWERS", "TRIPLE_TOWERS", "QUAD_TOWERS", "CAMPUS", "MIXED_COMPLEX", "SKYLINE", "BRIDGE", "ARCH_BRIDGE", "SUSPENSION_BRIDGE", "CABLE_STAY", "SETBACK_TOWER", "TWISTED_TOWER", "TAPERED_TOWER", "MEGA_TOWER", "SUPERTALL", "MIXED_TOWER", "DAM", "HYDROELECTRIC_PLANT"];
  if (multiSolidShapes.includes(shapeType) && building.geometry2d.polygon) {
    const polygon_mm = building.geometry2d.polygon.map((p) => ({
      x_mm: Math.round(p.x * 1000),
      y_mm: Math.round(p.y * 1000),
    }));
    const feature: AgkFeature = Object.freeze({
      featureId: `family:${building.familyId}:${building.variantId}:${objectId}`,
      kind: "MULTI_SOLID",
      producesObjectId: objectId,
      parameters: Object.freeze({ solids: [{ width_mm: width_mm ?? 0, depth_mm: depth_mm ?? 0, height_mm, x_mm: 0, y_mm: 0, z_mm: 0 }] }),
      inputFeatureIds: Object.freeze([]),
    });
    const object: AgkOperationalObject = Object.freeze({
      objectId,
      geometry: Object.freeze({
        kind: "MULTI_SOLID",
        solids: [{ width_mm: width_mm ?? 0, depth_mm: depth_mm ?? 0, height_mm, x_mm: 0, y_mm: 0, z_mm: 0 }],
      }),
    });
    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // 5. FLOATING_SLAB
  if (shapeType === "FLOATING_ROOF" || shapeType === "CANOPY") {
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

  // 6. EXTRUDED_ARC
  if (["ARC", "SPIRAL", "HELIX", "AMPHITHEATER", "BARREL_VAULT", "HYPAR"].includes(shapeType)) {
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

  // 7. SLOPED_ROOF
  if (shapeType === "SLOPED_ROOF") {
    if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const slopeAngle_rad = Math.PI / 6;
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

  // 8. VOID_EXTRUSION
  if (shapeType === "VOID_EXTRUSION") {
    if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
    const outerPolygon_mm = [
      { x_mm: 0, y_mm: 0 }, { x_mm: width_mm, y_mm: 0 },
      { x_mm: width_mm, y_mm: depth_mm }, { x_mm: 0, y_mm: depth_mm },
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

  // Fallback: si el shape no está en ninguna lista, usar EXTRUDED_POLYGON o EXTRUDED_RECTANGLE
  if (building.geometry2d.polygon) {
    const polygon_mm = building.geometry2d.polygon.map((p) => ({
      x_mm: Math.round(p.x * 1000),
      y_mm: Math.round(p.y * 1000),
    }));
    const voids_mm = (building.geometry2d.voids ?? []).map((v) =>
      v.map((p) => ({ x_mm: Math.round(p.x * 1000), y_mm: Math.round(p.y * 1000) }))
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
        x_mm: 0, y_mm: 0, z_mm: 0, height_mm,
      }),
    });
    return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
  }

  // Fallback final: EXTRUDED_RECTANGLE
  if (width_mm === null || depth_mm === null) return { ok: false, code: "FAMILY_DIMENSION_INVALID" };
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
  return { ok: true, object, feature, causalModel: Object.freeze({ features: Object.freeze([feature]), constraints: Object.freeze([]) }) };
}
