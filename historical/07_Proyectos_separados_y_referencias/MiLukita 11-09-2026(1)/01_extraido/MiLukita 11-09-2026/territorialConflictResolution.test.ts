import { describe, expect, it } from "vitest";
import { CONFLICT_RESOLUTIONS, canPublishWorldObject, shouldPreserveConflict } from "./territorialTrust";

describe("territorial conflict resolution", () => {
  it("exposes only explicit human-review resolutions", () => {
    expect(CONFLICT_RESOLUTIONS).toEqual(["KEEP_LOCAL", "KEEP_REMOTE", "MERGE", "MARK_DISPUTED"]);
    expect(CONFLICT_RESOLUTIONS).not.toContain("LAST_WRITE_WINS");
  });

  it("requires preserving divergent versions", () => {
    expect(shouldPreserveConflict(3, 4)).toBe(true);
    expect(shouldPreserveConflict(3, 3)).toBe(false);
  });

  it("does not treat verification alone as publication", () => {
    expect(canPublishWorldObject("VERIFIED", 1, 1, 1)).toBe(true);
    expect(canPublishWorldObject("CAPTURED", 1, 1, 1)).toBe(false);
  });
});
