export const FEDERATED_SECURITY_VERSION = "ARKI-LUCA-SECURITY-FEDERATION-1.0" as const;
export const FEDERATED_PRODUCTS = ["ARKI", "LUCA"] as const;
export type FederatedProduct = (typeof FEDERATED_PRODUCTS)[number];
export const FEDERATED_SECURITY_LAYERS = ["EDGE", "BRAIN_APPLICATION", "CORE_TRUST_MANiac"] as const;
export type FederatedSecurityLayer = (typeof FEDERATED_SECURITY_LAYERS)[number];
export const FEDERATED_LEARNING_STATUSES = ["CANDIDATE", "HUMAN_REVIEW", "APPROVED", "REJECTED", "FROZEN"] as const;
export type FederatedLearningStatus = (typeof FEDERATED_LEARNING_STATUSES)[number];

export type FederatedLearningArtifact = {
  artifactId: string;
  sourceProduct: FederatedProduct;
  targetProduct: FederatedProduct;
  sourceCommit: string;
  capability: string;
  summary: string;
  evidence: string[];
  unknowns: string[];
  status: FederatedLearningStatus;
  humanReviewer?: string;
  createdAt: string;
  containsSecrets: false;
  changesCanonicalState: false;
};

export const FEDERATED_SECURITY_INVARIANTS = [
  "EDGE_DENY_AND_DEGRADE",
  "BRAIN_CANDIDATE_ONLY",
  "CORE_TRUST_FAIL_CLOSED",
  "NO_CROSS_PRODUCT_SECRET_TRANSFER",
  "NO_AUTOMATIC_CANONICAL_PROMOTION",
  "HUMAN_REVIEW_BEFORE_REUSE",
  "SOURCE_COMMIT_AND_PROVENANCE_REQUIRED",
  "MJP_CORE_AND_ARKI_CORE_ISOLATED",
] as const;

export function authorizeFederatedArtifact(input: Pick<FederatedLearningArtifact, "sourceProduct" | "targetProduct" | "sourceCommit" | "evidence" | "containsSecrets" | "changesCanonicalState"> & { humanApproved?: boolean }) {
  if (input.sourceProduct === input.targetProduct) return { allowed: false as const, reason: "CROSS_PRODUCT_ONLY" };
  if (!input.sourceCommit.trim()) return { allowed: false as const, reason: "SOURCE_COMMIT_REQUIRED" };
  if (input.evidence.length === 0) return { allowed: false as const, reason: "EVIDENCE_REQUIRED" };
  if (input.containsSecrets) return { allowed: false as const, reason: "SECRETS_NEVER_TRANSFERRED" };
  if (input.changesCanonicalState) return { allowed: false as const, reason: "CANDIDATE_CANNOT_CHANGE_CANONICAL_STATE" };
  if (input.humanApproved !== true) return { allowed: false as const, reason: "HUMAN_REVIEW_REQUIRED" };
  return { allowed: true as const, reason: "FEDERATED_ARTIFACT_APPROVED" };
}

export function createFederatedLearningCandidate(input: Omit<FederatedLearningArtifact, "status" | "containsSecrets" | "changesCanonicalState">): FederatedLearningArtifact {
  return { ...input, status: "CANDIDATE", containsSecrets: false, changesCanonicalState: false };
}

export function securityFederationCatalog() {
  return { version: FEDERATED_SECURITY_VERSION, layers: FEDERATED_SECURITY_LAYERS, products: FEDERATED_PRODUCTS, invariants: FEDERATED_SECURITY_INVARIANTS } as const;
}
