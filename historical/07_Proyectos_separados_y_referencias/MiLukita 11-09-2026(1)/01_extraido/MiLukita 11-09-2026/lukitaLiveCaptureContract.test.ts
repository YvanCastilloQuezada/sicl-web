import { describe, expect, it } from "vitest";
import { LUKITA_LIVE_CAPTURE_CONTRACT, isExplicitLukitaLiveShareFlow } from "./lukitaLiveCaptureContract";

describe("Lukita Live capture contract", () => {
  it("supports front/rear camera and photo/video modes", () => {
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.cameras).toEqual(["front", "rear"]);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.modes).toEqual(["photo", "video"]);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.output.preferredVideoContainer).toBe("mp4");
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.output.browserFallback).toBe("webm");
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.preCapture.countdownSeconds).toBe(3);
  });

  it("requires explicit permission, review and sharing", () => {
    expect(isExplicitLukitaLiveShareFlow()).toBe(true);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.privacy.noAutomaticPublication).toBe(true);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.privacy.noIdentityRecognition).toBe(true);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.privacy.noGameTruthAccess).toBe(true);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.review.requiredBeforeShare).toBe(true);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.review.discardAllowed).toBe(true);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.share.userInitiatedOnly).toBe(true);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.share.automaticUpload).toBe(false);
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.share.destinations).toContain("instagram");
    expect(LUKITA_LIVE_CAPTURE_CONTRACT.share.destinations).toContain("tiktok");
  });
});
