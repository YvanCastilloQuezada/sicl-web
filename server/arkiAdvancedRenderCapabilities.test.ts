import { describe, expect, it } from "vitest";
import { ADVANCED_RENDER_CONTRACT, assessAdvancedCapabilities, validateRenderRequest } from "../shared/arkiAdvancedRenderCapabilities";

describe("ARKI advanced render capabilities", () => {
  it("exposes all eight capabilities with fail-closed states", () => {
    const result = assessAdvancedCapabilities({ webgl2: true, mediaRecorder: true });
    expect(result).toHaveLength(8);
    expect(result.find((item) => item.capability === "VISUAL_COMPARE")?.state).toBe("PASS");
    expect(result.find((item) => item.capability === "WEBXR")?.state).toBe("GATED");
    expect(result.find((item) => item.capability === "CLOUD_RENDER")?.state).toBe("GATED");
  });
  it("validates every supported resolution and caps samples", () => {
    for (const resolution of Object.keys(ADVANCED_RENDER_CONTRACT.resolutions) as Array<keyof typeof ADVANCED_RENDER_CONTRACT.resolutions>) {
      const result = validateRenderRequest({ resolution, samples: 999999 });
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.samples).toBe(5000);
      expect(result.humanReviewRequired).toBe(true);
      expect(result.persistence).toBe("PROPOSAL_ONLY");
    }
  });
  it("does not claim an external CDN or browser secret", () => {
    expect(ADVANCED_RENDER_CONTRACT.security.externalCdnImports).toBe(false);
    expect(ADVANCED_RENDER_CONTRACT.security.secretsInBrowser).toBe(false);
  });
});
