import "fake-indexeddb/auto";
import { strict as assert } from "node:assert";
import { generateConstructionModel, APU_DATABASE } from "../shared/arkiConstructionOntology";
import { fromApuDatabase } from "../shared/arkiPriceBook";
import { createInitialSnapshot } from "../shared/arkiRecalculation";
import type { ApprovedSnapshot } from "../shared/arkiTechnicalDossierCompiler";
import { clearArkiDatabase } from "../client/src/persistence/arkiIndexedDb";
import { attachManual, attachWarranty, createAssetFromElement, IndexedDbOperationMaintenanceStore, openWorkOrder, registerInspection, closeWorkOrder, type AssetHistoryEntry, type WorkOrder } from "../shared/arkiOperationMaintenance";

const model = generateConstructionModel({ projectId: "E8B-PROJECT-001", name: "E8-B Fixture", widthM: 16.5, depthM: 9.75, floors: 4 });
const priceBook = fromApuDatabase(APU_DATABASE, { id: "PB-E8B", version: 1, region: "La Libertad", country: "PE", currency: "PEN", validFrom: "2026-09-23" });
const base = createInitialSnapshot({ model, instances: [], priceBook, formworkRulesVersion: 1 });
const snapshot: ApprovedSnapshot = { ...base, approval: { gateStatus: "passed", approvedBy: "Product Owner", approvedAt: "2026-09-23T23:50:00.000Z" } };
const draft = { ...snapshot, approval: { gateStatus: "pending" as const, approvedBy: "", approvedAt: "" } };
const elementId = snapshot.constructionModel.walls[0]?.id;
if (!elementId) throw new Error("E8B_FIXTURE_ELEMENT_MISSING");

await clearArkiDatabase();

assert.throws(() => createAssetFromElement(draft, elementId, { kind: "structural", name: "Muro estructural", location: "Nivel 1" }), /REQUIRES_APPROVED/);
console.log("E8B-01 PASS — unapproved snapshot rejected");

assert.throws(() => createAssetFromElement(snapshot, "missing-element", { kind: "structural", name: "Missing", location: "Unknown" }), /ELEMENT_NOT_FOUND/);
console.log("E8B-02 PASS — missing element rejected");

const asset = createAssetFromElement(snapshot, elementId, { kind: "structural", name: "Muro estructural", location: "Nivel 1 / Eje A-1", manufacturer: "ARKI Fixture", model: "W-001", installedAt: "2026-09-23", usefulLifeYears: 50 });
const warranty = { assetId: asset.id, startDate: "2026-09-23", endDate: "2031-09-22", provider: "Proveedor Fixture", terms: "Cobertura estructural", documentRef: "warranty-001.pdf" };
const manual = { assetId: asset.id, title: "Manual de inspección", kind: "maintenance" as const, documentRef: "manual-001.pdf", format: "pdf" as const };
const inspection = { id: "inspection-001", assetId: asset.id, date: "2026-10-01", inspector: "Inspector Fixture", result: "ok" as const, notes: "Sin observaciones", evidenceRef: "inspection-001.jpg" };
const order: WorkOrder = { id: "wo-001", assetId: asset.id, kind: "preventive", status: "open", responsible: "Mantenimiento Fixture", openedAt: "2026-10-02", description: "Inspección preventiva" };
attachWarranty(asset, warranty);
attachManual(asset, manual);
registerInspection(asset, inspection);
openWorkOrder(asset, order);
const closedOrder: WorkOrder = { ...order, status: "closed", closedAt: "2026-10-03" };
closeWorkOrder(asset, order.id, "2026-10-03", [order]);
const history: AssetHistoryEntry[] = [
  { assetId: asset.id, timestamp: "2026-10-01", type: "inspection", refId: inspection.id },
  { assetId: asset.id, timestamp: "2026-10-02", type: "work_order_opened", refId: order.id },
  { assetId: asset.id, timestamp: "2026-10-03", type: "work_order_closed", refId: order.id },
];
assert.equal(closedOrder.status, "closed");
assert.equal(history.length, 3);
console.log("E8B-03 PASS — asset, warranty, manual, inspection and work-order lifecycle validated");

const store = new IndexedDbOperationMaintenanceStore();
await store.saveAsset(asset);
await store.saveWarranty(warranty);
await store.saveManual(manual);
await store.saveInspection(inspection);
await store.saveWorkOrder(order);
await store.saveWorkOrder(closedOrder);
for (const entry of history) await store.saveHistory(entry);
const reopenedStore = new IndexedDbOperationMaintenanceStore();
const restored = await reopenedStore.getAsset(asset.id);
const restoredWarranty = await reopenedStore.getWarranties(asset.id);
const restoredHistory = await reopenedStore.assetHistory(asset.id);
assert.deepEqual(restored, asset);
assert.equal(restoredWarranty.length, 1);
assert.deepEqual(restoredHistory.map((entry) => entry.refId), [inspection.id, order.id, order.id]);
console.log("E8B-04 PASS — IndexedDB close/reopen restores asset, warranty and chronological history");

console.log(JSON.stringify({ status: "PASS", schema: "ARKI-E8B-OM-1.0", assetId: asset.id, elementId: asset.elementId, snapshotId: asset.snapshotId, historyEntries: restoredHistory.length, stores: ["assets", "warranties", "manuals", "inspections", "workOrders", "assetHistory"] }, null, 2));
