"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {reconcileCoreMapaVivo}=require("./arki-core-mapa-vivo-bridge.cjs");
const sha="a".repeat(40),websha="b".repeat(40);
function fixtures(){
 const nodes=Array.from({length:10},(_,i)=>({id:"F"+(i+1),kind:"phase",dependencies:i?["F"+i]:[],evidence:[],status:"UNKNOWN",approval:"NOT_ASSESSED"}));
 const edges=nodes.flatMap(n=>n.dependencies.map(d=>({from:d,to:n.id,kind:"prerequisite"})));
 const core={schema:"arki.mapa_vivo.v1",head:sha,canonical_mutations:0,validation_scope:"source-presence-only",nodes,edges,findings:[],limitations:[]};
 const web={schema:"ARKI-LIVE-SYSTEMS-SNAPSHOT-1",sourceCommit:websha,canonicalMutation:false,execution:"READ_ONLY",map:{findings:nodes.map(n=>({phase:n.id,classification:"RECONCILIATION_REQUIRED"}))}};
 return {core,web};
}
test("reconciles ten unknown phases without promotion",()=>{const {core,web}=fixtures();const r=reconcileCoreMapaVivo(core,web,{expectedCoreHead:sha});assert.equal(r.phases,10);assert.equal(r.issues.length,0);assert.equal(r.promotion,"BLOCKED");assert.equal(r.canonicalMutation,false);assert.equal(r.competence,"NOT_VERIFIED");});
test("deterministic receipt",()=>{const {core,web}=fixtures();assert.equal(reconcileCoreMapaVivo(core,web).receiptSha256,reconcileCoreMapaVivo(core,web).receiptSha256)});
test("rejects stale Core head",()=>{const {core,web}=fixtures();assert.throws(()=>reconcileCoreMapaVivo(core,web,{expectedCoreHead:"c".repeat(40)}),/CORE_HEAD_MISMATCH/)});
test("rejects invented PASS in Core",()=>{const {core,web}=fixtures();core.nodes[0].status="PASS";assert.throws(()=>reconcileCoreMapaVivo(core,web),/UNVERIFIED_PHASE_CLAIM/)});
test("rejects canonical mutation",()=>{const {core,web}=fixtures();core.canonical_mutations=1;assert.throws(()=>reconcileCoreMapaVivo(core,web),/CORE_SCOPE_MISMATCH/)});
test("rejects invalid evidence digest",()=>{const {core,web}=fixtures();core.nodes.push({id:"ACE88",kind:"evidence",dependencies:["F8"],evidence:[{path:"docs/a",sha256:"invalid"}],status:"SOURCE_PRESENT_NOT_VALIDATED",approval:"NOT_ASSESSED"});core.edges.push({from:"F8",to:"ACE88",kind:"prerequisite"});assert.throws(()=>reconcileCoreMapaVivo(core,web),/INVALID_EVIDENCE_REFERENCE/)});
test("flags cycles without granting promotion",()=>{const {core,web}=fixtures();core.nodes[0].dependencies=["F10"];core.edges.push({from:"F10",to:"F1",kind:"prerequisite"});const r=reconcileCoreMapaVivo(core,web);assert(r.issues.some(x=>x.code==="DEPENDENCY_CYCLE"));assert.equal(r.promotion,"BLOCKED")});
test("rejects missing edge",()=>{const {core,web}=fixtures();core.edges.pop();assert.throws(()=>reconcileCoreMapaVivo(core,web),/EDGE_SET_MISMATCH/)});
test("rejects web canonical mutation",()=>{const {core,web}=fixtures();web.canonicalMutation=true;assert.throws(()=>reconcileCoreMapaVivo(core,web),/INVALID_WEB_SNAPSHOT/)});
test("reports FROZEN claim as unverified",()=>{const {core,web}=fixtures();web.map.findings[0].classification="FROZEN_PROTECTED";const r=reconcileCoreMapaVivo(core,web);assert(r.issues.some(x=>x.code==="WEB_FROZEN_CLAIM_NOT_VERIFIED_BY_CORE"))});

test("F6 PO revocation eliminates frozen claim without granting competence",()=>{const {core,web}=fixtures();web.map.findings[5].classification="RECONCILIATION_REQUIRED";const r=reconcileCoreMapaVivo(core,web);assert(!r.issues.some(x=>x.code==="WEB_FROZEN_CLAIM_NOT_VERIFIED_BY_CORE"&&x.phase==="F6"));assert.equal(r.competence,"NOT_VERIFIED");assert.equal(r.promotion,"BLOCKED")});

test("independent Core and Web identities accepted when pinned",()=>{const {core,web}=fixtures();const r=reconcileCoreMapaVivo(core,web,{expectedCoreHead:sha,expectedWebHead:websha});assert.equal(r.coreHead,sha);assert.equal(r.webHead,websha);assert.notEqual(r.coreHead,r.webHead);assert.equal(r.promotion,"BLOCKED")});
test("stale Web snapshot rejected without changing Core identity",()=>{const {core,web}=fixtures();assert.throws(()=>reconcileCoreMapaVivo(core,web,{expectedCoreHead:sha,expectedWebHead:"c".repeat(40)}),/WEB_HEAD_MISMATCH/)});
