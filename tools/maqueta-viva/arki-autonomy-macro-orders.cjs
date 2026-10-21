"use strict";
// Macro-order executor: plans and writes an idempotent operational journal only.
// It never executes code or promotes canonical state.
const {orchestrate}=require("./arki-autonomy-orchestrator.cjs");
const store=require("./arki-automejora-operativa.cjs");
const COMMANDS=new Set(["AUDIT_AND_PLAN","REASSESS"]);
function runMacroOrder({command,parts,discovery,phaseRules={},evidence={},memoryFile,sourceSha}){
 if(!COMMANDS.has(command)||!/^[0-9a-f]{40}$/.test(sourceSha||""))throw Error("INVALID_MACRO_ORDER");
 if(typeof memoryFile!=="string"||!memoryFile)throw Error("MEMORY_FILE_REQUIRED");
 const plan=orchestrate({parts,discovery,phaseRules,evidence});
 const planDigest=plan.digest;
 const events=[{
  type:"OBSERVATION",subject:"ARKI_AUTONOMY",sourceSha,evidenceRef:"plan:"+planDigest,
  payload:{idempotencyKey:"macro-order:"+command+":"+planDigest+":observation",command,planDigest,
   epistemicState:"PLAN_ONLY_NOT_FACT",parts:plan.work.length,execution:plan.execution}
 }];
 for(const item of plan.work){
  const type=item.action==="ISOLATED_EXPERIMENT_CANDIDATE"?"PROPOSAL":"BLOCKED";
  events.push({type,subject:item.id,sourceSha,evidenceRef:"plan:"+planDigest,
   payload:{idempotencyKey:"macro-order:"+command+":"+planDigest+":"+item.id+":"+type,
    command,planDigest,action:item.action,phase:item.proposedPhase,reasons:item.reasons,
    epistemicState:"PROPOSAL_OR_BLOCKER_NOT_FACT"}});
 }
 if(command==="REASSESS")events.push({type:"REASSESSMENT",subject:"ARKI_AUTONOMY",sourceSha,
  evidenceRef:"plan:"+planDigest,payload:{idempotencyKey:"macro-order:"+command+":"+planDigest+":reassessment",
   command,planDigest,blocked:plan.work.filter(x=>x.action!=="ISOLATED_EXPERIMENT_CANDIDATE").length,
   epistemicState:"REASSESSMENT_NOT_CANONICAL_DECISION"}});
 const persisted=store.appendEvents(events,{memoryFile});
 return {schema:"ARKI-MACRO-ORDER-0.2",command,plan,journal:persisted.events,summary:persisted.memory,
  persistence:{appendedCount:persisted.appendedCount,duplicateCount:persisted.duplicateCount},
  execution:"PLAN_AND_DURABLE_JOURNAL_ONLY",canonicalMutation:false,ownerDecision:"NOT_REQUESTED"};
}
module.exports={runMacroOrder};
