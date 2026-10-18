export const BKH4_TRANSACTION_SCHEMA_VERSION = "1.0" as const;
export const BKH4_MUTATION_SCHEMA_VERSION = "1.1" as const;

export type TransactionStatus =
  | "DRAFT" | "PROPOSED" | "SIMULATING" | "SIMULATED" | "VALIDATING"
  | "VALID" | "INVALID" | "UNKNOWN" | "AWAITING_HUMAN_DECISION"
  | "AUTHORIZED" | "REJECTED" | "COMMITTING" | "COMMITTED" | "ABORTED"
  | "FAILED" | "STALE" | "RECOVERY_REQUIRED";

export type TransactionRevisionStatus = "DRAFT" | "PROPOSED" | "INVALID" | "UNKNOWN";
export type TransactionIntent = "CREATE" | "UPDATE" | "DELETE" | "MOVE" | "RELATE" | "PARAMETER_CHANGE" | "OTHER";
export type TransactionProvenance = { source: string; actorId: string; commandId?: string; parentTransactionId?: string; evidenceRefs: string[]; transformations: string[] };
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { readonly [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
export type MutationOperation = "CREATE_ENTITY" | "UPDATE_PROPERTY" | "MOVE_ENTITY" | "DELETE_ENTITY" | "ADD_RELATIONSHIP" | "REMOVE_RELATIONSHIP" | "UPDATE_PARAMETER";
export type MutationTarget = { entityId: string; entityKind?: string; relationshipId?: string; propertyPath?: string; parameterId?: string };
export type MutationRecord = { mutationId: string; schemaVersion: typeof BKH4_MUTATION_SCHEMA_VERSION; target: MutationTarget; operation: MutationOperation; before?: JsonValue; proposedAfter?: JsonValue; expectedRevision: string; provenance: TransactionProvenance; reason: string; intent: TransactionIntent };
export type TransactionRevision = { transactionRevisionId: string; transactionId: string; revisionNumber: number; baseProjectVersion: string; mutationSet: readonly MutationRecord[]; status: TransactionRevisionStatus; intent: TransactionIntent; provenance: TransactionProvenance; createdAt: string };
export type Transaction = { schemaVersion: typeof BKH4_TRANSACTION_SCHEMA_VERSION; transactionId: string; projectId: string; baseProjectVersion?: string; proposedBy: string; intent: TransactionIntent; status: TransactionStatus; currentRevisionId?: string; provenance: TransactionProvenance; createdAt: string };
export type TransactionAudit = { transactionId: string; from: TransactionStatus; to: TransactionStatus; at: string; actorId: string; reason: string; provenance: TransactionProvenance };

const transitions: Readonly<Record<TransactionStatus, readonly TransactionStatus[]>> = {
  DRAFT: ["PROPOSED", "ABORTED"], PROPOSED: ["SIMULATING", "INVALID", "UNKNOWN", "ABORTED", "STALE"],
  SIMULATING: ["SIMULATED", "FAILED", "UNKNOWN", "ABORTED"], SIMULATED: ["VALIDATING", "ABORTED", "STALE"],
  VALIDATING: ["VALID", "INVALID", "UNKNOWN", "AWAITING_HUMAN_DECISION", "FAILED", "STALE", "ABORTED"],
  VALID: ["AUTHORIZED", "INVALID", "UNKNOWN", "STALE", "ABORTED"], INVALID: ["DRAFT", "ABORTED"],
  UNKNOWN: ["VALIDATING", "ABORTED", "STALE"], AWAITING_HUMAN_DECISION: ["AUTHORIZED", "REJECTED", "ABORTED", "STALE"],
  AUTHORIZED: ["COMMITTING", "REJECTED", "STALE", "ABORTED"], REJECTED: ["DRAFT", "ABORTED"],
  COMMITTING: ["COMMITTED", "FAILED", "RECOVERY_REQUIRED"], COMMITTED: [], ABORTED: [],
  FAILED: ["RECOVERY_REQUIRED", "ABORTED"], STALE: ["DRAFT", "ABORTED"], RECOVERY_REQUIRED: ["COMMITTED", "ABORTED", "FAILED"],
};
const mutationOperations: readonly MutationOperation[] = ["CREATE_ENTITY", "UPDATE_PROPERTY", "MOVE_ENTITY", "DELETE_ENTITY", "ADD_RELATIONSHIP", "REMOVE_RELATIONSHIP", "UPDATE_PARAMETER"];
const intents: readonly TransactionIntent[] = ["CREATE", "UPDATE", "DELETE", "MOVE", "RELATE", "PARAMETER_CHANGE", "OTHER"];
const executablePattern = /(?:\beval\s*\(|\bFunction\s*\(|=>|javascript\s*:)/;
const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
const hasOnlyKeys = (value: Record<string, unknown>, keys: readonly string[]): boolean => Object.keys(value).every((key) => keys.includes(key));
const isJsonValue = (value: unknown): value is JsonValue => {
  if (value === null || typeof value === "string" || (typeof value === "number" && Number.isFinite(value)) || typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isRecord(value) && Object.values(value).every(isJsonValue);
};
const containsExecutableText = (value: unknown): boolean => {
  if (typeof value === "string") return executablePattern.test(value);
  if (Array.isArray(value)) return value.some(containsExecutableText);
  return isRecord(value) && Object.values(value).some(containsExecutableText);
};
const requireText = (value: unknown, field: string): void => { if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} is required`); };
const requireObject = (value: unknown, field: string): void => { if (!isRecord(value)) throw new Error(`${field} must be a JSON object`); };
const requireJson = (value: unknown, field: string): void => { if (!isJsonValue(value)) throw new Error(`${field} must be JSON serializable`); };
const hasOwn = (value: object, key: string): boolean => Object.prototype.hasOwnProperty.call(value, key);
const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const assertTargetKeys = (target: Record<string, unknown>, allowed: readonly string[]): void => { if (!hasOnlyKeys(target, allowed)) throw new Error("target contains unsupported fields"); };

export const isLegalTransactionTransition = (from: TransactionStatus, to: TransactionStatus): boolean => transitions[from].includes(to);
export const legalTransactionTransitions = (from: TransactionStatus): readonly TransactionStatus[] => transitions[from];

export const validateMutationRecord = (raw: MutationRecord): true => {
  requireObject(raw, "mutation");
  if (!hasOnlyKeys(raw, ["mutationId", "schemaVersion", "target", "operation", "before", "proposedAfter", "expectedRevision", "provenance", "reason", "intent"])) throw new Error("mutation contains unsupported fields");
  if (raw.schemaVersion !== BKH4_MUTATION_SCHEMA_VERSION) throw new Error("Unsupported mutation schema version");
  if (!mutationOperations.includes(raw.operation)) throw new Error("Unsupported mutation operation");
  if (!intents.includes(raw.intent)) throw new Error("Unsupported mutation intent");
  requireText(raw.mutationId, "mutationId"); requireText(raw.expectedRevision, "expectedRevision"); requireText(raw.reason, "reason");
  requireObject(raw.target, "target"); requireText(raw.target.entityId, "target.entityId");
  requireObject(raw.provenance, "provenance"); requireText(raw.provenance.source, "provenance.source"); requireText(raw.provenance.actorId, "provenance.actorId");
  if (!Array.isArray(raw.provenance.evidenceRefs) || !raw.provenance.evidenceRefs.every((item) => typeof item === "string")) throw new Error("provenance.evidenceRefs must be string[]");
  if (!Array.isArray(raw.provenance.transformations) || !raw.provenance.transformations.every((item) => typeof item === "string")) throw new Error("provenance.transformations must be string[]");
  if (!hasOnlyKeys(raw.provenance, ["source", "actorId", "commandId", "parentTransactionId", "evidenceRefs", "transformations"])) throw new Error("provenance contains unsupported fields");
  if (raw.before !== undefined) requireJson(raw.before, "before");
  if (raw.proposedAfter !== undefined) requireJson(raw.proposedAfter, "proposedAfter");
  if (containsExecutableText(raw)) throw new Error("Executable mutation content is prohibited");
  const target = raw.target;
  switch (raw.operation) {
    case "CREATE_ENTITY":
      assertTargetKeys(target, ["entityId", "entityKind"]); requireText(target.entityKind, "target.entityKind");
      if (hasOwn(raw, "before") || raw.before !== undefined || raw.proposedAfter === undefined || !isRecord(raw.proposedAfter)) throw new Error("CREATE_ENTITY requires entityKind, object proposedAfter and no before");
      break;
    case "UPDATE_PROPERTY":
      assertTargetKeys(target, ["entityId", "entityKind", "propertyPath"]); requireText(target.propertyPath, "target.propertyPath");
      if (raw.before === undefined || raw.proposedAfter === undefined || JSON.stringify(raw.before) === JSON.stringify(raw.proposedAfter)) throw new Error("UPDATE_PROPERTY requires distinct before/proposedAfter");
      break;
    case "MOVE_ENTITY":
      assertTargetKeys(target, ["entityId", "entityKind"]);
      if (!isRecord(raw.before) || !isRecord(raw.proposedAfter)) throw new Error("MOVE_ENTITY requires before/proposedAfter coordinate objects");
      for (const coordinate of ["x", "y", "z"]) if (!isNumber(raw.before[coordinate]) || !isNumber(raw.proposedAfter[coordinate])) throw new Error(`MOVE_ENTITY requires numeric ${coordinate}`);
      break;
    case "DELETE_ENTITY":
      assertTargetKeys(target, ["entityId", "entityKind"]); requireText(target.entityKind, "target.entityKind");
      if (raw.before === undefined || raw.proposedAfter !== undefined) throw new Error("DELETE_ENTITY requires before and no proposedAfter");
      break;
    case "ADD_RELATIONSHIP":
      assertTargetKeys(target, ["entityId", "relationshipId"]); requireText(target.relationshipId, "target.relationshipId");
      if (raw.before !== undefined || !isRecord(raw.proposedAfter) || typeof raw.proposedAfter.sourceEntityId !== "string" || typeof raw.proposedAfter.targetEntityId !== "string") throw new Error("ADD_RELATIONSHIP requires relationshipId and relationship proposedAfter");
      break;
    case "REMOVE_RELATIONSHIP":
      assertTargetKeys(target, ["entityId", "relationshipId"]); requireText(target.relationshipId, "target.relationshipId");
      if (!isRecord(raw.before) || raw.proposedAfter !== undefined) throw new Error("REMOVE_RELATIONSHIP requires relationship before and no proposedAfter");
      break;
    case "UPDATE_PARAMETER":
      assertTargetKeys(target, ["entityId", "entityKind", "parameterId"]); requireText(target.parameterId, "target.parameterId");
      if (raw.before === undefined || raw.proposedAfter === undefined || JSON.stringify(raw.before) === JSON.stringify(raw.proposedAfter)) throw new Error("UPDATE_PARAMETER requires distinct before/proposedAfter");
      break;
  }
  return true;
};

export const createTransaction = (input: Omit<Transaction, "schemaVersion" | "status" | "currentRevisionId"> & { status?: TransactionStatus }): Transaction => {
  requireText(input.transactionId, "transactionId"); requireText(input.projectId, "projectId"); requireText(input.proposedBy, "proposedBy");
  if (input.status && input.status !== "DRAFT") throw new Error("New transactions must start in DRAFT");
  return { schemaVersion: BKH4_TRANSACTION_SCHEMA_VERSION, ...input, status: "DRAFT" };
};

export const createTransactionRevision = (input: TransactionRevision): TransactionRevision => {
  requireText(input.transactionRevisionId, "transactionRevisionId"); requireText(input.transactionId, "transactionId"); requireText(input.baseProjectVersion, "baseProjectVersion");
  if (!Number.isInteger(input.revisionNumber) || input.revisionNumber < 1) throw new Error("revisionNumber must be a positive integer");
  if (!["DRAFT", "PROPOSED", "INVALID", "UNKNOWN"].includes(input.status)) throw new Error("TransactionRevision status is not allowed");
  if (input.mutationSet.length === 0) throw new Error("mutationSet cannot be empty"); input.mutationSet.forEach(validateMutationRecord);
  return { ...input, mutationSet: input.mutationSet.map((mutation) => ({ ...mutation, provenance: { ...mutation.provenance, evidenceRefs: [...mutation.provenance.evidenceRefs], transformations: [...mutation.provenance.transformations] } })) };
};

export const validateTransactionRevisionHistory = (transactionId: string, revisions: readonly TransactionRevision[]): true => {
  requireText(transactionId, "transactionId"); const revisionIds = new Set<string>(); const revisionNumbers = new Set<number>();
  revisions.forEach((revision) => { if (revision.transactionId !== transactionId) throw new Error("Revision belongs to another transaction"); if (revisionIds.has(revision.transactionRevisionId)) throw new Error("Duplicate transactionRevisionId"); if (revisionNumbers.has(revision.revisionNumber)) throw new Error("Duplicate revisionNumber"); revisionIds.add(revision.transactionRevisionId); revisionNumbers.add(revision.revisionNumber); createTransactionRevision(revision); }); return true;
};

export const proposeTransaction = (transaction: Transaction, revision: TransactionRevision): Transaction => {
  if (revision.transactionId !== transaction.transactionId) throw new Error("Revision belongs to another transaction"); if (transaction.status !== "DRAFT") throw new Error(`Cannot propose from ${transaction.status}`); if (!revision.baseProjectVersion) throw new Error("baseProjectVersion is required from PROPOSED");
  return { ...transaction, baseProjectVersion: revision.baseProjectVersion, currentRevisionId: revision.transactionRevisionId, intent: revision.intent, status: "PROPOSED" };
};
export const transitionTransaction = (input: { transaction: Transaction; to: TransactionStatus; at: string; actorId: string; reason: string; provenance: TransactionProvenance }): { transaction: Transaction; audit: TransactionAudit } => {
  const { transaction, to, at, actorId, reason, provenance } = input; if (!isLegalTransactionTransition(transaction.status, to)) throw new Error(`Illegal transaction transition ${transaction.status} -> ${to}`); if (to !== "DRAFT" && to !== "ABORTED" && !transaction.baseProjectVersion) throw new Error("baseProjectVersion is required before operational transition");
  return { transaction: { ...transaction, status: to }, audit: { transactionId: transaction.transactionId, from: transaction.status, to, at, actorId, reason, provenance } };
};

const stableValue = (value: JsonValue | undefined): string => { if (value === undefined) return "undefined"; if (Array.isArray(value)) return `[${value.map(stableValue).join(",")}]`; if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableValue(value[key])}`).join(",")}}`; return JSON.stringify(value); };
export const serializeTransaction = (transaction: Transaction): string => stableValue(transaction as unknown as JsonValue);
export const serializeTransactionRevision = (revision: TransactionRevision): string => stableValue(revision as unknown as JsonValue);
export const serializeMutationSet = (mutations: readonly MutationRecord[]): string => stableValue(mutations as unknown as JsonValue);
export const assertTransactionSerializable = (transaction: Transaction): true => { JSON.parse(JSON.stringify(transaction)); return true; };
export const assertMutationSetSerializable = (mutations: readonly MutationRecord[]): true => { mutations.forEach(validateMutationRecord); JSON.parse(JSON.stringify(mutations)); return true; };
export const mutationVocabulary = (): readonly MutationOperation[] => mutationOperations;
export const revisionStatusVocabulary = (): readonly TransactionRevisionStatus[] => ["DRAFT", "PROPOSED", "INVALID", "UNKNOWN"];
