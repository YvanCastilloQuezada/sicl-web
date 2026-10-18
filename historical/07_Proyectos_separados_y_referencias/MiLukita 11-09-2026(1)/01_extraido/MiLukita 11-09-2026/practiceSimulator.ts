import {
  SIMPLIFIED_BINGO_CONFIG,
  SIMPLIFIED_ROULETTE_CONFIG,
  bingo75HasWinningLine,
  calculateSimplifiedBingoPrize,
  getSimplifiedRouletteOutcome,
  rouletteBetWins,
} from "@shared/simplifiedGames";
import { VIRTUAL_LOTTERY_VARIANTS, type VirtualLotteryGameType } from "@shared/lotteryVariants";

export const PRACTICE_GAME_IDS = [
  "ruleta",
  "ruleta_7",
  "ruleta_17",
  "ruleta_27",
  "ruleta_37",
  "jackpot",
  "bingo",
  "bingo_flash",
  "bingo_keno",
  "bingo_75",
  "loteria_19",
  "loteria_29",
  "loteria_39",
  "loteria_39_5",
  "loteria_49",
  "loteria_59",
  "cartas",
  "sueldo_vida",
  "raspa_digital",
  "pick_3",
  "pick_4",
  "loto_diario",
  "loto_express",
  "multimarket",
] as const;

export type PracticeGameId = (typeof PRACTICE_GAME_IDS)[number];
export type PracticeResult = {
  gameId: PracticeGameId;
  result: number[];
  resultLabel: string;
  matches: number;
  prize: number;
  explanation: string;
};

export type PracticeGameDefinition = {
  id: PracticeGameId;
  title: string;
  category: "Ruleta" | "Bingo" | "Lotería" | "Otros";
  pickLimit: number;
  range: number;
  instructions: string;
  summaryRules: readonly string[];
  supportsMjpExtra?: boolean;
  isRouletteBet?: boolean;
  isBingo75?: boolean;
  isMarket?: boolean;
  isPositionalDigits?: boolean;
};

const lotteryDefinition = (id: VirtualLotteryGameType): PracticeGameDefinition => {
  const variant = VIRTUAL_LOTTERY_VARIANTS[id];
  return {
    id,
    title: variant.title.replace(" MJP", ""),
    category: "Lotería",
    pickLimit: variant.pickCount,
    range: variant.range,
    instructions: `Selecciona ${variant.pickCount} números distintos entre 1 y ${variant.range}. El resultado es local y usa la tabla virtual vigente.`,
    summaryRules: [
      `Elige ${variant.pickCount} números únicos entre 1 y ${variant.range}.`,
      "El sorteo oficial utiliza reglas versionadas y evidencia verificable; esta práctica no las sustituye.",
      `La tabla oficial paga por aciertos y su premio mayor es ${variant.prizeTable[variant.pickCount] ?? 0} créditos virtuales.`,
    ],
    supportsMjpExtra: id === "loteria_39",
  };
};

