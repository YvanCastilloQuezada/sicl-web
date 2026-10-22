"use strict";
// Immutable, deterministic, tamper-evident memory journal. Storage adapter is separate.
const {createHash}=require("node:crypto");
const GENESIS="0".repeat(64);
const TYPES=new Set(["OBSERVATION","DEFICIT","PROPOSAL","EXPERIMENT_RESULT","TEST_RESULT","HUMAN_DECISION","BLOCKED","REASSESSMENT"]);
function hash(value){return createHash("sha256").update(JSON.stringify(value)).digest("hex")}
function validate(history){
 if(!Array.isArray(history)||history.length>100000)throw Error("INVALID_HISTORY");
 let prev=GENESIS;
 for(let i=0;i<history.length;i++){
  const e=history[i];
  if(!e||e.seq!==i+1||e.previousHash!==prev||!TYPES.has(e.type)||typeof e.subject!=="string"||!e.subject||
    typeof e.sourceSha!=="string"||!/^[0-9a-f]{40}$/.test(e.sourceSha)||typeof e.evidenceRef!=="string"||
    typeof e.payload!=="object"||!e.payload||Array.isArray(e.payload)||e.hash!==hash({seq:e.seq,previousHash:e.previousHash,type:e.type,subject:e.subject,sourceSha:e.sourceSha,evidenceRef:e.evidenceRef,payload:e.payload}))throw Error("MEMORY_INTEGRITY_FAILURE:"+i);
  prev=e.hash;
 }
 return {count:history.length,headHash:prev};
}
function record(history,input){
 const state=validate(history);
 if(!input||!TYPES.has(input.type)||typeof input.subject!=="string"||!input.subject||
  !/^[0-9a-f]{40}$/.test(input.sourceSha||"")||typeof input.evidenceRef!=="string"||
  !input.payload||typeof input.payload!=="object"||Array.isArray(input.payload))throw Error("INVALID_MEMORY_EVENT");
 const base={seq:state.count+1,previousHash:state.headHash,type:input.type,subject:input.subject,
  sourceSha:input.sourceSha,evidenceRef:input.evidenceRef,payload:JSON.parse(JSON.stringify(input.payload))};
 const event={...base,hash:hash(base)};
 return [...history,event];
}
function summarize(history){
 const state=validate(history),byType={};
 for(const event of history)byType[event.type]=(byType[event.type]||0)+1;
 return {...state,byType,canonicalMutation:false,storage:"NOT_PERSISTED_BY_THIS_MODULE"};
}
module.exports={record,validate,summarize,GENESIS};
