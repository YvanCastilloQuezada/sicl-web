import { getDb } from "../db";
import { appendOperationalEvent } from "../eventStore";
import { buildWorkerClaimKey, getWorkerBucket } from "../supervisedWorker";

export type LockResult = { acquired: boolean; key: string; reason?: "already_claimed" | "database_unavailable" };

/** Lock lógico distribuible: la unicidad de operationalEvents evita doble ejecución por bucket. */
export async function acquireLock(eventId: string, now = new Date(), dbOverride?: any): Promise<LockResult> {
  const key = buildWorkerClaimKey(eventId, now);
  const db = dbOverride ?? await getDb();
  if (!db) return { acquired: false, key, reason: "database_unavailable" };
  try {
    const claim = await appendOperationalEvent({
      eventType: "SCHEDULER_WORKER_CLAIMED",
      aggregateType: "scheduler",
      aggregateId: eventId,
      source: "scheduler_service",
      payload: { eventId, bucket: getWorkerBucket(now), locking: "operational_events_unique_key", pilotOnly: true },
      idempotencyKey: key,
    }, db);
    return claim.created ? { acquired: true, key } : { acquired: false, key, reason: "already_claimed" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/duplicate|unique|1062/i.test(message)) return { acquired: false, key, reason: "already_claimed" };
    throw error;
  }
}

export function resolveConflict(conflict: { eventId: string; reason: string }) {
  return { ...conflict, resolution: "ESCALATE_HUMAN" as const, automaticMutation: false as const };
}
