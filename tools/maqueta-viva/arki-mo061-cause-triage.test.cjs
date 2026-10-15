"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {diagnose}=require("./arki-mo061-cause-triage.cjs");
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO061 deterministic classification preserves registry",()=>{
 const original=JSON.stringify(registry),a=diagnose(registry),b=diagnose(registry);
 assert.equal(a.receiptSha256,b.receiptSha256);
 assert.equal(JSON.stringify(registry),original);
 assert.equal(a.summary.activities,51);
 assert.equal(a.policy.canonicalMutation,false);
});
test("MO061 distinguishes direct evidence gap from downstream dependency",()=>{
 const r=diagnose({ideas:[{id:"A",targetPhase:"F1",dependencies:["MISSING"]},{id:"B",targetPhase:"F2",dependencies:["A"]}],components:[]});
 assert(r.primaryEvidenceGaps.some(x=>x.id==="A"));
 const b=r.downstreamConsequences.find(x=>x.id==="B");
 assert(b);assert.deepEqual(b.upstreamEvidenceGaps,["A"]);
});
test("MO061 preserves epistemic gates",()=>{
 const r=diagnose(registry);
 assert.equal(r.policy.classification,"STRUCTURAL_ONLY_NOT_CAUSAL_PROOF");
 assert.equal(r.policy.automaticRepair,false);
 assert.equal(r.policy.poApproval,"REQUIRED");
});
test("MO061 clean graph has no invented evidence gaps",()=>{
 const r=diagnose({ideas:[{id:"A",targetPhase:"F1",dependencies:[]},{id:"B",targetPhase:"F2",dependencies:["A"]}],components:[]});
 assert.equal(r.primaryEvidenceGaps.length,0);
 assert.equal(r.downstreamConsequences.length,0);
});