export const PRACTICE_GAMES: readonly PracticeGameDefinition[] = [
  { id: "ruleta", title: "Ruleta", category: "Ruleta", pickLimit: 1, range: 37, instructions: "Elige una casilla entre 0 y 36; el simulador gira una rueda local.", summaryRules: ["Elige una casilla entre 0 y 36.", "Una coincidencia exacta entrega 31 créditos virtuales en la tabla del piloto.", "El giro del simulador es local; el sorteo oficial se verifica con su ronda publicada."] },
  ...([7, 17, 27, 37] as const).map((pockets) => ({
    id: `ruleta_${pockets}` as PracticeGameId,
    title: `Ruleta ${pockets}`,
    category: "Ruleta" as const,
    pickLimit: 1,
    range: 4,
    isRouletteBet: true,
    instructions: "Elige Color o Par/Impar. El cero no gana en estas opciones.",
    summaryRules: ["Elige Rojo, Negro, Par o Impar.", "El cero no gana en estas apuestas simplificadas.", "El pago total y RTP oficial se muestran en la ficha de cada ruleta."],
  })),
  { id: "jackpot", title: "Jackpot", category: "Otros", pickLimit: 5, range: 20, instructions: "Elige cinco posiciones. Se simulan cinco posiciones principales y una sexta bola de consuelo.", summaryRules: ["Elige cinco posiciones únicas entre 1 y 20.", "Se extraen cinco posiciones principales y una sexta bola de consuelo.", "El consuelo aplica con 2 aciertos principales y la coincidencia de la sexta bola."] },
  { id: "bingo", title: "Bingo clásico", category: "Bingo", pickLimit: 1, range: 5, instructions: "Elige una de cinco cartillas virtuales para una extracción local.", summaryRules: ["Elige una cartilla virtual entre cinco disponibles.", "La cartilla ganadora se define al cerrar la ronda oficial.", "La práctica solo revela una cartilla local y no reserva participación."] },
  { id: "bingo_flash", title: "Bingo Flash", category: "Bingo", pickLimit: 3, range: 15, instructions: "Selecciona tres números manualmente o genera una cartilla automática. Se simulan 10 bolillas.", summaryRules: ["Selecciona 3 números únicos entre 1 y 15 o genera la cartilla automáticamente.", "Se extraen 10 bolillas; la última contempla el consuelo definido por la regla activa.", "La validación oficial usa el sorteo HMAC y el ruleset publicado."] },
  { id: "bingo_keno", title: "Bingo Keno", category: "Bingo", pickLimit: 10, range: 80, instructions: "Selecciona 10 números manualmente o genera una cartilla automática. Se simulan 21 bolillas.", summaryRules: ["Selecciona 10 números únicos entre 1 y 80 o genera la cartilla automáticamente.", "Se extraen 21 bolillas; la última contempla el consuelo de la modalidad.", "Consulta RTP y tabla de premios oficiales antes de reservar un ticket virtual."] },
  { id: "bingo_75", title: "Bingo 75", category: "Bingo", pickLimit: 24, range: 75, isBingo75: true, instructions: "Completa manualmente las columnas B-I-N-G-O o genera un cartón automático. El centro N es libre.", summaryRules: ["Completa B, I, G y O con 5 números cada una; N usa 4 por su centro libre.", "Se extraen 41 bolillas y el premio se evalúa por una línea válida.", "El cartón automático respeta los rangos de cada columna B-I-N-G-O."] },
  lotteryDefinition("loteria_19"),
  lotteryDefinition("loteria_29"),
  lotteryDefinition("loteria_39"),
  lotteryDefinition("loteria_39_5"),
  lotteryDefinition("loteria_49"),
  lotteryDefinition("loteria_59"),
  { id: "cartas", title: "Trío 13", category: "Otros", pickLimit: 3, range: 13, instructions: "Elige tres rangos y simula una extracción local de tres cartas sin reemplazo.", summaryRules: ["Elige tres rangos distintos entre A y K.", "La práctica extrae tres cartas sin reemplazo.", "Los créditos demostrativos no se guardan ni equivalen a una reserva oficial."] },
  { id: "sueldo_vida", title: "Sueldo de por vida", category: "Otros", pickLimit: 4, range: 30, instructions: "Elige cuatro números entre 1 y 30 para un sorteo local semanal simulado.", summaryRules: ["Elige 4 números distintos entre 1 y 30.", "4 aciertos representan 24 cuotas locales de 900 créditos virtuales; 3 aciertos representan 16 créditos.", "La práctica no crea cuotas, pagos, ni derechos económicos reales."] },
  { id: "raspa_digital", title: "Raspa Digital", category: "Otros", pickLimit: 1, range: 20, instructions: "Elige una de 20 casillas y revela un resultado local.", summaryRules: ["Elige una casilla entre 1 y 20.", "La demostración muestra una casilla ganadora local; la modalidad oficial usa una semilla comprometida al cierre.", "Una coincidencia usa la tabla virtual de 17 créditos."] },
  { id: "pick_3", title: "Pick 3", category: "Otros", pickLimit: 3, range: 10, isPositionalDigits: true, instructions: "Elige 3 dígitos de 0 a 9 en orden. Puedes repetirlos.", summaryRules: ["Elige 3 dígitos entre 0 y 9; se permiten repeticiones.", "Solo cuentan las coincidencias en la misma posición.", "La tabla virtual paga 500 créditos por 3 posiciones y 13 por 2."] },
  { id: "pick_4", title: "Pick 4", category: "Otros", pickLimit: 4, range: 10, isPositionalDigits: true, instructions: "Elige 4 dígitos de 0 a 9 en orden. Puedes repetirlos.", summaryRules: ["Elige 4 dígitos entre 0 y 9; se permiten repeticiones.", "Solo cuentan las coincidencias en la misma posición.", "La tabla virtual paga 4 000 créditos por 4 posiciones, 57 por 3 y 5 por 2."] },
  { id: "loto_diario", title: "Loto Diario", category: "Lotería", pickLimit: 4, range: 20, instructions: "Elige cuatro números distintos entre 1 y 20 para una práctica local.", summaryRules: ["Elige 4 números distintos entre 1 y 20.", "La ronda oficial se programa una vez al día; esta ejecución es local e inmediata.", "La tabla virtual paga 2 000, 22 y 1 crédito por 4, 3 y 2 aciertos."] },
  { id: "loto_express", title: "Loto Express", category: "Lotería", pickLimit: 3, range: 10, instructions: "Elige tres números distintos entre 1 y 10 para una práctica local.", summaryRules: ["Elige 3 números distintos entre 1 y 10.", "La ronda oficial se programa cada 30 minutos; esta ejecución es local e inmediata.", "La tabla virtual paga 60 créditos por 3 aciertos y 2 por 2."] },
  { id: "multimarket", title: "MultiMarket demo", category: "Otros", pickLimit: 1, range: 2, isMarket: true, instructions: "Elige SÍ o NO para una resolución ficticia local. No representa un evento real ni crea posiciones.", summaryRules: ["Elige SÍ o NO para una resolución ficticia local.", "Esta práctica no representa un hecho real, contrato, precio ni mercado publicado.", "Las posiciones oficiales exigen un mercado curado, fuente y regla de resolución pública."] },
] as const;

