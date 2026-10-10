import { describe, expect, it } from "vitest";
import { buildCoordinatedProfessionalState, createBaseline0, type ProfessionalProjection } from "./arkiProfessionalState";
import { createProjectCostBaseline, evaluateEconomicMutation } from "./arkiProjectEconomicTwin";
import { generateTechnicalDossier, verifyDossierLineage } from "./arkiTechnicalDossier";
import type { F7CanonicalRefs } from "../shared/arkiCanonicalRefs";
import { createF9FieldBaseline, createF9FieldEvidenceBatch, assessF9FieldEvidence } from "./arkiF9ConstructionLineage";

const canonicalRefs: F7CanonicalRefs = {
  coreProject: { authority: "CORE", projectId: "P1", stateId: "CORE-P1-R1", revision: 1, sourceRepo: "sicl-core" },
  d2State: { authority: "D2", projectId: "P1", stateId: "D2-1", sourceRepo: "sicl-core" },
  agkState: { authority: "AGK", projectId: "P1", stateId: "AGK-S1", sourceRepo: "sicl-web" },
};

function baseline() {
  return createBaseline0({
    baselineId: "B0", projectId: "P1",
    sourceArtifacts: [{ sourceId: "RVT-1", checksum: "sha256:abc", format: "RVT", receivedAt: "2026-10-07T00:00:00Z" }],
    claims: [{ claimId: "C1", sourceId: "RVT-1", subjectId: "S1", field: "kind", value: "SPACE", evidenceState: "VERIFIED", provenance: ["RVT-1:Element:10"] }],
    contradictions: [],
  });
}
const projections: ProfessionalProjection[] = [{ projectionId: "ARCH-1", discipline: "ARCHITECTURE", semanticIds: ["S1"], agkObjectIds: ["AGK-1"], sourceClaimIds: ["C1"], evidenceState: "VERIFIED", unknowns: [], specialistReviewRequired: false }];

