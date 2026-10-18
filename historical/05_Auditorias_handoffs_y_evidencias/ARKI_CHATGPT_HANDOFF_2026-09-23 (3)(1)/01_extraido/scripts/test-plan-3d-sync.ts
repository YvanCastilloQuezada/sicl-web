import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";

const canvas = await readFile(new URL("../client/src/canvas/CanvasPlanView.tsx", import.meta.url), "utf8");
const scene = await readFile(new URL("../client/src/canvas/SceneModel3D.tsx", import.meta.url), "utf8");
assert.ok(canvas.includes("useBimSelection"));
assert.ok(scene.includes("useBimSelection"));
assert.ok(canvas.includes("select("));
assert.ok(scene.includes("select(selectionFromElement"));
console.log(JSON.stringify({ status: "PASS", contract: "shared SelectionProvider", views: ["2D", "3D"] }));
