import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { randomUUID } from "node:crypto";
import { ArkiCommandSession, FederatedAssistantHandoff, InsertArkiCommandSession, InsertFederatedAssistantHandoff, InsertUser, SiclProject, InsertSiclProject, ParametricFile, InsertParametricFile, arkiCommandSessions, federatedAssistantHandoffs, parametricFiles, siclProjects, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
const memoryProjects = new Map<string, SiclProject>();
const memoryParametricFiles = new Map<string, ParametricFile>();
const memoryCommandSessions = new Map<string, ArkiCommandSession>();
const memoryFederatedHandoffs = new Map<string, FederatedAssistantHandoff>();

function upaoSnapshot() {
  return JSON.stringify({
    sources: [{ id: "SRC-UPAO-001", name: "UPAO site brief", statement: "Synthetic fixture for UPAO-001", provenance: ["UPAO-001"] }],
    evidence: [{ id: "EVD-UPAO-001", name: "Site and program evidence", statement: "Trujillo site, 2000 m², FAR 5.0", sourceId: "SRC-UPAO-001" }],
    requirements: [{ id: "REQ-UPAO-001", name: "Program and site fit", statement: "Fit the synthetic UPAO-001 brief" }],
    objectives: [{ id: "OBJ-COST", name: "Declared cost", requirementId: "REQ-UPAO-001", direction: "MINIMIZE" }, { id: "OBJ-QUALITY", name: "Spatial quality", requirementId: "REQ-UPAO-001", direction: "MAXIMIZE" }],
    constraints: [{ id: "CON-FAR", name: "FAR limit", metric: "far", operator: "LE", threshold: 5, requirementId: "REQ-UPAO-001" }],
    preferences: [],
    alternatives: [{ id: "ALT-A", name: "Courtyard compact", data: { far: 4.8 } }, { id: "ALT-B", name: "Open campus", data: { far: 4.2 } }],
    evaluations: [{ id: "EVAL-A-COST", name: "Cost A", alternativeId: "ALT-A", objectiveId: "OBJ-COST", criterion: "COST", value: 850000, unit: "USD", method: "DECLARED_RESULT", inputs: [{ value: 850000 }], provenance: ["EVD-UPAO-001"], feasibilityStatus: "UNKNOWN" }, { id: "EVAL-B-COST", name: "Cost B", alternativeId: "ALT-B", objectiveId: "OBJ-COST", criterion: "COST", value: 920000, unit: "USD", method: "DECLARED_RESULT", inputs: [{ value: 920000 }], provenance: ["EVD-UPAO-001"], feasibilityStatus: "UNKNOWN" }],
    comparisons: [{ id: "CMP-UPAO-COST", name: "Cost comparison", objectiveId: "OBJ-COST", direction: "MINIMIZE", evaluationIds: ["EVAL-A-COST", "EVAL-B-COST"], comparisonKind: "BINARY", feasibilityStatus: "UNKNOWN", winner: "ALT-A" }],
    multiComparisons: [], decisionConditions: [], recommendations: [], humanReviews: [], decisions: [],
    events: [{ id: "EVT-UPAO-001", type: "PROJECT_CREATED", entityId: "UPAO-001", actorId: 1, createdAt: new Date().toISOString(), data: { fixture: true } }],
    spatialScope: { scale: "PROJECT", id: "UPAO-001", name: "Trujillo · UPAO-001" }, temporalScope: { horizon: "PRESENT" },
  });
}

function hasFixtureData(project: Pick<SiclProject, "snapshot">) {
  try {
    const value = JSON.parse(project.snapshot) as { sources?: unknown[]; objectives?: unknown[]; alternatives?: unknown[] };
    return Boolean(value.sources?.length && value.objectives?.length && value.alternatives?.length);
  } catch {
    return false;
  }
}

async function seedUpao(ownerId: number): Promise<SiclProject> {
  const now = new Date();
  const project = { id: 0, ownerId, projectId: "UPAO-001", name: "UPAO-001 · Plaza Center", location: "Trujillo · 2000 m² · FAR 5.0", status: "ACTIVE" as const, version: 1, snapshot: upaoSnapshot(), createdAt: now, updatedAt: now } as SiclProject;
  const db = await getDb();
  if (db) { try { await db.insert(siclProjects).values({ ownerId, projectId: project.projectId, name: project.name, location: project.location, status: project.status, version: project.version, snapshot: project.snapshot }); } catch { /* another request seeded it */ } }
  memoryProjects.set(`${ownerId}:${project.projectId}`, project);
  return project;
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = values[field]; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listSiclProjects(ownerId: number): Promise<SiclProject[]> {
  const db = await getDb();
  if (!db) { const all = Array.from(memoryProjects.values()); if (!all.some((p) => p.ownerId === ownerId)) await seedUpao(ownerId); return Array.from(memoryProjects.values()).filter((p) => p.ownerId === ownerId); }
  const rows = await db.select().from(siclProjects).where(eq(siclProjects.ownerId, ownerId)).orderBy(desc(siclProjects.updatedAt));
  if (!rows.length) return [await seedUpao(ownerId)];
  const fixture = rows.find((row) => row.projectId === "UPAO-001");
  if (fixture && !hasFixtureData(fixture)) {
    const seeded = await seedUpao(ownerId);
    await db.update(siclProjects).set({ name: seeded.name, location: seeded.location, status: seeded.status, version: seeded.version, snapshot: seeded.snapshot }).where(and(eq(siclProjects.ownerId, ownerId), eq(siclProjects.projectId, "UPAO-001")));
    return rows.map((row) => row.projectId === "UPAO-001" ? seeded : row);
  }
  return rows;
}

export async function getSiclProject(ownerId: number, projectId: string): Promise<SiclProject | undefined> {
  const db = await getDb();
  if (!db) { const existing = memoryProjects.get(`${ownerId}:${projectId}`); return existing ?? (projectId === "UPAO-001" ? seedUpao(ownerId) : undefined); }
  const result = await db.select().from(siclProjects).where(and(eq(siclProjects.ownerId, ownerId), eq(siclProjects.projectId, projectId))).limit(1);
  if (result[0] && projectId === "UPAO-001" && !hasFixtureData(result[0])) {
    const seeded = await seedUpao(ownerId);
    await db.update(siclProjects).set({ name: seeded.name, location: seeded.location, status: seeded.status, version: seeded.version, snapshot: seeded.snapshot }).where(and(eq(siclProjects.ownerId, ownerId), eq(siclProjects.projectId, projectId)));
    return seeded;
  }
  return result[0] ?? (projectId === "UPAO-001" ? seedUpao(ownerId) : undefined);
}

export async function insertSiclProject(project: InsertSiclProject): Promise<void> {
  const db = await getDb();
  if (!db) { const now = new Date(); memoryProjects.set(`${project.ownerId}:${project.projectId}`, { id: 0, createdAt: now, updatedAt: now, ...project } as SiclProject); return; }
  await db.insert(siclProjects).values(project);
}

export async function updateSiclProject(ownerId: number, projectId: string, expectedVersion: number, snapshot: string, status?: SiclProject["status"]): Promise<boolean> {
  const db = await getDb();
  if (!db) { const current = memoryProjects.get(`${ownerId}:${projectId}`); if (!current || current.version !== expectedVersion) return false; memoryProjects.set(`${ownerId}:${projectId}`, { ...current, snapshot, version: expectedVersion + 1, ...(status ? { status } : {}), updatedAt: new Date() }); return true; }
  const result = await db.update(siclProjects).set({ snapshot, version: expectedVersion + 1, ...(status ? { status } : {}) }).where(and(eq(siclProjects.ownerId, ownerId), eq(siclProjects.projectId, projectId), eq(siclProjects.version, expectedVersion)));
  return result[0].affectedRows === 1;
}

export async function insertParametricFile(file: InsertParametricFile): Promise<ParametricFile> {
  const db = await getDb();
  const now = new Date();
  if (!db) {
    const stored = { id: 0, createdAt: now, updatedAt: now, uploadedAt: now, ...file } as ParametricFile;
    memoryParametricFiles.set(`${file.ownerId}:${file.artifactId}`, stored);
    return stored;
  }
  await db.insert(parametricFiles).values(file);
  const rows = await db.select().from(parametricFiles).where(eq(parametricFiles.artifactId, file.artifactId)).limit(1);
  if (!rows[0]) throw new Error("Parametric file could not be persisted");
  return rows[0];
}

export async function listParametricFiles(ownerId: number, projectId: string): Promise<ParametricFile[]> {
  const db = await getDb();
  if (!db) return Array.from(memoryParametricFiles.values()).filter((file) => file.ownerId === ownerId && file.projectId === projectId && file.status !== "ARCHIVED").sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  return db.select().from(parametricFiles).where(and(eq(parametricFiles.ownerId, ownerId), eq(parametricFiles.projectId, projectId))).orderBy(desc(parametricFiles.updatedAt));
}

export async function archiveParametricFile(ownerId: number, projectId: string, artifactId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    const key = `${ownerId}:${artifactId}`;
    const current = memoryParametricFiles.get(key);
    if (!current || current.projectId !== projectId) return false;
    memoryParametricFiles.set(key, { ...current, status: "ARCHIVED", updatedAt: new Date() });
    return true;
  }
  const result = await db.update(parametricFiles).set({ status: "ARCHIVED" }).where(and(eq(parametricFiles.ownerId, ownerId), eq(parametricFiles.projectId, projectId), eq(parametricFiles.artifactId, artifactId)));
  return result[0].affectedRows === 1;
}

export async function saveArkiCommandSession(session: InsertArkiCommandSession): Promise<ArkiCommandSession> {
  const db = await getDb();
  const now = new Date();
  if (!db) {
    const existing = memoryCommandSessions.get(`${session.ownerId}:${session.sessionId}`);
    const stored = { id: existing?.id ?? 0, createdAt: existing?.createdAt ?? now, updatedAt: now, ...existing, ...session } as ArkiCommandSession;
    memoryCommandSessions.set(`${session.ownerId}:${session.sessionId}`, stored);
    return stored;
  }
  await db.insert(arkiCommandSessions).values(session).onDuplicateKeyUpdate({ set: { commandName: session.commandName, parameters: session.parameters, previewResult: session.previewResult, tutorialStep: session.tutorialStep, exerciseScore: session.exerciseScore, exerciseState: session.exerciseState, lastAction: session.lastAction } });
  const rows = await db.select().from(arkiCommandSessions).where(and(eq(arkiCommandSessions.ownerId, session.ownerId), eq(arkiCommandSessions.sessionId, session.sessionId))).limit(1);
  if (!rows[0]) throw new Error("ARKI command session could not be persisted");
  return rows[0];
}

export async function listArkiCommandSessions(ownerId: number, projectId: string): Promise<ArkiCommandSession[]> {
  const db = await getDb();
  if (!db) return Array.from(memoryCommandSessions.values()).filter((session) => session.ownerId === ownerId && session.projectId === projectId).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  return db.select().from(arkiCommandSessions).where(and(eq(arkiCommandSessions.ownerId, ownerId), eq(arkiCommandSessions.projectId, projectId))).orderBy(desc(arkiCommandSessions.updatedAt));
}

export async function insertFederatedAssistantHandoff(input: Omit<InsertFederatedAssistantHandoff, "handoffId"> & { handoffId?: string }): Promise<FederatedAssistantHandoff> {
  const handoffId = input.handoffId ?? `ARLU-${randomUUID().replaceAll("-", "").slice(0, 24).toUpperCase()}`;
  const values = { ...input, handoffId } as InsertFederatedAssistantHandoff;
  const db = await getDb();
  const now = new Date();
  if (!db) {
    const stored = { id: 0, createdAt: now, updatedAt: now, ...values } as FederatedAssistantHandoff;
    memoryFederatedHandoffs.set(handoffId, stored);
    return stored;
  }
  await db.insert(federatedAssistantHandoffs).values(values);
  const rows = await db.select().from(federatedAssistantHandoffs).where(eq(federatedAssistantHandoffs.handoffId, handoffId)).limit(1);
  if (!rows[0]) throw new Error("Federated assistant handoff could not be persisted");
  return rows[0];
}

export async function listFederatedAssistantHandoffs(ownerId: number, status?: FederatedAssistantHandoff["status"]): Promise<FederatedAssistantHandoff[]> {
  const db = await getDb();
  if (!db) return Array.from(memoryFederatedHandoffs.values()).filter((handoff) => handoff.ownerId === ownerId && (!status || handoff.status === status)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const conditions = status ? and(eq(federatedAssistantHandoffs.ownerId, ownerId), eq(federatedAssistantHandoffs.status, status)) : eq(federatedAssistantHandoffs.ownerId, ownerId);
  return db.select().from(federatedAssistantHandoffs).where(conditions).orderBy(desc(federatedAssistantHandoffs.createdAt));
}

export async function reviewFederatedAssistantHandoff(ownerId: number, handoffId: string, status: Extract<FederatedAssistantHandoff["status"], "APPROVED" | "REJECTED" | "FROZEN">, reviewerOpenId: string, reviewNote: string): Promise<boolean> {
  const db = await getDb();
  const reviewedAt = new Date();
  if (!db) {
    const current = memoryFederatedHandoffs.get(handoffId);
    if (!current || current.ownerId !== ownerId || current.status === "APPROVED") return false;
    memoryFederatedHandoffs.set(handoffId, { ...current, status, reviewerOpenId, reviewNote, reviewedAt, updatedAt: reviewedAt });
    return true;
  }
  const result = await db.update(federatedAssistantHandoffs).set({ status, reviewerOpenId, reviewNote, reviewedAt }).where(and(eq(federatedAssistantHandoffs.ownerId, ownerId), eq(federatedAssistantHandoffs.handoffId, handoffId), eq(federatedAssistantHandoffs.status, "HUMAN_REVIEW")));
  return result[0].affectedRows === 1;
}
