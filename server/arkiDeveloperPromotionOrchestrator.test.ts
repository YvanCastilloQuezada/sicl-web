import { describe, expect, it, vi } from "vitest";
import type { DeveloperProposal } from "../shared/arkiDeveloperProposal";
import { SiclCoreHttpError } from "./coreHttpClient";
import { orchestrateDeveloperPromotion } from "./arkiDeveloperPromotionOrchestrator";

const FP = "a".repeat(64);

function proposal(): DeveloperProposal {
  return {
    proposalId: "dev-prop-1",
    parentProposalId: null,
    sourceExecutionId: "cycle-1",
    sourceD63: "d63-1",
    fingerprint: FP,
    epistemicStatus: "PROPOSAL",
    proposedElements: [],
    proposedRelations: [],
    proposedDerivations: [],
    unresolvedUnknowns: [],
    requiredHumanActions: [{ action: "review_proposal", reason: "required" }],
    provenance: [{ source: "test", ref: "fixture" }],
    reviewRequired: true,
    mutation: null,
    rejectedBecause: null,
    feedbackLoops: [],
  };
}

function input(p = proposal()) {
  return {
    projectId: "P-1",
    proposal: p,
    proposalRecord: { actor: "ARKI_DEVELOPER", createdAt: "2026-09-29T18:00:00Z" },
    humanApproval: {
      actor: "architect",
      timestamp: "2026-09-29T18:01:00Z",
      review: "Approved proposal",
      reason: "Architecture review",
      authority: "PRODUCT_OWNER",
    },
  };
}

function deps(overrides: Record<string, unknown> = {}) {
  return {
    appendReasoning: vi.fn().mockResolvedValue({ status: "RECORDED", execution_id: "dev-prop-1", event_id: 1, observed_version: 1 }),
    recordReview: vi.fn().mockResolvedValue({
      human_review: {
        review_id: "REV-1", project_id: "P-1", actor: "architect", timestamp: "2026-09-29T18:01:00Z",
        review: "Approved proposal", reason: "Architecture review", authority: "PRODUCT_OWNER",
        status: "APPROVED", version: 1, referenced_entity_type: "DEVELOPER_PROPOSAL",
        referenced_entity_id: "dev-prop-1", referenced_fingerprint: FP,
      },
    }),
    promote: vi.fn().mockResolvedValue({
      status: "COMMITTED", proposal_id: "dev-prop-1", snapshot_id: "D2-1", d2_version: 1,
      effects_status: "COMPLETE", reason: "PROMOTED",
    }),
    fetchSnapshot: vi.fn().mockResolvedValue({
      snapshot: { snapshot_id: "D2-1", project_id: "P-1", version: 1, elements: [], content_hash: "h", actor: "a", source_event_id: 1, created_at: "t" },
    }),
    ...overrides,
  } as any;
}

