import { createHash, randomBytes } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { territorialAssetVersions, territorialAssets, territorialEvidence, territorialSources, worldObjects } from "../drizzle/schema";
import { getDb } from "./db";
import { storagePut } from "./storage";
import { appendTerritorialAudit, requireTerritorialRole } from "./territorialTrust";

export type ArAssetFormat = "GLB" | "GLTF" | "TEXTURE" | "METADATA";
export type ArAssetStatus = "DRAFT" | "VALIDATED" | "AUTHORIZED" | "PUBLISHED" | "ARCHIVED" | "REJECTED";

const MIME_FORMATS: Record<string, ArAssetFormat> = {
  "model/gltf-binary": "GLB",
  "model/gltf+json": "GLTF",
  "application/json": "METADATA",
  "image/png": "TEXTURE",
  "image/jpeg": "TEXTURE",
  "image/webp": "TEXTURE",
  "image/ktx2": "TEXTURE",
};
const MAX_ASSET_BYTES = 50 * 1024 * 1024;
const MAX_BASE64_CHARS = Math.ceil(MAX_ASSET_BYTES * 4 / 3) + 16;
const assetId = () => `AST-${randomBytes(18).toString("hex").toUpperCase()}`;
const versionId = () => `AVR-${randomBytes(18).toString("hex").toUpperCase()}`;
const parseJson = <T>(value: string | null, fallback: T): T => { try { return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } };

export function decodeAssetBase64(value: string) {
  const trimmed = value.trim();
  const payload = trimmed.replace(/^data:[^;,]+;base64,/i, "");
  if (!payload || payload.length > MAX_BASE64_CHARS || !/^[A-Za-z0-9+/_-]*={0,2}$/.test(payload)) throw new Error("INVALID_BASE64_PAYLOAD");
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  if (normalized.length % 4 === 1) throw new Error("INVALID_BASE64_PAYLOAD");
  const bytes = Buffer.from(normalized, "base64");
  const canonical = bytes.toString("base64").replace(/=+$/, "");
  if (canonical !== normalized.replace(/=+$/, "")) throw new Error("INVALID_BASE64_PAYLOAD");
  if (bytes.length === 0 || bytes.length > MAX_ASSET_BYTES) throw new Error("ASSET_SIZE_LIMIT");
  return bytes;
}

export function validateArAssetPayload(input: { mimeType: string; originalName: string; bytes: Uint8Array; metadata?: Record<string, unknown> }) {
  const errors: string[] = [];
  const format = MIME_FORMATS[input.mimeType];
  if (!format) errors.push("UNSUPPORTED_ASSET_FORMAT");
  if (!input.originalName.trim()) errors.push("ASSET_NAME_REQUIRED");
  if (!input.bytes.length || input.bytes.length > MAX_ASSET_BYTES) errors.push("ASSET_SIZE_LIMIT");
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/.test(input.originalName.trim())) errors.push("INVALID_ASSET_NAME");
  if (!input.metadata || typeof input.metadata !== "object" || Array.isArray(input.metadata)) errors.push("ASSET_METADATA_REQUIRED");
  if (format === "GLB" && (input.bytes.length < 12 || String.fromCharCode(...Array.from(input.bytes.slice(0, 4))) !== "glTF")) errors.push("INVALID_GLB_MAGIC");
  if (format === "GLTF") {
    try { const parsed = JSON.parse(new TextDecoder().decode(input.bytes)) as { asset?: unknown }; if (!parsed.asset) errors.push("INVALID_GLTF_DOCUMENT"); } catch { errors.push("INVALID_GLTF_DOCUMENT"); }
  }
  return { valid: errors.length === 0, errors, format: format ?? null, checksum: createHash("sha256").update(input.bytes).digest("hex") };
}

function publicAsset(row: typeof territorialAssets.$inferSelect) {
  return { ...row, metadata: parseJson(row.metadataJson, {}), metadataJson: undefined };
}

