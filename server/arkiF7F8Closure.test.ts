import { describe, expect, it } from "vitest";
import { buildCoordinatedProfessionalState, createBaseline0, type ProfessionalProjection } from "./arkiProfessionalState";
import { createProjectCostBaseline, evaluateEconomicMutation } from "./arkiProjectEconomicTwin";
import { generateTechnicalDossier, verifyDossierLineage } from "./arkiTechnicalDossier";
import type { F7CanonicalRefs } from "../shared/arkiCanonicalRefs";

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
    const state = buildCoordinatedProfessionalState({ projectId: "P1", stateId: "F7-1", canonicalRefs, baseline: b, projections, issues: [] });
    expect(state.status).toBe("BLOCKED");
    expect(state.unknowns).toContain("UNRESOLVED_SOURCE_CONTRADICTION:X1");
    expect(() => buildCoordinatedProfessionalState({ projectId: "P1", stateId: "F7-1", canonicalRefs, baseline: b, projections, issues: [], humanAcceptance: { acceptedBy: "PO", evidence: "DEC-1" } })).toThrow("F7_ACCEPTANCE_BLOCKED_BY_EVIDENCE");
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
