import { describe, expect, it } from "vitest";
import { buildSpatialHierarchy, summarizeSpatialHierarchy, validateSpatialHierarchy } from "./arkiMultiscaleSpatialHierarchy";

describe("ARKI multiscale spatial hierarchy", () => {
  const base = {
    projectId: "RESTAURANT-001",
    alternativeId: "ALT-A",
    spaces: [
      { id: "ENTRY", levelId: "N1", programId: "ENTRY", flow: "PUBLIC" as const },
      { id: "DINING-N1", levelId: "N1", programId: "DINING", flow: "USER" as const },
      { id: "KITCHEN", levelId: "N1", programId: "KITCHEN", flow: "SERVICE" as const },
      { id: "DINING-N2", levelId: "N2", programId: "DINING", flow: "USER" as const },
      { id: "STAIR-N1", levelId: "N1", programId: "STAIR", flow: "VERTICAL" as const },
      { id: "STAIR-N2", levelId: "N2", programId: "STAIR", flow: "VERTICAL" as const },
    ],
    levels: [
      { levelId: "N1", projectId: "RESTAURANT-001", alternativeId: "ALT-A", levelIndex: 0, levelLabel: "N1", levelRole: "GROUND" as const, floorToFloorHeight: 3.2 },
      { levelId: "N2", projectId: "RESTAURANT-001", alternativeId: "ALT-A", levelIndex: 1, levelLabel: "N2", levelRole: "UPPER" as const, floorToFloorHeight: 3.2 },
    ],
    functionalUnits: [
      { functionalUnitId: "PUBLIC-ARRIVAL", name: "Acceso y atención pública", role: "PRIMARY" as const, necessity: "ESSENTIAL" as const, spaceIds: ["ENTRY", "DINING-N1", "DINING-N2"], activityIds: ["ARRIVE", "DINE"], flowKinds: ["PUBLIC", "USER"] as const, status: "PROPOSED" as const },
      { functionalUnitId: "FOOD-PRODUCTION", name: "Producción y servicio", role: "SERVICE" as const, necessity: "ESSENTIAL" as const, spaceIds: ["KITCHEN"], activityIds: ["RECEIVE", "COOK", "SERVE"], flowKinds: ["SERVICE"] as const, status: "PROPOSED" as const },
      { functionalUnitId: "VERTICAL-EGRESS", name: "Núcleo vertical y evacuación", role: "INFRASTRUCTURE" as const, necessity: "ESSENTIAL" as const, spaceIds: ["STAIR-N1", "STAIR-N2"], activityIds: ["EVACUATE", "CONNECT_LEVELS"], flowKinds: ["VERTICAL", "EMERGENCY"] as const, status: "PROPOSED" as const },
    ],
  };

  it("integrates functional units without duplicating spaces or geometry", () => {
    const hierarchy = buildSpatialHierarchy(base);
    expect(hierarchy.status).toBe("SUPPORTED");
    expect(hierarchy.noGeometryDuplication).toBe(true);
    expect(hierarchy.functionalUnits.find((unit) => unit.functionalUnitId === "PUBLIC-ARRIVAL")?.levelIds).toEqual(["N1", "N2"]);
    expect(hierarchy.levels.find((level) => level.levelId === "N2")?.functionalUnitIds).toContain("VERTICAL-EGRESS");
    expect(validateSpatialHierarchy(hierarchy)).toEqual([]);
  });

  it("distinguishes a level from a cross-level functional unit", () => {
    const hierarchy = buildSpatialHierarchy(base);
    const summary = summarizeSpatialHierarchy(hierarchy);
    expect(summary.levels).toBe(2);
    expect(summary.functionalUnits).toBe(3);
    expect(summary.crossLevelFunctionalUnits).toEqual(["PUBLIC-ARRIVAL", "VERTICAL-EGRESS"]);
    expect(summary.spacesReferenced).toBe(6);
  });

  it("preserves human review and reports broken unit references", () => {
    const hierarchy = buildSpatialHierarchy({ ...base, functionalUnits: [{ ...base.functionalUnits[0], spaceIds: ["UNKNOWN-SPACE"] }] });
    expect(hierarchy.status).toBe("CONFLICTING");
    expect(validateSpatialHierarchy(hierarchy)).toContain("FUNCTIONAL_UNIT_UNKNOWN_SPACE:PUBLIC-ARRIVAL");
    expect(hierarchy.humanReviewRequired).toBe(true);
  });
});
