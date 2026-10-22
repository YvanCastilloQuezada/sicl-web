export type CanonicalAuthority = "CORE" | "D2" | "AGK";

export type CanonicalStateRef = {
  authority: CanonicalAuthority;
  projectId: string;
  stateId: string;
  revision?: number;
  fingerprint?: string;
  sourceRepo: "sicl-core" | "sicl-web";
};

export type F7CanonicalRefs = {
  coreProject: CanonicalStateRef & { authority: "CORE"; sourceRepo: "sicl-core" };
  d2State: CanonicalStateRef & { authority: "D2" };
  agkState: CanonicalStateRef & { authority: "AGK"; sourceRepo: "sicl-web" };
};

function required(value: string, code: string) {
  if (!value.trim()) throw new Error(code);
}

export function validateF7CanonicalRefs(refs: F7CanonicalRefs, projectId: string): F7CanonicalRefs {
  const all = [refs.coreProject, refs.d2State, refs.agkState];
  for (const ref of all) {
    required(ref.projectId, "CANONICAL_REF_PROJECT_REQUIRED");
    required(ref.stateId, "CANONICAL_REF_STATE_REQUIRED");
    if (ref.projectId !== projectId) throw new Error(`CANONICAL_REF_PROJECT_MISMATCH:${ref.authority}`);
  }
  if (refs.coreProject.authority !== "CORE" || refs.coreProject.sourceRepo !== "sicl-core") {
    throw new Error("CORE_AUTHORITY_REF_INVALID");
  }
  if (refs.d2State.authority !== "D2") throw new Error("D2_AUTHORITY_REF_INVALID");
  if (refs.agkState.authority !== "AGK" || refs.agkState.sourceRepo !== "sicl-web") {
    throw new Error("AGK_AUTHORITY_REF_INVALID");
  }
  return refs;
}

export const ARKI_AUTHORITY_LAW = Object.freeze({
  canonicalProjectState: "CORE",
  architecturalSemantics: "D2",
  operationalGeometry: "AGK",
  professionalState: "PROJECTION",
  technicalDossier: "DERIVED_PROJECTION",
} as const);
