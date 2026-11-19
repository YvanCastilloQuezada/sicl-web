import { describe, expect, it } from "vitest";
import { calculateEmbodiedCarbon, estimateBaselineCarbon, type MaterialQuantity } from "./arkiLCACalculator";

describe("ARKI LCA Calculator", () => {
  it("debe calcular correctamente la huella de carbono de una lista de materiales", () => {
    const quantities: MaterialQuantity[] = [
      { material: "Concreto Estructural", quantity: 10, unit: "m3" },
      { material: "Vidrio Monolítico", quantity: 5, unit: "m2" },
    ];
    
    const result = calculateEmbodiedCarbon(quantities, 50);
    
    // Concreto: 10 * 250 = 2500
    // Vidrio: 5 * 400 = 2000
    // Total = 4500 kgCO2e
    expect(result.totalKgCO2e).toBe(4500);
    expect(result.kgCO2ePerM2).toBe(90); // 4500 / 50
    expect(result.breakdown["Concreto Estructural"]).toBe(2500);
  });

  it("debe generar una estimación válida para el modelo base 1:2", () => {
    const result = estimateBaselineCarbon();
    
    expect(result.totalKgCO2e).toBeGreaterThan(0);
    expect(result.kgCO2ePerM2).toBeGreaterThan(0);
    expect(result.breakdown["Concreto Estructural"]).toBe(5000); // 20 m3 * 250
    expect(result.breakdown["Ladrillo de Arcilla"]).toBe(2160);  // 14.4 m3 * 150
  });
});