export const PRACTICE_BINGO75_COLUMNS = [
  { label: "B", minimum: 1, maximum: 15, required: 5 },
  { label: "I", minimum: 16, maximum: 30, required: 5 },
  { label: "N", minimum: 31, maximum: 45, required: 4 },
  { label: "G", minimum: 46, maximum: 60, required: 5 },
  { label: "O", minimum: 61, maximum: 75, required: 5 },
] as const;

const randomIndex = (size: number, random: () => number) => Math.min(size - 1, Math.floor(random() * size));

export function drawUnique(range: number, count: number, random = Math.random) {
  const pool = Array.from({ length: range }, (_, index) => index + 1);
  const result: number[] = [];
  while (result.length < count) result.push(pool.splice(randomIndex(pool.length, random), 1)[0]);
  return result;
}

export function automaticPracticePicks(game: PracticeGameDefinition, random = Math.random) {
  if (game.isRouletteBet) return [randomIndex(4, random)];
  if (game.isMarket) return [randomIndex(2, random)];
  if (game.isBingo75) return PRACTICE_BINGO75_COLUMNS.flatMap((column) => drawUnique(column.maximum - column.minimum + 1, column.required, random).map((value) => value + column.minimum - 1)).sort((left, right) => left - right);
  if (game.id === "ruleta") return [randomIndex(37, random)];
  if (game.isPositionalDigits) return Array.from({ length: game.pickLimit }, () => randomIndex(10, random));
  return drawUnique(game.range, game.pickLimit, random).sort((left, right) => left - right);
}

