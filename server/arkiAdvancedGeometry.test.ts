import { describe, expect, it } from "vitest";
import { createHighQualityPlanSheet, generateAdvancedGeometry, resolveRegulationSource } from "./arkiAdvancedGeometry";

describe("ARKI advanced geometry and jurisdiction", () => {
  it("generates complex twisted geometry with multiple levels and faces", () => {
    const geometry = generateAdvancedGeometry("TWISTED_TOWER", { floors: 10, sides: 16, radius: 22, twistRadians: Math.PI / 2 });
    expect(geometry.status).toBe("CONCEPTUAL_GENERATED");
    expect(geometry.vertices.length).toBe(160);
    expect(geometry.faces.length).toBe(144);
    expect(geometry.levels).toHaveLength(10);
    expect(geometry.unknowns).toContain("structural feasibility");
    expect(geometry.humanReviewRequired).toBe(true);
  });

  it("creates high-quality representative plan sheets without mislabeling them as permit plans", () => {
    const geometry = generateAdvancedGeometry("FOLDED_COURTYARD", { floors: 4, sides: 10 });
    const sheet = createHighQualityPlanSheet(geometry, resolveRegulationSource("PE"));
    expect(sheet.graphicStatus).toBe("HIGH_REPRESENTATION_CONCEPTUAL");
    expect(sheet.notForPermit).toBe(true);
    expect(sheet.levels[0].segments.length).toBeGreaterThan(0);
    expect(sheet.levels[0].annotations).toContain("dimensions require validation");
  });

  it("registers the official Peru RNE source and keeps clause verification open", () => {
    const result = resolveRegulationSource("pe", "national");
    expect(result.status).toBe("SOURCE_READY_REVIEW_REQUIRED");
    expect(result.source?.authority).toContain("Ministerio");
    expect(result.source?.sourceUrl).toContain("gob.pe");
    expect(result.rulesApplied).toEqual([]);
    expect(result.unknowns).toContain("specific current clauses");
  });

  it("does not invent regulation when a country is not registered", () => {
    const result = resolveRegulationSource("XX");
    expect(result.status).toBe("NO_OFFICIAL_SOURCE_REGISTERED");
    expect(result.source).toBeNull();
    expect(result.humanReviewRequired).toBe(true);
  });
});
