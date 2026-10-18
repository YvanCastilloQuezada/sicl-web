import { describe, expect, it } from "vitest";
import { VIRTUAL_LOTTERY_TYPES, VIRTUAL_LOTTERY_VARIANTS, lotteryTheoreticalRtp } from "./lotteryVariants";
import { isWholeVirtualPrize, roundVirtualPrize } from "./virtualPrizeRounding";

describe("regla de redondeo de créditos virtuales", () => {
  it("anula importes desde cero hasta antes de 0,4 y redondea 0,4 o más hacia arriba", () => {
    expect(roundVirtualPrize(-2)).toBe(0);
    expect(roundVirtualPrize(0)).toBe(0);
    expect(roundVirtualPrize(0.39999999999999999)).toBe(0);
    expect(roundVirtualPrize(0.4)).toBe(1);
    expect(roundVirtualPrize(0.9999999)).toBe(1);
    expect(roundVirtualPrize(1.4)).toBe(2);
  });

  it("mantiene todos los premios publicados como enteros y recalcula RTP sobre esos enteros", () => {
    for (const gameType of VIRTUAL_LOTTERY_TYPES) {
      const variant = VIRTUAL_LOTTERY_VARIANTS[gameType];
      expect(Object.values(variant.prizeTable).every(isWholeVirtualPrize)).toBe(true);
      expect(lotteryTheoreticalRtp(variant)).toBeCloseTo(variant.targetRtp, 9);
      for (const pack of variant.bonusBallPacks ?? []) expect(Object.values(pack.prizeTable).every(isWholeVirtualPrize) && isWholeVirtualPrize(pack.consolationPrize)).toBe(true);
    }
  });
});
