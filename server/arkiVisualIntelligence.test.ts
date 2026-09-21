import { describe, expect, it } from "vitest";
import { AR_VISUAL_CAPABILITIES, enforceVisionEvidence, VISUAL_PRESETS } from "./arkiVisualIntelligence";

describe("ARKI visual intelligence", () => {
  it("exposes selectable Full HD and 4K visual presets", () => {
    expect(VISUAL_PRESETS.FULL_HD.targetWidth).toBe(1920);
    expect(VISUAL_PRESETS.FULL_HD.targetHeight).toBe(1080);
    expect(VISUAL_PRESETS["4K"].targetWidth).toBe(3840);
    expect(VISUAL_PRESETS["4K"].targetHeight).toBe(2160);
    expect(VISUAL_PRESETS["4K"].providerDependent).toBe(true);
  });

  it("keeps photorealistic output as a proposed visual, not a verified fact", () => {
    expect(AR_VISUAL_CAPABILITIES).toContain("photorealistic_reference_render");
    expect(AR_VISUAL_CAPABILITIES).toContain("occlusion_and_scale_require_device_validation");
  });

  it("forces unsupported vision claims to UNKNOWN", () => {
    const [claim] = enforceVisionEvidence([{ claimId: "V-1", observation: "", evidence: "NOT_OBSERVED", qualifier: "EXACT", confidence: "HIGH", status: "AI_PROPOSED", humanReviewRequired: true }]);
    expect(claim.evidence).toBe("NOT_OBSERVED");
    expect(claim.qualifier).toBe("UNKNOWN");
    expect(claim.confidence).toBe("LOW");
    expect(claim.humanReviewRequired).toBe(true);
  });
});
