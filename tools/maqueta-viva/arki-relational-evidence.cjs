"use strict";
/** Verify relational evidence against immutable Git blobs, not user-provided claims.
 * Git reads only. No auto-promotion or inferred prerequisites.
 */
const {spawnSync}=require("node:child_process");
const path=require("node:path");
const ROOT=path.resolve(__dirname,"../..");
const SHA=/^[0-9a-f]{40}$/;
const SAFE_PATH=/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/;
function verifySource(source,{root=ROOT,readBlob}={}){
 if(!source||!SHA.test(source.sha||"")||!SAFE_PATH.test(source.path||"")||source.path.split("/").includes("..")||typeof source.quote!=="string"||!source.quote.trim()||source.quote.length>4000)return {verified:false,reason:"INVALID_SOURCE_REFERENCE"};
 try{
  let content;
  if(readBlob){content=readBlob(source.sha,source.path)}
  else{
   const p=spawnSync("git",["show",source.sha+":"+source.path],{cwd:root,encoding:"utf8",timeout:10000,maxBuffer:2*1024*1024});
   if(p.error||p.status!==0)return {verified:false,reason:"SOURCE_NOT_AVAILABLE"};
   content=p.stdout;
  }
  if(typeof content!=="string"||!content.includes(source.quote))return {verified:false,reason:"QUOTE_NOT_FOUND"};
  return {verified:true,reason:"EXACT_QUOTE_FOUND_IN_GIT_BLOB",sourceCommit:source.sha,path:source.path};
 }catch{return {verified:false,reason:"SOURCE_READ_FAILED"}}
}
function verifyRelationCandidates(result,options={}){
 if(!result||result.schema!=="ARKI-RELATIONAL-LEARNING-1"||!Array.isArray(result.candidates))throw Error("INVALID_RELATIONAL_RESULT");
 const candidates=result.candidates.map(c=>{
  const verification=verifySource(c.source,options);
  return {...c,sourceVerification:verification,evidenceStatus:verification.verified?"QUOTE_VERIFIED_RELATION_UNREVIEWED":"SOURCE_UNVERIFIED",decision:"PROPOSED_FOR_REVIEW",canonicalMutation:false};
 });
 return {schema:"ARKI-RELATIONAL-EVIDENCE-1",candidates,verifiedSources:candidates.filter(c=>c.sourceVerification.verified).length,total:candidates.length,relationSemantics:"NOT_VERIFIED",promotion:"BLOCKED",canonicalMutation:false};
}
module.exports={verifySource,verifyRelationCandidates};
