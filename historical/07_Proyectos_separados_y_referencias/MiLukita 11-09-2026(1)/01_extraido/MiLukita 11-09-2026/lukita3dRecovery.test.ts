import { describe, expect, it } from "vitest";
import { getLukitaViewerRecoveryMessage, getLukitaViewerRetryDelay, LUKITA_VIEWER_MAX_AUTO_RETRIES, shouldRetryLukitaViewer } from "./lukita3dRecovery";

describe("lukita3dRecovery", () => {
  it("limita los reintentos automáticos a una política acotada", () => {
    expect(LUKITA_VIEWER_MAX_AUTO_RETRIES).toBe(1);
    expect(shouldRetryLukitaViewer(0)).toBe(true);
    expect(shouldRetryLukitaViewer(1)).toBe(false);
    expect(shouldRetryLukitaViewer(99)).toBe(false);
  });

  it("calcula una espera progresiva con tope", () => {
    expect(getLukitaViewerRetryDelay(0)).toBe(1500);
    expect(getLukitaViewerRetryDelay(1)).toBe(3000);
    expect(getLukitaViewerRetryDelay(10)).toBe(8000);
  });

  it("expone mensajes entendibles para cada estado del visor", () => {
    expect(getLukitaViewerRecoveryMessage("loading")).toContain("Cargando");
    expect(getLukitaViewerRecoveryMessage("ready")).toContain("cargado");
    expect(getLukitaViewerRecoveryMessage("mock")).toContain("Mock");
    expect(getLukitaViewerRecoveryMessage("fallback")).toContain("respaldo");
  });
});
