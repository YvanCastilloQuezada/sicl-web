"use strict";
/** AV-003: reconcile historical origin references against tracked Web files.
 * File presence is NOT competence, implementation or source validation.
 */
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function reconcile(registry,webDir,selected=["I-01","I-02","I-03","I-08","I-12"]){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components)||!Array.isArray(selected)||selected.length>100||selected.some(x=>typeof x!=="string"))throw Error("INVALID_INPUT");
 const root=fs.realpathSync(webDir);
 const run=cp.spawnSync("git",["ls-files","-z","--cached"],{cwd:root,encoding:"utf8",timeout:15000,maxBuffer:8e6});
 if(run.error||run.status!==0)throw Error("GIT_INVENTORY_UNAVAILABLE");
 const tracked=new Set(run.stdout.split("\0").filter(Boolean));
 const index=new Map();
 for(const x of [...registry.ideas,...registry.components]){if(!x||typeof x.id!=="string"||index.has(x.id))throw Error("INVALID_REGISTRY_ID");index.set(x.id,x)}
 const items=selected.map(id=>{
  const n=index.get(id);
  if(!n)return {id,status:"UNKNOWN_ID",originStatus:"UNKNOWN",evidence:[]};
  const origin=n.origin;
  let originStatus="UNDECLARED";
  if(typeof origin==="string"){
   if(!origin||path.isAbsolute(origin)||origin.split("/").includes("..")||origin.includes("\\")||origin.includes("\0"))originStatus="UNSAFE_REFERENCE";
   else if(!tracked.has(origin))originStatus="NOT_TRACKED_IN_WEB";
   else{
    const p=path.resolve(root,origin);
    if(!p.startsWith(root+path.sep))originStatus="UNSAFE_REFERENCE";
    else{
     try{const st=fs.lstatSync(p);originStatus=st.isFile()&&!st.isSymbolicLink()?"TRACKED_FILE_PRESENT":"TRACKED_FILE_UNAVAILABLE";}
     catch{originStatus="TRACKED_FILE_UNAVAILABLE"}
    }
   }
  }
  return {id,phase:n.targetPhase||null,origin:typeof origin==="string"?origin:null,originStatus,sourceStatus:n.sourceStatus||null,declaredVerification:n.verification||null,status:"REQUIRES_RECONCILIATION",evidence:[],competenceVerified:false,dependenciesVerified:false};
 });
 const result={schema:"ARKI-AV003-SOURCE-RECONCILIATION-1",registryDigest:sha(registry),items,policy:{f6:"UNLOCKED_BY_PO",sourcePresenceIsNotCompetence:true,canonicalMutation:false,sourceWrites:0,poApproval:"PENDING"}};
 result.receiptSha256=sha(result);return result;
}
module.exports={reconcile};
