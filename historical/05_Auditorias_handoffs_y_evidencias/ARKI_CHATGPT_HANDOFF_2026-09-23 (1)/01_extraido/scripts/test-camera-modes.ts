import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
const source = await readFile(new URL("../client/src/canvas/SceneModel3D.tsx", import.meta.url), "utf8");
for (const mode of ["perspective", "orthographic", "plan", "elevation", "section"]) assert.ok(source.includes(`value=\"${mode}\"`) || source.includes(`=== \"${mode}\"`));
assert.ok(source.includes("OrthographicCamera"));
assert.ok(source.includes("PerspectiveCamera"));
console.log(JSON.stringify({ status: "PASS", modes: ["perspective", "orthographic", "plan", "elevation", "section"] }));
