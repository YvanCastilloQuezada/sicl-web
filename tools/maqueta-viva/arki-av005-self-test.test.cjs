"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {evaluate,allowed}=require("./arki-av005-self-test.cjs");
test("AV-005 refuses unapproved or duplicate tests",()=>{
 assert.throws(()=>evaluate(".",["../../unsafe.test.cjs"]),/TEST_NOT_ALLOWLISTED/);
 assert.throws(()=>evaluate(".",[allowed[0],allowed[0]]),/TEST_NOT_ALLOWLISTED/);
});
test("AV-005 executes one tracked test and records provenance without competence promotion",()=>{
 const r=evaluate(process.cwd(),["arki-av004-evidence.test.cjs"]);
 assert.match(r.webHead,/^[a-f0-9]{40}$/);
 assert.equal(r.results.length,1);
 assert.equal(r.results[0].status,"PASS");
 assert.equal(r.summary.failed,0);
 assert.equal(r.policy.competenceVerified,false);
 assert.equal(r.policy.canonicalPromotion,false);
 assert.match(r.receiptSha256,/^[a-f0-9]{64}$/);
});
