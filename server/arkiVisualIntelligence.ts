import { generateImage, type GenerateImageResponse } from "./_core/imageGeneration";
import { ARKI_DEFAULT_DISPLAY_LANGUAGE, type ArkiDisplayLanguage, displayLanguageInstruction } from "../shared/arkiDisplayLanguage";

export type VisualQuality = "HD" | "2K" | "FULL_HD" | "4K" | "8K" | "16K";
export type VisualPurpose = "EXTERIOR_RENDER" | "INTERIOR_RENDER" | "MATERIAL_STUDY" | "AR_OVERLAY" | "SITE_CONTEXT";
export type VisualPreset = { quality: VisualQuality; providerQuality: "medium" | "high"; targetWidth: number; targetHeight: number; label: string; providerDependent: true };

export const VISUAL_PRESETS: Record<VisualQuality, VisualPreset> = {
  HD: { quality: "HD", providerQuality: "high", targetWidth: 1280, targetHeight: 720, label: "HD · 1280 × 720", providerDependent: true },
  "2K": { quality: "2K", providerQuality: "high", targetWidth: 2560, targetHeight: 1440, label: "2K QHD · 2560 × 1440", providerDependent: true },
  FULL_HD: { quality: "FULL_HD", providerQuality: "high", targetWidth: 1920, targetHeight: 1080, label: "Full HD · 1920 × 1080", providerDependent: true },
  "4K": { quality: "4K", providerQuality: "high", targetWidth: 3840, targetHeight: 2160, label: "4K UHD · 3840 × 2160", providerDependent: true },
  "8K": { quality: "8K", providerQuality: "high", targetWidth: 7680, targetHeight: 4320, label: "8K UHD · 7680 × 4320 · provider/upscale dependent", providerDependent: true },
  "16K": { quality: "16K", providerQuality: "high", targetWidth: 15360, targetHeight: 8640, label: "16K · 15360 × 8640 · external render/upscale dependent", providerDependent: true },
};

export type VisualGenerationRequest = { prompt: string; quality: VisualQuality; purpose: VisualPurpose; language?: ArkiDisplayLanguage; referenceImageUrl?: string; preserveGeometry?: boolean; projectId?: string };
export type ArkiGeneratedVisual = GenerateImageResponse & { quality: VisualQuality; requestedResolution: string; purpose: VisualPurpose; language: ArkiDisplayLanguage; status: "AI_PROPOSED_VISUAL"; providerResolutionVerified: false; humanReviewRequired: true; limitations: string[] };

function visualSafetyPrompt(request: VisualGenerationRequest, preset: VisualPreset): string {
  const language = request.language ?? ARKI_DEFAULT_DISPLAY_LANGUAGE;
  return [
    "Create a photorealistic architectural visualization for ARKI.",
    `Purpose: ${request.purpose}.`,
    `Requested target: ${preset.label}.`,
    displayLanguageInstruction(language),
    "Preserve the supplied architectural geometry, massing, openings, levels and site relationships when a reference is provided.",
    "Do not invent hidden rooms, dimensions, structural systems, code compliance, ownership, site boundaries or materials that are not stated or visibly referenced.",
    "If a referenced property is uncertain, keep it visually neutral and flag it for human review rather than fabricating detail.",
    "Photorealistic camera, physically plausible daylight, materials, scale cues and context; no text, logos or watermarks.",
    request.preserveGeometry === false ? "Conceptual visual exploration is allowed, but the result must be labeled as a visual proposal." : "Geometry fidelity has priority over decorative invention.",
    request.prompt,
  ].join(" ");
}

export async function generateArkiPhotorealisticVisual(request: VisualGenerationRequest): Promise<ArkiGeneratedVisual> {
  const preset = VISUAL_PRESETS[request.quality];
  const result = await generateImage({ prompt: visualSafetyPrompt(request, preset), quality: preset.providerQuality, originalImages: request.referenceImageUrl ? [{ url: request.referenceImageUrl, mimeType: "image/jpeg" }] : undefined });
  return { ...result, quality: request.quality, requestedResolution: `${preset.targetWidth}x${preset.targetHeight}`, purpose: request.purpose, language: request.language ?? ARKI_DEFAULT_DISPLAY_LANGUAGE, status: "AI_PROPOSED_VISUAL", providerResolutionVerified: false, humanReviewRequired: true, limitations: ["provider may return a different native size", "8K/16K may require a separate approved upscale or external render worker", "visual appearance does not prove dimensions or code compliance", "architectural and material fidelity requires human review"] };
}

export type VisionClaim = { claimId: string; observation: string; evidence: "VISIBLE_IN_IMAGE" | "LEGIBLE_TEXT" | "MEASURED_METADATA" | "NOT_OBSERVED"; qualifier: "EXACT" | "APPROXIMATE" | "RANGE" | "UNKNOWN"; confidence: "HIGH" | "MEDIUM" | "LOW"; status: "AI_PROPOSED"; humanReviewRequired: true };
export function enforceVisionEvidence(claims: VisionClaim[]): VisionClaim[] {
  return claims.map((claim) => {
    const evidence = claim.evidence;
    const unsupported = evidence === "NOT_OBSERVED" || claim.observation.trim().length === 0;
    return { ...claim, evidence: unsupported ? "NOT_OBSERVED" : evidence, qualifier: unsupported ? "UNKNOWN" : claim.qualifier, confidence: unsupported ? "LOW" : claim.confidence, status: "AI_PROPOSED", humanReviewRequired: true };
  });
}

export const AR_VISUAL_CAPABILITIES = ["camera_context_overlay", "photorealistic_reference_render", "two_stake_calibration", "geospatial_anchor_candidate", "WebXR_optional", "occlusion_and_scale_require_device_validation"] as const;
