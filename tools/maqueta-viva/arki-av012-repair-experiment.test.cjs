"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {experiment}=require("./arki-av012-repair-experiment.cjs");
test("AV-012 compares three candidates and verifies rollback",()=>{
 const result=experiment();
 assert.equal(result.baseline.status,"FAIL");
 assert.equal(result.candidates.length,3);
 assert.deepEqual(result.candidates.map(x=>x.status),["PASS","FAIL","PASS"]);
 assert.ok(result.candidates.every(x=>x.rollbackVerified));
 assert.equal(result.policy.canonicalMutation,false);
 assert.equal(result.policy.repairPromoted,false);
});
