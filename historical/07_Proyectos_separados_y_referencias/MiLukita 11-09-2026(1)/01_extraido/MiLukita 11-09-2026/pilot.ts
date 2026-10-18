import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { createHash, createHmac, randomBytes, randomInt } from "node:crypto";
import { nanoid } from "nanoid";
import {
  auditEvents,
  gameRounds,
  gameRulesets,
  gameSchedules,
  gameBatchPreviews,
  marketEvents,
  marketBatchPreviews,
  marketPositions,
  missions,
  paymentReferences,
  playerSettings,
  playerMissionProgress,
  pilotTickets,
  promotionRules,
  socialImpactCycles,
  virtualAwardInstallments,
  virtualPlanEnrollments,
  virtualWallets,
  walletTransactions,
} from "../drizzle/schema";
import { getDb } from "./db";
import { appendOperationalEvent } from "./eventStore";
import { MJP_EXTRA_39, VIRTUAL_LOTTERY_TYPES, VIRTUAL_LOTTERY_VARIANTS, getLotteryBonusBallPack, isConsolationLotteryGameType, isVirtualLotteryGameType, lotteryExtraExpectedPrize, lotteryMatchProbability, type LotteryBonusBallPack, type LotteryPrizeTable } from "../shared/lotteryVariants";
import { roundVirtualPrize } from "../shared/virtualPrizeRounding";
import { assertRoundTransition } from "../shared/roundState";
import { VIRTUAL_CREDIT_REFERENCE } from "../shared/virtualCredits";
import { ASSISTED_PLAN_DEFINITIONS, ASSISTED_PLAN_DISCLOSURE, getAssistedPlanDefinition, isAssistedPlanGameType } from "../shared/assistedPlans";
import { MARKET_POSITION_PREFIX, buildHumanTicketId, ticketPrefixFor } from "../shared/ticketIdentifiers";
import { SIMPLIFIED_BINGO_CONFIG, SIMPLIFIED_BINGO_TYPES, SIMPLIFIED_ROULETTE_CONFIG, SIMPLIFIED_ROULETTE_TYPES, calculateSimplifiedBingoPrize, getSimplifiedRouletteOutcome, randomSimplifiedPicks, rouletteBetWins, validateSimplifiedPicks } from "../shared/simplifiedGames";

export const GAME_TYPES = ["ruleta", ...SIMPLIFIED_ROULETTE_TYPES, "jackpot", "bingo", ...SIMPLIFIED_BINGO_TYPES, ...VIRTUAL_LOTTERY_TYPES, "cartas", "sueldo_vida", "raspa_digital", "pick_3", "pick_4", "loto_diario", "loto_express"] as const;
export type GameType = (typeof GAME_TYPES)[number];
export const MARKET_CATEGORIES = ["cultura", "entretenimiento", "tecnologia", "educacion"] as const;
export type MarketCategory = (typeof MARKET_CATEGORIES)[number];
export const isAllowedMarketCategory = (category: string): category is MarketCategory => MARKET_CATEGORIES.includes(category as MarketCategory);

const GAME_CONFIG: Record<GameType, { title: string; price: number; pickLimit: number; range: number; rules: string; prizes: string }> = {
  ruleta: { title: "Ruleta piloto", price: 1, pickLimit: 1, range: 37, rules: "Selecciona una de 37 casillas, de 0 a 36. La ronda se decide tras el cierre.", prizes: "Premio virtual de 32 créditos por coincidencia exacta. RTP 86,4865 %; sin retiros." },
  ruleta_7: { title: "Ruleta 7", price: 1, pickLimit: 1, range: 3, rules: "Elige Color o Par/Impar. La rueda contiene 0–6; el 0 no es rojo/negro ni par/impar.", prizes: "Apuesta ganadora: 2 créditos virtuales en total. RTP 85,7143 %; sin retiros." },
  ruleta_17: { title: "Ruleta 17", price: 1, pickLimit: 1, range: 3, rules: "Elige Color o Par/Impar. La rueda contiene 0–16; el 0 no es rojo/negro ni par/impar.", prizes: "Apuesta ganadora: 2 créditos virtuales en total. RTP 94,1176 %; tarifa objetivo de 1 crédito; sin retiros." },
  ruleta_27: { title: "Ruleta 27", price: 1, pickLimit: 1, range: 3, rules: "Elige Color o Par/Impar. La rueda contiene 0–26; el 0 no es rojo/negro ni par/impar.", prizes: "Apuesta ganadora: 2 créditos virtuales en total. RTP 96,2963 %; tarifa objetivo de 1 crédito; sin retiros." },
  ruleta_37: { title: "Ruleta 37", price: 1, pickLimit: 1, range: 3, rules: "Elige Color o Par/Impar. La rueda contiene 0–36; el 0 no es rojo/negro ni par/impar.", prizes: "Apuesta ganadora: 2 créditos virtuales en total. RTP 97,2973 %; tarifa objetivo de 1 crédito; sin retiros." },
  jackpot: { title: "Jackpot piloto", price: 1, pickLimit: 5, range: 20, rules: "Selecciona cinco posiciones distintas entre 1 y 20. Tras cinco posiciones principales se revela una sexta bola de consuelo.", prizes: "4 coincidencias pagan 5 créditos; 5 coincidencias pagan 11 900. Con exactamente 2 coincidencias principales y una coincidencia en la sexta bola, el consuelo paga 1 crédito virtual. RTP 85,0426 %; sin retiros." },
  bingo: { title: "Bingo piloto", price: 1, pickLimit: 1, range: 5, rules: "Selecciona una de cinco cartillas virtuales. La secuencia se obtiene con sorteos verificables.", prizes: "Cartilla ganadora: 5 créditos virtuales por boleto. RTP 100 % del modelo simple; sin retiros." },
  bingo_flash: { title: "Bingo Flash", price: 1, pickLimit: 3, range: 15, rules: "Elige tres números distintos del 1 al 15. Se revelan nueve bolillas principales y una décima bolilla de consuelo.", prizes: "Premio virtual según la extracción principal en que completas los tres números; completarlo exactamente con la décima bolilla paga 1 crédito. RTP 85,0549 %; sin retiros." },
  bingo_keno: { title: "Bingo Keno", price: 1, pickLimit: 10, range: 80, rules: "Elige diez números distintos del 1 al 80. Se revelan veinte bolillas principales y una vigésima primera bolilla de consuelo.", prizes: "Tabla virtual por 5–10 aciertos; con 4 aciertos principales y una quinta coincidencia en la bolilla 21, el consuelo paga 1 crédito. RTP 85,0000 %; sin retiros." },
  bingo_75: { title: "Bingo 75", price: 1, pickLimit: 24, range: 75, rules: "Completa un cartón B-I-N-G-O con cinco números por columna excepto N, que conserva el centro libre. Se revelan cuarenta bolillas principales y una bolilla de consuelo.", prizes: "Una línea horizontal, vertical o diagonal en las primeras 40 bolillas paga 1 crédito; completarla exactamente con la bolilla 41 paga 12 créditos. RTP de transición estimado 85,15 %; validar en simulación; sin retiros." },
  loteria_29: { title: "Lotería 29", price: 1, pickLimit: 6, range: 29, rules: "Selecciona seis números distintos entre 1 y 29.", prizes: "Tabla virtual S/1: 6: 7 000; 5: 320; 4: 46; 3: 6 créditos. RTP 92,2593 %; sin retiros ni valor monetario." },
  loteria_39: { title: "Lotería 39 MJP", price: 1, pickLimit: 6, range: 39, rules: "Selecciona seis números distintos entre 1 y 39. MJP Extra queda separado y requiere una regla adicional; el servidor sortea un resultado fuera de los seis principales.", prizes: "Tabla virtual S/1 de transición: 6: 50 000; 5: 1 167; 4: 108; 3: 10; 2: 1 créditos virtuales. RTP 87,0902 %; sin retiros ni valor monetario." },
  loteria_39_5: { title: "Lotería 39 · 5/39", price: 1, pickLimit: 5, range: 39, rules: "Selecciona cinco números distintos entre 1 y 39. Modalidad separada de Lotería 39 MJP 6/39.", prizes: "Tabla virtual S/1: 5: 27 000; 4: 300; 3: 20; 2: 5 créditos virtuales. RTP 85,0011 %; sin retiros ni valor monetario." },
  loteria_49: { title: "Lotería 49", price: 1, pickLimit: 6, range: 49, rules: "Selecciona seis números distintos entre 1 y 49.", prizes: "Tabla virtual v1.1.0 con RTP teórico cercano a 85 %; sin retiros ni valor monetario." },
  loteria_59: { title: "Lotería 59", price: 1, pickLimit: 6, range: 59, rules: "Selecciona seis números distintos entre 1 y 59.", prizes: "Tabla virtual S/1: 6: 500 000; 5: 10 000; 4: 250; 3: 25; 2: 5 créditos. RTP 94,3736 %; sin retiros ni valor monetario." },
  loteria_19: { title: "Lotería 19", price: 1, pickLimit: 3, range: 19, rules: "Selecciona tres números distintos entre 1 y 19.", prizes: "Premio mayor virtual de 70 créditos. La tabla y el RTP calculado se publican en la regla versionada; sin retiros ni valor monetario." },
  cartas: { title: "Trío 13", price: 1, pickLimit: 3, range: 13, rules: "Elige tres rangos entre los trece. El servidor revela tres cartas tras el cierre.", prizes: "Premios virtuales de 1, 2 o 48 créditos por una, dos o tres coincidencias." },
  sueldo_vida: { title: "Sueldo de por vida", price: 1, pickLimit: 4, range: 30, rules: "Elige cuatro números distintos entre 1 y 30. Cuatro aciertos generan 24 cuotas mensuales virtuales de 913 créditos; tres aciertos pagan 16 créditos en una sola liquidación.", prizes: "RTP de transición 86,0299 %. Las cuotas son créditos virtuales, no pagos, no transferibles y no equivalen a una pensión o renta real." },
  raspa_digital: { title: "Raspa Digital", price: 1, pickLimit: 1, range: 20, rules: "Elige una de veinte casillas virtuales. El tablero se revela al cierre verificable de una ronda breve.", prizes: "Una coincidencia paga 17 créditos virtuales. RTP teórico 85,0000 %; no hay dinero real ni premios retirables." },
  pick_3: { title: "Pick 3", price: 1, pickLimit: 3, range: 10, rules: "Elige tres dígitos, de 0 a 9, pudiendo repetirlos. El orden sí importa.", prizes: "3 posiciones exactas pagan 500 créditos; 2 posiciones exactas pagan 13. RTP teórico 85,1000 %; sin retiros." },
  pick_4: { title: "Pick 4", price: 1, pickLimit: 4, range: 10, rules: "Elige cuatro dígitos, de 0 a 9, pudiendo repetirlos. El orden sí importa.", prizes: "4 posiciones exactas pagan 4 000 créditos; 3 posiciones exactas 58; 2 posiciones exactas 5. RTP teórico 85,1800 %; sin retiros." },
  loto_diario: { title: "Loto Diario", price: 1, pickLimit: 4, range: 20, rules: "Elige cuatro números distintos entre 1 y 20 para una ronda diaria virtual.", prizes: "4 aciertos pagan 2 000 créditos; 3 aciertos 22; 2 aciertos 1. RTP teórico 85,2012 %; sin retiros." },
  loto_express: { title: "Loto Express", price: 1, pickLimit: 3, range: 10, rules: "Elige tres números distintos entre 1 y 10 para una ronda rápida virtual.", prizes: "3 aciertos pagan 60 créditos; 2 aciertos 2. RTP teórico 85,0000 %; sin retiros." },
};

const ALGORITHM_VERSION = "hmac-sha256-rejection-v1";
const WELCOME_BONUS = 2000;
const DAILY_REWARD = 180;
const BATCH_PREVIEW_TTL_MS = 10 * 60 * 1000;
export const LOTERIA_PRIZE_TABLE_V101 = { 6: 170_000, 5: 28_000, 4: 4_500, 3: 750 } as const;
export const LOTERIA_PRIZE_TABLE_V110 = { 6: 200_000, 5: 2_500, 4: 160, 3: 21, 2: 2 } as const;
export const LOTERIA_PRIZE_TABLE_S1_39 = { 6: 50_000, 5: 1_167, 4: 108, 3: 10, 2: 1 } as const;
const LOTERIA_PRIZE_TABLE_V100 = { 6: 9_000, 5: 1_500, 4: 250, 3: 40 } as const;
export const S1_TRANSITION_PRIZE_POLICY = {
  roulette17TotalPayout: 2,
  roulette27TotalPayout: 2,
  roulette37TotalPayout: 2,
  lottery39PrizeTable: { 6: 50_000, 5: 1_167, 4: 108, 3: 10, 2: 1 },
  note: "Escenario de tarifa virtual objetivo 1; requiere revisión de margen y autorización antes de cualquier operación monetaria.",
} as const;

export const UNIFORM_CREDIT_PRIZE_POLICY = {
  ruletaExactPrize: 32,
  jackpotPrizeTable: { 5: 11_900, 4: 5, 3: 0 },
  jackpotConsolationPrize: 1,
  bingoCartillaPrize: 5,
  bingo75ConsolationPrize: 12,
  trio13PrizeTable: { 3: 48, 2: 2, 1: 1 },
  sueldoVidaPrizeTable: { 4: 21_912, 3: 16 },
  raspaDigitalPrizeTable: { 1: 17 },
  pick3PrizeTable: { 3: 500, 2: 13 },
  pick4PrizeTable: { 4: 4_000, 3: 58, 2: 5 },
  lotoDiarioPrizeTable: { 4: 2_000, 3: 22, 2: 1 },
  lotoExpressPrizeTable: { 3: 60, 2: 2 },
} as const;
export { VIRTUAL_CREDIT_REFERENCE, VIRTUAL_LOTTERY_TYPES, VIRTUAL_LOTTERY_VARIANTS };
export { ASSISTED_PLAN_DEFINITIONS, ASSISTED_PLAN_DISCLOSURE };

export const SCHEDULED_GAME_DEFINITIONS = {
  sueldo_vida: { label: "Sueldo de por vida · sorteo semanal", cronExpression: "0 0 0 * * 1", cadence: "semanal", description: "Cierra cada lunes a las 00:00 UTC; las cuotas virtuales se revisan con cada ciclo programado." },
  raspa_digital: { label: "Raspa Digital · revelación breve", cronExpression: "0 * * * * *", cadence: "cada minuto", description: "Rondas de hasta un minuto; el tablero se revela después del cierre verificable." },
  pick_3: { label: "Pick 3 · dos sorteos por hora", cronExpression: "0 0,30 * * * *", cadence: "cada 30 minutos", description: "Cierra a los minutos 00 y 30 UTC." },
  pick_4: { label: "Pick 4 · sorteo bimensual", cronExpression: "0 0 */2 * * *", cadence: "cada dos horas", description: "Cierra al inicio de cada bloque par de hora UTC." },
  loto_diario: { label: "Loto Diario · sorteo diario", cronExpression: "0 0 0 * * *", cadence: "diario", description: "Cierra a las 00:00 UTC." },
  loto_express: { label: "Loto Express · dos sorteos por hora", cronExpression: "0 0,30 * * * *", cadence: "cada 30 minutos", description: "Cierra a los minutos 00 y 30 UTC." },
} as const;

export type ScheduledGameType = keyof typeof SCHEDULED_GAME_DEFINITIONS;

function isScheduledGameType(gameType: GameType): gameType is ScheduledGameType {
  return gameType in SCHEDULED_GAME_DEFINITIONS;
}

function nextScheduledCloseAt(gameType: GameType, now = new Date()) {
  const next = new Date(now);
  next.setUTCSeconds(0, 0);
  if (gameType === "raspa_digital") {
    next.setUTCMinutes(next.getUTCMinutes() + 1);
    return next;
  }
  if (gameType === "pick_3" || gameType === "loto_express") {
    next.setUTCMinutes(next.getUTCMinutes() < 30 ? 30 : 60);
    return next;
  }
  if (gameType === "pick_4") {
    next.setUTCHours(next.getUTCHours() + (next.getUTCHours() % 2 === 0 ? 2 : 1), 0, 0, 0);
    return next;
  }
  if (gameType === "loto_diario") {
    next.setUTCDate(next.getUTCDate() + 1);
    next.setUTCHours(0, 0, 0, 0);
    return next;
  }
  if (gameType === "sueldo_vida") {
    const daysUntilMonday = (8 - next.getUTCDay()) % 7 || 7;
    next.setUTCDate(next.getUTCDate() + daysUntilMonday);
    next.setUTCHours(0, 0, 0, 0);
    return next;
  }
  return new Date(now.getTime() + 20 * 60 * 1000);
}

function isLotteryGameType(gameType: GameType) {
  return isVirtualLotteryGameType(gameType);
}

function isSimplifiedBingoGameType(gameType: GameType): gameType is (typeof SIMPLIFIED_BINGO_TYPES)[number] {
  return SIMPLIFIED_BINGO_TYPES.includes(gameType as (typeof SIMPLIFIED_BINGO_TYPES)[number]);
}

function isSimplifiedRouletteGameType(gameType: GameType): gameType is (typeof SIMPLIFIED_ROULETTE_TYPES)[number] {
  return SIMPLIFIED_ROULETTE_TYPES.includes(gameType as (typeof SIMPLIFIED_ROULETTE_TYPES)[number]);
}

function isSimplifiedGameType(gameType: GameType): gameType is (typeof SIMPLIFIED_BINGO_TYPES)[number] | (typeof SIMPLIFIED_ROULETTE_TYPES)[number] {
  return isSimplifiedBingoGameType(gameType) || isSimplifiedRouletteGameType(gameType);
}

