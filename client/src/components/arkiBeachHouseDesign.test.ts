import { describe, expect, it } from "vitest";
import { beachHouseAreaSummary, buildBeachHouseDesign, validateBeachHouseDesign } from "./arkiBeachHouseDesign";

describe("ARKI beach house 30x50", () => {
  it("contains the requested site, occupants, bedrooms and pool", () => {
    const design = buildBeachHouseDesign();
    expect(design.site.maxX - design.site.minX).toBe(30);
    expect(design.site.maxY - design.site.minY).toBe(50);
    expect(design.occupants).toEqual({ parents: 2, children: 5, guests: 3, total: 10 });
    expect(design.rooms.filter((room) => ["MASTER_BEDROOM", "GUEST_BEDROOM", "BEDROOM"].includes(room.programId))).toHaveLength(5);
    expect(design.pool.areaM2).toBe(80);
  });

  it("keeps courtyard and stair continuous through N1 and N2", () => {
    const result = validateBeachHouseDesign();
    expect(result.stairContinuityPass).toBe(true);
    expect(result.courtyardContinuityPass).toBe(true);
  });

  it("integrates functional units and levels without losing human authority", () => {
    const design = buildBeachHouseDesign();
    expect(design.levels.map((level) => level.levelId)).toEqual(["N1", "N2"]);
    expect(design.functionalUnits).toHaveLength(4);
    expect(design.functionalUnits.find((unit) => unit.functionalUnitId === "UNIT-VERTICAL-COURTYARD")?.levelIds).toEqual(["N1", "N2"]);
    expect(validateBeachHouseDesign(design).multiscalePass).toBe(true);
    expect(validateBeachHouseDesign(design).hypothesis).toBe(true);
  });

  it("reports a conceptual area summary without claiming permit documents", () => {
    const summary = beachHouseAreaSummary();
    expect(summary.siteM2).toBe(1500);
    expect(summary.coveredConceptualM2).toBeGreaterThan(250);
    expect(summary.poolM2).toBe(80);
  });
});
