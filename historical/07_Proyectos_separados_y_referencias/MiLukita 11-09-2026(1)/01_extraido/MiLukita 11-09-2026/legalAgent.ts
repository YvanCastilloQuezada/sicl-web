import { LEGAL_ALLOWED_ACTIONS, LEGAL_FORBIDDEN_ACTIONS, LRCI_DOMAINS, LRCI_RESERVED_DOMAINS, MASTER_ORDER, isProtectedCoreSurface } from "./milukitaMasterOrder";

export type LrciStatus = "DEFINED" | "PLANNED" | "DISABLED" | "NOT_IMPLEMENTED";
export type LegalAuditState = "NO_DATA" | "TECHNICAL_CONTROL_ONLY" | "REQUIRES_PROFESSIONAL_REVIEW" | "POLICY_BLOCKED" | "SOURCE_EXPIRED" | "HUMAN_APPROVED";
export type LegalMetricState = "ZERO_BY_DESIGN" | "NO_DATA" | "OBSERVED";
export type LegalMetric = { id: string; value: number | null; unit: "count" | "ratio" | "percentage"; state: LegalMetricState; source: string; observedAt: number | null };

export type LegalEvidenceInput = {
  domain: (typeof LRCI_DOMAINS)[number] | (typeof LRCI_RESERVED_DOMAINS)[number];
  claim?: string | null;
  source?: string | null;
  evidence?: string | null;
  jurisdiction?: string | null;
  effectiveDate?: string | null;
  expiresAt?: string | null;
  confidence?: number | null;
  scope?: string | null;
  humanReview?: { reviewerId: string; reviewedAt: number; scope: string; jurisdiction: string } | null;
  policyBlocked?: boolean;
};

export type LegalEvaluation = {
  state: LegalAuditState;
  claimAllowed: false;
  publishAllowed: false;
  executeAllowed: false;
  requiresProfessionalReview: boolean;
  reason: string;
  missing: string[];
  source: "LRCI_RESTRICTIVE_ENGINE";
  virtualOnly: true;
};

export const LRCI_CONTRACT = {
  status: "DEFINED" as LrciStatus,
  implementation: "NOT_STARTED" as const,
  execution: "DISABLED" as const,
  autonomy: 0 as const,
  authority: "ADVISORY_ONLY" as const,
  humanReview: "REQUIRED" as const,
  externalIntegrations: "NONE" as const,
  mjpCoreAccess: "NONE" as const,
  legalClaimGuard: "RESERVED_DISABLED" as const,
};

const REQUIRED_EVIDENCE: Array<keyof LegalEvidenceInput> = ["claim", "source", "evidence", "jurisdiction", "effectiveDate", "confidence", "scope"];

export function initialLegalMetrics(): LegalMetric[] {
  const zero = (id: string, source: string): LegalMetric => ({ id, value: 0, unit: "count", state: "ZERO_BY_DESIGN", source, observedAt: null });
  const unavailable = (id: string, unit: LegalMetric["unit"], source: string): LegalMetric => ({ id, value: null, unit, state: "NO_DATA", source, observedAt: null });
  return [
    unavailable("REGULATORY_COVERAGE", "percentage", "VERSIONED_REGULATORY_INVENTORY_REQUIRED"),
    zero("LEGAL_RISK_DETECTION", "NO_CASES_PROCESSED"),
    unavailable("COMPLIANCE_COVERAGE", "percentage", "EVIDENCED_OBLIGATIONS_REQUIRED"),
    zero("REGULATORY_CHANGE_DETECTION", "NO_REGULATORY_FEED_CONNECTED"),
    zero("CONTRACT_RISK_DETECTION", "NO_CONTRACT_CASES_PROCESSED"),
    zero("LICENSE_EXPIRATION_ALERTS", "NO_LICENSE_REGISTER_CONNECTED"),
    unavailable("CLAIM_VERIFICATION_RATE", "ratio", "CLAIMS_WITH_SOURCE_AND_JURISDICTION_REQUIRED"),
    unavailable("LEGAL_ESCALATION_RATE", "ratio", "PROFESSIONAL_REVIEW_LOG_REQUIRED"),
    unavailable("FALSE_LEGAL_ALERT_RATE", "ratio", "HUMAN_LABELS_REQUIRED"),
    unavailable("UNRESOLVED_HIGH_RISK_ISSUES", "count", "CURRENT_RISK_REGISTER_REQUIRED"),
    zero("LEGAL_UNKNOWN_RATE", "NO_CASES_PROCESSED"),
  ];
}

function missingEvidence(input: LegalEvidenceInput): string[] {
  return REQUIRED_EVIDENCE.filter((field) => input[field] === null || input[field] === undefined || input[field] === "").map(String);
}

export function evaluateLegalEvidence(input: LegalEvidenceInput, now = Date.now()): LegalEvaluation {
  if (input.policyBlocked) return evaluation("POLICY_BLOCKED", "internal_policy_blocked", [], false);
  if (isProtectedCoreSurface(input.domain) || input.domain === "AML_KYC_CDD" && MASTER_ORDER.legalCompliance.execution === "DISABLED") {
    return evaluation("POLICY_BLOCKED", "protected_or_reserved_surface", [], false);
  }
  const missing = missingEvidence(input);
  if (missing.length > 0) return evaluation("NO_DATA", "required_evidence_missing", missing, false);
  if (input.expiresAt && Date.parse(input.expiresAt) <= now) return evaluation("SOURCE_EXPIRED", "source_expired", [], true);
  if (!input.humanReview) return evaluation("REQUIRES_PROFESSIONAL_REVIEW", "professional_review_required", [], true);
  return evaluation("HUMAN_APPROVED", "scope_bound_human_review_recorded", [], false);
}

function evaluation(state: LegalAuditState, reason: string, missing: string[], requiresProfessionalReview: boolean): LegalEvaluation {
  return { state, claimAllowed: false, publishAllowed: false, executeAllowed: false, requiresProfessionalReview, reason, missing, source: "LRCI_RESTRICTIVE_ENGINE", virtualOnly: true };
}

export function canLrciExecute(action: string): false {
  void LEGAL_ALLOWED_ACTIONS;
  void LEGAL_FORBIDDEN_ACTIONS;
  return false;
}

export function canLrciMutateCore(surface: string): false {
  void surface;
  return false;
}

export function getLrciContractSummary() {
  return { ...LRCI_CONTRACT, domains: [...LRCI_DOMAINS], reservedDomains: [...LRCI_RESERVED_DOMAINS], metrics: initialLegalMetrics() };
}
