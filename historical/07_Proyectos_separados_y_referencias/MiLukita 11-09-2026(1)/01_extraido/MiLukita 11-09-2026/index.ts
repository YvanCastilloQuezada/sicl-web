import { performance } from "node:perf_hooks";
import { FULL_CONFIG, LOTERIA_SMOKE_CONFIG, LOTERIA_VALIDATION_CONFIG, LOTTERY_VARIANT_VALIDATION_CONFIGS, QUICK_CONFIG, withOutput } from "./config";
import { simulateRound } from "./engine";
import { InMemorySimulationLedger } from "./database";
import { createVirtualUsers } from "./loadGenerator";
import { MetricsCollector } from "./metricsCollector";
import { SeededRandom } from "./random";
import { createReport, saveReport } from "./reporter";
import type { SimulationProfile } from "./types";

export function runSimulation(config: SimulationProfile) {
  const started = performance.now();
  const users = createVirtualUsers(config.users);
  const ledger = new InMemorySimulationLedger(users, config.initialBalancePerUser);
  const random = new SeededRandom(config.seed);
  const metrics = new MetricsCollector();

  for (let roundIndex = 0; roundIndex < config.totalRounds; roundIndex += 1) {
    const gameType = config.games[roundIndex % config.games.length];
    try {
      metrics.recordRound(simulateRound(gameType, users, config.ticketsPerRound, ledger, random));
    } catch (error) {
      metrics.recordError(error instanceof Error ? error : new Error(String(error)));
    }
  }
  const report = createReport(metrics, config, performance.now() - started, { initial: ledger.initialTotal, final: ledger.finalTotal, cost: ledger.costTotal, prize: ledger.prizeTotal, consistent: ledger.isConsistent });
  saveReport(report, config.outputReport);
  return report;
}

function readArgument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function main() {
  const variantIndex = process.argv.indexOf("--variant");
  const requestedVariant = variantIndex >= 0 ? process.argv[variantIndex + 1] as keyof typeof LOTTERY_VARIANT_VALIDATION_CONFIGS | undefined : undefined;
  const requestedProfile = requestedVariant && LOTTERY_VARIANT_VALIDATION_CONFIGS[requestedVariant] ? LOTTERY_VARIANT_VALIDATION_CONFIGS[requestedVariant] : process.argv.includes("--loteria-smoke") ? LOTERIA_SMOKE_CONFIG : process.argv.includes("--loteria") ? LOTERIA_VALIDATION_CONFIG : process.argv.includes("--full") ? FULL_CONFIG : QUICK_CONFIG;
  const config = withOutput(requestedProfile, readArgument("--output"));
  const report = runSimulation(config);
  console.log(`Simulación ${config.name} finalizada.`);
  console.log(`Tickets: ${report.summary.totalTickets} | RTP: ${(report.summary.overallRtp * 100).toFixed(2)}% | errores: ${report.summary.errors}`);
  console.log(`p95 puro: ${report.performance.p95ResponseTimeMs.toFixed(3)} ms | informe: ${config.outputReport}`);
}

if (process.argv[1]?.endsWith("simulator/index.ts")) main();
