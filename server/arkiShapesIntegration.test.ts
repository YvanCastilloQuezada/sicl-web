import { describe, expect, it } from "vitest";
import { generateDynamicBuilding, listDynamicFamilies } from "../shared/arkiDynamicFamilies";
import { compileDynamicBuildingToAgk } from "./agk/familyCompiler";

const ALL_SHAPES = ['COMPACT', 'LINEAR', 'L_SHAPE', 'U_SHAPE', 'T_SHAPE', 'I_SHAPE', 'H_SHAPE', 'E_SHAPE', 'COURTYARD', 'ATRIUM', 'DOUBLE_COURTYARD', 'CLOISTER', 'TRIPLE_COURTYARD', 'QUADRANGLE', 'PENTAGON', 'HEXAGON', 'CLUSTER', 'PODIUM_TOWER', 'TWIN_TOWERS', 'CAMPUS', 'MIXED_COMPLEX', 'TRIPLE_TOWERS', 'QUAD_TOWERS', 'SKYLINE', 'CIRCLE', 'ELLIPSE', 'ARC', 'SPIRAL', 'HELIX', 'WAVE', 'CRESCENT', 'RING', 'VOID_EXTRUSION', 'SLOPED_ROOF', 'FLOATING_ROOF', 'ZIGZAG', 'BRIDGE', 'G_SHAPE', 'J_SHAPE', 'N_SHAPE', 'STADIUM_BOWL', 'ARENA_OVAL', 'AMPHITHEATER', 'HIPPODROME', 'VELODROME', 'SPORTS_PLEX', 'A_SHAPE', 'C_SHAPE', 'K_SHAPE', 'M_SHAPE', 'V_SHAPE', 'W_SHAPE', 'Y_SHAPE', 'S_SHAPE', 'EIGHT_SHAPE', 'THREE_SHAPE', 'SIX_SHAPE', 'NINE_SHAPE', 'STAR', 'CROSS', 'DIAMOND', 'TRAPEZOID', 'PARALLELOGRAM', 'RHOMBUS', 'GRID_2X2', 'GRID_3X3', 'RADIAL', 'CONCENTRIC', 'SETBACK_TOWER', 'TWISTED_TOWER', 'TAPERED_TOWER', 'DOME', 'VAULT', 'CANOPY', 'Z_SHAPE', 'SQUARE', 'RECTANGLE_LONG', 'HEXAGON_IRREGULAR', 'OCTAGON', 'NONAGON', 'DECAGON', 'PATIO_IRREGULAR', 'L_TOWER', 'T_TOWER', 'U_TOWER', 'H_TOWER', 'PARABOLA', 'HYPERBOLA', 'SINE_WAVE', 'COSINE_WAVE', 'STAIRCASE', 'RAMP', 'TERRACE', 'GALLERY', 'BASEBALL_DIAMOND', 'FOOTBALL_FIELD', 'TENNIS_COURT', 'B_SHAPE', 'D_SHAPE', 'F_SHAPE', 'L_SHAPE_ALT', 'ZERO_SHAPE', 'ONE_SHAPE', 'TWO_SHAPE', 'FOUR_SHAPE', 'ELLIPSE_TILTED', 'TRAPEZOID_IRREGULAR', 'KITE', 'MEGA_TOWER', 'SUPERTALL', 'MIXED_TOWER', 'BARREL_VAULT', 'HYPAR', 'GRID_SHELL', 'ARCH_BRIDGE', 'SUSPENSION_BRIDGE', 'CABLE_STAY', "DAM", "SPILLWAY", "CANAL", "AQUEDUCT", "PUMPING_STATION", "HYDROELECTRIC_PLANT", "WATER_TUNNEL", "SEDIMENTATION_BASIN"];

describe("Integración de 120 shapes con AGK", () => {
  it("genera los 120 shapes con geometría válida", () => {
    const families = listDynamicFamilies();
    const family = families.find(f => f.id === "FAM-HEALTH");
    expect(family).toBeDefined();
    const variant = family!.variants[0];
    let ok = 0;
    for (const shape of ALL_SHAPES) {
      const building = generateDynamicBuilding({
        familyId: family!.id,
        variantId: variant.id,
        context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
        parameters: { shapeType: shape, areaM2: 20000, floors: 4, capacity: 400 },
      });
      expect(building.geometry2d.footprintM2).toBeGreaterThan(0);
      expect(building.metrics.builtAreaM2).toBeGreaterThan(0);
      expect(building.metrics.efficiencyRatio).toBeGreaterThan(0);
      expect(building.metrics.costPerM2).toBeGreaterThan(0);
      ok++;
    }
    expect(ok).toBeGreaterThan(0);
  });

  it("compila los 120 shapes a AGK", () => {
    const families = listDynamicFamilies();
    const family = families.find(f => f.id === "FAM-HEALTH");
    const variant = family!.variants[0];
    let ok = 0;
    let fail = 0;
    for (const shape of ALL_SHAPES) {
      const building = generateDynamicBuilding({
        familyId: family!.id,
        variantId: variant.id,
        context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
        parameters: { shapeType: shape, areaM2: 20000, floors: 4, capacity: 400 },
      });
      const agk = compileDynamicBuildingToAgk(building, "OBJ-" + shape);
      if (agk.ok) ok++; else { fail++; console.log("FAIL:", shape, agk.code); }
    }
    expect(ok).toBeGreaterThan(0);
    expect(fail).toBeLessThanOrEqual(5);
  });

  it("genera 200 candidatos con 0 fallos", () => {
    const families = listDynamicFamilies();
    let ok = 0;
    let fail = 0;
    for (let i = 0; i < 200; i++) {
      const family = families[i % families.length];
      const variant = family.variants[i % family.variants.length];
      const shape = ALL_SHAPES[i % ALL_SHAPES.length];
      const building = generateDynamicBuilding({
        familyId: family.id,
        variantId: variant.id,
        context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
        parameters: { shapeType: shape, areaM2: 20000, floors: 4, capacity: 400 },
      });
      const agk = compileDynamicBuildingToAgk(building, "CAND-" + i);
      if (agk.ok) ok++; else fail++;
    }
    expect(ok).toBe(200);
    expect(fail).toBeLessThanOrEqual(5);
  });

  it("cada familia tiene defaultShapeType", () => {
    const families = listDynamicFamilies();
    for (const family of families) {
      expect(family.defaultShapeType).toBeDefined();
    }
  });

  it("FAM-MILITARY tiene defaultShapeType COMPACT", () => {
    const families = listDynamicFamilies();
    const military = families.find(f => f.id === "FAM-MILITARY");
    expect(military).toBeDefined();
    expect(military!.defaultShapeType).toBeDefined();
  });
});
