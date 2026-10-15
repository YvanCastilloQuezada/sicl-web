"use strict";
/** Evidence-seeking research agenda. Missing dependencies stay UNKNOWN. */
const crypto=require("node:crypto");
const {proposeRelations}=require("./arki-relational-learning.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function buildAgenda({registry,pulse,statements=[]}){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components)||!pulse||pulse.schema!=="ARKI-INTEGRATED-DIAGNOSIS-1"||pulse.heartbeat!=="ADVISORY_PULSE_COMPLETED"||pulse.restartReplay!=="VERIFIED"||pulse.policy?.canonicalMutation!==false||pulse.policy?.agkExecuted!==false||!Array.isArray(pulse.priority))throw Error("UNVERIFIED_PULSE");
 const byId=new Map([...registry.ideas,...registry.components].map(x=>[x.id,x]));
 const priority=pulse.priority.slice(0,5);
 if(new Set(priority.map(x=>x.id)).size!==priority.length||priority.some(x=>!byId.has(x.id)||x.dependencyState!=="UNDECLARED"))throw Error("UNTRUSTED_PRIORITY");
 const relations=proposeRelations(registry,statements);
 const tasks=priority.map((p,i)=>{
  const part=byId.get(p.id);
  const candidates=relations.candidates.filter(x=>x.after===p.id);
  return {rank:i+1,id:p.id,title:part.title||p.id,phase:p.phase,sourceStatus:part.sourceStatus||"UNKNOWN",origin:part.origin||null,purpose:part.purpose||null,question:"What evidenced prerequisites are required before "+p.id+" can be evaluated?",sourceReviewRequired:true,candidateRelationIds:candidates.map(x=>x.id),dependencyDecision:"UNDECLARED_PENDING_EVIDENCE",competence:"NOT_VERIFIED",suggestedNextStep:candidates.length?"REVIEW_SOURCE_CLAIMS_AND_TEST_PREREQUISITES":"RETRIEVE_PRIMARY_SOURCES_AND_DOCUMENT_PREREQUISITES",automaticPromotion:false};
 });
 const result={schema:"ARKI-F1-RESEARCH-AGENDA-1",pulseReceipt:pulse.planReceipt,scope:"F1_PRIORITY_EVIDENCE_RESEARCH",tasks,relationCandidates:relations.candidates,relationIssues:relations.issues,relationCycles:relations.cycles,limitations:["SOURCE_CLAIMS_NOT_VERIFIED","NO_DELTA_6_2_COMPETENCE_TEST","NO_AGK_EXECUTION"],canonicalMutation:false,poApproval:"NOT_GRANTED"};
 result.receiptSha256=sha(result);return result;
}
module.exports={buildAgenda};
if(require.main===module){
 try{
  const fs=require("node:fs"),path=require("node:path");
  const [pulseFile,statementsFile]=process.argv.slice(2);
  if(!pulseFile||process.argv.length>4)throw Error("USAGE: node arki-f1-research-agenda.cjs PULSE_JSON [SOURCE_STATEMENTS_JSON]");
  function read(f){const s=fs.lstatSync(f);if(!s.isFile()||s.isSymbolicLink()||s.size>2000000)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(f,"utf8"))}
  const registry=read(path.join(__dirname,"assembly-registry.json"));
  const pulse=read(pulseFile),statements=statementsFile?read(statementsFile):[];
  process.stdout.write(JSON.stringify(buildAgenda({registry,pulse,statements}),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_RESEARCH_AGENDA_FAIL: "+e.message+"\n");process.exitCode=1}
}
