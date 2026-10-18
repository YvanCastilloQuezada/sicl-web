export type SpatialArCapability = "CAMERA_OVERLAY" | "IMMERSIVE_AR" | "WORLD_TRACKING" | "HIT_TEST" | "DOM_OVERLAY" | "SPATIAL_ANCHORING";
export type SpatialArState = "UNAVAILABLE" | "CAPABILITY_CHECK" | "READY" | "RUNNING" | "DEGRADED" | "STOPPED";

export type SpatialArReport = {
  state: SpatialArState;
  capabilities: Record<SpatialArCapability, boolean>;
  requiredFeatures: string[];
  optionalFeatures: string[];
  epistemicBoundary: string;
};

export const SPATIAL_AR_REQUIRED_FEATURES = ["local-floor"] as const;
export const SPATIAL_AR_OPTIONAL_FEATURES = ["hit-test", "dom-overlay", "anchors"] as const;

export function spatialArCatalog() {
  return {
    version: "ARKI-SPATIAL-AR-1.0",
    mode: "WEBXR_OPTIONAL_WITH_DEGRADED_FALLBACK",
    capabilities: ["CAMERA_OVERLAY", "IMMERSIVE_AR", "WORLD_TRACKING", "HIT_TEST", "DOM_OVERLAY", "SPATIAL_ANCHORING"],
    requiredFeatures: [...SPATIAL_AR_REQUIRED_FEATURES],
    optionalFeatures: [...SPATIAL_AR_OPTIONAL_FEATURES],
    humanReviewRequired: true,
    note: "WebXR availability is device/browser dependent; capability detection never implies successful spatial anchoring.",
  } as const;
}

export async function inspectSpatialArCapabilities(): Promise<SpatialArReport> {
  const xr = typeof navigator !== "undefined" ? (navigator as Navigator & { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } }).xr : undefined;
  if (!xr?.isSessionSupported) return unavailableReport("WebXR is not exposed by this browser");
  try {
    const immersiveAr = await xr.isSessionSupported("immersive-ar");
    return {
      state: immersiveAr ? "READY" : "DEGRADED",
      capabilities: { CAMERA_OVERLAY: Boolean(navigator.mediaDevices?.getUserMedia), IMMERSIVE_AR: immersiveAr, WORLD_TRACKING: immersiveAr, HIT_TEST: immersiveAr, DOM_OVERLAY: immersiveAr, SPATIAL_ANCHORING: false },
      requiredFeatures: [...SPATIAL_AR_REQUIRED_FEATURES], optionalFeatures: [...SPATIAL_AR_OPTIONAL_FEATURES],
      epistemicBoundary: immersiveAr ? "Device reports immersive-ar support; tracking quality and anchors still require runtime validation." : "Camera/orientation fallback only; no world tracking or anchor is declared.",
    };
  } catch { return unavailableReport("WebXR capability check failed closed"); }
}

function unavailableReport(reason: string): SpatialArReport {
  return { state: "UNAVAILABLE", capabilities: { CAMERA_OVERLAY: Boolean(typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia), IMMERSIVE_AR: false, WORLD_TRACKING: false, HIT_TEST: false, DOM_OVERLAY: false, SPATIAL_ANCHORING: false }, requiredFeatures: [...SPATIAL_AR_REQUIRED_FEATURES], optionalFeatures: [...SPATIAL_AR_OPTIONAL_FEATURES], epistemicBoundary: reason };
}

export function spatialArSessionOptions(overlayRoot?: Element) {
  return { requiredFeatures: [...SPATIAL_AR_REQUIRED_FEATURES], optionalFeatures: [...SPATIAL_AR_OPTIONAL_FEATURES], ...(overlayRoot ? { domOverlay: { root: overlayRoot } } : {}) };
}
