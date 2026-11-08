/**
 * SICL Web — persistencia SQLite única (F1b).
 *
 * Driver: better-sqlite3 (síncrono), sin drizzle, sin MySQL.
 * DB:     data/memory/sicl.db (configurable vía SICL_WEB_DB_PATH).
 * Fechas: epoch ms (integer). Booleanos: 0/1.
 *
 * Mantiene exactamente las firmas públicas previas para no romper
 * consumidores (routers.ts, sdk.ts, oauth.ts, arkiMo08LocalAuth.ts,
 * arkiMo22Bridge.ts, continuityApi.ts, router.core-delegation.test.ts).
 *
 * NO toca arkiIdentity/ (usa identity.sqlite propio).
 * NO usa DATABASE_URL. NO usa mysql2.
 */
import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  ArkiCommandSession,
  FederatedAssistantHandoff,
  InsertArkiCommandSession,
  InsertFederatedAssistantHandoff,
  InsertUser,
  SiclProject,
  InsertSiclProject,
  ParametricFile,
  InsertParametricFile,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { canArchiveParametricFile } from "./parametric/archiveAuthorization";

// ---------- conexión singleton ----------

let _db: Database.Database | null = null;

function dbPath(): string {
  const raw = process.env.SICL_WEB_DB_PATH
    || resolve(process.cwd(), "data/memory/sicl.db");
  const abs = resolve(raw);
  mkdirSync(dirname(abs), { recursive: true });
  return abs;
}

function migrationSql(): string {
  return readFileSync(
    resolve(process.cwd(), "drizzle/sqlite/migrations/0003_db_persistence.sql"),
    "utf8",
  );
}

