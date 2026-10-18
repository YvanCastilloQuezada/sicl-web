export const BKH4_TRANSACTION_SCHEMA_VERSION = "1.0" as const;
export const BKH4_MUTATION_SCHEMA_VERSION = "1.0" as const;

export type TransactionStatus =
  | "DRAFT" | "PROPOSED" | "SIMULATING" | "SIMULATED" | "VALIDATING"
  | "VALID" | "INVALID" | "UNKNOWN" | "AWAITING_HUMAN_DECISION"
  | "AUTHORIZED" | "REJECTED" | "COMMITTING" | "COMMITTED" | "ABORTED"
  | "FAILED" | "STALE" | "RECOVERY_REQUIRED";

export type TransactionIntent =
  | "CREATE" | "UPDATE" | "DELETE" | "MOVE" | "RELATE" | "PARAMETER_CHANGE" | "OTHER";

export type TransactionProvenance = {
  source: string;
  actorId: string;
  commandId?: string;
  parentTransactionId?: string;
  evidenceRefs: string[];
  transformations: string[];
};

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { readonly [key: string]: JsonValue };

export type MutationOperation =
  | "CREATE_ENTITY" | "UPDATE_PROPERTY" | "MOVE_ENTITY" | "DELETE_ENTITY"
  | "ADD_RELATIONSHIP" | "REMOVE_RELATIONSHIP" | "UPDATE_PARAMETER";

export type MutationTarget = {
  entityId: string;
  entityKind?: string;
  relationshipId?: string;
  propertyPath?: string;
  parameterId?: string;
};

export type MutationRecord = {
  mutationId: string;
  schemaVersion: typeof BKH4_MUTATION_SCHEMA_VERSION;
  target: MutationTarget;
  operation: MutationOperation;
  before: JsonValue | undefined;
  proposedAfter: JsonValue | undefined;
  expectedRevision: string;
  provenance: TransactionProvenance;
  reason: string;
  intent: TransactionIntent;
};

export type TransactionRevision = {
  transactionRevisionId: string;
  transactionId: string;
  revisionNumber: number;
  baseProjectVersion: string;
  mutationSet: readonly MutationRecord[];
  status: TransactionStatus;
  intent: TransactionIntent;
  provenance: TransactionProvenance;
  createdAt: string;
};

export type Transaction = {
  schemaVersion: typeof BKH4_TRANSACTION_SCHEMA_VERSION;
  transactionId: string;
  projectId: string;
  baseProjectVersion?: string;
  proposedBy: string;
  intent: TransactionIntent;
  status: TransactionStatus;
  currentRevisionId?: string;
  provenance: TransactionProvenance;
  createdAt: string;
};

export type TransactionAudit = {
  transactionId: string;
  from: TransactionStatus;
  to: TransactionStatus;
  at: string;
  actorId: string;
  reason: string;
  provenance: TransactionProvenance;
};

const transitions: Readonly<Record<TransactionStatus, readonly TransactionStatus[]>> = {
  DRAFT: ["PROPOSED", "ABORTED"],
  PROPOSED: ["SIMULATING", "INVALID", "UNKNOWN", "ABORTED", "STALE"],
  SIMULATING: ["SIMULATED", "FAILED", "UNKNOWN", "ABORTED"],
  SIMULATED: ["VALIDATING", "ABORTED", "STALE"],
  VALIDATING: ["VALID", "INVALID", "UNKNOWN", "AWAITING_HUMAN_DECISION", "FAILED", "STALE", "ABORTED"],
  VALID: ["AUTHORIZED", "INVALID", "UNKNOWN", "STALE", "ABORTED"],
  INVALID: ["DRAFT", "ABORTED"],
  UNKNOWN: ["VALIDATING", "ABORTED", "STALE"],
  AWAITING_HUMAN_DECISION: ["AUTHORIZED", "REJECTED", "ABORTED", "STALE"],
  AUTHORIZED: ["COMMITTING", "REJECTED", "STALE", "ABORTED"],
  REJECTED: ["DRAFT", "ABORTED"],
  COMMITTING: ["COMMITTED", "FAILED", "RECOVERY_REQUIRED"],
  COMMITTED: [],
  ABORTED: [],
  FAILED: ["RECOVERY_REQUIRED", "ABORTED"],
  STALE: ["DRAFT", "ABORTED"],
  RECOVERY_REQUIRED: ["COMMITTED", "ABORTED", "FAILED"],
};

