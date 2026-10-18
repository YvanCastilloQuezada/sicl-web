import { describe, expect, it } from "vitest";
import { CHARACTER_REGISTRY, LUKITA_PROFILE, canCharacterAppear, canTransitionCharacterState, characterCanMutateCore, choosePresentationFallback, createCharacterAuditEvent, isSilentCharacterPresentation } from "./characterOs";

describe("Character OS governance", () => {
  it("keeps Lukita as the active main host and agents without Core authority", () => {
    expect(LUKITA_PROFILE.role).toBe("MAIN_HOST");
    expect(LUKITA_PROFILE.status).toBe("ACTIVE");
    expect(characterCanMutateCore()).toBe(false);
  });
  it("allows only declared state transitions and silent result/emergency", () => {
    expect(canTransitionCharacterState("PRESENTING", "WAITING")).toBe(true);
    expect(canTransitionCharacterState("RESULT", "PRESENTING")).toBe(false);
    expect(isSilentCharacterPresentation("RESULT")).toBe(true);
    expect(isSilentCharacterPresentation("PRESENTING")).toBe(false);
  });
  it("uses policy and channel compatibility before appearance", () => {
    const lukita = CHARACTER_REGISTRY.find((character) => character.characterId === "lukita-main");
    const ruli = CHARACTER_REGISTRY.find((character) => character.characterId === "ruli");
    expect(lukita && canCharacterAppear(lukita, "TRIVIA_DEMO", "TV")).toBe(true);
    expect(lukita && canCharacterAppear(lukita, "TRIVIA_DEMO", "SOCIAL")).toBe(false);
    expect(ruli && canCharacterAppear(ruli, "TRIVIA_DEMO", "TV")).toBe(false);
    expect(choosePresentationFallback(["TWO_D", "STATIC_CARD"])).toBe("TWO_D");
    expect(createCharacterAuditEvent({ type: "CASTING_DECISION", eventId: "TRIVIA_DEMO", characterId: "lukita-main", decisionSource: "POLICY", policyVersion: "1.0", reason: "canal autorizado", timestamp: "2026-08-27T00:00:00.000Z" }).timestamp).toBe("2026-08-27T00:00:00.000Z");
  });
});
