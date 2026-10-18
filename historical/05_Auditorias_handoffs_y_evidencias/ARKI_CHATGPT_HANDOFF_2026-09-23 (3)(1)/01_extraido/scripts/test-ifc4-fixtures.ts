import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { parseIfcText } from "../shared/ifc4/arkiIfc4";

const files = ["fixture_01_simple_wall.ifc", "fixture_02_room_with_door.ifc", "fixture_03_multi_storey.ifc"];
const results = [];
for (const filename of files) {
  const text = await readFile(new URL(`../fixtures/ifc4/${filename}`, import.meta.url), "utf8");
  const parsed = parseIfcText(text);
  assert.equal(parsed.schema, "IFC4");
  assert.ok(parsed.entities.length > 0);
  results.push({ filename, sha256: createHash("sha256").update(text).digest("hex"), entities: parsed.entities.length });
}
console.log(JSON.stringify({ status: "PASS", fixtures: results }));
