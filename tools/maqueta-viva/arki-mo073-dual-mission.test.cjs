"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {assess,classify}=require("./arki-mo073-dual-mission.cjs");
const root=path.resolve(__dirname,"../.."),registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO073 retains all pieces and PO gate",()=>{
 const r=assess(registry,{web:root});assert.equal(r.counts.total,51);
 assert.equal(r.authority.po,"SOLE_APPROVER_OF_CANONICAL_CHANGES");
 assert.equal(r.authority.canonicalWrites,false);
 assert(r.pieces.every(p=>p.missionAssessment.status==="CANDIDATE_SEMANTIC_CLASSIFICATION"));
});
test("MO073 permits both missions without forcing one",()=>{
 const c=classify({name:"Geometría y aprendizaje",purpose:{text:"Aprender a diseñar arquitectura"}});
 assert.deepEqual(c.missions,["SUPER_ARCHITECT","SELF_SUFFICIENCY"]);
});
test("MO073 preserves unknown when no semantic signal",()=>{
 assert.deepEqual(classify({name:"X",purpose:{text:"Y"}}).missions,["UNRESOLVED"]);
});
test("MO073 deterministic and input immutable",()=>{
 const before=JSON.stringify(registry),a=assess(registry,{web:root}),b=assess(registry,{web:root});
 assert.equal(a.receiptSha256,b.receiptSha256);assert.equal(JSON.stringify(registry),before);
});
