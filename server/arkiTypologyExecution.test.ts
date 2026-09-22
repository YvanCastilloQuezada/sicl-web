import { describe, expect, it } from "vitest";
import { arkiTypologyExecutionSummary, exportArkiTypology, generateArkiTypology, searchArkiTypologies, validateArkiTypology } from "../shared/arkiTypologyExecution";

describe("ARKI typology execution", () => {
  it("generates a governed conceptual proposal", () => {
    const result = generateArkiTypology({ typologyId: "HEALTH_HOSPITAL_GENERAL", overrides: { area_m2: 12000, capacity: 400, levels: 5 } });
    expect(result.typology.name).toBe("Hospital general");
    expect(result.geometry.kind).toBe("RECTANGULAR_MASS");
    expect(result.metrics.capacity).toBe(400);
    expect(result.status).toBe("AI_PROPOSED");
    expect(result.humanReviewRequired).toBe(true);
    expect(result.projectStateMutation).toBe("NOT_REQUESTED");
  });

  it("validates without promoting or mutating Core", () => {
    const result = validateArkiTypology({ typologyId: "SPORT_ESTADIO", overrides: { capacity: 80000 } });
    expect(result.validation).toBeDefined();
    expect(result.canonicalPromotion).toBe("NOT_REQUESTED");
    expect(result.humanReviewRequired).toBe(true);
  });

  it("supports deterministic semantic baseline search", () => {
    const results = searchArkiTypologies("hospital camas emergencia", undefined, 5);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain("hospital");
  });

  it("exports JSON, GeoJSON and SVG without executing external code", () => {
    const generation = generateArkiTypology({ typologyId: "RES_UNIFAMILIAR" });
    expect(exportArkiTypology(generation, "JSON").mimeType).toBe("application/json");
    expect(exportArkiTypology(generation, "GEOJSON").content).toContain("FeatureCollection");
    expect(exportArkiTypology(generation, "SVG").content).toContain("<svg");
  });

  it("reports the registered catalog and gates", () => {
    const summary = arkiTypologyExecutionSummary();
    expect(summary.registeredTypologies).toBeGreaterThanOrEqual(40);
    expect(summary.gates).toContain("NO_CORE_MUTATION");
  });
});
