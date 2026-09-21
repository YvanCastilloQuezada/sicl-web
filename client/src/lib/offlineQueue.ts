export type OfflineOperation = "projects.createWithInitialIntake";

export type OfflineQueueItem = {
  id: string;
  operation: OfflineOperation;
  payload: Record<string, unknown>;
  createdAt: number;
  attempts: number;
  nextAttemptAt: number;
  lastError?: string;
};

const DB_NAME = "arki-offline-sync";
const STORE_NAME = "queue";
const FALLBACK_KEY = "arki-offline-sync-queue-v1";
const MAX_ATTEMPTS = 8;

function makeId() {
  return typeof globalThis.crypto?.randomUUID === "function" ? globalThis.crypto.randomUUID() : `arki-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function fallbackRead(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    return raw ? (JSON.parse(raw) as OfflineQueueItem[]) : [];
  } catch {
    return [];
  }
}

function fallbackWrite(items: OfflineQueueItem[]) {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
}

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

export async function listOfflineQueue(): Promise<OfflineQueueItem[]> {
  const db = await openDb();
  if (!db) return fallbackRead().sort((a, b) => a.createdAt - b.createdAt);
  return new Promise((resolve) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => { db.close(); resolve((request.result as OfflineQueueItem[]).sort((a, b) => a.createdAt - b.createdAt)); };
    request.onerror = () => { db.close(); resolve(fallbackRead()); };
  });
}

export async function enqueueOffline(item: Omit<OfflineQueueItem, "id" | "createdAt" | "attempts" | "nextAttemptAt">): Promise<OfflineQueueItem> {
  const queued: OfflineQueueItem = { ...item, id: makeId(), createdAt: Date.now(), attempts: 0, nextAttemptAt: Date.now() };
  const db = await openDb();
  if (!db) { const items = fallbackRead(); items.push(queued); fallbackWrite(items); return queued; }
  return new Promise((resolve) => {
    const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).add(queued);
    request.onsuccess = () => { db.close(); resolve(queued); };
    request.onerror = () => { db.close(); const items = fallbackRead(); items.push(queued); fallbackWrite(items); resolve(queued); };
  });
}

async function remove(id: string) {
  const db = await openDb();
  if (!db) { fallbackWrite(fallbackRead().filter((item) => item.id !== id)); return; }
  await new Promise<void>((resolve) => { const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id); request.onsuccess = request.onerror = () => { db.close(); resolve(); }; });
}

async function update(item: OfflineQueueItem) {
  const db = await openDb();
  if (!db) { fallbackWrite(fallbackRead().map((current) => current.id === item.id ? item : current)); return; }
  await new Promise<void>((resolve) => { const request = db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(item); request.onsuccess = request.onerror = () => { db.close(); resolve(); }; });
}

export async function flushOfflineQueue(handler: (item: OfflineQueueItem) => Promise<void>): Promise<{ sent: number; pending: number; failed: number }> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return { sent: 0, pending: (await listOfflineQueue()).length, failed: 0 };
  const items = await listOfflineQueue();
  let sent = 0; let failed = 0;
  for (const item of items) {
    if (item.nextAttemptAt > Date.now()) continue;
    try {
      await handler(item);
      await remove(item.id);
      sent += 1;
    } catch (error) {
      const attempts = item.attempts + 1;
      const terminal = attempts >= MAX_ATTEMPTS;
      await update({ ...item, attempts, lastError: error instanceof Error ? error.message : String(error), nextAttemptAt: terminal ? Number.MAX_SAFE_INTEGER : Date.now() + Math.min(15 * 60_000, 1_000 * 2 ** attempts) });
      failed += 1;
      if (!navigator.onLine) break;
    }
  }
  return { sent, pending: (await listOfflineQueue()).length, failed };
}

export const OFFLINE_MAX_ATTEMPTS = MAX_ATTEMPTS;
