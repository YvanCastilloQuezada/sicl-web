import type { JsonValue, TransactionProvenance } from "./arkiTransactionEngine";

export const BKH4_CANONICAL_REPOSITORY_SCHEMA_VERSION = "1.0" as const;

export type CanonicalRevisionStatus = "GENESIS" | "CURRENT" | "HISTORICAL";
export type CanonicalAuthority = "SYSTEM_PROPOSED" | "HUMAN_AUTHORIZED" | "SYSTEM_EXECUTED";
export type CanonicalProjectState = JsonValue;

export type CanonicalProjectRevision = Readonly<{
  schemaVersion: typeof BKH4_CANONICAL_REPOSITORY_SCHEMA_VERSION;
  projectId: string;
  revisionId: string;
  parentRevisionId: string | null;
  transactionId: string;
  timestamp: string;
  statePayload: CanonicalProjectState;
  stateFingerprint: string;
  provenance: TransactionProvenance;
  actor: string;
  authority: CanonicalAuthority;
  status: CanonicalRevisionStatus;
}>;

export type CanonicalRepositoryErrorCode =
  | "INVALID"
  | "CONFLICT"
  | "CORRUPTED"
  | "NOT_FOUND"
  | "UNKNOWN";

export class CanonicalRepositoryError extends Error {
  readonly code: CanonicalRepositoryErrorCode;

