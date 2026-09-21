import { UNIFIED_PIECE_REGISTRY, type UnifiedPiece } from "./arkiUnifiedMotor";

export const ARKI_AUTHORIZED_POWER_SET = ["MC-02", "MC-03", "FKCG-02", "DS-EVAL-001", "DG-01B"] as const;
export type AuthorizedPowerId = typeof ARKI_AUTHORIZED_POWER_SET[number];
export type AuthorizedPowerMode = "EXECUTION_AUTHORIZED" | "EVIDENCE_AUTHORIZED" | "PROTOCOL_AUTHORIZED";

export type AuthorityPower = {
  pieceId: AuthorizedPowerId;
  mode: AuthorizedPowerMode;
  priorState: UnifiedPiece["state"];
  newOperationalState: "ACTIVE_WORK_QUEUE" | "ACTIVE_ASSEMBLY_CONTEXT" | "ACTIVE_KNOWLEDGE_CANDIDATE" | "ACTIVE_EXTERNAL_EVIDENCE" | "AUTHORIZED_PROTOCOL";
  permittedActions: string[];
  prohibitedClaims: string[];
  humanGate: string;
};

export const ARKI_AUTHORITY_PROFILE: AuthorityPower[] = [
  { pieceId: "MC-02", mode: "EXECUTION_AUTHORIZED", priorState: "FROZEN_REFERENCE", newOperationalState: "ACTIVE_WORK_QUEUE", permittedActions: ["load frozen future orders into the unified trace", "schedule their dependencies", "report activation readiness"], prohibitedClaims: ["do not claim each future order is implemented", "do not bypass its individual activation gate"], humanGate: "PRODUCT_OWNER_REVIEW_PER_ORDER" },
  { pieceId: "MC-03", mode: "EXECUTION_AUTHORIZED", priorState: "FROZEN_REFERENCE", newOperationalState: "ACTIVE_ASSEMBLY_CONTEXT", permittedActions: ["use assembly register in the common trace", "evaluate component connections", "report integration gaps"], prohibitedClaims: ["assembly context is not proof of every capability", "do not create parallel engines"], humanGate: "ARCHITECTURE_REVIEW" },
  { pieceId: "FKCG-02", mode: "EVIDENCE_AUTHORIZED", priorState: "FROZEN_REFERENCE", newOperationalState: "ACTIVE_KNOWLEDGE_CANDIDATE", permittedActions: ["retrieve preserved knowledge candidates", "attach provenance", "submit candidates for promotion"], prohibitedClaims: ["preserved material is not automatically FACT", "do not remove UNKNOWN or human review"], humanGate: "HUMAN_KNOWLEDGE_PROMOTION" },
  { pieceId: "DS-EVAL-001", mode: "EVIDENCE_AUTHORIZED", priorState: "HISTORICAL_REFERENCE", newOperationalState: "ACTIVE_EXTERNAL_EVIDENCE", permittedActions: ["include external evaluation in evidence comparison", "surface contradictions and gaps"], prohibitedClaims: ["external evaluation does not itself prove runtime capability", "do not rewrite results"], humanGate: "EXTERNAL_EVIDENCE_REVIEW" },
  { pieceId: "DG-01B", mode: "PROTOCOL_AUTHORIZED", priorState: "BLOCKED_GATE", newOperationalState: "AUTHORIZED_PROTOCOL", permittedActions: ["run the declared blind/adversarial protocol", "classify outcomes", "record failures and UNKNOWNs"], prohibitedClaims: ["execution does not equal PASS", "protocol cannot certify professional compliance", "human review remains required"], humanGate: "DG01E_RESULT_REVIEW" },
];

export function getArkiAuthorityProfile() {
  return { profileVersion: "ARKI-AUTHORITY-PROFILE-1.0", authorizedBy: "PRODUCT_OWNER_EXPLICIT_ORDER", powers: ARKI_AUTHORITY_PROFILE, invariant: "HUMAN_AUTHORITY_FINAL", unsupportedCapabilitiesRemainUnproven: ["BIM-DWG-REVIT-GIS"] };
}

export function authorityFor(pieceId: string) {
  return ARKI_AUTHORITY_PROFILE.find((power) => power.pieceId === pieceId);
}
