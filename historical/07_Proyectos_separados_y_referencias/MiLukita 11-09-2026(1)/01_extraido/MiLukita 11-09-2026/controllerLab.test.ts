import { describe, expect, it } from "vitest";
import { canCreateControllerSession, canSendControllerCommand, CONTROLLER_CORE_BOUNDARY } from "./controllerLab";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const controllerSource = readFileSync(resolve(process.cwd(), "client/src/pages/TouchRemotePage.tsx"), "utf8");

describe("Controller Lab security contract", () => {
  it("permite crear sesiones solo a presentador u operador", () => {
    expect(canCreateControllerSession("USER")).toBe(false);
    expect(canCreateControllerSession("PRESENTER")).toBe(true);
    expect(canCreateControllerSession("OPERATOR")).toBe(true);
  });

  it("separa los comandos de presentación de la autoridad del núcleo", () => {
    expect(canSendControllerCommand("USER", "NAVIGATE")).toBe(true);
    expect(canSendControllerCommand("USER", "TEXT")).toBe(true);
    expect(canSendControllerCommand("USER", "PLAYBACK")).toBe(false);
    expect(canSendControllerCommand("PRESENTER", "QR_VISIBILITY")).toBe(true);
    expect(CONTROLLER_CORE_BOUNDARY).toContain("RNG");
    expect(CONTROLLER_CORE_BOUNDARY).toContain("SETTLEMENT");
    expect(CONTROLLER_CORE_BOUNDARY).toContain("MJP_TV_MANIFEST");
  });
});

describe("Controller Lab · Lukita Live surfaces", () => {
  it("expone un generador de Experience QR de prueba separado del Control QR", () => {
    expect(controllerSource).toContain("Generador QR dinámico");
    expect(controllerSource).toContain("no es Control QR");
    expect(controllerSource).toContain("testQr=1");
  });

  it("mantiene LukitaPoint en borrador o revisión y exige consentimiento", () => {
    expect(controllerSource).toContain("Borrador de publicación");
    expect(controllerSource).toContain("Enviar a revisión");
    expect(controllerSource).toContain("aprobación humana");
  });

  it("expone la vista de anchors sin declarar aprobación del personaje", () => {
    expect(controllerSource).toContain("Vista previa de anchors");
    expect(controllerSource).toContain("Referencia conceptual · no asset final");
    expect(controllerSource).toContain("aprobación humana pendiente");
  });
});
