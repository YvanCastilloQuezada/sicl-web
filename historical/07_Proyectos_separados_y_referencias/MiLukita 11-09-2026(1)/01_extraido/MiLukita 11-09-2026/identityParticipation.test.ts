import { describe, expect, it } from "vitest";
import { CORE_IMPACT_TARGET, PREMIUM_ACTIVATION, REGULATED_LAYER, evaluateEligibility, isAllowedParticipationTransition, normalizeDeviceHash } from "./identityParticipation";

describe("Milukita Identity & Participation contract", () => {
  it("mantiene Premium deshabilitado y la capa regulada bloqueada", () => {
    expect(PREMIUM_ACTIVATION).toBe("DISABLED");
    expect(REGULATED_LAYER).toBe("BLOCKED");
    expect(CORE_IMPACT_TARGET).toBe(0);
  });
  it("permite Free sólo con evento abierto y sesión activa", () => {
    expect(evaluateEligibility({ identityLevel: "FREE", verificationStatus: "BASIC", eventIsOpen: true, freeParticipationAllowed: true, sessionActive: true })).toMatchObject({ eligible: true, reason: "FREE_ALLOWED", claims: {} });
    expect(evaluateEligibility({ identityLevel: "FREE", verificationStatus: "BASIC", eventIsOpen: false, freeParticipationAllowed: true, sessionActive: true }).reason).toBe("EVENT_CLOSED");
    expect(evaluateEligibility({ identityLevel: "FREE", verificationStatus: "BASIC", eventIsOpen: true, freeParticipationAllowed: true, sessionActive: false }).reason).toBe("SESSION_INACTIVE");
  });
  it("rechaza Premium y verificación insuficiente sin crear claims", () => {
    expect(evaluateEligibility({ identityLevel: "VERIFIED_PREMIUM_READY", verificationStatus: "VERIFIED", eventIsOpen: true, freeParticipationAllowed: true, premiumRequired: true, sessionActive: true })).toMatchObject({ eligible: false, reason: "PREMIUM_DISABLED", claims: {} });
    expect(evaluateEligibility({ identityLevel: "FREE", verificationStatus: "UNVERIFIED", eventIsOpen: true, freeParticipationAllowed: true, sessionActive: true })).toMatchObject({ eligible: false, reason: "VERIFICATION_REQUIRED", claims: {} });
  });
  it("normaliza identificadores de dispositivo sin PII ni caracteres inseguros", () => {
    expect(normalizeDeviceHash("  Device/ABC + email@example.com  ")).toBe("deviceabcemailexamplecom");
    expect(normalizeDeviceHash("a".repeat(200))).toHaveLength(128);
  });
  it("acepta sólo transiciones de participación autorizadas", () => {
    expect(isAllowedParticipationTransition("CREATED", "IDENTIFIED")).toBe(true);
    expect(isAllowedParticipationTransition("IDENTIFIED", "ELIGIBLE")).toBe(true);
    expect(isAllowedParticipationTransition("COMPLETED", "STARTED")).toBe(false);
    expect(isAllowedParticipationTransition("EXPIRED", "COMPLETED")).toBe(false);
  });
});
