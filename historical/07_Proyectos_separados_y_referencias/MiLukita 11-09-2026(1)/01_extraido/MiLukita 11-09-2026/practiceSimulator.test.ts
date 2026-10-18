import { describe, expect, it } from "vitest";
import { PRACTICE_GAMES, automaticPracticePicks, drawUnique, isValidPracticePicks, runPracticeGame } from "./practiceSimulator";

const game = (id: (typeof PRACTICE_GAMES)[number]["id"]) => PRACTICE_GAMES.find((item) => item.id === id)!;

describe("simulador local de práctica", () => {
  it("genera selecciones automáticas válidas, incluido el cartón B-I-N-G-O", () => {
    const flash = automaticPracticePicks(game("bingo_flash"), () => 0);
    const bingo75 = automaticPracticePicks(game("bingo_75"), () => 0);
    expect(flash).toEqual([1, 2, 3]);
    expect(isValidPracticePicks(game("bingo_flash"), flash)).toBe(true);
    expect(bingo75).toHaveLength(24);
    expect(isValidPracticePicks(game("bingo_75"), bingo75)).toBe(true);
  });

  it("mantiene el orden de extracción local para poder evaluar bolillas de consuelo", () => {
    expect(drawUnique(10, 4, () => 0)).toEqual([1, 2, 3, 4]);
  });

  it("publica reglas resumidas para cada modalidad enlazable desde el portal", () => {
    expect(PRACTICE_GAMES).toHaveLength(24);
    expect(PRACTICE_GAMES.every((item) => item.summaryRules.length >= 3 && item.summaryRules.every(Boolean))).toBe(true);
  });

  it("admite dígitos repetidos en Pick y conserva las nuevas tablas de práctica", () => {
    const pick3 = game("pick_3");
    const repeated = [0, 0, 0];
    const lifetime = runPracticeGame(game("sueldo_vida"), [1, 2, 3, 4], () => 0);
    const lotoExpress = runPracticeGame(game("loto_express"), [1, 2, 3], () => 0);
    expect(isValidPracticePicks(pick3, repeated)).toBe(true);
    expect(automaticPracticePicks(pick3, () => 0)).toEqual([0, 0, 0]);
    expect(runPracticeGame(pick3, repeated, () => 0).prize).toBe(500);
    expect(lifetime.prize).toBe(21_912);
    expect(lotoExpress.prize).toBe(60);
  });

  it("simula ruleta, lotería, Jackpot y MultiMarket sin depender de una ronda o billetera", () => {
    const roulette = runPracticeGame(game("ruleta_17"), [0], () => 0.1);
    const lottery = runPracticeGame(game("loteria_19"), [1, 2, 3], () => 0);
    const jackpot = runPracticeGame(game("jackpot"), [1, 2, 3, 4, 5], () => 0);
    const market = runPracticeGame(game("multimarket"), [0], () => 0);
    expect(roulette.prize).toBe(2);
    expect(lottery.prize).toBe(70);
    expect(jackpot.result).toHaveLength(6);
    expect(market.prize).toBe(2);
    expect(lottery.explanation).toContain("no es semilla oficial");
  });
});