function lotteryPrizeTableFor(gameType: GameType): LotteryPrizeTable {
  return isVirtualLotteryGameType(gameType) ? VIRTUAL_LOTTERY_VARIANTS[gameType].prizeTable : LOTERIA_PRIZE_TABLE_V101;
}

function lotteryBonusBallPacksFor(gameType: GameType): readonly LotteryBonusBallPack[] {
  return [];
}

function bonusBallExtraCost(gameType: GameType, bonusBallCount: number) {
  if (bonusBallCount === 0) return 0;
  const pack = getLotteryBonusBallPack(VIRTUAL_LOTTERY_VARIANTS[gameType as keyof typeof VIRTUAL_LOTTERY_VARIANTS], bonusBallCount);
  return pack ? pack.totalCostCredits - GAME_CONFIG[gameType].price : NaN;
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const makePublicId = (prefix: string) => `${prefix}-${nanoid(12).toUpperCase()}`;
const makeHumanTicketId = (gameType: GameType) => buildHumanTicketId(ticketPrefixFor(gameType), (upperExclusive) => randomInt(upperExclusive));
const makeMarketPositionId = () => buildHumanTicketId(MARKET_POSITION_PREFIX, (upperExclusive) => randomInt(upperExclusive));
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function getBenefit(quantity: number) {
  if (quantity >= 6) return { tier: "impulso", discount: 12, multiplier: 1.25 };
  if (quantity >= 3) return { tier: "constancia", discount: 6, multiplier: 1.1 };
  return { tier: "explora", discount: 0, multiplier: 1 };
}

async function resolveBenefit(quantity: number) {
  const db = await requireDatabase();
  const promotions = await db.select().from(promotionRules).where(and(eq(promotionRules.kind, "volume_discount"), eq(promotionRules.isActive, true)));
  const candidates = promotions.map((promotion) => ({ promotion, conditions: JSON.parse(promotion.conditionsJson) as { minimum?: number; discount?: number; multiplier?: number } })).filter(({ conditions }) => quantity >= (conditions.minimum ?? 1));
  const selected = candidates.sort((left, right) => (right.conditions.minimum ?? 0) - (left.conditions.minimum ?? 0))[0];
  if (!selected) return getBenefit(quantity);
  return { tier: selected.promotion.code, discount: selected.conditions.discount ?? 0, multiplier: selected.conditions.multiplier ?? 1 };
}

function benefitForGameBatch(gameType: GameType, quantity: number) {
  if (gameType !== "loteria_39") return { tier: "tarifa-uniforme", discount: 0, multiplier: 1 };
  return resolveBenefit(quantity);
}

function deterministicIndex(seed: string, context: string, size: number, counterStart = 0) {
  const max = 0x100000000;
  const limit = Math.floor(max / size) * size;
  let counter = counterStart;
  while (true) {
    const digest = createHmac("sha256", seed).update(`${context}:${counter}`).digest();
    const candidate = digest.readUInt32BE(0);
    if (candidate < limit) return { value: candidate % size, counter: counter + 1 };
    counter += 1;
  }
}

function sampleUnique(seed: string, context: string, range: number, count: number, startAt = 1) {
  const pool = Array.from({ length: range }, (_, index) => index + startAt);
  const values: number[] = [];
  let counter = 0;
  while (values.length < count) {
    const pick = deterministicIndex(seed, context, pool.length, counter);
    counter = pick.counter;
    values.push(pool.splice(pick.value, 1)[0]);
  }
  return values.sort((left, right) => left - right);
}

function sampleWithReplacement(seed: string, context: string, range: number, count: number, startAt = 0) {
  return Array.from({ length: count }, (_, index) => deterministicIndex(seed, `${context}:digit`, range, index).value + startAt);
}

function isPositionalPickGame(gameType: GameType): gameType is "pick_3" | "pick_4" {
  return gameType === "pick_3" || gameType === "pick_4";
}

function isNewNumberGame(gameType: GameType): gameType is "sueldo_vida" | "loto_diario" | "loto_express" {
  return gameType === "sueldo_vida" || gameType === "loto_diario" || gameType === "loto_express";
}

export function drawTrio13(seed: string, publicSeed: string, publicId: string) {
  return sampleUnique(seed, `${publicId}:${publicSeed}:${ALGORITHM_VERSION}`, 13, 3);
}

function calculateResult(gameType: GameType, seed: string, publicSeed: string, publicId: string) {
  const context = `${publicId}:${publicSeed}:${ALGORITHM_VERSION}`;
  if (isSimplifiedRouletteGameType(gameType)) {
    const number = deterministicIndex(seed, context, SIMPLIFIED_ROULETTE_CONFIG[gameType].pockets).value;
    return getSimplifiedRouletteOutcome(SIMPLIFIED_ROULETTE_CONFIG[gameType].pockets, number);
  }
  if (isSimplifiedBingoGameType(gameType)) {
    const config = SIMPLIFIED_BINGO_CONFIG[gameType];
    return { calls: sampleUnique(seed, context, config.range, config.draws) };
  }
  if (gameType === "ruleta") {
    const number = deterministicIndex(seed, context, 37).value;
    const color = number === 0 ? "verde" : [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number) ? "rojo" : "negro";
    return { number, color };
  }
  if (gameType === "jackpot") {
    const positions = sampleUnique(seed, context, 20, 5);
    const remaining = Array.from({ length: 20 }, (_, index) => index + 1).filter((number) => !positions.includes(number));
    const extraPosition = remaining[deterministicIndex(seed, `${context}:consuelo`, remaining.length).value];
    return { positions, extraPosition };
  }
  if (gameType === "bingo") return { calls: sampleUnique(seed, context, 75, 15), winningCartilla: deterministicIndex(seed, `${context}:cartilla`, 3).value + 1 };
  if (gameType === "cartas") return { cards: drawTrio13(seed, publicSeed, publicId) };
  if (gameType === "raspa_digital") return { winningPosition: deterministicIndex(seed, context, 20).value + 1 };
  if (isPositionalPickGame(gameType)) return { digits: sampleWithReplacement(seed, context, 10, GAME_CONFIG[gameType].pickLimit) };
  const numbers = sampleUnique(seed, context, GAME_CONFIG[gameType].range, GAME_CONFIG[gameType].pickLimit);
  if (gameType === "loteria_39") {
    const remainingNumbers = Array.from({ length: GAME_CONFIG[gameType].range }, (_, index) => index + 1).filter((number) => !numbers.includes(number));
    const extraNumber = remainingNumbers[deterministicIndex(seed, `${context}:mjp-extra`, remainingNumbers.length).value];
    return { numbers, extraNumber };
  }
  return { numbers };
}

async function requireDatabase() {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db;
}

async function appendAuditEvent(input: { actorUserId?: number; eventType: string; entityType: string; entityPublicId: string; payload: unknown }, dbOverride?: any) {
  const db = dbOverride ?? await requireDatabase();
  const last = await db.select({ eventHash: auditEvents.eventHash }).from(auditEvents).orderBy(desc(auditEvents.id)).limit(1);
  const previousHash = last[0]?.eventHash ?? null;
  const payloadJson = canonicalJson(input.payload);
  const eventHash = sha256(`${previousHash ?? "genesis"}|${input.eventType}|${input.entityType}|${input.entityPublicId}|${payloadJson}`);
  await db.insert(auditEvents).values({
    publicId: makePublicId("AUD"),
    actorUserId: input.actorUserId,
    eventType: input.eventType,
    entityType: input.entityType,
    entityPublicId: input.entityPublicId,
    payloadJson,
    previousHash,
    eventHash,
  });
  await appendOperationalEvent({
    eventType: `AUDIT_${input.eventType.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}`.slice(0, 96),
    aggregateType: input.entityType,
    aggregateId: input.entityPublicId,
    actorUserId: input.actorUserId,
    source: "round_engine",
    payload: { payload: input.payload, eventHash, previousHash },
    correlationId: `audit:${input.entityPublicId}`,
    idempotencyKey: `audit:${eventHash}`,
  }, db);
  return eventHash;
}

export async function bootstrapPilotRules(actorUserId: number) {
  const db = await requireDatabase();
  const now = new Date();
  const created: string[] = [];

  for (const gameType of GAME_TYPES) {
    const config = GAME_CONFIG[gameType];
    const uniformRuleset = gameType !== "loteria_39" && (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, "v1.1.0"))).limit(1))[0];
    const rulesetVersion = uniformRuleset ? "v1.1.0" : gameType === "bingo" || gameType === "loteria_39" ? "v1.0.1" : "v1.0.0";
    const existing = await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, rulesetVersion))).limit(1);
    let ruleset = existing[0];
    if (!ruleset) {
      await db.insert(gameRulesets).values({
        gameType,
        version: rulesetVersion,
        title: config.title,
        rulesJson: JSON.stringify({ gameType, pickLimit: config.pickLimit, numberRange: config.range, text: config.rules, bingoCartillaPrize: gameType === "bingo" ? 82 : undefined, jackpotPrizeTable: gameType === "jackpot" ? UNIFORM_CREDIT_PRIZE_POLICY.jackpotPrizeTable : undefined, jackpotConsolationPrize: gameType === "jackpot" ? UNIFORM_CREDIT_PRIZE_POLICY.jackpotConsolationPrize : undefined, loteriaPrizeTable: isLotteryGameType(gameType) ? lotteryPrizeTableFor(gameType) : undefined, bonusBallPacks: isConsolationLotteryGameType(gameType) ? lotteryBonusBallPacksFor(gameType) : undefined, mjpExtra: gameType === "loteria_39" ? MJP_EXTRA_39 : undefined, creditReference: VIRTUAL_CREDIT_REFERENCE, pilotOnly: true }),
        prizePolicyJson: JSON.stringify({ text: config.prizes, bingoCartillaPrize: gameType === "bingo" ? 82 : undefined, jackpotPrizeTable: gameType === "jackpot" ? UNIFORM_CREDIT_PRIZE_POLICY.jackpotPrizeTable : undefined, jackpotConsolationPrize: gameType === "jackpot" ? UNIFORM_CREDIT_PRIZE_POLICY.jackpotConsolationPrize : undefined, loteriaPrizeTable: isLotteryGameType(gameType) ? lotteryPrizeTableFor(gameType) : undefined, bonusBallPacks: isConsolationLotteryGameType(gameType) ? lotteryBonusBallPacksFor(gameType) : undefined, mjpExtra: gameType === "loteria_39" ? MJP_EXTRA_39 : undefined, virtualOnly: true, withdrawals: false, creditReference: VIRTUAL_CREDIT_REFERENCE }),
        isPublished: true,
        createdByUserId: actorUserId,
      });
      const rows = await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, rulesetVersion))).limit(1);
      ruleset = rows[0];
    }
    const candidateRounds = await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), inArray(gameRounds.state, ["draft", "open"])));
    const activeRound = candidateRounds.find((round) => new Date(round.closesAt).getTime() > now.getTime());
    for (const expiredRound of candidateRounds.filter((round) => new Date(round.closesAt).getTime() <= now.getTime())) {
      const nextState = expiredRound.state === "draft" ? "archived" : "locked";
      if (nextState === "locked") assertRoundTransition(expiredRound.state, "locked");
      await db.update(gameRounds).set({ state: nextState, lockedAt: nextState === "locked" ? (expiredRound.lockedAt ?? now) : expiredRound.lockedAt }).where(eq(gameRounds.id, expiredRound.id));
      await appendAuditEvent({ actorUserId, eventType: nextState === "locked" ? "round.locked" : "round.archived", entityType: "round", entityPublicId: expiredRound.publicId, payload: { reason: "bootstrap_expired_round", gameType, previousState: expiredRound.state, nextState } });
    }
    if (!activeRound && ruleset) {
      const secret = randomBytes(32).toString("hex");
      const publicId = `RP-${gameType.slice(0, 1).toUpperCase()}-${nanoid(8).toUpperCase()}`;
      await db.insert(gameRounds).values({
        publicId,
        gameType,
        rulesetId: ruleset.id,
        state: "open",
        opensAt: now,
        closesAt: nextScheduledCloseAt(gameType, now),
        serverSeedHash: sha256(secret),
        serverSeedSecret: secret,
        jackpotPoolCredits: gameType === "jackpot" ? 18400 : 0,
        algorithmVersion: ALGORITHM_VERSION,
        createdByUserId: actorUserId,
      });
      await appendAuditEvent({ actorUserId, eventType: "round.opened", entityType: "round", entityPublicId: publicId, payload: { gameType, ruleset: ruleset.version, serverSeedHash: sha256(secret) } });
      created.push(publicId);
    }
  }
  for (const [gameType, schedule] of Object.entries(SCHEDULED_GAME_DEFINITIONS) as Array<[ScheduledGameType, (typeof SCHEDULED_GAME_DEFINITIONS)[ScheduledGameType]]>) {
    const existingSchedule = (await db.select().from(gameSchedules).where(eq(gameSchedules.gameType, gameType)).limit(1))[0];
    if (!existingSchedule) {
      await db.insert(gameSchedules).values({ gameType, label: schedule.label, cronExpression: schedule.cronExpression, timezone: "UTC", isEnabled: false, metadataJson: JSON.stringify({ cadence: schedule.cadence, description: schedule.description, pilotOnly: true, activationRequiresPublish: true }), createdByUserId: actorUserId });
      await appendAuditEvent({ actorUserId, eventType: "game_schedule.prepared", entityType: "game_schedule", entityPublicId: gameType, payload: { cronExpression: schedule.cronExpression, timezone: "UTC", isEnabled: false, pilotOnly: true, activationRequiresPublish: true } });
    }
  }
  const defaultMissions = [
    { code: "FIRST_TICKET", title: "Primer boleto", badgeLabel: "Inicio verificado", description: "Confirma una participación virtual.", targetCount: 1, rewardCredits: 80 },
    { code: "TWO_GAMES", title: "Explora dos modalidades", badgeLabel: "Explorador de mesa", description: "Participa en dos tipos de juego distintos.", targetCount: 2, rewardCredits: 120 },
    { code: "VERIFY_DRAW", title: "Consulta un sorteo", badgeLabel: "Verificador público", description: "Abre y confirma un expediente verificable.", targetCount: 1, rewardCredits: 60 },
  ];
  for (const mission of defaultMissions) {
    const existingMission = await db.select().from(missions).where(eq(missions.code, mission.code)).limit(1);
    if (!existingMission[0]) await db.insert(missions).values(mission);
  }
  const defaultPromotions = [
    { code: "explora", label: "Explora", conditions: { minimum: 1, discount: 0, multiplier: 1 } },
    { code: "constancia", label: "Constancia", conditions: { minimum: 3, discount: 6, multiplier: 1.1 } },
    { code: "impulso", label: "Impulso", conditions: { minimum: 6, discount: 12, multiplier: 1.25 } },
    { code: "racha_3", label: "Racha de tres", conditions: { every: 3, rewardCredits: 70 } },
  ];
  for (const promotion of defaultPromotions) {
    const existingPromotion = await db.select().from(promotionRules).where(eq(promotionRules.code, promotion.code)).limit(1);
    if (!existingPromotion[0]) await db.insert(promotionRules).values({ code: promotion.code, label: promotion.label, kind: promotion.code === "racha_3" ? "streak_bonus" : "volume_discount", conditionsJson: JSON.stringify(promotion.conditions), createdByUserId: actorUserId });
  }
  const socialCycle = await db.select().from(socialImpactCycles).where(eq(socialImpactCycles.periodLabel, "Piloto gratuito")).limit(1);
  if (!socialCycle[0]) {
    await db.insert(socialImpactCycles).values({
      publicId: makePublicId("SOC"),
      title: "Compromiso social del piloto",
      periodLabel: "Piloto gratuito",
      institutionalRateBps: 100,
      status: "pilot_disclosure",
      policyText: "Durante el piloto no hay dinero real ni utilidades. Si se habilita una versión regulada, se propondrá un aporte institucional de hasta 1 % de utilidades netas, divulgado por periodo y respaldado con un reporte. Las donaciones de ganadores serán siempre voluntarias, explícitas y no reducirán premios sin consentimiento.",
    });
  }
  return { created };
}

