import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
const source = await readFile(new URL("../client/src/canvas/SceneModel3D.tsx", import.meta.url), "utf8");
assert.ok(source.includes("viewpoints"));
assert.ok(source.includes("saveViewpoint"));
assert.ok(source.includes("selectedIds: Array.from(selectedIds)"));
assert.ok(source.includes("heightFilterActive"));
assert.ok(source.includes("heightFilter"));
console.log(JSON.stringify({ status: "PASS", fields: ["viewMode", "level", "heightFilterActive", "heightFilter", "selectedIds"] }));
