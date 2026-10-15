"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {inspectQueue,recordQueue}=require("./arki-mo064-history.cjs");
const base={ideas:[{id:"A",targetPhase:"F1"}],components:[]};
function fixture(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo064-"));const j=path.join(dir,"journal"),a=path.join(dir,"anchor");fs.mkdirSync(j);fs.mkdirSync(a);try{return fn(path.join(j,"events.jsonl"),path.join(a,"anchor.json"))}finally{fs.rmSync(dir,{recursive:true,force:true})}}
test("MO064 records queue and recovers across invocations without duplication",()=>fixture((j,a)=>{
 assert.equal(inspectQueue(j,a,base).status,"NO_QUEUE_RECORDED");
 assert.equal(recordQueue(j,a,base).recordStatus,"RECORDED");
 assert.equal(inspectQueue(j,a,base).status,"RECOVERED_MATCH");
 assert.equal(recordQueue(j,a,base).recordStatus,"ALREADY_RECORDED");
 assert.equal(inspectQueue(j,a,base).history.length,1);
}));
test("MO064 changed sources require review and append a new advisory event",()=>fixture((j,a)=>{
 recordQueue(j,a,base);const changed={ideas:[{id:"A",targetPhase:"F1",dependencies:[]}],components:[]};
 assert.equal(inspectQueue(j,a,changed).status,"QUEUE_CHANGED_REVIEW_REQUIRED");
 assert.equal(recordQueue(j,a,changed).history.length,2);
}));
test("MO064 missing independent anchor fails closed",()=>fixture((j,a)=>{
 recordQueue(j,a,base);fs.unlinkSync(a);assert.throws(()=>inspectQueue(j,a,base),/MISSING_TRUSTED_ANCHOR/);
}));
test("MO064 never infers PO approval or canonical execution",()=>fixture((j,a)=>{
 const r=recordQueue(j,a,base);assert.equal(r.policy.canonicalMutation,false);
 assert.equal(r.policy.poApproval,"NOT_INFERRED");assert.equal(r.policy.automaticExecution,false);
}));
