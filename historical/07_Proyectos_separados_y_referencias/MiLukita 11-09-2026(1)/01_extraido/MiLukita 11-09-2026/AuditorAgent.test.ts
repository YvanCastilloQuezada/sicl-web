import { describe, expect, it } from "vitest";
import { auditReadOnly } from "./AuditorAgent";

describe("Auditor Agent READ_ONLY", () => {
  it("devuelve PASS cuando LIVE, manifest y persistencia coinciden", () => {
    const report = auditReadOnly({ liveEventId: "E-1", manifestEventId: "E-1", persistedEventId: "E-1", now: "2026-08-27T00:00:00.000Z" });
    expect(report.verdict).toBe("PASS");
    expect(report.mode).toBe("READ_ONLY");
    expect(report.actionsExecuted).toBe(false);
  });
  it("devuelve FAIL ante eventId inconsistente", () => {
    const report = auditReadOnly({ liveEventId: "E-1", manifestEventId: "E-2", persistedEventId: "E-1" });
    expect(report.verdict).toBe("FAIL");
    expect(report.findings[0]?.code).toBe("EVENT_MISMATCH");
  });
  it("no inventa una causa cuando no hay datos", () => {
    const report = auditReadOnly({ health: { state: "STOPPED" } });
    expect(report.verdict).toBe("WARN");
    expect(report.findings[0]).toMatchObject({ code: "NO_DATA", message: "No hay detalles adicionales disponibles." });
  });
  it("marca un heartbeat de más de 90 segundos como WARN", () => {
    const report = auditReadOnly({ liveEventId: "E-1", manifestEventId: "E-1", persistedEventId: "E-1", heartbeatAt: "2026-08-27T00:00:00.000Z", now: "2026-08-27T00:02:00.000Z" });
    expect(report.verdict).toBe("WARN");
    expect(report.findings.some((finding) => finding.code === "HEARTBEAT_STALE")).toBe(true);
  });
});
