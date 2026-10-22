"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const {build,PHASES}=require("./arki-arbol-vivo-auto.cjs");
const inventory=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
const result=build(inventory);
assert.deepEqual(result.trunk,PHASES);
assert.equal(result.counts.total,inventory.ideas.length+inventory.components.length);
assert.equal(result.order.length,result.counts.total);
assert.equal(result.counts.excluded,1);
assert.equal(result.excluded[0].id,"I-24");
assert.equal(result.unassigned.length,0);
assert(result.issues.some(x=>x.id==="I-24"&&x.code==="EXPLICITLY_OUT_OF_SCOPE"));
assert.equal(new Set(result.order.map(x=>x.id)).size,result.counts.total);
assert.equal(result.autonomy.experiment,"NOT_EXECUTED");
assert.equal(result.autonomy.phaseAssignment,"HISTORICAL_REUSED_NOT_AUTONOMOUS");
assert.equal(result.autonomy.canonicalMutation,false);
assert.equal(build(inventory).receiptSha256,result.receiptSha256);
assert.throws(()=>build({ideas:[{id:"A"},{id:"A"}],components:[]}),/DUPLICATE/);
const dependency=build({ideas:[{id:"A",targetPhase:"F1"},{id:"B",targetPhase:"F2",dependencies:["A"]}],components:[]});
assert.deepEqual(dependency.order.map(x=>x.id),["A","B"]);
const cycle=build({ideas:[{id:"A",targetPhase:"F1",dependencies:["B"]},{id:"B",targetPhase:"F2",dependencies:["A"]}],components:[]});
assert(cycle.issues.some(x=>x.code==="DEPENDENCY_CYCLE"));

const chain=build({ideas:[
 {id:"ROOT",targetPhase:"F2",sourceStatus:"DEMONSTRATED",verification:"NOT_CURRENTLY_REVALIDATED",sourceEvidence:"old test"},
 {id:"MID",targetPhase:"F3",dependencies:["ROOT"]},
 {id:"LEAF",targetPhase:"F8",dependencies:["MID"]},
 {id:"FREE",targetPhase:"F1"}
],components:[]});
assert.equal(chain.order.find(x=>x.id==="ROOT").downstreamCount,2);
assert.equal(chain.order.find(x=>x.id==="MID").downstreamCount,1);
assert.equal(chain.order.find(x=>x.id==="LEAF").downstreamCount,0);
assert.equal(chain.order.find(x=>x.id==="ROOT").missing,true);
assert.equal(chain.order[0].id,"ROOT");
assert.equal(chain.autonomy.priority,"TRANSITIVE_DEPENDENCY_REACH_NO_DURATION_OR_URGENCY");
const unknown=build({ideas:[{id:"ORPHAN",targetPhase:"F1",dependencies:["NONEXISTENT"]}],components:[]});
assert(unknown.issues.some(x=>x.code==="UNKNOWN_DEPENDENCY"));
assert.equal(unknown.order[0].dependenciesResolved,false);
const explicit=build({ideas:[{id:"V",targetPhase:"F1",sourceStatus:"VERIFIED",verification:"CURRENTLY_VERIFIED",sourceEvidence:"sha:abc"}],components:[]});
assert.equal(explicit.order[0].missing,false);

const typed=build({ideas:[
 {id:"P",targetPhase:"F1"},
 {id:"Q",targetPhase:"F2",dependencyEdges:[{type:"REQUIRES",targetId:"P",status:"VERIFIED",evidenceRef:"contract#gate"}]},
 {id:"R",targetPhase:"F3",dependencyEdges:[{type:"CROSS_PHASE",targetId:"P",status:"VERIFIED",evidenceRef:"contract#link"}]}
],components:[]});
assert.equal(typed.order.find(x=>x.id==="P").downstreamCount,1);
assert.deepEqual(typed.order.find(x=>x.id==="Q").dependencies,["P"]);
assert.deepEqual(typed.order.find(x=>x.id==="R").dependencies,[]);
const unverifiedEdge=build({ideas:[{id:"U",targetPhase:"F1",dependencyEdges:[{type:"REQUIRES",targetId:"P",status:"PROPOSED"}]}],components:[]});
assert(unverifiedEdge.issues.some(x=>x.code==="UNVERIFIED_PRECEDENCE"));
assert.equal(unverifiedEdge.order[0].dependenciesResolved,false);
const self=build({ideas:[{id:"SELF",targetPhase:"F1",dependencies:["SELF"]}],components:[]});
assert(self.issues.some(x=>x.code==="SELF_DEPENDENCY"));
assert(self.issues.some(x=>x.code==="DEPENDENCY_CYCLE"));
console.log("ARKI_ARBOL_VIVO_AUTO_001=PASS; INVENTORY="+result.counts.total+"; PHASE_ASSIGNMENT_NOT_AUTONOMOUS; REAL_EXPERIMENT_NOT_EXECUTED");
