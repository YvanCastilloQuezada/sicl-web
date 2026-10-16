"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const {composeLiveSystems}=require("./arki-live-systems-coordinator.cjs");
const root=path.resolve(__dirname,"../..");
const map=JSON.parse(fs.readFileSync(path.join(root,"docs/arki-master-map/ARKI_MASTER_MAP_STATE.json"),"utf8"));
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
const sourceCommit="a".repeat(40);
const run=extra=>composeLiveSystems({registry,map,sourceCommit,...extra});
test("uses existing map, tree and ADN modules without canonical writes",()=>{
 const r=run();
 assert.equal(r.schema,"ARKI-LIVE-SYSTEMS-SNAPSHOT-1");
 assert.equal(r.tree.counts.total,registry.ideas.length+registry.components.length);
 assert.equal(r.map.findings.length,10);
 assert.equal(r.twin.decisions.length,0);
 assert.equal(r.execution,"READ_ONLY");
 assert.equal(r.canonicalMutation,false);
});
test("deterministic unified receipt",()=>assert.equal(run().receiptSha256,run().receiptSha256));
test("unknown idea is rejected",()=>assert.throws(()=>run({alternativesByIdea:{NONEXISTENT:[]}}),/UNKNOWN_IDEA/));
test("incomplete twin input is rejected",()=>assert.throws(()=>run({alternativesByIdea:{[registry.ideas[0].id]:[]}}),/INCOMPLETE_TWIN_INPUT/));
test("three hypothetical options never reach owner decision",()=>{
 const id=registry.ideas[0].id;
 const baseline={timeMs:100,cost:100,quality:70};
 const alternatives=["A","B","C"].map(id=>({id,evidenceLevel:"HYPOTHETICAL",timeMs:90,cost:95,quality:80,risk:20,testsPassed:1,testsTotal:1}));
 const r=run({baselineByIdea:{[id]:baseline},alternativesByIdea:{[id]:alternatives}});
 assert.equal(r.twin.decisions[0].status,"DEPENDENCIES_BLOCKED");
 assert(r.twin.decisions[0].alternatives.every(x=>!x.eligibleForOwnerDecision));
 assert.equal(r.owner.decision,"PENDING");
});

test("standalone ZIP CLI accepts explicit source SHA and stays read-only",()=>{
 const {spawnSync}=require("node:child_process");
 const result=spawnSync(process.execPath,[path.join(__dirname,"arki-live-systems-coordinator.cjs"),sourceCommit],{encoding:"utf8",timeout:15000});
 assert.equal(result.status,0,result.stderr);
 const snapshot=JSON.parse(result.stdout);
 assert.equal(snapshot.sourceCommit,sourceCommit);
 assert.equal(snapshot.execution,"READ_ONLY");
 assert.equal(snapshot.canonicalMutation,false);
 assert.equal(snapshot.owner.decision,"PENDING");
});
