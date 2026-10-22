"use strict";
/** ARKI Live Cycle v1: one real, guarded Core/Web -> proposals -> sandbox -> journal cycle. */
const fs=require("node:fs"),path=require("node:path"),os=require("node:os"),cp=require("node:child_process"),crypto=require("node:crypto");
const {review}=require("./arki-mo031-review.cjs");
const {bind,repairExperiment}=require("./arki-mo031-evidence.cjs");
const {rehearseFile}=require("./arki-mo031-file-rehearsal.cjs");
const {diagnose}=require("./arki-av002-precedence.cjs");
const {reconcile}=require("./arki-av003-reconcile.cjs");
const {inspect}=require("./arki-av004-evidence.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function command(bin,args,cwd){const r=cp.spawnSync(bin,args,{cwd,encoding:"utf8",timeout:120000,maxBuffer:8e6});if(r.error||r.status!==0)throw Error("COMMAND_FAILED "+bin+" "+args[0]+": "+(r.stderr||r.error?.message||r.status));return r.stdout.trim()}
function safeJson(p){const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>3e6)throw Error("UNSAFE_JSON");return JSON.parse(fs.readFileSync(p,"utf8"))}
function run({coreDir,webDir,stateDir}){
 for(const dir of [coreDir,webDir]){if(!fs.statSync(dir).isDirectory())throw Error("INVALID_REPOSITORY")}
 fs.mkdirSync(stateDir,{recursive:true,mode:0o700});
 const coreHead=command("git",["rev-parse","HEAD"],coreDir),webHead=command("git",["rev-parse","HEAD"],webDir);
 if(!/^[a-f0-9]{40}$/.test(coreHead)||!/^[a-f0-9]{40}$/.test(webHead))throw Error("INVALID_HEAD");
 const lock=path.join(stateDir,"live-cycle.lock"),fd=fs.openSync(lock,"wx",0o600);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),"arki-live-"));
 try{
  const coreFile=path.join(temp,"core.json"),webFile=path.join(temp,"web.json");
  command("python3",[path.join(coreDir,"tools/arki_mapa_vivo.py"),"--root",coreDir,"--output",coreFile],coreDir);
  const webOutput=command("node",[path.join(webDir,"tools/maqueta-viva/arki-live-systems-coordinator.cjs")],webDir);
  fs.writeFileSync(webFile,webOutput);
  const core=safeJson(coreFile),web=safeJson(webFile);
  if(core.schema!=="arki.mapa_vivo.v1"||core.head!==coreHead||core.canonical_mutations!==0)throw Error("CORE_PROVENANCE_FAIL");
  if(web.schema!=="ARKI-LIVE-SYSTEMS-SNAPSHOT-1"||web.sourceCommit!==webHead||web.canonicalMutation!==false||web.execution!=="READ_ONLY")throw Error("WEB_PROVENANCE_FAIL");
  const pulseFile=path.join(temp,"pulse.json");
  const pulse=JSON.parse(command("node",[path.join(webDir,"tools/maqueta-viva/arki-mo025-cycle.cjs"),coreFile,webFile,coreHead,path.join(stateDir,"mo025")],webDir));
  fs.writeFileSync(pulseFile,JSON.stringify(pulse));
  const proposalReview=review(pulse,core,web,{expectedCoreHead:coreHead,expectedWebHead:webHead});
  const registryFile=path.join(webDir,"tools/maqueta-viva/assembly-registry.json");
  const registry=safeJson(registryFile),evidence=bind(proposalReview,registry);
  const repair=repairExperiment(registry);
  const precedence=diagnose(registry);
  const sourceReconciliation=reconcile(registry,webDir);
  const evidenceInventory=inspect(webDir,sourceReconciliation);
  const sandbox=rehearseFile(evidence,registryFile);
  if(!sandbox.rollbackVerified||!sandbox.sourceUnchanged)throw Error("SANDBOX_ROLLBACK_FAIL");
  // Journal is external operational state; no canonical write and no automatic approval.
  const result={schema:"ARKI-LIVE-CYCLE-1",coreHead,webHead,heartbeat:pulse.heartbeat,proposals:evidence.items.map(x=>({id:x.id,status:x.status,dependencyAssessment:x.dependencyAssessment})),repairExperiment:repair,precedenceDiagnosis:precedence,sourceReconciliation,evidenceInventory,sandbox:{temporaryCorrectionCount:sandbox.temporaryCorrectionCount,rollbackVerified:sandbox.rollbackVerified},capabilities:{architecturalDesign:"NOT_DEMONSTRATED",agk:"NOT_EXECUTED",delta62:"NOT_EXECUTED"},policy:{canonicalMutation:false,poApproval:"PENDING",sourceWrites:0}};
  result.receiptSha256=sha(result);
  const journalDir=path.join(stateDir,"events");fs.mkdirSync(journalDir,{recursive:true});
  const target=path.join(journalDir,result.receiptSha256+".json");
  if(!fs.existsSync(target))fs.writeFileSync(target,JSON.stringify(result,null,2)+"\n",{flag:"wx",mode:0o600});
  const latest=path.join(stateDir,"LATEST.json"),staging=latest+".tmp-"+process.pid;
  fs.writeFileSync(staging,JSON.stringify(result,null,2)+"\n",{mode:0o600});fs.renameSync(staging,latest);
  return result;
 }finally{fs.rmSync(temp,{recursive:true,force:true});fs.closeSync(fd);fs.unlinkSync(lock)}
}
module.exports={run};
if(require.main===module){try{const [coreDir,webDir,stateDir]=process.argv.slice(2);if(process.argv.length!==5)throw Error("USAGE: node arki-live-cycle.cjs CORE_DIR WEB_DIR STATE_DIR");process.stdout.write(JSON.stringify(run({coreDir:path.resolve(coreDir),webDir:path.resolve(webDir),stateDir:path.resolve(stateDir)}),null,2)+"\n")}catch(e){process.stderr.write("ARKI_LIVE_CYCLE_FAIL: "+e.message+"\n");process.exitCode=1}}
