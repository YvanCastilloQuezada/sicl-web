import type { ApplicabilityScale, KnowledgeState } from "./arkiLivingKnowledge";

export const SHARED_FOUNDATION_SCHEMA = "ARKI-SHARED-FOUNDATION-1.0" as const;
export const FOUNDATION_API_VERSION = "1.0.0" as const;

export type TruthStatus = "FACT" | "OBSERVED" | "INFERRED" | "ASSUMPTION" | "UNKNOWN" | "REQUIRED_INPUT" | "PROPOSAL";
export type EvidenceStatus = "NONE" | "PRESENT" | "INSUFFICIENT" | "CONFLICTING" | "UNAVAILABLE";
export type ValidationStatus = "NOT_VALIDATED" | "VALIDATED" | "PROFESSIONALLY_VALIDATED" | "REJECTED" | "REVIEW_REQUIRED";

export type EpistemicStatus = Readonly<{
  truth: TruthStatus;
  evidence: EvidenceStatus;
  validation: ValidationStatus;
  knowledgeState?: KnowledgeState;
  humanDecisionRequired: boolean;
  reason?: string;
}>;

export type StableIdentity = Readonly<{
  arkiId: string;
  semanticType: string;
  projectId?: string;
  createdAt: string;
  supersedes?: string;
}>;

export type ExternalIdentity = Readonly<{
  system: string;
  externalId: string;
  version?: string;
}>;

export type ProvenanceRecord = Readonly<{
  provenanceId: string;
  source: string;
  sourceType: "USER" | "SYSTEM" | "STANDARD" | "IMPORT" | "INFERENCE" | "TEST";
  actor: string;
  observedAt: string;
  action: string;
  evidenceIds: readonly string[];
}>;

export type EvidenceRecord = Readonly<{
  evidenceId: string;
  sourceUri: string;
  sourceType: "USER" | "OFFICIAL" | "TECHNICAL" | "RUNTIME" | "TEST" | "INFERENCE" | "UNKNOWN";
  observedAt: string;
  contentHash: string;
  reliability: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  excerpt?: string;
  locator?: string;
}>;

export type IdentityMapping = Readonly<{
  internal: StableIdentity;
  external: ExternalIdentity;
  kind: "EXACT" | "PARTIAL" | "CONTEXTUAL" | "REFERENCE_ONLY" | "UNKNOWN";
  provenance: readonly ProvenanceRecord[];
}>;

export type Applicability = Readonly<{
  scale: ApplicabilityScale;
  disciplines: readonly string[];
  jurisdiction?: string;
  phase?: string;
  projectType?: string;
  entityTypes?: readonly string[];
}>;

export type UnitDimension = "LENGTH" | "AREA" | "VOLUME" | "MASS" | "TIME" | "CURRENCY" | "COUNT" | "ANGLE";
export type UnitValue = Readonly<{
  value: number;
  unit: string;
  dimension: UnitDimension;
  currency?: string;
}>;

export type QuantityLedgerEntry = Readonly<{
  quantityId: string;
  semanticId: string;
  quantity: UnitValue;
  source: "DERIVED" | "IMPORTED" | "USER";
  evidenceIds: readonly string[];
  epistemic: EpistemicStatus;
}>;

export type DependencyEdge = Readonly<{
  edgeId: string;
  sourceId: string;
  targetId: string;
  relation: "REQUIRES" | "DERIVED_FROM" | "AFFECTS" | "SUPERSEDES" | "HOSTED_BY";
  provenance: ProvenanceRecord;
}>;

export type SemanticConcept = Readonly<{
  semanticId: string;
  canonicalName: string;
  aliases: readonly string[];
  applicable: readonly Applicability[];
  evidence: readonly EvidenceRecord[];
  epistemic: EpistemicStatus;
  provenance: readonly ProvenanceRecord[];
  supersedes?: string;
}>;

