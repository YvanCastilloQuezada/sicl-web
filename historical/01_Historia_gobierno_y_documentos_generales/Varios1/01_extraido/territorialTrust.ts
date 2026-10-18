import { createHash, randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { storagePut } from "./storage";
import {
  auditEvents,
  territorialClaims,
  territorialEvidence,
  territorialSources,
  territorialVerificationReviews,
  territorialRoleAssignments,
  territorialAssets,
  territorialCaptureSessions,
  territorialWorldObjectSnapshots,
  territorialOfflineCaptures,
  users,
  worldObjects,
} from "../drizzle/schema";
import {
  canPublishWorldObject,
  canTransitionWorldObject,
  isRuntimeVisible,
  type ReviewDecision,
  type TerritorialCreateInput,
  type WorldObjectStatus,
  type MapperRole,
  type OfflineCapturePayload,
  type ConflictResolution,
  canSyncOfflineCapture,
  shouldPreserveConflict,
  calculateConfidenceScore,
} from "../shared/territorialTrust";

const id = (prefix: string) => `${prefix}-${randomUUID().replaceAll("-", "").slice(0, 24).toUpperCase()}`;
const json = (value: unknown) => JSON.stringify(value ?? {});

function parseJson<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export async function appendTerritorialAudit(input: { actorUserId: number; eventType: string; entityType: string; entityPublicId: string; payload: Record<string, unknown> }) {
  const db = await getDb();
  if (!db) return;
  const previous = await db.select({ eventHash: auditEvents.eventHash }).from(auditEvents).orderBy(desc(auditEvents.id)).limit(1);
  const previousHash = previous[0]?.eventHash ?? null;
  const payloadJson = json(input.payload);
  const eventHash = createHash("sha256").update(`${previousHash ?? "GENESIS"}|${input.eventType}|${input.entityType}|${input.entityPublicId}|${payloadJson}`).digest("hex");
  await db.insert(auditEvents).values({
    publicId: id("TAUD"),
    actorUserId: input.actorUserId,
    eventType: input.eventType,
    entityType: input.entityType,
    entityPublicId: input.entityPublicId,
    payloadJson,
    previousHash,
    eventHash,
  });
}

export async function requireTerritorialRole(userId: number, allowed: MapperRole[]) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const assignment = (await db.select({ role: territorialRoleAssignments.role }).from(territorialRoleAssignments).where(eq(territorialRoleAssignments.userId, userId)).limit(1))[0];
  if (assignment?.role && allowed.includes(assignment.role as MapperRole)) return assignment.role as MapperRole;
  const user = (await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1))[0];
  if (user?.role === "admin" && allowed.includes("HUMAN_AUTHORITY")) return "HUMAN_AUTHORITY" as const;
  throw new Error("TERRITORIAL_ROLE_FORBIDDEN");
}

export async function getTerritorialRole(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(territorialRoleAssignments).where(eq(territorialRoleAssignments.userId, userId)).limit(1);
  return rows[0]?.role ?? null;
}

export async function listTerritorialRoles() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ userId: territorialRoleAssignments.userId, role: territorialRoleAssignments.role, assignedByUserId: territorialRoleAssignments.assignedByUserId, updatedAt: territorialRoleAssignments.updatedAt }).from(territorialRoleAssignments).orderBy(desc(territorialRoleAssignments.updatedAt));
}

export async function assignTerritorialRole(input: { userId: number; role: MapperRole; assignedByUserId: number }) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  await db.insert(territorialRoleAssignments).values(input).onDuplicateKeyUpdate({ set: { role: input.role, assignedByUserId: input.assignedByUserId, updatedAt: new Date() } });
  await appendTerritorialAudit({ actorUserId: input.assignedByUserId, eventType: "TERRITORIAL_ROLE_ASSIGNED", entityType: "TERRITORIAL_ROLE", entityPublicId: `USER-${input.userId}`, payload: { role: input.role } });
  return getTerritorialRole(input.userId);
}

export async function listTerritorialObjects(status?: WorldObjectStatus) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(worldObjects).where(status ? eq(worldObjects.status, status) : undefined).orderBy(desc(worldObjects.updatedAt));
  return rows.map(row => ({ ...row, geometry: parseJson(row.geometryJson, {}), attributes: parseJson(row.attributesJson, {}), relations: parseJson(row.relationsJson, {}), assets: parseJson(row.assetsJson, []) }));
}

