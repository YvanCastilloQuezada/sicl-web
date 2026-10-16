"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {composeLiveSystems}=require("./REC-001/arki-live-systems-coordinator.cjs");
const {proposeRelations}=require("./REC-002/arki-relational-learning.cjs");
const {evaluateThree}=require("./REC-003/arki-twin-three-alternatives.cjs");
const {classify,sanitizeUrl,run}=require("./REC-006/arki-live-pulse.cjs");
const sourceCommit="a".repeat(40);
const registry={updated_at:"experimental-fixture",ideas:[{id:"I-01",targetPhase:"F1",dependencies:[],sourceStatus:"UNKNOWN"}],components:[]};
test("REC-001: coordinator loads all recovered relative imports and fails closed",()=>{
 assert.throws(()=>composeLiveSystems({registry,map:{},sourceCommit}),/INVALID_MASTER_MAP/);
});
test("REC-002: relation proposal never promotes",()=>{
 const source={path:"docs/source.md",sha:sourceCommit,quote:"I-01 informs X"};
 const result=proposeRelations({ideas:[{id:"I-01",dependencies:[]},{id:"I-02",dependencies:[]}],components:[]},[{before:"I-01",after:"I-02",relation:"INFORMS",source}]);
 assert.equal(result.candidates.length,1);
 assert.equal(result.candidates[0].decision,"PROPOSED_FOR_REVIEW");
 assert.equal(result.canonicalMutation,false);
});
test("REC-003: three hypothetical options cannot be approved",()=>{
 const alternatives=["A","B","C"].map(id=>({id,evidenceLevel:"HYPOTHETICAL",timeMs:90,cost:95,quality:80,risk:20,testsPassed:1,testsTotal:1}));
 const result=evaluateThree({ideaId:"I-01",sourceCommit,baseline:{timeMs:100,cost:100,quality:70},alternatives,dependencyGate:"PASS"});
 assert.equal(result.status,"SIMULATION_EVIDENCE_INCOMPLETE");
 assert(result.alternatives.every(a=>!a.eligibleForOwnerDecision));
});
test("REC-006: unknown is not healthy",async()=>{
 assert.equal(classify([{state:"UP"},{state:"UNKNOWN"}]),"UNKNOWN");
 assert.throws(()=>sanitizeUrl("file:///etc/passwd"));
 assert.equal((await run({})).architecturalState,"UNKNOWN");
});
