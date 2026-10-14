"use strict";
/** Árbol Vivo: conservative dependency gate. Unknown evidence never becomes PASS. */
const crypto=require("node:crypto");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function evaluate(nodes){
 if(!Array.isArray(nodes)||nodes.length>10000)throw Error("INVALID_NODES");
 const byId=new Map();
 for(const n of nodes){
  if(!n||typeof n.id!=="string"||!n.id||byId.has(n.id)||!Array.isArray(n.dependencies)||n.dependencies.some(x=>typeof x!=="string"||!x)||typeof n.evidenceVerified!=="boolean")throw Error("INVALID_NODE");
  byId.set(n.id,n);
 }
 const memo=new Map(),active=new Set();
 function visit(id){
  if(memo.has(id))return memo.get(id);
  if(active.has(id))return {status:"BLOCKED_CYCLE",blockers:[id]};
  const n=byId.get(id);
  if(!n)return {status:"BLOCKED_MISSING_DEPENDENCY",blockers:[id]};
  active.add(id);
  const blockers=[];
  let cycle=false,missing=false,unverified=!n.evidenceVerified;
  for(const dep of n.dependencies){
   const result=visit(dep);
   if(result.status!=="READY"){
    blockers.push(dep,...result.blockers);
    cycle ||=result.status==="BLOCKED_CYCLE";
    missing ||=result.status==="BLOCKED_MISSING_DEPENDENCY";
    unverified ||=result.status==="BLOCKED_UNVERIFIED";
   }
  }
  active.delete(id);
  const status=cycle?"BLOCKED_CYCLE":missing?"BLOCKED_MISSING_DEPENDENCY":unverified?"BLOCKED_UNVERIFIED":"READY";
  const value={status,blockers:[...new Set(blockers)].sort()};
  memo.set(id,value);return value;
 }
 const items=[...byId.keys()].sort().map(id=>({id,...visit(id)}));
 return {schema:"ARKI-LIVE-DEPENDENCY-GATE-1",items,canonicalMutation:false,receiptSha256:hash(items)};
}
module.exports={evaluate};
if(require.main===module){
 const fs=require("node:fs");
 if(process.argv.length!==3)throw Error("USAGE: node arki-live-dependency-gate.cjs INPUT_JSON");
 const file=process.argv[2],stat=fs.lstatSync(file);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>2e6)throw Error("UNSAFE_INPUT");
 process.stdout.write(JSON.stringify(evaluate(JSON.parse(fs.readFileSync(file,"utf8"))),null,2)+"\n");
}
