import { createHash } from "node:crypto";
import type { CoordinatedProfessionalState } from "./arkiProfessionalState";
import { verifyDossierLineage, type generateTechnicalDossier } from "./arkiTechnicalDossier";

/**
 * F9 is an evidence-only construction/field projection. It never mutates Core,
 * D-2, AGK, F7 or F8, and it is not an as-built or site-acceptance authority.
 */
export type F8Dossier = ReturnType<typeof generateTechnicalDossier>;
export type F9FieldBaseline = {
  schema: "ARKI-F9-FIELD-BASELINE-0.1";
  baselineId: string;
  projectId: string;
  sourceF7Fingerprint: string;
  sourceF8Fingerprint: string;
  coreProjectRef: string;
  d2StateRef: string;
  agkStateRef: string;
  professionalReleaseEvidence: string[];
  status: "FIELD_BASELINE_CANDIDATE";
  canonicalMutation: false;
  fingerprint: string;
};
export type F9FieldObservation = {
  observationId: string;
  projectId: string;
  baselineFingerprint: string;
  kind: "SITE_PHOTO" | "MEASUREMENT" | "SITE_NOTE" | "RFI" | "INSPECTION" | "AS_BUILT_CANDIDATE";
  capturedAt: string;
  sourceRef: string;
  provenance: string[];
  semanticIds: string[];
  discrepancy: "NONE_REPORTED" | "POSSIBLE" | "CONFIRMED_BY_REVIEW";
  reviewEvidence: string[];
};
export type F9FieldEvidenceBatch = {
  schema: "ARKI-F9-FIELD-EVIDENCE-0.1";
  batchId: string;
  projectId: string;
  baselineFingerprint: string;
  observations: F9FieldObservation[];
  status: "REVIEW_REQUIRED";
  canonicalMutation: false;
  fingerprint: string;
};
const fingerprint = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const required = (value: string, code: string) => {
  if (typeof value !== "string" || !value.trim()) throw new Error(code);
};
const uniqueNonEmpty = (values: string[], code: string) => {
  if (!Array.isArray(values) || !values.length || values.some(x => typeof x !== "string" || !x.trim()) || new Set(values).size !== values.length) throw new Error(code);
};
const KINDS = new Set<F9FieldObservation["kind"]>(["SITE_PHOTO", "MEASUREMENT", "SITE_NOTE", "RFI", "INSPECTION", "AS_BUILT_CANDIDATE"]);

export function createF9FieldBaseline(input: {
  baselineId: string;
  f7: CoordinatedProfessionalState;
  f8: F8Dossier;
  professionalReleaseEvidence: string[];
}): F9FieldBaseline {
  required(input.baselineId, "F9_BASELINE_ID_REQUIRED");
  if (input.f7.status !== "ACCEPTED_FOR_F8") throw new Error("F9_REQUIRES_ACCEPTED_F7");
  if (input.f8.humanProfessionalSignatureRequired !== true) throw new Error("F9_F8_SIGNATURE_GATE_MISSING");
  if (verifyDossierLineage(input.f8, input.f7).status !== "PASS") throw new Error("F9_F8_LINEAGE_NOT_VERIFIED");
  uniqueNonEmpty(input.professionalReleaseEvidence, "F9_PROFESSIONAL_RELEASE_EVIDENCE_REQUIRED");
  const payload = {
    schema: "ARKI-F9-FIELD-BASELINE-0.1" as const,
    baselineId: input.baselineId,
    projectId: input.f7.projectId,
    sourceF7Fingerprint: input.f7.fingerprint,
    sourceF8Fingerprint: input.f8.fingerprint,
    coreProjectRef: input.f8.coreProjectRef,
    d2StateRef: input.f8.d2StateRef,
    agkStateRef: input.f8.agkStateRef,
    professionalReleaseEvidence: [...input.professionalReleaseEvidence],
    status: "FIELD_BASELINE_CANDIDATE" as const,
    canonicalMutation: false as const,
  };
  return { ...payload, fingerprint: fingerprint(payload) };
}

