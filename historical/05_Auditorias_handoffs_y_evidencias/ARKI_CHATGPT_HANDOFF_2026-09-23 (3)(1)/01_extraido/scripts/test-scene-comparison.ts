import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { compareSceneModels } from "../shared/arkiSceneComparison";
import { sceneModelFromConstruction } from "../shared/arkiSceneModel";

const reference = sceneModelFromConstruction(generateConstructionModel({ projectId: "compare", name: "Reference", widthM: 10, depthM: 8, floors: 1 }));
const current = sceneModelFromConstruction(generateConstructionModel({ projectId: "compare", name: "Current", widthM: 12, depthM: 8, floors: 1 }));
const result = compareSceneModels(reference, current);
if (result.modified.length === 0) throw new Error("la comparación no detectó cambios geométricos");
if (result.unchanged.length === 0) throw new Error("la comparación no conservó elementos sin cambios");
console.log(JSON.stringify({ status: "PASS", added: result.added.length, removed: result.removed.length, modified: result.modified.length, unchanged: result.unchanged.length }));
