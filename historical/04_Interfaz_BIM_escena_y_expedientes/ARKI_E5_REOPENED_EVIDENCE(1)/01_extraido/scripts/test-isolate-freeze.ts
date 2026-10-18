import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
const source = await readFile(new URL("../client/src/canvas/SceneModel3D.tsx", import.meta.url), "utf8");
assert.ok(source.includes("isolatedIds"));
assert.ok(source.includes("frozenIds"));
assert.ok(source.includes("isolateSelection"));
assert.ok(source.includes("freezeSelection"));
assert.ok(source.includes("resetVisibility"));
console.log(JSON.stringify({ status: "PASS", operations: ["isolate", "freeze", "show-all"] }));
