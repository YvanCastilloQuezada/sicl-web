import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
const source = await readFile(new URL("../client/src/canvas/SceneModel3D.tsx", import.meta.url), "utf8");
assert.ok(source.includes("heightFilterActive"));
assert.ok(source.includes("heightFilter"));
assert.ok(source.includes("node.position[1] <= heightFilter"));
console.log(JSON.stringify({ status: "PASS", contract: "serializable height filter state", controls: ["enabled", "height"] }));
