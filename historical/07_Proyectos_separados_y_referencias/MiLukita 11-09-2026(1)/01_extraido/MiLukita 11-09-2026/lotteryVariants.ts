import { roundVirtualPrize } from "./virtualPrizeRounding";

export const VIRTUAL_LOTTERY_TYPES = [
  "loteria_29",
  "loteria_39",
  "loteria_39_5",
  "loteria_49",
  "loteria_59",
  "loteria_19",
] as const;

export type VirtualLotteryGameType = (typeof VIRTUAL_LOTTERY_TYPES)[number];
export type LotteryPrizeTable = Readonly<Record<number, number>>;

export type LotteryBonusBallPack = {
  count: number;
  totalCostCredits: number;
  prizeTable: LotteryPrizeTable;
  consolationPrize: number;
  targetRtp: number;
};

export type VirtualLotteryVariant = {
  title: string;
  range: number;
  pickCount: number;
  priceCredits: number;
  prizeTable: LotteryPrizeTable;
  targetRtp: number;
  bonusBallPacks?: readonly LotteryBonusBallPack[];
};

/** Las cinco loterías autorizadas del piloto: Lotería 19 y Loterías 29, 39, 49 y 59. */
export const VIRTUAL_LOTTERY_VARIANTS: Record<VirtualLotteryGameType, VirtualLotteryVariant> = {
  loteria_29: { title: "Lotería 29", range: 29, pickCount: 6, priceCredits: 1, prizeTable: { 6: 7_000, 5: 320, 4: 46, 3: 6 }, targetRtp: 0.9225927329 },
  loteria_39: { title: "Lotería 39 MJP", range: 39, pickCount: 6, priceCredits: 1, prizeTable: { 6: 50_000, 5: 1_167, 4: 108, 3: 10, 2: 1 }, targetRtp: 0.8709023384 },
  loteria_39_5: { title: "Lotería 39 · 5/39", range: 39, pickCount: 5, priceCredits: 1, prizeTable: { 5: 27_000, 4: 300, 3: 20, 2: 5 }, targetRtp: 0.8500113763 },
  loteria_49: { title: "Lotería 49", range: 49, pickCount: 6, priceCredits: 1, prizeTable: { 6: 200_000, 5: 2_500, 4: 160, 3: 21, 2: 2 }, targetRtp: 0.8508206916 },
  loteria_59: { title: "Lotería 59", range: 59, pickCount: 6, priceCredits: 1, prizeTable: { 6: 500_000, 5: 10_000, 4: 250, 3: 25, 2: 5 }, targetRtp: 0.9437363266 },
  loteria_19: {
    title: "Lotería 19",
    range: 19,
    pickCount: 3,
    priceCredits: 1,
    prizeTable: { 3: 70, 2: 16 },
    targetRtp: 0.8648090815,
    bonusBallPacks: [{ count: 1, totalCostCredits: 2, prizeTable: { 3: 70, 2: 17 }, consolationPrize: 5, targetRtp: 0.8519091847 }],
  },
};

export function isVirtualLotteryGameType(value: string): value is VirtualLotteryGameType {
  return (VIRTUAL_LOTTERY_TYPES as readonly string[]).includes(value);
}

export function isConsolationLotteryGameType(value: string): value is never {
  return false;
}

export function getLotteryBonusBallPack(variant: VirtualLotteryVariant, count: number) {
  if (count === 0) return null;
  return variant.bonusBallPacks?.find((pack) => pack.count === count) ?? null;
}

export function combination(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const limitedK = Math.min(k, n - k);
  let result = 1;
  for (let index = 1; index <= limitedK; index += 1) result = (result * (n - limitedK + index)) / index;
  return result;
}

export function lotteryMatchProbability(range: number, matches: number, pickCount = 6) {
  return (combination(pickCount, matches) * combination(range - pickCount, pickCount - matches)) / combination(range, pickCount);
}

export function lotteryTheoreticalRtp(variant: Pick<VirtualLotteryVariant, "range" | "pickCount" | "priceCredits" | "prizeTable">) {
  const expectedPrize = Object.entries(variant.prizeTable).reduce((total, [matches, prize]) => total + lotteryMatchProbability(variant.range, Number(matches), variant.pickCount) * roundVirtualPrize(prize), 0);
  return expectedPrize / variant.priceCredits;
}

export function bonusBallMatchProbability(range: number, pickCount: number, bonusBallCount: number) {
  if (bonusBallCount === 0) return 0;
  return Array.from({ length: pickCount + 1 }, (_, matches) => {
    const unhitTicketNumbers = pickCount - matches;
    const remainingPool = range - pickCount;
    const noExtraMatch = combination(remainingPool - unhitTicketNumbers, bonusBallCount) / combination(remainingPool, bonusBallCount);
    return lotteryMatchProbability(range, matches, pickCount) * (1 - noExtraMatch);
  }).reduce((total, probability) => total + probability, 0);
}

export function lotteryBonusBallTheoreticalRtp(variant: VirtualLotteryVariant, pack: LotteryBonusBallPack) {
  const baseExpectedPrize = Object.entries(pack.prizeTable).reduce((total, [matches, prize]) => total + lotteryMatchProbability(variant.range, Number(matches), variant.pickCount) * roundVirtualPrize(prize), 0);
  const consolationExpectedPrize = bonusBallMatchProbability(variant.range, variant.pickCount, pack.count) * roundVirtualPrize(pack.consolationPrize);
  return (baseExpectedPrize + consolationExpectedPrize) / pack.totalCostCredits;
}

export const MJP_EXTRA_39 = {
  extraCostCredits: 1,
  multiplier: 2,
  eligibleMatches: [2, 3, 4, 5] as const,
  disclosure: "El número Extra se elige fuera de los seis principales y se sortea entre los números no extraídos. Si coincide, duplica únicamente los premios elegibles.",
} as const;

export function lotteryExtraExpectedPrize(variant: Pick<VirtualLotteryVariant, "range" | "prizeTable"> & Partial<Pick<VirtualLotteryVariant, "pickCount">>, extra = MJP_EXTRA_39) {
  const pickCount = variant.pickCount ?? 6;
  const baseExpectedPrize = Object.entries(variant.prizeTable).reduce((total, [matches, prize]) => total + lotteryMatchProbability(variant.range, Number(matches), pickCount) * roundVirtualPrize(prize), 0);
  const bonusExpectedPrize = extra.eligibleMatches.reduce((total, matches) => total + lotteryMatchProbability(variant.range, matches, pickCount) * roundVirtualPrize(variant.prizeTable[matches] ?? 0) * (extra.multiplier - 1) / (variant.range - pickCount), 0);
  return { baseExpectedPrize, bonusExpectedPrize, totalExpectedPrize: baseExpectedPrize + bonusExpectedPrize };
}

export function lotteryExtraTheoreticalRtp(variant: Pick<VirtualLotteryVariant, "range" | "priceCredits" | "prizeTable"> & Partial<Pick<VirtualLotteryVariant, "pickCount">>, extra = MJP_EXTRA_39) {
  return lotteryExtraExpectedPrize(variant, extra).totalExpectedPrize / (variant.priceCredits + extra.extraCostCredits);
}
