import { describe, expect, it } from "vitest";
import { simulateAutonomyWindow, summarizeAutonomySimulation } from "./autonomySimulation";

describe("autonomy 24-hour simulation", () => {
  it("covers every minute and skips one duplicate attempt per tick", () => {
    const report = simulateAutonomyWindow({ startAt: new Date("2026-08-26T00:00:00.000Z") });
    expect(report.windowHours).toBe(24);
    expect(report.ticks).toBe(1440);
    expect(report.totalAttempts).toBe(2880);
    expect(report.uniqueClaims).toBe(1440);
    expect(report.duplicateClaims).toBe(1440);
    expect(report.passed).toBe(true);
  });

  it("supports a shorter deterministic window for focused checks", () => {
    const report = simulateAutonomyWindow({ windowHours: 2, intervalMinutes: 5, duplicateAttemptsPerTick: 2 });
    expect(report.ticks).toBe(24);
    expect(report.totalAttempts).toBe(72);
    expect(report.uniqueClaims).toBe(24);
    expect(report.duplicateClaims).toBe(48);
    expect(summarizeAutonomySimulation(report)).toMatchObject({ passed: true, ticks: 24, stableClaimKeys: true });
  });

  it("rejects invalid simulation parameters", () => {
    expect(() => simulateAutonomyWindow({ windowHours: 0 })).toThrow("windowHours");
    expect(() => simulateAutonomyWindow({ intervalMinutes: 0 })).toThrow("intervalMinutes");
    expect(() => simulateAutonomyWindow({ duplicateAttemptsPerTick: -1 })).toThrow("duplicateAttemptsPerTick");
  });
});
