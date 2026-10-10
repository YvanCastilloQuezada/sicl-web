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
vm.runInContext("registry={schema:'ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1',ideas:[{id:'A1',title:'Recuperacion de conocimiento',targetPhase:'F2',sourceStatus:'PROPOSED'},{id:'A2',title:'Recuperacion de conocimiento avanzada',targetPhase:'F2',sourceStatus:'PROPOSED'}]};selected='F2';show()",sandbox);
const suggestions=vm.runInContext("adaptiveCandidates()",sandbox);
assert.ok(suggestions.some(x=>x.a.id==='A1'&&x.b.id==='A2'),"Candidate overlap must be proposed");
assert.match(document.getElementById("adaptive").innerText,/A1 \/ A2/,"Adaptive panel renders pair");
assert.match(document.getElementById("adaptive").innerText,/Sin fusiones/,"No automatic changes");
assert.equal(vm.runInContext("draft.placements['TEST-F6']",sandbox),"F6","Frozen placement unchanged");
vm.runInContext("registry={schema:'ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1',ideas:[{id:'MOVE-01',title:'Normativa por jurisdiccion',targetPhase:'F2',sourceStatus:'DOCUMENTARY',origin:'TEST'}]};selected='F2';show()",sandbox);
const alternatives=vm.runInContext("adaptivePlacementCandidates()",sandbox);
assert.ok(alternatives.some(x=>x.id==='MOVE-01'&&x.from==='F2'&&x.to==='F7'),"Explainable phase alternative proposed");
assert.match(document.getElementById("adaptive").innerText,/MOVE-01/,"Alternative displayed in right panel");
assert.equal(vm.runInContext("registry.ideas[0].targetPhase",sandbox),"F2","No automatic relocation");
vm.runInContext("registry={schema:'ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1',ideas:[{id:'FROZEN-MOVE',title:'Kernel geometria',targetPhase:'F6',sourceStatus:'DOCUMENTARY',origin:'TEST'},{id:'MOVE-01',title:'Normativa por jurisdiccion',targetPhase:'F2',sourceStatus:'DOCUMENTARY',origin:'TEST'}]};show()",sandbox);
const guarded=vm.runInContext("adaptivePlacementCandidates()",sandbox);
assert.ok(guarded.some(x=>x.id==='FROZEN-MOVE'&&x.historicalFrozen===true&&x.decision==='WORKSPACE_REORGANIZATION_ALLOWED'),"Frozen historical item allowed in experimental reorganization");
assert.ok(guarded.some(x=>x.id==='MOVE-01'&&x.risks.includes('NO_VERIFIED_DEPENDENCY_GRAPH')),"Missing dependency evidence explicitly marked");
assert.equal(vm.runInContext("registry.ideas.find(x=>x.id==='FROZEN-MOVE').targetPhase",sandbox),"F6","Frozen phase unchanged");
vm.runInContext("registry={schema:'ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1',ideas:[{id:'X1',title:'Normativa por jurisdiccion',targetPhase:'F2',sourceStatus:'DOCUMENTARY',origin:'TEST'},{id:'X2',title:'Fuentes de conocimiento',targetPhase:'F2',sourceStatus:'DOCUMENTARY',origin:'TEST'}]};draft={schema:'ARKI-MAQUETA-DRAFT-1',placements:{X1:'F2',X2:'F2'},reviews:{X1:{dependencies:['X2']},X2:{dependencies:[]}}};selected='F2';show()",sandbox);
const scenario=vm.runInContext("structuralScenario()",sandbox);
assert.equal(scenario.canonicalMutation,false,"Scenario must never mutate canonical state");
assert.ok(scenario.nodes.some(x=>x.id==='X1'&&x.phase==='F2'&&x.proposedPhase==='F7'&&x.secondaryPhases.includes('F2')),"Proposed primary phase and original cross-phase link");
assert.ok(scenario.nodes.some(x=>x.id==='X1'&&x.dependencies.includes('X2')),"Declared dependencies retained");
assert.equal(vm.runInContext("registry.ideas[0].targetPhase",sandbox),"F2","Source registry unchanged");
assert.match(document.getElementById("adaptive").innerText,/Escenario alternativo integral/,"Scenario summary rendered");
const comparison=vm.runInContext("structuralComparison()",sandbox);
const compared=comparison.find(x=>x.id==='X1');
assert.equal(compared.officialPhase,'F2',"Comparison preserves documentary phase");
assert.equal(compared.alternativePhase,'F7',"Comparison displays proposed phase");
assert.match(compared.benefit,/NO VERIFICADO/,"Benefits cannot be claimed as verified");
assert.match(document.getElementById('adaptive').innerText,/Comparación por pieza/,"Comparison visible in panel");
const impact=vm.runInContext("incrementalImpact({kind:'DEPENDENCY',id:'X2'})",sandbox);
assert.equal(impact.status,'IMPACT_ESTIMATE_ONLY',"Known dependency impact estimated");
assert.deepEqual(Array.from(impact.affected),['X1','X2'],"Transitive dependent included");
assert.ok(impact.phases.includes('F2')&&impact.phases.includes('F7'),"Both official and proposed phases affected");
assert.equal(impact.canonicalMutation,false,"Incremental impact is read only");
const unresolved=vm.runInContext("incrementalImpact({kind:'IDEA',id:'UNKNOWN-NEW'})",sandbox);
assert.equal(unresolved.status,'UNRESOLVED_ID',"Unknown idea cannot be silently inserted");
assert.equal(unresolved.recomputeAll,true,"Unknown idea requests reconciliation");
console.log("AV-UI-001: assertions PASS (synthetic fixture, sandbox DOM; not browser E3).");
