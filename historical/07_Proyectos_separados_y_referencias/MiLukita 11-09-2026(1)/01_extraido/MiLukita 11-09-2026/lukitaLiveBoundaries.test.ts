import { describe, expect, it } from "vitest";
import { LUKITA_LIVE_BOUNDARIES, hasSeparatedLukitaLiveBoundaries } from "./lukitaLiveBoundaries";

describe("Lukita Live boundaries", () => {
  it("separa Experience QR de Control QR", () => {
    expect(LUKITA_LIVE_BOUNDARIES.experienceQr.name).not.toBe(LUKITA_LIVE_BOUNDARIES.controlQr.name);
    expect(LUKITA_LIVE_BOUNDARIES.experienceQr.mustNotAccess).toContain("control_qr_payload");
    expect(LUKITA_LIVE_BOUNDARIES.controlQr.mustNotAccess).toContain("experience_qr_payload");
  });

  it("mantiene Controller Lab como backstage y Lukita como protagonista presentation-only", () => {
    expect(LUKITA_LIVE_BOUNDARIES.controllerLab.status).toBe("BACKSTAGE_ONLY");
    expect(LUKITA_LIVE_BOUNDARIES.lukita.authority).toBe("PRESENTATION_ONLY");
    expect(hasSeparatedLukitaLiveBoundaries()).toBe(true);
  });
});
