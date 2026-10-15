"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {reevaluate}=require("./arki-mo065-reevaluate.cjs");
const before={ideas:[{id:"A",dependencies:[]},{id:"B",dependencies:["A"]},{id:"C",dependencies:["B"]},{id:"D",dependencies:[]}],components:[]};
test("MO065 unchanged source produces empty delta",()=>{
 const r=reevaluate(before,structuredClone(before));assert.deepEqual(r.changedIds,[]);assert.deepEqual(r.affectedIds,[]);assert.equal(r.queueChanged,false);
});
test("MO065 propagates only declared downstream adjacency",()=>{
 const after=structuredClone(before);after.ideas[0].note="new evidence";
 const r=reevaluate(before,after);assert.deepEqual(r.changedIds,["A"]);assert.deepEqual(r.affectedIds,["A","B","C"]);assert(r.unchangedIds.includes("D"));
});
test("MO065 missing edges do not imply relationships",()=>{
 const after=structuredClone(before);after.ideas[3].note="changed";
 const r=reevaluate(before,after);assert.deepEqual(r.affectedIds,["D"]);assert.equal(r.policy.unknownDependencies,"NOT_INFERRED");
});
test("MO065 deterministic and rejects duplicate ids",()=>{
 const after=structuredClone(before);after.ideas[0].note="x";
 assert.equal(reevaluate(before,after).receiptSha256,reevaluate(before,after).receiptSha256);
 assert.throws(()=>reevaluate(before,{ideas:[{id:"X"},{id:"X"}],components:[]}),/INVALID_OR_DUPLICATE_ID/);
 assert.equal(reevaluate(before,after).policy.canonicalMutation,false);
});
