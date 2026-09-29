import type { DeveloperProposal } from "../shared/arkiDeveloperProposal";
import { validateDeveloperProposal } from "../shared/arkiDeveloperProposal";
import {
  SiclCoreHttpError,
  appendCoreReasoningExecution,
  fetchCoreD2Snapshot,
  promoteDeveloperProposal,
  recordCoreHumanReview,
  type BoundHumanReviewRequest,
  type DeveloperPromotionResponse,
} from "./coreHttpClient";

export type DeveloperPromotionOutcomeStatus = "COMMITTED" | "REJECTED" | "UNKNOWN" | "NOT_REQUESTED";
export type D2CommittedState = true | false | "UNKNOWN";
export type DeveloperPromotionStage =
  | "PRE_FLIGHT"
  | "PERSIST_PROPOSAL"
  | "RECORD_HUMAN_REVIEW"
  | "REQUEST_PROMOTION"
  | "VERIFY_D2"
  | "COMPLETE";

export interface DeveloperHumanApprovalInput {
  actor: string;
  timestamp: string;
  review: string;
  reason: string;
  authority: string;
}

export interface DeveloperProposalRecordInput {
  actor: string;
  createdAt: string;
  inputFingerprint?: string | null;
  humanAuthorityRef?: Record<string, unknown> | null;
  sourceRefs?: unknown[];
}

export interface DeveloperPromotionOrchestrationInput {
  projectId: string;
  proposal: DeveloperProposal;
  proposalRecord: DeveloperProposalRecordInput;
  humanApproval: DeveloperHumanApprovalInput;
}

export interface DeveloperPromotionOrchestrationResult {
  proposalId: string;
  proposalFingerprint: string;
  proposalRecorded: boolean;
  humanReviewId: string | null;
  humanApproved: boolean;
  promotionRequested: boolean;
  promotionOutcome: DeveloperPromotionOutcomeStatus;
  d2Committed: D2CommittedState;
  d2Verified: boolean;
  snapshotId: string | null;
  d2Version: number | null;
  effectsStatus: "COMPLETE" | "PARTIAL" | "FAILED" | "NOT_ATTEMPTED" | null;
  stage: DeveloperPromotionStage;
  reasonCode: string | null;
  reason: string | null;
}

type PromotionDependencies = {
  appendReasoning: typeof appendCoreReasoningExecution;
  recordReview: typeof recordCoreHumanReview;
  promote: typeof promoteDeveloperProposal;
  fetchSnapshot: typeof fetchCoreD2Snapshot;
};

const DEFAULT_DEPS: PromotionDependencies = {
  appendReasoning: appendCoreReasoningExecution,
  recordReview: recordCoreHumanReview,
  promote: promoteDeveloperProposal,
  fetchSnapshot: fetchCoreD2Snapshot,
};

function baseResult(proposalId: string, fingerprint: string): DeveloperPromotionOrchestrationResult {
  return {
    proposalId,
    proposalFingerprint: fingerprint,
    proposalRecorded: false,
    humanReviewId: null,
    humanApproved: false,
    promotionRequested: false,
    promotionOutcome: "NOT_REQUESTED",
    d2Committed: false,
    d2Verified: false,
    snapshotId: null,
    d2Version: null,
    effectsStatus: null,
    stage: "PRE_FLIGHT",
    reasonCode: null,
    reason: null,
  };
}