export async function getTerritorialObject(publicId: string) {
  const db = await getDb();
  if (!db) return null;
  const objectRows = await db.select().from(worldObjects).where(eq(worldObjects.publicId, publicId)).limit(1);
  const object = objectRows[0];
  if (!object) return null;
  const [claims, sources, evidence, reviews, assetRecords] = await Promise.all([
    db.select().from(territorialClaims).where(eq(territorialClaims.worldObjectId, object.id)).orderBy(desc(territorialClaims.createdAt)),
    db.select().from(territorialSources).where(eq(territorialSources.worldObjectId, object.id)).orderBy(desc(territorialSources.createdAt)),
    db.select().from(territorialEvidence).where(eq(territorialEvidence.worldObjectId, object.id)).orderBy(desc(territorialEvidence.createdAt)),
    db.select().from(territorialVerificationReviews).where(eq(territorialVerificationReviews.worldObjectId, object.id)).orderBy(desc(territorialVerificationReviews.createdAt)),
    db.select({ publicId: territorialAssets.publicId, assetType: territorialAssets.assetType, originalName: territorialAssets.originalName, mimeType: territorialAssets.mimeType, byteSize: territorialAssets.byteSize, storageUrl: territorialAssets.storageUrl, integrityHash: territorialAssets.integrityHash, accessScope: territorialAssets.accessScope, createdAt: territorialAssets.createdAt }).from(territorialAssets).where(eq(territorialAssets.worldObjectId, object.id)).orderBy(desc(territorialAssets.createdAt)),
  ]);
  return {
    ...object,
    geometry: parseJson(object.geometryJson, {}), attributes: parseJson(object.attributesJson, {}), relations: parseJson(object.relationsJson, {}), assets: parseJson(object.assetsJson, []),
    claims, sources, evidence, reviews, assetRecords,
  };
}

