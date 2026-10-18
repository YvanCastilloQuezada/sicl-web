import { strict as assert } from "node:assert";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { sceneModelFromConstruction } from "../shared/arkiSceneModel";
import { compareSceneModels } from "../shared/arkiSceneComparison";
import { snapshotRecord } from "../shared/persistence/arkiPersistence";

const first = sceneModelFromConstruction(generateConstructionModel({ familyId: "family-health", variantId: "hospital-general", projectId: "comparison", levels: 1 }));
const second = { ...first, nodes: first.nodes.map((node, index) => index === 0 ? { ...node, dimensions: [node.dimensions[0] + 0.15, node.dimensions[1], node.dimensions[2]] as [number, number, number] } : node) };
const left = snapshotRecord({ projectId: "comparison", version: "v001", scene: first, gateStatus: "approved", createdAt: "2026-09-23T00:00:00.000Z", contentHash: "left" });
const right = snapshotRecord({ projectId: "comparison", version: "v002", scene: second, gateStatus: "approved", createdAt: "2026-09-23T00:00:01.000Z", contentHash: "right" });
const result = compareSceneModels(left.scene, right.scene);
assert.equal(left.version, "v001");
assert.equal(right.version, "v002");
assert.ok(result.modified.length > 0);
console.log(JSON.stringify({ status: "PASS", left: left.version, right: right.version, modified: result.modified.length }));
