import { describe, expect, it } from "vitest";
import { floodRisk } from "./floodRisk";
import { heatIslandScore } from "./heatIsland";
import { droughtResilience } from "./droughtResilience";
import { resilienceIndex } from "./resilienceIndex";

describe("Resiliencia — flood risk", () => {
  it("edificio costero con pendiente baja → HIGH", () => {
    const result = floodRisk(
      { slope: 0.01, elevation_m: 5, proximityToWater_m: 50 },
      80,
    );
    expect(result.score).toBe("HIGH");
  });

  it("edificio en pendiente alta, lejos del agua → LOW", () => {
    const result = floodRisk(
      { slope: 0.1, elevation_m: 200, proximityToWater_m: 2000 },
      50,
    );
    expect(result.score).toBe("LOW");
  });
});

describe("Resiliencia — heat island", () => {
  it("edificio en clima tropical, albedo bajo, sin vegetación → HIGH", () => {
    const result = heatIslandScore(
      { footprint_m2: 1000, height_m: 40, albedo: 0.2, vegetation_m2: 50 },
      "TROPICAL",
    );
    expect(result.score).toBe("HIGH");
    expect(result.uhiIntensity_c).toBeGreaterThan(2.5);
  });

  it("edificio con albedo alto y vegetación → LOW", () => {
    const result = heatIslandScore(
      { footprint_m2: 1000, height_m: 20, albedo: 0.7, vegetation_m2: 400 },
      "TEMPLADO",
    );
    expect(result.score).toBe("LOW");
  });
});

describe("Resiliencia — drought", () => {
  it("captación 60% de la demanda → HIGH", () => {
    const result = droughtResilience({
      rainwaterHarvesting_m3: 600,
      demand_m3: 1000,
      greywaterReuse: false,
    });
    expect(result.score).toBe("HIGH");
    expect(result.coverage_pct).toBe(60);
  });

  it("sin captación ni greywater → LOW", () => {
    const result = droughtResilience({
      rainwaterHarvesting_m3: 50,
      demand_m3: 1000,
      greywaterReuse: false,
    });
    expect(result.score).toBe("LOW");
  });
});

describe("Resiliencia — score combinado", () => {
  it("caso 1 (costero, sin vegetación, sin captación) → FAIL", () => {
    const result = resilienceIndex(
      { slope: 0.01, elevation_m: 5, proximityToWater_m: 50 },
      { footprint_m2: 1000, height_m: 40, albedo: 0.2, vegetation_m2: 50 },
      { rainwaterHarvesting_m3: 50, demand_m3: 1000, greywaterReuse: false },
      "TROPICAL",
      120,
    );
    expect(result.overall).toBe("FAIL");
  });

  it("caso 2 (techos verdes, captación, greywater) → PASS o PARTIAL", () => {
    const result = resilienceIndex(
      { slope: 0.1, elevation_m: 100, proximityToWater_m: 2000 },
      { footprint_m2: 1000, height_m: 15, albedo: 0.7, vegetation_m2: 400 },
      { rainwaterHarvesting_m3: 600, demand_m3: 1000, greywaterReuse: true },
      "TEMPLADO",
      50,
    );
    expect(["PASS", "PARTIAL"]).toContain(result.overall);
  });
});
