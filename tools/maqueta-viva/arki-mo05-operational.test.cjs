"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {project}=require("./arki-mo05-operational.cjs");
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO05 projects five views without canonical authority",()=>{
 const r=project(registry);
 assert.deepEqual(Object.keys(r.views),["plano","arbol","gemelo","cerebro","spatial3d"]);
 assert.equal(r.policy.canonicalMutation,false);assert.equal(r.policy.agkExecution,false);
 assert.equal(r.views.gemelo.simulation,"NOT_EXECUTED");
 assert.equal(r.views.cerebro.learning,"DEFERRED");
});
test("MO05 is deterministic and preserves source",()=>{
 const before=JSON.stringify(registry),a=project(registry),b=project(registry);
 assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(JSON.stringify(registry),before);
 assert.equal(a.summary.total,registry.ideas.length+registry.components.length);
});
test("MO05 releases IDEA planning holds only, never approvals",()=>{
 const fixture={ideas:[{id:"I-A",targetPhase:"F1",sourceStatus:"FROZEN",dependencies:[]}],components:[{id:"C-B",targetPhase:"F2",sourceStatus:"FROZEN",dependencies:["I-A"]}]};
 const r=project(fixture),a=r.views.arbol.activities;
 assert.equal(a[0].id,"I-A");assert.equal(a[1].id,"C-B");
 assert.equal(a[0].planningHold,"RELEASED_BY_PO_FOR_PLANNING");
 assert.equal(a[1].planningHold,"PROTECTED_TECHNICAL");
 assert(a.every(x=>x.executionAuthorized===false));
 assert.deepEqual(a[0].successors,["C-B"]);
});
test("MO05 does not falsely certify cycles or simulations",()=>{
 const fixture={ideas:[{id:"A",targetPhase:"F1",dependencies:["B"]},{id:"B",targetPhase:"F1",dependencies:["A"]}],components:[]};
 const r=project(fixture);
 assert.equal(r.summary.cycle,true);assert.equal(r.summary.unsequenced,2);
 assert.equal(r.views.plano.status,"BLOCKED_CYCLE");
 assert.equal(r.views.gemelo.alternatives.length,0);
});
