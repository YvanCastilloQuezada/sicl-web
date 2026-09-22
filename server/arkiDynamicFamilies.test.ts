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
});
