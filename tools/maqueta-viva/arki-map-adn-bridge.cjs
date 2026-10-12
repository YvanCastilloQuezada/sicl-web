"use strict";
// Read-only bridge: Master Map -> experimental ADN observer input.
// Map claims are not independently verified measurements.
const fs=require("node:fs"),crypto=require("node:crypto");
const {propose}=require("./arki-adn-mejora-continua.cjs");
const hash=x=>crypto.createHash("sha256").update(x).digest("hex");
const PHASE=/^F(?:10|[1-9])$/;
function inspectMap(map,sourceCommit){
 if(!map||map.schema!=="ARKI-MASTER-MAP-STATE-0.1")throw Error("INVALID_MASTER_MAP");
 if(typeof sourceCommit!=="string"||!/^[a-f0-9]{40}$/.test(sourceCommit))throw Error("INVALID_SOURCE_COMMIT");
 const phases=map.roadmap?.phases;
 if(!Array.isArray(phases)||phases.length!==10)throw Error("INVALID_PHASES");
 const seen=new Set(),findings=[];
 for(const p of phases){
  if(!p||typeof p.id!=="string"||!PHASE.test(p.id)||seen.has(p.id)||typeof p.status!=="string"||!p.status.trim()||typeof p.evidence_status!=="string"||!p.evidence_status.trim())throw Error("INVALID_PHASE_ENTRY");
  seen.add(p.id);
  const frozen=p.status==="FROZEN";
  const unresolved=p.status==="RECONCILIATION_REQUIRED"||p.evidence_status==="NOT_YET_RECONCILED";
  const pending=p.status==="IN_PROGRESS";
  findings.push({phase:p.id,status:p.status,evidenceStatus:p.evidence_status,classification:unresolved?"RECONCILIATION_REQUIRED":pending?"IMPLEMENTATION_REVIEW_REQUIRED":frozen?"FROZEN_PROTECTED":"REVIEW_REQUIRED",action:frozen?"NO_AUTOMATIC_CHANGE":unresolved?"RECONCILE_EVIDENCE":pending?"INSPECT_TEST_AND_INTEGRATION":"INDEPENDENT_REVIEW",authority:"MAP_CLAIM_ONLY"});
 }
 const canonical=JSON.stringify({schema:map.schema,roadmap:map.roadmap,sourceCommit});
 const observation={schema:"ARKI-ADN-OBSERVATION-1",observationId:"MAP-"+hash(canonical).slice(0,24),sourceCommit,metrics:[{id:"phase-reconciliation-count",value:findings.filter(x=>x.classification==="RECONCILIATION_REQUIRED").length,target:0,direction:"MINIMIZE",unit:"phases",verified:false},{id:"phase-review-count",value:findings.filter(x=>x.classification==="IMPLEMENTATION_REVIEW_REQUIRED").length,target:0,direction:"MINIMIZE",unit:"phases",verified:false}]};
 const proposal=propose(observation);
 return {schema:"ARKI-MAP-ADN-BRIDGE-1",sourceCommit,mapDigest:hash(canonical),findings,observation,proposal,execution:"NOT_EXECUTED",learning:"NOT_VERIFIED",requiresIndependentEvidence:true,canonicalMutation:false,canonicalPromotion:"BLOCKED"};
}
if(require.main===module){
 try{
  const [file,commit]=process.argv.slice(2);
  if(!file||!commit||process.argv.length!==4)throw Error("USAGE: node arki-map-adn-bridge.cjs MAP_JSON SOURCE_COMMIT");
  const stat=fs.lstatSync(file);
  if(!stat.isFile()||stat.isSymbolicLink()||stat.size>2000000)throw Error("UNSAFE_MAP_FILE");
  process.stdout.write(JSON.stringify(inspectMap(JSON.parse(fs.readFileSync(file,"utf8")),commit),null,2)+"\n");
 }catch(e){console.error("ARKI_MAP_ADN_BRIDGE_FAIL: "+e.message);process.exitCode=1}
}
module.exports={inspectMap};