export async function createTerritorialSnapshot(objectPublicId: string, actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const object = (await db.select().from(worldObjects).where(eq(worldObjects.publicId, objectPublicId)).limit(1))[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  const [claims, sources, evidence, assets] = await Promise.all([
    db.select().from(territorialClaims).where(eq(territorialClaims.worldObjectId, object.id)),
    db.select().from(territorialSources).where(eq(territorialSources.worldObjectId, object.id)),
    db.select().from(territorialEvidence).where(eq(territorialEvidence.worldObjectId, object.id)),
    db.select().from(territorialAssets).where(eq(territorialAssets.worldObjectId, object.id)),
  ]);
  const state = { worldObject: { ...object, geometry: parseJson(object.geometryJson, {}), attributes: parseJson(object.attributesJson, {}), relations: parseJson(object.relationsJson, {}), assets: parseJson(object.assetsJson, []) }, claims, sources, evidence, assets, status: object.status, confidenceScore: object.confidenceScore, version: object.version, captureSessionId: object.captureSessionId };
  const stateJson = json(state);
  const snapshotHash = createHash("sha256").update(stateJson).digest("hex");
  const existing = await db.select({ publicId: territorialWorldObjectSnapshots.publicId }).from(territorialWorldObjectSnapshots).where(and(eq(territorialWorldObjectSnapshots.worldObjectId, object.id), eq(territorialWorldObjectSnapshots.version, object.version))).limit(1);
  if (existing[0]) return existing[0].publicId;
  const publicId = id("SNAP");
  await db.insert(territorialWorldObjectSnapshots).values({ publicId, worldObjectId: object.id, captureSessionId: object.captureSessionId, version: object.version, stateJson, snapshotHash, createdByUserId: actorUserId });
  await appendTerritorialAudit({ actorUserId, eventType: "WORLD_OBJECT_SNAPSHOT_CREATED", entityType: "WORLD_OBJECT", entityPublicId: objectPublicId, payload: { snapshotPublicId: publicId, version: object.version, snapshotHash } });
  return publicId;
}

export async function listTerritorialSnapshots(objectPublicId: string) {
  const db = await getDb();
  if (!db) return [];
  const object = (await db.select({ id: worldObjects.id }).from(worldObjects).where(eq(worldObjects.publicId, objectPublicId)).limit(1))[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  return db.select({ publicId: territorialWorldObjectSnapshots.publicId, version: territorialWorldObjectSnapshots.version, snapshotHash: territorialWorldObjectSnapshots.snapshotHash, createdByUserId: territorialWorldObjectSnapshots.createdByUserId, captureSessionId: territorialWorldObjectSnapshots.captureSessionId, createdAt: territorialWorldObjectSnapshots.createdAt }).from(territorialWorldObjectSnapshots).where(eq(territorialWorldObjectSnapshots.worldObjectId, object.id)).orderBy(desc(territorialWorldObjectSnapshots.version));
}

export async function getTerritorialSnapshot(snapshotPublicId: string) {
  const db = await getDb();
  if (!db) return null;
  const snapshot = (await db.select().from(territorialWorldObjectSnapshots).where(eq(territorialWorldObjectSnapshots.publicId, snapshotPublicId)).limit(1))[0];
  if (!snapshot) return null;
  return { ...snapshot, state: parseJson(snapshot.stateJson, {}) };
}

export async function restoreTerritorialSnapshot(snapshotPublicId: string, actorUserId: number) {
  await requireTerritorialRole(actorUserId, ["MAPPER_OPERATOR", "HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const snapshot = (await db.select().from(territorialWorldObjectSnapshots).where(eq(territorialWorldObjectSnapshots.publicId, snapshotPublicId)).limit(1))[0];
  if (!snapshot) throw new Error("SNAPSHOT_NOT_FOUND");
  const object = (await db.select().from(worldObjects).where(eq(worldObjects.id, snapshot.worldObjectId)).limit(1))[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  const state = parseJson<{ worldObject?: { objectType?: string; name?: string; description?: string; latitude?: string; longitude?: string; accuracyMeters?: number; geometry?: unknown; attributes?: unknown; relations?: unknown; assets?: unknown }; captureSessionId?: number | null }>(snapshot.stateJson, {});
  const source = state.worldObject ?? {};
  const nextVersion = object.version + 1;
  await db.update(worldObjects).set({ objectType: String(source.objectType ?? object.objectType), name: String(source.name ?? object.name), description: String(source.description ?? object.description), latitude: String(source.latitude ?? object.latitude), longitude: String(source.longitude ?? object.longitude), accuracyMeters: Number(source.accuracyMeters ?? object.accuracyMeters), geometryJson: json(source.geometry ?? parseJson(object.geometryJson, {})), attributesJson: json(source.attributes ?? parseJson(object.attributesJson, {})), relationsJson: json(source.relations ?? parseJson(object.relationsJson, {})), assetsJson: json(source.assets ?? parseJson(object.assetsJson, [])), captureSessionId: state.captureSessionId ?? object.captureSessionId, version: nextVersion, status: "CAPTURED", publicationStatus: "UNPUBLISHED", updatedByUserId: actorUserId }).where(eq(worldObjects.id, object.id));
  await appendTerritorialAudit({ actorUserId, eventType: "WORLD_OBJECT_SNAPSHOT_RESTORED", entityType: "WORLD_OBJECT", entityPublicId: object.publicId, payload: { sourceSnapshotPublicId: snapshotPublicId, sourceVersion: snapshot.version, newVersion: nextVersion, status: "CAPTURED" } });
  await createTerritorialSnapshot(object.publicId, actorUserId);
  return getTerritorialObject(object.publicId);
}

export async function createTerritorialCaptureSession(input: { name: string; territory: string; area?: Record<string, unknown>; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const publicId = id("TSES");
  await db.insert(territorialCaptureSessions).values({ publicId, name: input.name.trim().slice(0, 180), territory: input.territory.trim().slice(0, 180), mapperUserId: input.actorUserId, status: "DRAFT", syncStatus: "SYNCED", areaJson: json(input.area ?? {}) });
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "CAPTURE_SESSION_CREATED", entityType: "CAPTURE_SESSION", entityPublicId: publicId, payload: { status: "DRAFT", territory: input.territory } });
  return getTerritorialCaptureSession(publicId);
}

export async function listTerritorialCaptureSessions(actorUserId: number) {
  await requireTerritorialRole(actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(territorialCaptureSessions).orderBy(desc(territorialCaptureSessions.updatedAt));
  const objects = await db.select({ id: worldObjects.id, captureSessionId: worldObjects.captureSessionId }).from(worldObjects);
  const evidence = await db.select({ worldObjectId: territorialEvidence.worldObjectId }).from(territorialEvidence);
  return rows.map(row => ({ ...row, area: parseJson(row.areaJson, {}), objectCount: objects.filter(item => item.captureSessionId === row.id).length, evidenceCount: evidence.filter(item => objects.some(object => object.id === item.worldObjectId && object.captureSessionId === row.id)).length }));
}

export async function getTerritorialCaptureSession(publicId: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(territorialCaptureSessions).where(eq(territorialCaptureSessions.publicId, publicId)).limit(1);
  const session = rows[0];
  if (!session) return null;
  const objects = await db.select().from(worldObjects).where(eq(worldObjects.captureSessionId, session.id)).orderBy(desc(worldObjects.updatedAt));
  const evidence = await db.select({ worldObjectId: territorialEvidence.worldObjectId }).from(territorialEvidence);
  return { ...session, area: parseJson(session.areaJson, {}), objects: objects.map(item => ({ ...item, geometry: parseJson(item.geometryJson, {}), attributes: parseJson(item.attributesJson, {}), relations: parseJson(item.relationsJson, {}), assets: parseJson(item.assetsJson, []) })), objectCount: objects.length, evidenceCount: evidence.filter(item => objects.some(object => object.id === item.worldObjectId)).length };
}

export async function updateTerritorialObject(input: { objectPublicId: string; objectType: string; name: string; description: string; latitude: string; longitude: string; accuracyMeters: number; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const rows = await db.select().from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1);
  const object = rows[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  if (["VERIFIED", "PUBLISHED", "ARCHIVED"].includes(object.status)) throw new Error("VERIFIED_RECORD_LOCKED");
  const latitude = Number(input.latitude); const longitude = Number(input.longitude);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new Error("INVALID_COORDINATES");
  const nextVersion = object.version + 1;
  await db.update(worldObjects).set({ objectType: input.objectType.trim().slice(0, 48), name: input.name.trim().slice(0, 180), description: input.description.trim().slice(0, 10000), latitude: String(latitude), longitude: String(longitude), accuracyMeters: Math.max(0, Math.round(input.accuracyMeters)), geometryJson: json({ type: "Point", coordinates: [longitude, latitude] }), version: nextVersion, status: "CAPTURED", publicationStatus: "UNPUBLISHED", updatedByUserId: input.actorUserId }).where(eq(worldObjects.id, object.id));
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "WORLD_OBJECT_EDITED", entityType: "WORLD_OBJECT", entityPublicId: input.objectPublicId, payload: { previousVersion: object.version, version: nextVersion, status: "CAPTURED" } });
  await createTerritorialSnapshot(input.objectPublicId, input.actorUserId);
  return getTerritorialObject(input.objectPublicId);
}

export async function createTerritorialObject(input: TerritorialCreateInput & { actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  let captureSessionId: number | null = null;
  if (input.captureSessionPublicId) {
    const session = (await db.select({ id: territorialCaptureSessions.id, mapperUserId: territorialCaptureSessions.mapperUserId, status: territorialCaptureSessions.status }).from(territorialCaptureSessions).where(eq(territorialCaptureSessions.publicId, input.captureSessionPublicId)).limit(1))[0];
    if (!session) throw new Error("CAPTURE_SESSION_NOT_FOUND");
    if (session.mapperUserId !== input.actorUserId && session.status !== "DRAFT") throw new Error("CAPTURE_SESSION_OWNER_FORBIDDEN");
    if (session.status === "ARCHIVED") throw new Error("CAPTURE_SESSION_ARCHIVED");
    captureSessionId = session.id;
  }
  const publicId = id("WOBJ");
  await db.insert(worldObjects).values({
    publicId,
    objectType: input.objectType,
    name: input.name,
    description: input.description,
    geometryJson: json(input.geometry),
    latitude: input.latitude,
    longitude: input.longitude,
    accuracyMeters: input.accuracyMeters,
    status: "CAPTURED",
    publicationStatus: "UNPUBLISHED",
    confidenceScore: 0,
    attributesJson: json(input.attributes),
    relationsJson: json(input.relations),
    assetsJson: json(input.assets ?? []),
    version: 1,
    createdByUserId: input.actorUserId,
    updatedByUserId: input.actorUserId,
    captureSessionId,
  });
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "WORLD_OBJECT_CREATED", entityType: "WORLD_OBJECT", entityPublicId: publicId, payload: { status: "CAPTURED", version: 1 } });
  await createTerritorialSnapshot(publicId, input.actorUserId);
  return getTerritorialObject(publicId);
}

export async function addTerritorialClaim(input: { objectPublicId: string; text: string; claimType: string; observations: string; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const objectRows = await db.select().from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1);
  const object = objectRows[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  const publicId = id("CLM");
  await db.insert(territorialClaims).values({ publicId, worldObjectId: object.id, text: input.text, claimType: input.claimType, observations: input.observations, createdByUserId: input.actorUserId });
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "CLAIM_CREATED", entityType: "CLAIM", entityPublicId: publicId, payload: { worldObjectPublicId: input.objectPublicId, version: 1 } });
  return getTerritorialObject(input.objectPublicId);
}

export async function addTerritorialSource(input: { objectPublicId: string; institutionOrPerson: string; sourceType: string; referenceUrl?: string; sourceDate?: Date; author?: string; documentRef?: string; authorityLevel: number; observations: string; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const objectRows = await db.select().from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1);
  const object = objectRows[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  const publicId = id("SRC");
  await db.insert(territorialSources).values({ publicId, worldObjectId: object.id, institutionOrPerson: input.institutionOrPerson, sourceType: input.sourceType, referenceUrl: input.referenceUrl, sourceDate: input.sourceDate, author: input.author, documentRef: input.documentRef, authorityLevel: input.authorityLevel, observations: input.observations, createdByUserId: input.actorUserId });
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "SOURCE_CREATED", entityType: "SOURCE", entityPublicId: publicId, payload: { worldObjectPublicId: input.objectPublicId, authorityLevel: input.authorityLevel } });
  return getTerritorialObject(input.objectPublicId);
}

export async function addTerritorialEvidence(input: { objectPublicId: string; claimPublicId?: string; evidenceType: string; origin: string; capturedAt: Date; integrityHash: string; metadata?: Record<string, unknown>; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const objectRows = await db.select().from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1);
  const object = objectRows[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  let claimId: number | null = null;
  if (input.claimPublicId) {
    const claimRows = await db.select({ id: territorialClaims.id }).from(territorialClaims).where(and(eq(territorialClaims.publicId, input.claimPublicId), eq(territorialClaims.worldObjectId, object.id))).limit(1);
    claimId = claimRows[0]?.id ?? null;
    if (!claimId) throw new Error("CLAIM_NOT_FOUND");
  }
  const publicId = id("EVD");
  await db.insert(territorialEvidence).values({ publicId, worldObjectId: object.id, claimId, evidenceType: input.evidenceType, origin: input.origin, capturedAt: input.capturedAt, responsibleUserId: input.actorUserId, integrityHash: input.integrityHash, metadataJson: json(input.metadata), version: 1 });
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "EVIDENCE_CREATED", entityType: "EVIDENCE", entityPublicId: publicId, payload: { worldObjectPublicId: input.objectPublicId, claimPublicId: input.claimPublicId ?? null, integrityHash: input.integrityHash } });
  return getTerritorialObject(input.objectPublicId);
}

