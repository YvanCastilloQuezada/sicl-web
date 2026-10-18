import type { ProjectSnapshot } from "./arkiRecalculation";
import { stableHash } from "./arkiRecalculation";

export const ARKI_OPERATION_MAINTENANCE_SCHEMA = "ARKI-E8B-OM-1.0" as const;
export const ARKI_OM_DB_NAME = "arki-local-first";
export const ARKI_OM_DB_VERSION = 3;
export const ARKI_OM_STORES = ["assets", "warranties", "manuals", "inspections", "workOrders", "assetHistory"] as const;

export type AssetKind = "equipment" | "installation" | "structural" | "finish";
export type Asset = {
  id: string;
  elementId: string;
  snapshotId: string;
  version: number;
  kind: AssetKind;
  name: string;
  location: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installedAt?: string;
  usefulLifeYears?: number;
};
export type Warranty = { assetId: string; startDate: string; endDate: string; provider: string; terms?: string; documentRef?: string };
export type Manual = { assetId: string; title: string; kind: "installation" | "operation" | "maintenance" | "safety"; documentRef: string; format: "pdf" | "link" | "text" };
export type Inspection = { id: string; assetId: string; date: string; inspector: string; result: "ok" | "observed" | "failed"; notes?: string; evidenceRef?: string };
export type WorkOrderKind = "preventive" | "corrective";
export type WorkOrderStatus = "open" | "in_progress" | "closed" | "cancelled";
export type WorkOrder = { id: string; assetId: string; kind: WorkOrderKind; status: WorkOrderStatus; responsible: string; openedAt: string; closedAt?: string; description: string };
export type AssetHistoryEntry = { assetId: string; timestamp: string; type: "inspection" | "work_order_opened" | "work_order_closed" | "warranty_expired"; refId: string; note?: string };

type SnapshotLike = ProjectSnapshot & { approval?: { gateStatus?: string; approvedBy?: string; approvedAt?: string } };

function requirePassedSnapshot(snapshot: SnapshotLike): void {
  if (snapshot.approval?.gateStatus !== "passed") throw new Error("E8B_REQUIRES_APPROVED_SNAPSHOT");
  if (!snapshot.approval.approvedBy || !snapshot.approval.approvedAt) throw new Error("E8B_APPROVAL_PROVENANCE_REQUIRED");
}

function elementExists(snapshot: ProjectSnapshot, elementId: string): boolean {
  const wallExists = snapshot.constructionModel.walls.some((wall) => wall.id === elementId);
  const instanceExists = snapshot.familyInstances.some((instance) => instance.id === elementId);
  return wallExists || instanceExists;
}

export function createAssetFromElement(snapshot: SnapshotLike, elementId: string, input: { kind: AssetKind; name: string; location: string; manufacturer?: string; model?: string; serialNumber?: string; installedAt?: string; usefulLifeYears?: number }): Asset {
  requirePassedSnapshot(snapshot);
  if (!elementExists(snapshot, elementId)) throw new Error(`E8B_ELEMENT_NOT_FOUND: ${elementId}`);
  return { id: stableHash({ schema: ARKI_OPERATION_MAINTENANCE_SCHEMA, snapshotId: snapshot.id, elementId }), elementId, snapshotId: snapshot.id, version: snapshot.version, ...input };
}

export function attachWarranty(asset: Asset, warranty: Warranty): Asset {
  if (warranty.assetId !== asset.id) throw new Error("E8B_WARRANTY_ASSET_MISMATCH");
  if (warranty.endDate < warranty.startDate) throw new Error("E8B_INVALID_WARRANTY_RANGE");
  return { ...asset };
}
export function attachManual(asset: Asset, manual: Manual): Asset {
  if (manual.assetId !== asset.id) throw new Error("E8B_MANUAL_ASSET_MISMATCH");
  if (!manual.title || !manual.documentRef) throw new Error("E8B_MANUAL_REFERENCE_REQUIRED");
  return { ...asset };
}
export function registerInspection(asset: Asset, inspection: Inspection): Asset {
  if (inspection.assetId !== asset.id) throw new Error("E8B_INSPECTION_ASSET_MISMATCH");
  if (!inspection.id || !inspection.date || !inspection.inspector) throw new Error("E8B_INSPECTION_REQUIRED_FIELDS");
  return { ...asset };
}
export function openWorkOrder(asset: Asset, order: WorkOrder): Asset {
  if (order.assetId !== asset.id) throw new Error("E8B_WORK_ORDER_ASSET_MISMATCH");
  if (order.status !== "open" && order.status !== "in_progress") throw new Error("E8B_OPEN_ORDER_STATUS_REQUIRED");
  return { ...asset };
}
export function closeWorkOrder(asset: Asset, orderId: string, closedAt: string, orders: WorkOrder[]): Asset {
  if (!orders.some((order) => order.assetId === asset.id && order.id === orderId)) throw new Error(`E8B_WORK_ORDER_NOT_FOUND: ${orderId}`);
  const order = orders.find((candidate) => candidate.id === orderId);
  if (!order || order.status === "closed") throw new Error(`E8B_WORK_ORDER_ALREADY_CLOSED: ${orderId}`);
  if (closedAt < order.openedAt) throw new Error("E8B_WORK_ORDER_CLOSE_BEFORE_OPEN");
  return { ...asset };
}