describe("[6] controlled Developer promotion orchestration", () => {
  it("completes only after the exact committed snapshot is verified", async () => {
    const d = deps();
    const out = await orchestrateDeveloperPromotion(input(), d);
    expect(out).toMatchObject({
      proposalRecorded: true, humanReviewId: "REV-1", humanApproved: true,
      promotionRequested: true, promotionOutcome: "COMMITTED", d2Committed: true,
      d2Verified: true, snapshotId: "D2-1", d2Version: 1, effectsStatus: "COMPLETE", stage: "COMPLETE",
    });
    expect(d.fetchSnapshot).toHaveBeenCalledWith("P-1", 1);
  });

  it("fails closed before Core for invalid runtime epistemicStatus", async () => {
    const p = proposal() as any;
    p.epistemicStatus = "SPECULATIVE";
    const d = deps();
    const out = await orchestrateDeveloperPromotion(input(p), d);
    expect(out).toMatchObject({ stage: "PRE_FLIGHT", promotionOutcome: "NOT_REQUESTED", d2Committed: false, reasonCode: "PRE_FLIGHT_INVALID_PROPOSAL" });
    expect(d.appendReasoning).not.toHaveBeenCalled();
    expect(d.recordReview).not.toHaveBeenCalled();
    expect(d.promote).not.toHaveBeenCalled();
  });

  it("requires explicit human authority content and emits zero Core calls when absent", async () => {
    const value = input();
    value.humanApproval.reason = "";
    const d = deps();
    const out = await orchestrateDeveloperPromotion(value, d);
    expect(out.reasonCode).toBe("PRE_FLIGHT_INVALID_HUMAN_APPROVAL");
    expect(d.appendReasoning).not.toHaveBeenCalled();
  });

  it("constructs HumanReview binding mechanically without status/default fields", async () => {
    const d = deps();
    await orchestrateDeveloperPromotion(input(), d);
    expect(d.recordReview).toHaveBeenCalledWith("P-1", {
      actor: "architect", timestamp: "2026-09-29T18:01:00Z", review: "Approved proposal",
      reason: "Architecture review", authority: "PRODUCT_OWNER",
      referenced_entity_type: "DEVELOPER_PROPOSAL", referenced_entity_id: "dev-prop-1", referenced_fingerprint: FP,
    });
    expect(d.recordReview.mock.calls[0][1]).not.toHaveProperty("status");
  });

  it("does not promote when Core HumanReview response binding differs", async () => {
    const d = deps({ recordReview: vi.fn().mockResolvedValue({ human_review: {
      review_id: "REV-X", status: "APPROVED", referenced_entity_type: "DEVELOPER_PROPOSAL",
      referenced_entity_id: "other", referenced_fingerprint: FP,
    } }) });
    const out = await orchestrateDeveloperPromotion(input(), d);
    expect(out.reasonCode).toBe("HUMAN_REVIEW_RESPONSE_BINDING_MISMATCH");
    expect(out.promotionOutcome).toBe("NOT_REQUESTED");
    expect(d.promote).not.toHaveBeenCalled();
  });

  it("detects proposal identity mutation between stages and stops", async () => {
    const p = proposal();
    const appendReasoning = vi.fn().mockImplementation(async () => { (p as any).proposalId = "mutated"; return {}; });
    const d = deps({ appendReasoning });
    const out = await orchestrateDeveloperPromotion(input(p), d);
    expect(out.reasonCode).toBe("PROPOSAL_IDENTITY_CHANGED");
    expect(out.promotionOutcome).toBe("NOT_REQUESTED");
    expect(d.recordReview).not.toHaveBeenCalled();
  });

  it("T-6.20 preserves the full UNKNOWN tuple after promotion transport loss", async () => {
    const d = deps({ promote: vi.fn().mockRejectedValue(new TypeError("network lost")) });
    const out = await orchestrateDeveloperPromotion(input(), d);
    expect(out).toMatchObject({
      promotionRequested: true,
      promotionOutcome: "UNKNOWN",
      d2Committed: "UNKNOWN",
      d2Verified: false,
      snapshotId: null,
      d2Version: null,
      effectsStatus: null,
      stage: "REQUEST_PROMOTION",
    });
  });


  it("fails epistemically closed when Core returns an invalid COMMITTED runtime payload", async () => {
    const d = deps({ promote: vi.fn().mockResolvedValue({
      status: "COMMITTED", proposal_id: "dev-prop-1", snapshot_id: "D2-1", d2_version: 1,
      effects_status: "MAGIC", reason: "bad runtime",
    }) });
    const out = await orchestrateDeveloperPromotion(input(), d);
    expect(out).toMatchObject({
      promotionRequested: true, promotionOutcome: "UNKNOWN", d2Committed: "UNKNOWN",
      d2Verified: false, reasonCode: "PROMOTION_RESPONSE_INVALID", stage: "REQUEST_PROMOTION",
    });
    expect(d.fetchSnapshot).not.toHaveBeenCalled();
  });

  it("maps an authoritative Core rejection to REJECTED, never UNKNOWN", async () => {
    const d = deps({ promote: vi.fn().mockRejectedValue(new SiclCoreHttpError(409, "HUMAN_REVIEW_BINDING_MISMATCH", "rejected")) });
    const out = await orchestrateDeveloperPromotion(input(), d);
    expect(out).toMatchObject({ promotionRequested: true, promotionOutcome: "REJECTED", d2Committed: false, d2Verified: false, effectsStatus: null });
  });

  it.each(["FAILED", "PARTIAL", "NOT_ATTEMPTED"] as const)("keeps COMMITTED independent from effectsStatus=%s", async (effectsStatus) => {
    const d = deps({ promote: vi.fn().mockResolvedValue({
      status: "COMMITTED", proposal_id: "dev-prop-1", snapshot_id: "D2-1", d2_version: 1, effects_status: effectsStatus, reason: "core",
    }) });
    const out = await orchestrateDeveloperPromotion(input(), d);
    expect(out.promotionOutcome).toBe("COMMITTED");
    expect(out.d2Committed).toBe(true);
    expect(out.effectsStatus).toBe(effectsStatus);
  });

  it("keeps COMMITTED when the version-addressed snapshot is 404", async () => {
    const d = deps({ fetchSnapshot: vi.fn().mockRejectedValue(new SiclCoreHttpError(404, "D2_SNAPSHOT_NOT_FOUND", "missing")) });
    const out = await orchestrateDeveloperPromotion(input(), d);
    expect(out).toMatchObject({
      promotionOutcome: "COMMITTED", d2Committed: true, d2Verified: false,
      snapshotId: "D2-1", d2Version: 1, reasonCode: "VERIFY_D2_SNAPSHOT_NOT_FOUND", stage: "VERIFY_D2",
    });
  });

  it.each([
    [{ snapshot_id: "wrong", project_id: "P-1", version: 1 }, "snapshot_id"],
    [{ snapshot_id: "D2-1", project_id: "wrong", version: 1 }, "project_id"],
    [{ snapshot_id: "D2-1", project_id: "P-1", version: 2 }, "version"],
  ])("keeps COMMITTED but fails verification for snapshot mismatch", async (snapshot, field) => {
    const d = deps({ fetchSnapshot: vi.fn().mockResolvedValue({ snapshot }) });
    const out = await orchestrateDeveloperPromotion(input(), d);
    expect(out).toMatchObject({ promotionOutcome: "COMMITTED", d2Committed: true, d2Verified: false, reasonCode: "VERIFY_D2_MISMATCH" });
    expect(out.reason).toContain(field);
  });

  it("uses the Core-generated review id as part of promotion identity", async () => {
    const d = deps();
    await orchestrateDeveloperPromotion(input(), d);
    expect(d.promote).toHaveBeenCalledWith("P-1", {
      proposal_id: "dev-prop-1", proposal_fingerprint: FP, human_review_id: "REV-1",
    });
  });
});