function getHandle(): Database.Database {
  if (_db) return _db;
  const path = dbPath();
  _db = new Database(path);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  _db.exec(migrationSql());
  return _db;
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

/** Compatibilidad: consumidores llaman `await getDb()`. Síncrono por dentro. */
export async function getDb(): Promise<Database.Database> {
  return getHandle();
}

// ---------- helpers de mapeo integer <-> Date ----------

function toDate(v: unknown): Date {
  if (v instanceof Date) return v;
  if (typeof v === "number") return new Date(v);
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return new Date(n);
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date(0);
}

function toMs(d: unknown): number {
  if (d instanceof Date) return d.getTime();
  if (typeof d === "number") return d;
  if (typeof d === "string") {
    const n = Number(d);
    if (Number.isFinite(n)) return n;
    const dt = new Date(d);
    if (!Number.isNaN(dt.getTime())) return dt.getTime();
  }
  return Date.now();
}

// ---------- fila cruda -> tipo de dominio ----------

type ProjectRow = {
  id: number; ownerId: number; projectId: string; name: string;
  location: string | null; status: string; version: number; snapshot: string;
  createdAt: number; updatedAt: number;
};

function projectFromRow(r: ProjectRow): SiclProject {
  return {
    ...r,
    location: r.location,
    status: r.status as SiclProject["status"],
    createdAt: toDate(r.createdAt),
    updatedAt: toDate(r.updatedAt),
  } as SiclProject;
}

type ParametricRow = {
  id: number; ownerId: number; projectId: string; artifactId: string;
  fileName: string; format: string; sizeBytes: number; checksum: string;
  parsed: number; declaredDependencies: string; capabilities: string;
  hostRequired: string | null; status: string; storageKey: string; storageUrl: string;
  humanReviewRequired: number; uploadedAt: number; createdAt: number; updatedAt: number;
};

function parametricFromRow(r: ParametricRow): ParametricFile {
  return {
    ...r,
    status: r.status as ParametricFile["status"],
    humanReviewRequired: r.humanReviewRequired,
    uploadedAt: toDate(r.uploadedAt),
    createdAt: toDate(r.createdAt),
    updatedAt: toDate(r.updatedAt),
  } as ParametricFile;
}

type SessionRow = {
  id: number; ownerId: number; projectId: string; sessionId: string;
  commandName: string; parameters: string; previewResult: string;
  tutorialStep: number; exerciseScore: number | null;
  exerciseState: string; lastAction: string; createdAt: number; updatedAt: number;
};

function sessionFromRow(r: SessionRow): ArkiCommandSession {
  return {
    ...r,
    exerciseState: r.exerciseState as ArkiCommandSession["exerciseState"],
    lastAction: r.lastAction as ArkiCommandSession["lastAction"],
    createdAt: toDate(r.createdAt),
    updatedAt: toDate(r.updatedAt),
  } as ArkiCommandSession;
}

type HandoffRow = {
  id: number; handoffId: string; ownerId: number;
  sourceProduct: string; targetProduct: string;
  sourceAssistantId: string; targetAssistantId: string | null;
  request: string; status: string; sourceCommit: string;
  evidenceJson: string; traceJson: string; reviewNote: string | null;
  reviewerOpenId: string | null; reviewedAt: number | null;
  createdAt: number; updatedAt: number;
};

function handoffFromRow(r: HandoffRow): FederatedAssistantHandoff {
  return {
    ...r,
    status: r.status as FederatedAssistantHandoff["status"],
    reviewedAt: r.reviewedAt == null ? null : toDate(r.reviewedAt),
    createdAt: toDate(r.createdAt),
    updatedAt: toDate(r.updatedAt),
  } as FederatedAssistantHandoff;
}

// ---------- seed UPAO-001 ----------

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

function hasFixtureData(project: { snapshot: string }): boolean {
  try {
    const value = JSON.parse(project.snapshot) as { sources?: unknown[]; objectives?: unknown[]; alternatives?: unknown[] };
    return Boolean(value.sources?.length && value.objectives?.length && value.alternatives?.length);
  } catch {
    return false;
  }
}

function seedUpao(ownerId: number): SiclProject {
  const db = getHandle();
  const now = Date.now();
  const snapshot = upaoSnapshot();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO sicl_projects
      (ownerId, projectId, name, location, status, version, snapshot, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run(ownerId, "UPAO-001", "UPAO-001 · Plaza Center", "Trujillo · 2000 m² · FAR 5.0", "ACTIVE", 1, snapshot, now, now);
  const row = db.prepare(`SELECT * FROM sicl_projects WHERE projectId = ? LIMIT 1`).get("UPAO-001") as ProjectRow | undefined;
  if (!row) throw new Error("UPAO-001 could not be seeded");
  return projectFromRow(row);
}

// ---------- users ----------

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = getHandle();
  const now = Date.now();
  const existing = db.prepare(`SELECT id FROM users WHERE openId = ? LIMIT 1`).get(user.openId) as { id: number } | undefined;
  const role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  const lastSignedIn = user.lastSignedIn ? toMs(user.lastSignedIn) : now;
  if (existing) {
    db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        loginMethod = COALESCE(?, loginMethod),
        role = ?,
        lastSignedIn = ?,
        updatedAt = ?
      WHERE openId = ?
    `).run(
      user.name ?? null,
      user.email ?? null,
      user.loginMethod ?? null,
      role,
      lastSignedIn,
      now,
      user.openId,
    );
    return;
  }
  db.prepare(`
    INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    user.openId,
    user.name ?? null,
    user.email ?? null,
    user.loginMethod ?? null,
    role,
    now,
    now,
    lastSignedIn,
  );
}

export async function getUserByOpenId(
  openId: string,
): Promise<
  | {
      id: number;
      openId: string;
      name: string | null;
      email: string | null;
      loginMethod: string | null;
      role: "user" | "admin";
      createdAt: Date;
      updatedAt: Date;
      lastSignedIn: Date;
    }
  | undefined
> {
  const db = getHandle();
  const row = db.prepare(`SELECT * FROM users WHERE openId = ? LIMIT 1`).get(openId) as
    | { id: number; openId: string; name: string | null; email: string | null; loginMethod: string | null; role: string; createdAt: number; updatedAt: number; lastSignedIn: number }
    | undefined;
  if (!row) return undefined;
  const role: "user" | "admin" = row.role === "admin" ? "admin" : "user";
  return {
    id: row.id,
    openId: row.openId,
    name: row.name,
    email: row.email,
    loginMethod: row.loginMethod,
    role,
    createdAt: toDate(row.createdAt),
    updatedAt: toDate(row.updatedAt),
    lastSignedIn: toDate(row.lastSignedIn),
  };
}

// ---------- sicl_projects ----------

export async function listSiclProjects(ownerId: number): Promise<SiclProject[]> {
  const db = getHandle();
  const rows = db.prepare(`SELECT * FROM sicl_projects WHERE ownerId = ? ORDER BY updatedAt DESC`).all(ownerId) as ProjectRow[];
  if (!rows.length) return [seedUpao(ownerId)];
  const fixture = rows.find((r) => r.projectId === "UPAO-001");
  if (fixture && !hasFixtureData(fixture)) {
    const seeded = seedUpao(ownerId);
    return rows.map((r) => (r.projectId === "UPAO-001" ? seeded : projectFromRow(r)));
  }
  return rows.map(projectFromRow);
}

export async function getSiclProject(ownerId: number, projectId: string): Promise<SiclProject | undefined> {
  const db = getHandle();
  const row = db.prepare(`SELECT * FROM sicl_projects WHERE ownerId = ? AND projectId = ? LIMIT 1`).get(ownerId, projectId) as ProjectRow | undefined;
  if (row && projectId === "UPAO-001" && !hasFixtureData(row)) {
    return seedUpao(ownerId);
  }
  return row ? projectFromRow(row) : (projectId === "UPAO-001" ? seedUpao(ownerId) : undefined);
}

export async function insertSiclProject(project: InsertSiclProject): Promise<void> {
  const db = getHandle();
  const now = Date.now();
  db.prepare(`
    INSERT INTO sicl_projects (ownerId, projectId, name, location, status, version, snapshot, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    project.ownerId,
    project.projectId,
    project.name,
    project.location ?? null,
    project.status ?? "DRAFT",
    project.version ?? 1,
    project.snapshot,
    now,
    now,
  );
}

export async function updateSiclProject(
  ownerId: number,
  projectId: string,
  expectedVersion: number,
  snapshot: string,
  status?: SiclProject["status"],
): Promise<boolean> {
  const db = getHandle();
  const now = Date.now();
  const result = status
    ? db.prepare(`
        UPDATE sicl_projects
           SET snapshot = ?, version = version + 1, status = ?, updatedAt = ?
         WHERE ownerId = ? AND projectId = ? AND version = ?
      `).run(snapshot, status, now, ownerId, projectId, expectedVersion)
    : db.prepare(`
        UPDATE sicl_projects
           SET snapshot = ?, version = version + 1, updatedAt = ?
         WHERE ownerId = ? AND projectId = ? AND version = ?
      `).run(snapshot, now, ownerId, projectId, expectedVersion);
  return result.changes === 1;
}

// ---------- parametric_files ----------

export async function insertParametricFile(file: InsertParametricFile): Promise<ParametricFile> {
  const db = getHandle();
  const now = Date.now();
  const exists = db.prepare(`SELECT id FROM parametric_files WHERE artifactId = ? LIMIT 1`).get(file.artifactId);
  if (exists) throw new Error("Parametric artifactId must be globally unique");
  db.prepare(`
    INSERT INTO parametric_files (
      ownerId, projectId, artifactId, fileName, format, sizeBytes, checksum,
      parsed, declaredDependencies, capabilities, hostRequired, status,
      storageKey, storageUrl, humanReviewRequired, uploadedAt, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    file.ownerId,
    file.projectId,
    file.artifactId,
    file.fileName,
    file.format,
    file.sizeBytes,
    file.checksum,
    file.parsed ?? 0,
    file.declaredDependencies,
    file.capabilities,
    file.hostRequired ?? null,
    file.status,
    file.storageKey,
    file.storageUrl,
    file.humanReviewRequired ?? 1,
    file.uploadedAt ? toMs(file.uploadedAt) : now,
    file.createdAt ? toMs(file.createdAt) : now,
    file.updatedAt ? toMs(file.updatedAt) : now,
  );
  const row = db.prepare(`SELECT * FROM parametric_files WHERE artifactId = ? LIMIT 1`).get(file.artifactId) as ParametricRow | undefined;
  if (!row) throw new Error("Parametric file could not be persisted");
  return parametricFromRow(row);
}

export async function listParametricFiles(ownerId: number, projectId: string): Promise<ParametricFile[]> {
  const db = getHandle();
  const rows = db.prepare(`
    SELECT * FROM parametric_files
     WHERE ownerId = ? AND projectId = ? AND status != 'ARCHIVED'
     ORDER BY updatedAt DESC
  `).all(ownerId, projectId) as ParametricRow[];
  return rows.map(parametricFromRow);
}

export async function archiveParametricFile(ownerId: number, projectId: string, artifactId: string): Promise<boolean> {
  const db = getHandle();
  const current = db.prepare(`SELECT * FROM parametric_files WHERE artifactId = ? LIMIT 1`).get(artifactId) as ParametricRow | undefined;
  const domain = current ? parametricFromRow(current) : undefined;
  if (!canArchiveParametricFile(domain, ownerId, projectId)) return false;
  const now = Date.now();
  const result = db.prepare(`
    UPDATE parametric_files
       SET status = 'ARCHIVED', updatedAt = ?
     WHERE ownerId = ? AND projectId = ? AND artifactId = ?
  `).run(now, ownerId, projectId, artifactId);
  return result.changes === 1;
}

// ---------- arki_command_sessions ----------

export async function saveArkiCommandSession(session: InsertArkiCommandSession): Promise<ArkiCommandSession> {
  const db = getHandle();
  const now = Date.now();
  const existing = db.prepare(`
    SELECT * FROM arki_command_sessions WHERE ownerId = ? AND sessionId = ? LIMIT 1
  `).get(session.ownerId, session.sessionId) as SessionRow | undefined;
  if (existing) {
    db.prepare(`
      UPDATE arki_command_sessions SET
        commandName = ?,
        parameters = ?,
        previewResult = ?,
        tutorialStep = ?,
        exerciseScore = ?,
        exerciseState = ?,
        lastAction = ?,
        updatedAt = ?
      WHERE ownerId = ? AND sessionId = ?
    `).run(
      session.commandName,
      session.parameters,
      session.previewResult,
      session.tutorialStep ?? 0,
      session.exerciseScore ?? null,
      session.exerciseState ?? "IN_PROGRESS",
      session.lastAction ?? "AUTOSAVE",
      now,
      session.ownerId,
      session.sessionId,
    );
  } else {
    db.prepare(`
      INSERT INTO arki_command_sessions (
        ownerId, projectId, sessionId, commandName, parameters, previewResult,
        tutorialStep, exerciseScore, exerciseState, lastAction, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      session.ownerId,
      session.projectId,
      session.sessionId,
      session.commandName,
      session.parameters,
      session.previewResult,
      session.tutorialStep ?? 0,
      session.exerciseScore ?? null,
      session.exerciseState ?? "IN_PROGRESS",
      session.lastAction ?? "AUTOSAVE",
      now,
      now,
    );
  }
  const row = db.prepare(`
    SELECT * FROM arki_command_sessions WHERE ownerId = ? AND sessionId = ? LIMIT 1
  `).get(session.ownerId, session.sessionId) as SessionRow | undefined;
  if (!row) throw new Error("ARKI command session could not be persisted");
  return sessionFromRow(row);
}

export async function listArkiCommandSessions(ownerId: number, projectId: string): Promise<ArkiCommandSession[]> {
  const db = getHandle();
  const rows = db.prepare(`
    SELECT * FROM arki_command_sessions
     WHERE ownerId = ? AND projectId = ?
     ORDER BY updatedAt DESC
  `).all(ownerId, projectId) as SessionRow[];
  return rows.map(sessionFromRow);
}

// ---------- federated_assistant_handoffs ----------

export async function insertFederatedAssistantHandoff(
  input: Omit<InsertFederatedAssistantHandoff, "handoffId"> & { handoffId?: string },
): Promise<FederatedAssistantHandoff> {
  const handoffId = input.handoffId ?? `ARLU-${randomUUID().replaceAll("-", "").slice(0, 24).toUpperCase()}`;
  const db = getHandle();
  const now = Date.now();
  db.prepare(`
    INSERT INTO federated_assistant_handoffs (
      handoffId, ownerId, sourceProduct, targetProduct,
      sourceAssistantId, targetAssistantId, request, status,
      sourceCommit, evidenceJson, traceJson, reviewNote, reviewerOpenId,
      reviewedAt, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    handoffId,
    input.ownerId,
    input.sourceProduct,
    input.targetProduct,
    input.sourceAssistantId,
    input.targetAssistantId ?? null,
    input.request,
    input.status ?? "CANDIDATE",
    input.sourceCommit,
    input.evidenceJson,
    input.traceJson,
    input.reviewNote ?? null,
    input.reviewerOpenId ?? null,
    input.reviewedAt ? toMs(input.reviewedAt) : null,
    now,
    now,
  );
  const row = db.prepare(`SELECT * FROM federated_assistant_handoffs WHERE handoffId = ? LIMIT 1`).get(handoffId) as HandoffRow | undefined;
  if (!row) throw new Error("Federated assistant handoff could not be persisted");
  return handoffFromRow(row);
}

export async function listFederatedAssistantHandoffs(
  ownerId: number,
  status?: FederatedAssistantHandoff["status"],
): Promise<FederatedAssistantHandoff[]> {
  const db = getHandle();
  const rows = status
    ? (db.prepare(`
        SELECT * FROM federated_assistant_handoffs
         WHERE ownerId = ? AND status = ?
         ORDER BY createdAt DESC
      `).all(ownerId, status) as HandoffRow[])
    : (db.prepare(`
        SELECT * FROM federated_assistant_handoffs
         WHERE ownerId = ?
         ORDER BY createdAt DESC
      `).all(ownerId) as HandoffRow[]);
  return rows.map(handoffFromRow);
}

export async function reviewFederatedAssistantHandoff(
  ownerId: number,
  handoffId: string,
  status: Extract<FederatedAssistantHandoff["status"], "APPROVED" | "REJECTED" | "FROZEN">,
  reviewerOpenId: string,
  reviewNote: string,
): Promise<boolean> {
  const db = getHandle();
  const now = Date.now();
  const result = db.prepare(`
    UPDATE federated_assistant_handoffs
       SET status = ?, reviewerOpenId = ?, reviewNote = ?, reviewedAt = ?, updatedAt = ?
     WHERE ownerId = ? AND handoffId = ? AND status = 'HUMAN_REVIEW'
  `).run(status, reviewerOpenId, reviewNote, now, now, ownerId, handoffId);
  return result.changes === 1;
}
