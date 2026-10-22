"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {bind,repairExperiment}=require("./arki-mo031-evidence.cjs");
const {rehearseFile}=require("./arki-mo031-file-rehearsal.cjs");
function fixture(){return [{schema:"ARKI-MO031-CORRECTION-REVIEW-1",coreHead:"a".repeat(40),webHead:"b".repeat(40),policy:{execution:"READ_ONLY",autoApproval:false,canonicalMutation:false},candidates:[{id:"I-01",phase:"F1",decision:"PENDING_PO",canonicalMutation:false}]},{ideas:[{id:"I-01",title:"Idea",origin:"docs/ideas.md",sourceStatus:"UNVERIFIED"}],components:[]}]}
test("binds provenance without inventing dependencies",()=>{const [r,g]=fixture(),x=bind(r,g);assert.equal(x.items[0].origin,"docs/ideas.md");assert.equal(x.items[0].dependencyAssessment,"UNVERIFIED_OR_UNDECLARED");assert.deepEqual(x.items[0].sourceEvidence,[])});
test("rejects duplicate IDs",()=>{const [r,g]=fixture();g.components.push({id:"I-01"});assert.throws(()=>bind(r,g),/DUPLICATE_OR_INVALID_ID/)});
test("rejects auto approval",()=>{const [r,g]=fixture();r.policy.autoApproval=true;assert.throws(()=>bind(r,g),/INVALID_REVIEW/)});
test("missing target is blocked",()=>{const [r,g]=fixture();r.candidates[0].id="MISSING";assert.equal(bind(r,g).items[0].status,"BLOCKED_TARGET_NOT_FOUND")});
test("real temporary file is restored byte-exact",()=>{const [r,g]=fixture(),dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-test-")),file=path.join(dir,"registry.json");try{const original=JSON.stringify(g,null,3)+"\n";fs.writeFileSync(file,original);const x=rehearseFile(bind(r,g),file);assert.equal(x.temporaryCorrectionApplied,true);assert.equal(x.rollbackVerified,true);assert.equal(fs.readFileSync(file,"utf8"),original);assert.equal(x.policy.sourceWrites,0)}finally{fs.rmSync(dir,{recursive:true,force:true})}});
test("rejects stale registry digest",()=>{const [r,g]=fixture(),dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-test-")),file=path.join(dir,"registry.json");try{fs.writeFileSync(file,JSON.stringify({...g,ideas:[]}));assert.throws(()=>rehearseFile(bind(r,g),file),/REGISTRY_DIGEST_MISMATCH/)}finally{fs.rmSync(dir,{recursive:true,force:true})}});

test("blocks duplicate declared dependencies instead of accepting them",()=>{const [r,g]=fixture();g.ideas[0].dependsOn=["I-02","I-02"];g.ideas.push({id:"I-02",dependsOn:[]});assert.equal(bind(r,g).items[0].dependencyAssessment,"UNVERIFIED_OR_UNDECLARED")});
test("blocks direct and transitive dependency cycles",()=>{const [r,g]=fixture();g.ideas[0].dependsOn=["I-02"];g.ideas.push({id:"I-02",dependsOn:["I-03"]},{id:"I-03",dependsOn:["I-01"]});assert.equal(bind(r,g).items[0].dependencyAssessment,"CYCLIC_DEPENDENCY_BLOCKED")});
test("allows declared acyclic dependencies without claiming competence",()=>{const [r,g]=fixture();g.ideas[0].dependsOn=["I-02"];g.ideas.push({id:"I-02",dependsOn:[]});assert.equal(bind(r,g).items[0].dependencyAssessment,"DECLARED_IDS_PRESENT_NOT_COMPETENCE_VERIFIED")});

test("AV-001 autonomously discovers duplicates and evaluates three strategies without writes",()=>{
 const registry={ideas:[{id:"I-01",dependsOn:["I-02","I-02","I-03"]},{id:"I-02",dependsOn:[]},{id:"I-03",dependsOn:[]}],components:[]};
 const before=JSON.stringify(registry),x=repairExperiment(registry);
 assert.equal(x.defect.kind,"DUPLICATE_DEPENDENCY");assert.equal(x.candidates.length,3);
 assert.equal(x.candidates[0].eligible,true);assert.equal(x.candidates[1].eligible,true);
 assert.equal(x.candidates[2].eligible,false);assert.equal(x.rollbackVerified,true);
 assert.equal(x.canonicalMutation,false);assert.equal(JSON.stringify(registry),before);
});
test("AV-001 does not invent defects when none is observed",()=>{
 const x=repairExperiment({ideas:[{id:"I-01",dependsOn:[]}],components:[]});
 assert.equal(x.status,"NO_SUPPORTED_DEFECT_FOUND");assert.deepEqual(x.candidates,[]);
});
test("AV-001 fails closed on duplicate node identities",()=>{
 assert.throws(()=>repairExperiment({ideas:[{id:"I-01"},{id:"I-01"}],components:[]}),/INVALID_REGISTRY_IDS/);
});
