"use strict";
/** MO-07.6: inspect three checked-out repositories and draft missing contracts without inventing implementation. */
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const {discover}=require("./arki-mo075-symbol-discovery.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function git(root,args){return cp.execFileSync("git",["-C",root,...args],{encoding:"utf8",timeout:20000,maxBuffer:20*1024*1024}).trim()}
function identity(root){try{return {status:"AVAILABLE",sha:git(root,["rev-parse","HEAD"]),branch:git(root,["branch","--show-current"])||"DETACHED",remote:git(root,["remote","get-url","origin"])}}catch{return {status:"NOT_AVAILABLE",sha:null,branch:null,remote:null}}}
function contract(piece){
 const candidates=piece.functionalCandidates||[];
 const source=candidates.filter(x=>x.kind==="SOURCE");
 const tests=candidates.filter(x=>x.kind==="TEST");
 return {id:piece.id,title:piece.name,missions:piece.missions,
  contractStatus:"PROPOSED_NOT_APPROVED",
  rationale:"Missing approved machine-verifiable contract for this inventory entry has not been established; draft generated for PO review.",
  inputs:{status:"UNKNOWN",definition:null},outputs:{status:"UNKNOWN",definition:null},
  invariants:[{rule:"No canonical mutation without PO authorization",status:"REQUIRED"}],
  dependencies:{status:"UNKNOWN_NOT_INFERRED",ids:[]},
  acceptanceCriteria:[{criterion:"Specify observable inputs, outputs and error behavior",status:"TODO"},
   {criterion:"Link code evidence and independently executed tests",status:"TODO"},
   {criterion:"PO approves contract and mission alignment",status:"TODO"}],
  evidence:{sourceCandidates:source.slice(0,5).map(x=>({repo:x.repository,path:x.path,matchedTerms:x.matchedTerms})),
   testCandidates:tests.slice(0,5).map(x=>({repo:x.repository,path:x.path,matchedTerms:x.matchedTerms}))},
  behavior:"NOT_VERIFIED",promotion:"BLOCKED_PO_APPROVAL"};
}
function audit(registry,roots){
 const repositories=Object.fromEntries(["web","core","acs"].map(k=>[k,identity(roots[k])]));
 const missing=Object.entries(repositories).filter(([,v])=>v.status!=="AVAILABLE").map(([k])=>k);
 if(missing.length)throw Error("REPOSITORIES_NOT_AVAILABLE:"+missing.join(","));
 const discovered=discover(registry,roots);
 const contracts=discovered.pieces.map(contract);
 const result={schema:"ARKI-MO076-TRIREPO-CONTRACT-DRAFT-1",repositories,
  sourceReceipt:discovered.receiptSha256,summary:{repositories:3,pieces:contracts.length,draftContracts:contracts.length,
   approvedContracts:0,verifiedBehaviors:0},
  contracts,policy:{readOnly:true,doesNotOverwriteExistingContracts:true,noCanonicalWrites:true,poApprovalRequired:true}};
 result.receiptSha256=hash(result);return result;
}
module.exports={audit,contract,identity};
if(require.main===module){
 const root=path.resolve(__dirname,"../.."),registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(audit(registry,{web:root,core:process.argv[2],acs:process.argv[3]}),null,2)+"\n");
}
