"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {run}=require("./arki-mo025-cycle.cjs");
const sha="a".repeat(40);
function fixtures(dir){
 const nodes=Array.from({length:10},(_,i)=>({id:"F"+(i+1),kind:"phase",dependencies:i?["F"+i]:[],evidence:[],status:"UNKNOWN",approval:"NOT_ASSESSED"}));
 const registry={updated_at:"2026-10-14",ideas:[{id:"A",targetPhase:"F6",sourceStatus:"UNKNOWN",dependencies:[]}],components:[]};
 const coreMap={schema:"arki.mapa_vivo.v1",head:sha,canonical_mutations:0,validation_scope:"source-presence-only",nodes,edges:nodes.flatMap(n=>n.dependencies.map(d=>({from:d,to:n.id,kind:"prerequisite"}))),findings:[],limitations:[]};
 const webSnapshot={schema:"ARKI-LIVE-SYSTEMS-SNAPSHOT-1",sourceCommit:sha,canonicalMutation:false,execution:"READ_ONLY",map:{findings:nodes.map(n=>({phase:n.id,classification:"RECONCILIATION_REQUIRED"}))}};
 for(const [name,obj] of Object.entries({registry,coreMap,webSnapshot}))fs.writeFileSync(path.join(dir,name+".json"),JSON.stringify(obj));
 return {registryFile:path.join(dir,"registry.json"),coreFile:path.join(dir,"coreMap.json"),webFile:path.join(dir,"webSnapshot.json"),expectedCoreHead:sha,stateDir:path.join(dir,"state")};
}
function sandbox(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo025-"));try{fn(dir)}finally{fs.rmSync(dir,{recursive:true,force:true})}}
test("advisory cycle records, replays, and never approves",()=>sandbox(dir=>{
 const args=fixtures(dir),a=run(args),b=run(args);
 assert.equal(a.heartbeat,"ADVISORY_PULSE_COMPLETED");
 assert.equal(a.restartReplay,"VERIFIED");
 assert.equal(a.historyLength,1);
 assert.equal(b.historyLength,1);
 assert.equal(b.recordStatus,"ALREADY_RECORDED");
 assert.equal(a.policy.canonicalMutation,false);
 assert.equal(a.policy.poApproval,"NOT_GRANTED");
 assert.ok(a.proposals.every(p=>p.authorized===false));
 assert.equal(a.inputFingerprint,b.inputFingerprint);
}));
test("rejects Core identity mismatch before journal mutation",()=>sandbox(dir=>{
 const args=fixtures(dir);assert.throws(()=>run({...args,expectedCoreHead:"b".repeat(40)}),/CORE_HEAD_MISMATCH/);
 assert.equal(fs.existsSync(path.join(args.stateDir,"events","diagnoses.json")),false);
}));
test("rejects simultaneous cycle using exclusive lock",()=>sandbox(dir=>{
 const args=fixtures(dir);fs.mkdirSync(args.stateDir);fs.writeFileSync(path.join(args.stateDir,"mo025.lock"),"busy");
 assert.throws(()=>run(args),/EEXIST/);
}));
test("rejects symbolic-link state directory",()=>sandbox(dir=>{
 const args=fixtures(dir);fs.symlinkSync(dir,args.stateDir);
 assert.throws(()=>run(args),/UNSAFE_STATE_DIR/);
}));
test("rejects malformed SHA and source symlink",()=>sandbox(dir=>{
 const args=fixtures(dir);assert.throws(()=>run({...args,expectedCoreHead:"bad"}),/INVALID_EXPECTED_CORE_HEAD/);
 const link=path.join(dir,"linked.json");fs.symlinkSync(args.coreFile,link);
 assert.throws(()=>run({...args,coreFile:link}),/UNSAFE_SOURCE_FILE/);
}));
