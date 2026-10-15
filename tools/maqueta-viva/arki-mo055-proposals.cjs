"use strict";
/** MO-05.5: deterministic remediation proposals, no simulated outcomes or PO approvals. */
const crypto=require("node:crypto");
const {project}=require("./arki-mo05-operational.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const ALTERNATIVES=[
 {id:"A",strategy:"RECONCILE_SOURCE_DEPENDENCIES",description:"Verify predecessors against original evidence and update candidate graph only"},
 {id:"B",strategy:"ISOLATED_DEPENDENCY_EXPERIMENT",description:"Evaluate dependency hypotheses in a disposable copy; do not change canonical sources"},
 {id:"C",strategy:"DEFER_WITH_EVIDENCE_GATE",description:"Quarantine unresolved activity until provenance and prerequisite evidence are available"}
];
function propose(registry){
 const projection=project(registry);
 const entries=projection.views.arbol.activities;
 const coverage=projection.views.arbol.issues;
 const byId=new Map(entries.map(x=>[x.id,x]));
 const problems=new Map();
 for(const issue of coverage){
  if(!issue.id||!byId.has(issue.id))continue;
  if(!problems.has(issue.id))problems.set(issue.id,[]);
  problems.get(issue.id).push(issue.code);
 }
 const proposals=entries.filter(x=>problems.has(x.id)||x.dependencyState==="BLOCKED_UNVERIFIED").map(x=>({
  id:"MO055-"+x.id,activityId:x.id,phase:x.phase,sequence:x.sequence,dependsOn:x.dependsOn,
  blockers:[...new Set([...(problems.get(x.id)||[]),...(x.dependencyState==="BLOCKED_UNVERIFIED"?["DEPENDENCY_STRUCTURE_BLOCKED"]:[])])].sort(),
  status:"AWAITING_EVIDENCE_AND_PO",alternatives:ALTERNATIVES.map(a=>({...a,simulation:"NOT_EXECUTED",measuredBenefit:null,rollbackVerified:false,approved:false})),
  recommended:"C",recommendationBasis:"FAIL_CLOSED_UNTIL_EVIDENCE",
  executionAuthorized:false
 }));
 const result={schema:"ARKI-MO055-PROPOSALS-1",sourceReceipt:projection.receiptSha256,
  summary:{activities:entries.length,issues:coverage.length,proposals:proposals.length,unsequenced:projection.summary.unsequenced},
  proposals,policy:{canonicalMutation:false,simulationExecuted:false,poApproval:"REQUIRED",execution:"BLOCKED"},};
 result.receiptSha256=sha(result);return result;
}
module.exports={propose};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path");
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(propose(registry),null,2)+"\n");
}
