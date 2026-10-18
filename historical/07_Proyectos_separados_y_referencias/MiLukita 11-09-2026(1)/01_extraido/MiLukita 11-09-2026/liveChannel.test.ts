import { describe, expect, it } from "vitest";
import { buildDefaultLiveSchedule, projectLiveManifest, simulateLiveDay } from "./liveChannel";

describe("MiLukita LIVE", () => {
  it("genera una agenda de 24 horas sin solapamientos", () => {
    const schedule = buildDefaultLiveSchedule();
    expect(schedule.length).toBeGreaterThan(10);
    for (let index = 1; index < schedule.length; index += 1) {
      expect(schedule[index].startMinute).toBeGreaterThanOrEqual(schedule[index - 1].startMinute + schedule[index - 1].durationMinutes + schedule[index - 1].cooldownMinutes);
    }
  });
  it("proyecta un evento actual con autoridad MJP CORE y próximo evento", () => {
    const schedule = buildDefaultLiveSchedule();
    const projection = projectLiveManifest(schedule, schedule[1].startMinute + 3, 12);
    expect(projection.channel).toBe("MILUKITA_LIVE");
    expect(projection.source).toEqual({ system: "MJP_CORE", authoritative: true });
    expect(projection.virtualOnly).toBe(true);
    expect(projection.players).toBe(12);
    const qrProjection = projectLiveManifest(schedule, schedule[0].startMinute + 2, 12);
    expect(qrProjection.qr).toBe("READY");
    expect(qrProjection.nextEvent?.eventId).toBe(schedule[1].eventId);
  });
  it("simula continuidad, fallos recuperables y cero errores críticos", () => {
    const report = simulateLiveDay();
    expect(report.windowHours).toBe(24);
    expect(report.scheduled).toBe(report.completed);
    expect(report.recoveries).toBe(report.recoverySuccesses);
    expect(report.criticalErrors).toBe(0);
    expect(report.status).toBe("PASS");
  });
});
