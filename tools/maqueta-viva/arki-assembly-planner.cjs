"use strict";
/* ARKI assembly planner: deterministic proposals only. No code execution, filesystem writes or canonical promotion. */
const PHASES=new Set(Array.from({length:10},(_,i)=>"F"+(i+1)));
const VALID_ID=/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/;
const VALID_PATH=/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/;
function planAssembly(parts,phaseRules={}){
 if(!Array.isArray(parts)||parts.length>10000)throw Error("INVALID_INVENTORY");
 const seen=new Map(),issues=[],proposals=[];
 for(const raw of parts){
  if(!raw||!VALID_ID.test(raw.id||"")||!VALID_PATH.test(raw.path||"")||!Array.isArray(raw.dependencies||[]))throw Error("INVALID_PART");
  if(seen.has(raw.id))throw Error("DUPLICATE_ID:"+raw.id);
  seen.set(raw.id,raw);
 }
 const state=new Map();
 function visit(id,stack=[]){
  if(state.get(id)==="DONE")return;
  if(state.get(id)==="VISITING"){issues.push({code:"DEPENDENCY_CYCLE",part:id,chain:[...stack,id]});return}
  const p=seen.get(id);if(!p)return;
  state.set(id,"VISITING");
  for(const dep of p.dependencies||[]){
   if(typeof dep!=="string"||!VALID_ID.test(dep)){issues.push({code:"INVALID_DEPENDENCY",part:id});continue}
   if(!seen.has(dep)){issues.push({code:"MISSING_DEPENDENCY",part:id,dependency:dep});continue}
   visit(dep,[...stack,id]);
  }
  state.set(id,"DONE");
 }
 for(const id of [...seen.keys()].sort())visit(id);
 const blocked=new Set(issues.filter(x=>x.part).map(x=>x.part));
 let changed=true;
 while(changed){changed=false;for(const p of seen.values())if(!blocked.has(p.id)&&(p.dependencies||[]).some(d=>blocked.has(d))){blocked.add(p.id);changed=true}}
 for(const p of [...seen.values()].sort((a,b)=>a.id.localeCompare(b.id))){
  const rule=phaseRules[p.id];const candidates=[p.phase,rule?.phase].filter(x=>PHASES.has(x));
  const phase=candidates[0]||null;
  const reasons=[];
  if(p.frozen===true)reasons.push("FROZEN_READ_ONLY");
  if(blocked.has(p.id))reasons.push("DEPENDENCY_BLOCKED");
  if(!phase)reasons.push("PHASE_UNDETERMINED");
  if(candidates.length===2&&candidates[0]!==candidates[1])reasons.push("PHASE_CONFLICT");
  const status=reasons.length?"REVIEW_REQUIRED":"PROPOSED";
  proposals.push({id:p.id,path:p.path,proposedPhase:phase,dependencies:[...(p.dependencies||[])],status,reasons,canonicalMutation:false,execution:"NOT_EXECUTED",approval:"OWNER_REQUIRED"});
 }
 return {schema:"ARKI-ASSEMBLY-PLAN-1",parts:proposals,issues,summary:{total:proposals.length,proposed:proposals.filter(x=>x.status==="PROPOSED").length,reviewRequired:proposals.filter(x=>x.status==="REVIEW_REQUIRED").length},canonicalMutation:false,execution:"NOT_EXECUTED"};
}
module.exports={planAssembly};
