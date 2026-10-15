"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {reconcile}=require("./arki-mo066-reconcile.cjs");
const {recordQueue}=require("./arki-mo064-history.cjs");
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO066 reconciles complete provenance chain without pretending execution",()=>{
 const r=reconcile({registry});
 assert.equal(r.checks.provenanceChain,"VERIFIED");
 assert.equal(r.checks.activityCounts,"CONSISTENT");
 assert.equal(r.checks.proposals,"CONSISTENT");
 assert.equal(r.checks.history,"NOT_CONFIGURED");
 assert.equal(r.policy.agkExecution,false);assert.equal(r.policy.canonicalMutation,false);
});
test("MO066 verifies protected replay and flags source drift",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo066-"));
 try{
 const j=path.join(dir,"events.jsonl"),a=path.join(dir,"anchor.json");
 recordQueue(j,a,registry);
 assert.equal(reconcile({registry,journal:j,anchor:a}).checks.history,"RECOVERED_MATCH");
 const changed=structuredClone(registry);changed.ideas[0].note="evidence changed";
 const r=reconcile({registry:changed,journal:j,anchor:a,previousRegistry:registry});
 assert.equal(r.checks.history,"QUEUE_CHANGED_REVIEW_REQUIRED");
 assert.equal(r.readiness,"REVIEW_REQUIRED");
 assert(r.delta.changedIds.length>0);
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test("MO066 deterministic and preserves input",()=>{
 const before=JSON.stringify(registry),a=reconcile({registry}),b=reconcile({registry});
 assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(JSON.stringify(registry),before);
});
test("MO066 refuses history without trusted anchor",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo066-"));
 try{const j=path.join(dir,"events.jsonl"),a=path.join(dir,"anchor.json");
 recordQueue(j,a,registry);fs.unlinkSync(a);
 assert.throws(()=>reconcile({registry,journal:j,anchor:a}),/MISSING_TRUSTED_ANCHOR/);
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
