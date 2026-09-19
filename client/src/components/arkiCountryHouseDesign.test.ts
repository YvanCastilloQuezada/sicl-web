import { describe, expect, it } from "vitest";
import { buildCountryHouseDesign, countryHouseAreaSummary, validateCountryHouseDesign } from "./arkiCountryHouseDesign";

describe("ARKI country house 20x40", () => {
  it("contains the requested residential program", () => {
    const design = buildCountryHouseDesign();
    const ids = design.rooms.map((room) => room.programId);
    expect(design.site.maxX - design.site.minX).toBe(20);
    expect(design.site.maxY - design.site.minY).toBe(40);
    expect(ids.filter((id) => id === "BEDROOM" || id === "MASTER_BEDROOM")).toHaveLength(5);
    expect(ids.filter((id) => id === "ENSUITE_BATHROOM")).toHaveLength(2);
    expect(ids).toContain("KITCHEN");
    expect(ids).toContain("FAMILY_ROOM");
    expect(ids).toContain("EXTERIOR_PARKING");
  });

  it("keeps the courtyard and stair continuous between levels", () => {
    const design = buildCountryHouseDesign();
    const result = validateCountryHouseDesign(design);
    expect(result.stairContinuityPass).toBe(true);
    expect(result.lightwellContinuityPass).toBe(true);
    expect(design.rooms.find((room) => room.id === "COURTYARD-N2")?.role).toBe("VOID");
  });

  it("records a functional sequence and preserves human review", () => {
    const design = buildCountryHouseDesign();
    expect(design.functionalOrganigram.sequence).toEqual(["ARRIVAL", "SOCIAL", "FOOD", "PRIVATE", "REST", "SERVICE", "OUTDOOR"]);
    expect(design.functionalOrganigram.relations.some((relation) => relation.relation === "FOOD_WORKFLOW")).toBe(true);
    expect(validateCountryHouseDesign(design).hypothesis).toBe(true);
  });

  it("reports conceptual areas without claiming permit documentation", () => {
    const summary = countryHouseAreaSummary();
    expect(summary.siteM2).toBe(800);
    expect(summary.coveredConceptualM2).toBeGreaterThan(150);
    expect(summary.coveredConceptualM2).toBeLessThan(450);
  });
});
