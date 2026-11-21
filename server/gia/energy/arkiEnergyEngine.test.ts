import { describe, expect, it } from "vitest";
import * as fs from "fs";
import { runEnergySimulation } from "./arkiEnergyEngine";

const input = {
  location: {
    name: "Lima",
    latitude: -12.0464,
    longitude: -77.0428,
    altitude: 154,
    timezone: -5,
  },
  runPeriod: {
    startMonth: 6,
    startDay: 21,
    endMonth: 6,
    endDay: 21,
  },
};

describe("ARKI Energy Engine V31", () => {
  it(
    "ejecuta EnergyPlus sin inventar KPI energéticos",
    async () => {
      const result = await runEnergySimulation(input);

      if (!result.simulationSuccessful) {
        console.error(result.errorMessage);
        console.error(result.eplusErrLog);
      }

      expect(result.simulationSuccessful).toBe(true);

      expect(result.totalHeatingEnergy_kWh).toBeNull();
      expect(result.totalCoolingEnergy_kWh).toBeNull();
      expect(result.totalEnergyIntensity_kWh_m2).toBeNull();

      expect(result.kpiStatus).toBe("not_instrumented");
      expect(result.outputCsvPath).toBeTruthy();
      expect(fs.existsSync(result.outputCsvPath!)).toBe(true);

      expect(result.configurationWarnings.length).toBeGreaterThan(0);
    },
    150000,
  );

  it(
    "declara fallo cuando EnergyPlus no puede ejecutarse",
    async () => {
      const original = process.env.ENERGYPLUS_BIN;

      try {
        process.env.ENERGYPLUS_BIN =
          "/arki-test/nonexistent/energyplus";

        const result = await runEnergySimulation(input);

        expect(result.simulationSuccessful).toBe(false);

        expect(result.totalHeatingEnergy_kWh).toBeNull();
        expect(result.totalCoolingEnergy_kWh).toBeNull();
        expect(result.totalEnergyIntensity_kWh_m2).toBeNull();

        expect(result.kpiStatus).toBe("not_instrumented");
        expect(result.errorMessage).toBeTruthy();
      } finally {
        if (original === undefined) {
          delete process.env.ENERGYPLUS_BIN;
        } else {
          process.env.ENERGYPLUS_BIN = original;
        }
      }
    },
    150000,
  );
});
