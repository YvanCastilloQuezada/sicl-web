import { describe, expect, it } from "vitest";
import { auditReadOnly } from "./auditor/AuditorAgent";
import { buildUnifiedHealth } from "../shared/health";
import { simulateDualInstanceClaim } from "./scheduler/dualInstanceSimulation";

describe("Orden P1 — salud, recuperación y autoridad", () => {
  it("recorre la recuperación sin cambiar el eventId ni autorizar mutaciones", () => {
    const eventId = "E-RECOVERY-1";
    const stopped = buildUnifiedHealth({ state: "STOPPED", eventId, reason: "kill_switch_active", watchdogStatus: "ALERT_ONLY", auditorStatus: "READ_ONLY" });
    const recovered = auditReadOnly({ liveEventId: eventId, manifestEventId: eventId, persistedEventId: eventId, health: { state: "RECOVERING", eventId, watchdogStatus: "ALERT_ONLY", auditorStatus: "READ_ONLY" } });
    expect(stopped.eventId).toBe(recovered.health.eventId);
    expect(recovered.verdict).toBe("PASS");
    expect(recovered.actionsExecuted).toBe(false);
  });
  it("mantiene STOPPED como estado de seguridad y no reanuda automáticamente", () => {
    const state = buildUnifiedHealth({ state: "STOPPED", reason: "kill_switch_active", watchdogStatus: "ALERT_ONLY", auditorStatus: "READ_ONLY" });
    expect(state.state).toBe("STOPPED");
    expect(state.virtualOnly).toBe(true);
    expect(state.watchdogStatus).toBe("ALERT_ONLY");
    expect(state.auditorStatus).toBe("READ_ONLY");
  });
  it("aplica NO DATA → NO CLAIM sin crear una causa ficticia", () => {
    const report = auditReadOnly({ health: { state: "DISCONNECTED" } });
    expect(report.findings).toEqual(expect.arrayContaining([expect.objectContaining({ code: "NO_DATA" })]));
    expect(report.findings.some((finding) => /causa|error|fallo/i.test(finding.message))).toBe(false);
  });
  it("evita doble cierre lógico entre instancias concurrentes", async () => {
    const report = await simulateDualInstanceClaim("E-CLOSE-1");
    expect(report.acquiredCount).toBe(1);
    expect(report.storedClaimCount).toBe(1);
  });
});
