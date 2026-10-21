"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {reconcile}=require("./Reconcile-ARKI-Branches.cjs");
test("reject git revision injection",()=>assert.throws(()=>reconcile("HEAD~1","HEAD"),/INVALID_REF/));
test("reject revision ranges",()=>assert.throws(()=>reconcile("HEAD..main","main"),/INVALID_REF/));
test("same ref has zero divergence and no changes",()=>{
 const r=reconcile("HEAD","HEAD");
 assert.equal(r.ahead,0);assert.equal(r.behind,0);assert.deepEqual(r.changedPaths,[]);
 assert.equal(r.mergePerformed,false);assert.equal(r.actualMergeConflicts,"NOT_EVALUATED");
});