export async function activateBingoRecalibration(actorUserId: number) {
  const db = await requireDatabase();
  const config = GAME_CONFIG.bingo;
  const now = new Date();
  let ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, "bingo"), eq(gameRulesets.version, "v1.0.1"))).limit(1))[0];

  if (!ruleset) {
    await db.insert(gameRulesets).values({
      gameType: "bingo",
      version: "v1.0.1",
      title: config.title,
      rulesJson: JSON.stringify({ gameType: "bingo", pickLimit: config.pickLimit, numberRange: config.range, text: config.rules, bingoCartillaPrize: 82, pilotOnly: true, recalibratedAt: now.toISOString() }),
      prizePolicyJson: JSON.stringify({ text: config.prizes, bingoCartillaPrize: 82, virtualOnly: true, withdrawals: false }),
      isPublished: true,
      createdByUserId: actorUserId,
    });
    ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, "bingo"), eq(gameRulesets.version, "v1.0.1"))).limit(1))[0];
  }
  if (!ruleset) throw new Error("No se pudo publicar la regla recalibrada de Bingo.");

  const candidateRounds = await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, "bingo"), inArray(gameRounds.state, ["draft", "open", "locked"])));
  const archivedPublicIds: string[] = [];
  for (const round of candidateRounds) {
    if (round.rulesetId === ruleset.id) continue;
    const tickets = await db.select().from(pilotTickets).where(eq(pilotTickets.roundId, round.id)).limit(1);
    if (tickets.length) {
      throw new Error(`La ronda histórica ${round.publicId} ya tiene boletos y debe cerrarse con su regla original antes de activar v1.0.1.`);
    }
    await db.update(gameRounds).set({ state: "archived" }).where(eq(gameRounds.id, round.id));
    await appendAuditEvent({ actorUserId, eventType: "round.archived", entityType: "round", entityPublicId: round.publicId, payload: { reason: "bingo_recalibration_v1.0.1", priorRulesetId: round.rulesetId, replacementRulesetId: ruleset.id } });
    archivedPublicIds.push(round.publicId);
  }

  let activeRound = (await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, "bingo"), eq(gameRounds.rulesetId, ruleset.id), inArray(gameRounds.state, ["draft", "open", "locked"]))).limit(1))[0];
  if (!activeRound) {
    const secret = randomBytes(32).toString("hex");
    const publicId = `RP-B-${nanoid(8).toUpperCase()}`;
    await db.insert(gameRounds).values({
      publicId,
      gameType: "bingo",
      rulesetId: ruleset.id,
      state: "open",
      opensAt: now,
      closesAt: new Date(now.getTime() + 20 * 60 * 1000),
      serverSeedHash: sha256(secret),
      serverSeedSecret: secret,
      jackpotPoolCredits: 0,
      algorithmVersion: ALGORITHM_VERSION,
      createdByUserId: actorUserId,
    });
    activeRound = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1))[0];
    await appendAuditEvent({ actorUserId, eventType: "round.opened", entityType: "round", entityPublicId: publicId, payload: { gameType: "bingo", ruleset: "v1.0.1", bingoCartillaPrize: 82, serverSeedHash: sha256(secret) } });
  }
  await appendAuditEvent({ actorUserId, eventType: "ruleset.activated", entityType: "ruleset", entityPublicId: `bingo:${ruleset.version}`, payload: { gameType: "bingo", version: ruleset.version, bingoCartillaPrize: 82, archivedRounds: archivedPublicIds, activeRoundPublicId: activeRound?.publicId } });
  return { version: ruleset.version, bingoCartillaPrize: 82, archivedPublicIds, activeRoundPublicId: activeRound?.publicId };
}

export async function activateMjpExtra39(actorUserId: number) {
  const db = await requireDatabase();
  const gameType: GameType = "loteria_39";
  const config = GAME_CONFIG[gameType];
  const now = new Date();
  let ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, "v1.0.1"))).limit(1))[0];
  if (!ruleset) {
    await db.insert(gameRulesets).values({
      gameType,
      version: "v1.0.1",
      title: config.title,
      rulesJson: JSON.stringify({ gameType, pickLimit: config.pickLimit, numberRange: config.range, text: config.rules, loteriaPrizeTable: lotteryPrizeTableFor(gameType), mjpExtra: MJP_EXTRA_39, creditReference: VIRTUAL_CREDIT_REFERENCE, pilotOnly: true, activatedAt: now.toISOString() }),
      prizePolicyJson: JSON.stringify({ text: config.prizes, loteriaPrizeTable: lotteryPrizeTableFor(gameType), mjpExtra: MJP_EXTRA_39, virtualOnly: true, withdrawals: false, creditReference: VIRTUAL_CREDIT_REFERENCE }),
      isPublished: true,
      createdByUserId: actorUserId,
    });
    ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, "v1.0.1"))).limit(1))[0];
  }
  if (!ruleset) throw new Error("No se pudo publicar la regla MJP Extra de Lotería 39.");
  const candidates = await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), inArray(gameRounds.state, ["draft", "open", "locked"])));
  const archivedPublicIds: string[] = [];
  for (const round of candidates) {
    if (round.rulesetId === ruleset.id) continue;
    const tickets = await db.select().from(pilotTickets).where(eq(pilotTickets.roundId, round.id)).limit(1);
    if (tickets.length) throw new Error(`La ronda histórica ${round.publicId} ya tiene boletos y debe cerrarse con su regla original antes de activar MJP Extra.`);
    await db.update(gameRounds).set({ state: "archived" }).where(eq(gameRounds.id, round.id));
    await appendAuditEvent({ actorUserId, eventType: "round.archived", entityType: "round", entityPublicId: round.publicId, payload: { reason: "mjp_extra_loteria_39_v1.0.1", priorRulesetId: round.rulesetId, replacementRulesetId: ruleset.id } });
    archivedPublicIds.push(round.publicId);
  }
  let activeRound = (await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), eq(gameRounds.rulesetId, ruleset.id), inArray(gameRounds.state, ["draft", "open", "locked"]))).limit(1))[0];
  if (!activeRound) {
    const secret = randomBytes(32).toString("hex");
    const publicId = `RP-MJP-${nanoid(8).toUpperCase()}`;
    await db.insert(gameRounds).values({ publicId, gameType, rulesetId: ruleset.id, state: "open", opensAt: now, closesAt: new Date(now.getTime() + 20 * 60 * 1000), serverSeedHash: sha256(secret), serverSeedSecret: secret, jackpotPoolCredits: 0, algorithmVersion: ALGORITHM_VERSION, createdByUserId: actorUserId });
    activeRound = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1))[0];
    await appendAuditEvent({ actorUserId, eventType: "round.opened", entityType: "round", entityPublicId: publicId, payload: { gameType, ruleset: "v1.0.1", mjpExtra: MJP_EXTRA_39, serverSeedHash: sha256(secret) } });
  }
  await appendAuditEvent({ actorUserId, eventType: "ruleset.activated", entityType: "ruleset", entityPublicId: `${gameType}:${ruleset.version}`, payload: { gameType, version: ruleset.version, mjpExtra: MJP_EXTRA_39, archivedRounds: archivedPublicIds, activeRoundPublicId: activeRound?.publicId } });
  return { version: ruleset.version, mjpExtra: MJP_EXTRA_39, archivedPublicIds, activeRoundPublicId: activeRound?.publicId };
}

const UNIFORM_CREDIT_GAME_TYPES: GameType[] = ["ruleta", "jackpot", "bingo", "loteria_19", "loteria_29", "loteria_49", "loteria_59", "cartas"];

function uniformCreditRulesetPayload(gameType: GameType) {
  const config = GAME_CONFIG[gameType];
  const lotteryTable = isVirtualLotteryGameType(gameType) ? lotteryPrizeTableFor(gameType) : undefined;
  const policyValues = {
    priceCredits: config.price,
    bingoCartillaPrize: gameType === "bingo" ? UNIFORM_CREDIT_PRIZE_POLICY.bingoCartillaPrize : undefined,
    bingo75ConsolationPrize: gameType === "bingo_75" ? UNIFORM_CREDIT_PRIZE_POLICY.bingo75ConsolationPrize : undefined,
    loteriaPrizeTable: lotteryTable,
    ruletaExactPrize: gameType === "ruleta" ? UNIFORM_CREDIT_PRIZE_POLICY.ruletaExactPrize : undefined,
    jackpotPrizeTable: gameType === "jackpot" ? UNIFORM_CREDIT_PRIZE_POLICY.jackpotPrizeTable : undefined,
    jackpotConsolationPrize: gameType === "jackpot" ? UNIFORM_CREDIT_PRIZE_POLICY.jackpotConsolationPrize : undefined,
    trio13PrizeTable: gameType === "cartas" ? UNIFORM_CREDIT_PRIZE_POLICY.trio13PrizeTable : undefined,
    sueldoVidaPrizeTable: gameType === "sueldo_vida" ? UNIFORM_CREDIT_PRIZE_POLICY.sueldoVidaPrizeTable : undefined,
    raspaDigitalPrizeTable: gameType === "raspa_digital" ? UNIFORM_CREDIT_PRIZE_POLICY.raspaDigitalPrizeTable : undefined,
    pick3PrizeTable: gameType === "pick_3" ? UNIFORM_CREDIT_PRIZE_POLICY.pick3PrizeTable : undefined,
    pick4PrizeTable: gameType === "pick_4" ? UNIFORM_CREDIT_PRIZE_POLICY.pick4PrizeTable : undefined,
    lotoDiarioPrizeTable: gameType === "loto_diario" ? UNIFORM_CREDIT_PRIZE_POLICY.lotoDiarioPrizeTable : undefined,
    lotoExpressPrizeTable: gameType === "loto_express" ? UNIFORM_CREDIT_PRIZE_POLICY.lotoExpressPrizeTable : undefined,
    virtualOnly: true,
    withdrawals: false,
    creditReference: VIRTUAL_CREDIT_REFERENCE,
    pilotOnly: true,
  };
  return { rules: { gameType, pickLimit: config.pickLimit, numberRange: config.range, text: config.rules, ...policyValues }, policy: { text: config.prizes, ...policyValues } };
}

export async function activateUniformCreditRules(actorUserId: number) {
  const db = await requireDatabase();
  const now = new Date();
  const activated: Array<{ gameType: GameType; version: string; activeRoundPublicId: string }> = [];
  const archivedPublicIds: string[] = [];
  for (const gameType of UNIFORM_CREDIT_GAME_TYPES) {
    const config = GAME_CONFIG[gameType];
    const { rules, policy } = uniformCreditRulesetPayload(gameType);
    let ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, "v1.1.0"))).limit(1))[0];
    if (!ruleset) {
      await db.insert(gameRulesets).values({ gameType, version: "v1.1.0", title: config.title, rulesJson: JSON.stringify({ ...rules, activatedAt: now.toISOString() }), prizePolicyJson: JSON.stringify(policy), isPublished: true, createdByUserId: actorUserId });
      ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, "v1.1.0"))).limit(1))[0];
    }
    if (!ruleset) throw new Error(`No se pudo publicar la regla uniforme de ${gameType}.`);
    const candidates = await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), inArray(gameRounds.state, ["draft", "open", "locked"])));
    for (const round of candidates) {
      if (round.rulesetId === ruleset.id) continue;
      const tickets = await db.select().from(pilotTickets).where(eq(pilotTickets.roundId, round.id)).limit(1);
      if (tickets.length) throw new Error(`La ronda histórica ${round.publicId} de ${gameType} ya tiene boletos y debe cerrarse con su regla original antes de activar la tarifa uniforme.`);
      await db.update(gameRounds).set({ state: "archived" }).where(eq(gameRounds.id, round.id));
      await appendAuditEvent({ actorUserId, eventType: "round.archived", entityType: "round", entityPublicId: round.publicId, payload: { reason: "uniform_credit_v1.1.0", priorRulesetId: round.rulesetId, replacementRulesetId: ruleset.id } });
      archivedPublicIds.push(round.publicId);
    }
    let activeRound = (await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), eq(gameRounds.rulesetId, ruleset.id), inArray(gameRounds.state, ["draft", "open", "locked"]))).limit(1))[0];
    if (!activeRound) {
      const secret = randomBytes(32).toString("hex");
      const publicId = `RP-${gameType.slice(0, 1).toUpperCase()}-${nanoid(8).toUpperCase()}`;
      await db.insert(gameRounds).values({ publicId, gameType, rulesetId: ruleset.id, state: "open", opensAt: now, closesAt: new Date(now.getTime() + 20 * 60 * 1000), serverSeedHash: sha256(secret), serverSeedSecret: secret, jackpotPoolCredits: 0, algorithmVersion: ALGORITHM_VERSION, createdByUserId: actorUserId });
      activeRound = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1))[0];
      await appendAuditEvent({ actorUserId, eventType: "round.opened", entityType: "round", entityPublicId: publicId, payload: { gameType, ruleset: "v1.1.0", priceCredits: config.price, prizePolicy: policy, serverSeedHash: sha256(secret) } });
    }
    await appendAuditEvent({ actorUserId, eventType: "ruleset.activated", entityType: "ruleset", entityPublicId: `${gameType}:v1.1.0`, payload: { gameType, version: "v1.1.0", priceCredits: config.price, activeRoundPublicId: activeRound.publicId, pilotOnly: true } });
    activated.push({ gameType, version: "v1.1.0", activeRoundPublicId: activeRound.publicId });
  }
  return { activated, archivedPublicIds, excluded: { gameType: "loteria_39", reason: "MJP Extra conserva el costo adicional, multiplicador ×2 y RTP publicado de 75,1562 %." }, pilotOnly: true };
}

const RECALIBRATED_GAME_TYPES: GameType[] = ["jackpot", "bingo_flash", "bingo_keno", "bingo_75", "ruleta_17", "ruleta_27", "ruleta_37"];

export async function activateRecalibratedGameRules(actorUserId: number) {
  const db = await requireDatabase();
  const now = new Date();
  const activated: Array<{ gameType: GameType; version: string; activeRoundPublicId: string }> = [];
  const archivedPublicIds: string[] = [];
  for (const gameType of RECALIBRATED_GAME_TYPES) {
    const config = GAME_CONFIG[gameType];
    const { rules, policy } = uniformCreditRulesetPayload(gameType);
    const version = "v1.2.0";
    let ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, version))).limit(1))[0];
    if (!ruleset) {
      await db.insert(gameRulesets).values({ gameType, version, title: config.title, rulesJson: JSON.stringify({ ...rules, activatedAt: now.toISOString(), recalibration: "consuelo_y_rtp_v1.2.0" }), prizePolicyJson: JSON.stringify(policy), isPublished: true, createdByUserId: actorUserId });
      ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.version, version))).limit(1))[0];
    }
    if (!ruleset) throw new Error(`No se pudo publicar la regla recalibrada de ${gameType}.`);
    const candidates = await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), inArray(gameRounds.state, ["draft", "open", "locked"])));
    for (const round of candidates) {
      if (round.rulesetId === ruleset.id) continue;
      const tickets = await db.select().from(pilotTickets).where(eq(pilotTickets.roundId, round.id)).limit(1);
      if (tickets.length) throw new Error(`La ronda ${round.publicId} de ${gameType} tiene boletos y debe liquidarse antes de activar v1.2.0.`);
      await db.update(gameRounds).set({ state: "archived" }).where(eq(gameRounds.id, round.id));
      await appendAuditEvent({ actorUserId, eventType: "round.archived", entityType: "round", entityPublicId: round.publicId, payload: { reason: "recalibration_v1.2.0", priorRulesetId: round.rulesetId, replacementRulesetId: ruleset.id } });
      archivedPublicIds.push(round.publicId);
    }
    let activeRound = (await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), eq(gameRounds.rulesetId, ruleset.id), inArray(gameRounds.state, ["draft", "open", "locked"]))).limit(1))[0];
    if (!activeRound) {
      const secret = randomBytes(32).toString("hex");
      const publicId = `RP-${gameType.slice(0, 1).toUpperCase()}-${nanoid(8).toUpperCase()}`;
      await db.insert(gameRounds).values({ publicId, gameType, rulesetId: ruleset.id, state: "open", opensAt: now, closesAt: new Date(now.getTime() + 20 * 60 * 1000), serverSeedHash: sha256(secret), serverSeedSecret: secret, jackpotPoolCredits: gameType === "jackpot" ? 18_400 : 0, algorithmVersion: ALGORITHM_VERSION, createdByUserId: actorUserId });
      activeRound = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1))[0];
      await appendAuditEvent({ actorUserId, eventType: "round.opened", entityType: "round", entityPublicId: publicId, payload: { gameType, ruleset: version, priceCredits: config.price, prizePolicy: policy, serverSeedHash: sha256(secret) } });
    }
    await appendAuditEvent({ actorUserId, eventType: "ruleset.activated", entityType: "ruleset", entityPublicId: `${gameType}:${version}`, payload: { gameType, version, priceCredits: config.price, activeRoundPublicId: activeRound.publicId, pilotOnly: true } });
    activated.push({ gameType, version, activeRoundPublicId: activeRound.publicId });
  }
  return { activated, archivedPublicIds, pilotOnly: true, virtualOnly: true };
}

export async function getPublicRounds() {
  const db = await requireDatabase();
  const rows = await db.select().from(gameRounds).where(inArray(gameRounds.state, ["open", "locked", "drawn", "settled"])).orderBy(desc(gameRounds.createdAt));
  return rows.map(({ serverSeedSecret: _secret, ...round }) => round);
}

export async function getPublicRtpDashboard() {
  const db = await requireDatabase();
  const settledRounds = await db.select().from(gameRounds).where(and(eq(gameRounds.state, "settled"), inArray(gameRounds.gameType, VIRTUAL_LOTTERY_TYPES))).orderBy(desc(gameRounds.settledAt)).limit(40);
  const rounds: Array<{ publicId: string; gameType: string; rulesetVersion: string | null; ticketCount: number; creditsSpent: number; prizesPaid: number; theoreticalRtp: number | null; observedRtp: number | null }> = [];
  for (const round of settledRounds) {
    const tickets = await db.select().from(pilotTickets).where(and(eq(pilotTickets.roundId, round.id), eq(pilotTickets.status, "settled")));
    if (!tickets.length) continue;
    const ruleset = (await db.select().from(gameRulesets).where(eq(gameRulesets.id, round.rulesetId)).limit(1))[0];
    const variant = VIRTUAL_LOTTERY_VARIANTS[round.gameType as keyof typeof VIRTUAL_LOTTERY_VARIANTS];
    if (!variant || !ruleset) continue;
    const rules = JSON.parse(ruleset.rulesJson) as { numberRange?: number };
    const prizeTable = resolveLoteriaPrizeTable(ruleset.prizePolicyJson, ruleset.version, variant.prizeTable);
    const expectedBasePrize = Object.entries(prizeTable).reduce((total, [matches, prize]) => total + lotteryMatchProbability(rules.numberRange ?? variant.range, Number(matches)) * prize, 0);
    const creditsSpent = tickets.reduce((sum, ticket) => sum + ticket.virtualCost, 0);
    const prizesPaid = tickets.reduce((sum, ticket) => sum + ticket.virtualPrizeAmount, 0);
    const expectedPayout = tickets.reduce((sum, ticket) => sum + (ticket.extraPick ? lotteryExtraExpectedPrize({ range: rules.numberRange ?? variant.range, prizeTable }).totalExpectedPrize : expectedBasePrize) * ticket.quantity, 0);
    rounds.push({ publicId: round.publicId, gameType: round.gameType, rulesetVersion: ruleset?.version ?? null, ticketCount: tickets.length, creditsSpent, prizesPaid, theoreticalRtp: creditsSpent ? expectedPayout / creditsSpent : null, observedRtp: creditsSpent ? prizesPaid / creditsSpent : null });
  }
  return { generatedAt: new Date().toISOString(), virtualOnly: true, rounds };
}

