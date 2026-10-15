"use strict";
/** MO-06.2: aggregate evidence gaps by observed code, not asserted common cause. */
const crypto=require("node:crypto");
const {diagnose}=require("./arki-mo061-cause-triage.cjs");
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function cluster(registry){
 const source=diagnose(registry),groups=new Map();
 for(const a of source.primaryEvidenceGaps){
  const codes=a.codes.length?a.codes:["UNCLASSIFIED_EVIDENCE_GAP"];
  for(const code of codes){
   if(!groups.has(code))groups.set(code,{code,activities:[],phases:new Set()});
   const g=groups.get(code);g.activities.push(a.id);g.phases.add(a.phase);
  }
 }
 const workstreams=[...groups.values()].map(g=>({
  id:"MO062-"+g.code,issueCode:g.code,affectedActivities:[...new Set(g.activities)].sort(),
  phases:[...g.phases].sort(),sharedActionCandidate:"REVIEW_SOURCE_EVIDENCE_AND_DEPENDENCY_DECLARATIONS",
  sharedCauseProven:false,priorityBasis:"AFFECTED_ACTIVITY_COUNT_NOT_CRITICAL_PATH",
  authorization:"REQUIRED",status:"RESEARCH_PENDING"
 })).sort((a,b)=>b.affectedActivities.length-a.affectedActivities.length||a.issueCode.localeCompare(b.issueCode));
 const report={schema:"ARKI-MO062-EVIDENCE-WORKSTREAMS-1",sourceReceipt:source.receiptSha256,
  summary:{activities:source.summary.activities,reportedIssues:source.summary.reportedIssues,
   primaryEvidenceGapActivities:source.summary.primaryEvidenceGapActivities,workstreams:workstreams.length,
   distinctAffectedActivities:new Set(workstreams.flatMap(x=>x.affectedActivities)).size},
  workstreams,policy:{deduplication:"BY_REPORTED_ISSUE_CODE_ONLY",sharedCauseVerified:false,
   criticalPathVerified:false,canonicalMutation:false,automaticRepair:false,poApproval:"REQUIRED"}};
 report.receiptSha256=digest(report);return report;
}
module.exports={cluster};
if(require.main===module){const fs=require("node:fs"),path=require("node:path");const r=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));process.stdout.write(JSON.stringify(cluster(r),null,2)+"\n")}
