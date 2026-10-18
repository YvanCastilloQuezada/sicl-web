import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "server/controllerLab.ts"), "utf8");

describe("Controller Lab server contract", () => {
  it("persiste tokens únicamente como hashes y separa los tokens de celular y pantalla", () => {
    expect(source).toContain("mobileTokenHash: hashToken(mobileToken)");
    expect(source).toContain("screenTokenHash: hashToken(screenToken)");
    expect(source).toContain("hashToken(input.mobileToken) !== session.mobileTokenHash");
    expect(source).toContain("hashToken(input.screenToken) !== session.screenTokenHash");
  });

  it("impone expiración, vínculo único, idempotencia y frontera del núcleo", () => {
    expect(source).toContain("La sesión ya está vinculada a otro usuario.");
    expect(source).toContain("requestId");
    expect(source).toContain("canSendControllerCommand");
    expect(source).toContain('coreAccess: "NONE"');
    expect(source).not.toMatch(/closeAndDrawRound|reservePilotTicket|wallet|settlement|rng/i);
  });

  it("comparte exclusivamente preferencias visuales con caducidad y auditoría sin tokens", () => {
    expect(source).toContain("shareControllerProfile");
    expect(source).toContain("importSharedControllerProfile");
    expect(source).toContain("controllerSharedProfiles");
    expect(source).toContain("containsSessionTokens: false");
    expect(source).toContain("CONTROLLER_PROFILE_SHARED");
    expect(source).toContain("CONTROLLER_PROFILE_IMPORTED");
    expect(source).toContain("7 * 24 * 60 * 60");
  });

  it("ofrece un código manual temporal hasheado sin registrar su valor ni otorgar autoridad adicional", () => {
    expect(source).toContain("manualLinkCodeHash: hashToken(manualCode)");
    expect(source).toContain("connectControllerSessionWithManualCode");
    expect(source).toContain('manualCode: "REDACTED"');
    expect(source).toContain('coreAccess: "NONE"');
    expect(source).toContain("MANUAL_LINK_CODE_LENGTH = 8");
  });
});
