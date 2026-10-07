import { createHash } from "node:crypto";
import { validateF7CanonicalRefs, type F7CanonicalRefs } from "../shared/arkiCanonicalRefs";

export type EvidenceState = "VERIFIED" | "PARTIAL" | "UNKNOWN";
export type ProfessionalDiscipline = "ARCHITECTURE" | "STRUCTURE" | "MEP" | "LIFE_SAFETY" | "ACCESSIBILITY" | "COST";
export type SourceClaim = {
  claimId: string;
  sourceId: string;
  subjectId: string;
  field: string;
  value: unknown;
  evidenceState: EvidenceState;
  provenance: string[];
};
export type SourceContradiction = {
  contradictionId: string;
  subjectId: string;
  field: string;
  claimIds: string[];
  status: "UNRESOLVED" | "RESOLVED";
  acceptedClaimId?: string;
  decisionEvidence?: string[];
};
export type Baseline0 = {
  schema: "ARKI-BASELINE-0-1.0";
  baselineId: string;
  projectId: string;
  sourceArtifacts: ReadonlyArray<{ sourceId: string; checksum: string; format: string; receivedAt: string }>;
  claims: ReadonlyArray<SourceClaim>;
  contradictions: ReadonlyArray<SourceContradiction>;
  immutable: true;
  fingerprint: string;
};
export type ProfessionalProjection = {
  projectionId: string;
  discipline: ProfessionalDiscipline;
  semanticIds: string[];
  agkObjectIds: string[];
  sourceClaimIds: string[];
  evidenceState: EvidenceState;
  unknowns: string[];
  specialistReviewRequired: boolean;
};
export type ProfessionalIssue = {
  issueId: string;
  kind: "CLASH" | "CONSISTENCY" | "COMPLETENESS" | "JURISDICTION" | "ECONOMIC";
  status: "OPEN" | "RESOLVED";
  semanticIds: string[];
  evidence: string[];
  reason: string;
};
export type CoordinatedProfessionalState = {
  schema: "ARKI-F7-COORDINATED-STATE-1.0";
  projectId: string;
  stateId: string;
  canonicalRefs: F7CanonicalRefs;
  d2StateRef: string;
  agkStateRef: string;
  baseline0Fingerprint: string;
  projections: ProfessionalProjection[];
  issues: ProfessionalIssue[];
  unknowns: string[];
  status: "BLOCKED" | "READY_FOR_HUMAN_ACCEPTANCE" | "ACCEPTED_FOR_F8";
  humanAuthority: { required: true; acceptedBy?: string; evidence?: string };
  fingerprint: string;
};

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function nonEmpty(value: string, code: string) {
  if (!value.trim()) throw new Error(code);
}
export function createBaseline0(input: Omit<Baseline0, "schema" | "immutable" | "fingerprint">): Baseline0 {
  nonEmpty(input.projectId, "BASELINE_PROJECT_REQUIRED");
  if (!input.sourceArtifacts.length) throw new Error("BASELINE_SOURCE_REQUIRED");
  const sourceIds = new Set<string>();
  for (const source of input.sourceArtifacts) {
    nonEmpty(source.sourceId, "SOURCE_ID_REQUIRED");
    nonEmpty(source.checksum, "SOURCE_CHECKSUM_REQUIRED");
    if (sourceIds.has(source.sourceId)) throw new Error("DUPLICATE_SOURCE_ID");
    sourceIds.add(source.sourceId);
  }
  const claimIds = new Set<string>();
  for (const claim of input.claims) {
    nonEmpty(claim.claimId, "CLAIM_ID_REQUIRED");
    nonEmpty(claim.subjectId, `CLAIM_SUBJECT_REQUIRED:${claim.claimId}`);
    nonEmpty(claim.field, `CLAIM_FIELD_REQUIRED:${claim.claimId}`);
    if (claimIds.has(claim.claimId)) throw new Error(`DUPLICATE_CLAIM_ID:${claim.claimId}`);
    claimIds.add(claim.claimId);
    if (!sourceIds.has(claim.sourceId)) throw new Error(`CLAIM_SOURCE_NOT_IN_BASELINE:${claim.claimId}`);
    if (!claim.provenance.length) throw new Error(`CLAIM_PROVENANCE_REQUIRED:${claim.claimId}`);
  }
  for (const contradiction of input.contradictions) {
    nonEmpty(contradiction.contradictionId, "CONTRADICTION_ID_REQUIRED");
    if (contradiction.claimIds.length < 2) throw new Error(`CONTRADICTION_REQUIRES_MULTIPLE_CLAIMS:${contradiction.contradictionId}`);
    const contradictoryClaims = contradiction.claimIds.map(id => input.claims.find(claim => claim.claimId === id));
    if (contradictoryClaims.some(claim => !claim)) throw new Error(`CONTRADICTION_CLAIM_NOT_FOUND:${contradiction.contradictionId}`);
    if (contradictoryClaims.some(claim => claim!.subjectId !== contradiction.subjectId || claim!.field !== contradiction.field)) throw new Error(`CONTRADICTION_SCOPE_MISMATCH:${contradiction.contradictionId}`);
    if (contradiction.status === "RESOLVED") {
      if (!contradiction.acceptedClaimId || !contradiction.claimIds.includes(contradiction.acceptedClaimId)) throw new Error(`INVALID_ACCEPTED_CLAIM:${contradiction.contradictionId}`);
      if (!contradiction.decisionEvidence?.length) throw new Error(`RECONCILIATION_EVIDENCE_REQUIRED:${contradiction.contradictionId}`);
    }
  }
  const payload = { ...input, schema: "ARKI-BASELINE-0-1.0" as const, immutable: true as const };
  return { ...payload, fingerprint: hash(payload) };
}

