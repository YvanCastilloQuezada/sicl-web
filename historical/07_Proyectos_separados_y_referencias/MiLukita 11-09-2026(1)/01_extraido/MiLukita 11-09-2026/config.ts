import path from "node:path";
import { VIRTUAL_LOTTERY_TYPES } from "../../shared/lotteryVariants";
import type { SimulationProfile } from "./types";

const allGames = ["ruleta", "jackpot", "bingo", ...VIRTUAL_LOTTERY_TYPES, "cartas"] as const;

export const QUICK_CONFIG: SimulationProfile = {
  name: "quick",
  totalRounds: 10,
  ticketsPerRound: 100,
  users: 10,
  games: allGames,
  seed: "multi-juegos-piloto-quick-v1",
  initialBalancePerUser: 100_000,
  outputReport: path.resolve(process.cwd(), ".simulation-results", "simulation-report-quick.json"),
  targetP95Ms: 500,
  rtpTolerance: 0.15,
};

export const FULL_CONFIG: SimulationProfile = {
  name: "full",
  totalRounds: 100,
  ticketsPerRound: 500,
  users: 50,
  games: allGames,
  seed: "multi-juegos-piloto-full-v1",
  initialBalancePerUser: 1_000_000,
  outputReport: path.resolve(process.cwd(), ".simulation-results", "simulation-report-full.json"),
  targetP95Ms: 500,
  rtpTolerance: 0.01,
};

export const LOTERIA_VALIDATION_CONFIG: SimulationProfile = {
  name: "lot-19-validation",
  totalRounds: 1_000,
  ticketsPerRound: 10_000,
  users: 50,
  games: ["loteria_19"],
  seed: "multi-juegos-lot-19-v100-10000",
  initialBalancePerUser: 10_000_000,
  outputReport: path.resolve(process.cwd(), ".simulation-results", "simulation-report-lot-19-v100.json"),
  targetP95Ms: 500,
  rtpTolerance: 0.01,
};

export const LOTERIA_SMOKE_CONFIG: SimulationProfile = {
  ...LOTERIA_VALIDATION_CONFIG,
  name: "lot-19-validation",
  totalRounds: 10,
  ticketsPerRound: 1_000,
  seed: "multi-juegos-lot-19-v100-10000-smoke",
  outputReport: path.resolve(process.cwd(), ".simulation-results", "simulation-report-lot-19-v100-smoke.json"),
  rtpTolerance: 0.2,
};

function createLotteryVariantValidationConfig(gameType: (typeof VIRTUAL_LOTTERY_TYPES)[number]): SimulationProfile {
  return {
  name: `${gameType}-validation`,
  totalRounds: 100,
  ticketsPerRound: 1_000,
  users: 100,
  games: [gameType],
  seed: `multi-juegos-${gameType}-100k-v100`,
  initialBalancePerUser: 2_000_000,
  outputReport: path.resolve(process.cwd(), ".simulation-results", `simulation-report-${gameType}-v100.json`),
  targetP95Ms: 500,
  rtpTolerance: 0.2,
  };
}

export const LOTTERY_VARIANT_VALIDATION_CONFIGS = {
  loteria_19: createLotteryVariantValidationConfig("loteria_19"),
  loteria_29: createLotteryVariantValidationConfig("loteria_29"),
  loteria_39: createLotteryVariantValidationConfig("loteria_39"),
  loteria_39_5: createLotteryVariantValidationConfig("loteria_39_5"),
  loteria_49: createLotteryVariantValidationConfig("loteria_49"),
  loteria_59: createLotteryVariantValidationConfig("loteria_59"),
} satisfies Record<(typeof VIRTUAL_LOTTERY_TYPES)[number], SimulationProfile>;

export function withOutput(config: SimulationProfile, outputReport?: string): SimulationProfile {
  return outputReport ? { ...config, outputReport: path.resolve(outputReport) } : config;
}
