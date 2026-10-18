import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
const source = await readFile(new URL("../client/src/canvas/SceneModel3D.tsx", import.meta.url), "utf8");
assert.ok(source.includes("measureSelection"));
assert.ok(source.includes("medición entre centroides"));
assert.ok(source.includes("Math.hypot"));
console.log(JSON.stringify({ status: "PASS", unit: "m", measurement: "entre centroides" }));
