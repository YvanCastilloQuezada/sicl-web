"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),{spawnSync}=require("node:child_process");
const {discover}=require("./arki-relational-discovery.cjs");
function git(root,...args){const p=spawnSync("git",args,{cwd:root,encoding:"utf8"});assert.equal(p.status,0,p.stderr)}
test("discovers only explicit relations from committed source and never promotes",()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"arki-relations-"));
 try{
  git(root,"init","-q");git(root,"config","user.email","test@example.invalid");git(root,"config","user.name","ARKI Test");
  fs.mkdirSync(path.join(root,"docs"));
  fs.writeFileSync(path.join(root,"docs","relations.md"),"ARKI_RELATION: A REQUIRES B\nA and B are related in some unspecified way\n");
  git(root,"add",".");git(root,"commit","-qm","fixture");
  const registry={ideas:[{id:"A"},{id:"B"}],components:[]};
  const result=discover(registry,{root,files:["docs/relations.md"]});
  assert.equal(result.statements,1);assert.equal(result.verifiedSources,1);assert.equal(result.candidates[0].relation,"REQUIRES");assert.equal(result.candidates[0].decision,"PROPOSED_FOR_REVIEW");assert.equal(result.canonicalMutation,false);
  fs.writeFileSync(path.join(root,"docs","relations.md"),"ARKI_RELATION: B REQUIRES A\n");
  const unchanged=discover(registry,{root,files:["docs/relations.md"]});
  assert.equal(unchanged.candidates[0].before,"A");
 }finally{fs.rmSync(root,{recursive:true,force:true})}
});
test("invalid source path is not scanned",()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),"arki-relations-"));
 try{git(root,"init","-q");git(root,"config","user.email","test@example.invalid");git(root,"config","user.name","ARKI Test");fs.writeFileSync(path.join(root,"README.md"),"test");git(root,"add",".");git(root,"commit","-qm","fixture");
 const r=discover({ideas:[],components:[]},{root,files:["../secret.md"]});assert.equal(r.issues[0].code,"UNSAFE_PATH");
 }finally{fs.rmSync(root,{recursive:true,force:true})}
});
