import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, SiclProject, InsertSiclProject, siclProjects, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

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
  if (!db) return [];
  return db.select().from(siclProjects).where(eq(siclProjects.ownerId, ownerId)).orderBy(desc(siclProjects.updatedAt));
}

export async function getSiclProject(ownerId: number, projectId: string): Promise<SiclProject | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siclProjects).where(and(eq(siclProjects.ownerId, ownerId), eq(siclProjects.projectId, projectId))).limit(1);
  return result[0];
}

export async function insertSiclProject(project: InsertSiclProject): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(siclProjects).values(project);
}

export async function updateSiclProject(ownerId: number, projectId: string, expectedVersion: number, snapshot: string, status?: SiclProject["status"]): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.update(siclProjects).set({ snapshot, version: expectedVersion + 1, ...(status ? { status } : {}) }).where(and(eq(siclProjects.ownerId, ownerId), eq(siclProjects.projectId, projectId), eq(siclProjects.version, expectedVersion)));
  return result[0].affectedRows === 1;
}
