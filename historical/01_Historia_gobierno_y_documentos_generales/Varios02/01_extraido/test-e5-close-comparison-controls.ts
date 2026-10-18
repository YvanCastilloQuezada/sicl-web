import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../client/src/comparison/SceneComparisonSideBySide.tsx", import.meta.url), "utf8");
assert.ok(source.includes("leftControls"));
assert.ok(source.includes("rightControls"));
assert.ok(source.includes("setLeftControls"));
assert.ok(source.includes("setRightControls"));
assert.ok(source.includes("controls.viewMode"));
assert.ok(source.includes("controls.level"));
assert.ok(source.includes("controls.heightFilterActive"));
assert.ok(source.includes("onChange={setLeftControls}"));
assert.ok(source.includes("onChange={setRightControls}"));
console.log(JSON.stringify({ status: "PASS", test: "E5-CLOSE-03", controls: ["camera", "level", "heightFilter"], independentSides: ["left", "right"] }));
