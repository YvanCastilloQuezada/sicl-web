import { describe, expect, it } from "vitest";
import { DISTRIBUTION_CHANNELS, buildDistributionAuditHistory, createMasterFeedProjection, detectScheduleConflicts, distributionCanPublish, getDistributionHealth } from "./distributionOs";
import { createManifestFixture } from "./tvManifest";

describe("Distribution OS", () => {
  it("proyecta el manifest autoritativo sin cambiar su origen", () => {
    const manifest = createManifestFixture("OPEN");
    const projection = createMasterFeedProjection(manifest);
    expect(projection.authoritativeSource).toBe("MJP_CORE");
    expect(projection.eventId).toBe(manifest.event.eventId);
    expect(projection.qrEventId).toBe(manifest.qr.roundId);
    expect(projection.virtualOnly).toBe(true);
  });
  it("detecta QR ausente, contingencia ausente y solapamiento", () => {
    const conflicts = detectScheduleConflicts([
      { eventId: "A", startAt: "2026-01-01T00:00:00Z", endAt: "2026-01-01T00:10:00Z", qrEventId: null, contingency: false, nextEventId: "B" },
      { eventId: "B", startAt: "2026-01-01T00:05:00Z", endAt: "2026-01-01T00:15:00Z", qrEventId: "B", contingency: true, nextEventId: null },
    ]);
    expect(conflicts.map((item) => item.code)).toEqual(expect.arrayContaining(["MISSING_QR", "MISSING_CONTINGENCY", "OVERLAP", "MISSING_NEXT_EVENT"]));
    expect(distributionCanPublish(DISTRIBUTION_CHANNELS, conflicts)).toBe(false);
  });
  it("construye historial auditable para canales bloqueados sin inventar eventos de runtime", () => {
    const history = buildDistributionAuditHistory();
    expect(history.some((record) => record.status === "BLOCKED" && record.source === "POLICY")).toBe(true);
    expect(history.every((record) => record.at === null)).toBe(true);
  });
  it("clasifica el estado como listo para staging cuando hay integraciones externas pendientes", () => {
    expect(getDistributionHealth()).toBe("BLOCKED");
    expect(getDistributionHealth(DISTRIBUTION_CHANNELS.filter((channel) => channel.status !== "BLOCKED"))).toBe("READY_FOR_STAGING");
  });
});