export async function getRoundProof(publicId: string, dbOverride?: any) {
  const db = dbOverride ?? await requireDatabase();
  const rows = await db.select().from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1);
  const round = rows[0];
  if (!round) return null;
  const rulesetRows = await db.select().from(gameRulesets).where(eq(gameRulesets.id, round.rulesetId)).limit(1);
  const ruleset = rulesetRows[0];
  return {
    publicId: round.publicId,
    gameType: round.gameType,
    state: round.state,
    ruleset: ruleset ? { version: ruleset.version, rules: JSON.parse(ruleset.rulesJson), prizes: JSON.parse(ruleset.prizePolicyJson) } : null,
    serverSeedHash: round.serverSeedHash,
    revealedServerSeed: round.revealedServerSeed,
    publicSeed: round.publicSeed,
    ticketSetHash: round.ticketSetHash,
    result: round.resultJson ? JSON.parse(round.resultJson) : null,
    algorithmVersion: round.algorithmVersion,
    closesAt: round.closesAt,
    drawnAt: round.drawnAt,
  };
}

async function getOrCreateWallet(userId: number, dbOverride?: any) {
  const db = dbOverride ?? await requireDatabase();
  const current = await db.select().from(virtualWallets).where(eq(virtualWallets.userId, userId)).limit(1);
  if (current[0]) return current[0];
  await db.insert(virtualWallets).values({ userId, balance: WELCOME_BONUS, welcomeBonusClaimed: true });
  const wallet = (await db.select().from(virtualWallets).where(eq(virtualWallets.userId, userId)).limit(1))[0];
  await db.insert(walletTransactions).values({
    publicId: makePublicId("WAL"),
    userId,
    type: "welcome_bonus",
    amount: WELCOME_BONUS,
    balanceAfter: WELCOME_BONUS,
    idempotencyKey: `welcome:${userId}`,
    description: "Bonificación de bienvenida del piloto",
    metadataJson: JSON.stringify({ pilotOnly: true }),
  });
  await appendAuditEvent({ actorUserId: userId, eventType: "wallet.welcome_bonus", entityType: "wallet", entityPublicId: String(userId), payload: { amount: WELCOME_BONUS } }, db);
  return wallet;
}

async function getOrCreatePlayerSettings(userId: number) {
  const db = await requireDatabase();
  const current = await db.select().from(playerSettings).where(eq(playerSettings.userId, userId)).limit(1);
  if (current[0]) return current[0];
  await db.insert(playerSettings).values({ userId, countryCode: "PE", sessionLimitMinutes: 60, marketingEnabled: false });
  return (await db.select().from(playerSettings).where(eq(playerSettings.userId, userId)).limit(1))[0];
}

async function setMissionProgress(userId: number, code: string, progressCount: number) {
  const db = await requireDatabase();
  const mission = (await db.select().from(missions).where(eq(missions.code, code)).limit(1))[0];
  if (!mission) return;
  const existing = await db.select().from(playerMissionProgress).where(and(eq(playerMissionProgress.userId, userId), eq(playerMissionProgress.missionId, mission.id))).limit(1);
  const completedAt = progressCount >= mission.targetCount ? new Date() : null;
  if (existing[0]) {
    const nextProgress = Math.max(existing[0].progressCount, progressCount);
    await db.update(playerMissionProgress).set({ progressCount: nextProgress, completedAt: existing[0].completedAt ?? completedAt }).where(eq(playerMissionProgress.id, existing[0].id));
    return;
  }
  await db.insert(playerMissionProgress).values({ userId, missionId: mission.id, progressCount, completedAt });
}

async function updateTicketMissions(userId: number) {
  const db = await requireDatabase();
  const tickets = await db.select({ gameType: pilotTickets.gameType }).from(pilotTickets).where(and(eq(pilotTickets.userId, userId), eq(pilotTickets.status, "confirmed")));
  await setMissionProgress(userId, "FIRST_TICKET", tickets.length ? 1 : 0);
  await setMissionProgress(userId, "TWO_GAMES", Array.from(new Set(tickets.map((ticket) => ticket.gameType))).length);
}

async function awardStreakBonus(userId: number, ticketPublicId: string) {
  const db = await requireDatabase();
  const streakRule = (await db.select().from(promotionRules).where(and(eq(promotionRules.code, "racha_3"), eq(promotionRules.isActive, true))).limit(1))[0];
  if (!streakRule) return 0;
  const conditions = JSON.parse(streakRule.conditionsJson) as { every?: number; rewardCredits?: number };
  const every = conditions.every ?? 3;
  const tickets = await db.select({ id: pilotTickets.id }).from(pilotTickets).where(eq(pilotTickets.userId, userId));
  if (!tickets.length || tickets.length % every !== 0) return 0;
  const reward = conditions.rewardCredits ?? 70;
  const wallet = await getOrCreateWallet(userId);
  const nextBalance = wallet.balance + reward;
  await db.update(virtualWallets).set({ balance: nextBalance }).where(eq(virtualWallets.id, wallet.id));
  await db.insert(walletTransactions).values({ publicId: makePublicId("WAL"), userId, type: "promotion_bonus", amount: reward, balanceAfter: nextBalance, idempotencyKey: `streak:${ticketPublicId}`, description: `Bono virtual ${streakRule.label}`, metadataJson: JSON.stringify({ ticketPublicId, promotionCode: streakRule.code, pilotOnly: true }) });
  await appendAuditEvent({ actorUserId: userId, eventType: "promotion.streak_awarded", entityType: "ticket", entityPublicId: ticketPublicId, payload: { reward, promotionCode: streakRule.code } });
  return reward;
}

export async function getMissionSummary(userId: number) {
  const db = await requireDatabase();
  const active = await db.select().from(missions).where(eq(missions.isActive, true));
  for (const mission of active) {
    const progress = await db.select().from(playerMissionProgress).where(and(eq(playerMissionProgress.userId, userId), eq(playerMissionProgress.missionId, mission.id))).limit(1);
    if (!progress[0]) await db.insert(playerMissionProgress).values({ userId, missionId: mission.id });
  }
  const progressRows = await db.select().from(playerMissionProgress).where(eq(playerMissionProgress.userId, userId));
  return active.map((mission) => ({ ...mission, progress: progressRows.find((progress) => progress.missionId === mission.id) }));
}

export async function claimMissionReward(userId: number, code: string) {
  const db = await requireDatabase();
  const mission = (await db.select().from(missions).where(eq(missions.code, code)).limit(1))[0];
  if (!mission) throw new Error("No se encontró la misión.");
  const progress = (await db.select().from(playerMissionProgress).where(and(eq(playerMissionProgress.userId, userId), eq(playerMissionProgress.missionId, mission.id))).limit(1))[0];
  if (!progress || !progress.completedAt) throw new Error("La misión todavía no está completa.");
  if (progress.claimedAt) throw new Error("Esta recompensa ya fue reclamada.");
  const wallet = await getOrCreateWallet(userId);
  const nextBalance = wallet.balance + mission.rewardCredits;
  await db.update(virtualWallets).set({ balance: nextBalance }).where(eq(virtualWallets.id, wallet.id));
  await db.update(playerMissionProgress).set({ claimedAt: new Date() }).where(eq(playerMissionProgress.id, progress.id));
  await db.insert(walletTransactions).values({ publicId: makePublicId("WAL"), userId, type: "mission_reward", amount: mission.rewardCredits, balanceAfter: nextBalance, idempotencyKey: `mission:${userId}:${code}`, description: `Misión completada: ${mission.title}`, metadataJson: JSON.stringify({ missionCode: code, pilotOnly: true }) });
  await appendAuditEvent({ actorUserId: userId, eventType: "mission.claimed", entityType: "mission", entityPublicId: code, payload: { rewardCredits: mission.rewardCredits } });
  return { balance: nextBalance, reward: mission.rewardCredits, code };
}

export async function registerVerificationMission(userId: number) {
  await setMissionProgress(userId, "VERIFY_DRAW", 1);
  return getMissionSummary(userId);
}

export async function getWalletSummary(userId: number) {
  const db = await requireDatabase();
  const wallet = await getOrCreateWallet(userId);
  const settings = await getOrCreatePlayerSettings(userId);
  const transactions = await db.select().from(walletTransactions).where(eq(walletTransactions.userId, userId)).orderBy(desc(walletTransactions.createdAt)).limit(20);
  const missionSummary = await getMissionSummary(userId);
  return { wallet, transactions, settings, missionSummary, pilotOnly: true, withdrawalsEnabled: false };
}

export async function getPublicMarkets() {
  const db = await requireDatabase();
  return db.select().from(marketEvents).where(inArray(marketEvents.state, ["open", "closed", "settled", "voided"])).orderBy(desc(marketEvents.createdAt));
}

export async function getMarketSummary(userId: number) {
  const db = await requireDatabase();
  const [markets, positions] = await Promise.all([
    getPublicMarkets(),
    db.select().from(marketPositions).where(eq(marketPositions.userId, userId)).orderBy(desc(marketPositions.createdAt)),
  ]);
  return { markets, positions, pilotOnly: true, withdrawalsEnabled: false };
}

export function calculateMarketPayout(side: "yes" | "no", outcome: "yes" | "no", contracts: number, payoutCredits: number) {
  return side === outcome ? contracts * payoutCredits : 0;
}

export async function reserveMarketPosition(input: { userId: number; marketPublicId: string; side: "yes" | "no"; contracts: number; idempotencyKey: string }, dbOverride?: any) {
  const db = dbOverride ?? await requireDatabase();
  if (!Number.isInteger(input.contracts) || input.contracts < 1 || input.contracts > 10) throw new Error("La cantidad de contratos virtuales debe estar entre 1 y 10.");
  const market = (await db.select().from(marketEvents).where(eq(marketEvents.publicId, input.marketPublicId)).limit(1))[0];
  if (!market || market.state !== "open" || new Date(market.closesAt).getTime() <= Date.now()) throw new Error("Este mercado virtual no está abierto.");
  const settings = await getOrCreatePlayerSettings(input.userId);
  if (settings.voluntaryPauseUntil && settings.voluntaryPauseUntil.getTime() > Date.now()) throw new Error("Tu pausa voluntaria está activa.");
  const existing = (await db.select().from(marketPositions).where(eq(marketPositions.idempotencyKey, input.idempotencyKey)).limit(1))[0];
  if (existing) return { publicId: existing.publicId, virtualCost: existing.virtualCost, side: existing.side, contracts: existing.contracts, recovered: true };
  const unitCostCredits = input.side === "yes" ? market.yesPriceCredits : market.noPriceCredits;
  const virtualCost = unitCostCredits * input.contracts;
  const wallet = await getOrCreateWallet(input.userId, db);
  if (wallet.balance < virtualCost) throw new Error("No tienes créditos virtuales suficientes para esta posición.");
  const publicId = makeMarketPositionId();
  const nextBalance = wallet.balance - virtualCost;
  await db.update(virtualWallets).set({ balance: nextBalance }).where(eq(virtualWallets.id, wallet.id));
  await db.insert(marketPositions).values({ publicId, userId: input.userId, marketId: market.id, side: input.side, contracts: input.contracts, unitCostCredits, virtualCost, idempotencyKey: input.idempotencyKey });
  await db.insert(walletTransactions).values({ publicId: makePublicId("WAL"), userId: input.userId, type: "market_debit", amount: -virtualCost, balanceAfter: nextBalance, idempotencyKey: `market:${input.idempotencyKey}`, description: `Posición virtual ${input.side.toUpperCase()} en ${market.publicId}`, metadataJson: JSON.stringify({ marketPublicId: market.publicId, positionPublicId: publicId, pilotOnly: true }) });
  await appendAuditEvent({ actorUserId: input.userId, eventType: "market.position_opened", entityType: "market", entityPublicId: market.publicId, payload: { positionPublicId: publicId, side: input.side, contracts: input.contracts, virtualCost } }, db);
  return { publicId, virtualCost, side: input.side, contracts: input.contracts, balanceAfter: nextBalance, recovered: false };
}

type MarketBatchPreviewSelection = { side: "yes" | "no"; unitCostCredits: number; source: "manual" | "random" };

function signMarketBatchPreview(payload: { publicId: string; userId: number; marketPublicId: string; selectionsJson: string; selectionHash: string }) {
  return createHmac("sha256", process.env.JWT_SECRET ?? "sandbox-preview-signing-key").update(canonicalJson(payload)).digest("hex");
}

export async function previewMarketPositionBatch(input: { userId: number; marketPublicId: string; manual: Array<{ side: "yes" | "no"; copies: number }>; randomCount: number }) {
  const db = await requireDatabase();
  const market = (await db.select().from(marketEvents).where(eq(marketEvents.publicId, input.marketPublicId)).limit(1))[0];
  if (!market || market.state !== "open" || new Date(market.closesAt).getTime() <= Date.now()) throw new Error("Este mercado virtual no está abierto para previsualizar un lote.");
  const manualCount = input.manual.reduce((total, item) => total + item.copies, 0);
  if (!Number.isInteger(input.randomCount) || input.randomCount < 0 || input.randomCount > 10 || input.manual.some((item) => !Number.isInteger(item.copies) || item.copies < 1 || item.copies > 10) || manualCount + input.randomCount < 1 || manualCount + input.randomCount > 10) throw new Error("El lote de MultiMarket debe contener entre 1 y 10 posiciones virtuales.");
  const selections: MarketBatchPreviewSelection[] = [];
  for (const item of input.manual) for (let copy = 0; copy < item.copies; copy += 1) selections.push({ side: item.side, unitCostCredits: item.side === "yes" ? market.yesPriceCredits : market.noPriceCredits, source: "manual" });
  for (let index = 0; index < input.randomCount; index += 1) {
    const side = randomInt(2) === 0 ? "yes" : "no";
    selections.push({ side, unitCostCredits: side === "yes" ? market.yesPriceCredits : market.noPriceCredits, source: "random" });
  }
  const publicId = makePublicId("PRV-MKT");
  const selectionsJson = JSON.stringify(selections);
  const selectionHash = sha256(selectionsJson);
  const signature = signMarketBatchPreview({ publicId, userId: input.userId, marketPublicId: market.publicId, selectionsJson, selectionHash });
  const expiresAt = new Date(Date.now() + BATCH_PREVIEW_TTL_MS);
  await db.insert(marketBatchPreviews).values({ publicId, userId: input.userId, marketId: market.id, selectionsJson, selectionHash, signature, expiresAt });
  await appendAuditEvent({ actorUserId: input.userId, eventType: "market_batch.previewed", entityType: "market_batch_preview", entityPublicId: publicId, payload: { marketPublicId: market.publicId, selectionHash, signature, totalPositions: selections.length, expiresAt: expiresAt.toISOString(), randomPolicy: "side_yes_no_uniform", automaticPurchase: false, pilotOnly: true } });
  return { publicId, selectionHash, signature, expiresAt: expiresAt.toISOString(), selections, totalPositions: selections.length, estimatedCost: selections.reduce((total, item) => total + item.unitCostCredits, 0), pilotOnly: true };
}

export async function confirmMarketPositionBatchPreview(input: { userId: number; previewPublicId: string; idempotencyKey: string }) {
  const db = await requireDatabase();
  const preview = (await db.select().from(marketBatchPreviews).where(and(eq(marketBatchPreviews.publicId, input.previewPublicId), eq(marketBatchPreviews.userId, input.userId))).limit(1))[0];
  if (!preview || preview.confirmedAt || preview.expiresAt.getTime() <= Date.now()) throw new Error("La previsualización de MultiMarket no existe, ya fue usada o venció.");
  const market = (await db.select().from(marketEvents).where(eq(marketEvents.id, preview.marketId)).limit(1))[0];
  if (!market || market.state !== "open" || new Date(market.closesAt).getTime() <= Date.now()) throw new Error("El mercado de esta previsualización ya no está abierto.");
  const expectedSignature = signMarketBatchPreview({ publicId: preview.publicId, userId: preview.userId, marketPublicId: market.publicId, selectionsJson: preview.selectionsJson, selectionHash: preview.selectionHash });
  if (expectedSignature !== preview.signature || sha256(preview.selectionsJson) !== preview.selectionHash) throw new Error("La firma de la previsualización de MultiMarket no es válida.");
  const selections = JSON.parse(preview.selectionsJson) as MarketBatchPreviewSelection[];
  if (!Array.isArray(selections) || selections.length < 1 || selections.length > 10 || selections.some((item) => !["yes", "no"].includes(item.side) || !Number.isInteger(item.unitCostCredits) || item.unitCostCredits < 1)) throw new Error("La previsualización no contiene posiciones válidas.");
  if (selections.some((item) => item.unitCostCredits !== (item.side === "yes" ? market.yesPriceCredits : market.noPriceCredits))) throw new Error("La cotización virtual cambió desde la previsualización. Genera una nueva antes de confirmar.");
  const settings = await getOrCreatePlayerSettings(input.userId);
  if (settings.voluntaryPauseUntil && settings.voluntaryPauseUntil.getTime() > Date.now()) throw new Error("Tu pausa voluntaria está activa.");
  const expectedCost = selections.reduce((total, item) => total + item.unitCostCredits, 0);
  const batchPublicId = makePublicId("LOT-MKT");
  const result = await db.transaction(async (tx: any) => {
    const wallet = await getOrCreateWallet(input.userId, tx);
    if (wallet.balance < expectedCost) throw new Error("No tienes créditos virtuales suficientes para confirmar todo el lote.");
    const positions = [];
    for (let index = 0; index < selections.length; index += 1) positions.push(await reserveMarketPosition({ userId: input.userId, marketPublicId: market.publicId, side: selections[index].side, contracts: 1, idempotencyKey: `market-preview:${input.idempotencyKey}:${index}` }, tx));
    await tx.update(marketBatchPreviews).set({ confirmedAt: new Date() }).where(eq(marketBatchPreviews.id, preview.id));
    await appendAuditEvent({ actorUserId: input.userId, eventType: "market_batch.confirmed", entityType: "market_batch", entityPublicId: batchPublicId, payload: { marketPublicId: market.publicId, totalPositions: selections.length, manualPositions: selections.filter((item) => item.source === "manual").length, randomPositions: selections.filter((item) => item.source === "random").length, virtualCost: expectedCost, positionPublicIds: positions.map((position) => position.publicId), previewPublicId: preview.publicId, selectionHash: preview.selectionHash, signature: preview.signature, automaticPurchase: false, pilotOnly: true } }, tx);
    return { positions, balanceAfter: positions[positions.length - 1]?.balanceAfter ?? wallet.balance };
  });
  return { batchPublicId, totalPositions: selections.length, virtualCost: expectedCost, balanceAfter: result.balanceAfter, positions: result.positions, previewPublicId: preview.publicId, selectionHash: preview.selectionHash, signature: preview.signature, pilotOnly: true };
}

