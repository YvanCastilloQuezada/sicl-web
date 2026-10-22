"use strict";
/* Experimental append-only event log and deterministic read model.
   No GitHub hooks, no automatic ingestion, no canonical mutation. */
const crypto=require("node:crypto");
const TYPES=new Set(["COMMIT_OBSERVED","CI_OBSERVED","AUDIT_RECEIVED","DECISION_RECORDED","EXPERIMENT_REPORTED","TEST_OBSERVED"]);
const STATES=new Set(["DECLARED","VERIFIED","CONTRADICTED","UNKNOWN"]);
const hash=value=>crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
function validEvent(e){
 return !!e&&typeof e==="object"&&!Array.isArray(e)&&TYPES.has(e.type)&&typeof e.id==="string"&&/^[A-Za-z0-9_-]{4,100}$/.test(e.id)&&typeof e.occurredAt==="string"&&!Number.isNaN(Date.parse(e.occurredAt))&&typeof e.source==="string"&&e.source.length>2&&e.source.length<=500&&typeof e.summary==="string"&&e.summary.length>=8&&e.summary.length<=2000&&STATES.has(e.evidenceState)&&typeof e.subject==="string"&&e.subject.length>=2&&e.subject.length<=120&&(e.sha===null||typeof e.sha==="string"&&/^[a-f0-9]{40}$/.test(e.sha));
}
function appendEvent(log,event){
 if(!Array.isArray(log)||!validEvent(event))return {status:"REJECTED_INVALID",canonicalMutation:false};
 if(log.some(e=>e.id===event.id))return {status:"REJECTED_DUPLICATE",canonicalMutation:false};
 const previousHash=log.length?hash(log[log.length-1]):null;
 const record={id:event.id,type:event.type,occurredAt:event.occurredAt,source:event.source,summary:event.summary,evidenceState:event.evidenceState,subject:event.subject,sha:event.sha??null,previousHash};
 return {status:"APPENDED_LOCAL",log:[...log,record],record,canonicalMutation:false};
}
function deriveMemory(log){
 if(!Array.isArray(log)||log.some(e=>!validEvent(e)))return {status:"INVALID_LOG",canonicalMutation:false};
 const ordered=[...log].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt)||a.id.localeCompare(b.id));
 const bySubject={};
 for(const e of ordered){
  (bySubject[e.subject]??=[]).push({id:e.id,type:e.type,occurredAt:e.occurredAt,evidenceState:e.evidenceState,summary:e.summary,sha:e.sha});
 }
 return {schema:"ARKI-LIVING-MEMORY-001",status:"DERIVED_EXPERIMENTAL",eventCount:ordered.length,lastEventAt:ordered.length?ordered[ordered.length-1].occurredAt:null,bySubject,unverified:ordered.filter(e=>e.evidenceState!=="VERIFIED").map(e=>e.id),criticalPath:"UNKNOWN",promotion:"BLOCKED",execution:"BLOCKED",canonicalMutation:false};
}
module.exports={appendEvent,deriveMemory,validEvent};
