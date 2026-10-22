"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");

const root=path.resolve(__dirname,"../..");
const html=fs.readFileSync(path.join(__dirname,"maqueta-viva.template.html"),"utf8");
const registry=fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8");
const canonicalPath=path.join(root,"docs/arki-master-map/ARKI_MASTER_MAP_STATE.json");
const original=fs.readFileSync(canonicalPath,"utf8");
const state=JSON.parse(original);

const phase=state.roadmap.phases.find(x=>x.id==="F6");
assert(phase,"F6 must exist");
phase.status="FROZEN";

const match=html.match(/<script(?:\s[^>]*)?>\s*([\s\S]*?)<\/script\s*>/gi)
  ?.find(x=>/^<script>\s*/i.test(x));
assert(match,"Application script missing");

const script=match.replace(/^<script>\s*/i,"")
  .replace(/<\/script\s*>$/i,"")
  .replace(/\r\n?/g,"\n");

const exposed=`
render();
return {
  stagePiece,
  addConnection,
  arkiDependencyTopology,
  setTestDependencies:(id,deps)=>{
    reviews[id]={...(reviews[id]||{}),dependencies:[...deps]};
  },
  getPlacements:()=>({...placements}),
  getReviews:()=>({...reviews}),
  arkiConstructionWaves,
  arkiProposalExperiment
};
})();`;

const testSource=script.replace("(function(){","return (function(){")
  .replace(/\nrender\(\);\n\}\)\(\);\s*$/,exposed);

assert.notEqual(testSource,script,"Harness injection failed");

const storage=new Map();
const zone={
  setAttribute(){},
  addEventListener(){},
  classList:{add(){},remove(){}},
  contains(){return false;}
};
const app={
  innerHTML:"",
  addEventListener(){},
  querySelectorAll(){return [];},
  querySelector(sel){
    return sel==="#arki-workspace"
      ?zone
      :{addEventListener(){},focus(){},setSelectionRange(){}};
  }
};
const document={
  getElementById(id){
    if(id==="app")return app;
    if(id==="stamp")return {textContent:""};
    if(id==="arki-state")return {textContent:JSON.stringify(state)};
    if(id==="arki-assembly")return {textContent:registry};
    return null;
  },
  body:{appendChild(){}},
  createElement(){return {click(){},remove(){}};}
};
const localStorage={
  getItem:k=>storage.get(k)||null,
  setItem:(k,v)=>storage.set(k,v),
  removeItem:k=>storage.delete(k)
};

const api=new Function(
  "document","localStorage","FileReader","navigator",testSource
)(
  document,localStorage,class FileReader{},
  {platform:"NodeMock",userAgent:"NodeMock"}
);

let count=0;
function check(name,condition){
  assert(condition,name);
  count++;
  console.log("PASS",name);
}

api.stagePiece("I-01","F6");
check("F6 accepts evolutionary draft",
  api.getPlacements()["I-01"]==="F6");

api.stagePiece("F6-FREEZE","F1");
check("historical F6 snapshot remains immovable",
  !Object.hasOwn(api.getPlacements(),"F6-FREEZE"));

const waves=api.arkiConstructionWaves();
check("F6 piece enters planning waves",
  waves.waves.some(w=>w.some(x=>x.id==="I-01")));

check("historical FROZEN is not a blocker",
  !waves.blocked.some(x=>x.id==="I-01"));

const before=JSON.stringify(api.getPlacements());
const experiment=api.arkiProposalExperiment({
  id:"SPINE-F6",
  phase:"F6"
});

check("isolated F6 experiment evaluated",
  experiment.experiment?.candidateCount===4);

check("experiment does not mutate placements",
  JSON.stringify(api.getPlacements())===before);

check("experiment cannot authorize promotion",
  experiment.eligibleForAuthorization===false &&
  experiment.experiment.realExecution===false &&
  experiment.experiment.poApproval===false);

check("planning cannot authorize execution",
  waves.executionAuthorized===false);

check("canonical source file unchanged",
  fs.readFileSync(canonicalPath,"utf8")===original);


// AV-035D: adversarial dependency tests in isolated memory.
api.setTestDependencies("I-01",["AV035D_NONEXISTENT"]);

const missingTopology=api.arkiDependencyTopology();
const missingWaves=api.arkiConstructionWaves();

check("AV035D missing dependency detected",
  missingTopology.missing instanceof Map &&
  (missingTopology.missing.get("I-01")||[]).includes("AV035D_NONEXISTENT"));

check("AV035D missing dependency blocks planning",
  missingWaves.blocked.some(x=>x.id==="I-01"));

api.setTestDependencies("I-01",["HC-03"]);
api.setTestDependencies("HC-03",["I-01"]);

const cycleTopology=api.arkiDependencyTopology();
const cycleWaves=api.arkiConstructionWaves();

check("AV035D cycle detected",
  cycleTopology.cycleMembers.has("I-01") &&
  cycleTopology.cycleMembers.has("HC-03"));

check("AV035D cycle blocks planning",
  cycleWaves.blocked.some(x=>x.id==="I-01") &&
  cycleWaves.blocked.some(x=>x.id==="HC-03"));

api.setTestDependencies("I-01",[]);
api.setTestDependencies("HC-03",[]);

const recoveredWaves=api.arkiConstructionWaves();

check("AV035D corrected dependencies restore planning",
  recoveredWaves.waves.some(w=>w.some(x=>x.id==="I-01")));

check("AV035D corrected planning still requires authorization",
  recoveredWaves.executionAuthorized===false);

check("AV035D canonical source remains unchanged",
  fs.readFileSync(canonicalPath,"utf8")===original);

console.log("AV035D_ADVERSARIAL_PASS=7/7");

console.log(`AV035C_EVOLUTION_PASS=${count}/${count}`);
