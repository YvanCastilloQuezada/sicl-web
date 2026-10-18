import { describe, expect, it } from "vitest";
import { canPublishWorldObject, canSyncOfflineCapture, canTransitionWorldObject, shouldPreserveConflict } from "./territorialTrust";

describe("World Engine guardrails", () => {
  it("does not allow captured objects to jump directly to publication", () => {
    expect(canTransitionWorldObject("CAPTURED", "PUBLISHED")).toBe(false);
    expect(canPublishWorldObject("CAPTURED", 100, 10, 10)).toBe(false);
  });

  it("requires human review when a local base version diverges", () => {
    expect(shouldPreserveConflict(2, 3)).toBe(true);
    expect(canSyncOfflineCapture("CONFLICT")).toBe(false);
  });

  it("keeps a verified object on the explicit publication path", () => {
    expect(canTransitionWorldObject("VERIFIED", "PUBLISHED")).toBe(true);
    expect(canPublishWorldObject("VERIFIED", 1, 1, 1)).toBe(true);
  });
});
