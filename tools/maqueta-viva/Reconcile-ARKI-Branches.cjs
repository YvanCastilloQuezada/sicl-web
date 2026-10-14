"use strict";
/** Read-only local branch reconciliation report. Never merges or checks out. */
const {spawnSync}=require("node:child_process");
const path=require("node:path");
const root=path.resolve(__dirname,"../..");
function git(args){
 const p=spawnSync("git",args,{cwd:root,encoding:"utf8",timeout:30000,maxBuffer:2*1024*1024});
 if(p.error||p.status!==0)throw Error("GIT_COMMAND_FAILED: "+args[0]+" "+(p.stderr||p.error?.message||""));
 return p.stdout.trim();
}
function reconcile(base,head){
 for(const ref of [base,head])if(typeof ref!=="string"||!/^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/.test(ref)||ref.includes("..")||ref.includes("@{"))throw Error("INVALID_REF");
 const baseSha=git(["rev-parse","--verify",base+"^{commit}"]);
 const headSha=git(["rev-parse","--verify",head+"^{commit}"]);
 const mergeBase=git(["merge-base",baseSha,headSha]);
 const counts=git(["rev-list","--left-right","--count",baseSha+"..."+headSha]).split(/\s+/).map(Number);
 const paths=git(["diff","--name-status","--no-renames",baseSha,headSha]).split("\n").filter(Boolean).map(line=>({status:line[0],path:line.slice(2)}));
 const conflictCandidates=git(["diff","--name-only",mergeBase,baseSha]).split("\n").filter(Boolean).filter(p=>git(["diff","--name-only",mergeBase,headSha]).split("\n").includes(p));
 return {schema:"ARKI-BRANCH-RECONCILIATION-1",base:{ref:base,sha:baseSha},head:{ref:head,sha:headSha},mergeBase,ahead:counts[1],behind:counts[0],changedPaths:paths,potentialConflicts:conflictCandidates,actualMergeConflicts:"NOT_EVALUATED",mutation:false,mergePerformed:false};
}
if(require.main===module){
 try{
  if(process.argv.length!==4)throw Error("USAGE: node Reconcile-ARKI-Branches.cjs BASE_REF HEAD_REF");
  process.stdout.write(JSON.stringify(reconcile(process.argv[2],process.argv[3]),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_RECONCILE_FAIL: "+e.message+"\n");process.exitCode=1}
}
module.exports={reconcile};