describe("F7 professional state and F8 dossier closure spine", () => {
  it("fails closed when Core/D2/AGK authority references do not belong to the same project", () => {
    const invalidRefs: F7CanonicalRefs = {
      ...canonicalRefs,
      coreProject: { ...canonicalRefs.coreProject, projectId: "OTHER" },
    };
    expect(() => buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-X", canonicalRefs: invalidRefs, baseline: baseline(), projections, issues: [],
    })).toThrow("CANONICAL_REF_PROJECT_MISMATCH:CORE");
  });

  it("rejects forged reconciliation scope and projection claims outside BASELINE_0", () => {
    expect(() => createBaseline0({
      baselineId: "B0", projectId: "P1",
      sourceArtifacts: [{ sourceId: "A", checksum: "x", format: "RVT", receivedAt: "2026-10-07" }],
      claims: [
        { claimId: "C1", sourceId: "A", subjectId: "S1", field: "height", value: 3, evidenceState: "VERIFIED", provenance: ["A:1"] },
        { claimId: "C2", sourceId: "A", subjectId: "S2", field: "width", value: 4, evidenceState: "VERIFIED", provenance: ["A:2"] },
      ],
      contradictions: [{ contradictionId: "X", subjectId: "S1", field: "height", claimIds: ["C1", "C2"], status: "UNRESOLVED" }],
    })).toThrow("CONTRADICTION_SCOPE_MISMATCH:X");

    const b = baseline();
    expect(() => buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-X", canonicalRefs, baseline: b,
      projections: [{ ...projections[0], sourceClaimIds: ["FORGED"] }], issues: [],
    })).toThrow("F7_PROJECTION_CLAIM_NOT_IN_BASELINE:ARCH-1");
  });

  it("keeps unresolved source contradictions visible and blocks F8 acceptance", () => {
    const b = createBaseline0({
      baselineId: "B0", projectId: "P1",
      sourceArtifacts: [{ sourceId: "A", checksum: "x", format: "RVT", receivedAt: "2026-10-07" }, { sourceId: "B", checksum: "y", format: "PDF", receivedAt: "2026-10-07" }],
      claims: [
        { claimId: "CA", sourceId: "A", subjectId: "S1", field: "height", value: 3, evidenceState: "VERIFIED", provenance: ["A:10"] },
        { claimId: "CB", sourceId: "B", subjectId: "S1", field: "height", value: 3.2, evidenceState: "VERIFIED", provenance: ["B:p2"] },
      ],
      contradictions: [{ contradictionId: "X1", subjectId: "S1", field: "height", claimIds: ["CA", "CB"], status: "UNRESOLVED" }],
    });
    const contradictionProjections = [{ ...projections[0], sourceClaimIds: ["CA", "CB"] }];
    const state = buildCoordinatedProfessionalState({ projectId: "P1", stateId: "F7-1", canonicalRefs, baseline: b, projections: contradictionProjections, issues: [] });
    expect(state.status).toBe("BLOCKED");
    expect(state.unknowns).toContain("UNRESOLVED_SOURCE_CONTRADICTION:X1");
    expect(() => buildCoordinatedProfessionalState({ projectId: "P1", stateId: "F7-1", canonicalRefs, baseline: b, projections: contradictionProjections, issues: [], humanAcceptance: { acceptedBy: "PO", evidence: "DEC-1" } })).toThrow("F7_ACCEPTANCE_BLOCKED_BY_EVIDENCE");
  });

  it("requires accepted mappings and preserves designed-to-cost provenance", () => {
    const cost = createProjectCostBaseline({ projectId: "P1", baselineId: "COST0", effectiveDate: "2026-10-07", currency: "PEN", sourceRef: "S10:EXPORT:1", items: [{ itemId: "ITEM-1", description: "Wall", unit: "m2", baselineQuantity: 10, unitPrice: 100, currency: "PEN", sourceRef: "S10:ITEM:1" }] });
    const q0 = [{ semanticId: "S1", agkObjectId: "AGK-1", ruleId: "AREA-WALL", quantity: 10, unit: "m2", provenance: ["AGK:MEASURE:1"] }];
    const q1 = [{ ...q0[0], quantity: 12, provenance: ["AGK:MEASURE:2"] }];
    const unknown = evaluateEconomicMutation({ baseline: cost, quantitiesBefore: q0, quantitiesAfter: q1, mappings: [{ semanticId: "S1", itemId: "ITEM-1", confidence: 0.8, evidence: [] }] });
    expect(unknown.status).toBe("UNKNOWN");
    const evaluated = evaluateEconomicMutation({ baseline: cost, quantitiesBefore: q0, quantitiesAfter: q1, mappings: [{ semanticId: "S1", itemId: "ITEM-1", confidence: 1, acceptedBy: "QS-1", evidence: ["MAP-DECISION-1"] }] });
    expect(evaluated.status).toBe("EVALUATED");
    expect(evaluated.directCostDelta).toBe(200);
    expect(evaluated.deltas[0].provenance).toEqual(expect.arrayContaining(["AGK:MEASURE:1", "AGK:MEASURE:2", "MAP-DECISION-1", "S10:ITEM:1"]));
  });

  it("blocks F7 acceptance while any specialist review remains outstanding", () => {
    const b = baseline();
    const specialistPending = [{ ...projections[0], specialistReviewRequired: true }];
    const state = buildCoordinatedProfessionalState({ projectId: "P1", stateId: "F7-S", canonicalRefs, baseline: b, projections: specialistPending, issues: [] });
    expect(state.status).toBe("BLOCKED");
    expect(() => buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-S", canonicalRefs, baseline: b, projections: specialistPending, issues: [],
      humanAcceptance: { acceptedBy: "PO", evidence: "DEC" },
    })).toThrow("F7_ACCEPTANCE_BLOCKED_BY_EVIDENCE");
  });

  it("allows F8 only from accepted F7 and verifies dossier lineage", () => {
    const b = baseline();
    const ready = buildCoordinatedProfessionalState({ projectId: "P1", stateId: "F7-1", canonicalRefs, baseline: b, projections, issues: [] });
    expect(ready.status).toBe("READY_FOR_HUMAN_ACCEPTANCE");
    expect(() => generateTechnicalDossier({ state: ready, dossierId: "D1", artifacts: [] })).toThrow("F8_REQUIRES_ACCEPTED_F7_STATE");
    const accepted = buildCoordinatedProfessionalState({ projectId: "P1", stateId: "F7-1", canonicalRefs, baseline: b, projections, issues: [], humanAcceptance: { acceptedBy: "PO", evidence: "DEC-F7" } });
    const kinds = ["DRAWING", "SPECIFICATION", "QUANTITY_SCHEDULE", "BUDGET", "COORDINATION_REPORT", "EVIDENCE_REGISTER"] as const;
    const dossier = generateTechnicalDossier({ state: accepted, dossierId: "D1", artifacts: kinds.map((kind, i) => ({ artifactId: `A${i}`, kind, semanticIds: ["S1"], provenance: [`GEN:${kind}`], contentFingerprint: `sha256:${i}` })) });
    expect(dossier.exportIsCanonicalTruth).toBe(false);
    expect(dossier.coreProjectRef).toBe("CORE-P1-R1");
    expect(verifyDossierLineage(dossier, accepted).status).toBe("PASS");
    expect(verifyDossierLineage({ ...dossier, coreProjectRef: "OTHER" }, accepted).failures).toContain("CORE_REF_MISMATCH");
  });
});

