import { describe, expect, it } from "vitest";
import { runAgentRuntimeAutonomyTest } from "./agentRuntimeAutonomy";

describe("AGENT_RUNTIME_AUTONOMY_TEST", () => {
  it("recorre 24 horas virtuales con eventos únicos y cadena completa", () => {
    const report = runAgentRuntimeAutonomyTest();
    expect(report.passed).toBe(true);
    expect(report.chainCompleted).toBe(true);
    expect(report.records).toHaveLength(1440);
    expect(report.uniqueEventIds).toBe(144);
  });

  it("pasa los diez escenarios de caos controlado", () => {
    const report = runAgentRuntimeAutonomyTest();
    expect(report.chaos).toHaveLength(10);
    expect(report.chaos.every((scenario) => scenario.passed)).toBe(true);
  });

  it("mantiene la cadena cuando Lukita está fuera de servicio", () => {
    const report = runAgentRuntimeAutonomyTest();
    expect(report.killLukita.passed).toBe(true);
    expect(report.killLukita.lukita).toBe("OFF");
    expect(report.killLukita.preserved).toContain("resultado");
    expect(report.killLukita.preserved).toContain("siguiente evento");
  });
});
