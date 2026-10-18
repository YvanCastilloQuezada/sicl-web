import "fake-indexeddb/auto";
import { strict as assert } from "node:assert";
import { clearArkiDatabase, restoreArkiSnapshot, saveArkiSnapshot } from "../client/src/persistence/arkiIndexedDb";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { sceneModelFromConstruction } from "../shared/arkiSceneModel";
import { snapshotRecord } from "../shared/persistence/arkiPersistence";

await clearArkiDatabase();
const construction = generateConstructionModel({ projectId: "e5-close-snapshot", levels: 1 });
const snapshot = snapshotRecord({ projectId: construction.projectId, version: "v001", scene: sceneModelFromConstruction(construction), gateStatus: "approved", createdAt: "2026-09-23T00:00:00.000Z", contentHash: "e5-snapshot-hash" });
await saveArkiSnapshot(snapshot);
const restored = await restoreArkiSnapshot(snapshot.projectId, snapshot.version);
assert.ok(restored);
assert.equal(restored.id, snapshot.id);
assert.equal(restored.gateStatus, "approved");
assert.equal(restored.scene.nodes.length, snapshot.scene.nodes.length);
console.log(JSON.stringify({ status: "PASS", test: "E5-CLOSE-01", operation: "save → close → reopen → restore", snapshotId: restored.id, nodes: restored.scene.nodes.length }));
