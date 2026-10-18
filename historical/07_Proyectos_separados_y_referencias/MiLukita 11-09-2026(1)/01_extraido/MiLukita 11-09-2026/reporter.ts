import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { type GameType } from "../pilot";
import { VIRTUAL_LOTTERY_VARIANTS, isVirtualLotteryGameType, lotteryTheoreticalRtp } from "../../shared/lotteryVariants";
import { chooseGameConfig } from "./engine";
import type { MetricsCollector } from "./metricsCollector";
import type { SimulationProfile, SimulationReport } from "./types";

function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const useK = Math.min(k, n - k);
  let result = 1;
  for (let index = 1; index <= useK; index += 1) result = (result * (n - useK + index)) / index;
  return result;
}

function probabilityOfMatches(pool: number, drawn: number, picks: number, matches: number) {
  return (combinations(drawn, matches) * combinations(pool - drawn, picks - matches)) / combinations(pool, picks);
}

export function theoreticalRtp(gameType: GameType, ticketsPerRound: number) {
  const config = chooseGameConfig(gameType);
  if (gameType === "ruleta") return (360 / 37) / config.price;
  if (gameType === "bingo") return (82 / 3) / config.price;
  if (gameType === "cartas") {
    const expected = probabilityOfMatches(13, 3, 3, 3) * 700 + probabilityOfMatches(13, 3, 3, 2) * 37 + probabilityOfMatches(13, 3, 3, 1) * 5;
    return expected / config.price;
  }
  if (isVirtualLotteryGameType(gameType)) return lotteryTheoreticalRtp(VIRTUAL_LOTTERY_VARIANTS[gameType]);
  const baseExpected = probabilityOfMatches(20, 5, 5, 4) * 1200 + probabilityOfMatches(20, 5, 5, 3) * 240;
  const pFive = probabilityOfMatches(20, 5, 5, 5);
  const pool = 18_400 + Math.round(ticketsPerRound * config.price * 0.35);
  const progressivePerTicket = (pool * (1 - (1 - pFive) ** ticketsPerRound)) / ticketsPerRound;
  return (baseExpected + progressivePerTicket) / config.price;
}

export function createReport(metrics: MetricsCollector, config: SimulationProfile, durationMs: number, balance: { initial: number; final: number; cost: number; prize: number; consistent: boolean }): SimulationReport {
  const byGame: SimulationReport["byGame"] = {};
  const validationByGame: NonNullable<SimulationReport["validation"]>["byGame"] = {};
  for (const gameType of config.games) {
    const stats = metrics.gameStats(gameType);
    const observed = stats.cost ? stats.prize / stats.cost : 0;
    const theoretical = theoreticalRtp(gameType, config.ticketsPerRound);
    byGame[gameType] = { tickets: stats.tickets, cost: stats.cost, prize: stats.prize, rtpObserved: observed, rtpTheoretical: theoretical, deviation: observed - theoretical };
    validationByGame[gameType] = { eligible: stats.tickets >= 10_000, passed: stats.tickets >= 10_000 && Math.abs(observed - theoretical) <= config.rtpTolerance, deviation: observed - theoretical };
  }
  const totalTickets = Object.values(byGame).reduce((sum, game) => sum + (game?.tickets ?? 0), 0);
  const totalCost = balance.cost;
  const totalPrize = balance.prize;
  const performance = metrics.performance();
  const failedRtpGames = config.games.filter(gameType => !validationByGame[gameType]?.passed);
  const bingoTheoretical = byGame.bingo?.rtpTheoretical ?? 0;
  const conclusions = [
    balance.consistent ? "Integridad de saldo: aprobada; saldo inicial - costos + premios = saldo final." : "Integridad de saldo: falló; se requiere revisión del libro mayor virtual.",
    performance.p95ResponseTimeMs <= config.targetP95Ms ? `Rendimiento puro: p95 dentro del objetivo de ${config.targetP95Ms} ms.` : `Rendimiento puro: p95 supera el objetivo de ${config.targetP95Ms} ms.`,
    failedRtpGames.length === 0 ? "RTP observado: dentro de la tolerancia configurada para todas las modalidades con muestra suficiente." : `RTP observado: no cumple la tolerancia configurada en ${failedRtpGames.join(", ")}. Repetir con una muestra más amplia y revisar reglas antes de ampliar audiencia.`,
    bingoTheoretical > 1 ? `Alerta económica: Bingo tiene RTP teórico de ${(bingoTheoretical * 100).toFixed(2)}% según los pagos vigentes. La regla debe revisarse antes de cualquier uso fuera del piloto.` : "Bingo mantiene un RTP teórico no superior al costo configurado.",
    "Alcance: este informe mide un motor aislado en memoria. No equivale a una prueba HTTP, OAuth ni base de datos de producción.",
  ];
  return {
    timestamp: new Date().toISOString(),
    safety: { databaseTouched: false, networkCalls: false, usesProductionUsers: false, note: "La simulación usa un generador pseudoaleatorio sembrado, usuarios ficticios y un libro mayor en memoria." },
    config,
    durationMs,
    summary: { totalTickets, totalRounds: config.totalRounds, totalCost, totalPrize, overallRtp: totalCost ? totalPrize / totalCost : 0, errors: metrics.errorCount, errorRate: totalTickets ? metrics.errorCount / totalTickets : 0, balanceConsistent: balance.consistent, initialBalance: balance.initial, finalBalance: balance.final },
    byGame,
    performance: { ...performance, targetP95Ms: config.targetP95Ms, targetMet: performance.p95ResponseTimeMs <= config.targetP95Ms, scope: "Procesamiento aislado de reglas y libro mayor en memoria; excluye red, OAuth, SQL y renderizado." },
    validation: {
      minimumTicketsPerGame: 10_000,
      rtpTolerance: config.rtpTolerance,
      rtpPassed: failedRtpGames.length === 0,
      integrityPassed: balance.consistent,
      performancePassed: performance.p95ResponseTimeMs <= config.targetP95Ms,
      byGame: validationByGame,
    },
    conclusions,
  };
}

export function saveReport(report: SimulationReport, outputPath: string) {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(report, null, 2));
}
