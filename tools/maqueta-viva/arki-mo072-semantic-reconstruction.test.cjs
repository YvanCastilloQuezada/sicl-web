"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {enrich,locate}=require("./arki-mo072-semantic-reconstruction.cjs");
const root=path.resolve(__dirname,"../..");
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO072 reconstructs all 51 without promoting hypotheses",()=>{
 const r=enrich(registry,{web:root});
 assert.equal(r.summary.total,51);assert.equal(r.summary.hypothesizedPurposes,27);
 assert.equal(r.summary.documentaryPurposes,24);assert.equal(r.summary.verifiedBehaviors,0);
 assert(r.pieces.every(p=>p.purpose.text&&p.promotion==="BLOCKED_PENDING_EVIDENCE"));
});
test("MO072 does not invent precedence or code execution",()=>{
 const r=enrich(registry,{web:root});
 assert(r.pieces.every(p=>p.predecessors.candidates.length===0&&p.behaviorVerification==="NOT_PERFORMED"));
 assert.equal(r.repositories.core.status,"NOT_AVAILABLE");assert.equal(r.repositories.acs.status,"NOT_AVAILABLE");
 assert.equal(r.policy.noCanonicalWrites,true);
});
test("MO072 deterministic and read-only",()=>{
 const before=JSON.stringify(registry),a=enrich(registry,{web:root}),b=enrich(registry,{web:root});
 assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(JSON.stringify(registry),before);
});
test("MO072 rejects unsafe historical path traversal",()=>{
 const r=locate("../secrets",{web:{status:"INDEXED_TRACKED_FILES",files:["secrets"]}});
 assert.equal(r.status,"UNSAFE_OR_UNRESOLVED_REFERENCE");
});
