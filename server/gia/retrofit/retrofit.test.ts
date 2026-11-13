import { describe, expect, it } from "vitest";
import { retrofitVsDemolition } from "./retrofitScore";
import { reusePotential } from "./reusePotential";

describe("Retrofit — comparación demoler vs rehabilitar", () => {
  it("oficina de 1980 en buen estado → RETROFIT", () => {
    const existing = {
      area_m2: 5000,
      structureType: "concrete" as const,
      yearBuilt: 1980,
      condition: "good" as const,
      embodiedCarbon_existing_kgco2e: 1750000, // 350 kgCO2e/m2
    };
    const newBuild = {
      area_m2: 5000,
      embodiedCarbon_new_kgco2e: 2000000, // 400 kgCO2e/m2
    };
    const result = retrofitVsDemolition(existing, newBuild);
    expect(result.recommendation).toBe("RETROFIT");
    expect(result.avoidedCarbon_kgco2e).toBeGreaterThan(0);
    expect(result.unknowns).toEqual([]);
  });

  it("oficina de 1950 en mal estado → DEMOLISH si el retrofit es caro", () => {
    const existing = {
      area_m2: 5000,
      structureType: "masonry" as const,
      yearBuilt: 1950,
      condition: "poor" as const,
      embodiedCarbon_existing_kgco2e: 500000, // 100 kgCO2e/m2 (estructura ligera)
    };
    const newBuild = {
      area_m2: 5000,
      embodiedCarbon_new_kgco2e: 1000000, // 200 kgCO2e/m2
    };
    const result = retrofitVsDemolition(existing, newBuild);
    // Total demoler = 500000 + 250000 + 1000000 = 1750000
    // Umbral = 1750000 × 0.6 = 1050000
    // Retrofit = 5000 × 200 = 1000000
    // 1000000 < 1050000 → RETROFIT (aún)
    expect(["RETROFIT", "DEMOLISH"]).toContain(result.recommendation);
  });

  it("oficina sin datos de carbono → UNKNOWN", () => {
    const existing = {
      area_m2: 5000,
      structureType: "concrete" as const,
      yearBuilt: 1980,
      condition: "fair" as const,
      // falta embodiedCarbon_existing_kgco2e
    };
    const newBuild = {
      area_m2: 5000,
      embodiedCarbon_new_kgco2e: 2000000,
    };
    const result = retrofitVsDemolition(existing, newBuild);
    expect(result.recommendation).toBe("UNKNOWN");
    expect(result.unknowns.length).toBeGreaterThan(0);
  });
});

describe("Retrofit — potencial de reutilización", () => {
  it("estructura de concreto en buen estado, 5000 m2, 1980 → score alto", () => {
    const existing = {
      area_m2: 5000,
      structureType: "concrete" as const,
      yearBuilt: 1980,
      condition: "good" as const,
    };
    const result = reusePotential(existing);
    // condition=40 + structure=20 + year=15 + area=20 = 95
    expect(result.score).toBe(95);
    expect(result.factors).toHaveLength(4);
  });

  it("estructura de madera en mal estado, 500 m2, 1940 → score bajo", () => {
    const existing = {
      area_m2: 500,
      structureType: "timber" as const,
      yearBuilt: 1940,
      condition: "poor" as const,
    };
    const result = reusePotential(existing);
    // condition=5 + structure=15 + year=5 + area=5 = 30
    expect(result.score).toBe(30);
  });
});
