"use strict";
/** MO-025: bounded advisory cycle. No daemon, no canonical mutation, no auto-approval. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {pulse}=require("./arki-live-pulse.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function readJson(file){
 const stat=fs.lstatSync(file);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>2_000_000)throw Error("UNSAFE_SOURCE_FILE");
 return JSON.parse(fs.readFileSync(file,"utf8"));
}
function run({coreFile,webFile,expectedCoreHead,stateDir,registryFile}){
 if(!/^[0-9a-f]{40}$/.test(expectedCoreHead))throw Error("INVALID_EXPECTED_CORE_HEAD");
 if(!path.isAbsolute(stateDir)||stateDir==="/")throw Error("INVALID_STATE_DIR");
 const parent=path.dirname(stateDir);
 if(!fs.existsSync(parent)||fs.lstatSync(parent).isSymbolicLink())throw Error("UNSAFE_STATE_PARENT");
 if(fs.existsSync(stateDir)&&(!fs.lstatSync(stateDir).isDirectory()||fs.lstatSync(stateDir).isSymbolicLink()))throw Error("UNSAFE_STATE_DIR");
 fs.mkdirSync(stateDir,{recursive:true,mode:0o700});
 const lock=path.join(stateDir,"mo025.lock");
 let fd;
 try{
  fd=fs.openSync(lock,"wx",0o600);
  const registry=readJson(registryFile||path.join(__dirname,"assembly-registry.json"));
  const coreMap=readJson(coreFile),webSnapshot=readJson(webFile);
  const result=pulse({registry,coreMap,webSnapshot,expectedCoreHead,stateDir});
  const blockers=Array.isArray(result.priority)?result.priority:[];
  const report={schema:"ARKI-MO025-ADVISORY-1",inputFingerprint:sha({registry,coreMap,webSnapshot,expectedCoreHead}),heartbeat:result.heartbeat,restartReplay:result.restartReplay,recordStatus:result.recordStatus,historyLength:result.historyLength,historyHead:result.historyHead,proposals:blockers.map(x=>({id:x.id,phase:x.phase,action:x.proposedAction,status:"REVIEW_REQUIRED",authorized:false})),policy:{canonicalMutation:false,knowledgePromotion:false,agkExecuted:false,poApproval:"NOT_GRANTED",serviceInstalled:false},evidence:"ADVISORY_ONLY_NOT_ARCHITECTURAL_COMPETENCE"};
  return report;
 }finally{
  if(fd!==undefined){fs.closeSync(fd);fs.unlinkSync(lock)}
 }
}
module.exports={run};
if(require.main===module){
 try{
  if(process.argv.length!==6)throw Error("USAGE: node arki-mo025-cycle.cjs CORE_JSON WEB_JSON EXPECTED_CORE_SHA ABSOLUTE_STATE_DIR");
  const [coreFile,webFile,expectedCoreHead,stateDir]=process.argv.slice(2);
  process.stdout.write(JSON.stringify(run({coreFile,webFile,expectedCoreHead,stateDir}),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_MO025_FAIL: "+e.message+"\n");process.exitCode=1}
}
