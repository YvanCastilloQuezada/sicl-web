"use strict";
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const files=["PROJECT_STATE.json","CURRENT_PHASE.json","CRITICAL_PATH.json","EVIDENCE_INDEX.json","NEXT_ACTION.md","HANDOFF_LATEST.md"];
function assess(directory,maxAgeMinutes=90){
 if(!path.isAbsolute(directory))throw Error("ABSOLUTE_PATH_REQUIRED");
 const root=fs.lstatSync(directory);
 if(!root.isDirectory()||root.isSymbolicLink())throw Error("UNSAFE_DIRECTORY");
 const manifestStat=fs.lstatSync(path.join(directory,"MANIFEST.json"));
 if(!manifestStat.isFile()||manifestStat.isSymbolicLink()||manifestStat.size>2000000)throw Error("UNSAFE_MANIFEST");
 const manifest=JSON.parse(fs.readFileSync(path.join(directory,"MANIFEST.json"),"utf8"));
 if(manifest.schema!=="ARKI_MANIFEST_V1"||!manifest.files||Object.keys(manifest.files).length!==6||files.some(n=>typeof manifest.files[n]!=="string"))throw Error("INVALID_MANIFEST");
 const sources={};
 let expired=false;
 for(const name of files){
  const file=path.join(directory,name),stat=fs.lstatSync(file);
  if(!stat.isFile()||stat.isSymbolicLink()||stat.size>2000000)throw Error("UNSAFE_FILE");
  const bytes=fs.readFileSync(file);
  if(name.endsWith(".json"))JSON.parse(bytes.toString("utf8"));
  if(crypto.createHash("sha256").update(bytes).digest("hex")!==manifest.files[name])throw Error("MANIFEST_HASH_MISMATCH");
  const ageMinutes=(Date.now()-stat.mtimeMs)/60000;
  if(ageMinutes<0||ageMinutes>maxAgeMinutes)expired=true;
  sources[name]={sha256:crypto.createHash("sha256").update(bytes).digest("hex"),ageMinutes:Math.round(ageMinutes)};
 }
 const state=JSON.parse(fs.readFileSync(path.join(directory,files[0]),"utf8"));
 if(state.schema!=="ARKI_ACE_V1"||state.machine!=="ARKI-02")throw Error("INVALID_ACE_SCHEMA");
 return {schema:"ARKI-MO027-ACE-ASSESSMENT-1",status:expired?"STALE":"OBSERVED",manifestIntegrity:"VERIFIED_6_OF_6",sources,repositories:state.repositories,remoteFreshness:state.remote_freshness,productFrozenState:state.product_frozen_state,coreMapCompatibility:"NOT_DEMONSTRATED",webMapCompatibility:"NOT_DEMONSTRATED",mayFeedMo025:false,canonicalMutation:false};
}
module.exports={assess};
if(require.main===module){
 try{process.stdout.write(JSON.stringify(assess(process.argv[2]),null,2)+"\n")}
 catch(e){process.stderr.write("MO027_FAIL="+e.message+"\n");process.exitCode=1}
}