export async function reviewTerritorialObject(input: { objectPublicId: string; decision: ReviewDecision; reason: string; evidenceReviewed: string[]; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["EYE_REVIEWER"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const objectRows = await db.select().from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1);
  const object = objectRows[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  const nextStatus: Record<ReviewDecision, WorldObjectStatus> = { REQUEST_EVIDENCE: "EVIDENCE_REQUIRED", VERIFY: "VERIFIED", DISPUTE: "DISPUTED", REJECT: "REJECTED", ARCHIVE: "ARCHIVED" };
  const target = nextStatus[input.decision];
  if (!canTransitionWorldObject(object.status, target)) throw new Error(`INVALID_STATUS_TRANSITION:${object.status}->${target}`);
  const publicId = id("REV");
  await db.insert(territorialVerificationReviews).values({ publicId, worldObjectId: object.id, reviewerUserId: input.actorUserId, decision: input.decision, evidenceReviewedJson: json(input.evidenceReviewed), approvedVersion: input.decision === "VERIFY" ? object.version : null, reason: input.reason });
  const [evidenceRows, sourceRows, claimRows] = await Promise.all([
    db.select({ id: territorialEvidence.id }).from(territorialEvidence).where(eq(territorialEvidence.worldObjectId, object.id)),
    db.select({ id: territorialSources.id }).from(territorialSources).where(eq(territorialSources.worldObjectId, object.id)),
    db.select({ id: territorialClaims.id }).from(territorialClaims).where(eq(territorialClaims.worldObjectId, object.id)),
  ]);
  const nextConfidence = input.decision === "VERIFY" ? calculateConfidenceScore({ sourceCount: sourceRows.length, evidenceCount: evidenceRows.length, claimCount: claimRows.length, accuracyMeters: object.accuracyMeters, status: target }) : object.confidenceScore;
  await db.update(worldObjects).set({ status: target, confidenceScore: nextConfidence, updatedByUserId: input.actorUserId }).where(eq(worldObjects.id, object.id));
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: `WORLD_OBJECT_${input.decision}`, entityType: "WORLD_OBJECT", entityPublicId: input.objectPublicId, payload: { from: object.status, to: target, reviewPublicId: publicId, evidenceReviewed: input.evidenceReviewed } });
  return getTerritorialObject(input.objectPublicId);
}

