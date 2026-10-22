"use strict";
/** AV-015: bind controlled E2E incident to experimental candidate comparison; no patch promotion. */
const crypto=require("node:crypto");
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function compare(incident,experiment){
 if(!incident||incident.schema!=="ARKI-AV014-CONTROLLED-INCIDENT-1"||incident.baseline!=="FAIL"||incident.diagnosticIncidents!==1||incident.reproduction!=="REPRODUCED"||incident.dossiers!==1||incident.policy?.canonicalMutation!==false||incident.policy?.repairApplied!==false)throw Error("INCIDENT_NOT_CONFIRMED");
 if(!experiment||experiment.schema!=="ARKI-AV012-REPAIR-EXPERIMENT-1"||experiment.scope!=="CONTROLLED_FIXTURE_ONLY"||experiment.baseline?.status!=="FAIL"||experiment.policy?.canonicalMutation!==false||experiment.policy?.repairPromoted!==false||!Array.isArray(experiment.candidates)||experiment.candidates.length!==3)throw Error("INVALID_EXPERIMENT");
 const ids=new Set(),candidates=experiment.candidates.map(c=>{
  if(!c||!["A","B","C"].includes(c.id)||ids.has(c.id)||!["PASS","FAIL","TIMEOUT","EXECUTION_ERROR"].includes(c.status)||c.rollbackVerified!==true||c.canonicalMutation!==false)throw Error("UNSAFE_CANDIDATE");
  ids.add(c.id);
  return {id:c.id,status:c.status,rollbackVerified:true,decision:c.status==="PASS"?"ELIGIBLE_FOR_FURTHER_VERIFICATION":"REJECTED"};
 });
 if(ids.size!==3)throw Error("MISSING_CANDIDATE");
 const passing=candidates.filter(c=>c.status==="PASS");
 const result={schema:"ARKI-AV015-EXPERIMENT-BRIDGE-1",originalHead:incident.originalHead,sourceIncidentReceipt:incident.receipts?.dossier||null,sourceExperimentReceipt:experiment.receiptSha256||null,scope:"TWO_SEPARATE_CONTROLLED_FIXTURES",sameIncidentPatchDemonstrated:false,candidates,summary:{passing:passing.length,rejected:candidates.length-passing.length,selected:null},nextAction:"RUN_CANDIDATES_AGAINST_EXACT_REPRODUCED_INCIDENT_IN_ISOLATED_CLONE",policy:{canonicalMutation:false,repairApplied:false,poApproval:"REQUIRED",autoSelection:false}};
 result.receiptSha256=digest(result);return result;
}
module.exports={compare};
if(require.main===module){try{const fs=require("node:fs");if(process.argv.length!==4)throw Error("USAGE: node arki-av015-compare.cjs AV014_JSON AV012_JSON");function read(p){const st=fs.lstatSync(p);if(!st.isFile()||st.isSymbolicLink()||st.size>3000000)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(p,"utf8"))}process.stdout.write(JSON.stringify(compare(read(process.argv[2]),read(process.argv[3])),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV015_FAIL: "+e.message+"\n");process.exitCode=1}}
