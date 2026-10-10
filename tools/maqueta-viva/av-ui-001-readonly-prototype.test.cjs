"use strict";
/**
 * AV-UI-001 isolated prototype regression checks.
 * Run: node tools/maqueta-viva/av-ui-001-readonly-prototype.test.cjs
 * Reads the actual prototype source and executes its inline script in a sandbox.
 * No network, no browser, no canonical mutation.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, "av-ui-001-readonly-prototype.html"), "utf8");
const fixture = JSON.parse(fs.readFileSync(path.join(dir, "av-ui-001-dependency-fixture.json"), "utf8"));
assert.equal(fixture.schema, "ARKI-MAQUETA-DRAFT-1");
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, "Inline script must exist");

class Element {
  constructor(tag = "div") {
    this.tagName = tag;
    this.children = [];
    this.dataset = {};
    this.style = {};
    this.attributes = {};
    this.listeners = {};
    this.textContent = "";
  }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = [...items]; }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  get innerText() { return [this.textContent, ...this.children.map(x => x.innerText || x.textContent || "")].join(" "); }
}
const elements = new Map();
const document = {
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, new Element(id));
    return elements.get(id);
  },
  createElement(tag) { return new Element(tag); }
};
const sandbox = vm.createContext({ document, console });
vm.runInContext(match[1], sandbox, { timeout: 3000, filename: "av-ui-001-inline.js" });
vm.runInContext("state = {roadmap:{phases:[{id:'F6',status:'FROZEN'},{id:'F1',status:'RECONCILIATION_REQUIRED'}]},updated_at:'TEST_ONLY'};draft = "+JSON.stringify(fixture)+";show();", sandbox, { timeout: 3000 });

const graph = vm.runInContext("localGraph()", sandbox);
const rows = new Map(graph.rows.map(x => [x.id, x]));
assert.deepEqual(Array.from(rows.get("TEST-F10").deps), ["TEST-F1"], "F10 predecessor F1");
assert.equal(rows.get("TEST-F1").affected, 1, "F1 forward impact");
assert.equal(rows.get("TEST-F2").cycle, true, "F2 cycle");
assert.equal(rows.get("TEST-F6").cycle, true, "F6 cycle");
assert.deepEqual(Array.from(rows.get("TEST-MISSING").missing), ["TEST-UNKNOWN"], "Unknown reference");
assert.equal(rows.get("TEST-FROZEN").frozen, true, "Frozen branch");
assert.equal(rows.get("TEST-F10").frozen, false, "Other phases unaffected");
assert.ok(rows.get("TEST-F10").upstreamBlockers.some(x=>x.includes("VERIFICATION_UNKNOWN")), "F10 must not treat unverified F1 as promotion-ready");
assert.ok(rows.get("TEST-F2").upstreamBlockers.some(x=>x.includes("CYCLE")), "Cyclic dependency inherited");
assert.ok(rows.get("TEST-F10").upstreamBlockers.length>0, "F10 retains unknown verification for F1");
assert.ok(rows.get("TEST-F6").upstreamBlockers.some(x=>x.includes("CYCLE")), "F6 inherited cycle");
vm.runInContext("draft.reviews['TEST-F1'].dependencies=['TEST-MISSING'];show();", sandbox);
const inherited=vm.runInContext("localGraph()", sandbox);
const f10=inherited.rows.find(x=>x.id==="TEST-F10");
assert.ok(f10.upstreamBlockers.some(x=>x.includes("TEST-UNKNOWN")&&x.includes("MISSING")), "F10 inherits missing predecessor via F1");
vm.runInContext("draft.reviews['TEST-F1'].dependencies=[];show();", sandbox);


const tree = document.getElementById("tree");
assert.equal(tree.children.filter(x => x.tagName === "button").length, 10, "Ten phase buttons");
const f10Button = tree.children.find(x => x.tagName === "button" && x.children.some(y => y.textContent === "F10"));
assert.ok(f10Button, "F10 rendered");
f10Button.listeners.click();
assert.equal(vm.runInContext("selected", sandbox), "F10", "Phase selection works");
const branch = document.getElementById("tree").children.flatMap(x => x.children).find(x => x.tagName === "button" && x.textContent.includes("TEST-F10"));
assert.ok(branch, "F10 branch rendered");
branch.listeners.click();
assert.equal(vm.runInContext("selectedBranch", sandbox), "TEST-F10", "Branch selection works");
assert.match(document.getElementById("memory").innerText, /TEST-F1/, "Left panel shows predecessor");
assert.match(document.getElementById("tree").innerText, /Conexiones de TEST-F10/, "Contextual connections rendered");
assert.match(document.getElementById("decisions").innerText, /DESHABILITADA/, "Canonical promotion remains disabled");
vm.runInContext("registry={schema:'ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1',ideas:[{id:'I-01',title:'Idea de prueba',targetPhase:'F10',origin:'TEST',sourceStatus:'DOCUMENTARY',verification:'UNKNOWN'}]};show()",sandbox);
const leaf = document.getElementById("tree").children.flatMap(x=>x.children).find(x=>x.tagName==="button"&&x.textContent.includes("I-01"));
assert.ok(leaf,"Historical leaf rendered on F10");
leaf.listeners.click();
assert.equal(vm.runInContext("selectedLeaf",sandbox),"I-01","Leaf selection works");
assert.match(document.getElementById("memory").innerText,/Idea de prueba/,"Leaf provenance shown");
assert.match(document.getElementById("decisions").innerText,/NO ACREDITADO/,"Fruit is not falsely verified");
console.log("AV-UI-001: assertions PASS (synthetic fixture, sandbox DOM; not browser E3).");
