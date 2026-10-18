import { describe, expect, it } from "vitest";
import { getCircularQrPresentation, normalizeCircularQrVariant } from "./circularQr";

describe("QR circular MiLukita", () => {
  const source = {
    imageDataUrl: "data:image/png;base64,authoritative",
    payload: { roundId: "ROUND-1", signature: "sig-1" },
    targetUrl: "/juegos/loteria_39?round=ROUND-1",
    verifyUrl: "/verificar?round=ROUND-1",
    expiresAt: "2026-08-26T20:00:00.000Z",
    signed: true,
    available: true,
  };

  it("mantiene idéntico el payload en las tres variantes", () => {
    const central = getCircularQrPresentation(source, "central");
    const circle = getCircularQrPresentation(source, "circle");
    const integrated = getCircularQrPresentation(source, "integrated");
    expect(central.payload).toBe(circle.payload);
    expect(circle.payload).toBe(integrated.payload);
    expect(central.imageDataUrl).toBe(source.imageDataUrl);
    expect(integrated.targetUrl).toBe(source.targetUrl);
  });

  it("usa círculo como variante segura por defecto y conserva los nombres válidos", () => {
    expect(normalizeCircularQrVariant(undefined)).toBe("circle");
    expect(normalizeCircularQrVariant("central")).toBe("central");
    expect(normalizeCircularQrVariant("integrated")).toBe("integrated");
    expect(normalizeCircularQrVariant("invalid")).toBe("circle");
  });
});
