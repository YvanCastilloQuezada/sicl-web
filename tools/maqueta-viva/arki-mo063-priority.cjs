"use strict";
/** MO-06.3: evidence-first investigation queue; never infer undocumented edges. */
const crypto=require("node:crypto");
const {cluster}=require("./arki-mo062-workstreams.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function prioritize(registry){
 const grouped=cluster(registry);
 const tasks=grouped.workstreams.map(g=>{
  const scope=g.issueCode==="EXPLICITLY_OUT_OF_SCOPE";
  return {id:"MO063-"+g.issueCode,issueCode:g.issueCode,
   affectedActivities:g.affectedActivities,phases:g.phases,
   priority:scope?"SCOPE_REVIEW":"EVIDENCE_RECOVERY",
   queueOrder:scope?2:1,
   nextAction:scope?"VERIFY_EXCLUSION_AND_OWNER_DECISION":"LOCATE_PROVENANCE_AND_DECLARE_ONLY_VERIFIED_PREDECESSORS",
   evidenceRequired:scope?["SCOPE_DECISION","OWNER_APPROVAL_IF_SCOPE_CHANGES"]:["SOURCE_REFERENCE","DECLARED_DEPENDENCY_SET","REVIEWED_BY"],
   evidenceStatus:"NOT_VERIFIED",candidateDependencies:[],
   criticalPathClaim:"NOT_VERIFIED",automaticExecution:false,poApproval:"REQUIRED_FOR_CHANGES"};
 }).sort((a,b)=>a.queueOrder-b.queueOrder||b.affectedActivities.length-a.affectedActivities.length||a.id.localeCompare(b.id));
 const report={schema:"ARKI-MO063-INVESTIGATION-QUEUE-1",sourceReceipt:grouped.receiptSha256,
  summary:{workstreams:tasks.length,activities:grouped.summary.activities,affectedActivities:grouped.summary.distinctAffectedActivities},
  queue:tasks,policy:{evidenceFirst:true,inferredDependencies:false,criticalPathVerified:false,canonicalMutation:false,automaticExecution:false}};
 report.receiptSha256=sha(report);return report;
}
module.exports={prioritize};
if(require.main===module){const fs=require("node:fs"),path=require("node:path");const r=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));process.stdout.write(JSON.stringify(prioritize(r),null,2)+"\n")}
