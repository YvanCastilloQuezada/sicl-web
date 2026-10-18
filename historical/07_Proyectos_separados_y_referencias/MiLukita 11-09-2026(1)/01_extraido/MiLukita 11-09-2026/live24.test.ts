import { describe, expect, it } from "vitest";
import { buildDefaultLiveSchedule, projectLiveManifest } from "./liveChannel";
import { detectLiveTransition, simulateLive24 } from "./live24";

describe("MiLukita LIVE-24", () => {
  it("detecta un cambio de evento y conserva QR del nuevo evento", () => {
    const schedule = buildDefaultLiveSchedule();
    const previous = projectLiveManifest(schedule, 127, 0, 0);
    const next = projectLiveManifest(schedule, 128, 0, 0);
    const transition = detectLiveTransition(previous, next, "action-event-002");
    expect(transition).not.toBeNull();
    expect(transition?.fromEventId).toBe("LIVE-IDLE");
    expect(transition?.toEventId).toBe("LIVE-002");
    expect(detectLiveTransition(next, next, "duplicate-action")).toBeNull();

    const qrState = projectLiveManifest(schedule, 130, 0, 0);
    expect(qrState.qr).toBe("READY");
    expect(qrState.eventId).toBe("LIVE-002");
  });

  it("produce un informe determinista de 24 horas sin inconsistencias", () => {
    const report = simulateLive24();
    expect(report.mode).toBe("SIMULATION");
    expect(report.windowHours).toBe(24);
    expect(report.heartbeatTicks).toBe(1440);
    expect(report.criticalErrors).toBe(0);
    expect(report.duplicateActions).toBe(0);
    expect(report.inconsistencies).toBe(0);
    expect(report.status).toBe("PASS");
  });
});
