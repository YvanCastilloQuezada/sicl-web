"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {investigate}=require("./arki-av008-investigate.cjs");
const head="a".repeat(40);
const baseline={schema:"ARKI-AV006-DIAGNOSTIC-1",webHead:head,receiptSha256:"receipt",modules:[],incidents:[]};
test("AV-008 healthy diagnostics never invent incidents",()=>{
 const r=investigate(baseline);assert.equal(r.summary.incidents,0);assert.equal(r.summary.strategiesProposed,0);assert.equal(r.policy.canonicalMutation,false);
});
test("AV-008 confirmed failure generates three investigations, not repairs",()=>{
 const testPath="tools/maqueta-viva/example.test.cjs";
 const r=investigate({...baseline,modules:[{test:testPath,status:"TEST_FAILED",outcome:"FAIL"}],incidents:[{test:testPath,kind:"CONFIRMED_TEST_FAILURE"}]});
 assert.equal(r.summary.strategiesProposed,3);assert.equal(r.cases[0].rootCause,"UNKNOWN");assert.deepEqual(r.cases[0].repairCandidates,[]);assert.equal(r.policy.experimentsExecuted,false);
});
test("AV-008 rejects unsupported and duplicate incidents",()=>{
 const bad={...baseline,incidents:[{test:"unknown",kind:"CONFIRMED_TEST_FAILURE"}]};
 assert.throws(()=>investigate(bad),/INCIDENT_WITHOUT_FAILED_TEST/);
 const t="a.test.cjs",m={test:t,status:"TEST_FAILED",outcome:"FAIL"},i={test:t,kind:"CONFIRMED_TEST_FAILURE"};
 assert.throws(()=>investigate({...baseline,modules:[m],incidents:[i,i]}),/UNSUPPORTED_INCIDENT/);
});
