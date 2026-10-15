"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {propose}=require("./arki-mo055-proposals.cjs");
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO055 generates stable evidence-gated proposals",()=>{
 const a=propose(registry),b=propose(registry);
 assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(a.summary.activities,registry.ideas.length+registry.components.length);
 assert.equal(a.summary.proposals,a.proposals.length);assert.equal(a.policy.canonicalMutation,false);
});
test("MO055 three alternatives are explicit but not simulated",()=>{
 const r=propose(registry);
 assert(r.proposals.length>0);
 for(const p of r.proposals){assert.equal(p.alternatives.length,3);assert.equal(p.executionAuthorized,false);assert.equal(p.status,"AWAITING_EVIDENCE_AND_PO");
  for(const a of p.alternatives){assert.equal(a.simulation,"NOT_EXECUTED");assert.equal(a.measuredBenefit,null);assert.equal(a.approved,false)}}
});
test("MO055 unresolved dependencies produce a safe proposal",()=>{
 const r=propose({ideas:[{id:"I1",targetPhase:"F1",dependencies:["MISSING"]}],components:[]});
 assert.equal(r.proposals.length,1);assert(r.proposals[0].blockers.length>0);
 assert.equal(r.proposals[0].recommended,"C");
});
test("MO055 no invented work for clean declared dependencies",()=>{
 const r=propose({ideas:[{id:"I1",targetPhase:"F1",dependencies:[]}],components:[]});
 assert.equal(r.proposals.length,0);
});