export async function getMyMarketBatches(userId: number) {
  const db = await requireDatabase();
  const events = await db.select().from(auditEvents).where(and(eq(auditEvents.actorUserId, userId), eq(auditEvents.eventType, "market_batch.confirmed"))).orderBy(desc(auditEvents.createdAt)).limit(100);
  const batches = [];
  for (const event of events) {
    const payload = JSON.parse(event.payloadJson) as { marketPublicId: string; totalPositions: number; virtualCost: number; previewPublicId?: string };
    const market = (await db.select().from(marketEvents).where(eq(marketEvents.publicId, payload.marketPublicId)).limit(1))[0];
    if (market) batches.push({ publicId: event.entityPublicId, createdAt: event.createdAt, marketPublicId: market.publicId, marketTitle: market.title, totalPositions: payload.totalPositions, virtualCost: payload.virtualCost, previewPublicId: payload.previewPublicId });
  }
  return { batches, virtualOnly: true, noRealMoney: true };
}

export async function getMarketBatchReceipt(userId: number, batchPublicId: string) {
  const db = await requireDatabase();
  const event = (await db.select().from(auditEvents).where(and(eq(auditEvents.actorUserId, userId), eq(auditEvents.eventType, "market_batch.confirmed"), eq(auditEvents.entityPublicId, batchPublicId))).limit(1))[0];
  if (!event) return null;
  const payload = JSON.parse(event.payloadJson) as { marketPublicId: string; positionPublicIds: string[]; virtualCost: number; totalPositions: number; previewPublicId?: string; selectionHash?: string; signature?: string };
  const positions = payload.positionPublicIds.length ? await db.select().from(marketPositions).where(inArray(marketPositions.publicId, payload.positionPublicIds)) : [];
  return { batchPublicId, createdAt: event.createdAt, ...payload, positions: positions.map((position) => ({ publicId: position.publicId, side: position.side, contracts: position.contracts, unitCostCredits: position.unitCostCredits, virtualCost: position.virtualCost, status: position.status })), virtualOnly: true, noRealMoney: true };
}

export async function createCuratedMarket(actorUserId: number, input: { title: string; description: string; category: string; sourceLabel: string; sourceUrl: string; resolutionRule: string; closesAt: Date }) {
  const db = await requireDatabase();
  if (!isAllowedMarketCategory(input.category)) throw new Error("La categoría de MultiMarket no está permitida en el piloto.");
  if (input.closesAt.getTime() <= Date.now()) throw new Error("El cierre del mercado debe estar en el futuro.");
  const publicId = makePublicId("MKT");
  await db.insert(marketEvents).values({ ...input, publicId, state: "open", yesPriceCredits: 1, noPriceCredits: 1, payoutCredits: 2, pilotOnly: true, createdByUserId: actorUserId });
  await appendAuditEvent({ actorUserId, eventType: "market.opened", entityType: "market", entityPublicId: publicId, payload: { ...input, unitCostCredits: 1, payoutCredits: 2, pilotOnly: true } });
  return (await db.select().from(marketEvents).where(eq(marketEvents.publicId, publicId)).limit(1))[0];
}

export async function closeCuratedMarket(actorUserId: number, marketPublicId: string) {
  const db = await requireDatabase();
  const market = (await db.select().from(marketEvents).where(eq(marketEvents.publicId, marketPublicId)).limit(1))[0];
  if (!market || market.state !== "open") throw new Error("El mercado no está disponible para cierre.");
  await db.update(marketEvents).set({ state: "closed", closesAt: new Date() }).where(eq(marketEvents.id, market.id));
  await appendAuditEvent({ actorUserId, eventType: "market.closed", entityType: "market", entityPublicId: market.publicId, payload: { closesAt: new Date().toISOString(), reason: "Cierre manual del operador" } });
  return { publicId: market.publicId, state: "closed" as const };
}

export async function resolveCuratedMarket(actorUserId: number, input: { marketPublicId: string; outcome: "yes" | "no"; resolutionUrl: string }) {
  const db = await requireDatabase();
  const market = (await db.select().from(marketEvents).where(eq(marketEvents.publicId, input.marketPublicId)).limit(1))[0];
  if (!market || !["open", "closed"].includes(market.state)) throw new Error("El mercado no está disponible para resolución.");
  const positions = await db.select().from(marketPositions).where(and(eq(marketPositions.marketId, market.id), eq(marketPositions.status, "active")));
  for (const position of positions) {
    const payout = calculateMarketPayout(position.side, input.outcome, position.contracts, market.payoutCredits);
    await db.update(marketPositions).set({ status: "settled", virtualPayout: payout, settledAt: new Date() }).where(eq(marketPositions.id, position.id));
    if (payout > 0) {
      const wallet = await getOrCreateWallet(position.userId);
      const nextBalance = wallet.balance + payout;
      await db.update(virtualWallets).set({ balance: nextBalance }).where(eq(virtualWallets.id, wallet.id));
      await db.insert(walletTransactions).values({ publicId: makePublicId("WAL"), userId: position.userId, type: "market_payout", amount: payout, balanceAfter: nextBalance, idempotencyKey: `market-payout:${position.publicId}`, description: `Liquidación virtual de ${market.publicId}`, metadataJson: JSON.stringify({ marketPublicId: market.publicId, outcome: input.outcome, positionPublicId: position.publicId, pilotOnly: true }) });
    }
  }
  await db.update(marketEvents).set({ state: "settled", outcome: input.outcome, resolutionUrl: input.resolutionUrl, resolvesAt: new Date() }).where(eq(marketEvents.id, market.id));
  await appendAuditEvent({ actorUserId, eventType: "market.settled", entityType: "market", entityPublicId: market.publicId, payload: { outcome: input.outcome, resolutionUrl: input.resolutionUrl, positionCount: positions.length } });
  return { publicId: market.publicId, outcome: input.outcome, positionsSettled: positions.length };
}

export async function voidCuratedMarket(actorUserId: number, input: { marketPublicId: string; resolutionUrl: string }) {
  const db = await requireDatabase();
  const market = (await db.select().from(marketEvents).where(eq(marketEvents.publicId, input.marketPublicId)).limit(1))[0];
  if (!market || !["draft", "open", "closed"].includes(market.state)) throw new Error("El mercado no está disponible para anulación.");
  const positions = await db.select().from(marketPositions).where(and(eq(marketPositions.marketId, market.id), eq(marketPositions.status, "active")));
  for (const position of positions) {
    const wallet = await getOrCreateWallet(position.userId);
    const nextBalance = wallet.balance + position.virtualCost;
    await db.update(virtualWallets).set({ balance: nextBalance }).where(eq(virtualWallets.id, wallet.id));
    await db.update(marketPositions).set({ status: "refunded", virtualPayout: position.virtualCost, settledAt: new Date() }).where(eq(marketPositions.id, position.id));
    await db.insert(walletTransactions).values({ publicId: makePublicId("WAL"), userId: position.userId, type: "market_refund", amount: position.virtualCost, balanceAfter: nextBalance, idempotencyKey: `market-refund:${position.publicId}`, description: `Reembolso virtual por anulación de ${market.publicId}`, metadataJson: JSON.stringify({ marketPublicId: market.publicId, positionPublicId: position.publicId, pilotOnly: true }) });
  }
  await db.update(marketEvents).set({ state: "voided", resolutionUrl: input.resolutionUrl, resolvesAt: new Date() }).where(eq(marketEvents.id, market.id));
  await appendAuditEvent({ actorUserId, eventType: "market.voided", entityType: "market", entityPublicId: market.publicId, payload: { resolutionUrl: input.resolutionUrl, positionsRefunded: positions.length } });
  return { publicId: market.publicId, positionsRefunded: positions.length };
}

export async function getSocialImpactSummary() {
  const db = await requireDatabase();
  return db.select().from(socialImpactCycles).orderBy(desc(socialImpactCycles.createdAt));
}

export async function updateResponsibleSettings(userId: number, input: { sessionLimitMinutes: number; pauseHours: number; countryCode: string }) {
  const db = await requireDatabase();
  const settings = await getOrCreatePlayerSettings(userId);
  const voluntaryPauseUntil = input.pauseHours > 0 ? new Date(Date.now() + input.pauseHours * 60 * 60 * 1000) : null;
  await db.update(playerSettings).set({ sessionLimitMinutes: input.sessionLimitMinutes, countryCode: input.countryCode, voluntaryPauseUntil }).where(eq(playerSettings.id, settings.id));
  await appendAuditEvent({ actorUserId: userId, eventType: "player_settings.updated", entityType: "player_settings", entityPublicId: String(userId), payload: { sessionLimitMinutes: input.sessionLimitMinutes, pauseHours: input.pauseHours, countryCode: input.countryCode } });
  return (await db.select().from(playerSettings).where(eq(playerSettings.id, settings.id)).limit(1))[0];
}

export async function claimDailyReward(userId: number) {
  const db = await requireDatabase();
  const wallet = await getOrCreateWallet(userId);
  const now = new Date();
  const lastClaim = wallet.lastDailyRewardAt?.getTime() ?? 0;
  if (lastClaim && now.getTime() - lastClaim < 24 * 60 * 60 * 1000) throw new Error("La recompensa diaria ya fue reclamada. Intenta nuevamente después de 24 horas.");
  const nextBalance = wallet.balance + DAILY_REWARD;
  await db.update(virtualWallets).set({ balance: nextBalance, lastDailyRewardAt: now }).where(eq(virtualWallets.id, wallet.id));
  await db.insert(walletTransactions).values({
    publicId: makePublicId("WAL"),
    userId,
    type: "daily_reward",
    amount: DAILY_REWARD,
    balanceAfter: nextBalance,
    idempotencyKey: `daily:${userId}:${now.toISOString().slice(0, 10)}`,
    description: "Recompensa diaria del piloto",
    metadataJson: JSON.stringify({ pilotOnly: true }),
  });
  await appendAuditEvent({ actorUserId: userId, eventType: "wallet.daily_reward", entityType: "wallet", entityPublicId: String(userId), payload: { amount: DAILY_REWARD, balanceAfter: nextBalance } });
  return { balance: nextBalance, reward: DAILY_REWARD };
}

export async function reservePilotTicket(input: { userId: number; roundPublicId: string; picks: number[]; quantity: number; idempotencyKey: string; planPublicId?: string; extraPick?: number; bonusBallCount?: number; batchPublicId?: string; benefitOverride?: { tier: string; discount: number; multiplier: number }; virtualCostOverride?: number }) {
  const db = await requireDatabase();
  const roundRows = await db.select().from(gameRounds).where(eq(gameRounds.publicId, input.roundPublicId)).limit(1);
  const round = roundRows[0];
  if (!round || round.state !== "open") throw new Error("La ronda no está disponible para participar.");
  if (new Date(round.closesAt).getTime() <= Date.now()) throw new Error("La participación está cerrada para esta ronda.");
  const config = GAME_CONFIG[round.gameType];
  const settings = await getOrCreatePlayerSettings(input.userId);
  if (settings.voluntaryPauseUntil && settings.voluntaryPauseUntil.getTime() > Date.now()) throw new Error("Tu pausa voluntaria está activa. La participación se reanudará cuando finalice el periodo seleccionado.");
  const uniquePicks = isSimplifiedGameType(round.gameType) ? validateSimplifiedPicks(round.gameType, input.picks) : isPositionalPickGame(round.gameType) ? [...input.picks] : Array.from(new Set(input.picks)).sort((left, right) => left - right);
  if (!isSimplifiedGameType(round.gameType) && (uniquePicks.length !== config.pickLimit || uniquePicks.some((value) => !Number.isInteger(value) || value < (round.gameType === "ruleta" || isPositionalPickGame(round.gameType) ? 0 : 1) || value > (isPositionalPickGame(round.gameType) ? 9 : config.range)))) throw new Error("La selección no cumple las reglas de esta modalidad.");
  if (input.extraPick !== undefined && round.gameType !== "loteria_39") throw new Error("MJP Extra solo está disponible para Lotería 39.");
  if (round.gameType === "loteria_39" && input.extraPick !== undefined && (!Number.isInteger(input.extraPick) || input.extraPick < 1 || input.extraPick > config.range || uniquePicks.includes(input.extraPick))) throw new Error("El número MJP Extra debe ser distinto de los seis números principales y estar entre 1 y 39.");
  const bonusBallCount = input.bonusBallCount ?? 0;
  if (!Number.isInteger(bonusBallCount) || bonusBallCount < 0) throw new Error("La cantidad de bolas de consuelo no es válida.");
  if (bonusBallCount > 0 && !isConsolationLotteryGameType(round.gameType)) throw new Error("Las bolas de consuelo solo están disponibles en la nueva familia Lot 19–59.");
  if (isConsolationLotteryGameType(round.gameType) && bonusBallCount > 0 && !getLotteryBonusBallPack(VIRTUAL_LOTTERY_VARIANTS[round.gameType], bonusBallCount)) throw new Error("El paquete de bolas de consuelo elegido no existe para esta lotería.");
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 10) throw new Error("La cantidad de boletos debe estar entre 1 y 10.");
  const existingDebit = await db.select().from(walletTransactions).where(eq(walletTransactions.idempotencyKey, `ticket:${input.idempotencyKey}`)).limit(1);
  if (existingDebit[0]) {
    const metadata = existingDebit[0].metadataJson ? JSON.parse(existingDebit[0].metadataJson) as { ticketPublicId?: string; ticketHash?: string; benefit?: ReturnType<typeof getBenefit> } : {};
    return {
      publicId: metadata.ticketPublicId ?? "TKT-RECUPERADO",
      virtualCost: Math.abs(existingDebit[0].amount),
      balanceAfter: existingDebit[0].balanceAfter,
      ticketHash: metadata.ticketHash ?? "",
      benefit: metadata.benefit ?? getBenefit(input.quantity),
    };
  }
  let assistedPlan: typeof virtualPlanEnrollments.$inferSelect | undefined;
  let benefit = input.benefitOverride ?? await benefitForGameBatch(round.gameType, input.quantity);
  if (input.planPublicId) {
    const plans = await db.select().from(virtualPlanEnrollments).where(and(eq(virtualPlanEnrollments.publicId, input.planPublicId), eq(virtualPlanEnrollments.userId, input.userId))).limit(1);
    assistedPlan = plans[0];
    if (!assistedPlan || assistedPlan.status !== "active") throw new Error("El plan virtual no está activo.");
    if (assistedPlan.expiresAt.getTime() <= Date.now()) throw new Error("El plan virtual ha vencido.");
    if (assistedPlan.remainingConfirmations < input.quantity) throw new Error("El plan no tiene confirmaciones virtuales disponibles.");
    if (assistedPlan.gameType !== round.gameType || assistedPlan.picksJson !== JSON.stringify(uniquePicks)) throw new Error("La ronda o selección no coincide con el plan virtual.");
    const definition = getAssistedPlanDefinition(assistedPlan.planCode);
    if (!definition) throw new Error("La configuración del plan virtual no es válida.");
    benefit = round.gameType === "loteria_39" ? { tier: `plan-${definition.code}`, discount: definition.discountPercent, multiplier: 1 } : { tier: `plan-${definition.code}-tarifa-uniforme`, discount: 0, multiplier: 1 };
  }
  const extraCost = input.extraPick !== undefined ? MJP_EXTRA_39.extraCostCredits * input.quantity : 0;
  const consolationExtraCost = bonusBallCount > 0 ? bonusBallExtraCost(round.gameType, bonusBallCount) * input.quantity : 0;
  const virtualCost = input.virtualCostOverride ?? Math.round(config.price * input.quantity * (1 - benefit.discount / 100)) + extraCost + consolationExtraCost;
  const wallet = await getOrCreateWallet(input.userId);
  if (wallet.balance < virtualCost) throw new Error("No tienes suficientes créditos virtuales para esta participación.");
  const nextBalance = wallet.balance - virtualCost;
  const ticketPublicId = makeHumanTicketId(round.gameType);
  const ticketHash = sha256(canonicalJson({ ticketPublicId, roundPublicId: round.publicId, picks: uniquePicks, extraPick: input.extraPick, bonusBallCount, quantity: input.quantity, virtualCost, benefit, planPublicId: input.planPublicId, batchPublicId: input.batchPublicId }));
  await db.update(virtualWallets).set({ balance: nextBalance }).where(eq(virtualWallets.id, wallet.id));
  await db.insert(pilotTickets).values({
    publicId: ticketPublicId,
    userId: input.userId,
    roundId: round.id,
    gameType: round.gameType,
    picksJson: JSON.stringify(uniquePicks),
    extraPick: input.extraPick,
    bonusBallCount,
    quantity: input.quantity,
    virtualCost,
    benefitTier: benefit.tier,
    status: "confirmed",
    ticketHash,
  });
  await db.insert(walletTransactions).values({
    publicId: makePublicId("WAL"),
    userId: input.userId,
    type: "ticket_debit",
    amount: -virtualCost,
    balanceAfter: nextBalance,
    idempotencyKey: `ticket:${input.idempotencyKey}`,
    description: `Boleto ficticio ${ticketPublicId}`,
    metadataJson: JSON.stringify({ roundPublicId: round.publicId, ticketPublicId, ticketHash, benefit, planPublicId: input.planPublicId, extraPick: input.extraPick, extraCost, bonusBallCount, consolationExtraCost, batchPublicId: input.batchPublicId, pilotOnly: true }),
  });
  if (assistedPlan) {
    const remainingConfirmations = assistedPlan.remainingConfirmations - input.quantity;
    await db.update(virtualPlanEnrollments).set({ remainingConfirmations, status: remainingConfirmations === 0 ? "expired" : "active" }).where(eq(virtualPlanEnrollments.id, assistedPlan.id));
    await appendAuditEvent({ actorUserId: input.userId, eventType: "virtual_plan.confirmed_ticket", entityType: "virtual_plan", entityPublicId: assistedPlan.publicId, payload: { ticketPublicId, roundPublicId: round.publicId, remainingConfirmations, explicitConfirmation: true, automaticPurchase: false } });
  }
  if (round.gameType === "jackpot") {
    const roundRuleset = (await db.select().from(gameRulesets).where(eq(gameRulesets.id, round.rulesetId)).limit(1))[0];
    if (!resolveNonLotteryPrizePolicy(roundRuleset?.prizePolicyJson).jackpotPrizeTable) await db.update(gameRounds).set({ jackpotPoolCredits: round.jackpotPoolCredits + Math.round(virtualCost * 0.35) }).where(eq(gameRounds.id, round.id));
  }
  await updateTicketMissions(input.userId);
  const streakBonus = await awardStreakBonus(input.userId, ticketPublicId);
  const finalWallet = await getOrCreateWallet(input.userId);
  await appendAuditEvent({ actorUserId: input.userId, eventType: "ticket.confirmed", entityType: "ticket", entityPublicId: ticketPublicId, payload: { roundPublicId: round.publicId, ticketHash, virtualCost, benefit, planPublicId: input.planPublicId, extraPick: input.extraPick, bonusBallCount, mjpExtra: input.extraPick !== undefined, batchPublicId: input.batchPublicId } });
  return { publicId: ticketPublicId, virtualCost, balanceAfter: finalWallet.balance, ticketHash, benefit, streakBonus, bonusBallCount };
}

