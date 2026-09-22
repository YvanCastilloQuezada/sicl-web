import { describe, expect, it } from "vitest";
import {
  DYNAMIC_BUILDING_FAMILIES,
  dynamicFamilyContract,
  dynamicFamilySummary,
  generateDynamicBuilding,
  getDynamicFamily,
  isProposalOnly,
  searchDynamicFamilies,
} from "../shared/arkiDynamicFamilies";
import { compareDynamicBuildings, exportDynamicBuilding } from "../shared/arkiFamilyComparison";

describe("ARKI dynamic building family generator", () => {
  it("exposes a small root registry with composable variants", () => {
    const summary = dynamicFamilySummary();
    expect(summary.familyCount).toBeGreaterThanOrEqual(4);
    expect(summary.variantCount).toBeGreaterThan(summary.familyCount);
    expect(DYNAMIC_BUILDING_FAMILIES.every((family) => family.variants.length > 0)).toBe(true);
  });

  it("generates an education building by merging base, variant and user parameters", () => {
    const result = generateDynamicBuilding({
      familyId: "FAM-EDUCATION",
      variantId: "SCHOOL",
      context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
      parameters: { areaM2: 12000, capacity: 1200, floors: 3 },
    });
    expect(result.familyId).toBe("FAM-EDUCATION");
    expect(result.parameters.capacity).toBe(1200);
    expect(result.program.primarySpaces).toContain("laboratorios");
    expect(result.geometry2d.footprintM2).toBeGreaterThan(0);
    expect(result.geometry3d.type).toBe("EXTRUSION_FROM_2D");
    expect(isProposalOnly(result)).toBe(true);
  });

  it("generates stadium-specific geometry metadata and preserves missing gates", () => {
    const result = generateDynamicBuilding({
      familyId: "FAM-SPORT",
      variantId: "STADIUM",
      context: { country: "PE", city: "Iquitos" },
      parameters: { areaM2: 100000, capacity: 80000, floors: 3, rings: 3 },
    });
    expect(result.geometry2d.type).toBe("ARENA_BOWL");
    expect(result.geometry2d.rings).toBe(3);
    expect(result.validation.status).toBe("UNKNOWN");
    expect(result.validation.unknowns).toContain("egressValidated");
    expect(result.validation.unknowns).toContain("coverStructuralValidated");
  });

  it("searches families and variants deterministically", () => {
    const matches = searchDynamicFamilies("hospital");
    expect(matches[0]).toMatchObject({ familyId: "FAM-HEALTH", variantId: "GENERAL" });
    expect(getDynamicFamily("FAM-COMMERCE")?.variants.map((variant) => variant.id)).toContain("MARKET");
  });

  it("publishes the fail-closed contract", () => {
    const contract = dynamicFamilyContract();
    expect(contract.flow).toContain("FAMILY -> VARIANT");
    expect(contract.gates).toContain("NO_CORE_MUTATION");
    expect(contract.limitations).toContain("not_native_revit_family");
  });

  it("adds offices and returns the three coordinated views in one generation", () => {
    const result = generateDynamicBuilding({ familyId: "FAM-OFFICES", variantId: "CORPORATE", context: { country: "PE", city: "Lima", jurisdiction: "RNE-PE" } });
    expect(result.program.primarySpaces).toContain("lobby corporativo");
    expect(result.unifiedGeometry.schema).toBe("ARKI-UNIFIED-GEOMETRY-1.0");
    expect(result.unifiedGeometry.plan).toEqual(result.geometry2d);
    expect(result.unifiedGeometry.section.totalHeightM).toBe(result.geometry3d.heightM);
  });

  it("compares up to four versions and exports enriched IFC without claiming native Revit", () => {
    const buildings = ["GENERAL", "CLINIC", "RURAL", "GENERAL"].map((variantId, index) => generateDynamicBuilding({ familyId: "FAM-HEALTH", variantId, context: { country: "PE", city: `Ciudad-${index}`, jurisdiction: "RNE-PE" }, parameters: { capacity: 100 + index * 50 } }));
    const comparison = compareDynamicBuildings(buildings.map((building, index) => ({ id: `v${index + 1}`, label: `Versión ${index + 1}`, version: `1.${index}`, building })), "DIFF");
    expect(comparison.versionCount).toBe(4);
    expect(comparison.metrics.length).toBeGreaterThan(0);
    const exported = exportDynamicBuilding(buildings[0], "IFC4");
    expect(exported.content).toContain("FILE_SCHEMA(('IFC4'))");
    expect(exported.metadata?.nativeRvt).toBe(false);
  });

  it("generates every registered family and every variant with governed three-view output", () => {
    const families = DYNAMIC_BUILDING_FAMILIES;
    expect(families).toHaveLength(12);
    const generated = families.flatMap((family) => family.variants.map((variant) => generateDynamicBuilding({ familyId: family.id, variantId: variant.id, context: { country: "PE", region: "Loreto", city: "Iquitos", climate: "tropical_humedo", seismicZone: "2", jurisdiction: "RNE-PE" } })));
    expect(generated.length).toBeGreaterThanOrEqual(35);
    for (const building of generated) {
      expect(building.metrics.footprintM2).toBeGreaterThan(0);
      expect(building.unifiedGeometry.plan).toBeDefined();
      expect(building.unifiedGeometry.section).toBeDefined();
      expect(building.unifiedGeometry.model3d).toBeDefined();
      expect(building.humanReviewRequired).toBe(true);
      expect(building.projectStateMutation).toBe("NOT_REQUESTED");
    }
  });
});
