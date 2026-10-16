"use strict";
/** One read-only composition of existing Mapa Vivo, Árbol Vivo and ADN-MC.
 * Twin alternatives are not fabricated: absent real evidence, all remain pending.
 */
const crypto=require("node:crypto");
const {build}=require("./arki-arbol-vivo-auto.cjs");
const {inspectMap}=require("./arki-map-adn-bridge.cjs");
const {proposeRelations}=require("./arki-relational-learning.cjs");
const {verifyRelationCandidates}=require("./arki-relational-evidence.cjs");
const {evaluateThree}=require("./arki-twin-three-alternatives.cjs");
const SHA=/^[0-9a-f]{40}$/;
function composeLiveSystems({registry,map,sourceCommit,statements=[],alternativesByIdea={},baselineByIdea={},evidenceOptions={}}={}){
 if(!SHA.test(sourceCommit||""))throw Error("INVALID_SOURCE_COMMIT");
 const tree=build(registry);
 const master=inspectMap(map,sourceCommit);
 const relations=verifyRelationCandidates(proposeRelations(registry,statements),evidenceOptions);
 const ids=new Set([...registry.ideas,...registry.components].map(x=>x.id));
 for(const id of [...Object.keys(alternativesByIdea),...Object.keys(baselineByIdea)])if(!ids.has(id))throw Error("UNKNOWN_IDEA");
 const decisions=[];
 for(const id of [...ids].sort()){
  const options=alternativesByIdea[id],baseline=baselineByIdea[id];
  if(!options&&!baseline)continue;
  if(!options||!baseline)throw Error("INCOMPLETE_TWIN_INPUT");
  const node=tree.order.find(x=>x.id===id);
  const gate=node?.prerequisiteStatus==="DECLARED_NOT_COMPETENCE_VERIFIED"?"UNVERIFIED":"BLOCKED";
  const evaluation=evaluateThree({ideaId:id,sourceCommit,baseline,alternatives:options,dependencyGate:gate});
  decisions.push(evaluation);
 }
 const result={schema:"ARKI-LIVE-SYSTEMS-SNAPSHOT-1",sourceCommit,map:{digest:master.mapDigest,findings:master.findings,observation:master.observation,adnProposals:master.proposal.proposals,authority:"MAP_CLAIMS_NOT_INDEPENDENTLY_VERIFIED"},tree:{receiptSha256:tree.receiptSha256,counts:tree.counts,branches:tree.branches,order:tree.order,issues:tree.issues,dependencyCoverage:tree.dependencyCoverage},relations:{verifiedSources:relations.verifiedSources,candidates:relations.candidates},twin:{decisions,simulation:"NOT_EXECUTED_BY_COMPOSER",evidence:"REQUIRES_INDEPENDENT_VALIDATION"},owner:{decision:"PENDING",authorization:"SPECIFIC_APPROVAL_REQUIRED"},canonicalMutation:false,execution:"READ_ONLY"};
 result.receiptSha256=crypto.createHash("sha256").update(JSON.stringify(result)).digest("hex");
 return result;
}
module.exports={composeLiveSystems};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path"),{execFileSync}=require("node:child_process");
 try{
  const root=path.resolve(__dirname,"../..");
  const sha=process.argv[2] || process.env.ARKI_SOURCE_COMMIT || execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8",timeout:10000}).trim();
  if(!SHA.test(sha))throw Error("INVALID_SOURCE_COMMIT");
  const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
  const map=JSON.parse(fs.readFileSync(path.join(root,"docs/arki-master-map/ARKI_MASTER_MAP_STATE.json"),"utf8"));
  process.stdout.write(JSON.stringify(composeLiveSystems({registry,map,sourceCommit:sha}),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_LIVE_SYSTEMS_FAIL: "+e.message+"\n");process.exitCode=1}
}
