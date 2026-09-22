import { describe, expect, it } from "vitest";
import { AR_VISUAL_CAPABILITIES, enforceVisionEvidence, VISUAL_PRESETS } from "./arkiVisualIntelligence";
import { ARKI_DEFAULT_DISPLAY_LANGUAGE, displayLanguageInstruction, normalizeArkiDisplayLanguage } from "../shared/arkiDisplayLanguage";

describe("ARKI visual intelligence", () => {
  it("exposes selectable HD, 2K, Full HD, 4K, 8K and 16K visual presets", () => {
    expect(VISUAL_PRESETS.HD.targetWidth).toBe(1280);
    expect(VISUAL_PRESETS.HD.targetHeight).toBe(720);
    expect(VISUAL_PRESETS["2K"].targetWidth).toBe(2560);
    expect(VISUAL_PRESETS["2K"].targetHeight).toBe(1440);
    expect(VISUAL_PRESETS.FULL_HD.targetWidth).toBe(1920);
    expect(VISUAL_PRESETS.FULL_HD.targetHeight).toBe(1080);
    expect(VISUAL_PRESETS["4K"].targetWidth).toBe(3840);
    expect(VISUAL_PRESETS["4K"].targetHeight).toBe(2160);
    expect(VISUAL_PRESETS["4K"].providerDependent).toBe(true);
    expect(VISUAL_PRESETS["8K"].targetWidth).toBe(7680);
    expect(VISUAL_PRESETS["8K"].targetHeight).toBe(4320);
    expect(VISUAL_PRESETS["16K"].targetWidth).toBe(15360);
    expect(VISUAL_PRESETS["16K"].targetHeight).toBe(8640);
    expect(VISUAL_PRESETS["16K"].label).toContain("external render/upscale dependent");
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

  it("defaults every visual output to Spanish and supports explicit localization", () => {
    expect(ARKI_DEFAULT_DISPLAY_LANGUAGE).toBe("es");
    expect(normalizeArkiDisplayLanguage(undefined)).toBe("es");
    expect(normalizeArkiDisplayLanguage("en-US")).toBe("en");
    expect(displayLanguageInstruction("es")).toContain("Español");
    expect(displayLanguageInstruction("en")).toContain("English");
  });
});
