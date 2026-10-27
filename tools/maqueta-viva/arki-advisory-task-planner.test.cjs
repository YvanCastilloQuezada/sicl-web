"use strict";
const assert=require("node:assert/strict");
const {planTasks}=require("./arki-advisory-task-planner.cjs");
const registry={ideas:[
 {id:"I-01",title:"Identity",targetPhase:"F1",sourceStatus:"PRESENT_DOCUMENTARY"},
 {id:"I-02",title:"Knowledge",targetPhase:"F2",sourceStatus:"PRESENT_DOCUMENTARY"},
 {id:"I-03",title:"Frozen",targetPhase:"F3",sourceStatus:"FROZEN"},
 {id:"I-04",title:"Later",targetPhase:"F4",sourceStatus:"PRESENT_DOCUMENTARY"}
]};
let p=planTasks(registry);
assert.equal(p.orderedCandidates.length,0);
assert.equal(p.tasks[0].status,"DEPENDENCIES_UNKNOWN");
assert.equal(p.criticalPath,"UNKNOWN_UNVERIFIED_DEPENDENCIES");
p=planTasks(registry,{dependencies:{"I-01":[],"I-02":["I-01"],"I-03":[],"I-04":["I-02"]}});
assert.deepEqual(p.orderedCandidates,["I-01"]);
assert.equal(p.tasks[1].status,"BLOCKED_BY_DEPENDENCY");
assert.equal(p.tasks[2].status,"FROZEN_NO_MUTATION");
p=planTasks(registry,{dependencies:{"I-01":[],"I-02":["I-01"],"I-03":[],"I-04":["I-02"]},completed:["I-01"]});
assert.deepEqual(p.orderedCandidates,["I-01","I-02"]);
p=planTasks(registry,{dependencies:{"I-01":["I-99"],"I-02":["I-01"],"I-03":[],"I-04":["I-02"]}});
assert.equal(p.tasks[0].status,"INVALID_DEPENDENCY");
assert.equal(p.canonicalMutation,false);
assert.equal(p.execution,"BLOCKED");
console.log("ARKI_ADVISORY_PLANNER_TESTS=PASS");
