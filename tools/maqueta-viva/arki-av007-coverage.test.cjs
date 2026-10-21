"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {run,allow}=require("./arki-av007-coverage.cjs");
test("AV-007 blocks unknown and duplicate test selections",()=>{
 assert.throws(()=>run(".",["unapproved.test.cjs"]),/UNAUTHORIZED_TEST_SELECTION/);
 assert.throws(()=>run(".",[allow[0],allow[0]]),/UNAUTHORIZED_TEST_SELECTION/);
});
test("AV-007 executes bounded tracked test and emits AV-006 compatible receipt",()=>{
 const r=run(process.cwd(),["arki-av004-evidence.test.cjs"]);
 assert.equal(r.schema,"ARKI-AV005-SELF-TEST-1");
 assert.equal(r.av007.schema,"ARKI-AV007-COVERAGE-1");
 assert.equal(r.results.length,1);
 assert.equal(r.results[0].status,"PASS");
 assert.equal(r.policy.competenceVerified,false);
 assert.equal(r.policy.canonicalPromotion,false);
 assert.match(r.webHead,/^[a-f0-9]{40}$/);
});