export function createF9FieldEvidenceBatch(input: {
  batchId: string;
  baseline: F9FieldBaseline;
  observations: F9FieldObservation[];
}): F9FieldEvidenceBatch {
  required(input.batchId, "F9_BATCH_ID_REQUIRED");
  const { fingerprint: baselineFingerprint, ...baselinePayload } = input.baseline;
  if (fingerprint(baselinePayload) !== baselineFingerprint) throw new Error("F9_BASELINE_INTEGRITY_MISMATCH");
  if (!Array.isArray(input.observations) || !input.observations.length) throw new Error("F9_OBSERVATIONS_REQUIRED");
  const ids = new Set<string>();
  for (const o of input.observations) {
    required(o.observationId, "F9_OBSERVATION_ID_REQUIRED");
    if (ids.has(o.observationId)) throw new Error(`F9_DUPLICATE_OBSERVATION:${o.observationId}`);
    ids.add(o.observationId);
    if (o.projectId !== input.baseline.projectId || o.baselineFingerprint !== baselineFingerprint) throw new Error(`F9_OBSERVATION_LINEAGE_MISMATCH:${o.observationId}`);
    if (!KINDS.has(o.kind)) throw new Error(`F9_OBSERVATION_KIND_INVALID:${o.observationId}`);
    required(o.sourceRef, `F9_OBSERVATION_SOURCE_REQUIRED:${o.observationId}`);
    uniqueNonEmpty(o.provenance, `F9_OBSERVATION_PROVENANCE_REQUIRED:${o.observationId}`);
    if (!Number.isFinite(Date.parse(o.capturedAt))) throw new Error(`F9_OBSERVATION_TIME_INVALID:${o.observationId}`);
    if (o.discrepancy === "CONFIRMED_BY_REVIEW") uniqueNonEmpty(o.reviewEvidence, `F9_REVIEW_EVIDENCE_REQUIRED:${o.observationId}`);
    else if (!["NONE_REPORTED", "POSSIBLE"].includes(o.discrepancy)) throw new Error(`F9_DISCREPANCY_INVALID:${o.observationId}`);
  }
  const payload = {
    schema: "ARKI-F9-FIELD-EVIDENCE-0.1" as const,
    batchId: input.batchId,
    projectId: input.baseline.projectId,
    baselineFingerprint,
    observations: input.observations.map(o => ({ ...o, provenance: [...o.provenance], semanticIds: [...o.semanticIds], reviewEvidence: [...o.reviewEvidence] })),
    status: "REVIEW_REQUIRED" as const,
    canonicalMutation: false as const,
  };
  return { ...payload, fingerprint: fingerprint(payload) };
}

export function assessF9FieldEvidence(batch: F9FieldEvidenceBatch, baseline: F9FieldBaseline) {
  const failures: string[] = [];
  const { fingerprint: baselineFingerprint, ...baselinePayload } = baseline;
  if (fingerprint(baselinePayload) !== baselineFingerprint) failures.push("F9_BASELINE_INTEGRITY_MISMATCH");
  const { fingerprint: batchFingerprint, ...batchPayload } = batch;
  if (fingerprint(batchPayload) !== batchFingerprint) failures.push("F9_BATCH_INTEGRITY_MISMATCH");
  if (batch.projectId !== baseline.projectId || batch.baselineFingerprint !== baselineFingerprint) failures.push("F9_BATCH_LINEAGE_MISMATCH");
  if (batch.canonicalMutation !== false || batch.status !== "REVIEW_REQUIRED") failures.push("F9_AUTHORITY_VIOLATION");
  const reviewRequired = batch.observations.filter(o => o.discrepancy !== "NONE_REPORTED").map(o => o.observationId);
  return {
    schema: "ARKI-F9-FIELD-ASSESSMENT-0.1" as const,
    status: failures.length ? "INVALID" as const : "REVIEW_REQUIRED" as const,
    failures,
    reviewRequired,
    canonicalMutation: false as const,
  };
}
