import { describe, expect, it } from "vitest";
import { getClimateData } from "./arkiMeteoEngine";
import { assessBioclimaticStrategy } from "../../../shared/arkiClimateUtils";

describe("ARKI Meteo Engine — Open-Meteo Integration", () => {
  // Usamos fechas cercanas al presente para que el endpoint 'forecast' de Open-Meteo responda
  const today = new Date().toISOString().split("T")[0];

  it("Trujillo (Costa): debe recomendar ventilación o sombreado según la hora", async () => {
    // Trujillo: -8.1091, -79.0211
    const data = await getClimateData(-8.1091, -79.0211, today, 14); // 2 PM
    expect(data.tempC).toBeGreaterThan(15);
    expect(data.rh).toBeGreaterThan(40);
    // La estrategia debe tener sentido para la costa
    expect(["Ventilación natural", "Sombreado pesado", "Confort térmico", "Ventilación cruzada forzada"]).toContain(data.assessment.strategy);
  }, 10000);

  it("Puno (Sierra): debe recomendar ganancia solar o masa térmica", async () => {
    // Puno: -15.8402, -70.0219
    const data = await getClimateData(-15.8402, -70.0219, today, 12); // Mediodía
    expect(data.tempC).toBeLessThan(25); // Generalmente más fresco
    expect(["Ganancia solar directa", "Masa térmica", "Confort térmico", "Aislamiento térmico"]).toContain(data.assessment.strategy);
  }, 10000);

  it("Iquitos (Selva): debe recomendar ventilación cruzada por alta humedad", async () => {
    // Iquitos: -3.7437, -73.2516
    const data = await getClimateData(-3.7437, -73.2516, today, 14);
    expect(data.rh).toBeGreaterThan(60); // Selva es húmeda
    expect(["Ventilación cruzada forzada", "Ventilación natural", "Sombreado pesado"]).toContain(data.assessment.strategy);
  }, 10000);

  it("Lima (Costa central): debe manejar la alta humedad invernal/estival", async () => {
    // Lima: -12.0464, -77.0428
    const data = await getClimateData(-12.0464, -77.0428, today, 15);
    expect(data.tempC).toBeGreaterThan(10);
    expect(data.rh).toBeGreaterThan(50);
  }, 10000);
});

describe("ARKI Climate Utils — Givoni Logic", () => {
  it("Frío y seco (Puno) -> Masa térmica / Ganancia solar", () => {
    const result = assessBioclimaticStrategy({ tempC: 8, rh: 40, windSpeedMs: 2 });
    expect(result.strategy).toBe("Ganancia solar directa");
    expect(result.comfortLevel).toBe("Frío");
  });

  it("Cálido y húmedo (Iquitos) -> Ventilación cruzada", () => {
    const result = assessBioclimaticStrategy({ tempC: 32, rh: 85, windSpeedMs: 1 });
    expect(result.strategy).toBe("Ventilación cruzada forzada");
    expect(result.comfortLevel).toBe("Caluroso");
  });

  it("Confort (Trujillo día agradable) -> Confort térmico", () => {
    const result = assessBioclimaticStrategy({ tempC: 24, rh: 60, windSpeedMs: 3 });
    expect(result.strategy).toBe("Confort térmico");
  });
});
