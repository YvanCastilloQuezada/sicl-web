import { beforeEach, describe, expect, it } from "vitest";
import { enqueueOffline, flushOfflineQueue, listOfflineQueue, OFFLINE_MAX_ATTEMPTS } from "./offlineQueue";

const storage = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", { value: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) }, configurable: true });
Object.defineProperty(globalThis, "navigator", { value: { onLine: true }, configurable: true, writable: true });

describe("offline queue", () => {
  beforeEach(() => storage.clear());

  it("persists an operation and flushes it in creation order", async () => {
    const first = await enqueueOffline({ operation: "projects.createWithInitialIntake", payload: { sequence: 1 } });
    await enqueueOffline({ operation: "projects.createWithInitialIntake", payload: { sequence: 2 } });
    const seen: number[] = [];
    const result = await flushOfflineQueue(async (item) => { seen.push(Number(item.payload.sequence)); });
    expect(first.id).toBeTruthy();
    expect(seen).toEqual([1, 2]);
    expect(result).toEqual({ sent: 2, pending: 0, failed: 0 });
  });

  it("retains a failed operation with exponential retry metadata", async () => {
    await enqueueOffline({ operation: "projects.createWithInitialIntake", payload: { sequence: 3 } });
    const result = await flushOfflineQueue(async () => { throw new Error("network unavailable"); });
    const remaining = await listOfflineQueue();
    expect(result.failed).toBe(1);
    expect(remaining[0]?.attempts).toBe(1);
    expect(remaining[0]?.lastError).toBe("network unavailable");
    expect(remaining[0]?.nextAttemptAt).toBeGreaterThan(Date.now());
    expect(OFFLINE_MAX_ATTEMPTS).toBe(8);
  });
});
