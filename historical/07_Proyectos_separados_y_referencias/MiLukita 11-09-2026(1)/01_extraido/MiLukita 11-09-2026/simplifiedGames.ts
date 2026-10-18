export const SIMPLIFIED_BINGO_TYPES = ["bingo_flash", "bingo_keno", "bingo_75"] as const;
export type SimplifiedBingoType = (typeof SIMPLIFIED_BINGO_TYPES)[number];
export const SIMPLIFIED_ROULETTE_TYPES = ["ruleta_7", "ruleta_17", "ruleta_27", "ruleta_37"] as const;
export type SimplifiedRouletteType = (typeof SIMPLIFIED_ROULETTE_TYPES)[number];
export type SimplifiedGameType = SimplifiedBingoType | SimplifiedRouletteType;

export const ROULETTE_BET_CODES = {
  red: 0,
  black: 1,
  even: 2,
  odd: 3,
} as const;
export type RouletteBetKind = keyof typeof ROULETTE_BET_CODES;

export const SIMPLIFIED_ROULETTE_CONFIG = {
  ruleta_7: { title: "Ruleta 7", pockets: 7, priceCredits: 1, totalPayout: 2, rtp: 6 / 7, houseEdge: 1 / 7 },
  ruleta_17: { title: "Ruleta 17", pockets: 17, priceCredits: 1, totalPayout: 2, rtp: (8 * 2) / (17 * 1), houseEdge: 1 - (8 * 2) / (17 * 1) },
  ruleta_27: { title: "Ruleta 27", pockets: 27, priceCredits: 1, totalPayout: 2, rtp: (13 * 2) / (27 * 1), houseEdge: 1 - (13 * 2) / (27 * 1) },
  ruleta_37: { title: "Ruleta 37", pockets: 37, priceCredits: 1, totalPayout: 2, rtp: (18 * 2) / (37 * 1), houseEdge: 1 - (18 * 2) / (37 * 1) },
} as const;

export const SIMPLIFIED_BINGO_CONFIG = {
  bingo_flash: {
    title: "Bingo Flash",
    range: 15,
    pickLimit: 3,
    draws: 10,
    payoutByCompletionDraw: { 3: 34, 4: 17, 5: 10, 6: 7, 7: 3, 8: 3, 9: 1 },
    consolationPrize: 1,
    rtp: 0.8505494505494504,
  },
  bingo_keno: {
    title: "Bingo Keno",
    range: 80,
    pickLimit: 10,
    draws: 21,
    payoutByHits: { 10: 580, 9: 270, 8: 115, 7: 46, 6: 20, 5: 10 },
    consolationPrize: 1,
    rtp: 0.8500001247670723,
  },
  bingo_75: {
    title: "Bingo 75",
    range: 75,
    pickLimit: 24,
    draws: 41,
    prize: 1,
    consolationPrize: 12,
    rtp: 0.8515000000000001,
    patternLabel: "línea horizontal, vertical o diagonal",
  },
} as const;

const BINGO75_COLUMNS = [
  [1, 15], [16, 30], [31, 45], [46, 60], [61, 75],
] as const;
const BINGO75_FREE_CELL = 12;
const BINGO75_PATTERNS = [
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 18, 24], [4, 8, 16, 20],
] as const;

export function normalizedPicks(picks: number[]) {
  return Array.from(new Set(picks)).sort((a, b) => a - b);
}

export function getSimplifiedRouletteOutcome(pockets: number, number: number) {
  if (!Number.isInteger(number) || number < 0 || number >= pockets) throw new Error("El resultado de ruleta simplificada no es válido.");
  return { number, color: number === 0 ? "verde" : number % 2 === 1 ? "rojo" : "negro", parity: number === 0 ? "ninguno" : number % 2 === 0 ? "par" : "impar" } as const;
}

export function rouletteBetWins(betCode: number, outcome: ReturnType<typeof getSimplifiedRouletteOutcome>) {
  if (betCode === ROULETTE_BET_CODES.red) return outcome.color === "rojo";
  if (betCode === ROULETTE_BET_CODES.black) return outcome.color === "negro";
  if (betCode === ROULETTE_BET_CODES.even) return outcome.parity === "par";
  if (betCode === ROULETTE_BET_CODES.odd) return outcome.parity === "impar";
  return false;
}

