"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process");
const {inventory,collect}=require("./arki-mo077-trirepo-inventory.cjs");
test("MO077 discovers documented ideas and tracked source without claiming implementation",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo077-"));
 try{
  cp.execFileSync("git",["init","-q",dir]);
  fs.writeFileSync(path.join(dir,"ideas.md"),"# Idea: Nuevo módulo\n## Proyecto: Edificio\n- Actividad: Evaluar\n");
  fs.writeFileSync(path.join(dir,"module.js"),"export function candidate(){}\n");
  fs.writeFileSync(path.join(dir,"module.test.js"),"test('candidate',()=>{})\n");
  cp.execFileSync("git",["-C",dir,"add","."]);
  const r=collect(dir,"web");
  assert.equal(r.stats.trackedFiles,3);
  assert(r.items.some(x=>x.category==="IDEA"));
  assert(r.items.some(x=>x.category==="PROJECT"));
  assert(r.items.some(x=>x.category==="ACTIVITY"));
  assert(r.items.some(x=>x.status==="CODE_PRESENT_NOT_FUNCTIONALLY_VERIFIED"));
  assert(r.items.some(x=>x.status==="TEST_CODE_PRESENT_NOT_EXECUTED"));
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test("MO077 requires three repositories before inventory",()=>{
 const root=path.resolve(__dirname,"../.."),registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 assert.throws(()=>inventory(registry,{web:root,core:null,acs:null}),/REPOSITORIES_NOT_AVAILABLE/);
});
