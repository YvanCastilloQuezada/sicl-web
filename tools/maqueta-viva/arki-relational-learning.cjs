"use strict";
/** ARKI relational learning: discover *candidate* prerequisites from sourced statements.
 * Never turns a guessed relationship into an operational dependency.
 */
const crypto=require("node:crypto");
const {assessDependencyCoverage}=require("./arki-dependency-coverage.cjs");
const ID=/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/;
function digest(x){return crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex")}
function proposeRelations(registry,statements=[]){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components)||!Array.isArray(statements)||statements.length>10000)throw Error("INVALID_RELATION_INPUT");
 const parts=[...registry.ideas,...registry.components],byId=new Map();
 for(const p of parts){if(!p||typeof p.id!=="string"||!ID.test(p.id)||byId.has(p.id))throw Error("INVALID_OR_DUPLICATE_PART");byId.set(p.id,p)}
 const issues=[],candidates=[],seen=new Set();
 for(const s of statements){
  if(!s||!ID.test(s.before||"")||!ID.test(s.after||"")||!["REQUIRES","INFORMS","FEEDBACK"].includes(s.relation)||!s.source||typeof s.source.path!=="string"||!s.source.path.trim()||typeof s.source.sha!=="string"||!/^[0-9a-f]{40}$/.test(s.source.sha)||typeof s.source.quote!=="string"||!s.source.quote.trim()){issues.push({code:"INVALID_SOURCE_STATEMENT"});continue}
  if(!byId.has(s.before)||!byId.has(s.after)){issues.push({code:"UNKNOWN_PART",before:s.before,after:s.after});continue}
  if(s.before===s.after){issues.push({code:"SELF_RELATION",id:s.before});continue}
  const key=[s.before,s.after,s.relation].join("|");
  if(seen.has(key)){issues.push({code:"DUPLICATE_RELATION",key});continue}
  seen.add(key);
  candidates.push({id:digest({key,source:s.source}).slice(0,24),before:s.before,after:s.after,relation:s.relation,source:{...s.source},evidenceStatus:"SOURCE_CLAIM_UNVERIFIED",decision:"PROPOSED_FOR_REVIEW",canonicalMutation:false});
 }
 const required=candidates.filter(x=>x.relation==="REQUIRES");
 const edges=new Map(parts.map(p=>[p.id,[]]));
 for(const c of required)edges.get(c.after).push(c.before);
 const visiting=new Set(),done=new Set(),cycles=[];
 function walk(id,stack){
  if(visiting.has(id)){cycles.push([...stack,id]);return}
  if(done.has(id))return;
  visiting.add(id);
  for(const parent of edges.get(id))walk(parent,[...stack,id]);
  visiting.delete(id);done.add(id);
 }
 for(const id of byId.keys())walk(id,[]);
 const coverage=assessDependencyCoverage(registry);
 return {schema:"ARKI-RELATIONAL-LEARNING-1",sourceCut:registry.updated_at||null,inventoryCount:parts.length,candidates,issues,cycles,existingCoverage:{declared:coverage.declared,total:coverage.total},promotion:"BLOCKED_REVIEW_AND_COMPETENCE_REQUIRED",learning:"CANDIDATE_RELATIONS_ONLY",execution:"NOT_EXECUTED",canonicalMutation:false,receiptSha256:digest({candidates,issues,cycles})};
}
module.exports={proposeRelations};
if(require.main===module){
 const fs=require("node:fs"),path=require("node:path");
 if(process.argv.length!==3)throw Error("USAGE: node arki-relational-learning.cjs statements.json");
 const statements=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(proposeRelations(registry,statements),null,2)+"\n");
}
