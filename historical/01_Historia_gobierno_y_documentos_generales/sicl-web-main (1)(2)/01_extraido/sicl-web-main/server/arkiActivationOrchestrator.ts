import { executeArkiUnifiedMotor, UNIFIED_PIECE_REGISTRY, type UnifiedMotorInput, type UnifiedPiece } from "./arkiUnifiedMotor";
import type { SiclSnapshot } from "./siclCore";
import { getArkiAuthorityProfile } from "./arkiAuthorityProfile";

export type ActivationDisposition = "PROMOTED_TO_EXECUTION" | "EXECUTED_AS_REFERENCE" | "RETAINED_FROZEN" | "RETAINED_BLOCKED" | "RETAINED_NOT_DEMONSTRATED";
export type ActivationGateStatus = "PASS" | "HOLD" | "NOT_APPLICABLE";

export type ActivationRecord = {
  pieceId: string;
  priorState: UnifiedPiece["state"];
  disposition: ActivationDisposition;
  gateStatus: ActivationGateStatus;
  actionTaken: string;
  evidence: string[];
  nextGate: string;
  humanReviewRequired: true;
};

export type ActivationRun = {
  activationVersion: "ARKI-ACTIVATION-RUN-1.0";
  runId: string;
  projectId: UnifiedMotorInput["projectId"];
  motorStatus: "PASS_WITH_BOUNDS" | "PARTIAL";
  records: ActivationRecord[];
  promoted: string[];
  executedReferences: string[];
  frozenRetained: string[];
  blockedRetained: string[];
  notDemonstratedRetained: string[];
  invariants: string[];
  humanAuthority: "FINAL";
  authorityProfile: ReturnType<typeof getArkiAuthorityProfile>;
};

function disposition(piece: UnifiedPiece): ActivationRecord {
  if (piece.state === "ACTIVE") return { pieceId: piece.id, priorState: piece.state, disposition: "PROMOTED_TO_EXECUTION", gateStatus: "PASS", actionTaken: "Executed inside ARKI Unified Motor using its existing contract and evidence.", evidence: piece.evidence, nextGate: "CONTINUOUS_REGRESSION", humanReviewRequired: true };
  if (piece.state === "FROZEN_REFERENCE" || piece.state === "HISTORICAL_REFERENCE") return { pieceId: piece.id, priorState: piece.state, disposition: "RETAINED_FROZEN", gateStatus: "HOLD", actionTaken: "Read and routed as reference; no activation or epistemic promotion performed.", evidence: piece.evidence, nextGate: piece.activationGate, humanReviewRequired: true };
  if (piece.state === "BLOCKED_GATE") return { pieceId: piece.id, priorState: piece.state, disposition: "RETAINED_BLOCKED", gateStatus: "HOLD", actionTaken: "Activation attempted and correctly stopped at the declared gate.", evidence: piece.evidence, nextGate: piece.activationGate, humanReviewRequired: true };
  return { pieceId: piece.id, priorState: piece.state, disposition: "RETAINED_NOT_DEMONSTRATED", gateStatus: "HOLD", actionTaken: "Claim retained as not demonstrated; no unsupported implementation substituted.", evidence: piece.evidence, nextGate: piece.activationGate, humanReviewRequired: true };
}

export function executeActivationRun(input: UnifiedMotorInput, snapshot?: SiclSnapshot, coreKnowledgeVersion = 1): ActivationRun {
  const result = executeArkiUnifiedMotor(input, snapshot, coreKnowledgeVersion, "ARKI-ACTIVATION-RUN-1.0");
  const records = result.pieceRegistry.map(disposition);
  return { activationVersion: "ARKI-ACTIVATION-RUN-1.0", runId: `ACT-${input.projectId}`, projectId: input.projectId, motorStatus: result.status, records, promoted: records.filter((item) => item.disposition === "PROMOTED_TO_EXECUTION").map((item) => item.pieceId), executedReferences: records.filter((item) => item.disposition === "EXECUTED_AS_REFERENCE").map((item) => item.pieceId), frozenRetained: records.filter((item) => item.disposition === "RETAINED_FROZEN").map((item) => item.pieceId), blockedRetained: records.filter((item) => item.disposition === "RETAINED_BLOCKED").map((item) => item.pieceId), notDemonstratedRetained: records.filter((item) => item.disposition === "RETAINED_NOT_DEMONSTRATED").map((item) => item.pieceId), invariants: ["ONE_MOTOR", "FROZEN_IS_NOT_AUTOMATICALLY_ACTIVATED", "DOCUMENTED_IS_NOT_IMPLEMENTED", "UNKNOWN_IS_NOT_PASS", "HUMAN_AUTHORITY_FINAL"], humanAuthority: "FINAL", authorityProfile: getArkiAuthorityProfile() };
}

export function activationSummary(run: ActivationRun) {
  return { total: run.records.length, promoted: run.promoted.length, frozenRetained: run.frozenRetained.length, blockedRetained: run.blockedRetained.length, notDemonstratedRetained: run.notDemonstratedRetained.length, allPiecesAccountedFor: run.records.length === UNIFIED_PIECE_REGISTRY.length, noSilentActivation: run.records.filter((item) => item.gateStatus === "HOLD").every((item) => item.disposition !== "PROMOTED_TO_EXECUTION"), humanAuthority: run.humanAuthority, motorStatus: run.motorStatus };
}