export async function publishTerritorialObject(objectPublicId: string, actorUserId: number) {
  await requireTerritorialRole(actorUserId, ["HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const objectRows = await db.select().from(worldObjects).where(eq(worldObjects.publicId, objectPublicId)).limit(1);
  const object = objectRows[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  const [evidence, sources] = await Promise.all([
    db.select({ id: territorialEvidence.id }).from(territorialEvidence).where(eq(territorialEvidence.worldObjectId, object.id)),
    db.select({ id: territorialSources.id }).from(territorialSources).where(eq(territorialSources.worldObjectId, object.id)),
  ]);
  if (!canPublishWorldObject(object.status, object.confidenceScore, evidence.length, sources.length)) throw new Error("PUBLICATION_GATE_FAILED");
  await db.update(worldObjects).set({ status: "PUBLISHED", publicationStatus: "PUBLISHED", updatedByUserId: actorUserId }).where(eq(worldObjects.id, object.id));
  await appendTerritorialAudit({ actorUserId, eventType: "WORLD_OBJECT_PUBLISHED", entityType: "WORLD_OBJECT", entityPublicId: objectPublicId, payload: { version: object.version, evidenceCount: evidence.length, sourceCount: sources.length } });
  return getTerritorialObject(objectPublicId);
}

export async function uploadTerritorialAsset(input: { objectPublicId: string; assetType: string; originalName: string; mimeType: string; base64Data: string; accessScope: "ADMIN_ONLY" | "REVIEW_ONLY" | "PUBLISHED_RUNTIME"; evidencePublicId?: string; sourcePublicId?: string; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "application/pdf", "text/plain"]);
  if (!allowed.has(input.mimeType)) throw new Error("UNSUPPORTED_ASSET_TYPE");
  const data = Buffer.from(input.base64Data, "base64");
  if (!data.length || data.length > 20 * 1024 * 1024) throw new Error("ASSET_SIZE_LIMIT");
  const objectRows = await db.select().from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1);
  const object = objectRows[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  const evidence = input.evidencePublicId ? (await db.select({ id: territorialEvidence.id }).from(territorialEvidence).where(and(eq(territorialEvidence.publicId, input.evidencePublicId), eq(territorialEvidence.worldObjectId, object.id))).limit(1))[0] : undefined;
  const source = input.sourcePublicId ? (await db.select({ id: territorialSources.id }).from(territorialSources).where(and(eq(territorialSources.publicId, input.sourcePublicId), eq(territorialSources.worldObjectId, object.id))).limit(1))[0] : undefined;
  if (input.evidencePublicId && !evidence) throw new Error("EVIDENCE_NOT_FOUND");
  if (input.sourcePublicId && !source) throw new Error("SOURCE_NOT_FOUND");
  const integrityHash = createHash("sha256").update(data).digest("hex");
  const safeName = input.originalName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "asset";
  const uploaded = await storagePut(`territorial/${input.objectPublicId}/${safeName}`, data, input.mimeType);
  const publicId = id("AST");
  await db.insert(territorialAssets).values({ publicId, worldObjectId: object.id, evidenceId: evidence?.id ?? null, sourceId: source?.id ?? null, assetType: input.assetType, originalName: safeName, mimeType: input.mimeType, byteSize: data.length, storageKey: uploaded.key, storageUrl: uploaded.url, integrityHash, accessScope: input.accessScope, uploadedByUserId: input.actorUserId });
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "TERRITORIAL_ASSET_UPLOADED", entityType: "ASSET", entityPublicId: publicId, payload: { objectPublicId: input.objectPublicId, mimeType: input.mimeType, byteSize: data.length, integrityHash, accessScope: input.accessScope } });
  return { publicId, key: uploaded.key, url: uploaded.url, byteSize: data.length, integrityHash };
}

