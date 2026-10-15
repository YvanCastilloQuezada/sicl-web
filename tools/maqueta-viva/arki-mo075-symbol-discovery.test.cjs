"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {discover,tokens}=require("./arki-mo075-symbol-discovery.cjs");
const root=path.resolve(__dirname,"../.."),registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO075 indexes 51 and does not claim verification",()=>{
 const r=discover(registry,{web:root});assert.equal(r.summary.total,51);assert.equal(r.summary.verifiedBehaviors,0);
 assert(r.pieces.every(p=>p.behavior==="NOT_VERIFIED"&&p.decision==="PO_APPROVAL_REQUIRED"));
});
test("MO075 supports multiple missions and AI laboratory",()=>{
 const r=discover(registry,{web:root});assert.deepEqual(r.pieces.find(p=>p.id==="I-24").missions,["SELF_SUFFICIENCY","NEW_DOMAIN"]);
});
test("MO075 deterministic, read-only",()=>{
 const before=JSON.stringify(registry),a=discover(registry,{web:root}),b=discover(registry,{web:root});
 assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(JSON.stringify(registry),before);
});
test("MO075 tokenization ignores generic words",()=>{
 assert(tokens("Geometría de arquitectura").includes("geometria"));assert(!tokens("ARKI Core").includes("arki"));
});
