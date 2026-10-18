import { readFile } from "node:fs/promises";

const shell = await readFile(new URL("../client/src/components/ArkiWorkspaceShell.tsx", import.meta.url), "utf8");
const scene = await readFile(new URL("../client/src/canvas/SceneModel3D.tsx", import.meta.url), "utf8");
const contract = await readFile(new URL("../shared/arkiSceneModel.ts", import.meta.url), "utf8");
for (const [label, source, needles] of [
  ["shell", shell, ["activeModule === \"3D\"", "SceneModelModule", "activeModule === \"Modelo BIM\""]],
  ["scene", scene, ["Canvas", "OrbitControls", "onPointerMissed", "selectionFromElement", "visibleKinds"]],
  ["contract", contract, ["ARKI-SCENE-MODEL-1.0", "sceneModelFromConstruction", "dimensions", "relatedIds"]],
] as const) {
  for (const needle of needles) if (!source.includes(needle)) throw new Error(`${label} carece de ${needle}`);
}
console.log("test-scene-model-mount: PASS");
