import { describe, expect, it } from "vitest";
import { interpretFieldIntent, isForbiddenCanonicalAction } from "./milukitaFieldCopilot";
import { hasVersionConflict, isPublishableEvidence, validateFieldGeo } from "./milukitaTerritorialEvidence";
import { selectiveAbsorptionManifest } from "./milukitaSelectiveAbsorption";

describe("MiLukita selective absorption for ARKI", () => {
  it("keeps the original product and records the exact transfer source", () => {
    const manifest = selectiveAbsorptionManifest();
    expect(manifest.originalProductPreserved).toBe(true);
    expect(manifest.deletionScope).toBe("ARKI_COPY_ONLY");
    expect(manifest.absorbed).toContain("FIELD_VOICE_INTENT_CONTRACT");
    expect(manifest.excluded).toContain("MJP_CORE");
  });

  it("interprets controlled field commands without granting canonical authority", () => {
    const result = interpretFieldIntent("toma una foto del acceso", "INT-001");
    expect(result.intent).toBe("CAPTURE_PHOTO");
    expect(result.capability).toBe("WRITE");
    expect(result.needsClarification).toBe(false);
    expect(isForbiddenCanonicalAction("PUBLISH")).toBe(true);
    expect(isForbiddenCanonicalAction("CAPTURE_PHOTO")).toBe(false);
  });

  it("preserves evidence quality, offline conflicts and publication gates", () => {
    expect(validateFieldGeo({ latitude: "-8.111", longitude: "-79.028", accuracyMeters: 12 }).valid).toBe(true);
    expect(validateFieldGeo({ latitude: "999", longitude: "-79.028", accuracyMeters: 12 }).valid).toBe(false);
    expect(hasVersionConflict(2, 3)).toBe(true);
    expect(isPublishableEvidence("VERIFIED", 1, 1)).toBe(true);
    expect(isPublishableEvidence("CAPTURED", 1, 1)).toBe(false);
  });
});
