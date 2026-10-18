import { describe, expect, it } from "vitest";
import { createManifestFixture } from "./tvManifest";
import { getManifestTimingWindow, isQrExpiringSoon } from "./manifestTiming";

describe("manifestTiming", () => {
  it("usa openAt y qr.expiresAt como ventana autoritativa", () => {
    const manifest = createManifestFixture("OPEN");
    const timing = getManifestTimingWindow(manifest, Date.parse("2026-08-25T20:01:00.000Z"));
    expect(timing.authoritative).toBe(true);
    expect(timing.durationSeconds).toBe(120);
    expect(timing.remainingSeconds).toBe(60);
    expect(timing.progressPercent).toBe(50);
  });

  it("activa la alerta solo por debajo de diez segundos", () => {
    expect(isQrExpiringSoon(9)).toBe(true);
    expect(isQrExpiringSoon(10)).toBe(false);
    expect(isQrExpiringSoon(null)).toBe(false);
  });

  it("no inventa progreso cuando faltan timestamps válidos", () => {
    const manifest = createManifestFixture("OPEN");
    const timing = getManifestTimingWindow({ ...manifest, event: { ...manifest.event, openAt: null, closeAt: null }, qr: { ...manifest.qr, expiresAt: null } });
    expect(timing.authoritative).toBe(false);
    expect(timing.progressPercent).toBeNull();
  });
});
