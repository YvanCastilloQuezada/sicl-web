import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Lukita AR Stage presentation contract", () => {
  const source = readFileSync(resolve(process.cwd(), "client/src/pages/LukitaARStagePage.tsx"), "utf8");

  it("exposes the isolated AR capture and placement controls", () => {
    expect(source).toContain("Capturar PNG");
    expect(source).toContain("Grabar MP4");
    expect(source).toContain("video/mp4");
    expect(source).toContain("BoxHelper");
    expect(source).toContain("Mostrar caja de colocación");
    expect(source).toContain("pellizca para escalar");
    expect(source).toContain("onPlaceholderPointerMove");
    expect(source).toContain("Restablecer Lukita");
    expect(source).toContain("recordingCountdown");
  });

  it("exposes live performance telemetry without requiring sensitive APIs", () => {
    expect(source).toContain("Rendimiento");
    expect(source).toContain("performanceStats.fps");
    expect(source).toContain("memoria no expuesta");
  });

  it("persists only local lighting presets and keeps the core boundary explicit", () => {
    expect(source).toContain("lukita-ar-stage-light-presets");
    expect(source).toContain("Color ambiental");
    expect(source).toContain("lightColor");
    expect(source).toContain("sin acceso a resultados, RNG, wallet, ledger ni reglas");
    expect(source).toContain("MJP CORE");
    expect(source).not.toContain("games.reserveTicket");
  });

  it("references the dedicated original device concept asset", () => {
    expect(source).toContain("/manus-storage/lukita-ar-device-concept_43fd0153.png");
    expect(source).toContain("Device concept original");
  });
});
