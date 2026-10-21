"use strict";
// Macro-order executor: planning and evidence journaling only; no external actions.
const {orchestrate}=require("./arki-autonomy-orchestrator.cjs");
const memory=require("./arki-autonomy-memory.cjs");
const COMMANDS=new Set(["AUDIT_AND_PLAN","REASSESS"]);
function runMacroOrder({command,parts,discovery,phaseRules={},evidence={},history=[],sourceSha}){
 if(!COMMANDS.has(command)||!/^[0-9a-f]{40}$/.test(sourceSha||""))throw Error("INVALID_MACRO_ORDER");
 const prior=memory.validate(history);
 const plan=orchestrate({parts,discovery,phaseRules,evidence});
 let journal=history;
 journal=memory.record(journal,{type:"OBSERVATION",subject:"ARKI_AUTONOMY",sourceSha,evidenceRef:"plan:"+plan.digest,
  payload:{command,parts:plan.work.length,priorHead:prior.headHash}});
 for(const item of plan.work){
  journal=memory.record(journal,{type:item.action==="ISOLATED_EXPERIMENT_CANDIDATE"?"PROPOSAL":"BLOCKED",
   subject:item.id,sourceSha,evidenceRef:"plan:"+plan.digest,
   payload:{action:item.action,phase:item.proposedPhase,reasons:item.reasons}});
 }
 if(command==="REASSESS")journal=memory.record(journal,{type:"REASSESSMENT",subject:"ARKI_AUTONOMY",
  sourceSha,evidenceRef:"plan:"+plan.digest,payload:{blocked:plan.work.filter(x=>x.action!=="ISOLATED_EXPERIMENT_CANDIDATE").length}});
 return {schema:"ARKI-MACRO-ORDER-0.1",command,plan,journal,summary:memory.summarize(journal),
  execution:"PLAN_AND_JOURNAL_ONLY",canonicalMutation:false,ownerDecision:"NOT_REQUESTED"};
}
module.exports={runMacroOrder};
