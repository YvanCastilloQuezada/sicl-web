import { strict as assert } from "node:assert";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { sceneModelFromConstruction } from "../shared/arkiSceneModel";
import { exportIFC4, parseIfcText, sceneIdentityRoundTrip, supportedIfcGeometry } from "../shared/ifc4/arkiIfc4";

const model = generateConstructionModel({ projectId: "ifc-export", name: "IFC export", widthM: 6, depthM: 5, floors: 1 });
const scene = sceneModelFromConstruction(model);
const exported = await exportIFC4(scene, 1);
assert.equal(exported.schema, "IFC4");
assert.ok(exported.text.startsWith("ISO-10303-21;"));
assert.ok(exported.text.includes("FILE_SCHEMA(('IFC4'))"));
const parsed = parseIfcText(exported.text);
assert.equal(parsed.schema, "IFC4");
assert.equal(parsed.entities.length, scene.nodes.length);
const roundTrip = sceneIdentityRoundTrip(scene, parsed);
assert.equal(roundTrip.missing.length, 0);
assert.equal(roundTrip.preserved, scene.nodes.length);
assert.equal(supportedIfcGeometry().IFCEXTRUDEDAREASOLID, "supported");
console.log(JSON.stringify({ status: "PASS", entities: parsed.entities.length, preserved: roundTrip.preserved, missing: roundTrip.missing.length, lossReport: exported.lossReport }));
