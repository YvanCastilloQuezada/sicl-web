import { describe, expect, it } from "vitest";
import { QUICK_CONFIG } from "./config";
import { runSimulation } from "./index";
import { MetricsCollector } from "./metricsCollector";

describe("simulador aislado", () => {
  it("es reproducible, conserva saldos y no informa errores en un perfil reducido", () => {
    const config = { ...QUICK_CONFIG, totalRounds: 5, ticketsPerRound: 40, outputReport: "/tmp/multi-juegos-simulation-test.json" };
    const first = runSimulation(config);
    const second = runSimulation(config);

    expect(first.summary.totalTickets).toBe(200);
    expect(first.summary.errors).toBe(0);
    expect(first.summary.balanceConsistent).toBe(true);
    expect(first.safety).toMatchObject({ databaseTouched: false, networkCalls: false, usesProductionUsers: false });
    expect(first.summary.totalCost).toBe(second.summary.totalCost);
    expect(first.summary.totalPrize).toBe(second.summary.totalPrize);
    expect(first.byGame.cartas?.rtpObserved).toBe(second.byGame.cartas?.rtpObserved);
    expect(first.validation.integrityPassed).toBe(true);
    expect(first.validation.byGame.ruleta?.eligible).toBe(false);
  });

  it("conserva una muestra acotada de latencias al procesar muchos boletos", () => {
    const metrics = new MetricsCollector();
    metrics.recordRound({ gameType: "loteria", totalCost: 30_000, totalPrize: 0, tickets: Array.from({ length: 30_000 }, () => ({ userId: 1, picks: [1, 2, 3, 4, 5, 6], durationMs: 0.01, cost: 1, prize: 0 })) });
    expect(metrics.performance().maxResponseTimeMs).toBe(0.01);
    expect(metrics.performance().p95ResponseTimeMs).toBe(0.01);
  });
});
