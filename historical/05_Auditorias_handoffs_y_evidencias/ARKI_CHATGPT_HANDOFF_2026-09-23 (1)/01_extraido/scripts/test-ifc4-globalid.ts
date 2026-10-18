import { strict as assert } from "node:assert";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { sceneModelFromConstruction } from "../shared/arkiSceneModel";
import { deterministicGlobalId, mapSceneIdentities } from "../shared/identity/arkiGlobalId";

const model = generateConstructionModel({ projectId: "ifc-identity", name: "IFC identity", widthM: 6, depthM: 5, floors: 1 });
const scene = sceneModelFromConstruction(model);
const first = await deterministicGlobalId(scene.nodes[0].id, scene.projectId, 1);
const second = await deterministicGlobalId(scene.nodes[0].id, scene.projectId, 1);
assert.equal(first, second);
assert.equal(first.length, 22);
const mappings = await mapSceneIdentities(scene.nodes.slice(0, 10), scene.projectId, 1);
assert.equal(new Set(mappings.map((mapping) => mapping.globalId)).size, mappings.length);
console.log(JSON.stringify({ status: "PASS", checked: mappings.length, deterministic: true, globalIdLength: first.length }));
