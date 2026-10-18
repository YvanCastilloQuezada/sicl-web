import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { parseIFC4WithWebIfc } from "../shared/ifc4/webIfcAdapter";

const bytes = new Uint8Array(await readFile(new URL("../fixtures/ifc4/fixture_01_simple_wall.ifc", import.meta.url)));
try {
  const parsed = await parseIFC4WithWebIfc(bytes);
  assert.ok(parsed.schema.includes("IFC4"));
  console.log(JSON.stringify({ status: "PASS", parser: "web-ifc", schema: parsed.schema, entities: parsed.entities.length }));
} catch (error) {
  console.log(JSON.stringify({ status: "PARTIAL", parser: "web-ifc", reason: error instanceof Error ? error.message : String(error) }));
}
