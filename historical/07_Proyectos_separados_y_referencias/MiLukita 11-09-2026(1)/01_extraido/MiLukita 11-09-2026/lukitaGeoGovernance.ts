export const GEO_RETENTION_DAYS = 30;

export type GeoReviewState = "LOCAL_DRAFT" | "HUMAN_REVIEW_REQUIRED" | "APPROVED_FOR_PILOT" | "REJECTED";
export type GeoReviewerRole = "operator" | "presenter" | "admin";

export type GeoSceneGovernance = {
  sceneId: string;
  reviewState: GeoReviewState;
  ownerRole: GeoReviewerRole;
  reviewerRole?: GeoReviewerRole;
  createdAt: number;
  expiresAt: number;
  coordinatesPrecision: "approximate" | "exact";
  publishable: false;
  coreWrite: false;
};

export function createGeoGovernance(sceneId: string, now = Date.now()): GeoSceneGovernance {
  return {
    sceneId,
    reviewState: "LOCAL_DRAFT",
    ownerRole: "operator",
    createdAt: now,
    expiresAt: now + GEO_RETENTION_DAYS * 24 * 60 * 60 * 1000,
    coordinatesPrecision: "approximate",
    publishable: false,
    coreWrite: false,
  };
}

export function requestHumanReview(record: GeoSceneGovernance, reviewerRole: GeoReviewerRole): GeoSceneGovernance {
  if (reviewerRole === record.ownerRole) {
    throw new Error("SEPARATION_OF_DUTIES_REQUIRED");
  }
  return { ...record, reviewerRole, reviewState: "HUMAN_REVIEW_REQUIRED" };
}

export function isGeoRecordExpired(record: GeoSceneGovernance, now = Date.now()): boolean {
  return now >= record.expiresAt;
}

export function canPublishGeoScene(_record: GeoSceneGovernance): false {
  return false;
}

export function canWriteMjpCore(_record: GeoSceneGovernance): false {
  return false;
}