export async function registerAsset(input: { actorUserId: number; objectPublicId: string; assetType: string; originalName: string; mimeType: string; base64Data: string; metadata: Record<string, unknown>; evidencePublicId?: string; sourcePublicId?: string }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER"]);
  const db = await getDb(); if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const object = (await db.select({ id: worldObjects.id, publicId: worldObjects.publicId }).from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1))[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  const evidence = input.evidencePublicId ? (await db.select({ id: territorialEvidence.id }).from(territorialEvidence).where(and(eq(territorialEvidence.publicId, input.evidencePublicId), eq(territorialEvidence.worldObjectId, object.id))).limit(1))[0] : undefined;
  const source = input.sourcePublicId ? (await db.select({ id: territorialSources.id }).from(territorialSources).where(and(eq(territorialSources.publicId, input.sourcePublicId), eq(territorialSources.worldObjectId, object.id))).limit(1))[0] : undefined;
  if (input.evidencePublicId && !evidence) throw new Error("EVIDENCE_NOT_FOUND");
  if (input.sourcePublicId && !source) throw new Error("SOURCE_NOT_FOUND");
  const bytes = decodeAssetBase64(input.base64Data);
  const validation = validateArAssetPayload({ mimeType: input.mimeType, originalName: input.originalName, bytes, metadata: input.metadata });
  if (!validation.valid) throw new Error(validation.errors.join(","));
  const safeName = input.originalName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-180) || "asset";
  const uploaded = await storagePut(`luka-ar/${object.publicId}/${assetId()}/${safeName}`, bytes, input.mimeType);
  const publicId = assetId();
  await db.insert(territorialAssets).values({ publicId, worldObjectId: object.id, evidenceId: evidence?.id ?? null, sourceId: source?.id ?? null, assetType: input.assetType.slice(0, 32), originalName: safeName, mimeType: input.mimeType, byteSize: bytes.length, storageKey: uploaded.key, storageUrl: uploaded.url, integrityHash: validation.checksum, format: validation.format!, metadataJson: JSON.stringify(input.metadata), status: "DRAFT", currentVersion: 1, publishedVersion: null, accessScope: "ADMIN_ONLY", uploadedByUserId: input.actorUserId });
  const asset = (await db.select().from(territorialAssets).where(eq(territorialAssets.publicId, publicId)).limit(1))[0];
  if (!asset) throw new Error("ASSET_REGISTRATION_FAILED");
  await db.insert(territorialAssetVersions).values({ publicId: versionId(), assetId: asset.id, version: 1, format: validation.format!, originalName: safeName, mimeType: input.mimeType, byteSize: bytes.length, storageKey: uploaded.key, storageUrl: uploaded.url, checksum: validation.checksum, metadataJson: JSON.stringify(input.metadata), status: "DRAFT", createdByUserId: input.actorUserId });
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "AR_ASSET_REGISTERED", entityType: "AR_ASSET", entityPublicId: publicId, payload: { objectPublicId: object.publicId, format: validation.format, checksum: validation.checksum, status: "DRAFT" } });
  return getAsset(publicId, input.actorUserId);
}

export async function getAsset(publicId: string, actorUserId: number) {
  await requireTerritorialRole(actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"]);
  const db = await getDb(); if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const asset = (await db.select().from(territorialAssets).where(eq(territorialAssets.publicId, publicId)).limit(1))[0];
  if (!asset) throw new Error("ASSET_NOT_FOUND");
  const versions = await db.select().from(territorialAssetVersions).where(eq(territorialAssetVersions.assetId, asset.id)).orderBy(desc(territorialAssetVersions.version));
  return { ...publicAsset(asset), versions: versions.map(version => ({ ...version, metadata: parseJson(version.metadataJson, {}) })) };
}

export async function updateAssetMetadata(input: { actorUserId: number; assetPublicId: string; metadata: Record<string, unknown> }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER"]);
  const db = await getDb(); if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const asset = (await db.select().from(territorialAssets).where(eq(territorialAssets.publicId, input.assetPublicId)).limit(1))[0];
  if (!asset) throw new Error("ASSET_NOT_FOUND");
  await db.update(territorialAssets).set({ metadataJson: JSON.stringify(input.metadata), status: "DRAFT" }).where(eq(territorialAssets.id, asset.id));
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "AR_ASSET_METADATA_UPDATED", entityType: "AR_ASSET", entityPublicId: asset.publicId, payload: { status: "DRAFT" } });
  return getAsset(asset.publicId, input.actorUserId);
}

