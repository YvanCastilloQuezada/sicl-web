"use strict";
/** MO-05: read-only operational projection for the five official ARKI views.
 * The PO releases IDEA-only planning holds; immutable technical contracts are untouched.
 */
const crypto=require("node:crypto");
const {build}=require("./arki-arbol-vivo-auto.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function project(registry){
 const tree=build(registry);
 const all=[...registry.ideas.map(x=>({...x,kind:"IDEA"})),...registry.components.map(x=>({...x,kind:"COMPONENT"}))];
 const byId=new Map(all.map(x=>[x.id,x]));
 const positions=new Map(tree.order.map((x,i)=>[x.id,i]));
 const activities=tree.order.map((x,i)=>{
  const source=byId.get(x.id);
  const idea=source&&registry.ideas.some(y=>y.id===x.id);
  const frozen=String(source?.sourceStatus||"").toUpperCase().includes("FROZEN");
  const dependencies=Array.isArray(x.dependsOn)?x.dependsOn:[];
  const missing=dependencies.filter(id=>!byId.has(id));
  return {id:x.id,title:String(source?.title||x.id),kind:idea?"IDEA":"COMPONENT",phase:x.phase,
   sequence:i+1,dependsOn:dependencies,successors:tree.order.filter(y=>y.dependsOn?.includes(x.id)).map(y=>y.id),
   dependencyState:x.prerequisiteStatus,planningHold:idea&&frozen?"RELEASED_BY_PO_FOR_PLANNING":frozen?"PROTECTED_TECHNICAL": "NONE",
   proposedOnly:true,executionAuthorized:false,missingDependencies:missing,
   sourceStatus:source?.sourceStatus||"UNKNOWN",verification:source?.verification||"NOT_VERIFIED"};
 });
 const issues=[...tree.issues,...tree.dependencyCoverage.issues];
 const cycle=issues.some(x=>x.code==="DEPENDENCY_CYCLE");
 const incomplete=activities.some(x=>x.missingDependencies.length||x.dependencyState==="BLOCKED_UNVERIFIED");
 const state={schema:"ARKI-MO05-OPERATIONAL-PROJECTION-1",sourceCut:registry.updated_at||null,
  scope:"ADVISORY_READ_ONLY",policy:{ideaFrozenPlanningHold:"RELEASED_BY_PO",technicalFrozen:"PROTECTED",poApproval:"REQUIRED_PER_EXECUTION",canonicalMutation:false,agkExecution:false},
  summary:{total:all.length,ordered:activities.length,unsequenced:all.length-activities.length,issues:issues.length,cycle,dependencyBlockers:incomplete},
  views:{plano:{purpose:"CHATGPT_CONTINUITY",nextActions:activities.filter(x=>x.dependencyState!=="BLOCKED_UNVERIFIED").slice(0,5).map(x=>x.id),status:cycle?"BLOCKED_CYCLE":"ADVISORY_READY"},
   arbol:{purpose:"PO_DECISIONS",activities,issues},
   gemelo:{purpose:"ISOLATED_EXPERIMENTS",simulation:"NOT_EXECUTED",alternatives:[]},
   cerebro:{purpose:"COMPETENCE",learning:"DEFERRED",competence:"NOT_VERIFIED"},
   spatial3d:{purpose:"AGK_VISUALIZATION",geometry:"NOT_EXECUTED"}},
  sourceEvidence:{registry:"assembly-registry.json",ordering:"arki-arbol-vivo-auto.cjs"}};
 state.receiptSha256=sha(state);return state;
}
module.exports={project};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path");
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(project(registry),null,2)+"\n");
}