export function isValidPracticePicks(game: PracticeGameDefinition, picks: number[]) {
  if ((!game.isPositionalDigits && new Set(picks).size !== picks.length) || picks.length !== game.pickLimit) return false;
  if (game.isRouletteBet) return picks[0] >= 0 && picks[0] <= 3;
  if (game.isMarket) return picks[0] === 0 || picks[0] === 1;
  if (game.id === "ruleta") return Number.isInteger(picks[0]) && picks[0] >= 0 && picks[0] < 37;
  if (game.isPositionalDigits) return picks.every((value) => Number.isInteger(value) && value >= 0 && value <= 9);
  if (picks.some((value) => !Number.isInteger(value) || value < 1 || value > game.range)) return false;
  if (game.isBingo75) return PRACTICE_BINGO75_COLUMNS.every((column) => picks.filter((value) => value >= column.minimum && value <= column.maximum).length === column.required);
  return true;
}

function lotteryPrize(gameId: PracticeGameId, picks: number[], numbers: number[], random: () => number, extraPick?: number) {
  const variant = VIRTUAL_LOTTERY_VARIANTS[gameId as VirtualLotteryGameType];
  const matches = picks.filter((pick) => numbers.includes(pick)).length;
  let prize = variant.prizeTable[matches] ?? 0;
  let extraNumber: number | undefined;
  if (gameId === "loteria_39" && extraPick && !numbers.includes(extraPick)) {
    const pool = Array.from({ length: variant.range }, (_, index) => index + 1).filter((value) => !numbers.includes(value));
    extraNumber = pool[randomIndex(pool.length, random)];
    if (extraNumber === extraPick && [2, 3, 4, 5].includes(matches)) prize *= 2;
  }
  return { matches, prize, extraNumber };
}

