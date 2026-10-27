"use strict";
/** ARKI end-to-end advisory diagnostic run. No AGK execution, PO approval, or canonical writes. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {planMo03}=require("./arki-mo03-autoplan.cjs");
const {recordPlan,treeHistory}=require("./arki-mo04-mo03-adapter.cjs");
const {inspect}=require("./arki-mo04-guarded.cjs");
function read(file){const s=fs.lstatSync(file);if(!s.isFile()||s.isSymbolicLink()||s.size>2000000)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(file,"utf8"))}
function execute({registry,coreMap,webSnapshot,expectedCoreHead,journal,anchor}){
 const plan=planMo03({registry,coreMap,webSnapshot,expectedCoreHead});
 const record=recordPlan(journal,anchor,plan);
 const persisted=inspect(journal,anchor);
 if(!persisted.replay.events.some(x=>x.kind==="DIAGNOSIS"&&x.sourceReceipt===plan.receiptSha256))throw Error("DIAGNOSIS_NOT_PERSISTED");
 const view=treeHistory(journal,anchor);
 return {schema:"ARKI-INTEGRATED-DIAGNOSIS-1",planReceipt:plan.receiptSha256,counts:plan.counts,priority:plan.queue.filter(x=>x.gate==="BLOCKED_UNVERIFIED").slice(0,5).map(x=>({id:x.id,phase:x.phase,proposedAction:x.proposedAction,dependencyState:x.dependencyState})),excluded:plan.queue.filter(x=>x.gate==="EXCLUDED_OUT_OF_SCOPE").map(x=>x.id),recordStatus:record.status,historyLength:persisted.replay.length,historyHead:persisted.replay.head,treeHistoryEvents:view.events.length,policy:{agkExecuted:false,competenceVerified:false,canonicalMutation:false,poApproval:"NOT_GRANTED"},nextAction:"DECLARE_DEPENDENCIES_WITH_EVIDENCE"};
}
module.exports={execute};
if(require.main===module){
 try{
  const [coreFile,webFile,coreHead,journal,anchor]=process.argv.slice(2);
  if(!coreFile||!webFile||!coreHead||!journal||!anchor||process.argv.length!==7)throw Error("USAGE: node arki-integrated-diagnosis.cjs CORE_JSON WEB_JSON CORE_SHA JOURNAL_ABSOLUTE ANCHOR_ABSOLUTE");
  const registry=read(path.join(__dirname,"assembly-registry.json"));
  const result=execute({registry,coreMap:read(coreFile),webSnapshot:read(webFile),expectedCoreHead:coreHead,journal,anchor});
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_INTEGRATED_DIAGNOSIS_FAIL: "+e.message+"\n");process.exitCode=1}
}