export function sortAssetHistory(entries: AssetHistoryEntry[]): AssetHistoryEntry[] {
  return [...entries].sort((left, right) => left.timestamp.localeCompare(right.timestamp) || left.refId.localeCompare(right.refId));
}

export type OperationMaintenanceStore = {
  saveAsset(asset: Asset): Promise<void>;
  getAsset(assetId: string): Promise<Asset | null>;
  saveWarranty(warranty: Warranty): Promise<void>;
  getWarranties(assetId: string): Promise<Warranty[]>;
  saveManual(manual: Manual): Promise<void>;
  getManuals(assetId: string): Promise<Manual[]>;
  saveInspection(inspection: Inspection): Promise<void>;
  getInspections(assetId: string): Promise<Inspection[]>;
  saveWorkOrder(order: WorkOrder): Promise<void>;
  getWorkOrders(assetId: string): Promise<WorkOrder[]>;
  saveHistory(entry: AssetHistoryEntry): Promise<void>;
  assetHistory(assetId: string): Promise<AssetHistoryEntry[]>;
};

type Identified = { id: string };
function openOmDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(ARKI_OM_DB_NAME, ARKI_OM_DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      for (const store of ARKI_OM_STORES) if (!database.objectStoreNames.contains(store)) database.createObjectStore(store, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("E8B_INDEXEDDB_OPEN_FAILED"));
  });
}
function keyFor(store: typeof ARKI_OM_STORES[number], value: Identified | Warranty | Manual): string {
  if (store === "assets") return (value as Asset).id;
  if (store === "warranties" || store === "manuals") return `${(value as Warranty | Manual).assetId}:${store}:${JSON.stringify(value)}`;
  return (value as Identified).id;
}
async function put<T extends Identified>(store: typeof ARKI_OM_STORES[number], value: T & { id?: string; assetId?: string }): Promise<void> {
  const database = await openOmDatabase();
  const record = { ...value, id: value.id ?? keyFor(store, value as Identified) };
  await new Promise<void>((resolve, reject) => { const request = database.transaction(store, "readwrite").objectStore(store).put(record); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error ?? new Error(`E8B_PERSIST_${store}_FAILED`)); });
  database.close();
}
async function all<T>(store: typeof ARKI_OM_STORES[number]): Promise<T[]> {
  const database = await openOmDatabase();
  const result = await new Promise<T[]>((resolve, reject) => { const request = database.transaction(store, "readonly").objectStore(store).getAll(); request.onsuccess = () => resolve(request.result as T[]); request.onerror = () => reject(request.error ?? new Error(`E8B_READ_${store}_FAILED`)); });
  database.close();
  return result;
}

export class IndexedDbOperationMaintenanceStore implements OperationMaintenanceStore {
  async saveAsset(asset: Asset): Promise<void> { return put("assets", asset); }
  async getAsset(assetId: string): Promise<Asset | null> { return (await all<Asset>("assets")).find((asset) => asset.id === assetId) ?? null; }
  async saveWarranty(warranty: Warranty): Promise<void> { return put("warranties", { ...warranty, id: `${warranty.assetId}:warranty:${warranty.startDate}:${warranty.endDate}` }); }
  async getWarranties(assetId: string): Promise<Warranty[]> { return (await all<Warranty>("warranties")).filter((item) => item.assetId === assetId); }
  async saveManual(manual: Manual): Promise<void> { return put("manuals", { ...manual, id: `${manual.assetId}:manual:${manual.documentRef}` }); }
  async getManuals(assetId: string): Promise<Manual[]> { return (await all<Manual>("manuals")).filter((item) => item.assetId === assetId); }
  async saveInspection(inspection: Inspection): Promise<void> { return put("inspections", inspection); }
  async getInspections(assetId: string): Promise<Inspection[]> { return (await all<Inspection>("inspections")).filter((item) => item.assetId === assetId); }
  async saveWorkOrder(order: WorkOrder): Promise<void> { return put("workOrders", order); }
  async getWorkOrders(assetId: string): Promise<WorkOrder[]> { return (await all<WorkOrder>("workOrders")).filter((item) => item.assetId === assetId); }
  async saveHistory(entry: AssetHistoryEntry): Promise<void> { return put("assetHistory", { ...entry, id: `${entry.assetId}:${entry.timestamp}:${entry.type}:${entry.refId}` }); }
  async assetHistory(assetId: string): Promise<AssetHistoryEntry[]> { return sortAssetHistory((await all<AssetHistoryEntry>("assetHistory")).filter((item) => item.assetId === assetId)); }
}