export function runPracticeGame(game: PracticeGameDefinition, picks: number[], random = Math.random, extraPick?: number): PracticeResult {
  if (!isValidPracticePicks(game, picks)) throw new Error("La selección de práctica no cumple las reglas de esta modalidad.");
  if (game.id === "ruleta") {
    const number = randomIndex(37, random);
    return { gameId: game.id, result: [number], resultLabel: `Casilla ${number}`, matches: number === picks[0] ? 1 : 0, prize: number === picks[0] ? 31 : 0, explanation: "Giro local de demostración; no corresponde a una ronda oficial." };
  }
  if (game.isRouletteBet) {
    const pockets = Number(game.id.replace("ruleta_", ""));
    const number = randomIndex(pockets, random);
    const outcome = getSimplifiedRouletteOutcome(pockets, number);
    const win = rouletteBetWins(picks[0], outcome);
    const config = SIMPLIFIED_ROULETTE_CONFIG[game.id as keyof typeof SIMPLIFIED_ROULETTE_CONFIG];
    return { gameId: game.id, result: [number], resultLabel: `${number} · ${outcome.color} · ${outcome.parity}`, matches: win ? 1 : 0, prize: win ? config.totalPayout : 0, explanation: "Resultado local con la misma regla de Color y Par/Impar de la modalidad seleccionada." };
  }
  if (game.id === "jackpot") {
    const main = drawUnique(20, 5, random);
    const extra = drawUnique(20, 6, random).find((value) => !main.includes(value))!;
    const matches = picks.filter((pick) => main.includes(pick)).length;
    const consolation = matches === 2 && picks.some((pick) => !main.includes(pick) && pick === extra);
    const prize = matches === 5 ? 11_900 : matches === 4 ? 5 : consolation ? 1 : 0;
    return { gameId: game.id, result: [...main, extra], resultLabel: `Principales: ${main.join(" · ")} · Consuelo: ${extra}`, matches, prize, explanation: consolation ? "Se activó el consuelo local con 2 coincidencias principales y la sexta bola." : "Extracción local de cinco posiciones y una bola adicional." };
  }
  if (game.id === "bingo") {
    const winning = randomIndex(5, random) + 1;
    return { gameId: game.id, result: [winning], resultLabel: `Cartilla ganadora: ${winning}`, matches: winning === picks[0] ? 1 : 0, prize: winning === picks[0] ? 4 : 0, explanation: "Cartilla local de demostración." };
  }
  if (game.id === "bingo_flash" || game.id === "bingo_keno" || game.id === "bingo_75") {
    const config = SIMPLIFIED_BINGO_CONFIG[game.id];
    const calls = drawUnique(config.range, config.draws, random);
    const prize = calculateSimplifiedBingoPrize(game.id, picks, calls);
    const matches = game.id === "bingo_75" ? (bingo75HasWinningLine(picks, calls) ? 1 : 0) : picks.filter((pick) => calls.includes(pick)).length;
    return { gameId: game.id, result: calls, resultLabel: `Bolillas: ${calls.join(" · ")}`, matches, prize, explanation: "Cartilla y bolillas generadas localmente. No se registra ningún boleto." };
  }
  if (game.id.startsWith("loteria_")) {
    const variant = VIRTUAL_LOTTERY_VARIANTS[game.id as VirtualLotteryGameType];
    const numbers = drawUnique(variant.range, variant.pickCount, random);
    const outcome = lotteryPrize(game.id, picks, numbers, random, extraPick);
    const label = outcome.extraNumber ? `Principales: ${numbers.join(" · ")} · MJP Extra: ${outcome.extraNumber}` : `Números: ${numbers.join(" · ")}`;
    return { gameId: game.id, result: outcome.extraNumber ? [...numbers, outcome.extraNumber] : numbers, resultLabel: label, matches: outcome.matches, prize: outcome.prize, explanation: "Lotería local de práctica; su resultado no es semilla oficial ni comprobante." };
  }
  if (game.id === "cartas") {
    const cards = drawUnique(13, 3, random);
    const matches = picks.filter((pick) => cards.includes(pick)).length;
    return { gameId: game.id, result: cards, resultLabel: `Cartas: ${cards.join(" · ")}`, matches, prize: matches === 3 ? 48 : matches === 2 ? 2 : matches === 1 ? 1 : 0, explanation: "Barajado local de demostración sin guardar una jugada." };
  }
  if (game.id === "raspa_digital") {
    const winningPosition = randomIndex(20, random) + 1;
    const win = picks[0] === winningPosition;
    return { gameId: game.id, result: [winningPosition], resultLabel: `Casilla revelada: ${winningPosition}`, matches: win ? 1 : 0, prize: win ? 17 : 0, explanation: "Raspa local de demostración; no equivale a una ronda oficial." };
  }
  if (game.isPositionalDigits) {
    const digits = Array.from({ length: game.pickLimit }, () => randomIndex(10, random));
    const matches = picks.reduce((total, digit, index) => total + (digit === digits[index] ? 1 : 0), 0);
    const prize = game.id === "pick_3" ? (matches === 3 ? 500 : matches === 2 ? 13 : 0) : (matches === 4 ? 4_000 : matches === 3 ? 58 : matches === 2 ? 5 : 0);
    return { gameId: game.id, result: digits, resultLabel: `Dígitos: ${digits.join(" · ")}`, matches, prize, explanation: "Resultado local por posición; las repeticiones son válidas y el orden sí importa." };
  }
  if (game.id === "sueldo_vida" || game.id === "loto_diario" || game.id === "loto_express") {
    const numbers = drawUnique(game.range, game.pickLimit, random);
    const matches = picks.filter((pick) => numbers.includes(pick)).length;
    const prize = game.id === "sueldo_vida" ? (matches === 4 ? 21_912 : matches === 3 ? 16 : 0) : game.id === "loto_diario" ? (matches === 4 ? 2_000 : matches === 3 ? 22 : matches === 2 ? 1 : 0) : (matches === 3 ? 60 : matches === 2 ? 2 : 0);
    const explanation = game.id === "sueldo_vida" && matches === 4 ? "Demostración de 24 cuotas locales de 913 créditos. No se crean pagos, saldo ni obligaciones reales." : "Sorteo local de práctica; no crea boleto, ronda, saldo ni comprobante oficial.";
    return { gameId: game.id, result: numbers, resultLabel: `Números: ${numbers.join(" · ")}`, matches, prize, explanation };
  }
  const outcome = randomIndex(2, random);
  const win = picks[0] === outcome;
  return { gameId: game.id, result: [outcome], resultLabel: `Resolución ficticia: ${outcome === 0 ? "SÍ" : "NO"}`, matches: win ? 1 : 0, prize: win ? 2 : 0, explanation: "Resolución ficticia local; MultiMarket real requiere una fuente y revisión humana." };
}