describe("F7/F8 integrity and F9 construction lineage (bounded)", () => {
  function acceptedPackage() {
    const b = baseline();
    const f7 = buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-ACCEPTED", canonicalRefs, baseline: b,
      projections, issues: [], humanAcceptance: { acceptedBy: "REVIEWER", evidence: "DEC-F7" },
    });
    const kinds = ["DRAWING", "SPECIFICATION", "QUANTITY_SCHEDULE", "BUDGET", "COORDINATION_REPORT", "EVIDENCE_REGISTER"] as const;
    const f8 = generateTechnicalDossier({
      state: f7, dossierId: "DOSSIER-1",
      artifacts: kinds.map((kind, i) => ({ artifactId: `A-${i}`, kind, semanticIds: ["S1"], provenance: [`GEN:${kind}`], contentFingerprint: `sha256:${i}` })),
    });
    return { f7, f8 };
  }

  it("rejects a tampered F7 baseline and duplicate professional identities", () => {
    const b = baseline();
    expect(() => buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-T", canonicalRefs, baseline: { ...b, projectId: "P1", claims: [...b.claims, { ...b.claims[0], claimId: "FORGED" }] },
      projections, issues: [],
    })).toThrow("F7_BASELINE_FINGERPRINT_MISMATCH");
    expect(() => buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-T", canonicalRefs, baseline: b,
      projections: [projections[0], projections[0]], issues: [],
    })).toThrow("F7_DUPLICATE_PROJECTION_ID");
    const issue = { issueId: "X", kind: "CLASH" as const, status: "OPEN" as const, semanticIds: ["S1"], evidence: ["TEST"], reason: "Conflict" };
    expect(() => buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-T", canonicalRefs, baseline: b, projections,
      issues: [issue, issue],
    })).toThrow("F7_DUPLICATE_ISSUE_ID");
  });

  it("rejects duplicate F8 artifacts and detects dossier tampering", () => {
    const { f7, f8 } = acceptedPackage();
    expect(() => generateTechnicalDossier({
      state: f7, dossierId: "DUP",
      artifacts: f8.artifacts.map(a => ({ ...a, artifactId: "SAME" })),
    })).toThrow("F8_DUPLICATE_ARTIFACT_ID");
    expect(verifyDossierLineage({ ...f8, projectId: "OTHER" }, f7).failures).toContain("DOSSIER_INTEGRITY_MISMATCH");
    expect(verifyDossierLineage({ ...f8, projectId: "OTHER" }, f7).failures).toContain("PROJECT_ID_MISMATCH");
    expect(() => generateTechnicalDossier({
      state: { ...f7, d2StateRef: "FORGED" }, dossierId: "X", artifacts: f8.artifacts,
    })).toThrow("F8_F7_STATE_FINGERPRINT_MISMATCH");
  });

  it("blocks F9 when F7 is unaccepted, F8 is tampered or release evidence is missing", () => {
    const { f7, f8 } = acceptedPackage();
    const readyOnly = buildCoordinatedProfessionalState({
      projectId: "P1", stateId: "F7-READY", canonicalRefs, baseline: baseline(), projections, issues: [],
    });
    expect(() => createF9FieldBaseline({
      baselineId: "FIELD-0", f7: readyOnly, f8, professionalReleaseEvidence: ["SIGNED-RELEASE"],
    })).toThrow("F9_REQUIRES_ACCEPTED_F7");
    expect(() => createF9FieldBaseline({
      baselineId: "FIELD-0", f7, f8: { ...f8, agkStateRef: "FORGED" }, professionalReleaseEvidence: ["SIGNED-RELEASE"],
    })).toThrow("F9_F8_LINEAGE_NOT_VERIFIED");
    expect(() => createF9FieldBaseline({
      baselineId: "FIELD-0", f7, f8, professionalReleaseEvidence: [],
    })).toThrow("F9_PROFESSIONAL_RELEASE_EVIDENCE_REQUIRED");
  });

  it("creates a traceable F9 candidate and rejects invalid or duplicate field evidence", () => {
    const { f7, f8 } = acceptedPackage();
    const field = createF9FieldBaseline({ baselineId: "FIELD-0", f7, f8, professionalReleaseEvidence: ["SIGNED-RELEASE"] });
    expect(field.status).toBe("FIELD_BASELINE_CANDIDATE");
    expect(field.canonicalMutation).toBe(false);
    const observation = {
      observationId: "OBS-1", projectId: "P1", baselineFingerprint: field.fingerprint,
      kind: "SITE_PHOTO" as const, capturedAt: "2026-10-08T03:00:00Z", sourceRef: "SITE:CAMERA:1",
      provenance: ["SITE:1"], semanticIds: ["S1"], discrepancy: "POSSIBLE" as const, reviewEvidence: [],
    };
    expect(() => createF9FieldEvidenceBatch({
      batchId: "B-1", baseline: field, observations: [observation, observation],
    })).toThrow("F9_DUPLICATE_OBSERVATION");
    expect(() => createF9FieldEvidenceBatch({
      batchId: "B-1", baseline: field, observations: [{ ...observation, projectId: "OTHER" }],
    })).toThrow("F9_OBSERVATION_LINEAGE_MISMATCH");
    expect(() => createF9FieldEvidenceBatch({
      batchId: "B-1", baseline: field, observations: [{ ...observation, discrepancy: "CONFIRMED_BY_REVIEW" }],
    })).toThrow("F9_REVIEW_EVIDENCE_REQUIRED");
    const batch = createF9FieldEvidenceBatch({ batchId: "B-1", baseline: field, observations: [observation] });
    const assessment = assessF9FieldEvidence(batch, field);
    expect(assessment.status).toBe("REVIEW_REQUIRED");
    expect(assessment.reviewRequired).toEqual(["OBS-1"]);
    expect(assessment.canonicalMutation).toBe(false);
    expect(assessF9FieldEvidence({ ...batch, projectId: "OTHER" }, field).failures).toContain("F9_BATCH_INTEGRITY_MISMATCH");
  });
});
