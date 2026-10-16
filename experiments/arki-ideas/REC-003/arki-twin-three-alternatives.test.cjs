"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {evaluateThree}=require("./arki-twin-three-alternatives.cjs");
const sourceCommit="a".repeat(40),baseline={timeMs:100,cost:100,quality:70};
const alt=(id,evidenceLevel="HYPOTHETICAL")=>({id,timeMs:80,cost:110,quality:80,risk:20,testsPassed:10,testsTotal:10,evidenceLevel,...(evidenceLevel==="MEASURED"?{evidence:{digest:"b".repeat(64),sourceCommit,verifiedBy:"INDEPENDENT_VERIFIER"}}:{})});
const run=(alternatives,dependencyGate="PASS")=>evaluateThree({ideaId:"I-01",sourceCommit,baseline,dependencyGate,alternatives});
test("exactly three required",()=>assert.throws(()=>run([alt("A"),alt("B")]),/EXACTLY_THREE/));
test("hypotheses never appear as measured",()=>{const r=run([alt("A"),alt("B"),alt("C")]);assert.equal(r.status,"SIMULATION_EVIDENCE_INCOMPLETE");assert.equal(r.alternatives[0].eligibleForOwnerDecision,false);assert.equal(r.selectedAlternative,null)});
test("three measured alternatives presented without auto-selection",()=>{const r=run([alt("A","MEASURED"),alt("B","MEASURED"),alt("C","MEASURED")]);assert.equal(r.status,"MEASUREMENTS_CLAIMED_INDEPENDENT_VERIFICATION_REQUIRED");assert.equal(r.alternatives.length,3);assert.equal(r.alternatives[0].metrics.speedImprovementPct,20);assert.equal(r.alternatives[0].metrics.costChangePct,10);assert.equal(r.selectedAlternative,null);assert.equal(r.canonicalMutation,false)});
test("unverified measurement rejected",()=>{const a=alt("A","MEASURED");a.evidence.verifiedBy="UNKNOWN";assert.throws(()=>run([a,alt("B"),alt("C")]),/MEASURED_EVIDENCE/)});
test("dependency block prevents owner eligibility",()=>{const r=run([alt("A","MEASURED"),alt("B","MEASURED"),alt("C","MEASURED")],"BLOCKED");assert.equal(r.status,"DEPENDENCIES_BLOCKED");assert(r.alternatives.every(a=>!a.eligibleForOwnerDecision))});
test("duplicate alternative rejected",()=>assert.throws(()=>run([alt("A"),alt("A"),alt("C")]),/INVALID_ALTERNATIVE_ID/));
test("invalid metrics rejected",()=>{const a=alt("A");a.risk=101;assert.throws(()=>run([a,alt("B"),alt("C")]),/INVALID_METRICS/)});

test("forged verifier string cannot authorize owner decision",()=>{const r=run([alt("A","MEASURED"),alt("B","MEASURED"),alt("C","MEASURED")]);assert(r.alternatives.every(x=>x.eligibleForOwnerDecision===false));assert(r.alternatives.every(x=>x.evidenceVerification==="CLAIM_ONLY_NOT_INDEPENDENTLY_VERIFIED"));});
