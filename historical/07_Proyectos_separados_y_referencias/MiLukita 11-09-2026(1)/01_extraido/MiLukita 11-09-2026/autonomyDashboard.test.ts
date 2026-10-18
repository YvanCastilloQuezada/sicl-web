import { describe, expect, it } from "vitest";
import { describeAutonomyDashboard, isAutonomyDashboardHealthy } from "./autonomyDashboard";

const base = { passed: true, chainCompleted: true, chaosPassed: true, killLukitaPassed: true, watchdogPass: true, controlMode: "NORMAL" };

describe("autonomy dashboard status", () => {
  it("reports healthy only when all runtime indicators pass", () => {
    expect(isAutonomyDashboardHealthy(base)).toBe(true);
    expect(describeAutonomyDashboard(base)).toBe("Prueba contractual aprobada");
  });

  it("prioritizes the human STOPPED state", () => {
    const stopped = { ...base, controlMode: "STOPPED" };
    expect(isAutonomyDashboardHealthy(stopped)).toBe(false);
    expect(describeAutonomyDashboard(stopped)).toBe("Sistema detenido por control humano");
  });

  it("requests review when an indicator is missing or failed", () => {
    expect(describeAutonomyDashboard({ ...base, chaosPassed: false })).toBe("Revisión requerida");
  });
});
