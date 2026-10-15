"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {cluster}=require("./arki-mo062-workstreams.cjs");
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO062 aggregates repeated codes without inventing causal proof",()=>{
 const r=cluster(registry);
 assert.equal(r.summary.activities,51);
 assert.equal(r.summary.primaryEvidenceGapActivities,51);
 assert(r.summary.workstreams>0);
 assert.equal(r.policy.sharedCauseVerified,false);
 assert.equal(r.policy.criticalPathVerified,false);
 assert.equal(r.policy.canonicalMutation,false);
});
test("MO062 is deterministic and preserves original registry",()=>{
 const before=JSON.stringify(registry),a=cluster(registry),b=cluster(registry);
 assert.equal(a.receiptSha256,b.receiptSha256);
 assert.equal(JSON.stringify(registry),before);
});
test("MO062 groups repeated undeclared dependencies into one code workstream",()=>{
 const r=cluster({ideas:[{id:"A",targetPhase:"F1"},{id:"B",targetPhase:"F2"}],components:[]});
 assert(r.workstreams.some(w=>w.affectedActivities.includes("A")&&w.affectedActivities.includes("B")));
 assert.equal(r.summary.distinctAffectedActivities,2);
});
test("MO062 clean graph has zero workstreams",()=>{
 const r=cluster({ideas:[{id:"A",targetPhase:"F1",dependencies:[]}],components:[]});
 assert.equal(r.summary.workstreams,0);
});
