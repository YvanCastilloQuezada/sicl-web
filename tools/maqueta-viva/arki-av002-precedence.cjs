"use strict";
/** AV-002: deterministic, read-only precedence diagnosis. F6 has no freeze gate. */
const crypto=require("node:crypto");
const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function diagnose(registry){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components))throw Error("INVALID_REGISTRY");
 const entries=[...registry.ideas,...registry.components];
 if(entries.length>10000)throw Error("REGISTRY_TOO_LARGE");
 const nodes=new Map();
 for(const n of entries){
  if(!n||typeof n.id!=="string"||!n.id||nodes.has(n.id))throw Error("INVALID_NODE_ID");
  nodes.set(n.id,n);
 }
 const issues=[],seen=new Set();
 const add=(kind,id,detail)=>{const key=JSON.stringify([kind,id,detail]);if(!seen.has(key)){seen.add(key);issues.push({kind,id,detail,classification:kind==="UNDECLARED_DEPENDENCIES"||kind==="EVIDENCE_NOT_VERIFIED"?"INFORMATION_GAP":"CONFIRMED_STRUCTURAL_DEFECT",resolution:kind==="MISSING_DEPENDENCY"?"INVESTIGATE_SOURCE_NO_AUTOFILL":kind==="CYCLIC_DEPENDENCY"?"INVESTIGATE_PRECEDENCE_NO_AUTOREMOVE":"REQUIRES_EVIDENCE_AND_PO_REVIEW"});}};
 for(const n of entries){
  if(!Array.isArray(n.dependsOn)){add("UNDECLARED_DEPENDENCIES",n.id,null);continue}
  if(n.dependsOn.length>10000)throw Error("DEPENDENCIES_TOO_LARGE");
  const deps=new Set();
  for(const d of n.dependsOn){
   if(typeof d!=="string"||!d)throw Error("INVALID_DEPENDENCY");
   if(deps.has(d))add("DUPLICATE_DEPENDENCY",n.id,d);
   deps.add(d);
   if(!nodes.has(d))add("MISSING_DEPENDENCY",n.id,d);
   if(d===n.id)add("CYCLIC_DEPENDENCY",n.id,d);
  }
 }
 // Iterative DFS avoids recursion overflow on long chains.
 const color=new Map(),parent=new Map();
 for(const start of nodes.keys()){
  if(color.has(start))continue;
  color.set(start,1);const stack=[{id:start,i:0,deps:Array.isArray(nodes.get(start).dependsOn)?nodes.get(start).dependsOn:[]}];
  while(stack.length){
   const top=stack[stack.length-1];
   if(top.i>=top.deps.length){color.set(top.id,2);stack.pop();continue}
   const dep=top.deps[top.i++];
   if(!nodes.has(dep)||dep===top.id)continue;
   if(color.get(dep)===1){
    const cycle=[dep],guard=new Set([dep]);let cur=top.id;
    while(cur!==dep&&!guard.has(cur)&&cur!==undefined){cycle.push(cur);guard.add(cur);cur=parent.get(cur)}
    if(cur===dep){cycle.push(dep);const body=cycle.slice(0,-1).sort();add("CYCLIC_DEPENDENCY",body[0],body.join(","))}
   }else if(!color.has(dep)){
    parent.set(dep,top.id);color.set(dep,1);
    stack.push({id:dep,i:0,deps:Array.isArray(nodes.get(dep).dependsOn)?nodes.get(dep).dependsOn:[]});
   }
  }
 }
 for(const n of entries){
  if(n.verification!=="VERIFIED"&&n.verification!==true)add("EVIDENCE_NOT_VERIFIED",n.id,null);
 }
 issues.sort((a,b)=>a.kind.localeCompare(b.kind)||a.id.localeCompare(b.id)||String(a.detail).localeCompare(String(b.detail)));
 const result={schema:"ARKI-AV002-PRECEDENCE-DIAGNOSIS-1",sourceDigest:digest(registry),nodeCount:entries.length,issues,counts:{confirmedDefects:issues.filter(x=>x.classification==="CONFIRMED_STRUCTURAL_DEFECT").length,informationGaps:issues.filter(x=>x.classification==="INFORMATION_GAP").length},policy:{f6:"UNLOCKED_BY_PO",canonicalMutation:false,autoRepair:false,poApproval:"PENDING",competenceClaim:false}};
 result.receiptSha256=digest(result);return result;
}
module.exports={diagnose};
