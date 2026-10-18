import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { sceneModelFromConstruction } from "../shared/arkiSceneModel";

const construction = generateConstructionModel({ projectId: "scene-test", name: "Scene test", widthM: 12, depthM: 9, floors: 2 });
const scene = sceneModelFromConstruction(construction);
if (scene.schema !== "ARKI-SCENE-MODEL-1.0") throw new Error("SceneModel schema inválido");
if (scene.projectId !== construction.projectId) throw new Error("projectId no coincide");
if (scene.nodes.length <= construction.walls.length) throw new Error("SceneModel no contiene elementos constructivos");
if (!scene.nodes.some((node) => node.kind === "wall")) throw new Error("faltan muros");
if (!scene.nodes.some((node) => node.kind === "door")) throw new Error("faltan puertas");
if (!scene.nodes.some((node) => node.kind === "window")) throw new Error("faltan ventanas");
if (!scene.nodes.some((node) => node.kind === "space")) throw new Error("faltan zonas espaciales");
if (!scene.levels.includes(0) || !scene.levels.includes(1)) throw new Error("niveles incompletos");
for (const node of scene.nodes) {
  if (!node.id || node.dimensions.some((value) => value <= 0) || !Number.isFinite(node.position[1])) throw new Error(`nodo inválido: ${node.id}`);
}
console.log(JSON.stringify({ status: "PASS", schema: scene.schema, nodes: scene.nodes.length, levels: scene.levels, bounds: scene.bounds, kinds: Array.from(new Set(scene.nodes.map((node) => node.kind))) }));