const executablePattern = /(?:\beval\s*\(|\bFunction\s*\(|=>|javascript\s*:)/;

const isJsonValue = (value: unknown): value is JsonValue => {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).every(isJsonValue);
  return false;
};

const containsExecutableText = (value: unknown): boolean => {
  if (typeof value === "string") return executablePattern.test(value);
  if (Array.isArray(value)) return value.some(containsExecutableText);
  if (value && typeof value === "object") return Object.values(value as Record<string, unknown>).some(containsExecutableText);
  return false;
};

const requireText = (value: string, field: string): void => {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} is required`);
};

export const isLegalTransactionTransition = (from: TransactionStatus, to: TransactionStatus): boolean => transitions[from].includes(to);
export const legalTransactionTransitions = (from: TransactionStatus): readonly TransactionStatus[] => transitions[from];

export const validateMutationRecord = (mutation: MutationRecord): true => {
  if (mutation.schemaVersion !== BKH4_MUTATION_SCHEMA_VERSION) throw new Error("Unsupported mutation schema version");
  requireText(mutation.mutationId, "mutationId");
  requireText(mutation.target.entityId, "target.entityId");
  requireText(mutation.expectedRevision, "expectedRevision");
  requireText(mutation.reason, "reason");
  requireText(mutation.provenance.source, "provenance.source");
  requireText(mutation.provenance.actorId, "provenance.actorId");
  if (!Array.isArray(mutation.provenance.evidenceRefs) || !Array.isArray(mutation.provenance.transformations)) throw new Error("provenance arrays are required");
  if (mutation.operation === "CREATE_ENTITY" && mutation.proposedAfter === undefined) throw new Error("CREATE_ENTITY requires proposedAfter");
  if (mutation.operation === "DELETE_ENTITY" && mutation.before === undefined) throw new Error("DELETE_ENTITY requires before");
  if (!isJsonValue(mutation.before) || !isJsonValue(mutation.proposedAfter)) throw new Error("Mutation values must be JSON serializable");
  if (containsExecutableText(mutation.before) || containsExecutableText(mutation.proposedAfter) || containsExecutableText(mutation.provenance) || containsExecutableText(mutation.reason)) throw new Error("Executable mutation content is prohibited");
  return true;
};

export const createTransaction = (input: Omit<Transaction, "schemaVersion" | "status" | "currentRevisionId"> & { status?: TransactionStatus }): Transaction => {
  requireText(input.transactionId, "transactionId");
  requireText(input.projectId, "projectId");
  requireText(input.proposedBy, "proposedBy");
  if (input.status && input.status !== "DRAFT") throw new Error("New transactions must start in DRAFT");
  return { schemaVersion: BKH4_TRANSACTION_SCHEMA_VERSION, ...input, status: "DRAFT" };
};

export const createTransactionRevision = (input: TransactionRevision): TransactionRevision => {
  requireText(input.transactionRevisionId, "transactionRevisionId");
  requireText(input.transactionId, "transactionId");
  requireText(input.baseProjectVersion, "baseProjectVersion");
  if (!Number.isInteger(input.revisionNumber) || input.revisionNumber < 1) throw new Error("revisionNumber must be a positive integer");
  if (input.mutationSet.length === 0) throw new Error("mutationSet cannot be empty");
  input.mutationSet.forEach(validateMutationRecord);
  return { ...input, mutationSet: input.mutationSet.map((mutation) => ({ ...mutation, provenance: { ...mutation.provenance, evidenceRefs: [...mutation.provenance.evidenceRefs], transformations: [...mutation.provenance.transformations] } })) };
};

export const validateTransactionRevisionHistory = (transactionId: string, revisions: readonly TransactionRevision[]): true => {
  requireText(transactionId, "transactionId");
  const revisionIds = new Set<string>();
  const revisionNumbers = new Set<number>();
  revisions.forEach((revision) => {
    if (revision.transactionId !== transactionId) throw new Error("Revision belongs to another transaction");
    if (revisionIds.has(revision.transactionRevisionId)) throw new Error("Duplicate transactionRevisionId");
    if (revisionNumbers.has(revision.revisionNumber)) throw new Error("Duplicate revisionNumber");
    revisionIds.add(revision.transactionRevisionId);
    revisionNumbers.add(revision.revisionNumber);
    createTransactionRevision(revision);
  });
  return true;
};

export const proposeTransaction = (transaction: Transaction, revision: TransactionRevision): Transaction => {
  if (revision.transactionId !== transaction.transactionId) throw new Error("Revision belongs to another transaction");
  if (transaction.status !== "DRAFT") throw new Error(`Cannot propose from ${transaction.status}`);
  if (!revision.baseProjectVersion) throw new Error("baseProjectVersion is required from PROPOSED");
  return { ...transaction, baseProjectVersion: revision.baseProjectVersion, currentRevisionId: revision.transactionRevisionId, intent: revision.intent, status: "PROPOSED" };
};

export const transitionTransaction = (input: { transaction: Transaction; to: TransactionStatus; at: string; actorId: string; reason: string; provenance: TransactionProvenance }): { transaction: Transaction; audit: TransactionAudit } => {
  const { transaction, to, at, actorId, reason, provenance } = input;
  if (!isLegalTransactionTransition(transaction.status, to)) throw new Error(`Illegal transaction transition ${transaction.status} -> ${to}`);
  if (to !== "DRAFT" && to !== "ABORTED" && !transaction.baseProjectVersion) throw new Error("baseProjectVersion is required before operational transition");
  const next = { ...transaction, status: to };
  return { transaction: next, audit: { transactionId: transaction.transactionId, from: transaction.status, to, at, actorId, reason, provenance } };
};

const stableValue = (value: JsonValue | undefined): string => {
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableValue((value as Record<string, JsonValue>)[key])}`).join(",")}}`;
  return JSON.stringify(value);
};

export const serializeTransaction = (transaction: Transaction): string => stableValue(transaction as unknown as JsonValue);
export const serializeTransactionRevision = (revision: TransactionRevision): string => stableValue(revision as unknown as JsonValue);
export const serializeMutationSet = (mutations: readonly MutationRecord[]): string => stableValue(mutations as unknown as JsonValue);
export const assertTransactionSerializable = (transaction: Transaction): true => { JSON.parse(JSON.stringify(transaction)); return true; };
export const assertMutationSetSerializable = (mutations: readonly MutationRecord[]): true => { mutations.forEach(validateMutationRecord); JSON.parse(JSON.stringify(mutations)); return true; };