export async function createAssetVersion(input: { actorUserId: number; assetPublicId: string; originalName: string; mimeType: string; base64Data: string; metadata: Record<string, unknown> }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER"]);
  const db = await getDb(); if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const asset = (await db.select().from(territorialAssets).where(eq(territorialAssets.publicId, input.assetPublicId)).limit(1))[0];
  if (!asset) throw new Error("ASSET_NOT_FOUND");
  const bytes = decodeAssetBase64(input.base64Data);
  const validation = validateArAssetPayload({ mimeType: input.mimeType, originalName: input.originalName, bytes, metadata: input.metadata });
  if (!validation.valid) throw new Error(validation.errors.join(","));
  const version = asset.currentVersion + 1;
  const safeName = input.originalName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-180) || "asset";
  const uploaded = await storagePut(`luka-ar/${asset.publicId}/v${version}/${safeName}`, bytes, input.mimeType);
  const versionPublicId = versionId();
  await db.insert(territorialAssetVersions).values({ publicId: versionPublicId, assetId: asset.id, version, format: validation.format!, originalName: safeName, mimeType: input.mimeType, byteSize: bytes.length, storageKey: uploaded.key, storageUrl: uploaded.url, checksum: validation.checksum, metadataJson: JSON.stringify(input.metadata), status: "DRAFT", createdByUserId: input.actorUserId });
  await db.update(territorialAssets).set({ currentVersion: version, format: validation.format!, originalName: safeName, mimeType: input.mimeType, byteSize: bytes.length, storageKey: uploaded.key, storageUrl: uploaded.url, integrityHash: validation.checksum, metadataJson: JSON.stringify(input.metadata), status: "DRAFT", publishedVersion: null }).where(eq(territorialAssets.id, asset.id));
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "AR_ASSET_VERSION_CREATED", entityType: "AR_ASSET", entityPublicId: asset.publicId, payload: { version, versionPublicId, checksum: validation.checksum, status: "DRAFT" } });
  return getAsset(asset.publicId, input.actorUserId);
}

export async function validateAsset(input: { actorUserId: number; assetPublicId: string; version?: number }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER"]);
  const db = await getDb(); if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const asset = (await db.select().from(territorialAssets).where(eq(territorialAssets.publicId, input.assetPublicId)).limit(1))[0];
  if (!asset) throw new Error("ASSET_NOT_FOUND");
  const targetVersion = input.version ?? asset.currentVersion;
  const version = (await db.select().from(territorialAssetVersions).where(and(eq(territorialAssetVersions.assetId, asset.id), eq(territorialAssetVersions.version, targetVersion))).limit(1))[0];
  if (!version) throw new Error("ASSET_VERSION_NOT_FOUND");
  const metadata = parseJson<Record<string, unknown> | null>(version.metadataJson, null);
  const formatMatches = MIME_FORMATS[version.mimeType] === version.format;
  const valid = /^[a-f0-9]{64}$/i.test(version.checksum) && Boolean(metadata) && formatMatches;
  if (!valid) throw new Error("ASSET_INTEGRITY_INVALID");
  await db.update(territorialAssetVersions).set({ status: "VALIDATED" }).where(eq(territorialAssetVersions.id, version.id));
  await db.update(territorialAssets).set({ status: "VALIDATED" }).where(eq(territorialAssets.id, asset.id));
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "AR_ASSET_VALIDATED", entityType: "AR_ASSET", entityPublicId: asset.publicId, payload: { version: targetVersion, checksum: version.checksum, validation: "PASS" } });
  return { assetPublicId: asset.publicId, version: targetVersion, status: "VALIDATED" as const, checksum: version.checksum };
}

export async function associateAsset(input: { actorUserId: number; assetPublicId: string; objectPublicId: string }) {
  await requireTerritorialRole(input.actorUserId, ["MAPPER_OPERATOR", "EYE_REVIEWER"]);
  const db = await getDb(); if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const [asset, object] = await Promise.all([
    db.select().from(territorialAssets).where(eq(territorialAssets.publicId, input.assetPublicId)).limit(1),
    db.select({ id: worldObjects.id, publicId: worldObjects.publicId }).from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1),
  ]);
  if (!asset[0]) throw new Error("ASSET_NOT_FOUND");
  if (!object[0]) throw new Error("WORLD_OBJECT_NOT_FOUND");
  if (asset[0].worldObjectId !== object[0].id) throw new Error("ASSET_ALREADY_ASSOCIATED_TO_OTHER_OBJECT");
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "AR_ASSET_ASSOCIATED", entityType: "AR_ASSET", entityPublicId: input.assetPublicId, payload: { objectPublicId: input.objectPublicId, separation: "WORLD_OBJECT_DATA_SEPARATE_FROM_AR_PRESENTATION" } });
  return { assetPublicId: input.assetPublicId, objectPublicId: input.objectPublicId, associated: true };
}

