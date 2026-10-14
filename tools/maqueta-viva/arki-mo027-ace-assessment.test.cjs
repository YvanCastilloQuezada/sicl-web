"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const crypto=require("node:crypto");
const {assess}=require("./arki-mo027-ace-assessment.cjs");
const names=["PROJECT_STATE.json","CURRENT_PHASE.json","CRITICAL_PATH.json","EVIDENCE_INDEX.json","NEXT_ACTION.md","HANDOFF_LATEST.md"];
function fixture(){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo027-"));
 const files={};
 for(const name of names){const bytes=Buffer.from(name.endsWith(".json")?JSON.stringify(name===names[0]?{schema:"ARKI_ACE_V1",machine:"ARKI-02",repositories:{},remote_freshness:"NOT_CHECKED",product_frozen_state:"NOT_VERIFIED"}:{}):"handoff");fs.writeFileSync(path.join(dir,name),bytes);files[name]=crypto.createHash("sha256").update(bytes).digest("hex")}
 fs.writeFileSync(path.join(dir,"MANIFEST.json"),JSON.stringify({schema:"ARKI_MANIFEST_V1",files}));
 return dir;
}
test("valid ACE cannot impersonate Core/Web live maps",()=>{
 const dir=fixture();
 try{const r=assess(dir);assert.equal(r.status,"OBSERVED");assert.equal(r.mayFeedMo025,false);assert.equal(r.coreMapCompatibility,"NOT_DEMONSTRATED");assert.equal(r.canonicalMutation,false)}finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test("stale ACE is detected",()=>{
 const dir=fixture();
 try{const old=new Date(Date.now()-2*60*60*1000);fs.utimesSync(path.join(dir,names[1]),old,old);assert.equal(assess(dir).status,"STALE")}finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test("symlink input fails closed",()=>{
 const dir=fixture();
 try{const target=path.join(dir,names[1]);fs.unlinkSync(target);fs.symlinkSync(path.join(dir,names[0]),target);assert.throws(()=>assess(dir),/UNSAFE_FILE/)}finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test("invalid ACE schema fails closed",()=>{
 const dir=fixture();
 try{fs.writeFileSync(path.join(dir,names[0]),JSON.stringify({schema:"OTHER",machine:"ARKI-02"}));assert.throws(()=>assess(dir),/INVALID_ACE_SCHEMA/)}finally{fs.rmSync(dir,{recursive:true,force:true})}
});

test("tampered content rejected by manifest",()=>{const dir=fixture();try{fs.writeFileSync(path.join(dir,names[1]),"{} ");assert.throws(()=>assess(dir),/MANIFEST_HASH_MISMATCH/)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test("missing manifest entry rejected",()=>{const dir=fixture();try{const p=path.join(dir,"MANIFEST.json");const m=JSON.parse(fs.readFileSync(p));delete m.files[names[1]];fs.writeFileSync(p,JSON.stringify(m));assert.throws(()=>assess(dir),/INVALID_MANIFEST/)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
