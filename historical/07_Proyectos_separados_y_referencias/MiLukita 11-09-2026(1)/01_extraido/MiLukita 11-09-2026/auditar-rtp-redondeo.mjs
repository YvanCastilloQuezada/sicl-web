import {
  MJP_EXTRA_39,
  VIRTUAL_LOTTERY_TYPES,
  VIRTUAL_LOTTERY_VARIANTS,
  lotteryBonusBallTheoreticalRtp,
  lotteryExtraTheoreticalRtp,
  lotteryTheoreticalRtp,
} from "../shared/lotteryVariants.ts";
import { roundVirtualPrize } from "../shared/virtualPrizeRounding.ts";

const report = VIRTUAL_LOTTERY_TYPES.map((gameType) => {
  const variant = VIRTUAL_LOTTERY_VARIANTS[gameType];
  return {
    gameType,
    title: variant.title,
    selection: `${variant.pickCount}/${variant.range}`,
    baseRtp: lotteryTheoreticalRtp(variant),
    declaredTargetRtp: variant.targetRtp,
    allBasePrizesAreWhole: Object.values(variant.prizeTable).every((prize) => roundVirtualPrize(prize) === prize),
    bonusPacks: (variant.bonusBallPacks ?? []).map((pack) => ({
      count: pack.count,
      costCredits: pack.totalCostCredits,
      rtp: lotteryBonusBallTheoreticalRtp(variant, pack),
      declaredTargetRtp: pack.targetRtp,
      allPrizesAreWhole: Object.values(pack.prizeTable).every((prize) => roundVirtualPrize(prize) === prize) && roundVirtualPrize(pack.consolationPrize) === pack.consolationPrize,
    })),
    mjpExtraRtp: gameType === "loteria_39" ? lotteryExtraTheoreticalRtp(variant, MJP_EXTRA_39) : undefined,
  };
});

console.log(JSON.stringify({ roundingPolicy: "[0,0.4)=>0; [0.4,+infinity)=>ceil", report }, null, 2));
