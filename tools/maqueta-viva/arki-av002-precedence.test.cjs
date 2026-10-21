"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {diagnose}=require("./arki-av002-precedence.cjs");
const reg=ideas=>({ideas,components:[]});
test("classifies missing references as defects, undeclared as gaps",()=>{
 const r=diagnose(reg([{id:"F6-A",dependsOn:["MISSING"]},{id:"F6-B"}]));
 assert.ok(r.issues.some(x=>x.kind==="MISSING_DEPENDENCY"&&x.classification==="CONFIRMED_STRUCTURAL_DEFECT"));
 assert.ok(r.issues.some(x=>x.kind==="UNDECLARED_DEPENDENCIES"&&x.classification==="INFORMATION_GAP"));
 assert.equal(r.policy.f6,"UNLOCKED_BY_PO");assert.equal(r.policy.canonicalMutation,false);
});
test("detects transitive cycles and duplicate references",()=>{
 const r=diagnose(reg([{id:"A",dependsOn:["B","B"]},{id:"B",dependsOn:["C"]},{id:"C",dependsOn:["A"]}]));
 assert.ok(r.issues.some(x=>x.kind==="CYCLIC_DEPENDENCY"));
 assert.ok(r.issues.some(x=>x.kind==="DUPLICATE_DEPENDENCY"));
});
test("does not invent competence from presence of nodes",()=>{
 const r=diagnose(reg([{id:"A",dependsOn:[]}]));
 assert.ok(r.issues.some(x=>x.kind==="EVIDENCE_NOT_VERIFIED"));
});
test("accepts verified acyclic chain without defects",()=>{
 const r=diagnose(reg([{id:"A",dependsOn:[],verification:"VERIFIED"},{id:"B",dependsOn:["A"],verification:"VERIFIED"}]));
 assert.equal(r.issues.length,0);
});
test("fails closed on invalid nodes and references",()=>{
 assert.throws(()=>diagnose(reg([{id:"A"},{id:"A"}])),/INVALID_NODE_ID/);
 assert.throws(()=>diagnose(reg([{id:"A",dependsOn:[3]}])),/INVALID_DEPENDENCY/);
});
test("handles deep dependency chains without recursive stack overflow",()=>{
 const ideas=Array.from({length:3500},(_,i)=>({id:"N"+i,dependsOn:i?["N"+(i-1)]:[],verification:"VERIFIED"}));
 assert.equal(diagnose(reg(ideas)).counts.confirmedDefects,0);
});
test("does not mutate registry",()=>{
 const x=reg([{id:"A",dependsOn:["A"]}]),before=JSON.stringify(x);
 diagnose(x);assert.equal(JSON.stringify(x),before);
});
