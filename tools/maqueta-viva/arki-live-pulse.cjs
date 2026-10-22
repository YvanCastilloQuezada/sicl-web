"use strict";
const fs=require("node:fs"),path=require("node:path");
const {execute}=require("./arki-integrated-diagnosis.cjs");
const {inspect}=require("./arki-mo04-guarded.cjs");
function input(file){const s=fs.lstatSync(file);if(!s.isFile()||s.isSymbolicLink()||s.size>2000000)throw Error("UNSAFE_INPUT");return JSON.parse(fs.readFileSync(file,"utf8"))}
function pulse({registry,coreMap,webSnapshot,expectedCoreHead,stateDir}){
 if(!path.isAbsolute(stateDir))throw Error("ABSOLUTE_STATE_DIRECTORY_REQUIRED");
 for(const name of ["events","anchors"]){const dir=path.join(stateDir,name);fs.mkdirSync(dir,{recursive:true,mode:0o700});if(fs.lstatSync(dir).isSymbolicLink())throw Error("UNSAFE_STATE_DIRECTORY")}
 const journal=path.join(stateDir,"events","diagnoses.json"),anchor=path.join(stateDir,"anchors","head.json");
 const result=execute({registry,coreMap,webSnapshot,expectedCoreHead,journal,anchor});
 const recovered=inspect(journal,anchor);
 if(recovered.replay.length!==result.historyLength||recovered.replay.head!==result.historyHead)throw Error("REPLAY_MISMATCH");
 return {...result,heartbeat:"ADVISORY_PULSE_COMPLETED",restartReplay:"VERIFIED"};
}
module.exports={pulse};
if(require.main===module){try{
 const [coreFile,webFile,expectedCoreHead,stateDir]=process.argv.slice(2);
 if(!coreFile||!webFile||!expectedCoreHead||!stateDir||process.argv.length!==6)throw Error("USAGE: node arki-live-pulse.cjs CORE_JSON WEB_JSON CORE_SHA STATE_DIR");
 process.stdout.write(JSON.stringify(pulse({registry:input(path.join(__dirname,"assembly-registry.json")),coreMap:input(coreFile),webSnapshot:input(webFile),expectedCoreHead,stateDir}),null,2)+"\n");
}catch(e){process.stderr.write("ARKI_LIVE_PULSE_FAIL: "+e.message+"\n");process.exitCode=1}}
