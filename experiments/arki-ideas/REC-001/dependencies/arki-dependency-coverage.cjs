"use strict";
/** Dependency coverage gate for the existing ARKI Árbol Vivo registry.
 * No inferred edges, no automatic promotion and no canonical writes.
 */
function assessDependencyCoverage(registry){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components))throw Error("INVALID_REGISTRY");
 const entries=[...registry.ideas,...registry.components],ids=new Set(),issues=[],links=[];
 for(const x of entries){
  if(!x||typeof x.id!=="string"||!x.id||ids.has(x.id))throw Error("INVALID_OR_DUPLICATE_ID");
  ids.add(x.id);
 }
 for(const x of entries){
  if(!Object.hasOwn(x,"dependencies")){
   issues.push({id:x.id,code:"DEPENDENCIES_UNDECLARED"});
   continue;
  }
  if(!Array.isArray(x.dependencies)){issues.push({id:x.id,code:"DEPENDENCIES_INVALID"});continue}
  for(const d of x.dependencies){
   if(typeof d!=="string"||!ids.has(d)){issues.push({id:x.id,code:"DEPENDENCY_UNKNOWN",dependency:d});continue}
   if(d===x.id){issues.push({id:x.id,code:"SELF_DEPENDENCY"});continue}
   links.push({before:d,after:x.id});
  }
 }
 const graph=new Map(entries.map(x=>[x.id,[]]));
 for(const edge of links)graph.get(edge.after).push(edge.before);
 const state=new Map(),cycles=[];
 function visit(id,stack){
  if(state.get(id)===2)return;
  if(state.get(id)===1){cycles.push([...stack,id]);return}
  state.set(id,1);
  for(const d of graph.get(id))visit(d,[...stack,id]);
  state.set(id,2);
 }
 for(const id of ids)visit(id,[]);
 return {schema:"ARKI-DEPENDENCY-COVERAGE-1",sourceCut:registry.updated_at||null,total:entries.length,declared:entries.filter(x=>Array.isArray(x.dependencies)).length,edges:links.length,issues,cycles,readiness:issues.length||cycles.length?"BLOCKED_UNVERIFIED":"STRUCTURALLY_DECLARED_NOT_COMPETENCE_VERIFIED",canonicalMutation:false,inferredDependencies:0};
}
module.exports={assessDependencyCoverage};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path");
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 const result=assessDependencyCoverage(registry);
 process.stdout.write(JSON.stringify(result,null,2)+"\n");
 if(result.readiness!=="STRUCTURALLY_DECLARED_NOT_COMPETENCE_VERIFIED")process.exitCode=2;
}
