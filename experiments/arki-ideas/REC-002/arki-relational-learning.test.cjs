"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {proposeRelations}=require("./arki-relational-learning.cjs");
const registry={updated_at:"test",ideas:[{id:"A"},{id:"B"},{id:"C"}],components:[]};
const source={path:"docs/architecture.md",sha:"a".repeat(40),quote:"B requires A"};
const statement=(before,after,relation="REQUIRES")=>({before,after,relation,source});
test("source-linked prerequisites proposed but not promoted",()=>{const r=proposeRelations(registry,[statement("A","B")]);assert.equal(r.candidates.length,1);assert.equal(r.candidates[0].decision,"PROPOSED_FOR_REVIEW");assert.equal(r.canonicalMutation,false);assert.equal(r.existingCoverage.declared,0)});
test("informational links do not create dependency cycles",()=>{const r=proposeRelations(registry,[statement("A","B","INFORMS"),statement("B","A","INFORMS")]);assert.equal(r.cycles.length,0)});
test("required cycles are detected",()=>assert.equal(proposeRelations(registry,[statement("A","B"),statement("B","A")]).cycles.length,1));
test("missing provenance rejected",()=>assert.equal(proposeRelations(registry,[{before:"A",after:"B",relation:"REQUIRES"}]).issues[0].code,"INVALID_SOURCE_STATEMENT"));
test("unknown target rejected",()=>assert.equal(proposeRelations(registry,[statement("A","X")]).issues[0].code,"UNKNOWN_PART"));
test("self relationship rejected",()=>assert.equal(proposeRelations(registry,[statement("A","A")]).issues[0].code,"SELF_RELATION"));
test("duplicates rejected",()=>assert.equal(proposeRelations(registry,[statement("A","B"),statement("A","B")]).issues[0].code,"DUPLICATE_RELATION"));
test("stable receipt",()=>assert.equal(proposeRelations(registry,[statement("A","B")]).receiptSha256,proposeRelations(registry,[statement("A","B")]).receiptSha256));

test("CLI accepts explicit registry and statements without hidden fixture",()=>{
 const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process");
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-rec002-"));
 try {
  const registryPath=path.join(dir,"registry.json"),statementsPath=path.join(dir,"statements.json");
  fs.writeFileSync(registryPath,JSON.stringify(registry));
  fs.writeFileSync(statementsPath,JSON.stringify([statement("A","B")]));
  const result=cp.spawnSync(process.execPath,[path.join(__dirname,"arki-relational-learning.cjs"),registryPath,statementsPath],{encoding:"utf8",timeout:10000});
  assert.equal(result.status,0,result.stderr);
  const output=JSON.parse(result.stdout);
  assert.equal(output.candidates.length,1);
  assert.equal(output.canonicalMutation,false);
 } finally {fs.rmSync(dir,{recursive:true,force:true})}
});
