import { and, eq, sql } from "drizzle-orm";
import { gameRounds, systemControlState } from "../drizzle/schema";
import { getDb } from "./db";
import { appendOperationalEvent } from "./eventStore";

export type ControlMode = "NORMAL" | "DEGRADED" | "STOPPED" | "MAINTENANCE";

export async function getControlState(dbOverride?: any) {
  const db = dbOverride ?? await getDb();
  if (!db) return { mode: "DEGRADED" as const, reason: "database_unavailable", updatedAt: new Date().toISOString() };
  let row = (await db.select().from(systemControlState).where(eq(systemControlState.id, 1)).limit(1))[0];
  if (!row) {
    await db.insert(systemControlState).values({ id: 1, mode: "NORMAL", reason: "initial_state" });
    row = (await db.select().from(systemControlState).where(eq(systemControlState.id, 1)).limit(1))[0];
  }
  return row;
}

export async function setControlMode(mode: ControlMode, reason: string, actorUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para cambiar el modo operativo.");
  await getControlState();
  await db.update(systemControlState).set({ mode, reason: reason.slice(0, 255), updatedByUserId: actorUserId }).where(eq(systemControlState.id, 1));
  await appendOperationalEvent({ eventType: "HUMAN_OVERRIDE", aggregateType: "system", aggregateId: "MJP", actorUserId, source: "control_center", payload: { mode, reason: reason.slice(0, 255) }, idempotencyKey: `control:${mode}:${actorUserId}:${reason.slice(0, 80)}` });
  return getControlState();
}

export async function runWatchdog() {
  const db = await getDb();
  if (!db) return { status: "CRITICAL" as const, checks: [{ key: "database", status: "CRITICAL", message: "Database unavailable" }] };
  const control = await getControlState();
  const openRounds = await db.select({ count: sql<number>`count(*)` }).from(gameRounds).where(and(eq(gameRounds.state, "open")));
  const checks = [
    { key: "database", status: "PASS" as const, message: "Database reachable" },
    { key: "control_mode", status: control.mode === "NORMAL" ? "PASS" as const : "WARNING" as const, message: `Control mode: ${control.mode}` },
    { key: "open_rounds", status: "PASS" as const, message: `${Number(openRounds[0]?.count ?? 0)} open rounds` },
  ];
  const status = checks.some((check) => check.status === "WARNING") ? "WARNING" : "PASS";
  await appendOperationalEvent({ eventType: "WATCHDOG_HEALTH", aggregateType: "system", aggregateId: "MJP", source: "watchdog", payload: { status, checks }, idempotencyKey: `watchdog:${new Date().toISOString().slice(0, 16)}` });
  return { status, checks, checkedAt: new Date().toISOString() };
}

export async function runSafeAutopilotHeartbeat(actorUserId?: number) {
  const control = await getControlState();
  if (control.mode === "STOPPED") return { status: "BLOCKED" as const, reason: "kill_switch_active" };
  await appendOperationalEvent({ eventType: "AUTOPILOT_ACTION", aggregateType: "system", aggregateId: "MJP", actorUserId, source: "autopilot", payload: { action: "health_check_only", controlMode: control.mode }, idempotencyKey: `autopilot:health:${new Date().toISOString().slice(0, 16)}` });
  return { status: "PASS" as const, action: "health_check_only", controlMode: control.mode };
}
