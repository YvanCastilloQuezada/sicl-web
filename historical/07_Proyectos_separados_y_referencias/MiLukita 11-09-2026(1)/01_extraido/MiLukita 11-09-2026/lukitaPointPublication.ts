export type LukitaPointPrivacy = "PRIVATE" | "UNLISTED" | "PUBLIC";
export type LukitaPointReviewStatus = "DRAFT" | "REVIEW" | "APPROVED" | "REJECTED";

export const LUKITA_POINT_PUBLICATION_CONTRACT = {
  version: "LUKITA-POINT-PUBLICATION-01",
  ownerSurface: "CONTROLLER_LAB",
  defaultPrivacy: "PRIVATE" as const,
  allowedPrivacy: ["PRIVATE", "UNLISTED", "PUBLIC"] as const,
  controllerSubmissionStatus: ["DRAFT", "REVIEW"] as const,
  requiresHumanApprovalFor: ["APPROVED", "ACTIVE", "PUBLIC"] as const,
  neverAutomatic: true,
  protectedSurfaces: ["MJP_CORE", "RNG", "RESULTS", "WALLET", "LEDGER", "SETTLEMENT"] as const,
} as const;

export type LukitaPointReviewInput = {
  name: string;
  privacy: LukitaPointPrivacy;
  status: LukitaPointReviewStatus;
  consent: boolean;
  assetVersion: string;
};

export function canSubmitLukitaPointForReview(input: LukitaPointReviewInput): boolean {
  return (
    input.name.trim().length > 0 &&
    input.assetVersion.trim().length > 0 &&
    input.consent &&
    (input.status === "DRAFT" || input.status === "REVIEW") &&
    LUKITA_POINT_PUBLICATION_CONTRACT.allowedPrivacy.includes(input.privacy)
  );
}

export function canActivateLukitaPointWithoutHumanApproval(): false {
  return false;
}
