import type { ArkiProject, ArkiSession, ArkiSnapshot, ArkiVersion, AuditEntry } from "@shared/persistence/arkiPersistence";
import { ARKI_ASSET_HISTORY_STORE, ARKI_ASSET_STORE, ARKI_AUDIT_STORE, ARKI_INSPECTION_STORE, ARKI_MANUAL_STORE, ARKI_PERSISTENCE_DB, ARKI_PERSISTENCE_VERSION, ARKI_PROJECT_STORE, ARKI_SESSION_STORE, ARKI_SNAPSHOT_STORE, ARKI_WARRANTY_STORE, ARKI_WORK_ORDER_STORE } from "@shared/persistence/arkiPersistence";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(ARKI_PERSISTENCE_DB, ARKI_PERSISTENCE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      for (const store of [ARKI_SNAPSHOT_STORE, ARKI_SESSION_STORE, ARKI_PROJECT_STORE, ARKI_AUDIT_STORE, ARKI_ASSET_STORE, ARKI_WARRANTY_STORE, ARKI_MANUAL_STORE, ARKI_INSPECTION_STORE, ARKI_WORK_ORDER_STORE, ARKI_ASSET_HISTORY_STORE]) {
        if (!database.objectStoreNames.contains(store)) database.createObjectStore(store, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB no disponible"));
  });
}

async function putRecord<T extends { id: string }>(storeName: string, record: T): Promise<void> {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database.transaction(storeName, "readwrite").objectStore(storeName).put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error(`No se pudo guardar en ${storeName}`));
  });
  database.close();
}

async function getRecord<T>(storeName: string, id: string): Promise<T | null> {
  const database = await openDatabase();
  const result = await new Promise<T | undefined>((resolve, reject) => {
    const request = database.transaction(storeName, "readonly").objectStore(storeName).get(id);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error ?? new Error(`No se pudo leer ${storeName}`));
  });
  database.close();
  return result ?? null;
}

async function getAllRecords<T>(storeName: string): Promise<T[]> {
  const database = await openDatabase();
  const result = await new Promise<T[]>((resolve, reject) => {
    const request = database.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error ?? new Error(`No se pudo listar ${storeName}`));
  });
  database.close();
  return result;
}

export async function saveArkiSnapshot(snapshot: ArkiSnapshot): Promise<void> { await putRecord(ARKI_SNAPSHOT_STORE, snapshot); }
export async function restoreArkiSnapshot(projectId: string, version: string): Promise<ArkiSnapshot | null> { return getRecord<ArkiSnapshot>(ARKI_SNAPSHOT_STORE, `${projectId}:${version}`); }
export async function listArkiSnapshots(projectId: string): Promise<ArkiSnapshot[]> { return (await getAllRecords<ArkiSnapshot>(ARKI_SNAPSHOT_STORE)).filter((item) => item.projectId === projectId).sort((left, right) => left.version.localeCompare(right.version)); }

export async function approveArkiSnapshot(projectId: string, version: string): Promise<ArkiSnapshot | null> {
  const snapshot = await restoreArkiSnapshot(projectId, version);
  if (!snapshot) return null;
  const approved = { ...snapshot, gateStatus: "approved" as const };
  await saveArkiSnapshot(approved);
  return approved;
}

export async function saveArkiSession(session: ArkiSession): Promise<void> { await putRecord(ARKI_SESSION_STORE, session); }
export async function saveArkiProject(project: ArkiProject): Promise<void> { await putRecord(ARKI_PROJECT_STORE, project); }
export async function saveArkiVersion(version: ArkiVersion): Promise<void> { await putRecord(ARKI_PROJECT_STORE, version); }
export async function saveAuditEntry(entry: AuditEntry): Promise<void> { await putRecord(ARKI_AUDIT_STORE, entry); }
export async function restoreAuditTrail(target: string): Promise<AuditEntry[]> { return (await getAllRecords<AuditEntry>(ARKI_AUDIT_STORE)).filter((entry) => entry.target === target).sort((left, right) => left.timestamp.localeCompare(right.timestamp)); }

export async function clearArkiDatabase(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(ARKI_PERSISTENCE_DB);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("No se pudo limpiar IndexedDB"));
  });
}
