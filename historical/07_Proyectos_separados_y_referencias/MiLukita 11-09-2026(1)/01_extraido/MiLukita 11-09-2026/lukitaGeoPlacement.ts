export const SCENE_TYPES = ["AR_LUKITA", "AR_KIKO", "TV_COMPANION"] as const;
export type SceneType = (typeof SCENE_TYPES)[number];
export const VISIBILITY_MODES = ["PRIVATE", "UNLISTED", "PUBLIC_REVIEW"] as const;
export type VisibilityMode = (typeof VISIBILITY_MODES)[number];

export type LukitaGeoDraft = {
  name: string;
  type: SceneType;
  latitude: number | null;
  longitude: number | null;
  heightMeters: number;
  scale: number;
  orientationDegrees: number;
  visibility: VisibilityMode;
};

export function validateGeoDraft(draft: LukitaGeoDraft) {
  const hasCoordinates = draft.latitude !== null && draft.longitude !== null;
  const coordinatesValid = !hasCoordinates || (draft.latitude! >= -90 && draft.latitude! <= 90 && draft.longitude! >= -180 && draft.longitude! <= 180);
  const dimensionsValid = draft.heightMeters >= 0.2 && draft.heightMeters <= 8 && draft.scale >= 0.1 && draft.scale <= 4;
  const requiresReview = draft.visibility === "PUBLIC_REVIEW";
  return {
    hasCoordinates,
    coordinatesValid,
    dimensionsValid,
    requiresReview,
    canSaveLocalDraft: hasCoordinates && coordinatesValid && dimensionsValid,
    canPublish: false,
    reason: !hasCoordinates ? "LOCATION_REQUIRED" : !coordinatesValid ? "INVALID_COORDINATES" : !dimensionsValid ? "INVALID_DIMENSIONS" : requiresReview ? "HUMAN_REVIEW_REQUIRED" : "LOCAL_DRAFT_ONLY",
  } as const;
}

export function isGeoPlacementPresentationOnly() {
  return { readsLocation: true, storesLocally: true, publishesAutomatically: false, writesMjpCore: false, accessesWallet: false, accessesRng: false } as const;
}
