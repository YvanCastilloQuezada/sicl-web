import { describe, expect, it } from "vitest";
import { runEnergySimulation } from "./arkiEnergyEngine";

describe("ARKI Energy Engine — Pipeline de Simulación", () => {
  it("debe ejecutar una simulación mínima exitosa y retornar KPIs", async () => {
    const input = {
      location: {
        name: "Lima_Test",
        latitude: -12.0464,
        longitude: -77.0428,
        altitude: 154,
        timezone: -5,
      },
      runPeriod: {
        startMonth: 1,
        startDay: 1,
        endMonth: 1,
        endDay: 31,
      },
    };

    const result = await runEnergySimulation(input);

    expect(result.simulationSuccessful).toBe(true);
    expect(result.totalHeatingEnergy_kWh).toBeGreaterThanOrEqual(0);
    expect(result.totalCoolingEnergy_kWh).toBeGreaterThanOrEqual(0);
    expect(result.totalEnergyIntensity_kWh_m2).toBeGreaterThan(0);
    expect(result.errorMessage).toBeUndefined();
  }, 30000); // 30s timeout para la simulación
});
