export type AdvancedCapability = "PATH_TRACING" | "WEBXR" | "CLOUD_RENDER" | "CINEMATIC_POST" | "WALKTHROUGH_VIDEO" | "USDZ_EXPORT" | "VISUAL_COMPARE" | "PROJECT_TIMELAPSE";
export type CapabilityState = "PASS" | "GATED" | "BLOCKED";
export type RenderResolution = "hd" | "fullhd" | "2k" | "4k" | "8k" | "16k";

export const ADVANCED_RENDER_CONTRACT = {
  schema: "ARKI-ADVANCED-RENDER-1.0",
  resolutions: { hd: [1280, 720], fullhd: [1920, 1080], "2k": [2560, 1440], "4k": [3840, 2160], "8k": [7680, 4320], "16k": [15360, 8640] } as Record<RenderResolution, readonly [number, number]>,
  capabilities: ["PATH_TRACING", "WEBXR", "CLOUD_RENDER", "CINEMATIC_POST", "WALKTHROUGH_VIDEO", "USDZ_EXPORT", "VISUAL_COMPARE", "PROJECT_TIMELAPSE"] as const,
  security: { externalCdnImports: false, secretsInBrowser: false, humanReviewRequired: true, coreMutation: "NOT_REQUESTED" as const },
} as const;

export type AdvancedRenderEnvironment = { webgl2?: boolean; xrVr?: boolean; xrAr?: boolean; cloudUrl?: string; cloudTokenConfigured?: boolean; mediaRecorder?: boolean; usdzExporter?: boolean; pathTracerDependency?: boolean };
export type CapabilityAssessment = { capability: AdvancedCapability; state: CapabilityState; reason: string; requiresHumanReview: boolean };

export function assessAdvancedCapabilities(environment: AdvancedRenderEnvironment): CapabilityAssessment[] {
  const pathTracer = environment.webgl2 && environment.pathTracerDependency ? "PASS" : "GATED";
  const webxr = environment.xrVr || environment.xrAr ? "PASS" : "GATED";
  const cloud = environment.cloudUrl && environment.cloudTokenConfigured ? "PASS" : "GATED";
  const cinematic = environment.webgl2 ? "PASS" : "GATED";
  const video = environment.mediaRecorder ? "PASS" : "GATED";
  const usdz = environment.usdzExporter ? "PASS" : "GATED";
  return [
    { capability: "PATH_TRACING", state: pathTracer, reason: pathTracer === "PASS" ? "WebGL2 and an approved local path-tracer adapter are available." : "Requires WebGL2 and an approved installed adapter; no CDN fallback is allowed.", requiresHumanReview: true },
    { capability: "WEBXR", state: webxr, reason: webxr === "PASS" ? "The device reports an immersive VR or AR session." : "Requires a user gesture and a compatible HTTPS device; no emulation is claimed.", requiresHumanReview: true },
    { capability: "CLOUD_RENDER", state: cloud, reason: cloud === "PASS" ? "An authorized render service URL and token are configured server-side." : "Requires an authorized GPU render service; browser code never stores the token.", requiresHumanReview: true },
    { capability: "CINEMATIC_POST", state: cinematic, reason: cinematic === "PASS" ? "WebGL post-processing can run locally at preview quality." : "Requires WebGL2; high-resolution export remains gated.", requiresHumanReview: true },
    { capability: "WALKTHROUGH_VIDEO", state: video, reason: video === "PASS" ? "MediaRecorder is available." : "Requires a browser MediaRecorder implementation and user action.", requiresHumanReview: true },
    { capability: "USDZ_EXPORT", state: usdz, reason: usdz === "PASS" ? "An approved USDZ exporter is available in the browser." : "Requires an approved exporter; no server-side polyfill is claimed.", requiresHumanReview: true },
    { capability: "VISUAL_COMPARE", state: "PASS", reason: "The deterministic four-version comparison contract is available.", requiresHumanReview: true },
    { capability: "PROJECT_TIMELAPSE", state: "PASS", reason: "Version snapshots can be replayed without mutating Core.", requiresHumanReview: true },
  ];
}

export function validateRenderRequest(input: { resolution: RenderResolution; samples?: number }) {
  const [width, height] = ADVANCED_RENDER_CONTRACT.resolutions[input.resolution];
  const samples = Math.max(1, Math.min(5000, Math.floor(input.samples ?? 200)));
  return { resolution: input.resolution, width, height, samples, persistence: "PROPOSAL_ONLY" as const, humanReviewRequired: true as const };
}
