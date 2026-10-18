import { describe, expect, it } from "vitest";
import { canPublishWorldObject, canTransitionWorldObject, isRuntimeVisible } from "./territorialTrust";

describe("territorial trust workflow", () => {
  it("permite el flujo captura → revisión → verificación → publicación", () => {
    expect(canTransitionWorldObject("CAPTURED", "UNDER_REVIEW")).toBe(true);
    expect(canTransitionWorldObject("UNDER_REVIEW", "VERIFIED")).toBe(true);
    expect(canTransitionWorldObject("VERIFIED", "PUBLISHED")).toBe(true);
  });

  it("bloquea saltos que omiten la revisión", () => {
    expect(canTransitionWorldObject("CAPTURED", "PUBLISHED")).toBe(false);
    expect(canTransitionWorldObject("DRAFT", "VERIFIED")).toBe(false);
    expect(canTransitionWorldObject("ARCHIVED", "PUBLISHED")).toBe(false);
  });

  it("exige verificación, confianza, evidencia y fuente para publicar", () => {
    expect(canPublishWorldObject("VERIFIED", 1, 1, 1)).toBe(true);
    expect(canPublishWorldObject("VERIFIED", 0, 1, 1)).toBe(false);
    expect(canPublishWorldObject("VERIFIED", 1, 0, 1)).toBe(false);
    expect(canPublishWorldObject("UNDER_REVIEW", 1, 1, 1)).toBe(false);
  });

  it("expone al Runtime únicamente el estado PUBLISHED", () => {
    expect(isRuntimeVisible("PUBLISHED")).toBe(true);
    expect(isRuntimeVisible("CAPTURED")).toBe(false);
    expect(isRuntimeVisible("VERIFIED")).toBe(false);
  });
});
