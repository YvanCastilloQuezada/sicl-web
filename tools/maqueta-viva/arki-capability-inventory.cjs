"use strict";
/* Repository tree to capability inventory: no guessed implementation status, no writes. */
const {planAssembly}=require("./arki-assembly-planner.cjs");
const crypto=require("node:crypto");
const RULES=[
 [/\b(test|tests|spec|__tests__)\b|\.(test|spec)\./i,"TEST","F8"],
 [/^(docs|documentation)\//i,"DOCUMENTATION","F1"],
 [/(agk|geometry|geometric|topology|spatial|layout)/i,"GEOMETRY_OR_SPATIAL","F4"],
 [/(core|state|event|provenance|evidence|receipt)/i,"STATE_AND_EVIDENCE","F2"],
 [/(agent|reason|learn|adn|knowledge|intelligen)/i,"INTELLIGENCE","F3"],
 [/(twin|gemelo|timeline|observer|maqueta|arbol)/i,"DIGITAL_TWIN_AND_TREE","F7"],
 [/(api|router|integration|client|bridge)/i,"INTEGRATION","F9"],
 [/(\.github|deploy|docker|ops|ci)/i,"OPERATIONS","F10"]
];
function inventoryTrees(sources){
 if(!Array.isArray(sources)||sources.length!==3)throw Error("THREE_REPOSITORIES_REQUIRED");
 const records=[],seen=new Set(),coverage=[];
 for(const source of sources){
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(source.repository)||!/^[0-9a-f]{40}$/i.test(source.sha)||!Array.isArray(source.tree)||source.truncated===true)throw Error("INVALID_OR_TRUNCATED_TREE");
  let count=0;
  for(const entry of source.tree){
   if(entry.type!=="blob")continue;
   if(typeof entry.path!=="string"||!entry.path||entry.path.includes("..")||entry.path.startsWith("/")||entry.path.includes("\\"))throw Error("UNSAFE_TREE_PATH");
   const id=source.repository+":"+entry.path;
   if(seen.has(id))throw Error("DUPLICATE_FILE");
   seen.add(id);count++;
   const match=RULES.find(([rx])=>rx.test(entry.path));
   records.push({id,repository:source.repository,path:entry.path,sourceSha:source.sha,blobSha:entry.sha||null,category:match?.[1]||"UNCLASSIFIED",proposedPhase:match?.[2]||null,classification:"HEURISTIC_UNVERIFIED",implementation:"UNKNOWN",verification:"NOT_EXECUTED",dependencies:"UNKNOWN",canonicalMutation:false});
  }
  coverage.push({repository:source.repository,commit:source.sha,files:count});
 }
 return {schema:"ARKI-CAPABILITY-INVENTORY-1",coverage,summary:{files:records.length,classified:records.filter(r=>r.category!=="UNCLASSIFIED").length,unclassified:records.filter(r=>r.category==="UNCLASSIFIED").length},records,canonicalMutation:false,execution:"NOT_EXECUTED"};
}
function proposePlacements(inventory){
 if(!inventory||!Array.isArray(inventory.records))throw Error("INVALID_CAPABILITY_INVENTORY");
 return planAssembly(inventory.records.map(r=>({id:"part_"+crypto.createHash("sha256").update(r.id).digest("hex"),path:r.path,phase:r.proposedPhase,dependencies:[]})));
}
module.exports={inventoryTrees,proposePlacements};
if(require.main===module){
 const fs=require("node:fs");
 const file=process.argv[2];
 if(!file||process.argv.length!==3)throw Error("USAGE: node arki-capability-inventory.cjs three-tree-snapshots.json");
 const result=inventoryTrees(JSON.parse(fs.readFileSync(file,"utf8")));
 process.stdout.write(JSON.stringify(result,null,2)+"\n");
}