export function buildCoordinatedProfessionalState(input: {
  projectId: string;
  stateId: string;
  canonicalRefs: F7CanonicalRefs;
  baseline: Baseline0;
  projections: ProfessionalProjection[];
  issues: ProfessionalIssue[];
  unknowns?: string[];
  humanAcceptance?: { acceptedBy: string; evidence: string };
}): CoordinatedProfessionalState {
  const canonicalRefs = validateF7CanonicalRefs(input.canonicalRefs, input.projectId);
  if (input.baseline.projectId !== input.projectId) throw new Error("BASELINE_PROJECT_MISMATCH");
  nonEmpty(input.stateId, "F7_STATE_ID_REQUIRED");
  const baselineClaimIds = new Set(input.baseline.claims.map(c => c.claimId));
  for (const projection of input.projections) {
    nonEmpty(projection.projectionId, "F7_PROJECTION_ID_REQUIRED");
    if (projection.sourceClaimIds.some(id => !baselineClaimIds.has(id))) throw new Error(`F7_PROJECTION_CLAIM_NOT_IN_BASELINE:${projection.projectionId}`);
  }
  if (input.humanAcceptance) {
    nonEmpty(input.humanAcceptance.acceptedBy, "F7_ACCEPTED_BY_REQUIRED");
    nonEmpty(input.humanAcceptance.evidence, "F7_ACCEPTANCE_EVIDENCE_REQUIRED");
  }
  const unresolvedContradictions = input.baseline.contradictions.filter(c => c.status === "UNRESOLVED");
  const projectionUnknowns = input.projections.flatMap(p => p.unknowns.map(u => `${p.projectionId}:${u}`));
  const unknowns = [...(input.unknowns ?? []), ...projectionUnknowns, ...unresolvedContradictions.map(c => `UNRESOLVED_SOURCE_CONTRADICTION:${c.contradictionId}`)];
  const openIssues = input.issues.filter(i => i.status === "OPEN");
  const incompleteEvidence = input.projections.some(p => p.evidenceState !== "VERIFIED");
  let status: CoordinatedProfessionalState["status"] = unknowns.length || openIssues.length || incompleteEvidence ? "BLOCKED" : "READY_FOR_HUMAN_ACCEPTANCE";
  if (input.humanAcceptance) {
    if (status === "BLOCKED") throw new Error("F7_ACCEPTANCE_BLOCKED_BY_EVIDENCE");
    status = "ACCEPTED_FOR_F8";
  }
  const payload = {
    schema: "ARKI-F7-COORDINATED-STATE-1.0" as const,
    projectId: input.projectId,
    stateId: input.stateId,
    canonicalRefs,
    d2StateRef: canonicalRefs.d2State.stateId,
    agkStateRef: canonicalRefs.agkState.stateId,
    baseline0Fingerprint: input.baseline.fingerprint,
    projections: input.projections,
    issues: input.issues,
    unknowns,
    status,
    humanAuthority: { required: true as const, ...(input.humanAcceptance ? { acceptedBy: input.humanAcceptance.acceptedBy, evidence: input.humanAcceptance.evidence } : {}) },
  };
  return { ...payload, fingerprint: hash(payload) };
}