function fail(
  current: DeveloperPromotionOrchestrationResult,
  stage: DeveloperPromotionStage,
  reasonCode: string,
  reason: string,
): DeveloperPromotionOrchestrationResult {
  return { ...current, stage, reasonCode, reason };
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function identityStillMatches(proposal: DeveloperProposal, proposalId: string, fingerprint: string): boolean {
  try {
    return proposal.proposalId === proposalId && proposal.fingerprint === fingerprint;
  } catch {
    return false;
  }
}

function explicitHumanApprovalIsValid(value: DeveloperHumanApprovalInput): boolean {
  return nonEmptyString(value.actor)
    && nonEmptyString(value.timestamp)
    && nonEmptyString(value.review)
    && nonEmptyString(value.reason)
    && nonEmptyString(value.authority);
}

const AUTHORITATIVE_REJECTION_MAP = new Map<string, ReadonlySet<number>>([
  ["PROJECT_NOT_FOUND", new Set([404])],
  ["PROPOSAL_NOT_FOUND", new Set([404])],
  ["HUMAN_REVIEW_NOT_FOUND", new Set([404])],
  ["PROPOSAL_FINGERPRINT_MISMATCH", new Set([409])],
  ["PROPOSAL_FINGERPRINT_INCONSISTENT", new Set([409])],
  ["HUMAN_REVIEW_BINDING_MISMATCH", new Set([409])],
  ["SUFFICIENCY_NOT_PERMITTED", new Set([409])],
  ["INVALID_DEVELOPER_PROPOSAL", new Set([400])],
  ["STRUCTURAL_VALIDATION_FAILED", new Set([400])],
  ["RELATIONS_NOT_YET_SUPPORTED", new Set([400])],
  ["DERIVATIONS_NOT_YET_SUPPORTED", new Set([400])],
  ["UNKNOWN_ELEMENT_KIND", new Set([400])],
  ["MISSING_GEOMETRY", new Set([400])],
  ["GEOMETRY_CONTRACT_NOT_MAPPED", new Set([400])],
  ["UNSUPPORTED_PROPERTY_VALUE", new Set([400])],
  ["PROMOTION_PERSIST_FAILED", new Set([500])],
  ["INTEGRITY_FAILURE", new Set([500])],
]);

const ALLOWLISTED_PREFIXES = [
  ["GEOMETRY_CONTRACT_NOT_MAPPED:", "GEOMETRY_CONTRACT_NOT_MAPPED"],
  ["UNSUPPORTED_PROPERTY_VALUE:", "UNSUPPORTED_PROPERTY_VALUE"],
] as const;

function classifyAuthoritativeRejection(status: number, code: string): string | null {
  const exactStatuses = AUTHORITATIVE_REJECTION_MAP.get(code);
  if (exactStatuses?.has(status)) return code;
  for (const [prefix, canonical] of ALLOWLISTED_PREFIXES) {
    if (code.startsWith(prefix) && code.length > prefix.length && AUTHORITATIVE_REJECTION_MAP.get(canonical)?.has(status)) {
      return canonical;
    }
  }
  return null;
}

function coreReason(error: unknown): { code: string; detail: string | null } {
  if (error instanceof SiclCoreHttpError) {
    const nested = error.envelope.detail;
    if (nested && typeof nested === "object") {
      const body = nested as Record<string, unknown>;
      return {
        code: typeof body.code === "string" ? body.code : (error.errorCode ?? "CORE_HTTP_ERROR"),
        detail: typeof body.message === "string" ? body.message : null,
      };
    }
    return { code: error.errorCode ?? "CORE_HTTP_ERROR", detail: null };
  }
  return { code: "CORE_TRANSPORT_ERROR", detail: error instanceof Error ? error.message : String(error) };
}

export async function orchestrateDeveloperPromotion(
  input: DeveloperPromotionOrchestrationInput,
  dependencies: PromotionDependencies = DEFAULT_DEPS,
): Promise<DeveloperPromotionOrchestrationResult> {
  let proposalId0: string;
  let fingerprint0: string;
  try {
    proposalId0 = input.proposal.proposalId;
    fingerprint0 = input.proposal.fingerprint;
  } catch {
    return fail(baseResult("<unreadable>", "<unreadable>"), "PRE_FLIGHT", "PRE_FLIGHT_INVALID_PROPOSAL", "proposal identity is unreadable");
  }

  let result = baseResult(proposalId0, fingerprint0);
  const validation = validateDeveloperProposal(input.proposal);
  if (!validation.valid || (input.proposal.epistemicStatus !== "HYPOTHESIS" && input.proposal.epistemicStatus !== "PROPOSAL")) {
    return fail(result, "PRE_FLIGHT", "PRE_FLIGHT_INVALID_PROPOSAL", validation.errors.join("; ") || "epistemicStatus outside admitted set");
  }
  if (!nonEmptyString(input.projectId) || !nonEmptyString(input.proposalRecord.actor) || !nonEmptyString(input.proposalRecord.createdAt)) {
    return fail(result, "PRE_FLIGHT", "PRE_FLIGHT_INVALID_INPUT", "projectId, proposalRecord.actor and proposalRecord.createdAt are required");
  }
  if (!explicitHumanApprovalIsValid(input.humanApproval)) {
    return fail(result, "PRE_FLIGHT", "PRE_FLIGHT_INVALID_HUMAN_APPROVAL", "human approval fields must be explicit non-empty strings");
  }

  if (!identityStillMatches(input.proposal, proposalId0, fingerprint0)) {
    return fail(result, "PRE_FLIGHT", "PROPOSAL_IDENTITY_CHANGED", "proposal identity changed before persistence");
  }

  result = { ...result, stage: "PERSIST_PROPOSAL" };
  try {
    await dependencies.appendReasoning(input.projectId, {
      execution_id: proposalId0,
      kind: "DEVELOPER_PROPOSAL",
      fingerprint: fingerprint0,
      input_fingerprint: input.proposalRecord.inputFingerprint ?? null,
      payload: input.proposal as unknown as Record<string, unknown>,
      epistemic_status: input.proposal.epistemicStatus,
      human_authority_ref: input.proposalRecord.humanAuthorityRef ?? null,
      source_refs: input.proposalRecord.sourceRefs ?? [],
      actor: input.proposalRecord.actor,
      created_at: input.proposalRecord.createdAt,
    });
    result = { ...result, proposalRecorded: true };
  } catch (error) {
    const r = coreReason(error);
    return fail(result, "PERSIST_PROPOSAL", r.code, r.detail ?? (error instanceof Error ? error.message : r.code));
  }

  if (!identityStillMatches(input.proposal, proposalId0, fingerprint0)) {
    return fail(result, "PERSIST_PROPOSAL", "PROPOSAL_IDENTITY_CHANGED", "proposal identity changed after persistence");
  }

  result = { ...result, stage: "RECORD_HUMAN_REVIEW" };
  const reviewPayload: BoundHumanReviewRequest = {
    actor: input.humanApproval.actor,
    timestamp: input.humanApproval.timestamp,
    review: input.humanApproval.review,
    reason: input.humanApproval.reason,
    authority: input.humanApproval.authority,
    referenced_entity_type: "DEVELOPER_PROPOSAL",
    referenced_entity_id: proposalId0,
    referenced_fingerprint: fingerprint0,
  };

  try {
    const response = await dependencies.recordReview(input.projectId, reviewPayload);
    const review = response.human_review;
    if (
      !review
      || !nonEmptyString(review.review_id)
      || review.status !== "APPROVED"
      || review.referenced_entity_type !== "DEVELOPER_PROPOSAL"
      || review.referenced_entity_id !== proposalId0
      || review.referenced_fingerprint !== fingerprint0
    ) {
      return fail(result, "RECORD_HUMAN_REVIEW", "HUMAN_REVIEW_RESPONSE_BINDING_MISMATCH", "Core HumanReview response does not confirm the proposal binding");
    }
    result = { ...result, humanReviewId: review.review_id, humanApproved: true };
  } catch (error) {
    const r = coreReason(error);
    return fail(result, "RECORD_HUMAN_REVIEW", r.code, r.detail ?? (error instanceof Error ? error.message : r.code));
  }

  if (!identityStillMatches(input.proposal, proposalId0, fingerprint0)) {
    return fail(result, "RECORD_HUMAN_REVIEW", "PROPOSAL_IDENTITY_CHANGED", "proposal identity changed before promotion");
  }

  result = { ...result, stage: "REQUEST_PROMOTION", promotionRequested: true };
  let promotion: DeveloperPromotionResponse;
  try {
    promotion = await dependencies.promote(input.projectId, {
      proposal_id: proposalId0,
      proposal_fingerprint: fingerprint0,
      human_review_id: result.humanReviewId!,
    });
  } catch (error) {
    const r = coreReason(error);
    if (error instanceof SiclCoreHttpError) {
      const authoritativeCode = classifyAuthoritativeRejection(error.status, r.code);
      if (authoritativeCode) {
        return {
          ...result,
          promotionOutcome: "REJECTED",
          d2Committed: false,
          reasonCode: authoritativeCode,
          reason: r.detail,
        };
      }
    }
    return {
      ...result,
      promotionOutcome: "UNKNOWN",
      d2Committed: "UNKNOWN",
      d2Verified: false,
      snapshotId: null,
      d2Version: null,
      effectsStatus: null,
      reasonCode: r.code,
      reason: r.detail,
    };
  }

  if (
    promotion.status !== "COMMITTED"
    || promotion.proposal_id !== proposalId0
    || !nonEmptyString(promotion.snapshot_id)
    || !Number.isInteger(promotion.d2_version)
    || promotion.d2_version < 1
    || !["COMPLETE", "PARTIAL", "FAILED", "NOT_ATTEMPTED"].includes(promotion.effects_status)
  ) {
    return {
      ...result,
      promotionOutcome: "UNKNOWN",
      d2Committed: "UNKNOWN",
      reasonCode: "PROMOTION_RESPONSE_INVALID",
      reason: "Core promotion response is not sufficient to establish commit identity",
    };
  }

  result = {
    ...result,
    promotionOutcome: "COMMITTED",
    d2Committed: true,
    snapshotId: promotion.snapshot_id,
    d2Version: promotion.d2_version,
    effectsStatus: promotion.effects_status,
    reason: promotion.reason,
    stage: "VERIFY_D2",
  };

  try {
    const response = await dependencies.fetchSnapshot(input.projectId, promotion.d2_version);
    const snapshot = response.snapshot;
    const mismatches: string[] = [];
    if (snapshot?.project_id !== input.projectId) mismatches.push("project_id");
    if (snapshot?.snapshot_id !== promotion.snapshot_id) mismatches.push("snapshot_id");
    if (snapshot?.version !== promotion.d2_version) mismatches.push("version");
    if (mismatches.length) {
      return fail(result, "VERIFY_D2", "VERIFY_D2_MISMATCH", `snapshot mismatch: ${mismatches.join(",")}`);
    }
    return { ...result, d2Verified: true, stage: "COMPLETE", reasonCode: null };
  } catch (error) {
    if (error instanceof SiclCoreHttpError && error.status === 404) {
      return fail(result, "VERIFY_D2", "VERIFY_D2_SNAPSHOT_NOT_FOUND", error.message);
    }
    const r = coreReason(error);
    return fail(result, "VERIFY_D2", "VERIFY_D2_FAILED", r.detail ?? (error instanceof Error ? error.message : r.code));
  }
}
