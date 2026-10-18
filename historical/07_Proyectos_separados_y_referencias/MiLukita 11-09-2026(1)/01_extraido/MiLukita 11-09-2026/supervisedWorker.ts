import { eq } from "drizzle-orm";
import { gameSchedules } from "../drizzle/schema";
import { getDb } from "./db";
import { appendOperationalEvent } from "./eventStore";
import { getControlState } from "./autonomy";
import { runScheduledGameCycle } from "./pilot";

export const SUPERVISED_WORKER_BUCKET_MINUTES = 1;
export const SUPERVISED_WORKER_WINDOW_HOURS = 24;

type WorkerInput = {
  taskUid?: string;
  actorUserId?: number;
  now?: Date;
  workerRunId?: string;
};

export type WorkerCycleResult = {
  taskUid: string;
  status: "PASS" | "SKIPPED" | "DEGRADED";
  result?: unknown;
  reason?: string;
};

export function getWorkerBucket(now: Date): number {
  return Math.floor(now.getTime() / (SUPERVISED_WORKER_BUCKET_MINUTES * 60_000));
}

export function buildWorkerClaimKey(taskUid: string, now: Date): string {
  return `supervised-worker:${taskUid}:${getWorkerBucket(now)}`;
}

export function isDuplicateClaimError(error: unknown): boolean {
  const text = error instanceof Error ? error.message : String(error);
  return /duplicate|unique|1062/i.test(text);
}

async function claimWorkerCycle(taskUid: string, now: Date, db: any) {
  const idempotencyKey = buildWorkerClaimKey(taskUid, now);
  try {
    const claim = await appendOperationalEvent({
      eventType: "SCHEDULER_WORKER_CLAIMED",
      aggregateType: "scheduler",
      aggregateId: taskUid,
      source: "supervised_worker",
      payload: { taskUid, bucket: getWorkerBucket(now), windowHours: SUPERVISED_WORKER_WINDOW_HOURS, pilotOnly: true },
      idempotencyKey,
    }, db);
    return { claimed: claim.created, idempotencyKey };
  } catch (error) {
    if (isDuplicateClaimError(error)) return { claimed: false, idempotencyKey };
    throw error;
  }
}

export async function runSupervisedSchedulerWorker(input: WorkerInput = {}, dbOverride?: any) {
  const db = dbOverride ?? await getDb();
  const now = input.now ?? new Date();
  const workerRunId = input.workerRunId ?? `worker-${getWorkerBucket(now)}`;
  if (!db) return { status: "DEGRADED" as const, workerRunId, reason: "database_unavailable", cycles: [] as WorkerCycleResult[] };

  const control = await getControlState(db);
  if (control.mode === "STOPPED") {
    await appendOperationalEvent({ eventType: "SCHEDULER_WORKER_BLOCKED", aggregateType: "scheduler", aggregateId: workerRunId, source: "supervised_worker", payload: { reason: "kill_switch_active", pilotOnly: true }, idempotencyKey: `supervised-worker-blocked:${workerRunId}` }, db);
    return { status: "SKIPPED" as const, workerRunId, reason: "kill_switch_active", cycles: [] as WorkerCycleResult[] };
  }

  const schedules = input.taskUid
    ? await db.select().from(gameSchedules).where(eq(gameSchedules.scheduleCronTaskUid, input.taskUid)).limit(1)
    : await db.select().from(gameSchedules).where(eq(gameSchedules.isEnabled, true));
  const cycles: WorkerCycleResult[] = [];

  for (const schedule of schedules) {
    const taskUid = schedule.scheduleCronTaskUid as string | null;
    if (!taskUid || !schedule.isEnabled) {
      cycles.push({ taskUid: taskUid ?? "missing", status: "SKIPPED", reason: "disabled_or_missing_task" });
      continue;
    }
    const claim = await claimWorkerCycle(taskUid, now, db);
    if (!claim.claimed) {
      cycles.push({ taskUid, status: "SKIPPED", reason: "duplicate_claim" });
      continue;
    }
    try {
      const result = await runScheduledGameCycle({ taskUid, actorUserId: input.actorUserId, now }, db);
      cycles.push({ taskUid, status: "PASS", result });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "unknown_error";
      await appendOperationalEvent({ eventType: "SCHEDULER_WORKER_ERROR", aggregateType: "scheduler", aggregateId: taskUid, source: "supervised_worker", payload: { taskUid, error: detail.slice(0, 255), pilotOnly: true }, idempotencyKey: `supervised-worker-error:${taskUid}:${getWorkerBucket(now)}` }, db);
      cycles.push({ taskUid, status: "DEGRADED", reason: detail });
    }
  }

  const degraded = cycles.some(cycle => cycle.status === "DEGRADED");
  await appendOperationalEvent({ eventType: "SCHEDULER_WORKER_COMPLETED", aggregateType: "scheduler", aggregateId: workerRunId, source: "supervised_worker", payload: { workerRunId, bucket: getWorkerBucket(now), windowHours: SUPERVISED_WORKER_WINDOW_HOURS, cycles: cycles.map(cycle => ({ taskUid: cycle.taskUid, status: cycle.status, reason: cycle.reason })), pilotOnly: true }, idempotencyKey: `supervised-worker-completed:${workerRunId}:${getWorkerBucket(now)}` }, db);
  return { status: degraded ? ("DEGRADED" as const) : ("PASS" as const), workerRunId, cycles, windowHours: SUPERVISED_WORKER_WINDOW_HOURS, checkedAt: now.toISOString(), pilotOnly: true };
}
