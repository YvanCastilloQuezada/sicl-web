import { describe, expect, it } from "vitest";
import {
  assessF7SourceReadiness,
  buildCoordinatedProfessionalState,
  createBaseline0,
  type ProfessionalProjection,
  type SourceClaim,
} from "./arkiProfessionalState";
import type { F7CanonicalRefs } from "../shared/arkiCanonicalRefs";

const refs: F7CanonicalRefs = {
  coreProject: { authority: "CORE", projectId: "P1", stateId: "CORE-P1-R1", revision: 1, sourceRepo: "sicl-core" },
  d2State: { authority: "D2", projectId: "P1", stateId: "D2-1", sourceRepo: "sicl-core" },
  agkState: { authority: "AGK", projectId: "P1", stateId: "AGK-S1", sourceRepo: "sicl-web" },
};
const verifiedClaim: SourceClaim = {
  claimId: "DOC1", sourceId: "BASES", subjectId: "OCID", field: "oece.document.other",
  value: { documentId: "BASES" }, evidenceState: "VERIFIED", provenance: ["OECE:PDF:SHA"],
};
const derivedClaim: SourceClaim = {
  claimId: "FRAGMENT1", sourceId: "DERIVED", subjectId: "OCID",
  field: "oece.derived.embedded_technical_fragment",
  value: { technicalCoreSetVerified: false, canonicalMutation: false },
  evidenceState: "PARTIAL", provenance: ["OECE:OCR:SHA", "OECE:FRAGMENT:SHA"],
};
const projection: ProfessionalProjection = {
  projectionId: "ARCH", discipline: "ARCHITECTURE", semanticIds: ["S1"], agkObjectIds: ["AGK1"],
  sourceClaimIds: ["DOC1"], evidenceState: "VERIFIED", unknowns: [], specialistReviewRequired: false,
};

function baseline(withFragment: boolean, override?: SourceClaim) {
  return createBaseline0({
    baselineId: "B0", projectId: "P1",
    sourceArtifacts: [
      { sourceId: "BASES", checksum: "sha256:pdf", format: "PDF", receivedAt: "OECE" },
      { sourceId: "DERIVED", checksum: "sha256:fragment", format: "OCR", receivedAt: "ACS" },
    ],
    claims: [verifiedClaim, ...(withFragment ? [override ?? derivedClaim] : [])],
    contradictions: [],
  });
}

describe("F7 OECE technical-fragment admission boundary", () => {
  it("blocks acceptance even if a projection silently omits the incomplete fragment", () => {
    const b = baseline(true);
    const readiness = assessF7SourceReadiness(b);
    expect(readiness.status).toBe("EVIDENCE_ONLY_BLOCKED");
    expect(readiness.blockers).toEqual([
      "OECE_EMBEDDED_TECHNICAL_FRAGMENT_REQUIRES_VERIFIED_CORE:FRAGMENT1",
    ]);
    const state = buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-1", canonicalRefs: refs, baseline: b,
      projections: [projection], issues: [],
    });
    expect(state.status).toBe("BLOCKED");
    expect(state.unknowns).toContain(readiness.blockers[0]);
    expect(() => buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-1", canonicalRefs: refs, baseline: b,
      projections: [projection], issues: [],
      humanAcceptance: { acceptedBy: "REVIEWER", evidence: "DECISION-1" },
    })).toThrow("F7_ACCEPTANCE_BLOCKED_BY_EVIDENCE");
  });

  it("does not allow forged VERIFIED status on a derived fragment to bypass the gate", () => {
    const forged = baseline(true, { ...derivedClaim, evidenceState: "VERIFIED" });
    expect(assessF7SourceReadiness(forged).status).toBe("EVIDENCE_ONLY_BLOCKED");
  });

  it("does not block unrelated verified-only baselines", () => {
    const b = baseline(false);
    expect(assessF7SourceReadiness(b).status).toBe("NO_EMBEDDED_FRAGMENT_BLOCKER");
    const state = buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-READY", canonicalRefs: refs,
      baseline: b, projections: [projection], issues: [],
    });
    expect(state.status).toBe("READY_FOR_HUMAN_ACCEPTANCE");
  });
});
