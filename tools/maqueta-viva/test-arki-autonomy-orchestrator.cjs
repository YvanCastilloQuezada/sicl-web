"use strict";
const assert=require("node:assert/strict");
const {test}=require("node:test");
const {orchestrate}=require("./arki-autonomy-orchestrator.cjs");
const discovery={schema:"ARKI-CAPABILITY-DISCOVERY-1",totalFiles:1,unclassified:0,sourceSnapshot:"fixture"};
const part={id:"A",path:"src/a.ts",phase:"F2",dependencies:[]};
test("unverified evidence fails closed",()=>{const r=orchestrate({parts:[part],discovery});assert.equal(r.work[0].action,"EVIDENCE_OR_AUTHORITY_REVIEW");assert.equal(r.canonicalMutation,false)});
test("verified evidence only permits isolated experiment candidate",()=>{const r=orchestrate({parts:[part],discovery,evidence:{A:{verified:true,commit:"a".repeat(40),testReceipt:"ci:123",source:"src/a.ts"}}});assert.equal(r.work[0].action,"ISOLATED_EXPERIMENT_CANDIDATE");assert.equal(r.execution,"NOT_EXECUTED")});
test("legacy frozen with verified evidence may enter isolated experiment",()=>{
  const r=orchestrate({parts:[{...part,frozen:true}],discovery,
    evidence:{A:{verified:true,commit:"a".repeat(40),testReceipt:"ci:123",source:"src/a.ts"}}});
  assert.equal(r.work[0].action,"ISOLATED_EXPERIMENT_CANDIDATE");
  assert.equal(r.execution,"NOT_EXECUTED");
  assert.equal(r.canonicalMutation,false);
});
test("legacy frozen without evidence remains blocked",()=>{
  const r=orchestrate({parts:[{...part,frozen:true}],discovery});
  assert.equal(r.work[0].action,"EVIDENCE_OR_AUTHORITY_REVIEW");
});
test("legacy frozen with missing dependency remains blocked",()=>{
  const r=orchestrate({parts:[{...part,frozen:true,dependencies:["MISSING"]}],discovery,
    evidence:{A:{verified:true,commit:"a".repeat(40),testReceipt:"ci:123",source:"src/a.ts"}}});
  assert.equal(r.work[0].action,"EVIDENCE_OR_AUTHORITY_REVIEW");
  assert.ok(r.issues.some(x=>x.code==="MISSING_DEPENDENCY"));
});
test("deterministic result",()=>{const a=orchestrate({parts:[part],discovery});const b=orchestrate({parts:[part],discovery});assert.deepEqual(a,b)});
test("missing dependency cannot advance",()=>{const r=orchestrate({parts:[{...part,dependencies:["MISSING"]}],discovery});assert.equal(r.work[0].action,"EVIDENCE_OR_AUTHORITY_REVIEW");assert.ok(r.issues.length>0)});