function serverRandomPicks(range: number, count: number, startAt = 1) {
  const pool = Array.from({ length: range }, (_, index) => index + startAt);
  const picks: number[] = [];
  while (picks.length < count) picks.push(pool.splice(randomInt(pool.length), 1)[0]);
  return picks.sort((left, right) => left - right);
}

function serverRandomPicksForGame(gameType: GameType, range: number, count: number, startAt = 1) {
  if (isSimplifiedGameType(gameType)) return randomSimplifiedPicks(gameType, (upperExclusive) => randomInt(upperExclusive));
  return serverRandomPicks(range, count, startAt);
}

type BatchPreviewSelection = { picks: number[]; extraPick?: number; bonusBallCount?: number; planPublicId?: string; source: "manual" | "random" };

function signBatchPreview(payload: { publicId: string; userId: number; roundPublicId: string; selectionsJson: string; selectionHash: string; expiresAt: string }) {
  const signedPayload = { publicId: payload.publicId, userId: payload.userId, roundPublicId: payload.roundPublicId, selectionsJson: payload.selectionsJson, selectionHash: payload.selectionHash };
  return createHmac("sha256", process.env.JWT_SECRET ?? "sandbox-preview-signing-key").update(canonicalJson(signedPayload)).digest("hex");
}

export async function previewPilotTicketBatch(input: { userId: number; roundPublicId: string; manual: Array<{ picks: number[]; copies: number; extraPick?: number; bonusBallCount?: number; planPublicId?: string }>; randomCount: number; randomMjpExtra: boolean; randomBonusBallCount?: number }) {
  const db = await requireDatabase();
  const round = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, input.roundPublicId)).limit(1))[0];
  if (!round || round.state !== "open" || new Date(round.closesAt).getTime() <= Date.now()) throw new Error("La ronda no está disponible para previsualizar un lote.");
  const config = GAME_CONFIG[round.gameType];
  const manualCount = input.manual.reduce((total, item) => total + item.copies, 0);
  if (!Number.isInteger(input.randomCount) || input.randomCount < 0 || input.randomCount > 10 || input.manual.some((item) => !Number.isInteger(item.copies) || item.copies < 1 || item.copies > 10) || manualCount + input.randomCount < 1 || manualCount + input.randomCount > 10) throw new Error("El lote debe tener entre 1 y 10 boletos virtuales.");
  if (input.randomMjpExtra && round.gameType !== "loteria_39") throw new Error("MJP Extra aleatorio solo está disponible para Lotería 39.");
  const randomBonusBallCount = input.randomBonusBallCount ?? 0;
  if (!Number.isInteger(randomBonusBallCount) || randomBonusBallCount < 0 || (randomBonusBallCount > 0 && (!isConsolationLotteryGameType(round.gameType) || !getLotteryBonusBallPack(VIRTUAL_LOTTERY_VARIANTS[round.gameType], randomBonusBallCount)))) throw new Error("El paquete aleatorio de bolas de consuelo no es válido.");
  const selections: BatchPreviewSelection[] = [];
  for (const item of input.manual) {
    const picks = isSimplifiedGameType(round.gameType) ? validateSimplifiedPicks(round.gameType, item.picks) : isPositionalPickGame(round.gameType) ? [...item.picks] : Array.from(new Set(item.picks)).sort((left, right) => left - right);
    const minimum = round.gameType === "ruleta" || isPositionalPickGame(round.gameType) ? 0 : 1;
    const maximum = isPositionalPickGame(round.gameType) ? 9 : config.range;
    if (!isSimplifiedGameType(round.gameType) && (picks.length !== config.pickLimit || picks.some((value) => !Number.isInteger(value) || value < minimum || value > maximum))) throw new Error("Una selección manual del lote no cumple las reglas de esta modalidad.");
    if (item.extraPick !== undefined && (round.gameType !== "loteria_39" || !Number.isInteger(item.extraPick) || item.extraPick < 1 || item.extraPick > config.range || picks.includes(item.extraPick))) throw new Error("El número MJP Extra del lote no es válido.");
    const bonusBallCount = item.bonusBallCount ?? 0;
    if (!Number.isInteger(bonusBallCount) || bonusBallCount < 0 || (bonusBallCount > 0 && (!isConsolationLotteryGameType(round.gameType) || !getLotteryBonusBallPack(VIRTUAL_LOTTERY_VARIANTS[round.gameType], bonusBallCount)))) throw new Error("El paquete manual de bolas de consuelo no es válido.");
    for (let copy = 0; copy < item.copies; copy += 1) selections.push({ picks, extraPick: item.extraPick, bonusBallCount, planPublicId: item.planPublicId, source: "manual" });
  }
  for (let index = 0; index < input.randomCount; index += 1) {
    const picks = serverRandomPicksForGame(round.gameType, config.range, config.pickLimit, round.gameType === "ruleta" ? 0 : 1);
    const extraPool = Array.from({ length: config.range }, (_, value) => value + 1).filter((value) => !picks.includes(value));
    selections.push({ picks, extraPick: input.randomMjpExtra ? extraPool[randomInt(extraPool.length)] : undefined, bonusBallCount: randomBonusBallCount, source: "random" });
  }
  const publicId = makePublicId("PRV");
  const selectionsJson = JSON.stringify(selections);
  const selectionHash = sha256(selectionsJson);
  const expiresAt = new Date(Date.now() + BATCH_PREVIEW_TTL_MS);
  const signature = signBatchPreview({ publicId, userId: input.userId, roundPublicId: round.publicId, selectionsJson, selectionHash, expiresAt: expiresAt.toISOString() });
  await db.insert(gameBatchPreviews).values({ publicId, userId: input.userId, roundId: round.id, gameType: round.gameType, selectionsJson, selectionHash, signature, expiresAt });
  await appendAuditEvent({ actorUserId: input.userId, eventType: "ticket_batch.previewed", entityType: "ticket_batch_preview", entityPublicId: publicId, payload: { roundPublicId: round.publicId, selectionHash, signature, totalTickets: selections.length, expiresAt: expiresAt.toISOString(), automaticPurchase: false } });
  return { publicId, selectionHash, signature, expiresAt: expiresAt.toISOString(), selections, totalTickets: selections.length };
}

export async function confirmPilotTicketBatchPreview(input: { userId: number; previewPublicId: string; idempotencyKey: string }) {
  const db = await requireDatabase();
  const preview = (await db.select().from(gameBatchPreviews).where(and(eq(gameBatchPreviews.publicId, input.previewPublicId), eq(gameBatchPreviews.userId, input.userId))).limit(1))[0];
  if (!preview || preview.confirmedAt || preview.expiresAt.getTime() <= Date.now()) throw new Error("La previsualización no existe, ya fue usada o venció. Genera una nueva.");
  const round = (await db.select().from(gameRounds).where(eq(gameRounds.id, preview.roundId)).limit(1))[0];
  if (!round || round.state !== "open" || new Date(round.closesAt).getTime() <= Date.now()) throw new Error("La ronda de la previsualización ya no está disponible.");
  const expectedSignature = signBatchPreview({ publicId: preview.publicId, userId: preview.userId, roundPublicId: round.publicId, selectionsJson: preview.selectionsJson, selectionHash: preview.selectionHash, expiresAt: preview.expiresAt.toISOString() });
  if (expectedSignature !== preview.signature || sha256(preview.selectionsJson) !== preview.selectionHash) throw new Error("La firma de la previsualización no es válida.");
  const selections = JSON.parse(preview.selectionsJson) as BatchPreviewSelection[];
  if (!Array.isArray(selections) || selections.length < 1 || selections.length > 10) throw new Error("La previsualización no contiene una cantidad válida de boletos.");
  const benefit = await benefitForGameBatch(round.gameType, selections.length);
  const config = GAME_CONFIG[round.gameType];
  const batchPublicId = makePublicId("LOT");
  const discountedBaseCost = Math.round(config.price * selections.length * (1 - benefit.discount / 100));
  const perTicketBaseCost = Math.floor(discountedBaseCost / selections.length);
  const remainder = discountedBaseCost % selections.length;
  const expectedTotalCost = selections.reduce((total, item, index) => total + perTicketBaseCost + (index < remainder ? 1 : 0) + (item.extraPick ? MJP_EXTRA_39.extraCostCredits : 0) + (item.bonusBallCount ? bonusBallExtraCost(round.gameType, item.bonusBallCount) : 0), 0);
  const wallet = await getOrCreateWallet(input.userId);
  if (wallet.balance < expectedTotalCost) throw new Error("No tienes créditos virtuales suficientes para confirmar todo el lote.");
  const tickets = [];
  for (let index = 0; index < selections.length; index += 1) {
    const item = selections[index];
    const virtualCostOverride = perTicketBaseCost + (index < remainder ? 1 : 0) + (item.extraPick ? MJP_EXTRA_39.extraCostCredits : 0) + (item.bonusBallCount ? bonusBallExtraCost(round.gameType, item.bonusBallCount) : 0);
    tickets.push(await reservePilotTicket({ userId: input.userId, roundPublicId: round.publicId, picks: item.picks, extraPick: item.extraPick, bonusBallCount: item.bonusBallCount, planPublicId: item.planPublicId, quantity: 1, idempotencyKey: `preview:${input.idempotencyKey}:${index}`, batchPublicId, benefitOverride: benefit, virtualCostOverride }));
  }
  const virtualCost = tickets.reduce((total, ticket) => total + ticket.virtualCost, 0);
  await db.update(gameBatchPreviews).set({ confirmedAt: new Date() }).where(eq(gameBatchPreviews.id, preview.id));
  await appendAuditEvent({ actorUserId: input.userId, eventType: "ticket_batch.confirmed", entityType: "ticket_batch", entityPublicId: batchPublicId, payload: { roundPublicId: round.publicId, totalTickets: selections.length, manualTickets: selections.filter((item) => item.source === "manual").length, randomTickets: selections.filter((item) => item.source === "random").length, virtualCost, benefit, ticketPublicIds: tickets.map((ticket) => ticket.publicId), previewPublicId: preview.publicId, selectionHash: preview.selectionHash, signature: preview.signature, automaticPurchase: false } });
  return { batchPublicId, totalTickets: selections.length, virtualCost, balanceAfter: tickets[tickets.length - 1]?.balanceAfter ?? null, benefit, tickets, previewPublicId: preview.publicId, selectionHash: preview.selectionHash, signature: preview.signature };
}

export async function reservePilotTicketBatch(input: { userId: number; roundPublicId: string; manual: Array<{ picks: number[]; copies: number; extraPick?: number; planPublicId?: string }>; randomCount: number; randomMjpExtra: boolean; idempotencyKey: string }) {
  const db = await requireDatabase();
  const round = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, input.roundPublicId)).limit(1))[0];
  if (!round || round.state !== "open" || new Date(round.closesAt).getTime() <= Date.now()) throw new Error("La ronda no está disponible para reservar un lote.");
  const config = GAME_CONFIG[round.gameType];
  if (!Number.isInteger(input.randomCount) || input.randomCount < 0 || input.randomCount > 10) throw new Error("La cantidad aleatoria debe estar entre 0 y 10.");
  const manualCount = input.manual.reduce((total, item) => total + item.copies, 0);
  if (!input.manual.length && input.randomCount === 0) throw new Error("Incluye al menos un boleto manual o aleatorio en el lote.");
  if (input.manual.some((item) => !Number.isInteger(item.copies) || item.copies < 1 || item.copies > 10) || manualCount + input.randomCount > 10) throw new Error("El lote admite un máximo de 10 boletos virtuales.");
  if (input.randomMjpExtra && round.gameType !== "loteria_39") throw new Error("MJP Extra aleatorio solo está disponible para Lotería 39.");
  const batchPublicId = makePublicId("LOT");
  const totalTickets = manualCount + input.randomCount;
  const benefit = await benefitForGameBatch(round.gameType, totalTickets);
  const units: Array<{ picks: number[]; extraPick?: number; planPublicId?: string; source: "manual" | "random" }> = [];
  for (const item of input.manual) for (let copy = 0; copy < item.copies; copy += 1) units.push({ picks: item.picks, extraPick: item.extraPick, planPublicId: item.planPublicId, source: "manual" });
  for (let index = 0; index < input.randomCount; index += 1) {
    const picks = serverRandomPicksForGame(round.gameType, config.range, config.pickLimit, round.gameType === "ruleta" ? 0 : 1);
    const extraPool = Array.from({ length: config.range }, (_, number) => number + 1).filter((number) => !picks.includes(number));
    units.push({ picks, extraPick: input.randomMjpExtra ? extraPool[randomInt(extraPool.length)] : undefined, source: "random" });
  }
  const tickets = [];
  const discountedBaseCost = Math.round(config.price * totalTickets * (1 - benefit.discount / 100));
  const perTicketBaseCost = Math.floor(discountedBaseCost / totalTickets);
  const remainder = discountedBaseCost % totalTickets;
  for (let index = 0; index < units.length; index += 1) {
    const unit = units[index];
    const virtualCostOverride = perTicketBaseCost + (index < remainder ? 1 : 0) + (unit.extraPick ? MJP_EXTRA_39.extraCostCredits : 0);
    tickets.push(await reservePilotTicket({ userId: input.userId, roundPublicId: input.roundPublicId, picks: unit.picks, extraPick: unit.extraPick, planPublicId: unit.planPublicId, quantity: 1, idempotencyKey: `batch:${input.idempotencyKey}:${index}`, batchPublicId, benefitOverride: benefit, virtualCostOverride }));
  }
  const virtualCost = tickets.reduce((total, ticket) => total + ticket.virtualCost, 0);
  await appendAuditEvent({ actorUserId: input.userId, eventType: "ticket_batch.confirmed", entityType: "ticket_batch", entityPublicId: batchPublicId, payload: { roundPublicId: input.roundPublicId, totalTickets, manualTickets: manualCount, randomTickets: input.randomCount, randomMjpExtra: input.randomMjpExtra, virtualCost, benefit, ticketPublicIds: tickets.map((ticket) => ticket.publicId), automaticPurchase: false } });
  return { batchPublicId, totalTickets, virtualCost, balanceAfter: tickets[tickets.length - 1]?.balanceAfter ?? null, benefit, tickets };
}