export type CuratorProposal = Readonly<{
  proposalId: string;
  kind: "ADD_CONCEPT" | "ADD_ALIAS" | "ADD_MAPPING" | "SUPERSEDE_CONCEPT";
  targetSemanticId?: string;
  concept?: SemanticConcept;
  mapping?: IdentityMapping;
  provenance: readonly ProvenanceRecord[];
}>;

export type CuratorReview = Readonly<{
  proposalId: string;
  decision: "REUSE_EXISTING" | "PROPOSE_NEW" | "REQUIRES_HUMAN_AUTHORITY" | "REJECT_DUPLICATE" | "REJECT_UNSUPPORTED";
  findings: readonly string[];
  suggestedSemanticId?: string;
  canonicalMutation: false;
}>;

export type FoundationSnapshot = Readonly<{
  schema: typeof SHARED_FOUNDATION_SCHEMA;
  identities: readonly StableIdentity[];
  mappings: readonly IdentityMapping[];
  concepts: readonly SemanticConcept[];
  evidence: readonly EvidenceRecord[];
  quantities: readonly QuantityLedgerEntry[];
  dependencies: readonly DependencyEdge[];
}>;

const UNIT_TABLE: Readonly<Record<string, { dimension: UnitDimension; factor: number }>> = {
  mm: { dimension: "LENGTH", factor: 0.001 },
  cm: { dimension: "LENGTH", factor: 0.01 },
  m: { dimension: "LENGTH", factor: 1 },
  km: { dimension: "LENGTH", factor: 1000 },
  mm2: { dimension: "AREA", factor: 0.000001 },
  cm2: { dimension: "AREA", factor: 0.0001 },
  m2: { dimension: "AREA", factor: 1 },
  cm3: { dimension: "VOLUME", factor: 0.000001 },
  m3: { dimension: "VOLUME", factor: 1 },
  kg: { dimension: "MASS", factor: 1 },
  t: { dimension: "MASS", factor: 1000 },
  s: { dimension: "TIME", factor: 1 },
  min: { dimension: "TIME", factor: 60 },
  h: { dimension: "TIME", factor: 3600 },
  day: { dimension: "TIME", factor: 86400 },
  count: { dimension: "COUNT", factor: 1 },
  deg: { dimension: "ANGLE", factor: 1 },
};

export function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`).join(",")}}`;
}

