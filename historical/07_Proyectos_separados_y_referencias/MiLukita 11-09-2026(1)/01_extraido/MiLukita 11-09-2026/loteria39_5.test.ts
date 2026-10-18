import { describe, expect, it } from "vitest";
import { VIRTUAL_LOTTERY_VARIANTS, lotteryTheoreticalRtp } from "../shared/lotteryVariants";
import { isHumanTicketId, ticketPrefixFor } from "../shared/ticketIdentifiers";
import { roundVirtualPrize } from "../shared/virtualPrizeRounding";

describe("Lotería 39 5/39 — validación dedicada", () => {
  const variant = VIRTUAL_LOTTERY_VARIANTS.loteria_39_5;

  it("mantiene configuración, tarifa y tabla aprobadas", () => {
    expect(variant).toMatchObject({ priceCredits: 1, pickCount: 5, range: 39 });
    expect(variant.prizeTable).toEqual({ 5: 27_000, 4: 300, 3: 20, 2: 5 });
    expect(variant.priceCredits).toBe(1);
  });

  it("mantiene RTP entre 85 % y 86 %", () => {
    expect(lotteryTheoreticalRtp(variant)).toBeCloseTo(0.8500113763, 10);
    expect(lotteryTheoreticalRtp(variant)).toBeGreaterThanOrEqual(0.85);
    expect(lotteryTheoreticalRtp(variant)).toBeLessThan(0.86);
  });

  it("conserva el redondeo virtual y la independencia de MJP 6/39", () => {
    expect(roundVirtualPrize(0.75)).toBe(1);
    expect(roundVirtualPrize(0.3)).toBe(0);
    expect(roundVirtualPrize(0.4)).toBe(1);
    expect(variant.pickCount).toBe(5);
    expect(VIRTUAL_LOTTERY_VARIANTS.loteria_39.pickCount).toBe(6);
    expect(VIRTUAL_LOTTERY_VARIANTS.loteria_39.priceCredits).toBe(1);
  });

  it("asigna prefijo AK y valida un comprobante de prueba", () => {
    const prefix = ticketPrefixFor("loteria_39_5");
    expect(prefix).toBe("AK");
    const ticketId = `${prefix}-ABC-234-DEF-GHJ-KLM`;
    expect(isHumanTicketId(ticketId)).toBe(true);
  });
});
