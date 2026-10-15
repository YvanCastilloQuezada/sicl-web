"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {execute}=require("./arki-integrated-diagnosis.cjs");
const {inspect}=require("./arki-mo04-guarded.cjs");
const sha="a".repeat(40);
function fixtures(){
 const registry={updated_at:"2026-10-14",ideas:[{id:"A",targetPhase:"F6",sourceStatus:"UNKNOWN",dependencies:[]},{id:"I-24",targetPhase:"UNASSIGNED",sourceStatus:"RESEARCH_ONLY_OUT_OF_SCOPE"}],components:[]};
 const nodes=Array.from({length:10},(_,i)=>({id:"F"+(i+1),kind:"phase",dependencies:i?["F"+i]:[],evidence:[],status:"UNKNOWN",approval:"NOT_ASSESSED"}));
 const coreMap={schema:"arki.mapa_vivo.v1",head:sha,canonical_mutations:0,validation_scope:"source-presence-only",nodes,edges:nodes.flatMap(n=>n.dependencies.map(d=>({from:d,to:n.id,kind:"prerequisite"}))),findings:[],limitations:[]};
 const webSnapshot={schema:"ARKI-LIVE-SYSTEMS-SNAPSHOT-1",sourceCommit:sha,canonicalMutation:false,execution:"READ_ONLY",map:{findings:nodes.map(n=>({phase:n.id,classification:"RECONCILIATION_REQUIRED"}))}};
 return {registry,coreMap,webSnapshot,expectedCoreHead:sha};
}
function sandbox(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),"arki-integration-"));const journal=path.join(root,"journal","events.json"),anchor=path.join(root,"anchor","anchor.json");fs.mkdirSync(path.dirname(journal));fs.mkdirSync(path.dirname(anchor));try{fn(journal,anchor)}finally{fs.rmSync(root,{recursive:true,force:true})}}
test("diagnosis persists and survives restart",()=>sandbox((journal,anchor)=>{const x=fixtures();const first=execute({...x,journal,anchor});assert.equal(first.recordStatus,"RECORDED");assert.equal(first.counts.activities,2);assert.deepEqual(first.excluded,["I-24"]);assert.equal(first.historyLength,1);assert.equal(first.policy.canonicalMutation,false);assert.equal(inspect(journal,anchor).replay.length,1);const second=execute({...x,journal,anchor});assert.equal(second.recordStatus,"ALREADY_RECORDED");assert.equal(second.historyLength,1)}));
test("invalid Core/Web source cannot write history",()=>sandbox((journal,anchor)=>{const x=fixtures();x.coreMap.head="b".repeat(40);assert.throws(()=>execute({...x,journal,anchor}),/CORE_HEAD_MISMATCH/);assert.equal(inspect(journal,anchor).replay.length,0)}));
test("blocked lock cannot mutate journal",()=>sandbox((journal,anchor)=>{fs.writeFileSync(journal+".lock","occupied");assert.throws(()=>execute({...fixtures(),journal,anchor}),/EEXIST/);assert.equal(inspect(journal,anchor).replay.length,0)}));
