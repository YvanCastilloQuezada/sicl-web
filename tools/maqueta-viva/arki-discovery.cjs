"use strict";
const fs=require("node:fs");
const crypto=require("node:crypto");
const RULES=[
 ["TEST",/\/tests?\/|\.test\.|\.spec\.|test[-_]/i,"F8"],
 ["DIGITAL_TWIN_AND_TREE",/maqueta|gemelo|twin|arbol|timeline|observer/i,"F7"],
 ["GEOMETRY_OR_SPATIAL",/agk|geometry|geometr|topolog|spatial|layout/i,"F4"],
 ["STATE_AND_EVIDENCE",/core|state|event|provenance|evidence|receipt/i,"F2"],
 ["INTELLIGENCE",/agent|reason|learn|adn|knowledge|intelligen/i,"F3"],
 ["INTEGRATION",/api|router|integration|client|bridge/i,"F9"],
 ["OPERATIONS",/\.github|deploy|docker|\/ops\/|\/ci\//i,"F10"],
 ["DOCUMENTATION",/^docs\//i,"F1"]
];
function discover(snapshot){
 if(!snapshot||snapshot.schema!=="ARKI-REPOSITORY-TREE-SNAPSHOT-1"||!Array.isArray(snapshot.sources)||snapshot.sources.length!==3)throw Error("INVALID_SNAPSHOT");
 const counts={},samples={};let total=0,unclassified=0;const repos=new Set();
 for(const s of snapshot.sources){
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(s.repository)||repos.has(s.repository)||!(/^[0-9a-f]{40}$/i.test(s.commit))||s.truncated!==false||!Array.isArray(s.paths)||s.fileCount!==s.paths.length)throw Error("INVALID_SOURCE");
  repos.add(s.repository);counts[s.repository]={};samples[s.repository]={};
  const seen=new Set();
  for(const path of s.paths){
   if(typeof path!=="string"||!path||path.startsWith("/")||path.includes("..")||path.includes("\\")||seen.has(path))throw Error("INVALID_PATH");
   seen.add(path);total++;
   const rule=RULES.find(x=>x[1].test(path));const kind=rule?rule[0]:"UNCLASSIFIED";
   counts[s.repository][kind]=(counts[s.repository][kind]||0)+1;
   (samples[s.repository][kind]??=[]);
   if(samples[s.repository][kind].length<4)samples[s.repository][kind].push(path);
   if(!rule)unclassified++;
  }
 }
 if(total!==snapshot.totalFiles)throw Error("TOTAL_MISMATCH");
 return {schema:"ARKI-CAPABILITY-DISCOVERY-1",sourceSnapshot:"tools/maqueta-viva/arki-repository-snapshot.json",basis:"PATH_NAME_HEURISTIC_ONLY",status:"OBSERVED_PATHS_CLASSIFICATION_PROPOSED",totalFiles:total,unclassified,counts,samples,decision:"NO_CANONICAL_PROMOTION",next:"INSPECT_MODULE_CONTENT_AND_DEPENDENCIES"};
}
module.exports={discover};
if(require.main===module){
 const snapshot=JSON.parse(fs.readFileSync(process.argv[2]||"tools/maqueta-viva/arki-repository-snapshot.json","utf8"));
 process.stdout.write(JSON.stringify(discover(snapshot),null,2)+"\n");
}