  constructor(code: CanonicalRepositoryErrorCode, message: string) {
    super(`${code}: ${message}`);
    this.name = "CanonicalRepositoryError";
    this.code = code;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;

const isJsonValue = (value: unknown): value is JsonValue => {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isRecord(value) && Object.values(value).every(isJsonValue);
};

const stableSerialize = (value: JsonValue): string => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(",")}}`;
};

const hash = (value: string): string => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return `ARKI-CR-${(result >>> 0).toString(16).padStart(8, "0")}`;
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
};

function text(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) throw new CanonicalRepositoryError("INVALID", `${field} is required`);
}

const sameJson = (left: unknown, right: unknown): boolean => JSON.stringify(left) === JSON.stringify(right);
const revisionKeys = ["schemaVersion", "projectId", "revisionId", "parentRevisionId", "transactionId", "timestamp", "statePayload", "stateFingerprint", "provenance", "actor", "authority", "status"] as const;

export const canonicalStateFingerprint = (state: CanonicalProjectState): string => {
  if (!isJsonValue(state)) throw new CanonicalRepositoryError("INVALID", "statePayload must be JSON-only");
  return hash(stableSerialize(state));
};

export const serializeCanonicalRevision = (revision: CanonicalProjectRevision): string => stableSerialize(revision as unknown as JsonValue);

const validateProvenance = (provenance: TransactionProvenance): void => {
  if (!isRecord(provenance)) throw new CanonicalRepositoryError("INVALID", "provenance is required");
  text(provenance.source, "provenance.source");
  text(provenance.actorId, "provenance.actorId");
  if (!Array.isArray(provenance.evidenceRefs) || !provenance.evidenceRefs.every((item) => typeof item === "string")) throw new CanonicalRepositoryError("INVALID", "provenance.evidenceRefs is invalid");
  if (!Array.isArray(provenance.transformations) || !provenance.transformations.every((item) => typeof item === "string")) throw new CanonicalRepositoryError("INVALID", "provenance.transformations is invalid");
};

const validateRevisionShape = (revision: CanonicalProjectRevision): void => {
  if (!isRecord(revision)) throw new CanonicalRepositoryError("INVALID", "revision must be an object");
  if (Object.keys(revision).some((key) => !revisionKeys.includes(key as typeof revisionKeys[number]))) throw new CanonicalRepositoryError("INVALID", "revision contains unsupported fields");
  if (revision.schemaVersion !== BKH4_CANONICAL_REPOSITORY_SCHEMA_VERSION) throw new CanonicalRepositoryError("INVALID", "unsupported revision schema");
  text(revision.projectId, "projectId");
  text(revision.revisionId, "revisionId");
  text(revision.transactionId, "transactionId");
  text(revision.timestamp, "timestamp");
  text(revision.actor, "actor");
  if (revision.parentRevisionId !== null) text(revision.parentRevisionId, "parentRevisionId");
  if (!["SYSTEM_PROPOSED", "HUMAN_AUTHORIZED", "SYSTEM_EXECUTED"].includes(revision.authority)) throw new CanonicalRepositoryError("INVALID", "authority is invalid");
  if (!["GENESIS", "CURRENT", "HISTORICAL"].includes(revision.status)) throw new CanonicalRepositoryError("UNKNOWN", "unsupported or unproven revision status");
  validateProvenance(revision.provenance);
  if (!isJsonValue(revision.statePayload)) throw new CanonicalRepositoryError("INVALID", "statePayload must be JSON-only");
  text(revision.stateFingerprint, "stateFingerprint");
};

export const validateCanonicalRevisionChain = (projectId: string, revisions: readonly CanonicalProjectRevision[]): true => {
  text(projectId, "projectId");
  const byId = new Map<string, CanonicalProjectRevision>();
  const byTransaction = new Map<string, string>();
  const childrenByParent = new Map<string, number>();
  let currentCount = 0;
  for (const revision of revisions) {
    validateRevisionShape(revision);
    if (revision.projectId !== projectId) throw new CanonicalRepositoryError("CONFLICT", "revision belongs to another project");
    if (revision.projectId === revision.revisionId || revision.projectId === revision.transactionId || revision.revisionId === revision.transactionId) throw new CanonicalRepositoryError("INVALID", "project, revision, and transaction identities must be distinct");
    if (byId.has(revision.revisionId)) throw new CanonicalRepositoryError("CONFLICT", "duplicate revisionId");
    if (byTransaction.has(revision.transactionId)) throw new CanonicalRepositoryError("CONFLICT", "duplicate transactionId");
    if (revision.status === "CURRENT") currentCount += 1;
    byId.set(revision.revisionId, revision);
    byTransaction.set(revision.transactionId, revision.revisionId);
    if (revision.parentRevisionId !== null) childrenByParent.set(revision.parentRevisionId, (childrenByParent.get(revision.parentRevisionId) ?? 0) + 1);
  }
  if (revisions.length > 0 && currentCount !== 1) throw new CanonicalRepositoryError("CONFLICT", "current revision is ambiguous");
  if (Array.from(childrenByParent.values()).some((count) => count > 1)) throw new CanonicalRepositoryError("CONFLICT", "silent revision fork detected");
  for (const revision of revisions) {
    if (revision.parentRevisionId === revision.revisionId) throw new CanonicalRepositoryError("CONFLICT", "self-parent revision");
    if (revision.parentRevisionId !== null && !byId.has(revision.parentRevisionId)) throw new CanonicalRepositoryError("NOT_FOUND", "parent revision not found");
    const seen = new Set<string>();
    let cursor: string | null = revision.revisionId;
    while (cursor !== null) {
      if (seen.has(cursor)) throw new CanonicalRepositoryError("CORRUPTED", "revision cycle detected");
      seen.add(cursor);
      cursor = byId.get(cursor)?.parentRevisionId ?? null;
    }
  }
  return true;
};

export class CanonicalProjectRepository {
  readonly projectId: string;
  private readonly revisions = new Map<string, CanonicalProjectRevision>();
  private readonly transactionToRevision = new Map<string, string>();
  private currentRevisionId: string | null = null;

  constructor(projectId: string) {
    text(projectId, "projectId");
    this.projectId = projectId;
  }

  getCurrentRevision(projectId = this.projectId): CanonicalProjectRevision | null {
    if (projectId !== this.projectId) throw new CanonicalRepositoryError("CONFLICT", "project isolation violation");
    return this.currentRevisionId ? clone(this.revisions.get(this.currentRevisionId)!) : null;
  }

  getRevision(revisionId: string): CanonicalProjectRevision | null {
    text(revisionId, "revisionId");
    return this.revisions.has(revisionId) ? clone(this.revisions.get(revisionId)!) : null;
  }

  listRevisions(): CanonicalProjectRevision[] {
    return Array.from(this.revisions.values()).map((revision) => clone(revision));
  }

  createGenesis(input: {
    revisionId: string;
    transactionId: string;
    timestamp: string;
    statePayload: CanonicalProjectState;
    provenance: TransactionProvenance;
    actor: string;
    authority: CanonicalAuthority;
  }): CanonicalProjectRevision {
    if (this.revisions.size > 0) throw new CanonicalRepositoryError("CONFLICT", "genesis already exists");
    return this.appendRevision({ ...input, parentRevisionId: null, status: "GENESIS" });
  }

  appendRevision(input: {
    revisionId: string;
    parentRevisionId: string | null;
    transactionId: string;
    timestamp: string;
    statePayload: CanonicalProjectState;
    provenance: TransactionProvenance;
    actor: string;
    authority: CanonicalAuthority;
    status?: CanonicalRevisionStatus;
  }): CanonicalProjectRevision {
    const revisionId = input.revisionId;
    text(revisionId, "revisionId");
    text(input.transactionId, "transactionId");
    if (this.revisions.has(revisionId)) throw new CanonicalRepositoryError("CONFLICT", `duplicate revisionId ${revisionId}`);
    if (this.transactionToRevision.has(input.transactionId)) throw new CanonicalRepositoryError("CONFLICT", `transaction already associated with revision ${this.transactionToRevision.get(input.transactionId)}`);
    if (input.parentRevisionId === input.revisionId) throw new CanonicalRepositoryError("CONFLICT", "self-parent revision");
    if (this.currentRevisionId === null) {
      if (input.parentRevisionId !== null) throw new CanonicalRepositoryError("CONFLICT", "genesis parent must be null");
    } else {
      if (input.parentRevisionId === null) throw new CanonicalRepositoryError("CONFLICT", "non-genesis revision requires parent");
      if (!this.revisions.has(input.parentRevisionId)) throw new CanonicalRepositoryError("NOT_FOUND", `parent revision ${input.parentRevisionId} not found`);
      if (input.parentRevisionId !== this.currentRevisionId) throw new CanonicalRepositoryError("CONFLICT", "candidate does not extend current revision; silent fork rejected");
    }
    if (input.revisionId === input.transactionId || input.revisionId === this.projectId || input.transactionId === this.projectId) throw new CanonicalRepositoryError("INVALID", "project, revision, and transaction identities must be distinct");
    const fingerprint = canonicalStateFingerprint(input.statePayload);
    const revision: CanonicalProjectRevision = deepFreeze({
      schemaVersion: BKH4_CANONICAL_REPOSITORY_SCHEMA_VERSION,
      projectId: this.projectId,
      revisionId,
      parentRevisionId: input.parentRevisionId,
      transactionId: input.transactionId,
      timestamp: input.timestamp,
      statePayload: deepFreeze(clone(input.statePayload)),
      stateFingerprint: fingerprint,
      provenance: deepFreeze(clone(input.provenance)),
      actor: input.actor,
      authority: input.authority,
      status: input.parentRevisionId === null ? "GENESIS" : "CURRENT",
    });
    validateRevisionShape(revision);
    this.revisions.forEach((existing, id) => {
      if (id === this.currentRevisionId) this.revisions.set(id, deepFreeze({ ...existing, status: "HISTORICAL" }));
    });
    this.revisions.set(revision.revisionId, revision);
    this.transactionToRevision.set(revision.transactionId, revision.revisionId);
    this.currentRevisionId = revision.revisionId;
    return clone(revision);
  }

  verifyRevision(revision: CanonicalProjectRevision): true {
    validateRevisionShape(revision);
    if (revision.projectId !== this.projectId) throw new CanonicalRepositoryError("CONFLICT", "revision belongs to another project");
    if (revision.revisionId === revision.transactionId || revision.revisionId === revision.projectId || revision.transactionId === revision.projectId) throw new CanonicalRepositoryError("INVALID", "identity collision");
    if (canonicalStateFingerprint(revision.statePayload) !== revision.stateFingerprint) throw new CanonicalRepositoryError("CORRUPTED", "state fingerprint mismatch");
    const stored = this.revisions.get(revision.revisionId);
    if (stored && !sameJson(stored, revision)) throw new CanonicalRepositoryError("CORRUPTED", "stored revision differs from supplied revision");
    if (revision.parentRevisionId !== null && !this.revisions.has(revision.parentRevisionId)) throw new CanonicalRepositoryError("NOT_FOUND", "parent revision not found");
    return true;
  }

  verifyChain(): true {
    const revisions = Array.from(this.revisions.values());
    revisions.forEach((revision) => this.verifyRevision(revision));
    validateCanonicalRevisionChain(this.projectId, revisions);
    return true;
  }
}