export async function exportTerritorialData(format: "csv" | "geojson", status?: WorldObjectStatus) {
  const rows = await listTerritorialObjects(status);
  if (format === "geojson") return { filename: "milukita-worldobjects.geojson", contentType: "application/geo+json", content: JSON.stringify({ type: "FeatureCollection", features: rows.map(row => ({ type: "Feature", id: row.publicId, geometry: row.geometry, properties: { name: row.name, objectType: row.objectType, description: row.description, status: row.status, accuracyMeters: row.accuracyMeters, version: row.version } })) }, null, 2) };
  const header = "publicId,objectType,name,description,latitude,longitude,accuracyMeters,status,confidenceScore,version";
  const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const content = [header, ...rows.map(row => [row.publicId, row.objectType, row.name, row.description, row.latitude, row.longitude, row.accuracyMeters, row.status, row.confidenceScore, row.version].map(escape).join(","))].join("\\n");
  return { filename: "milukita-worldobjects.csv", contentType: "text/csv;charset=utf-8", content };
}

function parseCsvLine(line: string) {
  const values: string[] = []; let current = ""; let quoted = false;
  for (let i = 0; i < line.length; i += 1) { const char = line[i]; if (char === '"' && line[i + 1] === '"') { current += '"'; i += 1; } else if (char === '"') quoted = !quoted; else if (char === "," && !quoted) { values.push(current); current = ""; } else current += char; }
  values.push(current); return values;
}

