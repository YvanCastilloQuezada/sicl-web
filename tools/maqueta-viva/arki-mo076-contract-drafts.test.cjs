"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {audit,contract}=require("./arki-mo076-contract-drafts.cjs");
const root=path.resolve(__dirname,"../.."),registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
test("MO076 requires all three repositories",()=>{
 assert.throws(()=>audit(registry,{web:root,core:null,acs:null}),/REPOSITORIES_NOT_AVAILABLE/);
});
test("MO076 drafts preserve unknowns and PO gate",()=>{
 const c=contract({id:"X",name:"X",missions:["NEW_DOMAIN"],functionalCandidates:[]});
 assert.equal(c.inputs.status,"UNKNOWN");assert.equal(c.dependencies.status,"UNKNOWN_NOT_INFERRED");
 assert.equal(c.promotion,"BLOCKED_PO_APPROVAL");assert.equal(c.contractStatus,"PROPOSED_NOT_APPROVED");
});
test("MO076 does not claim evidence from source names",()=>{
 const c=contract({id:"X",name:"X",missions:["SUPER_ARCHITECT"],functionalCandidates:[{kind:"SOURCE",repository:"web",path:"a.js",matchedTerms:["a"]}]});
 assert.equal(c.behavior,"NOT_VERIFIED");assert.equal(c.evidence.sourceCandidates.length,1);
});
