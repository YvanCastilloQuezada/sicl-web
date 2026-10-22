"use strict";
// Read-only launcher contract verification. Run from repo root:
// node tools/maqueta-viva/verify-maqueta-launcher.cjs
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "../..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const cmd = read("ARKI-MAQUETA-VIVA.cmd");
const ps = read("tools/maqueta-viva/Start-ARKI-MaquetaViva.ps1");
const html = read("tools/maqueta-viva/maqueta-viva.template.html");
const state = JSON.parse(read("docs/arki-master-map/ARKI_MASTER_MAP_STATE.json"));
const registry = JSON.parse(read("tools/maqueta-viva/assembly-registry.json"));
assert.match(cmd, /%~dp0tools\\maqueta-viva\\Start-ARKI-MaquetaViva\.ps1/i);
assert.match(cmd, /if errorlevel 1/i);
assert.match(ps, /ARKI_MAQUETA_VIVA=READY/);
assert.match(ps, /Start-Process -FilePath \$output/);
assert.match(ps, /GetFolderPath\("LocalApplicationData"\)/);
assert.ok(html.includes("__ARKI_STATE_JSON__"));
assert.ok(html.includes("__ARKI_ASSEMBLY_JSON__"));
assert.equal(state.schema, "ARKI-MASTER-MAP-STATE-0.1");
assert.equal(state.roadmap.phases.length, 10);
assert.equal(registry.schema, "ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1");
assert.ok(registry.ideas.length > 0);
console.log("ARKI launcher static contracts PASS; Windows launch and browser E3 NOT tested.");
