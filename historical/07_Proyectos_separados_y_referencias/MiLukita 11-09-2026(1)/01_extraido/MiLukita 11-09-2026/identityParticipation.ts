export const IDENTITY_LEVELS = ["VISITOR", "FREE", "VERIFIED_PREMIUM_READY"] as const;
export type IdentityLevel = (typeof IDENTITY_LEVELS)[number];

export const VERIFICATION_STATUSES = ["UNVERIFIED", "BASIC", "VERIFIED", "REQUIRES_REVIEW"] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const PARTICIPATION_STATUSES = [
  "CREATED",
  "IDENTIFIED",
  "ELIGIBLE",
  "STARTED",
  "SUBMITTED",
  "COMPLETED",
  "EXPIRED",
  "REJECTED",
  "CANCELLED",
] as const;
export type ParticipationStatus = (typeof PARTICIPATION_STATUSES)[number];

export type EligibilityInput = {
  identityLevel: IdentityLevel;
  verificationStatus: VerificationStatus;
  eventIsOpen: boolean;
  freeParticipationAllowed: boolean;
  premiumRequired?: boolean;
  sessionActive: boolean;
};

export type EligibilityDecision = {
  eligible: boolean;
  reason: "EVENT_CLOSED" | "SESSION_INACTIVE" | "PREMIUM_DISABLED" | "VERIFICATION_REQUIRED" | "FREE_ALLOWED";
  claims: Record<string, never>;
};

/** Deterministic, server-callable policy. It never trusts client-provided plan or result data. */
export function evaluateEligibility(input: EligibilityInput): EligibilityDecision {
  if (!input.eventIsOpen) return { eligible: false, reason: "EVENT_CLOSED", claims: {} };
  if (!input.sessionActive) return { eligible: false, reason: "SESSION_INACTIVE", claims: {} };
  if (input.premiumRequired) return { eligible: false, reason: "PREMIUM_DISABLED", claims: {} };
  if (input.verificationStatus === "REQUIRES_REVIEW" || input.verificationStatus === "UNVERIFIED") {
    return { eligible: false, reason: "VERIFICATION_REQUIRED", claims: {} };
  }
  if (!input.freeParticipationAllowed) return { eligible: false, reason: "PREMIUM_DISABLED", claims: {} };
  return { eligible: true, reason: "FREE_ALLOWED", claims: {} };
}

export type FunnelEventName =
  | "qr_scanned"
  | "landing_viewed"
  | "participation_clicked"
  | "identity_started"
  | "otp_requested"
  | "otp_verified"
  | "session_created"
  | "eligibility_checked"
  | "participation_started"
  | "participation_submitted"
  | "participation_completed"
  | "participation_rejected"
  | "session_expired"
  | "return_visit"
  | "premium_viewed"
  | "premium_selected";

export const PREMIUM_ACTIVATION = "DISABLED" as const;
export const REGULATED_LAYER = "BLOCKED" as const;
export const CORE_IMPACT_TARGET = 0 as const;
export const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type AvatarMimeType = (typeof ALLOWED_AVATAR_MIME_TYPES)[number];
export const NOTIFICATION_PREFERENCE_KEYS = ["inAppEnabled", "qrUpdatesEnabled", "securityAlertsEnabled", "sessionAlertsEnabled", "criticalExpiryEnabled"] as const;
export type NotificationPreferenceKey = (typeof NOTIFICATION_PREFERENCE_KEYS)[number];

export function isAllowedAvatarMimeType(value: string): value is AvatarMimeType {
  return (ALLOWED_AVATAR_MIME_TYPES as readonly string[]).includes(value);
}

export function isValidAvatarDataUrl(dataUrl: string, mimeType: string): dataUrl is `data:${AvatarMimeType};base64,${string}` {
  if (!isAllowedAvatarMimeType(mimeType)) return false;
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  return Boolean(match && match[1] === mimeType);
}

export function normalizeDeviceHash(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9:_-]/g, "").slice(0, 128);
}

export function isAllowedParticipationTransition(from: ParticipationStatus, to: ParticipationStatus): boolean {
  const transitions: Record<ParticipationStatus, readonly ParticipationStatus[]> = {
    CREATED: ["IDENTIFIED", "EXPIRED", "CANCELLED"],
    IDENTIFIED: ["ELIGIBLE", "REJECTED", "EXPIRED", "CANCELLED"],
    ELIGIBLE: ["STARTED", "REJECTED", "EXPIRED", "CANCELLED"],
    STARTED: ["SUBMITTED", "REJECTED", "EXPIRED", "CANCELLED"],
    SUBMITTED: ["COMPLETED", "REJECTED"],
    COMPLETED: [],
    EXPIRED: [],
    REJECTED: [],
    CANCELLED: [],
  };
  return transitions[from].includes(to);
}
