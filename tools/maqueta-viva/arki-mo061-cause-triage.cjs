"use strict";
/** MO-06.1: classify primary evidence gaps vs downstream consequences.
 * Structural inference only: missing declarations are NOT proof of true graph roots.
 */
const crypto=require("node:crypto");
const {project}=require("./arki-mo05-operational.cjs");
const {propose}=require("./arki-mo055-proposals.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function diagnose(registry){
 const projection=project(registry),candidates=propose(registry);
 const activities=projection.views.arbol.activities;
 const byId=new Map(activities.map(x=>[x.id,x]));
 const issues=projection.views.arbol.issues;
 const direct=new Map(activities.map(x=>[x.id,new Set()]));
 for(const issue of issues)if(direct.has(issue.id))direct.get(issue.id).add(issue.code);
 const roots=activities.filter(x=>direct.get(x.id).size>0||x.missingDependencies.length>0)
   .map(x=>({id:x.id,phase:x.phase,sequence:x.sequence,codes:[...direct.get(x.id)].sort(),missingDependencies:x.missingDependencies}));
 const rootIds=new Set(roots.map(x=>x.id));
 const memo=new Map(),visiting=new Set();
 function ancestors(id){
  if(memo.has(id))return memo.get(id);
  if(visiting.has(id))return new Set();
  visiting.add(id);const a=byId.get(id),out=new Set();
  for(const dep of a?.dependsOn||[]){if(rootIds.has(dep))out.add(dep);if(byId.has(dep))for(const x of ancestors(dep))out.add(x)}
  visiting.delete(id);memo.set(id,out);return out;
 }
 const consequences=activities.filter(x=>!rootIds.has(x.id)&&x.dependencyState==="BLOCKED_UNVERIFIED")
  .map(x=>({id:x.id,phase:x.phase,upstreamEvidenceGaps:[...ancestors(x.id)].sort(),status:"BLOCKED_UNVERIFIED"}));
 const unresolved=activities.filter(x=>!rootIds.has(x.id)&&x.dependencyState==="BLOCKED_UNVERIFIED"&&!ancestors(x.id).size).map(x=>x.id);
 const report={schema:"ARKI-MO061-CAUSE-TRIAGE-1",sourceReceipt:projection.receiptSha256,proposalReceipt:candidates.receiptSha256,
  summary:{activities:activities.length,reportedIssues:issues.length,primaryEvidenceGapActivities:roots.length,downstreamBlocked:consequences.length,unattributedBlocked:unresolved.length,proposals:candidates.summary.proposals},
  primaryEvidenceGaps:roots,downstreamConsequences:consequences,unattributedBlocked:unresolved,
  policy:{classification:"STRUCTURAL_ONLY_NOT_CAUSAL_PROOF",automaticRepair:false,canonicalMutation:false,poApproval:"REQUIRED",execution:"BLOCKED"}};
 report.receiptSha256=hash(report);return report;
}
module.exports={diagnose};
if(require.main===module){const fs=require("node:fs"),path=require("node:path");const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));process.stdout.write(JSON.stringify(diagnose(registry),null,2)+"\n")}
