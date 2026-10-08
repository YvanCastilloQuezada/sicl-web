import { createHash } from "node:crypto";
import type { CoordinatedProfessionalState } from "./arkiProfessionalState";

export type DossierArtifact = {
  artifactId: string;
  kind: "DRAWING" | "SPECIFICATION" | "QUANTITY_SCHEDULE" | "BUDGET" | "COORDINATION_REPORT" | "EVIDENCE_REGISTER";
  sourceStateFingerprint: string;
  semanticIds: string[];
  provenance: string[];
  contentFingerprint: string;
};
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function generateTechnicalDossier(input: {
  state: CoordinatedProfessionalState;
  dossierId: string;
  artifacts: Omit<DossierArtifact, "sourceStateFingerprint">[];
}) {
  if (input.state.status !== "ACCEPTED_FOR_F8") throw new Error("F8_REQUIRES_ACCEPTED_F7_STATE");
  const { fingerprint: stateFingerprint, ...statePayload } = input.state;
  if (hash(statePayload) !== stateFingerprint) throw new Error("F8_F7_STATE_FINGERPRINT_MISMATCH");
  if (!input.dossierId.trim()) throw new Error("F8_DOSSIER_ID_REQUIRED");
  if (input.state.unknowns.length) throw new Error("F8_REJECTS_UNRESOLVED_UNKNOWNS");
  if (input.state.issues.some(i => i.status === "OPEN")) throw new Error("F8_REJECTS_OPEN_F7_ISSUES");
  const requiredKinds = new Set<DossierArtifact["kind"]>(["DRAWING", "SPECIFICATION", "QUANTITY_SCHEDULE", "BUDGET", "COORDINATION_REPORT", "EVIDENCE_REGISTER"]);
  const observedKinds = new Set(input.artifacts.map(a => a.kind));
  const missing = Array.from(requiredKinds).filter(k => !observedKinds.has(k));
  if (missing.length) throw new Error(`F8_DOSSIER_INCOMPLETE:${missing.join(",")}`);
  const artifactIds = new Set<string>();
  const artifacts: DossierArtifact[] = input.artifacts.map(a => {
    if (!a.artifactId.trim()) throw new Error("F8_ARTIFACT_ID_REQUIRED");
    if (artifactIds.has(a.artifactId)) throw new Error(`F8_DUPLICATE_ARTIFACT_ID:${a.artifactId}`);
    artifactIds.add(a.artifactId);
    if (!a.provenance.length) throw new Error(`F8_ARTIFACT_PROVENANCE_REQUIRED:${a.artifactId}`);
    if (!a.contentFingerprint.trim()) throw new Error(`F8_ARTIFACT_FINGERPRINT_REQUIRED:${a.artifactId}`);
    return { ...a, sourceStateFingerprint: input.state.fingerprint };
  });
  const payload = {
    schema: "ARKI-F8-TECHNICAL-DOSSIER-1.0" as const,
    dossierId: input.dossierId,
    projectId: input.state.projectId,
    sourceF7StateId: input.state.stateId,
    sourceF7Fingerprint: input.state.fingerprint,
    coreProjectRef: input.state.canonicalRefs.coreProject.stateId,
    d2StateRef: input.state.d2StateRef,
    agkStateRef: input.state.agkStateRef,
    artifacts,
    status: "GENERATED_FROM_ACCEPTED_F7" as const,
    humanProfessionalSignatureRequired: true as const,
    exportIsCanonicalTruth: false as const,
  };
  return { ...payload, fingerprint: hash(payload) };
}

export function verifyDossierLineage(dossier: ReturnType<typeof generateTechnicalDossier>, state: CoordinatedProfessionalState) {
  const failures: string[] = [];
  const { fingerprint: stateFingerprint, ...statePayload } = state;
  if (hash(statePayload) !== stateFingerprint) failures.push("F7_STATE_INTEGRITY_MISMATCH");
  const { fingerprint: dossierFingerprint, ...dossierPayload } = dossier;
  if (hash(dossierPayload) !== dossierFingerprint) failures.push("DOSSIER_INTEGRITY_MISMATCH");
  if (dossier.projectId !== state.projectId) failures.push("PROJECT_ID_MISMATCH");
  if (dossier.sourceF7StateId !== state.stateId) failures.push("F7_STATE_ID_MISMATCH");
  if (dossier.status !== "GENERATED_FROM_ACCEPTED_F7" || dossier.exportIsCanonicalTruth !== false) failures.push("DOSSIER_AUTHORITY_VIOLATION");
  if (dossier.sourceF7Fingerprint !== state.fingerprint) failures.push("F7_FINGERPRINT_MISMATCH");
  if (dossier.coreProjectRef !== state.canonicalRefs.coreProject.stateId) failures.push("CORE_REF_MISMATCH");
  if (dossier.d2StateRef !== state.d2StateRef) failures.push("D2_REF_MISMATCH");
  if (dossier.agkStateRef !== state.agkStateRef) failures.push("AGK_REF_MISMATCH");
  for (const artifact of dossier.artifacts) if (artifact.sourceStateFingerprint !== state.fingerprint) failures.push(`ARTIFACT_STATE_MISMATCH:${artifact.artifactId}`);
  return { schema: "ARKI-F8-LINEAGE-VERIFY-1.0" as const, status: failures.length ? "FAIL" as const : "PASS" as const, failures };
}
