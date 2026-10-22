"use strict";
/** AV-008: evidence-bounded investigation plans; no invented root cause or repair. */
const crypto=require("node:crypto");
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function investigate(diagnostic){
 if(!diagnostic||diagnostic.schema!=="ARKI-AV006-DIAGNOSTIC-1"||!/^[a-f0-9]{40}$/.test(diagnostic.webHead)||!Array.isArray(diagnostic.incidents)||!Array.isArray(diagnostic.modules))throw Error("INVALID_DIAGNOSTIC");
 const modules=new Map(diagnostic.modules.map(x=>[x.test,x]));
 if(modules.size!==diagnostic.modules.length)throw Error("DUPLICATE_MODULE");
 const seen=new Set();
 const cases=diagnostic.incidents.map(incident=>{
  if(!incident||incident.kind!=="CONFIRMED_TEST_FAILURE"||typeof incident.test!=="string"||seen.has(incident.test))throw Error("UNSUPPORTED_INCIDENT");
  seen.add(incident.test);
  const module=modules.get(incident.test);
  if(!module||module.status!=="TEST_FAILED"||!["FAIL","TIMEOUT","EXECUTION_ERROR"].includes(module.outcome))throw Error("INCIDENT_WITHOUT_FAILED_TEST");
  const strategies=[
   {id:"A",name:"REPRODUCE_IN_ISOLATION",action:"Re-run only the failing test in a bounded disposable environment",execution:"NOT_EXECUTED"},
   {id:"B",name:"COMPARE_PROVENANCE",action:"Compare test/source history and expected behavior without editing canonical files",execution:"NOT_EXECUTED"},
   {id:"C",name:"MINIMAL_COUNTEREXAMPLE",action:"Prepare a minimal failing fixture in an isolated workspace",execution:"NOT_EXECUTED"}
  ];
  return {test:incident.test,outcome:module.outcome,classification:"FAILURE_CONFIRMED_CAUSE_UNKNOWN",rootCause:"UNKNOWN",strategies,repairCandidates:[],requiredEvidence:["isolated_reproduction","failure_output","source_contract","regression_test"],authorization:"PO_REQUIRED_BEFORE_CANONICAL_CHANGE"};
 });
 const result={schema:"ARKI-AV008-INVESTIGATION-1",webHead:diagnostic.webHead,sourceDiagnosticReceipt:diagnostic.receiptSha256||null,cases,summary:{incidents:cases.length,strategiesProposed:cases.length*3,repairsDemonstrated:0},policy:{f6:"UNLOCKED_BY_PO",canonicalMutation:false,experimentsExecuted:false,autoApproval:false,architecturalCompetence:"NOT_DEMONSTRATED"}};
 result.receiptSha256=digest(result);return result;
}
module.exports={investigate};
if(require.main===module){try{const fs=require("node:fs");if(process.argv.length!==3)throw Error("USAGE: node arki-av008-investigate.cjs DIAGNOSTIC_JSON");const p=process.argv[2],s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>3000000)throw Error("UNSAFE_INPUT");process.stdout.write(JSON.stringify(investigate(JSON.parse(fs.readFileSync(p,"utf8"))),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV008_FAIL: "+e.message+"\n");process.exitCode=1}}
