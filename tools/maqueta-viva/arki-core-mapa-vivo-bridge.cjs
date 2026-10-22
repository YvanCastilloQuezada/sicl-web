"use strict";
/** Read-only reconciliation of Core Mapa Vivo V1 with Web master-map claims.
 * Core source presence is never treated as phase competence or PO approval.
 */
const crypto=require("node:crypto");
const SHA40=/^[a-f0-9]{40}$/;
const SHA64=/^[a-f0-9]{64}$/;
const PHASE=/^F(?:10|[1-9])$/;
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function reconcileCoreMapaVivo(core,webSnapshot,{expectedCoreHead,expectedWebHead}={}){
 if(!core||core.schema!=="arki.mapa_vivo.v1"||!SHA40.test(core.head||""))throw Error("INVALID_CORE_MAP");
 if(expectedCoreHead&&core.head!==expectedCoreHead)throw Error("CORE_HEAD_MISMATCH");
 if(core.canonical_mutations!==0||core.validation_scope!=="source-presence-only")throw Error("CORE_SCOPE_MISMATCH");
 if(!Array.isArray(core.nodes)||!Array.isArray(core.edges)||!Array.isArray(core.findings)||!Array.isArray(core.limitations))throw Error("INVALID_CORE_STRUCTURE");
 if(!webSnapshot||webSnapshot.schema!=="ARKI-LIVE-SYSTEMS-SNAPSHOT-1"||!SHA40.test(webSnapshot.sourceCommit||"")||webSnapshot.canonicalMutation!==false||webSnapshot.execution!=="READ_ONLY")throw Error("INVALID_WEB_SNAPSHOT");
 if(expectedWebHead&&webSnapshot.sourceCommit!==expectedWebHead)throw Error("WEB_HEAD_MISMATCH");
 const ids=new Set(),phases=new Set(),issues=[];
 for(const node of core.nodes){
  if(!node||typeof node.id!=="string"||!node.id||ids.has(node.id)||!Array.isArray(node.dependencies)||!Array.isArray(node.evidence)||typeof node.status!=="string"||node.approval!=="NOT_ASSESSED")throw Error("INVALID_CORE_NODE");
  ids.add(node.id);
  if(node.kind==="phase"){
   if(!PHASE.test(node.id)||node.status!=="UNKNOWN"||node.evidence.length!==0)throw Error("UNVERIFIED_PHASE_CLAIM");
   phases.add(node.id);
  }else if(node.kind==="evidence"){
   if(!["SOURCE_PRESENT_NOT_VALIDATED","MISSING"].includes(node.status))throw Error("INVALID_EVIDENCE_STATUS");
   for(const e of node.evidence)if(!e||typeof e.path!=="string"||e.path.startsWith("/")||e.path.split("/").includes("..")||!SHA64.test(e.sha256||""))throw Error("INVALID_EVIDENCE_REFERENCE");
  }else throw Error("INVALID_CORE_KIND");
 }
 if(phases.size!==10)throw Error("INCOMPLETE_CORE_PHASES");
 const edges=new Set();
 for(const n of core.nodes)for(const d of n.dependencies){
  if(!ids.has(d))issues.push({code:"UNKNOWN_DEPENDENCY",from:d,to:n.id});
  if(d===n.id)issues.push({code:"SELF_DEPENDENCY",id:n.id});
  edges.add(d+"\u0000"+n.id);
 }
 for(const e of core.edges){
  if(!e||e.kind!=="prerequisite"||!edges.has(e.from+"\u0000"+e.to))throw Error("EDGE_NOT_DECLARED");
 }
 if(core.edges.length!==edges.size)throw Error("EDGE_SET_MISMATCH");
 const visited=new Set(),active=new Set(),byId=new Map(core.nodes.map(n=>[n.id,n]));
 function walk(id){
  if(active.has(id)){issues.push({code:"DEPENDENCY_CYCLE",id});return;}
  if(visited.has(id))return;
  active.add(id);
  for(const d of byId.get(id).dependencies)if(byId.has(d))walk(d);
  active.delete(id);visited.add(id);
 }
 for(const id of ids)walk(id);
 for(const f of core.findings)issues.push({code:"CORE_REPORTED_FINDING",detail:f});
 const webPhases=webSnapshot.map?.findings;
 if(!Array.isArray(webPhases)||webPhases.length!==10)throw Error("INVALID_WEB_PHASES");
 const webIds=new Set();
 for(const p of webPhases){
  if(!p||!PHASE.test(p.phase||"")||webIds.has(p.phase))throw Error("INVALID_WEB_PHASE");
  webIds.add(p.phase);
  if(p.classification==="FROZEN_PROTECTED")issues.push({code:"WEB_FROZEN_CLAIM_NOT_VERIFIED_BY_CORE",phase:p.phase});
 }
 const result={schema:"ARKI-CORE-WEB-MAP-RECONCILIATION-1",coreHead:core.head,webHead:webSnapshot.sourceCommit,coreDigest:hash(core),webReceiptSha256:webSnapshot.receiptSha256||null,phases:10,nodes:ids.size,issues,coreAuthority:"SOURCE_PRESENCE_ONLY",webAuthority:"MAP_CLAIMS_ONLY",competence:"NOT_VERIFIED",approval:"NOT_ASSESSED",agkSimulation:"NOT_EXECUTED",canonicalMutation:false,execution:"READ_ONLY",promotion:"BLOCKED"};
 result.receiptSha256=hash(result);
 return result;
}
module.exports={reconcileCoreMapaVivo};
if(require.main===module){
 try{
  const fs=require("node:fs"),path=require("node:path");
  const [coreFile,webFile,expected]=process.argv.slice(2);
  if(!coreFile||!webFile||process.argv.length>5)throw Error("USAGE: node arki-core-mapa-vivo-bridge.cjs CORE_JSON WEB_SNAPSHOT_JSON [EXPECTED_CORE_SHA]");
  function read(file){const s=fs.lstatSync(file);if(!s.isFile()||s.isSymbolicLink()||s.size>2000000)throw Error("UNSAFE_INPUT_FILE");return JSON.parse(fs.readFileSync(file,"utf8"));}
  process.stdout.write(JSON.stringify(reconcileCoreMapaVivo(read(coreFile),read(webFile),{expectedCoreHead:expected}),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_CORE_MAP_BRIDGE_FAIL: "+e.message+"\n");process.exitCode=1;}
}
