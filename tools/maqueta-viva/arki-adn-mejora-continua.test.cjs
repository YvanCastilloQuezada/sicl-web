"use strict";
const assert=require("node:assert/strict");
const {propose,evaluate,iterate,nextObservation,compareObservations}=require("./arki-adn-mejora-continua.cjs");
const baseline={schema:"ARKI-ADN-OBSERVATION-1",observationId:"O-001",sourceCommit:"a".repeat(40),metrics:[
 {id:"cost",value:120,target:100,direction:"MINIMIZE",unit:"USD-m2",verified:true},
 {id:"comfort",value:65,target:80,direction:"MAXIMIZE",unit:"percent",verified:true},
 {id:"geometry",value:10,target:10,direction:"MAXIMIZE",unit:"score",verified:true},
 {id:"unknown",value:5,target:3,direction:"MINIMIZE",unit:"score",verified:false}
]};
const snapshot=JSON.stringify(baseline);
const first=propose(baseline);
assert.equal(first.schema,"ARKI-ADN-MC-001");
assert.equal(first.proposals.length,4);
assert.equal(first.deficits.filter(d=>d.status==="UNKNOWN").length,1);
assert.equal(first.proposals.every(c=>c.execution==="NOT_EXECUTED"&&c.requiresAuthorization),true);
assert.equal(first.canonicalPromotion,"BLOCKED");
assert.equal(first.canonicalMutation,false);
assert.equal(JSON.stringify(baseline),snapshot);
const sequence=iterate(baseline,12);
assert.equal(sequence.cycles.length,1,"Cannot fake cycles without new observations");
assert.equal(sequence.stopReason,"AWAITING_INDEPENDENT_OBSERVATION_AND_AUTHORIZED_EXPERIMENT");
assert.throws(()=>nextObservation(sequence,baseline),/DUPLICATE_OBSERVATION/);
const newer={...baseline,observationId:"O-002",metrics:baseline.metrics.map(m=>m.id==="cost"?{...m,value:110}:m)};
const comparison=compareObservations(baseline,newer);
assert.equal(comparison.summary.improvements,1);
assert.equal(comparison.summary.unknown,1);
assert.equal(comparison.recommendation,"INSUFFICIENT_EVIDENCE");
assert.equal(comparison.learningVerified,false);
const regressed={...newer,observationId:"O-003",metrics:newer.metrics.map(m=>m.id==="comfort"?{...m,value:60}:m)};
assert.equal(compareObservations(baseline,regressed).recommendation,"REJECT_REGRESSION");
assert.throws(()=>compareObservations(baseline,{...newer,metrics:newer.metrics.map(m=>m.id==="cost"?{...m,unit:"EUR-m2"}:m)}),/METRIC_CONTRACT_CHANGED/);
const second=nextObservation(sequence,newer);
assert.equal(second.cycles.length,2);
assert.equal(second.cycles[1].proposals.find(c=>c.id==="cost-R50").proposedValue,105);
assert.equal(second.canonicalMutation,false);
const evidence={schema:"ARKI-ADN-EXPERIMENT-RECEIPT-1",observationDigest:first.observationDigest,candidateId:first.proposals[0].id,outcome:"SUCCESS",authorization:"EXTERNAL_APPROVED",producerIdentity:"AUTHENTICATED_BY_EXTERNAL_VERIFIER",evidenceDigest:"f".repeat(64),sourceCommit:baseline.sourceCommit,regressionCount:0,safetyGate:"PASS",before:120,after:110};
assert.throws(()=>evaluate(first,{...evidence,authorization:"NONE"}),/AUTHORIZATION_REQUIRED/);
assert.throws(()=>evaluate(first,{...evidence,producerIdentity:"SELF_CLAIM"}),/PRODUCER_IDENTITY_UNVERIFIED/);
assert.throws(()=>evaluate(first,{...evidence,regressionCount:1}),/REGRESSION_OR_SAFETY_GATE_FAILED/);
assert.throws(()=>evaluate(first,{...evidence,sourceCommit:"b".repeat(40)}),/SOURCE_COMMIT_MISMATCH/);
assert.throws(()=>evaluate(first,{...evidence,observationDigest:"f".repeat(64)}),/BASELINE_MISMATCH/);
const review=evaluate(first,evidence);
assert.equal(review.learningVerified,false);
assert.equal(review.status,"EVIDENCE_SUBMITTED_REQUIRES_INDEPENDENT_REVIEW");
assert.equal(review.canonicalPromotion,"BLOCKED");
assert.equal(review.canonicalMutation,false);
assert.throws(()=>propose({...baseline,metrics:[baseline.metrics[0],baseline.metrics[0]]}),/INVALID_METRIC_ID/);
assert.throws(()=>propose({...baseline,metrics:[{...baseline.metrics[0],value:NaN}]}),/INVALID_METRIC_VALUE/);
const {mkdtempSync,writeFileSync,readFileSync,rmSync}=require("node:fs");
const {tmpdir}=require("node:os");
const {join}=require("node:path");
const {spawnSync}=require("node:child_process");
const dir=mkdtempSync(join(tmpdir(),"arki-adn-mc-"));
try{
 const input=join(dir,"observation.json"),output=join(dir,"report.json");
 writeFileSync(input,JSON.stringify(baseline));
 const cmd=join(__dirname,"Run-ARKI-ADN-MC.cjs");
 const result=spawnSync(process.execPath,[cmd,input,output],{encoding:"utf8",timeout:10000});
 assert.equal(result.status,0,result.stderr);
 const report=JSON.parse(readFileSync(output,"utf8"));
 assert.equal(report.proposals.proposals.length,4);
 assert.equal(report.autonomousInitiation,false);
 assert.equal(report.canonicalPromotion,"BLOCKED");
 assert.notEqual(spawnSync(process.execPath,[cmd,input,output],{encoding:"utf8"}).status,0,"Must not overwrite existing reports");
}finally{rmSync(dir,{recursive:true,force:true})}
console.log("ARKI_ADN_MC_001=PASS; PROPOSALS_ONLY; NO_CANONICAL_MUTATION; NO_FAKE_AUTONOMOUS_RUNTIME");