export async function getMyTicketBatches(userId: number, filter?: { gameType?: string }) {
  const db = await requireDatabase();
  const events = await db.select().from(auditEvents).where(and(eq(auditEvents.actorUserId, userId), eq(auditEvents.eventType, "ticket_batch.confirmed"))).orderBy(desc(auditEvents.createdAt)).limit(100);
  const batches: Array<{ publicId: string; createdAt: Date; gameType: string; roundPublicId: string; totalTickets: number; virtualCost: number; previewPublicId?: string }> = [];
  for (const event of events) {
    const payload = JSON.parse(event.payloadJson) as { roundPublicId: string; totalTickets: number; virtualCost: number; previewPublicId?: string };
    const round = (await db.select().from(gameRounds).where(eq(gameRounds.publicId, payload.roundPublicId)).limit(1))[0];
    if (!round || (filter?.gameType && round.gameType !== filter.gameType)) continue;
    batches.push({ publicId: event.entityPublicId, createdAt: event.createdAt, gameType: round.gameType, roundPublicId: payload.roundPublicId, totalTickets: payload.totalTickets, virtualCost: payload.virtualCost, previewPublicId: payload.previewPublicId });
  }
  return { batches, virtualOnly: true };
}

export async function getTicketBatchReceipt(userId: number, batchPublicId: string) {
  const db = await requireDatabase();
  const event = (await db.select().from(auditEvents).where(and(eq(auditEvents.actorUserId, userId), eq(auditEvents.eventType, "ticket_batch.confirmed"), eq(auditEvents.entityPublicId, batchPublicId))).limit(1))[0];
  if (!event) return null;
  const payload = JSON.parse(event.payloadJson) as { roundPublicId: string; ticketPublicIds: string[]; virtualCost: number; totalTickets: number; previewPublicId?: string; selectionHash?: string; signature?: string };
  const tickets = payload.ticketPublicIds.length ? await db.select().from(pilotTickets).where(inArray(pilotTickets.publicId, payload.ticketPublicIds)) : [];
  return { batchPublicId, createdAt: event.createdAt, ...payload, tickets: tickets.map((ticket) => ({ publicId: ticket.publicId, gameType: ticket.gameType, picks: JSON.parse(ticket.picksJson), extraPick: ticket.extraPick, virtualCost: ticket.virtualCost, ticketHash: ticket.ticketHash, status: ticket.status })), virtualOnly: true, noRealMoney: true };
}

export async function listAssistedPlanDefinitions() {
  return { plans: ASSISTED_PLAN_DEFINITIONS, disclosure: ASSISTED_PLAN_DISCLOSURE, virtualOnly: true, automaticPurchase: false };
}

export async function getMyAssistedPlans(userId: number) {
  const db = await requireDatabase();
  const now = new Date();
  const plans = await db.select().from(virtualPlanEnrollments).where(eq(virtualPlanEnrollments.userId, userId)).orderBy(desc(virtualPlanEnrollments.createdAt));
  return plans.map((plan) => ({
    ...plan,
    status: plan.status === "active" && plan.expiresAt.getTime() <= now.getTime() ? "expired" as const : plan.status,
    definition: getAssistedPlanDefinition(plan.planCode),
    disclosure: ASSISTED_PLAN_DISCLOSURE,
  }));
}

export async function enrollAssistedPlan(input: { userId: number; planCode: string; gameType: GameType; picks: number[] }) {
  if (!isAssistedPlanGameType(input.gameType)) throw new Error("Los planes asistidos solo están disponibles para las loterías virtuales 29, 39, 49 y 59.");
  const definition = getAssistedPlanDefinition(input.planCode);
  if (!definition) throw new Error("El plan virtual seleccionado no existe.");
  const config = GAME_CONFIG[input.gameType];
  const picks = Array.from(new Set(input.picks)).sort((left, right) => left - right);
  if (picks.length !== config.pickLimit || picks.some((value) => value < 1 || value > config.range)) throw new Error("La selección no cumple las reglas de la lotería elegida.");
  const db = await requireDatabase();
  const publicId = makePublicId("PLN");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + definition.durationWeeks * 7 * 24 * 60 * 60 * 1000);
  await db.insert(virtualPlanEnrollments).values({ publicId, userId: input.userId, gameType: input.gameType, planCode: definition.code, picksJson: JSON.stringify(picks), remainingConfirmations: definition.confirmationsIncluded, status: "active", consentedAt: now, expiresAt });
  await appendAuditEvent({ actorUserId: input.userId, eventType: "virtual_plan.enrolled", entityType: "virtual_plan", entityPublicId: publicId, payload: { planCode: definition.code, gameType: input.gameType, picks, discountPercent: definition.discountPercent, automaticPurchase: false, consentRequiredPerTicket: true } });
  return { publicId, plan: definition, picks, remainingConfirmations: definition.confirmationsIncluded, expiresAt, disclosure: ASSISTED_PLAN_DISCLOSURE };
}

export async function updateAssistedPlanStatus(input: { userId: number; publicId: string; action: "pause" | "resume" | "cancel" }) {
  const db = await requireDatabase();
  const rows = await db.select().from(virtualPlanEnrollments).where(and(eq(virtualPlanEnrollments.publicId, input.publicId), eq(virtualPlanEnrollments.userId, input.userId))).limit(1);
  const plan = rows[0];
  if (!plan) throw new Error("No se encontró el plan virtual.");
  const status = input.action === "pause" ? "paused" : input.action === "resume" ? "active" : "cancelled" as const;
  if (input.action === "resume" && plan.expiresAt.getTime() <= Date.now()) throw new Error("No se puede reanudar un plan vencido.");
  if (input.action === "pause" && plan.status !== "active") throw new Error("Solo se pueden pausar planes activos.");
  if (input.action === "resume" && plan.status !== "paused") throw new Error("Solo se pueden reanudar planes pausados.");
  if (input.action === "cancel" && !["active", "paused"].includes(plan.status)) throw new Error("Este plan no se puede cancelar.");
  await db.update(virtualPlanEnrollments).set({ status, cancelledAt: input.action === "cancel" ? new Date() : null }).where(eq(virtualPlanEnrollments.id, plan.id));
  await appendAuditEvent({ actorUserId: input.userId, eventType: `virtual_plan.${input.action}`, entityType: "virtual_plan", entityPublicId: plan.publicId, payload: { automaticPurchase: false, refund: 0, reason: "No hay créditos cobrados por adelantado; cada boleto requiere confirmación." } });
  return { publicId: plan.publicId, status, disclosure: ASSISTED_PLAN_DISCLOSURE };
}

export function resolveBingoCartillaPrize(prizePolicyJson?: string, rulesetVersion?: string) {
  if (prizePolicyJson) {
    try {
      const policy = JSON.parse(prizePolicyJson) as { bingoCartillaPrize?: unknown };
      if (Number.isInteger(policy.bingoCartillaPrize) && Number(policy.bingoCartillaPrize) >= 0) return Number(policy.bingoCartillaPrize);
    } catch {
      // La regla histórica se conserva mediante la versión si el JSON no es legible.
    }
  }
  return rulesetVersion === "v1.0.0" ? 450 : 82;
}

export function resolveLoteriaPrizeTable(prizePolicyJson?: string, rulesetVersion?: string, fallbackTable: LotteryPrizeTable = LOTERIA_PRIZE_TABLE_V101) {
  if (prizePolicyJson) {
    try {
      const policy = JSON.parse(prizePolicyJson) as { loteriaPrizeTable?: Record<string, unknown> };
      const table = policy.loteriaPrizeTable;
      if (table && Object.keys(table).length > 0 && Object.entries(table).every(([key, value]) => Number.isInteger(Number(key)) && Number(key) >= 0 && Number.isInteger(value) && Number(value) >= 0)) {
        return Object.fromEntries(Object.entries(table).map(([key, value]) => [Number(key), Number(value)]));
      }
    } catch {
      // La versión histórica se conserva si la política no puede leerse.
    }
  }
  return rulesetVersion === "v1.0.0" && fallbackTable === LOTERIA_PRIZE_TABLE_V101 ? LOTERIA_PRIZE_TABLE_V100 : fallbackTable;
}

export function resolveLotteryBonusBallPacks(prizePolicyJson?: string, fallbackPacks: readonly LotteryBonusBallPack[] = []): readonly LotteryBonusBallPack[] {
  if (!prizePolicyJson) return fallbackPacks;
  try {
    const policy = JSON.parse(prizePolicyJson) as { bonusBallPacks?: unknown };
    if (!Array.isArray(policy.bonusBallPacks)) return fallbackPacks;
    const packs = policy.bonusBallPacks.filter((value): value is LotteryBonusBallPack => Boolean(value && typeof value === "object" && Number.isInteger((value as LotteryBonusBallPack).count) && Number.isInteger((value as LotteryBonusBallPack).totalCostCredits) && Number.isInteger((value as LotteryBonusBallPack).consolationPrize) && (value as LotteryBonusBallPack).count > 0 && (value as LotteryBonusBallPack).totalCostCredits > 0 && (value as LotteryBonusBallPack).consolationPrize >= 0 && typeof (value as LotteryBonusBallPack).prizeTable === "object"));
    return packs.length === policy.bonusBallPacks.length ? packs : fallbackPacks;
  } catch {
    return fallbackPacks;
  }
}

type NonLotteryPrizePolicy = {
  ruletaExactPrize?: number;
  jackpotPrizeTable?: Record<number, number>;
  jackpotConsolationPrize?: number;
  trio13PrizeTable?: Record<number, number>;
  sueldoVidaPrizeTable?: Record<number, number>;
  raspaDigitalPrizeTable?: Record<number, number>;
  pick3PrizeTable?: Record<number, number>;
  pick4PrizeTable?: Record<number, number>;
  lotoDiarioPrizeTable?: Record<number, number>;
  lotoExpressPrizeTable?: Record<number, number>;
};

export function resolveNonLotteryPrizePolicy(prizePolicyJson?: string): NonLotteryPrizePolicy {
  if (!prizePolicyJson) return {};
  try {
    const policy = JSON.parse(prizePolicyJson) as NonLotteryPrizePolicy;
    const validTable = (table: unknown) => Boolean(table && typeof table === "object" && Object.values(table as Record<string, unknown>).every((value) => Number.isInteger(value) && Number(value) >= 0));
    return {
      ruletaExactPrize: Number.isInteger(policy.ruletaExactPrize) && Number(policy.ruletaExactPrize) >= 0 ? policy.ruletaExactPrize : undefined,
      jackpotPrizeTable: validTable(policy.jackpotPrizeTable) ? Object.fromEntries(Object.entries(policy.jackpotPrizeTable!).map(([key, value]) => [Number(key), Number(value)])) : undefined,
      jackpotConsolationPrize: Number.isInteger(policy.jackpotConsolationPrize) && Number(policy.jackpotConsolationPrize) >= 0 ? policy.jackpotConsolationPrize : undefined,
      trio13PrizeTable: validTable(policy.trio13PrizeTable) ? Object.fromEntries(Object.entries(policy.trio13PrizeTable!).map(([key, value]) => [Number(key), Number(value)])) : undefined,
      sueldoVidaPrizeTable: validTable(policy.sueldoVidaPrizeTable) ? Object.fromEntries(Object.entries(policy.sueldoVidaPrizeTable!).map(([key, value]) => [Number(key), Number(value)])) : undefined,
      raspaDigitalPrizeTable: validTable(policy.raspaDigitalPrizeTable) ? Object.fromEntries(Object.entries(policy.raspaDigitalPrizeTable!).map(([key, value]) => [Number(key), Number(value)])) : undefined,
      pick3PrizeTable: validTable(policy.pick3PrizeTable) ? Object.fromEntries(Object.entries(policy.pick3PrizeTable!).map(([key, value]) => [Number(key), Number(value)])) : undefined,
      pick4PrizeTable: validTable(policy.pick4PrizeTable) ? Object.fromEntries(Object.entries(policy.pick4PrizeTable!).map(([key, value]) => [Number(key), Number(value)])) : undefined,
      lotoDiarioPrizeTable: validTable(policy.lotoDiarioPrizeTable) ? Object.fromEntries(Object.entries(policy.lotoDiarioPrizeTable!).map(([key, value]) => [Number(key), Number(value)])) : undefined,
      lotoExpressPrizeTable: validTable(policy.lotoExpressPrizeTable) ? Object.fromEntries(Object.entries(policy.lotoExpressPrizeTable!).map(([key, value]) => [Number(key), Number(value)])) : undefined,
    };
  } catch {
    return {};
  }
}

export function calculateTicketPrize(gameType: GameType, picks: number[], result: Record<string, unknown>, quantity: number, jackpotShare: number, bingoCartillaPrize = 82, loteriaPrizeTable: Record<number, number> = LOTERIA_PRIZE_TABLE_V101, extraPick?: number | null, nonLotteryPolicy: NonLotteryPrizePolicy = {}, bonusBallCount = 0, bonusBallPacks: readonly LotteryBonusBallPack[] = []) {
  if (isSimplifiedRouletteGameType(gameType)) {
    const outcome = getSimplifiedRouletteOutcome(SIMPLIFIED_ROULETTE_CONFIG[gameType].pockets, Number(result.number));
    return rouletteBetWins(picks[0], outcome) ? SIMPLIFIED_ROULETTE_CONFIG[gameType].totalPayout * quantity : 0;
  }
  if (isSimplifiedBingoGameType(gameType)) return calculateSimplifiedBingoPrize(gameType, picks, (result.calls as number[]) ?? []) * quantity;
  if (gameType === "ruleta") return picks[0] === result.number ? (nonLotteryPolicy.ruletaExactPrize ?? 360) * quantity : 0;
  if (gameType === "jackpot") {
    const positions = (result.positions as number[]) ?? [];
    const matches = picks.filter((pick) => positions.includes(pick)).length;
    if (nonLotteryPolicy.jackpotPrizeTable) {
      const consolation = matches === 2 && picks.includes(Number(result.extraPosition)) ? nonLotteryPolicy.jackpotConsolationPrize ?? 0 : 0;
      return ((nonLotteryPolicy.jackpotPrizeTable[matches] ?? 0) + consolation) * quantity;
    }
    if (matches === 5) return jackpotShare;
    if (matches === 4) return 1200 * quantity;
    if (matches === 3) return 240 * quantity;
    return 0;
  }
  if (gameType === "bingo") return picks[0] === result.winningCartilla ? bingoCartillaPrize * quantity : 0;
  if (gameType === "cartas") {
    const cards = (result.cards as number[]) ?? [];
    const matches = picks.filter((pick) => cards.includes(pick)).length;
    if (nonLotteryPolicy.trio13PrizeTable) return (nonLotteryPolicy.trio13PrizeTable[matches] ?? 0) * quantity;
    if (matches === 3) return 700 * quantity;
    if (matches === 2) return 37 * quantity;
    if (matches === 1) return 5 * quantity;
    return 0;
  }
  if (gameType === "raspa_digital") return picks[0] === Number(result.winningPosition) ? (nonLotteryPolicy.raspaDigitalPrizeTable?.[1] ?? 17) * quantity : 0;
  if (isPositionalPickGame(gameType)) {
    const digits = (result.digits as number[]) ?? [];
    const matches = picks.reduce((total, pick, index) => total + (digits[index] === pick ? 1 : 0), 0);
    const table = gameType === "pick_3" ? nonLotteryPolicy.pick3PrizeTable : nonLotteryPolicy.pick4PrizeTable;
    return (table?.[matches] ?? 0) * quantity;
  }
  if (gameType === "sueldo_vida") {
    const numbers = (result.numbers as number[]) ?? [];
    const matches = picks.filter((pick) => numbers.includes(pick)).length;
    return (nonLotteryPolicy.sueldoVidaPrizeTable?.[matches] ?? 0) * quantity;
  }
  if (gameType === "loto_diario" || gameType === "loto_express") {
    const numbers = (result.numbers as number[]) ?? [];
    const matches = picks.filter((pick) => numbers.includes(pick)).length;
    const table = gameType === "loto_diario" ? nonLotteryPolicy.lotoDiarioPrizeTable : nonLotteryPolicy.lotoExpressPrizeTable;
    return (table?.[matches] ?? 0) * quantity;
  }
  const numbers = (result.numbers as number[]) ?? [];
  const matches = picks.filter((pick) => numbers.includes(pick)).length;
  const bonusPack = bonusBallCount > 0 ? bonusBallPacks.find((pack) => pack.count === bonusBallCount) : undefined;
  if (isConsolationLotteryGameType(gameType) && bonusPack) {
    const bonusNumbers = (result.bonusNumbers as number[]) ?? [];
    const consolationApplied = bonusNumbers.slice(0, bonusBallCount).some((number) => picks.includes(number) && !numbers.includes(number));
    return ((bonusPack.prizeTable[matches] ?? 0) + (consolationApplied ? bonusPack.consolationPrize : 0)) * quantity;
  }
  const prize = (loteriaPrizeTable[matches] ?? 0) * quantity;
  if (gameType === "loteria_39" && extraPick && Number(result.extraNumber) === extraPick && MJP_EXTRA_39.eligibleMatches.includes(matches as 2 | 3 | 4 | 5)) return prize * MJP_EXTRA_39.multiplier;
  return prize;
}

