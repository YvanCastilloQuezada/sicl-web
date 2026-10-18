import { describe, expect, it } from "vitest";
import { ROULETTE_BET_CODES, SIMPLIFIED_BINGO_CONFIG, SIMPLIFIED_ROULETTE_CONFIG, bingo75HasWinningLine, calculateSimplifiedBingoPrize, getSimplifiedRouletteOutcome, randomSimplifiedPicks, rouletteBetWins, validateSimplifiedPicks } from "./simplifiedGames";

describe("modalidades simplificadas", () => {
  it("publica RTP y edge complementarios para las cuatro ruletas", () => {
    for (const config of Object.values(SIMPLIFIED_ROULETTE_CONFIG)) expect(config.rtp + config.houseEdge).toBe(1);
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_17.rtp).toBeCloseTo(0.9411765, 6);
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_27.rtp).toBeCloseTo(0.9629630, 6);
    expect(SIMPLIFIED_ROULETTE_CONFIG.ruleta_37.rtp).toBeCloseTo(0.9729730, 6);
  });

  it("resuelve Color y Par/Impar, preservando el cero como pérdida", () => {
    expect(rouletteBetWins(ROULETTE_BET_CODES.red, getSimplifiedRouletteOutcome(7, 1))).toBe(true);
    expect(rouletteBetWins(ROULETTE_BET_CODES.even, getSimplifiedRouletteOutcome(17, 2))).toBe(true);
    expect(rouletteBetWins(ROULETTE_BET_CODES.even, getSimplifiedRouletteOutcome(27, 0))).toBe(false);
  });

  it("valida el cartón manual B-I-N-G-O y puede generarlo automáticamente", () => {
    const card = randomSimplifiedPicks("bingo_75", () => 0);
    expect(card).toHaveLength(24);
    expect(validateSimplifiedPicks("bingo_75", card)).toEqual(card);
    expect(() => validateSimplifiedPicks("bingo_75", Array.from({ length: 24 }, (_, index) => index + 1))).toThrow();
  });

  it("calcula premios principales y de consuelo de Flash, Keno y Bingo 75", () => {
    expect(calculateSimplifiedBingoPrize("bingo_flash", [1, 2, 3], [1, 2, 3])).toBe(SIMPLIFIED_BINGO_CONFIG.bingo_flash.payoutByCompletionDraw[3]);
    expect(calculateSimplifiedBingoPrize("bingo_flash", [1, 2, 10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(1);
    expect(calculateSimplifiedBingoPrize("bingo_keno", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], Array.from({ length: 21 }, (_, index) => index + 1))).toBe(580);
    expect(calculateSimplifiedBingoPrize("bingo_keno", [1, 2, 3, 4, 21, 30, 40, 50, 60, 70], Array.from({ length: 21 }, (_, index) => index + 1))).toBe(1);
    const card = [1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 31, 32, 33, 34, 46, 47, 48, 49, 50, 61, 62, 63, 64, 65];
    expect(bingo75HasWinningLine(card, [1, 2, 3, 4, 5])).toBe(true);
    expect(calculateSimplifiedBingoPrize("bingo_75", card, [1, 2, 3, 4, 5])).toBe(1);
    const filler = Array.from({ length: 75 }, (_, index) => index + 1).filter((value) => !card.includes(value)).slice(0, 36);
    expect(calculateSimplifiedBingoPrize("bingo_75", card, [...filler, 1, 16, 31, 46, 61])).toBe(12);
  });
});
