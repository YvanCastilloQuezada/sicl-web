import { describe, expect, it } from "vitest";
import { getClimateProfile } from "./arkiKoppenGeiger";
import { getNormativeEngine, type NormativeStandard } from "./arkiNormativeEngine";

describe("ARKI Global Climate — Köppen-Geiger", () => {
  it("Trujillo, Perú debe ser desértico cálido (BWh)", () => {
    const profile = getClimateProfile(-8.1091, -79.0211, 31, "trujillo_pe");
    expect(profile.zone).toBe("BWh");
    expect(profile.passiveStrategies).toContain("Aleros profundos");
  });

  it("Puno, Perú debe ser alta montaña (ET)", () => {
    const profile = getClimateProfile(-15.8402, -70.0219, 3827, "puno_pe");
    expect(profile.zone).toBe("ET");
    expect(profile.passiveStrategies).toContain("Aislamiento térmico extremo");
  });

  it("Berlín, Alemania debe ser templado oceánico (Cfb)", () => {
    const profile = getClimateProfile(52.5200, 13.4050, 34, "berlin_de");
    expect(profile.zone).toBe("Cfb");
    expect(profile.passiveStrategies).toContain("Aislamiento térmico pesado");
  });

  it("Fallback heurístico: coordenadas aleatorias en trópico", () => {
    const profile = getClimateProfile(-5.0, -50.0, 100); // Amazonía genérica
    expect(["Af", "Aw"]).toContain(profile.zone);
  });
});

describe("ARKI Global Climate — Normative Engine", () => {
  it("RNE A.040 debe evaluar correctamente una vivienda con 1.5h de sol", () => {
    const engine = getNormativeEngine("RNE-A040-PE");
    const climate = getClimateProfile(-8.1, -79.0, 31, "trujillo_pe");
    const result = engine.evaluateSolarAccess(1.5, "vivienda", climate);
    
    expect(result.compliant).toBe(false);
    expect(result.required).toBe(2);
    expect(result.actual).toBe(1.5);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("RNE A.040 debe aprobar una escuela con 4.5h de sol", () => {
    const engine = getNormativeEngine("RNE-A040-PE");
    const climate = getClimateProfile(-12.0464, -77.0428, 154, "lima_pe");
    const result = engine.evaluateSolarAccess(4.5, "escuela", climate);
    
    expect(result.compliant).toBe(true);
    expect(result.required).toBe(4);
  });

  it("ASHRAE-55 debe ser instanciable y devolver fallback", () => {
    const engine = getNormativeEngine("ASHRAE-55");
    expect(engine.standard).toBe("ASHRAE-55");
    expect(engine.name).toContain("ASHRAE");
  });
});