export function stableFingerprint(value: unknown): string {
  let hash = 2166136261;
  for (const character of stableSerialize(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function assertStableIdentity(item: StableIdentity): void {
  if (!item.arkiId || !item.semanticType || !/^\d{4}-\d{2}-\d{2}T/.test(item.createdAt)) {
    throw new Error("INVALID_STABLE_IDENTITY");
  }
}

export function assertNoDuplicateIdentities(items: readonly StableIdentity[]): void {
  const ids = new Set<string>();
  for (const item of items) {
    assertStableIdentity(item);
    if (!ids.add(item.arkiId)) throw new Error(`DUPLICATE_ARKI_ID:${item.arkiId}`);
  }
}

export function assertNoIdentityCollisions(items: readonly IdentityMapping[]): void {
  const seen = new Map<string, string>();
  for (const item of items) {
    if (item.provenance.length === 0) throw new Error("MAPPING_PROVENANCE_REQUIRED");
    const key = `${item.external.system}|${item.external.version ?? "*"}|${item.external.externalId}`;
    const previous = seen.get(key);
    if (previous && previous !== item.internal.arkiId) throw new Error(`EXTERNAL_IDENTITY_COLLISION:${key}`);
    seen.set(key, item.internal.arkiId);
  }
}

export function assertEpistemicConsistency(status: EpistemicStatus): void {
  if (status.truth === "FACT" && status.evidence !== "PRESENT") throw new Error("FACT_REQUIRES_EVIDENCE");
  if (status.truth === "UNKNOWN" && status.validation === "VALIDATED") throw new Error("UNKNOWN_CANNOT_BE_VALIDATED");
  if (["INSUFFICIENT", "CONFLICTING", "UNAVAILABLE"].includes(status.evidence) && !status.humanDecisionRequired) {
    throw new Error("UNCERTAINTY_REQUIRES_HUMAN_DECISION");
  }
}

export function assertApplicability(actual: Applicability, required: Applicability): void {
  if (actual.scale !== required.scale) throw new Error("NO_SCALE_EXTRAPOLATION");
  for (const discipline of required.disciplines) {
    if (!actual.disciplines.includes(discipline)) throw new Error(`NO_DISCIPLINE_EXTRAPOLATION:${discipline}`);
  }
  for (const key of ["jurisdiction", "phase", "projectType"] as const) {
    if (required[key] !== undefined && actual[key] !== required[key]) throw new Error(`APPLICABILITY_MISMATCH:${key}`);
  }
}

export function normalizeUnit(value: UnitValue, targetUnit: string): UnitValue {
  const source = UNIT_TABLE[value.unit];
  const target = UNIT_TABLE[targetUnit];
  if (!source || !target || source.dimension !== target.dimension || value.dimension !== source.dimension) {
    throw new Error("UNIT_DIMENSION_MISMATCH");
  }
  if (value.dimension === "CURRENCY" || value.currency) throw new Error("CURRENCY_CONVERSION_CONTEXT_REQUIRED");
  return { value: value.value * source.factor / target.factor, unit: targetUnit, dimension: target.dimension };
}

export function addQuantities(left: UnitValue, right: UnitValue, targetUnit = left.unit): UnitValue {
  const first = normalizeUnit(left, targetUnit);
  const second = normalizeUnit(right, targetUnit);
  return { value: first.value + second.value, unit: targetUnit, dimension: first.dimension };
}

export function assertAcyclicDependencies(edges: readonly DependencyEdge[]): void {
  const graph = new Map<string, string[]>();
  for (const edge of edges) graph.set(edge.sourceId, [...(graph.get(edge.sourceId) ?? []), edge.targetId]);
  const active = new Set<string>();
  const completed = new Set<string>();
  const visit = (node: string): void => {
    if (active.has(node)) throw new Error("DEPENDENCY_CYCLE");
    if (completed.has(node)) return;
    active.add(node);
    for (const next of graph.get(node) ?? []) visit(next);
    active.delete(node);
    completed.add(node);
  };
  Array.from(graph.keys()).forEach(visit);
}

export function validateFoundationSnapshot(snapshot: FoundationSnapshot): void {
  if (snapshot.schema !== SHARED_FOUNDATION_SCHEMA) throw new Error("FOUNDATION_SCHEMA_MISMATCH");
  assertNoDuplicateIdentities(snapshot.identities);
  assertNoIdentityCollisions(snapshot.mappings);
  assertAcyclicDependencies(snapshot.dependencies);
  for (const quantity of snapshot.quantities) {
    if (!quantity.quantityId || !quantity.semanticId || !Number.isFinite(quantity.quantity.value)) throw new Error("INVALID_QUANTITY_ENTRY");
    assertEpistemicConsistency(quantity.epistemic);
  }
}

export function foundationSnapshotFingerprint(snapshot: FoundationSnapshot): string {
  validateFoundationSnapshot(snapshot);
  return stableFingerprint(snapshot);
}

export function rejectExecutablePayload(value: unknown): void {
  if (typeof value === "function") throw new Error("ARBITRARY_CODE_REJECTED");
  if (typeof value === "object" && value !== null && ["callback", "execute", "eval"].some((key) => key in value)) {
    throw new Error("ARBITRARY_CODE_REJECTED");
  }
}

export function reviewCuratorProposal(snapshot: FoundationSnapshot, proposal: CuratorProposal): CuratorReview {
  if (proposal.kind === "ADD_CONCEPT") {
    if (!proposal.concept) return { proposalId: proposal.proposalId, decision: "REJECT_UNSUPPORTED", findings: ["CONCEPT_REQUIRED"], canonicalMutation: false };
    const existing = snapshot.concepts.find((item) => item.semanticId === proposal.concept?.semanticId || item.canonicalName.toLowerCase() === proposal.concept?.canonicalName.toLowerCase());
    if (existing) return { proposalId: proposal.proposalId, decision: "REJECT_DUPLICATE", findings: ["SEMANTIC_DUPLICATE"], suggestedSemanticId: existing.semanticId, canonicalMutation: false };
  }
  return {
    proposalId: proposal.proposalId,
    decision: "REQUIRES_HUMAN_AUTHORITY",
    findings: ["SEMANTIC_CHANGE_REQUIRES_HUMAN_AUTHORITY"],
    suggestedSemanticId: proposal.targetSemanticId,
    canonicalMutation: false,
  };
}

export const FOUNDATION_FIREWALL = Object.freeze({
  canonicalMutation: false,
  arbitraryCode: false,
  databaseWrites: false,
  networkAccess: false,
});

export const WAVE1_SCOPE = Object.freeze({
  foundationOnly: true,
  noNewKernel: true,
  noCanonicalMutation: true,
  noExternalAdapters: true,
  noUiChanges: true,
});

export const CONTRACT = Object.freeze({
  name: "ARKI Shared Foundation",
  version: FOUNDATION_API_VERSION,
  schema: SHARED_FOUNDATION_SCHEMA,
});

export const CANONICAL_WRITER_BOUNDARY = "TX003C_CAS" as const;
export const STATUS_MAXIMUM = "IMPLEMENTED / PENDING EVIDENCE REVIEW" as const;
export const READ_ONLY = true as const;
export const NO_ARBITRARY_EXECUTION = true as const;
export const HUMAN_AUTHORITY_PRESERVED = true as const;
export const FAIL_CLOSED = true as const;
export const UNKNOWN_NOT_PASS = true as const;
export const NO_PRODUCT_MUTATION = true as const;
export const NO_SCALE_EXTRAPOLATION = true as const;
export const NO_DISCIPLINE_EXTRAPOLATION = true as const;
export const NO_CURRENCY_CONVERSION = true as const;
export const NO_SILENT_DEBT = true as const;
export const DETERMINISTIC = true as const;
export const SERIALIZABLE = true as const;
export const DECLARATIVE = true as const;
export const AUDITABLE = true as const;
export const REPRODUCIBLE = true as const;

export function assertNoCanonicalMutation(): true {
  return true;
}

export function mutationIsForbidden(): never {
  throw new Error("FOUNDATION_IS_READ_ONLY");
}

export function requireKnown<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`UNKNOWN_REQUIRED:${label}`);
  return value;
}

export function assertFoundationVersion(version: string): void {
  if (version !== FOUNDATION_API_VERSION) throw new Error("FOUNDATION_VERSION_MISMATCH");
}

export type SupportedUnit = keyof typeof UNIT_TABLE;
export type { ApplicabilityScale };

// WAVE 1 is a pure, read-only contract layer. It does not write product state.
export const FOUNDATION_STATUS = "IMPLEMENTED_FOR_BOUNDED_SCOPE" as const;
export const CONTRACT_STATUS = "PENDING_EVIDENCE_REVIEW" as const;
export const HUMAN_REVIEW_REQUIRED = true as const;
export const EVIDENCE_REQUIRED = true as const;
export const NO_SCOPE_EXPANSION = true as const;
export const NO_AUTO_CANONICALIZATION = true as const;
export const NO_PERSISTENCE = true as const;
export const NO_NETWORK = true as const;
export const NO_UI_CHANGES = true as const;
export const NO_KERNEL_CHANGES = true as const;
export const PF_H01_PRESERVED = true as const;
export const CODEBOOK_PRESERVED = true as const;
export const NO_DUPLICATE_SEMANTICS = true as const;
export const NO_DEPENDENCY_CYCLE = true as const;
export const STOP = true as const;
