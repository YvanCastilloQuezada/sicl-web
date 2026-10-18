import { MJP_EXTRA_39, VIRTUAL_LOTTERY_TYPES, VIRTUAL_LOTTERY_VARIANTS, combination, lotteryExtraExpectedPrize, lotteryExtraTheoreticalRtp, lotteryMatchProbability, lotteryTheoreticalRtp } from "../../shared/lotteryVariants";

function analyze(id: (typeof VIRTUAL_LOTTERY_TYPES)[number]) {
  const variant = VIRTUAL_LOTTERY_VARIANTS[id];
  const rows = Object.entries(variant.prizeTable).map(([matchesText, prize]) => {
    const matches = Number(matchesText);
    const probability = lotteryMatchProbability(variant.range, matches);
    return { matches, prize, probability, rtpContribution: (probability * prize) / variant.priceCredits };
  }).sort((left, right) => right.matches - left.matches);
  return { id, range: variant.range, priceCredits: variant.priceCredits, denominator: combination(variant.range, 6).toString(), rtp: lotteryTheoreticalRtp(variant), rows };
}

const extraVariant = VIRTUAL_LOTTERY_VARIANTS.loteria_39;
console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  variants: VIRTUAL_LOTTERY_TYPES.map(analyze),
  mjpExtra39: {
    gameType: "loteria_39",
    priceCredits: extraVariant.priceCredits + MJP_EXTRA_39.extraCostCredits,
    extra: MJP_EXTRA_39,
    expectedPrize: lotteryExtraExpectedPrize(extraVariant),
    rtp: lotteryExtraTheoreticalRtp(extraVariant),
    doubledPrizeTable: Object.fromEntries(MJP_EXTRA_39.eligibleMatches.map((matches) => [matches, (extraVariant.prizeTable[matches] ?? 0) * MJP_EXTRA_39.multiplier])),
  },
}, null, 2));
