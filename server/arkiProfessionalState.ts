import { createHash } from "node:crypto";

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
  for (const claim of input.claims) {
    if (!sourceIds.has(claim.sourceId)) throw new Error(`CLAIM_SOURCE_NOT_IN_BASELINE:${claim.claimId}`);
    if (!claim.provenance.length) throw new Error(`CLAIM_PROVENANCE_REQUIRED:${claim.claimId}`);
  }
  for (const contradiction of input.contradictions) {
    if (contradiction.claimIds.length < 2) throw new Error(`CONTRADICTION_REQUIRES_MULTIPLE_CLAIMS:${contradiction.contradictionId}`);
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
  d2StateRef: string;
  agkStateRef: string;
  baseline: Baseline0;
  projections: ProfessionalProjection[];
  issues: ProfessionalIssue[];
  unknowns?: string[];
  humanAcceptance?: { acceptedBy: string; evidence: string };
}): CoordinatedProfessionalState {
  nonEmpty(input.d2StateRef, "D2_STATE_REF_REQUIRED");
  nonEmpty(input.agkStateRef, "AGK_STATE_REF_REQUIRED");
  if (input.baseline.projectId !== input.projectId) throw new Error("BASELINE_PROJECT_MISMATCH");
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
    d2StateRef: input.d2StateRef,
    agkStateRef: input.agkStateRef,
    baseline0Fingerprint: input.baseline.fingerprint,
    projections: input.projections,
    issues: input.issues,
    unknowns,
    status,
    humanAuthority: { required: true as const, ...(input.humanAcceptance ? { acceptedBy: input.humanAcceptance.acceptedBy, evidence: input.humanAcceptance.evidence } : {}) },
  };
  return { ...payload, fingerprint: hash(payload) };
}