describe("[6.7-T630-C.4] V1.5 promotion error classification", () => {
  function coreError(status: number, code: string, message = code, retryAfter: number | null = null) {
    return new SiclCoreHttpError(status, code, message, {
      detail: { status: "ERROR", code, message, data: { status: "REJECTED" } },
    }, retryAfter);
  }

  it("maps 503 RETRIABLE_BUSY_EXHAUSTED to the full UNKNOWN tuple and never retries locally", async () => {
    const promote = vi.fn().mockRejectedValue(coreError(503, "RETRIABLE_BUSY_EXHAUSTED", "busy", 1));
    const out = await orchestrateDeveloperPromotion(input(), deps({ promote }));
    expect(out).toMatchObject({
      promotionRequested: true, promotionOutcome: "UNKNOWN", d2Committed: "UNKNOWN",
      d2Verified: false, snapshotId: null, d2Version: null, effectsStatus: null,
      stage: "REQUEST_PROMOTION", reasonCode: "RETRIABLE_BUSY_EXHAUSTED", reason: "busy",
    });
    expect(promote).toHaveBeenCalledTimes(1);
  });

  it("maps 500 INTEGRITY_FAILURE to authoritative REJECTED/false", async () => {
    const out = await orchestrateDeveloperPromotion(input(), deps({
      promote: vi.fn().mockRejectedValue(coreError(500, "INTEGRITY_FAILURE", "integrity failed")),
    }));
    expect(out).toMatchObject({ promotionOutcome: "REJECTED", d2Committed: false, reasonCode: "INTEGRITY_FAILURE", reason: "integrity failed" });
  });

  it("TC-ORQ-24 maps 500 PROMOTION_PERSIST_FAILED to authoritative REJECTED/false", async () => {
    const out = await orchestrateDeveloperPromotion(input(), deps({
      promote: vi.fn().mockRejectedValue(coreError(500, "PROMOTION_PERSIST_FAILED", "persistence failed")),
    }));
    expect(out).toMatchObject({
      promotionOutcome: "REJECTED", d2Committed: false,
      reasonCode: "PROMOTION_PERSIST_FAILED", reason: "persistence failed",
    });
  });

  it("TC-ORQ-25 keeps 500 PROMOTION_FAILED UNKNOWN while preserving reasonCode", async () => {
    const out = await orchestrateDeveloperPromotion(input(), deps({
      promote: vi.fn().mockRejectedValue(coreError(500, "PROMOTION_FAILED", "generic fallback")),
    }));
    expect(out).toMatchObject({
      promotionOutcome: "UNKNOWN", d2Committed: "UNKNOWN", d2Verified: false,
      effectsStatus: null, reasonCode: "PROMOTION_FAILED", reason: "generic fallback",
    });
  });

  it.each([
    [400, "INVALID_DEVELOPER_PROPOSAL", "INVALID_DEVELOPER_PROPOSAL"],
    [404, "PROPOSAL_NOT_FOUND", "PROPOSAL_NOT_FOUND"],
    [409, "HUMAN_REVIEW_BINDING_MISMATCH", "HUMAN_REVIEW_BINDING_MISMATCH"],
    [400, "GEOMETRY_CONTRACT_NOT_MAPPED:profile", "GEOMETRY_CONTRACT_NOT_MAPPED"],
    [400, "UNSUPPORTED_PROPERTY_VALUE:canonical", "UNSUPPORTED_PROPERTY_VALUE"],
  ])("accepts only authoritative HTTP/code pairs: %i %s", async (status, code, canonical) => {
    const out = await orchestrateDeveloperPromotion(input(), deps({
      promote: vi.fn().mockRejectedValue(coreError(status, code)),
    }));
    expect(out).toMatchObject({ promotionOutcome: "REJECTED", d2Committed: false, reasonCode: canonical });
  });

  it.each([
    [500, "INVALID_DEVELOPER_PROPOSAL"],
    [409, "PROJECT_NOT_FOUND"],
    [400, "UNKNOWN_PREFIX:value"],
    [400, "GEOMETRY_CONTRACT_NOT_MAPPED:"],
    [500, "SOMETHING_ELSE"],
  ])("fails closed for incoherent or unknown HTTP/code pair: %i %s", async (status, code) => {
    const out = await orchestrateDeveloperPromotion(input(), deps({
      promote: vi.fn().mockRejectedValue(coreError(status, code, "observed message")),
    }));
    expect(out).toMatchObject({
      promotionOutcome: "UNKNOWN", d2Committed: "UNKNOWN",
      reasonCode: code, reason: "observed message",
    });
  });

  it("represents replay as COMMITTED plus Core reason ALREADY_COMMITTED", async () => {
    const out = await orchestrateDeveloperPromotion(input(), deps({
      promote: vi.fn().mockResolvedValue({
        status: "COMMITTED", proposal_id: "dev-prop-1", snapshot_id: "D2-1", d2_version: 1,
        effects_status: "NOT_ATTEMPTED", reason: "ALREADY_COMMITTED",
      }),
    }));
    expect(out).toMatchObject({
      promotionOutcome: "COMMITTED", d2Committed: true, d2Verified: true,
      effectsStatus: "NOT_ATTEMPTED", reason: "ALREADY_COMMITTED", stage: "COMPLETE",
    });
  });
});