async function closeAndDrawRoundInTransaction(actorUserId: number | undefined, publicId: string, db: any, testOptions?: { resultOverride?: Record<string, unknown> }) {
  const rows = await db.select().from(gameRounds).where(eq(gameRounds.publicId, publicId)).limit(1);
  const round = rows[0];
  if (!round) throw new Error("No se encontró la ronda.");
  if (round.state === "settled") return getRoundProof(round.publicId, db);
  if (!["open", "locked"].includes(round.state)) throw new Error("La ronda no está disponible para cierre y sorteo.");
  if (round.state === "open") assertRoundTransition(round.state, "locked");
  assertRoundTransition("locked", "drawn");
  assertRoundTransition("drawn", "settled");
  const tickets = await db.select().from(pilotTickets).where(and(eq(pilotTickets.roundId, round.id), eq(pilotTickets.status, "confirmed"))).orderBy(pilotTickets.publicId);
  const ticketSetHash = sha256(canonicalJson(tickets.map((ticket: { publicId: string; ticketHash: string }) => ({ publicId: ticket.publicId, ticketHash: ticket.ticketHash }))));
  const publicSeed = `PILOT:${round.publicId}:${ticketSetHash.slice(0, 16)}`;
  const isInternalTest = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
  if (testOptions?.resultOverride && !isInternalTest) throw new Error("La anulación de resultado está disponible únicamente en pruebas internas.");
  const calculatedResult = calculateResult(round.gameType, round.serverSeedSecret, publicSeed, round.publicId);
  const result: Record<string, unknown> = testOptions?.resultOverride ?? calculatedResult;
  const ruleRows = await db.select().from(gameRulesets).where(eq(gameRulesets.id, round.rulesetId)).limit(1);
  const ruleset = ruleRows[0];
  const bingoCartillaPrize = round.gameType === "bingo" ? resolveBingoCartillaPrize(ruleset?.prizePolicyJson, ruleset?.version) : 82;
  const loteriaFallback = isLotteryGameType(round.gameType) ? lotteryPrizeTableFor(round.gameType) : LOTERIA_PRIZE_TABLE_V101;
  const loteriaPrizeTable = isLotteryGameType(round.gameType) ? resolveLoteriaPrizeTable(ruleset?.prizePolicyJson, ruleset?.version, loteriaFallback) : LOTERIA_PRIZE_TABLE_V101;
  const bonusBallPacks = isConsolationLotteryGameType(round.gameType) ? resolveLotteryBonusBallPacks(ruleset?.prizePolicyJson, lotteryBonusBallPacksFor(round.gameType)) : [];
  const nonLotteryPolicy = resolveNonLotteryPrizePolicy(ruleset?.prizePolicyJson);
  const now = new Date();
  const jackpotWinners = round.gameType === "jackpot" && !nonLotteryPolicy.jackpotPrizeTable ? tickets.filter((ticket: { picksJson: string }) => JSON.parse(ticket.picksJson).filter((pick: number) => (result.positions as number[]).includes(pick)).length === 5) : [];
  const jackpotShare = jackpotWinners.length ? Math.floor(round.jackpotPoolCredits / jackpotWinners.length) : 0;
  for (const ticket of tickets) {
    const ticketPicks = JSON.parse(ticket.picksJson) as number[];
    const rawPrize = calculateTicketPrize(round.gameType, ticketPicks, result, ticket.quantity, jackpotShare, bingoCartillaPrize, loteriaPrizeTable, ticket.extraPick, nonLotteryPolicy, ticket.bonusBallCount, bonusBallPacks);
    const prize = roundVirtualPrize(rawPrize);
    const selectedPack = ticket.bonusBallCount > 0 ? bonusBallPacks.find((pack) => pack.count === ticket.bonusBallCount) : undefined;
    const consolationApplied = Boolean(selectedPack && ((result.bonusNumbers as number[]) ?? []).slice(0, ticket.bonusBallCount).some((number) => ticketPicks.includes(number) && !(result.numbers as number[]).includes(number)));
    await db.update(pilotTickets).set({ status: "settled", virtualPrizeAmount: prize, resultJson: JSON.stringify({ result, rawPrize, prize, roundingPolicy: "[0,0.4)=>0; [0.4,∞)=>ceil", extraPick: ticket.extraPick, bonusBallCount: ticket.bonusBallCount, consolationApplied, mjpExtraApplied: round.gameType === "loteria_39" && ticket.extraPick !== null && Number(result.extraNumber) === ticket.extraPick }) }).where(eq(pilotTickets.id, ticket.id));
    const createsLifetimeAward = round.gameType === "sueldo_vida" && prize === (nonLotteryPolicy.sueldoVidaPrizeTable?.[4] ?? 21_600);
    if (createsLifetimeAward) {
      const installments = 24;
      const installmentCredits = prize / installments;
      await db.insert(virtualAwardInstallments).values({
        publicId: makePublicId("RNT"),
        userId: ticket.userId,
        ticketId: ticket.id,
        roundId: round.id,
        totalInstallments: installments,
        installmentCredits,
        nextPaymentAt: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        status: "active",
      });
      await appendAuditEvent({ actorUserId, eventType: "virtual_award.created", entityType: "virtual_award", entityPublicId: ticket.publicId, payload: { roundPublicId: round.publicId, totalCredits: prize, totalInstallments: installments, installmentCredits, pilotOnly: true, noCashValue: true } }, db);
    } else if (prize > 0) {
      const wallet = await getOrCreateWallet(ticket.userId, db);
      const nextBalance = wallet.balance + prize;
      await db.update(virtualWallets).set({ balance: nextBalance }).where(eq(virtualWallets.id, wallet.id));
      await db.insert(walletTransactions).values({ publicId: makePublicId("WAL"), userId: ticket.userId, type: "virtual_prize", amount: prize, balanceAfter: nextBalance, idempotencyKey: `prize:${ticket.publicId}`, description: `Premio virtual de ${round.publicId}`, metadataJson: JSON.stringify({ roundPublicId: round.publicId, ticketPublicId: ticket.publicId, pilotOnly: true }) });
      await appendAuditEvent({ actorUserId, eventType: "ticket.prize_settled", entityType: "ticket", entityPublicId: ticket.publicId, payload: { prize, roundPublicId: round.publicId } }, db);
    }
  }
  await db.update(gameRounds).set({ state: "settled", ticketSetHash, publicSeed, revealedServerSeed: round.serverSeedSecret, resultJson: JSON.stringify(result), lockedAt: round.lockedAt ?? now, drawnAt: now, settledAt: now }).where(eq(gameRounds.id, round.id));
  await appendAuditEvent({ actorUserId, eventType: "round.drawn", entityType: "round", entityPublicId: round.publicId, payload: { ticketSetHash, publicSeed, result, algorithmVersion: ALGORITHM_VERSION } }, db);
  return getRoundProof(round.publicId, db);
}

/**
 * Cierra y liquida una ronda bajo un único claim transaccional.
 * El bloqueo de fila hace que dos workers concurrentes no puedan calcular
 * premios ni insertar movimientos de billetera al mismo tiempo.
 */
export async function closeAndDrawRound(actorUserId: number | undefined, publicId: string, dbOverride?: any, testOptions?: { resultOverride?: Record<string, unknown> }) {
  const db = dbOverride ?? await requireDatabase();
  if (typeof db.transaction !== "function") return closeAndDrawRoundInTransaction(actorUserId, publicId, db, testOptions);
  return db.transaction(async (tx: any) => {
    const claim = await tx.execute(sql`SELECT id FROM game_rounds WHERE publicId = ${publicId} FOR UPDATE`);
    const claimRows = Array.isArray(claim) ? claim[0] : claim?.rows;
    if (!claimRows?.length) throw new Error("No se encontró la ronda.");
    return closeAndDrawRoundInTransaction(actorUserId, publicId, tx, testOptions);
  });
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export async function settleDueVirtualAwardInstallments(actorUserId?: number, dbOverride?: any, now = new Date()) {
  const db = dbOverride ?? await requireDatabase();
  const due = await db.select().from(virtualAwardInstallments).where(eq(virtualAwardInstallments.status, "active"));
  const settled: Array<{ publicId: string; installment: number }> = [];
  for (const award of due.filter((item: { nextPaymentAt: Date }) => item.nextPaymentAt.getTime() <= now.getTime())) {
    const installment = award.installmentsPaid + 1;
    const idempotencyKey = `award-installment:${award.publicId}:${installment}`;
    await db.transaction(async (tx: any) => {
      const existing = (await tx.select().from(walletTransactions).where(eq(walletTransactions.idempotencyKey, idempotencyKey)).limit(1))[0];
      if (existing) return;
      const wallet = await getOrCreateWallet(award.userId, tx);
      const nextBalance = wallet.balance + award.installmentCredits;
      await tx.update(virtualWallets).set({ balance: nextBalance }).where(eq(virtualWallets.id, wallet.id));
      await tx.insert(walletTransactions).values({ publicId: makePublicId("WAL"), userId: award.userId, type: "virtual_prize", amount: award.installmentCredits, balanceAfter: nextBalance, idempotencyKey, description: `Cuota virtual ${installment}/${award.totalInstallments} de ${award.publicId}`, metadataJson: JSON.stringify({ virtualAwardPublicId: award.publicId, installment, pilotOnly: true, noCashValue: true }) });
      const complete = installment >= award.totalInstallments;
      await tx.update(virtualAwardInstallments).set({ installmentsPaid: installment, nextPaymentAt: complete ? award.nextPaymentAt : addMonths(award.nextPaymentAt, 1), status: complete ? "completed" : "active", completedAt: complete ? now : null }).where(eq(virtualAwardInstallments.id, award.id));
      await appendAuditEvent({ actorUserId, eventType: "virtual_award.installment_settled", entityType: "virtual_award", entityPublicId: award.publicId, payload: { installment, installmentCredits: award.installmentCredits, totalInstallments: award.totalInstallments, pilotOnly: true, noCashValue: true } }, tx);
      settled.push({ publicId: award.publicId, installment });
    });
  }
  return { settled, processedAt: now.toISOString(), pilotOnly: true };
}

export async function runScheduledGameCycle(input: { taskUid: string; actorUserId?: number; now?: Date }, dbOverride?: any) {
  const db = dbOverride ?? await requireDatabase();
  const now = input.now ?? new Date();
  const schedule = (await db.select().from(gameSchedules).where(eq(gameSchedules.scheduleCronTaskUid, input.taskUid)).limit(1))[0];
  if (!schedule) return { ok: true, skipped: "orphan" as const };
  if (!schedule.isEnabled) return { ok: true, skipped: "disabled" as const, gameType: schedule.gameType };
  if (!GAME_TYPES.includes(schedule.gameType as GameType) || !isScheduledGameType(schedule.gameType as GameType)) throw new Error("La configuración programada no corresponde a una modalidad habilitada.");
  const gameType = schedule.gameType as ScheduledGameType;
  const candidates = await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), inArray(gameRounds.state, ["open", "locked"])));
  const closedRounds: string[] = [];
  for (const round of candidates.filter((round: { closesAt: Date }) => round.closesAt.getTime() <= now.getTime())) {
    await closeAndDrawRound(input.actorUserId, round.publicId, db);
    closedRounds.push(round.publicId);
  }
  const currentOpen = (await db.select().from(gameRounds).where(and(eq(gameRounds.gameType, gameType), eq(gameRounds.state, "open"))).limit(1))[0];
  let openedRoundPublicId = currentOpen?.publicId ?? null;
  if (!currentOpen) {
    const ruleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, gameType), eq(gameRulesets.isPublished, true))).orderBy(desc(gameRulesets.createdAt)).limit(1))[0];
    if (!ruleset) throw new Error("No existe una regla publicada para la modalidad programada.");
    const secret = randomBytes(32).toString("hex");
    openedRoundPublicId = `RP-${gameType.slice(0, 3).toUpperCase()}-${nanoid(8).toUpperCase()}`;
    await db.insert(gameRounds).values({ publicId: openedRoundPublicId, gameType, rulesetId: ruleset.id, state: "open", opensAt: now, closesAt: nextScheduledCloseAt(gameType, now), serverSeedHash: sha256(secret), serverSeedSecret: secret, jackpotPoolCredits: 0, algorithmVersion: ALGORITHM_VERSION, createdByUserId: input.actorUserId });
    await appendAuditEvent({ actorUserId: input.actorUserId, eventType: "round.opened", entityType: "round", entityPublicId: openedRoundPublicId, payload: { gameType, scheduled: true, ruleset: ruleset.version, closesAt: nextScheduledCloseAt(gameType, now).toISOString(), pilotOnly: true } }, db);
  }
  const awardResult = await settleDueVirtualAwardInstallments(input.actorUserId, db, now);
  await db.update(gameSchedules).set({ lastRunAt: now, lastRoundPublicId: openedRoundPublicId }).where(eq(gameSchedules.id, schedule.id));
  await appendAuditEvent({ actorUserId: input.actorUserId, eventType: "game_schedule.ran", entityType: "game_schedule", entityPublicId: gameType, payload: { taskUid: input.taskUid, closedRounds, openedRoundPublicId, virtualAwardsSettled: awardResult.settled.length, pilotOnly: true } }, db);
  return { ok: true, gameType, closedRounds, openedRoundPublicId, virtualAwardsSettled: awardResult.settled.length, pilotOnly: true };
}

export async function getScheduledGameOverview() {
  const db = await requireDatabase();
  const schedules = await db.select().from(gameSchedules).orderBy(gameSchedules.gameType);
  return schedules.map((schedule) => ({ ...schedule, definition: SCHEDULED_GAME_DEFINITIONS[schedule.gameType as ScheduledGameType] ?? null, pilotOnly: true, activationRequiresPublish: true }));
}

export async function enableScheduledGame(input: { actorUserId: number; gameType: ScheduledGameType; taskUid: string }) {
  const db = await requireDatabase();
  const schedule = (await db.select().from(gameSchedules).where(eq(gameSchedules.gameType, input.gameType)).limit(1))[0];
  if (!schedule) throw new Error("Primero prepara las reglas y el horario de la modalidad desde el panel de operación.");
  await db.update(gameSchedules).set({ scheduleCronTaskUid: input.taskUid, isEnabled: true }).where(eq(gameSchedules.id, schedule.id));
  await appendAuditEvent({ actorUserId: input.actorUserId, eventType: "game_schedule.enabled", entityType: "game_schedule", entityPublicId: input.gameType, payload: { taskUid: input.taskUid, cronExpression: schedule.cronExpression, pilotOnly: true, noRealMoney: true } });
  return { gameType: input.gameType, taskUid: input.taskUid, cronExpression: schedule.cronExpression, enabled: true, pilotOnly: true };
}

export async function getOperationsOverview() {
  const db = await requireDatabase();
  const rounds = await db.select().from(gameRounds).orderBy(desc(gameRounds.createdAt)).limit(20);
  const tickets = await db.select().from(pilotTickets).orderBy(desc(pilotTickets.createdAt)).limit(50);
  const events = await db.select().from(auditEvents).orderBy(desc(auditEvents.createdAt)).limit(30);
  const promotions = await db.select().from(promotionRules).orderBy(desc(promotionRules.createdAt));
  const bingoRuleset = (await db.select().from(gameRulesets).where(and(eq(gameRulesets.gameType, "bingo"), eq(gameRulesets.version, "v1.0.1"))).limit(1))[0];
  const activeBingoRounds = rounds.filter(round => round.gameType === "bingo" && ["draft", "open", "locked"].includes(round.state));
  return { rounds: rounds.map(({ serverSeedSecret: _secret, ...round }) => round), ticketCount: tickets.length, auditEvents: events, marketAuditEvents: events.filter((event) => event.entityType === "market"), promotions, payments: { provider: "yape", enabled: false, countryCode: "PE" }, bingoRecalibration: { published: Boolean(bingoRuleset), version: bingoRuleset?.version ?? null, activeRoundPublicId: activeBingoRounds.find(round => round.rulesetId === bingoRuleset?.id)?.publicId ?? null, bingoCartillaPrize: bingoRuleset ? 82 : null } };
}

export async function updatePromotionStatus(actorUserId: number, code: string, isActive: boolean) {
  const db = await requireDatabase();
  const promotion = (await db.select().from(promotionRules).where(eq(promotionRules.code, code)).limit(1))[0];
  if (!promotion) throw new Error("No se encontró la promoción.");
  await db.update(promotionRules).set({ isActive }).where(eq(promotionRules.id, promotion.id));
  await appendAuditEvent({ actorUserId, eventType: "promotion.updated", entityType: "promotion", entityPublicId: code, payload: { isActive } });
  return { code, isActive };
}

export async function publishRulesetRevision(actorUserId: number, gameType: GameType) {
  const db = await requireDatabase();
  const latest = (await db.select().from(gameRulesets).where(eq(gameRulesets.gameType, gameType)).orderBy(desc(gameRulesets.createdAt)).limit(1))[0];
  if (!latest) throw new Error("Primero prepara las reglas iniciales del piloto.");
  const parts = latest.version.replace("v", "").split(".").map(Number);
  const nextVersion = `v${parts[0] ?? 1}.${parts[1] ?? 0}.${(parts[2] ?? 0) + 1}`;
  const rules = { ...JSON.parse(latest.rulesJson), revisionNote: "Revisión publicada desde el panel de operador", publishedAt: new Date().toISOString() };
  await db.insert(gameRulesets).values({ gameType, version: nextVersion, title: latest.title, rulesJson: JSON.stringify(rules), prizePolicyJson: latest.prizePolicyJson, isPublished: true, createdByUserId: actorUserId });
  await appendAuditEvent({ actorUserId, eventType: "ruleset.published", entityType: "ruleset", entityPublicId: `${gameType}:${nextVersion}`, payload: { priorVersion: latest.version, nextVersion } });
  return { gameType, version: nextVersion };
}

export async function createDisabledYapeReference(userId: number, virtualAmount: number, idempotencyKey: string) {
  const db = await requireDatabase();
  const existing = await db.select().from(paymentReferences).where(eq(paymentReferences.idempotencyKey, idempotencyKey)).limit(1);
  if (existing[0]) return existing[0];
  const publicId = makePublicId("PAY");
  await db.insert(paymentReferences).values({ publicId, userId, virtualAmount, idempotencyKey, status: "disabled", metadataJson: JSON.stringify({ reason: "Piloto gratuito: integración de pagos desactivada", pilotOnly: true }) });
  await appendAuditEvent({ actorUserId: userId, eventType: "payment_reference.disabled", entityType: "payment_reference", entityPublicId: publicId, payload: { provider: "yape", enabled: false } });
  return { publicId, provider: "yape", status: "disabled" as const };
}
