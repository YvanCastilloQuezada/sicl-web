import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../client/src/canvas/CanvasPlanView.tsx", import.meta.url), "utf8");
for (const required of ["ConstructionModel", "useBimSelection", "showGrid", "showAxes", "onWheel", "onPointerMove", "Escape"]) if (!source.includes(required)) throw new Error(`CanvasPlanView missing ${required}`);
if (source.includes(": any") || source.includes(" as any")) throw new Error("CanvasPlanView contains any");
console.log("test-canvas-mount: PASS");
