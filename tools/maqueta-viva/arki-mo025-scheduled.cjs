"use strict";
/** MO25-06 timer entrypoint. Fails closed on stale/unbound sources; no canonical writes. */
const fs=require("node:fs"),path=require("node:path");
const {run}=require("./arki-mo025-cycle.cjs");
function safeFile(p,maxAgeMs,now){
 if(typeof p!=="string"||!path.isAbsolute(p))throw Error("ABSOLUTE_SOURCE_REQUIRED");
 const s=fs.lstatSync(p);
 if(!s.isFile()||s.isSymbolicLink()||s.size>2_000_000)throw Error("UNSAFE_SOURCE");
 if(s.mtimeMs>now+60_000||now-s.mtimeMs>maxAgeMs)throw Error("STALE_SOURCE");
}
function scheduled(config,{now=Date.now()}={}){
 if(!config||config.schema!=="ARKI-MO025-SCHEDULE-1")throw Error("INVALID_SCHEDULE_SCHEMA");
 const {coreFile,webFile,expectedCoreHead,expectedWebHead,stateDir,maxSourceAgeMinutes}=config;
 if(!Number.isInteger(maxSourceAgeMinutes)||maxSourceAgeMinutes<1||maxSourceAgeMinutes>1440)throw Error("INVALID_SOURCE_TTL");
 const ttl=maxSourceAgeMinutes*60_000;
 safeFile(coreFile,ttl,now);safeFile(webFile,ttl,now);
 const core=JSON.parse(fs.readFileSync(coreFile,"utf8"));
 const web=JSON.parse(fs.readFileSync(webFile,"utf8"));
 if(core.head!==expectedCoreHead)throw Error("CORE_HEAD_MISMATCH");
 if(!/^[0-9a-f]{40}$/.test(expectedWebHead))throw Error("INVALID_EXPECTED_WEB_HEAD");
 if(web.sourceCommit!==expectedWebHead)throw Error("WEB_HEAD_MISMATCH");
 return run({coreFile,webFile,expectedCoreHead,stateDir});
}
module.exports={scheduled};
if(require.main===module){
 try{
  if(process.argv.length!==3)throw Error("USAGE: node arki-mo025-scheduled.cjs ABSOLUTE_CONFIG_JSON");
  const file=process.argv[2];
  if(!path.isAbsolute(file))throw Error("ABSOLUTE_CONFIG_REQUIRED");
  const s=fs.lstatSync(file);
  if(!s.isFile()||s.isSymbolicLink()||s.size>65536)throw Error("UNSAFE_CONFIG");
  process.stdout.write(JSON.stringify(scheduled(JSON.parse(fs.readFileSync(file,"utf8"))),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_MO025_SCHEDULED_FAIL: "+e.message+"\n");process.exitCode=1}
}
