"use strict";
/** MO-04: deterministic, append-only, tamper-evident advisory journal.
 * Pure operations: caller owns persistence; no canonical writes or approval.
 */
const crypto=require("node:crypto");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const SHA=/^[a-f0-9]{64}$/;
function verify(journal){
 if(!Array.isArray(journal))throw Error("INVALID_JOURNAL");
 let prev=null;
 for(let i=0;i<journal.length;i++){
  const e=journal[i];
  if(!e||e.schema!=="ARKI-MO04-JOURNAL-EVENT-1"||e.sequence!==i+1||e.previous!==prev||!SHA.test(e.digest||""))throw Error("INVALID_JOURNAL_CHAIN");
  const {digest,...body}=e;
  if(hash(body)!==digest)throw Error("JOURNAL_TAMPERED");
  if(!["OBSERVATION","DIAGNOSIS","PROPOSAL","DECISION_RECORDED","RESULT_RECORDED"].includes(e.kind))throw Error("INVALID_EVENT_KIND");
  if(!e.payload||typeof e.payload!=="object"||Array.isArray(e.payload)||!SHA.test(e.sourceReceipt||""))throw Error("INVALID_EVENT_PROVENANCE");
  prev=digest;
 }
 return {valid:true,length:journal.length,head:prev};
}
function append(journal,{kind,sourceReceipt,payload}){
 const state=verify(journal);
 if(!["OBSERVATION","DIAGNOSIS","PROPOSAL","DECISION_RECORDED","RESULT_RECORDED"].includes(kind)||!SHA.test(sourceReceipt||"")||!payload||typeof payload!=="object"||Array.isArray(payload))throw Error("INVALID_EVENT");
 const body={schema:"ARKI-MO04-JOURNAL-EVENT-1",sequence:state.length+1,previous:state.head,kind,sourceReceipt,payload:structuredClone(payload),authority:"RECORDED_ONLY_NOT_APPROVED",canonicalMutation:false};
 const event={...body,digest:hash(body)};
 return [...journal,event];
}
function replay(journal){
 const {head,length}=verify(journal);
 return {schema:"ARKI-MO04-REPLAY-1",length,head,events:journal.map(e=>({sequence:e.sequence,kind:e.kind,sourceReceipt:e.sourceReceipt,digest:e.digest})),approval:"NOT_INFERRED",canonicalMutation:false};
}
module.exports={append,verify,replay};
