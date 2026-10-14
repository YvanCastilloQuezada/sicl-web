"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {planMo03}=require("./arki-mo03-autoplan.cjs");
const sha="a".repeat(40);
function fixtures(){
 const registry={updated_at:"2026-10-14",ideas:[{id:"A",targetPhase:"F6",sourceStatus:"UNKNOWN",dependencies:[]},{id:"B",targetPhase:"F7",sourceStatus:"UNKNOWN",dependencies:["A"]}],components:[]};
 const nodes=Array.from({length:10},(_,i)=>({id:"F"+(i+1),kind:"phase",dependencies:i?["F"+i]:[],evidence:[],status:"UNKNOWN",approval:"NOT_ASSESSED"}));
 const coreMap={schema:"arki.mapa_vivo.v1",head:sha,canonical_mutations:0,validation_scope:"source-presence-only",nodes,edges:nodes.flatMap(n=>n.dependencies.map(d=>({from:d,to:n.id,kind:"prerequisite"}))),findings:[],limitations:[]};
 const webSnapshot={schema:"ARKI-LIVE-SYSTEMS-SNAPSHOT-1",sourceCommit:sha,canonicalMutation:false,execution:"READ_ONLY",map:{findings:nodes.map(n=>({phase:n.id,classification:"RECONCILIATION_REQUIRED"}))}};
 return {registry,coreMap,webSnapshot,expectedCoreHead:sha};
}
test("deterministic autonomous queue remains advisory",()=>{const x=fixtures(),a=planMo03(x),b=planMo03(x);assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(a.counts.activities,2);assert.equal(a.counts.blocked,2);assert(a.queue.every(q=>q.gate==="BLOCKED_UNVERIFIED"&&!q.automaticExecution));assert.equal(a.policy.automaticCanonicalMutation,false)});
test("F6 is not frozen after PO revocation",()=>{const r=planMo03(fixtures());assert(!r.queue.find(x=>x.phase==="F6").reasons.includes("FROZEN_PROTECTED"))});
test("FROZEN on other phases remains protected",()=>{const x=fixtures();x.webSnapshot.map.findings[6].classification="FROZEN_PROTECTED";const r=planMo03(x);assert(r.queue.find(q=>q.phase==="F7").reasons.includes("FROZEN_PROTECTED"))});
test("missing predecessor is blocked and reported",()=>{const x=fixtures();x.registry.ideas[1].dependencies=["MISSING"];const r=planMo03(x);assert(r.queue.find(q=>q.id==="B").reasons.includes("DEPENDENCY_STRUCTURE_BLOCKED"));assert(r.findings.length>0)});
test("cycle is detected without execution",()=>{const x=fixtures();x.registry.ideas[0].dependencies=["B"];const r=planMo03(x);assert(r.findings.some(f=>f.code==="DEPENDENCY_CYCLE"||f.origin==="TREE"));assert.equal(r.policy.automaticCanonicalMutation,false)});
test("wrong Core SHA rejected",()=>{const x=fixtures();x.expectedCoreHead="b".repeat(40);assert.throws(()=>planMo03(x),/CORE_HEAD_MISMATCH/)});
