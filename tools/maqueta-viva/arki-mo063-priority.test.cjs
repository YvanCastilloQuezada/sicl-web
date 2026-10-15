"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {prioritize}=require("./arki-mo063-priority.cjs");
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO063 puts evidence recovery before scope review",()=>{
 const r=prioritize(registry);assert.equal(r.summary.workstreams,2);
 assert.equal(r.queue[0].issueCode,"DEPENDENCIES_UNDECLARED");
 assert.equal(r.queue[1].issueCode,"EXPLICITLY_OUT_OF_SCOPE");
});
test("MO063 never invents dependencies or critical path",()=>{
 const r=prioritize(registry);assert.equal(r.policy.inferredDependencies,false);
 assert.equal(r.policy.criticalPathVerified,false);assert.equal(r.policy.canonicalMutation,false);
 assert(r.queue.every(x=>x.candidateDependencies.length===0&&x.evidenceStatus==="NOT_VERIFIED"&&x.automaticExecution===false));
});
test("MO063 determinism and registry immutability",()=>{
 const before=JSON.stringify(registry),a=prioritize(registry),b=prioritize(registry);
 assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(JSON.stringify(registry),before);
});
test("MO063 clean graph has empty investigation queue",()=>{
 const r=prioritize({ideas:[{id:"A",targetPhase:"F1",dependencies:[]}],components:[]});
 assert.equal(r.summary.workstreams,0);assert.equal(r.queue.length,0);
});
