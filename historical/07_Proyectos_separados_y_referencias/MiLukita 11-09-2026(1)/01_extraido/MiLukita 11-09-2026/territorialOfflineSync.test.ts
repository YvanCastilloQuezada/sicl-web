import { describe, expect, it } from "vitest";
import { canSyncOfflineCapture, shouldPreserveConflict } from "./territorialTrust";

describe("territorial offline synchronization", () => {
  it("only allows offline and pending captures to sync", () => {
    expect(canSyncOfflineCapture("OFFLINE")).toBe(true);
    expect(canSyncOfflineCapture("PENDING_SYNC")).toBe(true);
    expect(canSyncOfflineCapture("SYNCED")).toBe(false);
    expect(canSyncOfflineCapture("CONFLICT")).toBe(false);
    expect(canSyncOfflineCapture("REJECTED")).toBe(false);
  });

  it("preserves a conflict whenever local and server versions differ", () => {
    expect(shouldPreserveConflict(4, 4)).toBe(false);
    expect(shouldPreserveConflict(4, 5)).toBe(true);
    expect(shouldPreserveConflict(5, 4)).toBe(true);
  });
});
