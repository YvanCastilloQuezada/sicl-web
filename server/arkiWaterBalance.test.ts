import { describe, expect, it } from "vitest";
import { calculateAnnualWaterBalance, titicacaBalanceCase } from "../shared/arkiWaterBalance";

describe("ARKI annual water balance", () => {
  it("calculates only from supplied values", () => {
    const result = calculateAnnualWaterBalance(titicacaBalanceCase);
    expect(result.calculations.grossRainwaterCaptureM3PerYear).toBe(9800);
    expect(result.calculations.visitorConsumptionM3PerYear).toBe(2000);
    expect(result.calculations.residentConsumptionM3PerYear).toBe(1825);
    expect(result.calculations.totalConsumptionM3PerYear).toBe(3825);
    expect(result.calculations.netBalanceM3PerYear).toBe(5975);
    expect(result.missingData.some((item) => item.startsWith("FALTA_DATO:"))).toBe(true);
    expect(result.warnings[0]).toContain("Iquitos");
  });

  it("rejects negative physical inputs", () => {
    expect(() => calculateAnnualWaterBalance({ ...titicacaBalanceCase, catchmentRoofAreaM2: -1 })).toThrow();
  });

  it("applies a declared collection coefficient without inventing one", () => {
    const result = calculateAnnualWaterBalance({ ...titicacaBalanceCase, collectionCoefficient: 0.8 });
    expect(result.calculations.grossRainwaterCaptureM3PerYear).toBe(7840);
    expect(result.missingData.some((item) => item.includes("coeficiente real"))).toBe(false);
  });
});
