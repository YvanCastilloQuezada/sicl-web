import { describe, expect, it } from "vitest";
import { fieldGateReportHash, type FieldGateReportInput } from "./fieldGateReports";

const report: FieldGateReportInput = {
  protocol: "TRUJILLO — PILOTO 001",
  deviceA: "Android · Chrome",
  deviceB: "iOS · Safari",
  severity: "OBSERVATION",
  observations: "Precisión observada y conectividad registradas.",
  completedSteps: [0, 1, 2],
  stepResults: { "0": "PASS", "1": "PASS", "2": "BLOCKED" },
};

describe("field gate reports", () => {
  it("genera el mismo hash para el mismo reporte", () => {
    expect(fieldGateReportHash(report)).toHaveLength(64);
    expect(fieldGateReportHash(report)).toBe(fieldGateReportHash({ ...report }));
  });

  it("cambia el hash si cambia una observación o el estado de un paso", () => {
    expect(fieldGateReportHash({ ...report, observations: "Nueva observación" })).not.toBe(fieldGateReportHash(report));
    expect(fieldGateReportHash({ ...report, stepResults: { ...report.stepResults, "2": "FAIL" } })).not.toBe(fieldGateReportHash(report));
  });
});
