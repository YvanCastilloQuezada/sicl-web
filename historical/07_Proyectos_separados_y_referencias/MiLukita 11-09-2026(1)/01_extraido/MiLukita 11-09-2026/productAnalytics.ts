import { desc, eq } from "drizzle-orm";
import { productAnalyticsEvents } from "../drizzle/schema";
import { getDb } from "./db";
import { nanoid } from "nanoid";

const DAY = 24 * 60 * 60 * 1000;

export type ProductEventInput = {
  userId?: number;
  anonymousSessionId?: string;
  eventType: "session_started" | "session_returned" | "game_viewed" | "participation_confirmed" | "result_viewed" | "verification_viewed" | "broadcast_viewed" | "secondary_screen_viewed" | "secondary_screen_returned" | "access_mode_selected";
  gameType?: string;
  sessionId?: string;
  source?: "web" | "pwa" | "tv" | "simulator" | "secondary_screen";
  payload?: Record<string, unknown>;
  idempotencyKey: string;
  occurredAt?: Date;
};

export async function recordProductEvent(input: ProductEventInput) {
  const db = await getDb();
  if (!db) return { created: false, skipped: true };
  const existing = await db.select().from(productAnalyticsEvents).where(eq(productAnalyticsEvents.idempotencyKey, input.idempotencyKey)).limit(1);
  if (existing[0]) return { created: false, skipped: false, event: existing[0] };
  const publicId = `AN-${nanoid(16).toUpperCase()}`;
  await db.insert(productAnalyticsEvents).values({
    publicId,
    userId: input.userId ?? null,
    anonymousSessionId: input.anonymousSessionId ?? null,
    eventType: input.eventType,
    gameType: input.gameType ?? null,
    sessionId: input.sessionId ?? null,
    source: input.source ?? "web",
    payloadJson: input.payload ? JSON.stringify(input.payload) : null,
    idempotencyKey: input.idempotencyKey,
    occurredAt: input.occurredAt ?? new Date(),
  });
  const event = (await db.select().from(productAnalyticsEvents).where(eq(productAnalyticsEvents.publicId, publicId)).limit(1))[0];
  return { created: true, skipped: false, event };
}

export async function calculateRetention(windowDays = 30) {
  const db = await getDb();
  if (!db) return { generatedAt: new Date().toISOString(), windowDays, dau: 0, wau: 0, retention1d: null, retention7d: null, retention30d: null, returnRate: null, sessionsPerUser: 0, participationsPerUser: 0, cohorts: [] };
  const rows = await db.select().from(productAnalyticsEvents).orderBy(desc(productAnalyticsEvents.occurredAt)).limit(50_000);
  const cutoff = Date.now() - Math.max(windowDays, 30) * DAY;
  const events = rows.filter((row) => new Date(row.occurredAt).getTime() >= cutoff && row.userId !== null);
  const byUser = new Map<number, Date[]>();
  for (const event of events) {
    const userId = event.userId as number;
    const dates = byUser.get(userId) ?? [];
    dates.push(new Date(event.occurredAt));
    byUser.set(userId, dates);
  }
  const todayKey = new Date().toISOString().slice(0, 10);
  const weekStart = new Date(Date.now() - 6 * DAY).getTime();
  const dau = new Set(events.filter((event) => new Date(event.occurredAt).toISOString().slice(0, 10) === todayKey).map((event) => event.userId)).size;
  const wau = new Set(events.filter((event) => new Date(event.occurredAt).getTime() >= weekStart).map((event) => event.userId)).size;
  const sessions = events.filter((event) => event.eventType === "session_started");
  const participations = events.filter((event) => event.eventType === "participation_confirmed");
  const retention = (days: number) => {
    const cohort = new Set<number>();
    const returned = new Set<number>();
    Array.from(byUser.entries()).forEach(([userId, dates]: [number, Date[]]) => {
      const first = Math.min(...dates.map((date: Date) => date.getTime()));
      cohort.add(userId);
      if (dates.some((date: Date) => date.getTime() >= first + days * DAY && date.getTime() < first + (days + 1) * DAY)) returned.add(userId);
    });
    return cohort.size ? Number((returned.size / cohort.size).toFixed(4)) : null;
  };
  const returningUsers = Array.from(byUser.values()).filter((dates) => new Set(dates.map((date) => date.toISOString().slice(0, 10))).size >= 2).length;
  return {
    generatedAt: new Date().toISOString(),
    windowDays,
    dau,
    wau,
    retention1d: retention(1),
    retention7d: retention(7),
    retention30d: retention(30),
    returnRate: byUser.size ? Number((returningUsers / byUser.size).toFixed(4)) : null,
    sessionsPerUser: byUser.size ? Number((sessions.length / byUser.size).toFixed(2)) : 0,
    participationsPerUser: byUser.size ? Number((participations.length / byUser.size).toFixed(2)) : 0,
    cohorts: Array.from(byUser.entries()).slice(0, 100).map(([userId, dates]: [number, Date[]]) => ({ userId, firstSeenAt: new Date(Math.min(...dates.map((date: Date) => date.getTime()))).toISOString(), eventCount: dates.length })),
  };
}
