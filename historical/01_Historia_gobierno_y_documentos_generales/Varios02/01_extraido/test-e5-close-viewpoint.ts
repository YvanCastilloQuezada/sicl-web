import "fake-indexeddb/auto";
import { strict as assert } from "node:assert";
import { clearArkiDatabase, listArkiViewpoints, saveArkiViewpoint } from "../client/src/persistence/arkiIndexedDb";
import type { ArkiViewpoint } from "../shared/persistence/arkiPersistence";

await clearArkiDatabase();
const viewpoint: ArkiViewpoint = { id: "e5-close-viewpoint:vp-001", projectId: "e5-close-viewpoint", name: "Axonometría principal", viewMode: "orthographic", level: "all", heightFilterActive: true, heightFilter: 4.5, selectedIds: ["wall-1", "door-1"] };
await saveArkiViewpoint(viewpoint);
const restored = await listArkiViewpoints(viewpoint.projectId);
assert.equal(restored.length, 1);
assert.deepEqual(restored[0], viewpoint);
console.log(JSON.stringify({ status: "PASS", test: "E5-CLOSE-02", operation: "save → close → reopen → restore", viewpointId: restored[0].id, viewMode: restored[0].viewMode, selectedIds: restored[0].selectedIds }));
