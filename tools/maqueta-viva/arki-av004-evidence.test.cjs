"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process");
const {inspect}=require("./arki-av004-evidence.cjs");
test("AV-004 inventories only tracked pairs and never claims competence",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-av004-"));
 try{
  cp.execFileSync("git",["init","-q"],{cwd:dir});
  fs.mkdirSync(path.join(dir,"tools","maqueta-viva"),{recursive:true});
  fs.writeFileSync(path.join(dir,"tools/maqueta-viva/demo.cjs"),"module.exports={};");
  fs.writeFileSync(path.join(dir,"tools/maqueta-viva/demo.test.cjs"),"// test");
  fs.writeFileSync(path.join(dir,"tools/maqueta-viva/untracked.test.cjs"),"// not tracked");
  cp.execFileSync("git",["add","tools/maqueta-viva/demo.cjs","tools/maqueta-viva/demo.test.cjs"],{cwd:dir});
  const r=inspect(dir,{schema:"ARKI-AV003-SOURCE-RECONCILIATION-1",items:[{id:"I-01",originStatus:"TRACKED_FILE_PRESENT"}]});
  assert.equal(r.trackedPairs.length,1);assert.equal(r.trackedPairs[0].status,"TRACKED_PAIR_NOT_EXECUTED");
  assert.equal(r.proposals[0].competenceVerified,false);assert.equal(r.policy.canonicalMutation,false);
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test("AV-004 rejects unbound reconciliation",()=>{
 assert.throws(()=>inspect(".",{schema:"OTHER"}),/INVALID_RECONCILIATION/);
});