export async function importTerritorialData(input: { format: "csv" | "geojson"; content: string; actorUserId: number; captureSessionPublicId?: string }) {
  if (input.content.length > 5_000_000) throw new Error("IMPORT_SIZE_LIMIT");
  if (input.format === "geojson") {
    const parsed = JSON.parse(input.content) as { type?: string; features?: Array<{ geometry?: { type?: string; coordinates?: unknown }; properties?: Record<string, unknown> }> };
    if (parsed.type !== "FeatureCollection" || !Array.isArray(parsed.features)) throw new Error("INVALID_GEOJSON");
    const results = [];
    for (const feature of parsed.features.slice(0, 500)) {
      const coordinates = feature.geometry?.coordinates as [number, number] | undefined;
      const props = feature.properties ?? {};
      if (!coordinates || !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) continue;
      results.push(await createTerritorialObject({ actorUserId: input.actorUserId, objectType: String(props.objectType ?? "PLACE"), name: String(props.name ?? "Sin nombre").slice(0, 180), description: String(props.description ?? "Importado; pendiente de verificación").slice(0, 10_000), latitude: String(coordinates[1]), longitude: String(coordinates[0]), accuracyMeters: Number(props.accuracyMeters ?? 0), geometry: feature.geometry as Record<string, unknown>, captureSessionPublicId: input.captureSessionPublicId }));
    }
    return { imported: results.length, rejected: parsed.features.length - results.length };
  }
  const lines = input.content.replace(/^\\uFEFF/, "").split(/\\r?\\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("INVALID_CSV");
  const headers = parseCsvLine(lines[0]).map(header => header.trim());
  const required = ["name", "latitude", "longitude"];
  if (required.some(field => !headers.includes(field))) throw new Error("CSV_REQUIRED_COLUMNS");
  let imported = 0; let rejected = 0;
  for (const line of lines.slice(1, 501)) {
    const values = parseCsvLine(line); const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    const lat = Number(row.latitude); const lng = Number(row.longitude);
    if (!row.name || !Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) { rejected += 1; continue; }
    await createTerritorialObject({ actorUserId: input.actorUserId, objectType: row.objectType || "PLACE", name: row.name.slice(0, 180), description: (row.description || "Importado; pendiente de verificación").slice(0, 10_000), latitude: String(lat), longitude: String(lng), accuracyMeters: Math.max(0, Number(row.accuracyMeters) || 0), geometry: { type: "Point", coordinates: [lng, lat] }, captureSessionPublicId: input.captureSessionPublicId });
    imported += 1;
  }
  return { imported, rejected: rejected + Math.max(0, lines.length - 501) };
}

export async function listTerritorialOfflineCaptures(actorUserId: number) {
  await requireTerritorialRole(actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) return [];
  return db.select({ publicId: territorialOfflineCaptures.publicId, clientCaptureId: territorialOfflineCaptures.clientCaptureId, deviceFingerprint: territorialOfflineCaptures.deviceFingerprint, status: territorialOfflineCaptures.status, captureSessionId: territorialOfflineCaptures.captureSessionId, conflictJson: territorialOfflineCaptures.conflictJson, syncedAt: territorialOfflineCaptures.syncedAt, createdAt: territorialOfflineCaptures.createdAt, updatedAt: territorialOfflineCaptures.updatedAt }).from(territorialOfflineCaptures).where(eq(territorialOfflineCaptures.mapperUserId, actorUserId)).orderBy(desc(territorialOfflineCaptures.updatedAt));
}

export async function queueOfflineCapture(input: { payload: OfflineCapturePayload; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const existing = (await db.select().from(territorialOfflineCaptures).where(and(eq(territorialOfflineCaptures.mapperUserId, input.actorUserId), eq(territorialOfflineCaptures.clientCaptureId, input.payload.clientCaptureId))).limit(1))[0];
  if (existing) return existing;
  const session = input.payload.captureSessionPublicId ? (await db.select({ id: territorialCaptureSessions.id }).from(territorialCaptureSessions).where(eq(territorialCaptureSessions.publicId, input.payload.captureSessionPublicId)).limit(1))[0] : undefined;
  const publicId = id("OCAP");
  await db.insert(territorialOfflineCaptures).values({ publicId, captureSessionId: session?.id ?? null, mapperUserId: input.actorUserId, deviceFingerprint: input.payload.deviceFingerprint.slice(0, 128), clientCaptureId: input.payload.clientCaptureId.slice(0, 96), payloadJson: json(input.payload), status: "OFFLINE", conflictJson: "{}" });
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "OFFLINE_CAPTURE_QUEUED", entityType: "OFFLINE_CAPTURE", entityPublicId: publicId, payload: { clientCaptureId: input.payload.clientCaptureId, status: "OFFLINE", captureSessionPublicId: input.payload.captureSessionPublicId ?? null } });
  return (await db.select().from(territorialOfflineCaptures).where(eq(territorialOfflineCaptures.publicId, publicId)).limit(1))[0];
}

export async function syncOfflineCapture(input: { publicId: string; actorUserId: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const row = (await db.select().from(territorialOfflineCaptures).where(and(eq(territorialOfflineCaptures.publicId, input.publicId), eq(territorialOfflineCaptures.mapperUserId, input.actorUserId))).limit(1))[0];
  if (!row) throw new Error("OFFLINE_CAPTURE_NOT_FOUND");
  if (!canSyncOfflineCapture(row.status as "OFFLINE" | "PENDING_SYNC" | "SYNCED" | "CONFLICT" | "REJECTED")) return row;
  const payload = parseJson<OfflineCapturePayload | null>(row.payloadJson, null);
  if (!payload) throw new Error("OFFLINE_PAYLOAD_INVALID");
  if (payload.targetObjectPublicId) {
    const target = (await db.select().from(worldObjects).where(eq(worldObjects.publicId, payload.targetObjectPublicId)).limit(1))[0];
    if (target && payload.baseVersion !== undefined && shouldPreserveConflict(payload.baseVersion, target.version)) {
      const conflictJson = json({ local: payload, server: { publicId: target.publicId, version: target.version, status: target.status, name: target.name, description: target.description }, resolution: "HUMAN_REVIEW_REQUIRED" });
      await db.update(territorialOfflineCaptures).set({ status: "CONFLICT", conflictJson }).where(eq(territorialOfflineCaptures.id, row.id));
      await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "OFFLINE_CAPTURE_CONFLICT", entityType: "OFFLINE_CAPTURE", entityPublicId: row.publicId, payload: { targetObjectPublicId: target.publicId, localVersion: payload.baseVersion, serverVersion: target.version, resolution: "HUMAN_REVIEW_REQUIRED" } });
      return (await db.select().from(territorialOfflineCaptures).where(eq(territorialOfflineCaptures.id, row.id)).limit(1))[0];
    }
    if (target) await updateTerritorialObject({ objectPublicId: target.publicId, objectType: payload.worldObject.objectType, name: payload.worldObject.name, description: payload.worldObject.description, latitude: payload.worldObject.latitude, longitude: payload.worldObject.longitude, accuracyMeters: payload.worldObject.accuracyMeters, actorUserId: input.actorUserId });
  } else {
    await createTerritorialObject({ ...payload.worldObject, captureSessionPublicId: payload.captureSessionPublicId, actorUserId: input.actorUserId });
  }
  await db.update(territorialOfflineCaptures).set({ status: "SYNCED", syncedAt: new Date(), conflictJson: "{}" }).where(eq(territorialOfflineCaptures.id, row.id));
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "OFFLINE_CAPTURE_SYNCED", entityType: "OFFLINE_CAPTURE", entityPublicId: row.publicId, payload: { clientCaptureId: row.clientCaptureId, status: "SYNCED" } });
  return (await db.select().from(territorialOfflineCaptures).where(eq(territorialOfflineCaptures.id, row.id)).limit(1))[0];
}

