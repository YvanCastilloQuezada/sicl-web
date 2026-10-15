"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {readContinuity,checkpoint}=require("./arki-mo053-continuity.cjs");
const base={ideas:[{id:"I1",targetPhase:"F1",dependencies:[],sourceStatus:"FROZEN"}],components:[]};
function fixture(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo053-"));const a=path.join(dir,"a"),b=path.join(dir,"b");fs.mkdirSync(a);fs.mkdirSync(b);try{return fn(path.join(a,"journal.jsonl"),path.join(b,"anchor.json"))}finally{fs.rmSync(dir,{recursive:true,force:true})}}
test("MO053 explicit checkpoint recovers deterministically after restart",()=>fixture((j,a)=>{
 assert.equal(readContinuity(j,a,base).restartStatus,"NO_CHECKPOINT");
 const first=checkpoint(j,a,base);assert.equal(first.status,"RECORDED");
 const recovered=readContinuity(j,a,base);assert.equal(recovered.restartStatus,"RECOVERED_MATCH");
 assert.equal(recovered.history.length,1);
 assert.equal(checkpoint(j,a,base).status,"ALREADY_RECORDED");
 assert.equal(readContinuity(j,a,base).history.length,1);
}));
test("MO053 source changes are detected without false approvals",()=>fixture((j,a)=>{
 checkpoint(j,a,base);const changed={...base,ideas:[{...base.ideas[0],title:"Changed"}]};
 const status=readContinuity(j,a,changed);assert.equal(status.restartStatus,"SOURCE_CHANGED_REVIEW_REQUIRED");
 assert.equal(status.history.length,1);assert.equal(status.policy.approval,"NOT_INFERRED");
 assert.equal(checkpoint(j,a,changed).history.length,2);
}));
test("MO053 tampered journal fails closed",()=>fixture((j,a)=>{
 checkpoint(j,a,base);fs.appendFileSync(j,"tampering\n");assert.throws(()=>readContinuity(j,a,base));
}));
test("MO053 missing anchor fails closed",()=>fixture((j,a)=>{
 checkpoint(j,a,base);fs.unlinkSync(a);assert.throws(()=>readContinuity(j,a,base),/MISSING_TRUSTED_ANCHOR/);
}));
