import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { canPublishWorldObject, canTransitionWorldObject, isRuntimeVisible } from "./territorialTrust";

describe("Order 54 The Eye backend contract", () => {
  it("exposes the review, evidence, conflict and human-publication procedures", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    for (const name of [
      "territorial.reviewQueue",
      "territorial.claimDossier",
      "territorial.evidenceMatrix",
      "territorial.conflictReview",
      "territorial.createReview",
      "territorial.updateReview",
      "territorial.requestEvidence",
      "territorial.markDisputed",
      "territorial.verifyClaim",
      "territorial.rejectClaim",
      "territorial.requestHumanPublication",
      "territorial.publishApprovedVersion",
    ]) expect(procedures).toContain(name);
  });

  it("keeps verification separate from publication and runtime visibility", () => {
    expect(canTransitionWorldObject("UNDER_REVIEW", "VERIFIED")).toBe(true);
    expect(canTransitionWorldObject("VERIFIED", "PUBLISHED")).toBe(true);
    expect(canPublishWorldObject("VERIFIED", 0, 1, 1)).toBe(false);
    expect(canPublishWorldObject("VERIFIED", 1, 1, 1)).toBe(true);
    expect(isRuntimeVisible("VERIFIED")).toBe(false);
    expect(isRuntimeVisible("PUBLISHED")).toBe(true);
  });
});
