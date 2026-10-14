"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {scheduled}=require("./arki-mo025-scheduled.cjs");
const sha="a".repeat(40);
function fixture(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo025-timer-"));try{
 const nodes=Array.from({length:10},(_,i)=>({id:"F"+(i+1),kind:"phase",dependencies:i?["F"+i]:[],evidence:[],status:"UNKNOWN",approval:"NOT_ASSESSED"}));
 const coreFile=path.join(dir,"core.json"),webFile=path.join(dir,"web.json");
 fs.writeFileSync(coreFile,JSON.stringify({schema:"arki.mapa_vivo.v1",head:sha,canonical_mutations:0,validation_scope:"source-presence-only",nodes,edges:nodes.flatMap(n=>n.dependencies.map(d=>({from:d,to:n.id,kind:"prerequisite"}))),findings:[],limitations:[]}));
 fs.writeFileSync(webFile,JSON.stringify({schema:"ARKI-LIVE-SYSTEMS-SNAPSHOT-1",sourceCommit:sha,canonicalMutation:false,execution:"READ_ONLY",map:{findings:nodes.map(n=>({phase:n.id,classification:"RECONCILIATION_REQUIRED"}))}}));
 fn({schema:"ARKI-MO025-SCHEDULE-1",coreFile,webFile,expectedCoreHead:sha,stateDir:path.join(dir,"state"),maxSourceAgeMinutes:30},dir);
 }finally{fs.rmSync(dir,{recursive:true,force:true})}}
test("fresh bound inputs produce advisory-only replay",()=>fixture(c=>{const a=scheduled(c),b=scheduled(c);assert.equal(a.heartbeat,"ADVISORY_PULSE_COMPLETED");assert.equal(b.recordStatus,"ALREADY_RECORDED");assert.equal(a.policy.canonicalMutation,false)}));
test("stale source fails before state creation",()=>fixture((c)=>{const old=new Date(Date.now()-3600_000);fs.utimesSync(c.coreFile,old,old);assert.throws(()=>scheduled(c),/STALE_SOURCE/);assert.equal(fs.existsSync(c.stateDir),false)}));
test("source identity mismatch fails closed",()=>fixture(c=>{assert.throws(()=>scheduled({...c,expectedCoreHead:"b".repeat(40)}),/CORE_HEAD_MISMATCH/);assert.equal(fs.existsSync(c.stateDir),false)}));
test("rejects unsafe ttl and symlink sources",()=>fixture((c,dir)=>{assert.throws(()=>scheduled({...c,maxSourceAgeMinutes:0}),/INVALID_SOURCE_TTL/);const link=path.join(dir,"link.json");fs.symlinkSync(c.webFile,link);assert.throws(()=>scheduled({...c,webFile:link}),/UNSAFE_SOURCE/)}));
