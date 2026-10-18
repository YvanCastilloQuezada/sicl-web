export type LegalComplianceStatus = "PLANNED";
export type LegalImplementationState = "NOT_STARTED";
export type LegalAuthorityLevel = "ADVISORY_ONLY";
export type LegalExecutionState = "DISABLED";

export const LEGAL_COMPLIANCE_AGENT = {
  id: "legal_compliance_intelligence",
  name: "Legal & Compliance Intelligence Agent",
  status: "PLANNED" as LegalComplianceStatus,
  implementation: {
    state: "NOT_STARTED" as LegalImplementationState,
    enabled: false,
    production: false,
  },
  authority: {
    level: "ADVISORY_ONLY" as LegalAuthorityLevel,
    autonomy: 0,
    execution: "DISABLED" as LegalExecutionState,
  },
  humanApproval: { required: true },
  modificationOfCoreAllowed: false,
  legalDecisionAuthorityAllowed: false,
  contractualAuthorityAllowed: false,
  regulatoryFilingAuthorityAllowed: false,
  licensingAuthorityAllowed: false,
  coreAccess: "NONE" as const,
  professionalReview: "REQUIRED_WHEN_APPLICABLE" as const,
} as const;

export const LEGAL_COMPLIANCE_DOMAINS = [
  "CORPORATE_LEGAL",
  "REGULATORY_INTELLIGENCE",
  "GAMING_REGULATION",
  "ADVERTISING_COMPLIANCE",
  "CONSUMER_PROTECTION",
  "PRIVACY_DATA_PROTECTION",
  "INTELLECTUAL_PROPERTY",
  "CONTRACTS",
  "LICENSING",
  "AI_GOVERNANCE",
  "DIGITAL_SERVICES_ECOMMERCE",
  "INTERNATIONAL_EXPANSION",
  "LEGAL_CLAIMS_REPRESENTATION_GUARD",
] as const;

export const LEGAL_ALLOWED_FUTURE_ACTIONS = [
  "READ",
  "ANALYZE",
  "CLASSIFY",
  "COMPARE",
  "DETECT",
  "ASSESS_RISK",
  "MONITOR",
  "SCORE",
  "PROPOSE",
  "ALERT",
  "ESCALATE",
  "DOCUMENT",
] as const;

export const LEGAL_FORBIDDEN_ACTIONS = [
  "SIGN_CONTRACT",
  "ACCEPT_LIABILITY",
  "REGISTER_COMPANY",
  "MODIFY_CORPORATE_STRUCTURE",
  "FILE_LEGAL_DOCUMENT",
  "REPRESENT_MILUKITA",
  "MAKE_BINDING_LEGAL_DECISION",
  "DECLARE_FINAL_LEGAL_COMPLIANCE",
  "OBTAIN_LICENSE_AUTONOMOUSLY",
  "NEGOTIATE_BINDING_TERMS",
  "ACCEPT_SETTLEMENT",
  "AUTHORIZE_REGULATED_ACTIVITY",
  "MODIFY_MJP_CORE",
  "MODIFY_RNG",
  "MODIFY_RTP",
  "MODIFY_RESULT",
  "MODIFY_WALLET",
  "MODIFY_LEDGER",
  "MODIFY_SETTLEMENT",
] as const;

export type LegalRiskLevel = "L0_INFORMATIONAL" | "L1_LOW" | "L2_MODERATE" | "L3_HIGH" | "L4_CRITICAL";
export type LegalDecisionGate = "GREEN_CONTINUE" | "YELLOW_HUMAN_REVIEW" | "RED_BLOCK_HUMAN_REVIEW";

export const LEGAL_AUDIT_RECORD_FIELDS = [
  "query",
  "source",
  "jurisdiction",
  "date",
  "analysis",
  "assumptions",
  "evidence",
  "risk",
  "recommendation",
  "confidence",
  "humanReview",
  "decision",
  "decisionMaker",
  "timestamp",
  "version",
] as const;

export function legalAgentIsOperational(): false {
  return false;
}

export function canLegalAgentExecute(_action: string): false {
  return false;
}

export function legalAgentStateSummary() {
  return {
    id: LEGAL_COMPLIANCE_AGENT.id,
    status: LEGAL_COMPLIANCE_AGENT.status,
    implementation: LEGAL_COMPLIANCE_AGENT.implementation.state,
    enabled: LEGAL_COMPLIANCE_AGENT.implementation.enabled,
    production: LEGAL_COMPLIANCE_AGENT.implementation.production,
    authority: LEGAL_COMPLIANCE_AGENT.authority.level,
    autonomy: LEGAL_COMPLIANCE_AGENT.authority.autonomy,
    execution: LEGAL_COMPLIANCE_AGENT.authority.execution,
    humanApproval: LEGAL_COMPLIANCE_AGENT.humanApproval.required,
    coreAccess: LEGAL_COMPLIANCE_AGENT.coreAccess,
    domains: LEGAL_COMPLIANCE_DOMAINS.length,
    allowedFutureActions: LEGAL_ALLOWED_FUTURE_ACTIONS.length,
    forbiddenActions: LEGAL_FORBIDDEN_ACTIONS.length,
  } as const;
}
