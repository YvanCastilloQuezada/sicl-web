import { describe, expect, it } from "vitest";
import { calculateEmbodiedCarbon } from "./embodiedCarbon";
import { calculateOperationalCarbon } from "./operationalCarbon";
import { netZeroScore } from "./netZeroScore";
import { CARBON_FACTORS } from "./carbonFactors";

describe("Sostenibilidad — cálculo de carbono incorporado (A1-A5)", () => {
  it("vivienda con materiales estándar → ~400 kgCO2e/m2 → FAIL", () => {
    // Vivienda de 100 m2 con materiales estándar.
    const quantities = [
      { materialId: "concrete-c30", quantity_kg: 120000 }, // 50 m3 × 2400 kg/m3
      { materialId: "steel-rebar", quantity_kg: 5000 },
      { materialId: "glass-double", quantity_kg: 2000 },
      { materialId: "insulation-mineral-wool", quantity_kg: 500 },
    ];
    const result = calculateEmbodiedCarbon(quantities, CARBON_FACTORS, 100);
    expect(result.kgco2e_per_m2).toBeDefined();
    expect(result.kgco2e_per_m2!).toBeGreaterThan(300);
    expect(result.unknownMaterials).toEqual([]);
  });

  it("vivienda con materiales reciclados → menor carbono → posible PASS", () => {
    const quantities = [
      { materialId: "concrete-c30", quantity_kg: 120000 },
      { materialId: "steel-recycled", quantity_kg: 5000 }, // reciclado
      { materialId: "glass-double", quantity_kg: 2000 },
      { materialId: "insulation-cellulose", quantity_kg: 500 }, // celulosa
    ];
    const result = calculateEmbodiedCarbon(quantities, CARBON_FACTORS, 100);
    expect(result.kgco2e_per_m2).toBeDefined();
    // El acero reciclado (0.47 vs 1.99) y la celulosa (0.16 vs 1.20) reducen el carbono.
    expect(result.total_kgco2e).toBeGreaterThan(0);
  });

  it("materiales desconocidos → se reportan en unknownMaterials", () => {
    const quantities = [
      { materialId: "concrete-c30", quantity_kg: 1000 },
      { materialId: "unobtainium", quantity_kg: 100 },
    ];
    const result = calculateEmbodiedCarbon(quantities, CARBON_FACTORS, 10);
    expect(result.unknownMaterials).toContain("unobtainium");
  });

  it("madera captura carbono → GWP negativo", () => {
    const quantities = [{ materialId: "timber-glulam", quantity_kg: 10000 }];
    const result = calculateEmbodiedCarbon(quantities, CARBON_FACTORS, 100);
    // Madera: -0.60 kgCO2e/kg × 10000 kg = -6000 kgCO2e (captura)
    expect(result.a1a3_kgco2e).toBeLessThan(0);
  });
});

describe("Sostenibilidad — carbono operacional (B6)", () => {
  it("energía anual × intensidad de red → carbono operacional anual", () => {
    const result = calculateOperationalCarbon(50000, 0.45, 60);
    expect(result.annual_kgco2e).toBe(22500); // 50000 × 0.45
    expect(result.lifecycle_60y_kgco2e).toBe(1350000); // 22500 × 60
  });

  it("energía solar (intensidad 0) → carbono operacional 0", () => {
    const result = calculateOperationalCarbon(50000, 0, 60);
    expect(result.annual_kgco2e).toBe(0);
    expect(result.lifecycle_60y_kgco2e).toBe(0);
  });
});

describe("Sostenibilidad — score Net Zero", () => {
  it("carbono 300 kgCO2e/m2 → PASS contra LETI 2020 (350)", () => {
    const score = netZeroScore(300);
    expect(score.leti2020).toBe("PASS");
    expect(score.overall).toBe("PASS");
  });

  it("carbono 400 kgCO2e/m2 → PARTIAL contra LETI 2020 (350)", () => {
    const score = netZeroScore(400);
    expect(score.leti2020).toBe("PARTIAL");
  });

  it("carbono 500 kgCO2e/m2 → FAIL contra LETI 2020", () => {
    const score = netZeroScore(500);
    expect(score.leti2020).toBe("FAIL");
    expect(score.overall).toBe("FAIL");
  });

  it("carbono 700 kgCO2e/m2 → FAIL contra LETI, PARTIAL contra RIBA 2025 (750)", () => {
    const score = netZeroScore(700);
    expect(score.leti2020).toBe("FAIL");
    expect(score.overall).toBe("FAIL");
  });
});
