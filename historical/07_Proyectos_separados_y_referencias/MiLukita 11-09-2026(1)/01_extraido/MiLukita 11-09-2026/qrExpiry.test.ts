import { describe, expect, it } from "vitest";
import { getQrExpiryState, getQrProgressPercent } from "./qrExpiry";

describe("estado de expiración del QR", () => {
  const now = Date.parse("2026-08-26T12:00:00.000Z");

  it("calcula los segundos restantes con redondeo hacia arriba", () => {
    expect(getQrExpiryState("2026-08-26T12:00:05.100Z", now)).toMatchObject({ secondsRemaining: 6, expired: false });
  });

  it("marca como vencido cuando llega a cero", () => {
    expect(getQrExpiryState("2026-08-26T12:00:00.000Z", now)).toMatchObject({ secondsRemaining: 0, expired: true });
  });

  it("mantiene estado no medido cuando no hay fecha válida", () => {
    expect(getQrExpiryState(null, now)).toMatchObject({ secondsRemaining: null, expired: false });
  });

  it("calcula y limita el progreso circular del QR", () => {
    expect(getQrProgressPercent(60, 60)).toBe(100);
    expect(getQrProgressPercent(30, 60)).toBe(50);
    expect(getQrProgressPercent(0, 60)).toBe(0);
    expect(getQrProgressPercent(90, 60)).toBe(100);
  });
});
