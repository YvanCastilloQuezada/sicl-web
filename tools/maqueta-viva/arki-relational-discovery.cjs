"use strict";
/** Bounded autonomous discovery of explicit ARKI_RELATION declarations in tracked docs.
 * Format: ARKI_RELATION: A REQUIRES B (or INFORMS / FEEDBACK).
 * A and B must be registry IDs. No inference from proximity or file names.
 */
const {spawnSync}=require("node:child_process");
const path=require("node:path");
const {proposeRelations}=require("./arki-relational-learning.cjs");
const {verifyRelationCandidates}=require("./arki-relational-evidence.cjs");
const ROOT=path.resolve(__dirname,"../..");
function git(args,root){const p=spawnSync("git",args,{cwd:root,encoding:"utf8",timeout:20000,maxBuffer:4*1024*1024});if(p.error||p.status!==0)throw Error("GIT_READ_FAILED");return p.stdout}
function discover(registry,{root=ROOT,files,maxFiles=500,maxBytes=1048576}={}){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components))throw Error("INVALID_REGISTRY");
 const sha=git(["rev-parse","HEAD"],root).trim();
 if(!/^[0-9a-f]{40}$/.test(sha))throw Error("INVALID_GIT_HEAD");
 const paths=files||git(["ls-files","--","docs","tools/maqueta-viva"],root).split("\n").filter(Boolean).filter(p=>/\.(md|txt)$/.test(p));
 if(!Array.isArray(paths)||paths.length>maxFiles)throw Error("SOURCE_LIMIT_EXCEEDED");
 const statements=[],issues=[];
 for(const file of paths){
  if(typeof file!=="string"||!/^([A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\.(md|txt)$/.test(file)||file.includes("..")){issues.push({code:"UNSAFE_PATH"});continue}
  let content;
  try{content=git(["show",sha+":"+file],root)}catch{issues.push({code:"UNREADABLE_SOURCE",path:file});continue}
  if(Buffer.byteLength(content)>maxBytes){issues.push({code:"OVERSIZED_SOURCE",path:file});continue}
  for(const line of content.split("\n")){
   const m=line.match(/^\s*ARKI_RELATION:\s*([A-Za-z0-9_.:-]+)\s+(REQUIRES|INFORMS|FEEDBACK)\s+([A-Za-z0-9_.:-]+)\s*$/);
   if(m)statements.push({before:m[1],relation:m[2],after:m[3],source:{sha,path:file,quote:line.trim()}});
  }
 }
 const proposed=proposeRelations(registry,statements);
 const verified=verifyRelationCandidates(proposed,{root});
 return {schema:"ARKI-RELATION-DISCOVERY-1",sourceCommit:sha,scannedFiles:paths.length,statements:statements.length,issues:[...issues,...proposed.issues],candidates:verified.candidates,verifiedSources:verified.verifiedSources,learning:"EXPLICIT_DECLARATIONS_ONLY",promotion:"BLOCKED",canonicalMutation:false};
}
module.exports={discover};
if(require.main===module){
 const fs=require("node:fs");
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(discover(registry),null,2)+"\n");
}
