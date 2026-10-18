import { describe, expect, it } from "vitest";
import {
  ALLOWED_AVATAR_MIME_TYPES,
  CORE_IMPACT_TARGET,
  NOTIFICATION_PREFERENCE_KEYS,
  PREMIUM_ACTIVATION,
  REGULATED_LAYER,
  isAllowedAvatarMimeType,
  isValidAvatarDataUrl,
} from "./identityParticipation";

describe("profile and session feature contracts", () => {
  it("accepts only the supported avatar MIME types", () => {
    expect(ALLOWED_AVATAR_MIME_TYPES).toEqual(["image/jpeg", "image/png", "image/webp"]);
    expect(isAllowedAvatarMimeType("image/jpeg")).toBe(true);
    expect(isAllowedAvatarMimeType("image/png")).toBe(true);
    expect(isAllowedAvatarMimeType("image/webp")).toBe(true);
    expect(isAllowedAvatarMimeType("image/svg+xml")).toBe(false);
    expect(isAllowedAvatarMimeType("application/pdf")).toBe(false);
  });

  it("rejects mismatched or malformed avatar data URLs", () => {
    expect(isValidAvatarDataUrl("data:image/png;base64,ZmFrZQ==", "image/png")).toBe(true);
    expect(isValidAvatarDataUrl("data:image/png;base64,ZmFrZQ==", "image/jpeg")).toBe(false);
    expect(isValidAvatarDataUrl("data:image/svg+xml;base64,ZmFrZQ==", "image/svg+xml")).toBe(false);
    expect(isValidAvatarDataUrl("not-a-data-url", "image/png")).toBe(false);
  });

  it("keeps the five notification preferences explicit and complete", () => {
    expect(NOTIFICATION_PREFERENCE_KEYS).toHaveLength(5);
    expect(new Set(NOTIFICATION_PREFERENCE_KEYS).size).toBe(5);
    expect(NOTIFICATION_PREFERENCE_KEYS).toContain("criticalExpiryEnabled");
    expect(NOTIFICATION_PREFERENCE_KEYS).toContain("sessionAlertsEnabled");
  });

  it("preserves the protected-core boundary", () => {
    expect(CORE_IMPACT_TARGET).toBe(0);
    expect(PREMIUM_ACTIVATION).toBe("DISABLED");
    expect(REGULATED_LAYER).toBe("BLOCKED");
  });
});

