import { randomBytes } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { operationalEvents } from "../drizzle/schema";
import { getDb } from "./db";

export type OperationalEventInput = {
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  actorUserId?: number;
  source: string;
  payload?: Record<string, unknown>;
  version?: number;
  correlationId?: string;
  idempotencyKey: string;
};

export async function appendOperationalEvent(input: OperationalEventInput, dbOverride?: any) {
  const db = dbOverride ?? await getDb();
  if (!db) throw new Error("La base de datos no está disponible para el Event Store.");
  const existing = await db.select().from(operationalEvents).where(eq(operationalEvents.idempotencyKey, input.idempotencyKey)).limit(1);
  if (existing[0]) return { event: existing[0], created: false };
  const publicId = `EVT-${randomBytes(10).toString("hex").toUpperCase()}`;
  await db.insert(operationalEvents).values({
    publicId,
    eventType: input.eventType,
    aggregateType: input.aggregateType,
    aggregateId: input.aggregateId,
    actorUserId: input.actorUserId ?? null,
    source: input.source,
    payloadJson: JSON.stringify(input.payload ?? {}),
    version: input.version ?? 1,
    correlationId: input.correlationId ?? publicId,
    idempotencyKey: input.idempotencyKey,
  });
  const event = (await db.select().from(operationalEvents).where(eq(operationalEvents.publicId, publicId)).limit(1))[0];
  return { event, created: true };
}

export async function listOperationalEvents(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(operationalEvents).orderBy(desc(operationalEvents.createdAt)).limit(Math.min(Math.max(limit, 1), 500));
}
