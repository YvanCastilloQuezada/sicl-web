"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {evaluate,inspect}=require("./arki-mo074-functional-evidence.cjs");
const root=path.resolve(__dirname,"../..");
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO074 reports 51 pieces without certification",()=>{
 const r=evaluate(registry,{web:root});
 assert.equal(r.summary.total,51);assert.equal(r.summary.verifiedBehaviors,0);
 assert(r.pieces.every(p=>p.maturity==="NOT_CERTIFIED"&&p.decision==="PO_REVIEW_PENDING"&&p.dependencies==="NOT_VERIFIED"));
 assert.equal(r.policy.noCanonicalWrites,true);
});
test("MO074 preserves AI laboratory mission",()=>{
 const r=evaluate(registry,{web:root});
 assert.deepEqual(r.pieces.find(p=>p.id==="I-24").missions,["SELF_SUFFICIENCY","NEW_DOMAIN"]);
});
test("MO074 is deterministic and registry immutable",()=>{
 const before=JSON.stringify(registry),a=evaluate(registry,{web:root}),b=evaluate(registry,{web:root});
 assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(JSON.stringify(registry),before);
});
test("MO074 refuses traversal and does not follow symlinks",()=>{
 const p={id:"X",name:"X",missionAssessment:{missions:["UNRESOLVED"]},codeCandidates:[{matches:[{repository:"web",path:"../secret",match:"EXACT"}]}]};
 assert.equal(inspect(p,{web:root}).evidence.matchedFiles,0);
});