export function validateSimplifiedPicks(gameType: SimplifiedGameType, rawPicks: number[]) {
  const picks = normalizedPicks(rawPicks);
  if (SIMPLIFIED_ROULETTE_TYPES.includes(gameType as SimplifiedRouletteType)) {
    if (picks.length !== 1 || !Number.isInteger(picks[0]) || picks[0] < 0 || picks[0] > 3) throw new Error("Selecciona Color o Par/Impar para esta ruleta simplificada.");
    return picks;
  }
  const config = SIMPLIFIED_BINGO_CONFIG[gameType as SimplifiedBingoType];
  if (picks.length !== config.pickLimit || picks.some((value) => !Number.isInteger(value) || value < 1 || value > config.range)) throw new Error("La selección no cumple las reglas del cartón de Bingo.");
  if (gameType === "bingo_75") {
    for (let column = 0; column < BINGO75_COLUMNS.length; column += 1) {
      const [minimum, maximum] = BINGO75_COLUMNS[column];
      const expected = column === 2 ? 4 : 5;
      const count = picks.filter((value) => value >= minimum && value <= maximum).length;
      if (count !== expected) throw new Error("El cartón Bingo 75 requiere 5 números por columna B/I/G/O y 4 en N por la casilla libre.");
    }
  }
  return picks;
}

export function randomSimplifiedPicks(gameType: SimplifiedGameType, nextIndex: (upperExclusive: number) => number) {
  if (SIMPLIFIED_ROULETTE_TYPES.includes(gameType as SimplifiedRouletteType)) return [nextIndex(4)];
  const config = SIMPLIFIED_BINGO_CONFIG[gameType as SimplifiedBingoType];
  if (gameType !== "bingo_75") {
    const pool = Array.from({ length: config.range }, (_, index) => index + 1);
    return Array.from({ length: config.pickLimit }, () => pool.splice(nextIndex(pool.length), 1)[0]).sort((a, b) => a - b);
  }
  const values = BINGO75_COLUMNS.flatMap(([minimum, maximum], column) => {
    const pool = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index);
    const count = column === 2 ? 4 : 5;
    return Array.from({ length: count }, () => pool.splice(nextIndex(pool.length), 1)[0]);
  });
  return values.sort((a, b) => a - b);
}

export function bingo75HasWinningLine(cardPicks: number[], calls: number[]) {
  const card = Array.from({ length: 25 }, () => null as number | null);
  const buckets = BINGO75_COLUMNS.map(([minimum, maximum]) => cardPicks.filter((value) => value >= minimum && value <= maximum).sort((a, b) => a - b));
  for (let column = 0; column < 5; column += 1) {
    let index = 0;
    for (let row = 0; row < 5; row += 1) {
      const cell = row * 5 + column;
      if (cell === BINGO75_FREE_CELL) continue;
      card[cell] = buckets[column][index++];
    }
  }
  const called = new Set(calls);
  return BINGO75_PATTERNS.some((pattern) => pattern.every((cell) => called.has(card[cell] as number)));
}

export function calculateSimplifiedBingoPrize(gameType: SimplifiedBingoType, picks: number[], calls: number[]) {
  if (gameType === "bingo_flash") {
    const completion = calls.slice(0, 9).findIndex((_, index) => picks.every((pick) => calls.slice(0, index + 1).includes(pick))) + 1;
    if (!completion && calls.length >= 10 && picks.every((pick) => calls.slice(0, 10).includes(pick))) return SIMPLIFIED_BINGO_CONFIG.bingo_flash.consolationPrize;
    return completion ? SIMPLIFIED_BINGO_CONFIG.bingo_flash.payoutByCompletionDraw[completion as 3 | 4 | 5 | 6 | 7 | 8 | 9] ?? 0 : 0;
  }
  if (gameType === "bingo_keno") {
    const matches = picks.filter((pick) => calls.slice(0, 20).includes(pick)).length;
    if (matches === 4 && calls.length >= 21 && picks.includes(calls[20])) return SIMPLIFIED_BINGO_CONFIG.bingo_keno.consolationPrize;
    return SIMPLIFIED_BINGO_CONFIG.bingo_keno.payoutByHits[matches as 5 | 6 | 7 | 8 | 9 | 10] ?? 0;
  }
  if (bingo75HasWinningLine(picks, calls.slice(0, 40))) return SIMPLIFIED_BINGO_CONFIG.bingo_75.prize;
  return calls.length >= 41 && bingo75HasWinningLine(picks, calls.slice(0, 41)) ? SIMPLIFIED_BINGO_CONFIG.bingo_75.consolationPrize : 0;
}
