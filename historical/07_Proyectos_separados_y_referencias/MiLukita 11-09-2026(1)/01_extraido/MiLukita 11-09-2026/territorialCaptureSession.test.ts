import { describe, expect, it } from "vitest";
import {
  CAPTURE_SESSION_STATUSES,
  CAPTURE_SYNC_STATUSES,
  canPublishWorldObject,
  canTransitionWorldObject,
  isRuntimeVisible,
} from "./territorialTrust";

describe("CaptureSession territorial contract", () => {
  it("defines the complete lifecycle without exposing a public runtime state", () => {
    expect(CAPTURE_SESSION_STATUSES).toEqual(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]);
    expect(CAPTURE_SYNC_STATUSES).toEqual(["OFFLINE", "PENDING", "SYNCED", "CONFLICT"]);
    expect(isRuntimeVisible("CAPTURED")).toBe(false);
    expect(isRuntimeVisible("PUBLISHED")).toBe(true);
  });

  it("keeps imported records in the controlled workflow", () => {
    expect(canTransitionWorldObject("CAPTURED", "UNDER_REVIEW")).toBe(true);
    expect(canTransitionWorldObject("CAPTURED", "PUBLISHED")).toBe(false);
    expect(canTransitionWorldObject("VERIFIED", "PUBLISHED")).toBe(true);
    expect(canPublishWorldObject("CAPTURED", 100, 4, 2)).toBe(false);
  });

  it("does not allow publication without the minimum evidence gate", () => {
    expect(canPublishWorldObject("VERIFIED", 0, 1, 1)).toBe(false);
    expect(canPublishWorldObject("VERIFIED", 1, 0, 1)).toBe(false);
    expect(canPublishWorldObject("VERIFIED", 1, 1, 0)).toBe(false);
    expect(canPublishWorldObject("VERIFIED", 1, 1, 1)).toBe(true);
  });
});
