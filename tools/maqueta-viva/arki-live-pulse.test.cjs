"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {pulse}=require("./arki-live-pulse.cjs");
const sha="a".repeat(40);
function sources(){
 const nodes=Array.from({length:10},(_,i)=>({id:"F"+(i+1),kind:"phase",dependencies:i?["F"+i]:[],evidence:[],status:"UNKNOWN",approval:"NOT_ASSESSED"}));
 return {registry:{updated_at:"2026-10-14",ideas:[{id:"A",targetPhase:"F6",sourceStatus:"UNKNOWN",dependencies:[]}],components:[]},coreMap:{schema:"arki.mapa_vivo.v1",head:sha,canonical_mutations:0,validation_scope:"source-presence-only",nodes,edges:nodes.flatMap(n=>n.dependencies.map(d=>({from:d,to:n.id,kind:"prerequisite"}))),findings:[],limitations:[]},webSnapshot:{schema:"ARKI-LIVE-SYSTEMS-SNAPSHOT-1",sourceCommit:sha,canonicalMutation:false,execution:"READ_ONLY",map:{findings:nodes.map(n=>({phase:n.id,classification:"RECONCILIATION_REQUIRED"}))}},expectedCoreHead:sha};
}
test("ARKI pulse runs, persists, replays and deduplicates",()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-pulse-"));try{const a=pulse({...sources(),stateDir:dir});assert.equal(a.heartbeat,"ADVISORY_PULSE_COMPLETED");assert.equal(a.restartReplay,"VERIFIED");assert.equal(a.historyLength,1);const b=pulse({...sources(),stateDir:dir});assert.equal(b.recordStatus,"ALREADY_RECORDED");assert.equal(b.historyLength,1)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test("ARKI pulse rejects wrong Core head without recording",()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-pulse-"));try{assert.throws(()=>pulse({...sources(),expectedCoreHead:"b".repeat(40),stateDir:dir}),/CORE_HEAD_MISMATCH/);assert.equal(fs.existsSync(path.join(dir,"events","diagnoses.json")),false)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
