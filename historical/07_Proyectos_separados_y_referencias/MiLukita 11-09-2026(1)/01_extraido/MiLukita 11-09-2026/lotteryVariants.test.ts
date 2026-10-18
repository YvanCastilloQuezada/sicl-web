import { describe, expect, it } from "vitest";
import { VIRTUAL_LOTTERY_TYPES, VIRTUAL_LOTTERY_VARIANTS, lotteryTheoreticalRtp } from "../shared/lotteryVariants";
import { VIRTUAL_CREDIT_REFERENCE } from "../shared/virtualCredits";
import { calculateTicketPrize } from "./pilot";

describe("loterías virtuales autorizadas y variante separada 5/39", () => {
  it("mantiene las tablas base dentro de la banda pública cercana a 85 %", () => {
    for (const gameType of VIRTUAL_LOTTERY_TYPES) {
      const rtp = lotteryTheoreticalRtp(VIRTUAL_LOTTERY_VARIANTS[gameType]);
      expect(rtp).toBeGreaterThanOrEqual(0.85);
      expect(rtp).toBeLessThanOrEqual(0.95);
    }
  });

  it("liquida cada premio de la tabla publicada respetando el tamaño de cada modalidad", () => {
    for (const gameType of VIRTUAL_LOTTERY_TYPES) {
      const variant = VIRTUAL_LOTTERY_VARIANTS[gameType];
      const numbers = Array.from({ length: variant.pickCount }, (_, index) => index + 1);
      for (const [matchText, amount] of Object.entries(variant.prizeTable)) {
        const matches = Number(matchText);
        const picks = [...numbers.slice(0, matches), ...Array.from({ length: variant.pickCount - matches }, (_, index) => variant.pickCount + index + 1)];
        expect(calculateTicketPrize(gameType, picks, { numbers }, 1, 0, 82, variant.prizeTable)).toBe(amount);
      }
    }
  });

  it("mantiene 5/39 separado de MJP 6/39 con tarifa y RTP rentable", () => {
    const variant = VIRTUAL_LOTTERY_VARIANTS.loteria_39_5;
    expect(variant.pickCount).toBe(5);
    expect(variant.priceCredits).toBe(1);
    expect(lotteryTheoreticalRtp(variant)).toBeGreaterThanOrEqual(0.85);
    expect(lotteryTheoreticalRtp(variant)).toBeLessThan(0.86);
    expect(VIRTUAL_LOTTERY_VARIANTS.loteria_39.pickCount).toBe(6);
  });

  it("mantiene la referencia PEN sin valor cobrable ni conversión automática", () => {
    expect(VIRTUAL_CREDIT_REFERENCE.referenceCurrency).toBe("PEN");
    expect(VIRTUAL_CREDIT_REFERENCE.referenceUnitsPerCredit).toBe(1);
    expect(VIRTUAL_CREDIT_REFERENCE.virtualOnly).toBe(true);
    expect(VIRTUAL_CREDIT_REFERENCE.redeemable).toBe(false);
    expect(VIRTUAL_CREDIT_REFERENCE.hasMonetaryValue).toBe(false);
  });
});
