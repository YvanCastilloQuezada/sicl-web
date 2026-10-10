"use strict";
/** ARKI ARBOL Vivo: deterministic autonomous inventory reconciliation and phase ordering.
 * Advisory only. No canonical writes, no FROZEN mutation, no fabricated measurements.
 */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const PHASES=Array.from({length:10},(_,i)=>"F"+(i+1));
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function build(registry,options={}){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components))throw Error("INVALID_REGISTRY");
 const raw=[...registry.ideas.map(x=>({...x,kind:"IDEA"})),...registry.components.map(x=>({...x,kind:"COMPONENT"}))];
 const ids=new Set(),issues=[];
 const items=raw.map(x=>{
  if(typeof x.id!=="string"||!x.id.trim()||ids.has(x.id))throw Error("DUPLICATE_OR_INVALID_ID");
  ids.add(x.id);
  const phase=PHASES.includes(x.targetPhase)?x.targetPhase:null;
  const excluded=!phase&&x.targetPhase==="UNASSIGNED"&&x.sourceStatus==="RESEARCH_ONLY_OUT_OF_SCOPE";
  if(!phase&&!excluded)issues.push({id:x.id,code:"UNRESOLVED_PHASE"});
  if(excluded)issues.push({id:x.id,code:"EXPLICITLY_OUT_OF_SCOPE",reason:"Historical research is outside ARKI architectural F1-F10 scope; no invented phase"});
  const status=String(x.sourceStatus||"UNKNOWN");
  const verification=String(x.verification||"NOT_VERIFIED");
  const evidence=String(x.sourceEvidence||"");
  const verified=Boolean(evidence.trim()) && /^(VERIFIED|CURRENTLY_VERIFIED)$/.test(verification) && /DEMONSTRATED|VERIFIED/.test(status);
  const missing= !verified;
  const legacyDeps=Array.isArray(x.dependencies)?x.dependencies.filter(d=>typeof d==="string"):[];
  const edges=Array.isArray(x.dependencyEdges)?x.dependencyEdges:[];
  const verifiedEdges=edges.filter(e=>e&&e.type==="REQUIRES"&&e.status==="VERIFIED"&&typeof e.targetId==="string"&&e.targetId.trim()&&typeof e.evidenceRef==="string"&&e.evidenceRef.trim());
  for(const e of edges){
   if(!e||typeof e!=="object"||typeof e.targetId!=="string"||!e.targetId.trim()||typeof e.type!=="string")issues.push({id:x.id,code:"INVALID_DEPENDENCY_EDGE"});
   else if(e.type==="REQUIRES"&&(!e.evidenceRef||e.status!=="VERIFIED"))issues.push({id:x.id,code:"UNVERIFIED_PRECEDENCE",dependency:e.targetId});
  }
  const deps=[...new Set([...legacyDeps,...verifiedEdges.map(e=>e.targetId)])];
  if(Array.isArray(x.dependencies)&&deps.length!==x.dependencies.length)issues.push({id:x.id,code:"INVALID_DEPENDENCY"});
  if(new Set(legacyDeps).size!==legacyDeps.length)issues.push({id:x.id,code:"DUPLICATE_DEPENDENCY"});
  if(deps.includes(x.id))issues.push({id:x.id,code:"SELF_DEPENDENCY"});
  return {id:x.id,title:String(x.title||x.id),kind:x.kind,phase,phaseBasis:"HISTORICAL_PROPOSAL_NOT_AUTONOMOUSLY_VERIFIED",status,verification,evidence:verified?evidence:null,dependencies:deps,missing,excluded};
 });
 const byId=new Map(items.map(x=>[x.id,x]));
 for(const x of items)for(const d of x.dependencies)if(!byId.has(d))issues.push({id:x.id,code:"UNKNOWN_DEPENDENCY",dependency:d});
 const inDegree=new Map(items.map(x=>[x.id,0])),children=new Map(items.map(x=>[x.id,[]]));
 for(const x of items)for(const d of x.dependencies)if(byId.has(d)){inDegree.set(x.id,inDegree.get(x.id)+1);children.get(d).push(x.id)}
 const downstream=id=>{const seen=new Set(),visit=n=>{for(const child of children.get(n)||[])if(!seen.has(child)){seen.add(child);visit(child)}};visit(id);seen.delete(id);return seen.size};
 const impact=new Map(items.map(x=>[x.id,downstream(x.id)]));
 const ready=items.filter(x=>inDegree.get(x.id)===0),ordered=[];
 const score=x=>impact.get(x.id);
 const missingDependencies=new Set(issues.filter(x=>["UNKNOWN_DEPENDENCY","INVALID_DEPENDENCY","INVALID_DEPENDENCY_EDGE","UNVERIFIED_PRECEDENCE","SELF_DEPENDENCY"].includes(x.code)).map(x=>x.id));
 while(ready.length){
  ready.sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id));
  const x=ready.shift();ordered.push({...x,priorityScore:score(x),downstreamCount:impact.get(x.id),dependenciesResolved:!missingDependencies.has(x.id)&&!x.excluded&&x.dependencies.every(d=>byId.has(d)),priorityBasis:"TRANSITIVE_DEPENDENCY_REACH_ONLY_NOT_CRITICAL_PATH_OR_URGENCY"});
  for(const id of children.get(x.id)){inDegree.set(id,inDegree.get(id)-1);if(inDegree.get(id)===0)ready.push(byId.get(id))}
 }
 if(ordered.length!==items.length)issues.push({code:"DEPENDENCY_CYCLE",ids:items.filter(x=>inDegree.get(x.id)>0).map(x=>x.id)});
 const branches=PHASES.map(phase=>({phase,activities:ordered.filter(x=>x.phase===phase)}));
 const result={schema:"ARKI-ARBOL-VIVO-AUTO-001",authority:"ADVISORY_ONLY",sourceCut:registry.updated_at||null,counts:{ideas:registry.ideas.length,components:registry.components.length,total:items.length,scheduled:ordered.filter(x=>x.phase).length,excluded:ordered.filter(x=>x.excluded).length},trunk:PHASES,branches,unassigned:ordered.filter(x=>!x.phase&&!x.excluded),excluded:ordered.filter(x=>x.excluded),issues,autonomy:{inventory:"AUTOMATIC",phaseAssignment:"HISTORICAL_REUSED_NOT_AUTONOMOUS",priority:"TRANSITIVE_DEPENDENCY_REACH_NO_DURATION_OR_URGENCY",experiment:"NOT_EXECUTED",measuredImprovement:"NOT_AVAILABLE",canonicalMutation:false},order:ordered.map(x=>({id:x.id,phase:x.phase,priorityScore:x.priorityScore,downstreamCount:x.downstreamCount,dependenciesResolved:x.dependenciesResolved,dependsOn:x.dependencies})),};
 result.receiptSha256=hash(result);return result;
}
function main(){
 const base=__dirname,registry=JSON.parse(fs.readFileSync(path.join(base,"assembly-registry.json"),"utf8"));
 const result=build(registry);const out=path.resolve(process.argv[2]||path.join(process.cwd(),"ARKI-ARBOL-VIVO-AUTO-001.json"));
 fs.writeFileSync(out,JSON.stringify(result,null,2)+"\n");
 console.log("ARBOL_AUTO_REPORT="+out);console.log("ACTIVITIES="+result.counts.total+"; ASSIGNED="+result.branches.reduce((n,b)=>n+b.activities.length,0)+"; ISSUES="+result.issues.length);
 console.log("EXCLUDED_OUT_OF_SCOPE="+result.counts.excluded+"; UNRESOLVED="+result.unassigned.length);
 console.log("PHASE_ASSIGNMENT=HISTORICAL_NOT_AUTONOMOUS; EXPERIMENT=NOT_EXECUTED; NO_CANONICAL_MUTATION");
 if(result.issues.some(x=>["DEPENDENCY_CYCLE","UNRESOLVED_PHASE","UNKNOWN_DEPENDENCY","INVALID_DEPENDENCY","INVALID_DEPENDENCY_EDGE","UNVERIFIED_PRECEDENCE","SELF_DEPENDENCY"].includes(x.code)))process.exitCode=2;
}
if(require.main===module)main();
module.exports={build,PHASES};
