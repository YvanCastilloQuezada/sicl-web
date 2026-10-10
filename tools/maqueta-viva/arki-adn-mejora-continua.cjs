"use strict";
/**
 * ARKI ADN-MC-001 experimental reference engine.
 * Pure deterministic A0/A1/A2 evaluator. NO Core/AGK writes, no background scheduler,
 * no code editing, no FROZEN mutation, no canonical promotion.
 */
const {createHash}=require("node:crypto");
const SCHEMA="ARKI-ADN-MC-001";
const MAX_OBSERVATIONS=100,MAX_CYCLES=12;
function hash(v){return createHash("sha256").update(JSON.stringify(v)).digest("hex")}
function assert(x,message){if(!x)throw Error(message)}
function normalize(input){
 assert(input&&input.schema==="ARKI-ADN-OBSERVATION-1","INVALID_OBSERVATION_SCHEMA");
 assert(Array.isArray(input.metrics)&&input.metrics.length>=1&&input.metrics.length<=MAX_OBSERVATIONS,"INVALID_METRICS");
 assert(typeof input.sourceCommit==="string"&&/^[0-9a-f]{40}$/.test(input.sourceCommit),"INVALID_SOURCE_COMMIT");
 assert(typeof input.observationId==="string"&&/^[A-Za-z0-9_-]{1,80}$/.test(input.observationId),"INVALID_OBSERVATION_ID");
 const seen=new Set();
 const metrics=input.metrics.map(m=>{
  assert(m&&typeof m.id==="string"&&/^[A-Za-z0-9_-]{1,80}$/.test(m.id)&&!seen.has(m.id),"INVALID_METRIC_ID");
  seen.add(m.id);
  assert(["MINIMIZE","MAXIMIZE"].includes(m.direction),"INVALID_DIRECTION");
  assert(Number.isFinite(m.value)&&Number.isFinite(m.target),"INVALID_METRIC_VALUE");
  assert(typeof m.unit==="string"&&m.unit.length>0&&m.unit.length<=40,"INVALID_UNIT");
  assert(typeof m.verified==="boolean","INVALID_VERIFICATION");
  assert(m.value>=0&&m.target>=0,"NEGATIVE_METRIC_NOT_SUPPORTED");
  return {id:m.id,value:m.value,target:m.target,direction:m.direction,unit:m.unit,verified:m.verified};
 });
 return {schema:input.schema,observationId:input.observationId,sourceCommit:input.sourceCommit,metrics};
}
function deficit(m){
 if(!m.verified)return {metricId:m.id,status:"UNKNOWN",reason:"MEASUREMENT_NOT_VERIFIED"};
 const gap=m.direction==="MINIMIZE"?m.value-m.target:m.target-m.value;
 if(gap<=0)return null;
 return {metricId:m.id,status:"DEFICIT_IDENTIFIED",gap,unit:m.unit};
}
function candidate(m,ratio){
 const gap=m.direction==="MINIMIZE"?m.value-m.target:m.target-m.value;
 const proposed=m.direction==="MINIMIZE"?m.value-ratio*gap:m.value+ratio*gap;
 return {id:m.id+"-R"+Math.round(ratio*100),metricId:m.id,proposedValue:Number(proposed.toPrecision(12)),unit:m.unit,kind:"HYPOTHETICAL_TARGET_ONLY",execution:"NOT_EXECUTED",requiresAuthorization:true};
}
function propose(input){
 const obs=normalize(input),deficits=obs.metrics.map(deficit).filter(Boolean);
 const proposals=deficits.filter(d=>d.status==="DEFICIT_IDENTIFIED").flatMap(d=>{
  const metric=obs.metrics.find(m=>m.id===d.metricId);
  return [candidate(metric,0.25),candidate(metric,0.5)];
 });
 return {schema:SCHEMA,observationId:obs.observationId,sourceCommit:obs.sourceCommit,observationDigest:hash(obs),deficits,proposals,generatedBy:"DETERMINISTIC_ADN_MC_REFERENCE",proposalStatus:"HYPOTHESIS_ONLY",execution:"NOT_EXECUTED",canonicalMutation:false,canonicalPromotion:"BLOCKED"};
}
function evaluate(proposal,receipt){
 assert(proposal&&proposal.schema===SCHEMA&&proposal.canonicalMutation===false,"INVALID_PROPOSAL");
 assert(receipt&&receipt.schema==="ARKI-ADN-EXPERIMENT-RECEIPT-1","INVALID_RECEIPT");
 assert(receipt.observationDigest===proposal.observationDigest,"BASELINE_MISMATCH");
 assert(typeof receipt.candidateId==="string"&&proposal.proposals.some(c=>c.id===receipt.candidateId),"UNKNOWN_CANDIDATE");
 assert(["SUCCESS","FAILURE","UNKNOWN"].includes(receipt.outcome),"INVALID_OUTCOME");
 assert(receipt.authorization==="EXTERNAL_APPROVED","AUTHORIZATION_REQUIRED");
 assert(receipt.producerIdentity==="AUTHENTICATED_BY_EXTERNAL_VERIFIER","PRODUCER_IDENTITY_UNVERIFIED");
 assert(receipt.evidenceDigest&&/^[0-9a-f]{64}$/.test(receipt.evidenceDigest),"EVIDENCE_MISSING");
 assert(receipt.sourceCommit===proposal.sourceCommit,"SOURCE_COMMIT_MISMATCH");
 assert(receipt.regressionCount===0&&receipt.safetyGate==="PASS","REGRESSION_OR_SAFETY_GATE_FAILED");
 assert(Number.isFinite(receipt.before)&&Number.isFinite(receipt.after),"INVALID_RESULT");
 const result=receipt.outcome==="SUCCESS"?"EVIDENCE_SUBMITTED_REQUIRES_INDEPENDENT_REVIEW":"REJECTED";
 return {schema:"ARKI-ADN-LEARNING-1",candidateId:receipt.candidateId,baseline:receipt.before,observed:receipt.after,evidenceDigest:receipt.evidenceDigest,status:result,learningVerified:false,canonicalPromotion:"BLOCKED",canonicalMutation:false};
}
function iterate(input,limit=2){
 assert(Number.isInteger(limit)&&limit>=1&&limit<=MAX_CYCLES,"INVALID_CYCLE_LIMIT");
 let obs=normalize(input);
 const cycles=[];
 for(let i=0;i<limit;i++){
  const result=propose(obs);
  cycles.push({iteration:i+1,observationId:obs.observationId,deficits:result.deficits,proposals:result.proposals,observationDigest:result.observationDigest,execution:"NOT_EXECUTED",learning:"NOT_VERIFIED",canonicalMutation:false});
  // No new observation = no legitimate next learning cycle. Stop rather than fabricate progress.
  break;
 }
 return {schema:"ARKI-ADN-ITERATION-1",cycles,stopReason:"AWAITING_INDEPENDENT_OBSERVATION_AND_AUTHORIZED_EXPERIMENT",canonicalPromotion:"BLOCKED",canonicalMutation:false};
}
function nextObservation(previous,newInput){
 const obs=normalize(newInput);
 assert(previous&&previous.schema==="ARKI-ADN-ITERATION-1"&&previous.cycles.length>0,"INVALID_PREVIOUS_CYCLE");
 assert(obs.observationId!==previous.cycles.at(-1).observationId,"DUPLICATE_OBSERVATION");
 assert(hash(obs)!==previous.cycles.at(-1).observationDigest,"NO_NEW_EVIDENCE");
 const result=propose(obs);
 return {schema:"ARKI-ADN-ITERATION-1",cycles:[...previous.cycles,{iteration:previous.cycles.length+1,observationId:obs.observationId,deficits:result.deficits,proposals:result.proposals,observationDigest:result.observationDigest,execution:"NOT_EXECUTED",learning:"NOT_VERIFIED",canonicalMutation:false}],stopReason:"AWAITING_INDEPENDENT_OBSERVATION_AND_AUTHORIZED_EXPERIMENT",canonicalPromotion:"BLOCKED",canonicalMutation:false};
}
function compareObservations(beforeInput,afterInput){
 const before=normalize(beforeInput),after=normalize(afterInput);
 assert(before.observationId!==after.observationId,"DUPLICATE_OBSERVATION");
 const old=new Map(before.metrics.map(m=>[m.id,m]));
 assert(old.size===after.metrics.length,"METRIC_SET_MISMATCH");
 const comparisons=[];
 for(const m of after.metrics){
  const b=old.get(m.id);
  assert(b&&b.unit===m.unit&&b.direction===m.direction&&b.target===m.target,"METRIC_CONTRACT_CHANGED");
  const delta=m.direction==="MINIMIZE"?b.value-m.value:m.value-b.value;
  const state=!b.verified||!m.verified?"UNKNOWN":delta>0?"IMPROVED":delta<0?"REGRESSED":"UNCHANGED";
  comparisons.push({metricId:m.id,state,delta:Number(delta.toPrecision(12)),unit:m.unit});
 }
 const regressions=comparisons.filter(x=>x.state==="REGRESSED");
 const unknown=comparisons.filter(x=>x.state==="UNKNOWN");
 const improvements=comparisons.filter(x=>x.state==="IMPROVED");
 return {schema:"ARKI-ADN-COMPARISON-1",baselineDigest:hash(before),candidateDigest:hash(after),comparisons,summary:{improvements:improvements.length,regressions:regressions.length,unknown:unknown.length},recommendation:regressions.length?"REJECT_REGRESSION":unknown.length?"INSUFFICIENT_EVIDENCE":improvements.length?"INDEPENDENT_REVIEW_REQUIRED":"NO_DEMONSTRATED_IMPROVEMENT",learningVerified:false,canonicalPromotion:"BLOCKED",canonicalMutation:false};
}
module.exports={SCHEMA,normalize,propose,evaluate,iterate,nextObservation,compareObservations};
