import { strict as assert } from "node:assert";
import { snapshotKey, snapshotRecord, stableSnapshotPayload } from "../shared/persistence/arkiPersistence";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { sceneModelFromConstruction } from "../shared/arkiSceneModel";

const construction = generateConstructionModel({ familyId: "family-health", variantId: "hospital-general", projectId: "persistence-fixture", levels: 1 });
const scene = sceneModelFromConstruction(construction);
const snapshot = snapshotRecord({ projectId: "persistence-fixture", version: "v001", scene, gateStatus: "draft", createdAt: "2026-09-23T00:00:00.000Z", contentHash: "fixture-hash" });
assert.equal(snapshot.id, snapshotKey("persistence-fixture", "v001"));
assert.equal(snapshot.gateStatus, "draft");
assert.ok(stableSnapshotPayload(snapshot).includes('"projectId":"persistence-fixture"'));
assert.ok(snapshot.scene.nodes.length > 0);
console.log(JSON.stringify({ status: "PASS", id: snapshot.id, nodes: snapshot.scene.nodes.length, gateStatus: snapshot.gateStatus }));
