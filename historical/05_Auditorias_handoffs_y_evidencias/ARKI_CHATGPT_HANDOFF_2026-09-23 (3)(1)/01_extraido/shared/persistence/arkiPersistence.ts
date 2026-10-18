import type { SceneModel } from "../arkiSceneModel";

export const ARKI_PERSISTENCE_DB = "arki-local-first";
export const ARKI_PERSISTENCE_VERSION = 2;
export const ARKI_SNAPSHOT_STORE = "snapshots";
export const ARKI_SESSION_STORE = "sessions";
export const ARKI_PROJECT_STORE = "projects";
export const ARKI_AUDIT_STORE = "audit";

export type SnapshotGateStatus = "draft" | "approved";
export type FormalGateStatus = "pending" | "passed" | "failed";
export type VersionStatus = "draft" | "review" | "approved" | "frozen" | "archived";
export type AuditAction = "create" | "update" | "approve" | "freeze" | "archive" | "restore";

export type ArkiSnapshot = {
  id: string;
  projectId: string;
  version: string;
  scene: SceneModel;
  gateStatus: SnapshotGateStatus;
  createdAt: string;
  contentHash: string;
};

export type ArkiSession = {
  id: string;
  userId: string;
  projectId: string;
  permissions: string[];
  createdAt: string;
  lastAccessAt: string;
  schemaVersion: number;
};

export type ArkiProject = {
  id: string;
  name: string;
  ownerId: string;
  versionIds: string[];
  currentVersionId: string;
  createdAt: string;
  schemaVersion: number;
};

export type ArkiVersion = {
  id: string;
  projectId: string;
  number: number;
  parentVersionId?: string;
  modelHash: string;
  status: VersionStatus;
  createdBy: string;
  createdAt: string;
  snapshotId?: string;
  schemaVersion: number;
};

export type AuditEntry = {
  id: string;
  timestamp: string;
  actor: string;
  action: AuditAction;
  target: string;
  beforeHash?: string;
  afterHash?: string;
  chainHash: string;
};

export type FormalSnapshot = {
  id: string;
  versionId: string;
  gateStatus: FormalGateStatus;
  approvedBy?: string;
  approvedAt?: string;
  frozenAt?: string;
  signature?: string;
  auditTrail: AuditEntry[];
  schemaVersion: number;
};

export type SnapshotGateInput = {
  modelHash?: string;
  criticalElementIds: string[];
  auditTrail: AuditEntry[];
  approvedBy?: string;
  validationErrors: string[];
  parentVersionExists: boolean;
};

export function snapshotKey(projectId: string, version: string): string {
  return `${projectId}:${version}`;
}

export function snapshotRecord(input: Omit<ArkiSnapshot, "id">): ArkiSnapshot {
  return { ...input, id: snapshotKey(input.projectId, input.version) };
}

export function stableSnapshotPayload(snapshot: Omit<ArkiSnapshot, "contentHash">): string {
  return JSON.stringify({ id: snapshotKey(snapshot.projectId, snapshot.version), projectId: snapshot.projectId, version: snapshot.version, scene: snapshot.scene, gateStatus: snapshot.gateStatus });
}

export function validateSnapshotGate(input: SnapshotGateInput): string[] {
  const missing: string[] = [];
  if (!input.modelHash) missing.push("modelHash");
  if (input.criticalElementIds.some((id) => !id)) missing.push("criticalElementIds");
  if (input.auditTrail.length === 0) missing.push("auditTrail.create");
  if (!input.approvedBy) missing.push("approvedBy");
  if (input.validationErrors.length > 0) missing.push("validationErrors");
  if (!input.parentVersionExists) missing.push("parentVersion");
  return missing;
}

export function auditPayload(entry: Omit<AuditEntry, "chainHash">): string {
  return JSON.stringify(entry);
}

export function nextAuditEntry(input: Omit<AuditEntry, "chainHash">, previousChainHash = "genesis"): AuditEntry {
  return { ...input, chainHash: `${previousChainHash}:${input.afterHash ?? ""}:${input.action}:${input.target}` };
}

export function verifyAuditChain(entries: AuditEntry[]): { valid: boolean; brokenAt?: string } {
  let previous = "genesis";
  for (const entry of entries) {
    const expected = `${previous}:${entry.afterHash ?? ""}:${entry.action}:${entry.target}`;
    if (entry.chainHash !== expected) return { valid: false, brokenAt: entry.id };
    previous = entry.chainHash;
  }
  return { valid: true };
}
