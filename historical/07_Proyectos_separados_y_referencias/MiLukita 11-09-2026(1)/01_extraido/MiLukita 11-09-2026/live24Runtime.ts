import { desc, eq } from "drizzle-orm";
import { operationalEvents } from "../drizzle/schema";
import { appendOperationalEvent, listOperationalEvents } from "./eventStore";
import { getControlState, runWatchdog } from "./autonomy";
import { runSupervisedSchedulerWorker } from "./supervisedWorker";
import { simulateLive24, type Live24Report } from "../shared/live24";

export type LiveHeartbeatResult = {
  status: "PASS" | "SKIPPED" | "DEGRADED";
  heartbeatId: string;
  idempotent: boolean;
  worker?: unknown;
  reason?: string;
};

export async function runLiveHeartbeat(taskUid?: string, actorUserId?: number, now = new Date(), dbOverride?: any): Promise<LiveHeartbeatResult> {
  const heartbeatId = `live-heartbeat:${Math.floor(now.getTime() / 60_000)}`;
  const db = dbOverride;
  const control = await getControlState(db);
  if (control.mode === "STOPPED") {
    if (db) await appendOperationalEvent({ eventType: "LIVE_HEARTBEAT_BLOCKED", aggregateType: "live_channel", aggregateId: "MILUKITA_LIVE", actorUserId, source: "heartbeat", payload: { heartbeatId, reason: "kill_switch_active", virtualOnly: true }, idempotencyKey: heartbeatId }, db);
    return { status: "SKIPPED", heartbeatId, idempotent: true, reason: "kill_switch_active" };
  }
  if (!db) return { status: "DEGRADED", heartbeatId, idempotent: false, reason: "database_unavailable" };
  const claim = await appendOperationalEvent({ eventType: "LIVE_HEARTBEAT_CLAIMED", aggregateType: "live_channel", aggregateId: "MILUKITA_LIVE", actorUserId, source: "heartbeat", payload: { heartbeatId, taskUid: taskUid ?? null, phase: "CHECK_LOCK_EXECUTE_PERSIST_RELEASE_AUDIT", virtualOnly: true }, idempotencyKey: heartbeatId }, db);
  if (!claim.created) return { status: "SKIPPED", heartbeatId, idempotent: true, reason: "duplicate_heartbeat" };
  try {
    const worker = await runSupervisedSchedulerWorker({ taskUid, actorUserId, now, workerRunId: heartbeatId }, db);
    await appendOperationalEvent({ eventType: "LIVE_HEARTBEAT_COMPLETED", aggregateType: "live_channel", aggregateId: "MILUKITA_LIVE", actorUserId, source: "heartbeat", payload: { heartbeatId, workerStatus: worker.status, virtualOnly: true }, idempotencyKey: `${heartbeatId}:completed` }, db);
    return { status: worker.status === "DEGRADED" ? "DEGRADED" : "PASS", heartbeatId, idempotent: true, worker };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown_error";
    await appendOperationalEvent({ eventType: "LIVE_HEARTBEAT_RECOVERY_REQUIRED", aggregateType: "live_channel", aggregateId: "MILUKITA_LIVE", actorUserId, source: "heartbeat", payload: { heartbeatId, error: detail.slice(0, 255), action: "retry_controlled_and_escalate", virtualOnly: true }, idempotencyKey: `${heartbeatId}:recovery` }, db);
    return { status: "DEGRADED", heartbeatId, idempotent: true, reason: detail };
  }
}

export async function runLiveWatchdog() {
  const result = await runWatchdog();
  return { ...result, scope: "LIVE", authority: "read-alert-recovery-only", virtualOnly: true };
}

export function buildLive24Report(): Live24Report {
  return simulateLive24();
}

export async function getPublicAgentHealth() {
  const heartbeat = await getLiveHeartbeatHealth();
  const events = await listOperationalEvents(100);
  const watchdogEvent = events.find((event) => event.eventType === "WATCHDOG_HEALTH");
  let watchdogPayload: { status?: string; checks?: Array<{ key: string; status: string; message: string }>; checkedAt?: string } = {};
  try { watchdogPayload = watchdogEvent?.payloadJson ? JSON.parse(watchdogEvent.payloadJson) : {}; } catch { watchdogPayload = {}; }
  const auditorEvent = events.find((event) => event.eventType === "AUDITOR_ROUND_COMPLETED");
  return {
    watchdog: { status: (watchdogPayload.status === "CRITICAL" ? "CRITICAL" : watchdogPayload.status === "WARNING" ? "WARNING" : watchdogEvent ? "HEALTHY" : "NOT_REPORTED") as "CRITICAL" | "WARNING" | "HEALTHY" | "NOT_REPORTED", mode: "ALERT_ONLY" as const, checks: watchdogPayload.checks ?? [], checkedAt: watchdogPayload.checkedAt ?? watchdogEvent?.createdAt?.toISOString?.() ?? null },
    auditor: { status: auditorEvent ? "REPORTING" as const : "OBSERVING" as const, mode: "READ_ONLY" as const, lastReportAt: auditorEvent?.createdAt?.toISOString?.() ?? null },
    heartbeat,
    publicOnly: true as const,
  };
}

export async function getLiveHeartbeatHealth() {
  const db = await import("./db").then(({ getDb }) => getDb());
  if (!db) return { status: "DISCONNECTED" as const, controlMode: "DEGRADED", checkedAt: new Date().toISOString(), detail: "database_unavailable" };
  const control = await getControlState(db);
  const latest = (await db.select().from(operationalEvents).where(eq(operationalEvents.eventType, "LIVE_HEARTBEAT_COMPLETED")).orderBy(desc(operationalEvents.createdAt)).limit(1))[0];
  const ageMs = latest?.createdAt ? Date.now() - new Date(latest.createdAt).getTime() : Number.POSITIVE_INFINITY;
  const disconnected = control.mode === "STOPPED" || ageMs > 90_000;
  return {
    status: disconnected ? (control.mode === "STOPPED" ? "STOPPED" as const : "DISCONNECTED" as const) : "CONNECTED" as const,
    controlMode: control.mode,
    checkedAt: new Date().toISOString(),
    lastHeartbeatAt: latest?.createdAt?.toISOString?.() ?? null,
    ageSeconds: Number.isFinite(ageMs) ? Math.max(0, Math.floor(ageMs / 1000)) : null,
    detail: disconnected ? (control.mode === "STOPPED" ? "kill_switch_active" : "heartbeat_stale") : "heartbeat_recent",
  };
}
