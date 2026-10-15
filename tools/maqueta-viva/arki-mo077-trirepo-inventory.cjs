"use strict";
/** MO-07.7 repository-wide evidence inventory. Read-only; no implementation claims. */
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const {audit}=require("./arki-mo076-contract-drafts.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const CODE=/\.(?:js|jsx|mjs|cjs|ts|tsx|py|rs|go|java|cpp|c|h|hpp)$/i;
const DOC=/\.(?:md|mdx|rst|txt)$/i;
const TEST=/(?:^|\/)(?:test|tests|__tests__)(?:\/|$)|(?:\.|_)(?:test|spec)\./i;
const DECL=/^\s{0,4}(?:#{1,4}\s+|(?:[-*]\s+)?(?:idea|proyecto|project|actividad|activity|capacidad|capability|hito|milestone|pendiente|todo)\s*[:\-])/i;
const CATEGORIES=[["IDEA",/\b(?:idea|ideas|proposal|propuesta)\b/i],["PROJECT",/\b(?:proyecto|project)\b/i],["ACTIVITY",/\b(?:actividad|activity|task|tarea|hito|milestone)\b/i],["CAPABILITY",/\b(?:capacidad|capability|module|modulo|módulo)\b/i]];
function git(root,args){return cp.execFileSync("git",["-C",root,...args],{encoding:"utf8",timeout:20000,maxBuffer:32*1024*1024})}
function list(root){
 return git(root,["ls-files","-z"]).split("\0").filter(Boolean).sort();
}
function collect(root,repository){
 const paths=list(root),items=[],stats={trackedFiles:paths.length,sourceFiles:0,testFiles:0,documentFiles:0,unreadable:0,skippedLarge:0};
 for(const rel of paths){
  if(path.isAbsolute(rel)||rel.split("/").includes(".."))continue;
  const full=path.resolve(root,rel);
  if(!full.startsWith(path.resolve(root)+path.sep))continue;
  const isCode=CODE.test(rel),isDoc=DOC.test(rel),isTest=TEST.test(rel);
  if(isCode)stats.sourceFiles++;if(isDoc)stats.documentFiles++;if(isTest)stats.testFiles++;
  if(!isDoc&&!isCode)continue;
  let data;
  try{const st=fs.lstatSync(full);if(!st.isFile()){stats.unreadable++;continue}
   if(st.size>512*1024){stats.skippedLarge++;continue}
   data=fs.readFileSync(full,"utf8");
  }catch{stats.unreadable++;continue}
  const lines=data.split(/\r?\n/);
  if(isCode){
   items.push({id:sha([repository,rel,"FILE"]).slice(0,16),repository,path:rel,line:null,category:isTest?"TEST_ARTIFACT":"CODE_ARTIFACT",title:path.basename(rel),evidence:"TRACKED_FILE_READ",status:isTest?"TEST_CODE_PRESENT_NOT_EXECUTED":"CODE_PRESENT_NOT_FUNCTIONALLY_VERIFIED"});
  }
  if(isDoc){
   let hits=0;
   for(let i=0;i<lines.length&&hits<100;i++){
    const line=lines[i].trim();
    if(!DECL.test(line)||line.length>220)continue;
    const title=line.replace(/^#{1,4}\s*/,"").replace(/^[-*]\s*/,"").trim();
    const found=CATEGORIES.find(([,re])=>re.test(title));
    items.push({id:sha([repository,rel,i+1,title]).slice(0,16),repository,path:rel,line:i+1,category:found?found[0]:"DOCUMENTED_ITEM",title,evidence:"DOCUMENT_HEADING_OR_LABEL",status:"DOCUMENTED_NOT_VERIFIED"});
    hits++;
   }
  }
 }
 return {stats,items};
}
function inventory(registry,roots){
 const baseline=audit(registry,roots),repositories={},items=[];
 for(const repo of ["web","core","acs"]){
  const found=collect(roots[repo],repo);
  repositories[repo]={...baseline.repositories[repo],...found.stats};
  items.push(...found.items);
 }
 const known=baseline.contracts.map(x=>({id:x.id,category:"HISTORICAL_REGISTRY_ITEM",title:x.title,
  status:"CONTRACT_DRAFT_NOT_APPROVED",evidence:"ASSEMBLY_REGISTRY",missions:x.missions}));
 const counts={};for(const item of items)counts[item.category]=(counts[item.category]||0)+1;
 const result={schema:"ARKI-MO077-TRIREPO-DISCOVERY-1",sourceReceipt:baseline.receiptSha256,
  repositories,summary:{repositories:3,trackedFiles:Object.values(repositories).reduce((n,x)=>n+x.trackedFiles,0),
   discoveredEvidenceRecords:items.length,historicalRegistryItems:known.length,categoryCounts:counts,
   verifiedBehaviors:0,approvedContracts:0},
  historicalItems:known,discoveredItems:items,
  limitations:["A file is not a verified feature","Document headings are candidate items, not an exhaustive semantic inventory","Repeated references may describe one logical item","No test execution or runtime inspection","Working-tree files are read-only and may differ from committed HEAD"],
  policy:{readOnly:true,noCanonicalWrites:true,noAutomaticPromotion:true,poApprovalRequired:true}};
 result.receiptSha256=sha(result);return result;
}
module.exports={inventory,collect};
if(require.main===module){
 const root=path.resolve(__dirname,"../.."),registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(inventory(registry,{web:root,core:process.argv[2],acs:process.argv[3]}),null,2)+"\n");
}
