import type { GameType } from "../pilot";
import type { SimulatedRound } from "./engine";
import type { GameStatistics } from "./types";

function percentile(values: number[], percentileValue: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * percentileValue) - 1))];
}

export class MetricsCollector {
  private static readonly maxLatencySamples = 20_000;
  private static readonly latencySamplePeriod = 500;
  private readonly stats = new Map<GameType, GameStatistics>();
  private readonly responseTimes: number[] = [];
  private errors: Error[] = [];
  private responseTimeTotal = 0;
  private responseTimeCount = 0;
  private responseTimeMax = 0;

  recordRound(round: SimulatedRound) {
    const current = this.stats.get(round.gameType) ?? { tickets: 0, cost: 0, prize: 0, responseTimesMs: [] };
    round.tickets.forEach(ticket => {
      current.tickets += 1;
      current.cost += ticket.cost;
      current.prize += ticket.prize;
      if (current.responseTimesMs.length < MetricsCollector.maxLatencySamples || current.tickets % MetricsCollector.latencySamplePeriod === 0) current.responseTimesMs.push(ticket.durationMs);
      this.responseTimeCount += 1;
      this.responseTimeTotal += ticket.durationMs;
      this.responseTimeMax = Math.max(this.responseTimeMax, ticket.durationMs);
      if (this.responseTimes.length < MetricsCollector.maxLatencySamples || this.responseTimeCount % MetricsCollector.latencySamplePeriod === 0) this.responseTimes.push(ticket.durationMs);
    });
    this.stats.set(round.gameType, current);
  }

  recordError(error: Error) {
    this.errors.push(error);
  }

  gameStats(gameType: GameType) {
    return this.stats.get(gameType) ?? { tickets: 0, cost: 0, prize: 0, responseTimesMs: [] };
  }

  allStats() {
    return this.stats;
  }

  get errorCount() {
    return this.errors.length;
  }

  performance() {
    return {
      avgResponseTimeMs: this.responseTimeCount ? this.responseTimeTotal / this.responseTimeCount : 0,
      p95ResponseTimeMs: percentile(this.responseTimes, 0.95),
      p99ResponseTimeMs: percentile(this.responseTimes, 0.99),
      maxResponseTimeMs: this.responseTimeMax,
    };
  }
}
