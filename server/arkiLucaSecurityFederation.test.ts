import { describe, expect, it } from "vitest";
import { authorizeFederatedArtifact, createFederatedLearningCandidate, securityFederationCatalog } from "../shared/arkiLucaSecurityFederation";

describe("ARKI-LUCA security federation", () => {
  it("exposes the same three defensive layers without merging cores", () => {
    const catalog = securityFederationCatalog();
    expect(catalog.layers).toEqual(["EDGE", "BRAIN_APPLICATION", "CORE_TRUST_MANiac"]);
    expect(catalog.invariants).toContain("MJP_CORE_AND_ARKI_CORE_ISOLATED");
  });

  it("creates only a candidate and requires human approval to reuse it", () => {
    const candidate = createFederatedLearningCandidate({
      artifactId: "luca-security-001",
      sourceProduct: "ARKI",
      targetProduct: "LUCA",
      sourceCommit: "abc1234",
      capability: "security-layer-catalog",
      summary: "Defensive controls for field and TV surfaces",
      evidence: ["server/arkiSecurityLayers.ts"],
      unknowns: ["physical-host-policy"],
      humanReviewer: undefined,
      createdAt: "2026-09-22T00:00:00Z",
    });
    expect(candidate.status).toBe("CANDIDATE");
    expect(candidate.containsSecrets).toBe(false);
    expect(candidate.changesCanonicalState).toBe(false);
    expect(authorizeFederatedArtifact(candidate)).toEqual({ allowed: false, reason: "HUMAN_REVIEW_REQUIRED" });
    expect(authorizeFederatedArtifact({ ...candidate, humanApproved: true })).toEqual({ allowed: true, reason: "FEDERATED_ARTIFACT_APPROVED" });
  });

  it("rejects missing provenance and attempts to transfer secrets or canonical writes", () => {
    const base = { sourceProduct: "ARKI" as const, targetProduct: "LUCA" as const, sourceCommit: "", evidence: [], containsSecrets: false as const, changesCanonicalState: false as const };
    expect(authorizeFederatedArtifact(base)).toEqual({ allowed: false, reason: "SOURCE_COMMIT_REQUIRED" });
    expect(authorizeFederatedArtifact({ ...base, sourceCommit: "abc", evidence: ["x"], containsSecrets: true })).toEqual({ allowed: false, reason: "SECRETS_NEVER_TRANSFERRED" });
    expect(authorizeFederatedArtifact({ ...base, sourceCommit: "abc", evidence: ["x"], changesCanonicalState: true })).toEqual({ allowed: false, reason: "CANDIDATE_CANNOT_CHANGE_CANONICAL_STATE" });
  });
});
