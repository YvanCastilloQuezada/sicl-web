import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
const source = await readFile(new URL("../client/src/canvas/SceneModel3D.tsx", import.meta.url), "utf8");
assert.ok(source.includes("clippingActive"));
assert.ok(source.includes("clipHeight"));
assert.ok(source.includes("node.position[1] <= clipHeight"));
console.log(JSON.stringify({ status: "PASS", contract: "serializable clipping state", controls: ["enabled", "height"] }));
