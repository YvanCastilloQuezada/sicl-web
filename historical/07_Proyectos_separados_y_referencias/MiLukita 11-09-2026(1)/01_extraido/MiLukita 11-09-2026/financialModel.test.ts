import { describe, expect, it } from "vitest";
import { calculateFinancialProjection, calculateUnitEconomics, DEFAULT_FINANCIAL_MODEL } from "../shared/financialModel";
import { SIMPLIFIED_ROULETTE_CONFIG } from "../shared/simplifiedGames";
import { lotteryTheoreticalRtp, VIRTUAL_LOTTERY_VARIANTS } from "../shared/lotteryVariants";

describe("modelo financiero y recalibración de tarifa virtual", () => {
  it("mantiene la tarifa objetivo de un crédito en las ruletas recalibradas", () => {
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_17.priceCredits).toBe(1);
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_27.priceCredits).toBe(1);
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_37.priceCredits).toBe(1);
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_17.rtp).toBeGreaterThanOrEqual(0.85);
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_27.rtp).toBeGreaterThanOrEqual(0.85);
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_37.rtp).toBeGreaterThanOrEqual(0.85);
  });

  it("mantiene el piso RTP para todas las loterías de 1 crédito", () => {
    for (const [gameType, variant] of Object.entries(VIRTUAL_LOTTERY_VARIANTS)) {
      const rtp = lotteryTheoreticalRtp(variant);
      expect(variant.priceCredits, gameType).toBe(1);
      expect(rtp, gameType).toBeGreaterThanOrEqual(0.85);
    }
  });

  it("calcula ingresos, premios, pasarela y contribución sin dinero real", () => {
    const projection = calculateFinancialProjection(DEFAULT_FINANCIAL_MODEL);
    expect(projection.monthlyPlays).toBe(300_000);
    expect(projection.revenue).toBe(300_000);
    expect(projection.prizes).toBe(255_000);
    expect(projection.gateway).toBe(15_000);
    expect(projection.pilotOnly).toBe(true);
    expect(projection.contribution).toBeLessThan(0);
  });

  it("permite evaluar una unidad sin dividir por cero", () => {
    const unit = calculateUnitEconomics({ ...DEFAULT_FINANCIAL_MODEL, dailyPlays: 1, daysPerMonth: 1 });
    expect(unit.plays).toBe(1);
    expect(Number.isFinite(unit.contributionPerPlay)).toBe(true);
  });
});