export async function archiveAsset(input: { actorUserId: number; assetPublicId: string }) {
  await requireTerritorialRole(input.actorUserId, ["HUMAN_AUTHORITY"]);
  const db = await getDb(); if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const asset = (await db.select().from(territorialAssets).where(eq(territorialAssets.publicId, input.assetPublicId)).limit(1))[0];
  if (!asset) throw new Error("ASSET_NOT_FOUND");
  await db.update(territorialAssets).set({ status: "ARCHIVED", accessScope: "ADMIN_ONLY" }).where(eq(territorialAssets.id, asset.id));
  await appendTerritorialAudit({ actorUserId: input.actorUserId, eventType: "AR_ASSET_ARCHIVED", entityType: "AR_ASSET", entityPublicId: asset.publicId, payload: { status: "ARCHIVED" } });
  return { assetPublicId: asset.publicId, status: "ARCHIVED" as const };
}

export async function getPublishedAsset(objectPublicId: string) {
  const db = await getDb(); if (!db) return null;
  const object = (await db.select({ id: worldObjects.id }).from(worldObjects).where(and(eq(worldObjects.publicId, objectPublicId), eq(worldObjects.status, "PUBLISHED"), eq(worldObjects.publicationStatus, "PUBLISHED"))).limit(1))[0];
  if (!object) return null;
  const assets = await db.select().from(territorialAssets).where(and(eq(territorialAssets.worldObjectId, object.id), eq(territorialAssets.status, "PUBLISHED"), eq(territorialAssets.accessScope, "PUBLISHED_RUNTIME"))).orderBy(desc(territorialAssets.updatedAt));
  return Promise.all(assets.map(async asset => {
    const version = (await db.select().from(territorialAssetVersions).where(and(eq(territorialAssetVersions.assetId, asset.id), eq(territorialAssetVersions.version, asset.publishedVersion ?? 0), eq(territorialAssetVersions.status, "PUBLISHED"))).limit(1))[0];
    return version ? { publicId: asset.publicId, objectPublicId, version: version.version, format: version.format, mimeType: version.mimeType, storageUrl: version.storageUrl, checksum: version.checksum, metadata: parseJson(version.metadataJson, {}) } : null;
  })).then(rows => rows.filter(Boolean));
}

export async function publishAssetsForWorldObject(input: { actorUserId: number; objectPublicId: string; publishedVersion: number }) {
  await requireTerritorialRole(input.actorUserId, ["HUMAN_AUTHORITY"]);
  const db = await getDb(); if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const object = (await db.select({ id: worldObjects.id, status: worldObjects.status, publicationStatus: worldObjects.publicationStatus }).from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1))[0];
  if (!object || object.status !== "PUBLISHED" || object.publicationStatus !== "PUBLISHED") throw new Error("WORLD_OBJECT_NOT_PUBLISHED");
  const assets = await db.select().from(territorialAssets).where(eq(territorialAssets.worldObjectId, object.id));
  for (const asset of assets) {
    const targetVersion = asset.currentVersion;
    const version = (await db.select().from(territorialAssetVersions).where(and(eq(territorialAssetVersions.assetId, asset.id), eq(territorialAssetVersions.version, targetVersion), eq(territorialAssetVersions.status, "VALIDATED"))).limit(1))[0];
    if (!version) continue;
    await db.update(territorialAssetVersions).set({ status: "PUBLISHED" }).where(eq(territorialAssetVersions.id, version.id));
    await db.update(territorialAssets).set({ status: "PUBLISHED", publishedVersion: version.version, accessScope: "PUBLISHED_RUNTIME" }).where(eq(territorialAssets.id, asset.id));
  }
  return getPublishedAsset(input.objectPublicId);
}
