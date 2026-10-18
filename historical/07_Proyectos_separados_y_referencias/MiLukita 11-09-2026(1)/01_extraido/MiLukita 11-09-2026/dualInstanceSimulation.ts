import { buildWorkerClaimKey, getWorkerBucket } from "../supervisedWorker";

export type SharedClaim = { instanceId: string; eventId: string; key: string; acquired: boolean };

/**
 * Harness local: representa el contrato de unicidad que debe proveer la base de datos.
 * No reemplaza una prueba multiinstancia real contra MySQL/TiDB compartido.
 */
export class SharedClaimStore {
  private readonly claims = new Set<string>();

  async claim(eventId: string, now: Date, instanceId: string): Promise<SharedClaim> {
    const key = buildWorkerClaimKey(eventId, now);
    const acquired = !this.claims.has(key);
    if (acquired) this.claims.add(key);
    return { instanceId, eventId, key, acquired };
  }

  size() { return this.claims.size; }
}

export async function simulateDualInstanceClaim(eventId = "LIVE-24-TEST", now = new Date("2026-08-27T00:00:00.000Z")) {
  const store = new SharedClaimStore();
  const [first, second] = await Promise.all([
    store.claim(eventId, now, "instance-a"),
    store.claim(eventId, now, "instance-b"),
  ]);
  return { bucket: getWorkerBucket(now), claims: [first, second], acquiredCount: [first, second].filter((claim) => claim.acquired).length, storedClaimCount: store.size() };
}
