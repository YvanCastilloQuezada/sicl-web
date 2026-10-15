"use strict";
/** MO-07.8: branch-aware proposal clustering; no automatic merges or approvals. */
const cp=require("node:child_process"),fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const WORDS=new Set(["idea","ideas","proyecto","project","actividad","activity","capacidad","capability","arki","sicl","para","with","from","the","and","del","las","los","una","uno","sobre","como","fase","modulo","módulo","sistema","system","nuevo","nueva","mejora","mejorar","implementacion","implementación"]);
function terms(s){return [...new Set((String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().match(/[a-z][a-z0-9]{3,}/g)||[]).filter(x=>!WORDS.has(x)))].sort()}
function branches(root){
 const output=cp.execFileSync("git",["-C",root,"for-each-ref","--format=%(refname)","refs/heads","refs/remotes"],{encoding:"utf8",timeout:15000});
 return [...new Set(output.split("\n").filter(x=>x&&!x.endsWith("/HEAD")))].sort();
}
function extract(root,repo,ref,maxFiles=2000){
 const names=cp.execFileSync("git",["-C",root,"ls-tree","-r","--name-only",ref],{encoding:"utf8",timeout:20000,maxBuffer:16*1024*1024}).split("\n").filter(x=>/\.(?:md|mdx|rst|txt)$/i.test(x)).slice(0,maxFiles);
 const entries=[];
 for(const file of names){
  let body;try{body=cp.execFileSync("git",["-C",root,"show",ref+":"+file],{encoding:"utf8",timeout:3000,maxBuffer:300000});}catch{continue}
  if(body.length>200000)continue;
  const lines=body.split(/\r?\n/);
  for(let i=0;i<lines.length;i++){
   const m=lines[i].match(/^\s*(?:#{1,4}\s*|[-*]\s*)?(?:\*\*)?(idea|proyecto|project|actividad|activity|capacidad|capability)\s*[:\-]\s*(.{5,160})/i);
   if(!m)continue;
   entries.push({repository:repo,ref,path:file,line:i+1,kind:m[1].toUpperCase(),title:m[2].replace(/\*\*$/,"").trim(),terms:terms(m[2])});
   if(entries.length>=1000)break;
  }
 }
 return entries;
}
function cluster(entries){
 const groups=new Map();
 for(const e of entries){
  const key=e.kind+":"+e.terms.join("|");
  if(e.terms.length<2)continue;
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(e);
 }
 return [...groups.values()].filter(g=>new Set(g.map(x=>x.repository+":"+x.ref+":"+x.path+":"+x.line)).size>=2).map(g=>{
  const versions=g.sort((a,b)=>(a.repository+a.ref+a.path+a.line).localeCompare(b.repository+b.ref+b.path+b.line));
  return {id:sha(versions.map(x=>[x.repository,x.ref,x.path,x.line])).slice(0,16),
   classification:"POSSIBLE_SAME_TOPIC_NOT_PROVEN_DUPLICATE",
   versions:versions.map(x=>({repository:x.repository,branch:x.ref,path:x.path,line:x.line,title:x.title,contribution:"REQUIRES_CONTENT_REVIEW"})),
   enhancedProposal:{status:"DRAFT_REQUIRES_SEMANTIC_REVIEW",title:"Consolidar: "+versions[0].title,
    approach:"Compare goals, constraints, differences, evidence and compatibility of each version; preserve unique contributions; produce a testable integrated contract.",
    uniqueContributions:"NOT_YET_ESTABLISHED",benefit:"NOT_QUANTIFIED",risks:"NOT_EVALUATED"},
   approval:"PO_REQUIRED",canonicalMutation:false};
 }).sort((a,b)=>b.versions.length-a.versions.length||a.id.localeCompare(b.id));
}
function analyze(roots,limit=12){
 const repositories={},all=[];
 for(const repo of ["web","core","acs"]){
  const root=roots[repo];if(!root||!fs.existsSync(root))throw Error("REPOSITORY_UNAVAILABLE:"+repo);
  const refs=branches(root);repositories[repo]={availableRefs:refs.length,scannedRefs:Math.min(refs.length,limit),truncated:refs.length>limit};
  for(const ref of refs.slice(0,limit))all.push(...extract(root,repo,ref));
 }
 const groups=cluster(all),result={schema:"ARKI-MO078-CROSS-BRANCH-IDEA-RECONCILIATION-1",repositories,
  summary:{records:all.length,possibleOverlapGroups:groups.length,approvedMerges:0,verifiedImplementations:0},
  groups,policy:{readOnly:true,noMerge:true,noCanonicalWrites:true,poApprovalRequired:true},
  limitations:["Only locally fetched refs can be inspected","Branch scan limit applies per repository","Token-equal titles are candidates, not semantic duplicates","Proposals are review templates, not validated synthesized designs"]};
 result.receiptSha256=sha(result);return result;
}
module.exports={analyze,cluster,terms,branches};
if(require.main===module){
 const roots={web:path.resolve(__dirname,"../.."),core:process.argv[2],acs:process.argv[3]};
 process.stdout.write(JSON.stringify(analyze(roots,Number(process.argv[4]||12)),null,2)+"\n");
}
