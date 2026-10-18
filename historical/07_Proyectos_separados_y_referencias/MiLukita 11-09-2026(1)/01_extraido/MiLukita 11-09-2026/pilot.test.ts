import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { UNIFORM_CREDIT_PRIZE_POLICY, calculateMarketPayout, calculateTicketPrize, drawTrio13, isAllowedMarketCategory, resolveBingoCartillaPrize } from "./pilot";

function deterministicIndex(seed: string, context: string, size: number) {
  const max = 0x100000000;
  const limit = Math.floor(max / size) * size;
  let counter = 0;
  while (true) {
    const digest = createHmac("sha256", seed).update(`${context}:${counter}`).digest();
    const candidate = digest.readUInt32BE(0);
    if (candidate < limit) return candidate % size;
    counter += 1;
  }
}

describe("motor verificable del piloto", () => {
  it("deriva el mismo índice cuando se conservan semilla y contexto", () => {
    const first = deterministicIndex("semilla-servidor", "RP-R-0001:PILOTO", 37);
    const second = deterministicIndex("semilla-servidor", "RP-R-0001:PILOTO", 37);
    expect(first).toBe(second);
    expect(first).toBeGreaterThanOrEqual(0);
    expect(first).toBeLessThan(37);
  });

  it("no utiliza una reducción directa de un byte para seleccionar una casilla", () => {
    const value = deterministicIndex("semilla-servidor", "RP-R-0002:PILOTO", 49);
    expect(Number.isInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(49);
  });

  it("mantiene la selección dentro del dominio correcto para una ruleta de 37 casillas", () => {
    const values = Array.from({ length: 20 }, (_, index) => deterministicIndex("semilla-servidor", `RP-R-${index}:PILOTO`, 37));
    expect(values.every((value) => value >= 0 && value <= 36)).toBe(true);
  });

  it("liquida una coincidencia de ruleta únicamente cuando el número coincide", () => {
    expect(calculateTicketPrize("ruleta", [17], { number: 17 }, 1, 0)).toBe(360);
    expect(calculateTicketPrize("ruleta", [16], { number: 17 }, 1, 0)).toBe(0);
  });

  it("reparte el pozo virtual de Jackpot solo con cinco coincidencias", () => {
    expect(calculateTicketPrize("jackpot", [1, 2, 3, 4, 5], { positions: [1, 2, 3, 4, 5] }, 1, 9200)).toBe(9200);
    expect(calculateTicketPrize("jackpot", [1, 2, 3, 4, 9], { positions: [1, 2, 3, 4, 5] }, 1, 9200)).toBe(1200);
  });

  it("calcula las categorías de premio de Lotería v1.0.1 con créditos virtuales", () => {
    expect(calculateTicketPrize("loteria", [1, 2, 3, 4, 5, 6], { numbers: [1, 2, 3, 4, 5, 6] }, 1, 0)).toBe(170000);
    expect(calculateTicketPrize("loteria", [1, 2, 3, 9, 10, 11], { numbers: [1, 2, 3, 4, 5, 6] }, 1, 0)).toBe(750);
    expect(calculateTicketPrize("loteria", [1, 2, 3, 4, 9, 10], { numbers: [1, 2, 3, 4, 5, 6] }, 1, 0)).toBe(4500);
  });

  it("liquida Trío 13 solo por coincidencias de cartas verificables", () => {
    expect(calculateTicketPrize("cartas", [1, 7, 13], { cards: [1, 7, 13] }, 1, 0)).toBe(700);
    expect(calculateTicketPrize("cartas", [1, 7, 12], { cards: [1, 7, 13] }, 1, 0)).toBe(37);
    expect(calculateTicketPrize("cartas", [1, 8, 12], { cards: [1, 7, 13] }, 1, 0)).toBe(5);
  });

  it("liquida Bingo recalibrado a 82 créditos por cartilla ganadora", () => {
    expect(calculateTicketPrize("bingo", [2], { winningCartilla: 2 }, 1, 0)).toBe(82);
    expect(calculateTicketPrize("bingo", [1], { winningCartilla: 2 }, 1, 0)).toBe(0);
  });

  it("liquida las tablas uniformes de una unidad desde una política versionada", () => {
    expect(calculateTicketPrize("ruleta", [17], { number: 17 }, 1, 0, 82, {}, undefined, { ruletaExactPrize: UNIFORM_CREDIT_PRIZE_POLICY.ruletaExactPrize })).toBe(32);
    expect(calculateTicketPrize("jackpot", [1, 2, 3, 4, 5], { positions: [1, 2, 3, 4, 5], extraPosition: 6 }, 1, 0, 82, {}, undefined, { jackpotPrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.jackpotPrizeTable, jackpotConsolationPrize: UNIFORM_CREDIT_PRIZE_POLICY.jackpotConsolationPrize })).toBe(11_900);
    expect(calculateTicketPrize("jackpot", [1, 2, 6, 7, 8], { positions: [1, 2, 3, 4, 5], extraPosition: 6 }, 1, 0, 82, {}, undefined, { jackpotPrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.jackpotPrizeTable, jackpotConsolationPrize: UNIFORM_CREDIT_PRIZE_POLICY.jackpotConsolationPrize })).toBe(1);
    expect(calculateTicketPrize("bingo", [5], { winningCartilla: 5 }, 1, 0, UNIFORM_CREDIT_PRIZE_POLICY.bingoCartillaPrize)).toBe(5);
    expect(calculateTicketPrize("cartas", [1, 7, 13], { cards: [1, 7, 13] }, 1, 0, 82, {}, undefined, { trio13PrizeTable: UNIFORM_CREDIT_PRIZE_POLICY.trio13PrizeTable })).toBe(48);
  });

  it("resuelve el premio de Bingo desde la política persistida y conserva la regla histórica", () => {
    expect(resolveBingoCartillaPrize(JSON.stringify({ bingoCartillaPrize: 82 }), "v1.0.1")).toBe(82);
    expect(resolveBingoCartillaPrize(undefined, "v1.0.0")).toBe(450);
    expect(calculateTicketPrize("bingo", [3], { winningCartilla: 3 }, 1, 0, resolveBingoCartillaPrize(JSON.stringify({ bingoCartillaPrize: 82 }), "v1.0.1"))).toBe(82);
  });

  it("revela el mismo Trío 13 para una semilla y contexto conservados", () => {
    const first = drawTrio13("semilla-cartas", "PILOTO-CARTAS-01", "RP-C-0001");
    const second = drawTrio13("semilla-cartas", "PILOTO-CARTAS-01", "RP-C-0001");
    expect(first).toEqual(second);
    expect(new Set(first).size).toBe(3);
    expect(first.every((card) => card >= 1 && card <= 13)).toBe(true);
  });

  it("solo acredita contratos virtuales del lado que coincide con la resolución", () => {
    expect(calculateMarketPayout("yes", "yes", 3, 100)).toBe(300);
    expect(calculateMarketPayout("no", "yes", 3, 100)).toBe(0);
  });

  it("limita MultiMarket a las categorías curatoriales del piloto", () => {
    expect(isAllowedMarketCategory("cultura")).toBe(true);
    expect(isAllowedMarketCategory("tecnologia")).toBe(true);
    expect(isAllowedMarketCategory("politica")).toBe(false);
    expect(isAllowedMarketCategory("finanzas")).toBe(false);
  });
});