export async function resolveOfflineConflict(input: { publicId: string; resolution: ConflictResolution; actorUserId: number; merged?: Partial<OfflineCapturePayload["worldObject"]> }) {
  await requireTerritorialRole(input.actorUserId, ["EYE_REVIEWER", "HUMAN_AUTHORITY"]);
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const row = (await db.select().from(territorialOfflineCaptures).where(eq(territorialOfflineCaptures.publicId, input.publicId)).limit(1))[0];
  if (!row) throw new Error("OFFLINE_CAPTURE_NOT_FOUND");
  if (row.status !== "CONFLICT") throw new Error("CONFLICT_NOT_PENDING");
  const payload = parseJson<OfflineCapturePayload | null>(row.payloadJson, null);
  if (!payload) throw new Error("OFFLINE_PAYLOAD_INVALID");
  const target = payload.targetObjectPublicId ? (await db.select().from(worldObjects).where(eq(worldObjects.publicId, payload.targetObjectPublicId)).limit(1))[0] : undefined;
  if (input.resolution === "KEEP_REMOTE") {
    await db.update(territorialOfflineCaptures).set({ status: "SYNCED", conflictJson: json({ resolvedBy: input.actorUserId, resolution: input.resolution }) }).where(eq(territorialOfflineCaptures.id, row.id));
  } else if (!target) {
    throw new Error("CONFLICT_TARGET_NOT_FOUND");
  } else if (input.resolution === "MARK_DISPUTED") {
    await db.update(worldObjects).set({ status: "DISPUTED", updatedByUserId: input.actorUserId }).where(eq(worldObjects.id, target.id));
    await db.update(territorialOfflineCaptures).set({ status: "SYNCED", conflictJson: json({ resolvedBy: input.actorUserId, resolution: input.resolution, targetObjectPublicId: target.publicId }) }).where(eq(territorialOfflineCaptures.id, row.id));
  } else {
    const local = payload.worldObject;
    const merged = input.resolution === "MERGE" ? { ...local, ...(input.merged ?? {}) } : local;
    const nextVersion = target.version + 1;
    await db.update(worldObjects).set({ objectType: merged.objectType, name: merged.name, description: merged.description, latitude: merged.latitude, longitude: merged.longitude, accuracyMeters: Math.max(0, Math.round(merged.accuracyMeters)), geometryJson: json(merged.geometry), attributesJson: json(merged.attributes), relationsJson: json(merged.relations), assetsJson: json(merged.assets ?? []), status: "CAPTURED", version: nextVersion, updatedByUserId: input.actorUserId }).where(eq(worldObjects.id, target.id));
    await db.update(territorialOfflineCaptures).set({ status: "SYNCED", conflictJson: json({ resolvedBy: input.actorUserId, resolution: input.resolution, targetObjectPublicId: target.publicId, newVersion: nextVersion }) }).where(eq(territorialOfflineCaptures.id, row.id));
    await createTerritorialSnapshot(target.publicId, input.actorUserId);
  }
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "OFFLINE_CONFLICT_RESOLVED", entityType: "OFFLINE_CAPTURE", entityPublicId: row.publicId, payload: { resolution: input.resolution, targetObjectPublicId: payload.targetObjectPublicId ?? null } });
  return (await db.select().from(territorialOfflineCaptures).where(eq(territorialOfflineCaptures.id, row.id)).limit(1))[0];
}

export async function listPublishedTerritorialObjects() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(worldObjects).where(and(eq(worldObjects.status, "PUBLISHED"), eq(worldObjects.publicationStatus, "PUBLISHED")));
  return rows.filter(row => isRuntimeVisible(row.status) && row.publicationStatus === "PUBLISHED").map(row => ({ publicId: row.publicId, objectType: row.objectType, name: row.name, description: row.description, latitude: row.latitude, longitude: row.longitude, geometry: parseJson(row.geometryJson, {}), version: row.version }));
}
