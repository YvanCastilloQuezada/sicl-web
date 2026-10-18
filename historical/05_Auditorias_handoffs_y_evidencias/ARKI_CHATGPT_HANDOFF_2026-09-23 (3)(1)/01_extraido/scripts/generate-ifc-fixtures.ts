import { mkdir, writeFile } from "node:fs/promises";
import { generateConstructionModel } from "../shared/arkiConstructionOntology";
import { sceneModelFromConstruction } from "../shared/arkiSceneModel";
import { exportIFC4 } from "../shared/ifc4/arkiIfc4";

await mkdir(new URL("../fixtures/ifc4/", import.meta.url), { recursive: true });
const cases = [
  ["fixture_01_simple_wall.ifc", { projectId: "fixture-wall", name: "Simple wall", widthM: 4, depthM: 3, floors: 1 }],
  ["fixture_02_room_with_door.ifc", { projectId: "fixture-room-door", name: "Room with door", widthM: 6, depthM: 5, floors: 1 }],
  ["fixture_03_multi_storey.ifc", { projectId: "fixture-multi-storey", name: "Multi storey", widthM: 8, depthM: 6, floors: 2 }],
] as const;
for (const [filename, input] of cases) {
  const scene = sceneModelFromConstruction(generateConstructionModel(input));
  const exported = await exportIFC4(scene, 1);
  await writeFile(new URL(`../fixtures/ifc4/${filename}`, import.meta.url), exported.text, "utf8");
}
console.log(JSON.stringify({ status: "PASS", fixtures: cases.map(([filename]) => filename) }));
