"use strict";
/** MO-07.5: bounded source symbol discovery, advisory only. No code execution. */
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process"),crypto=require("node:crypto");
const {evaluate}=require("./arki-mo074-functional-evidence.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const SOURCE=/\.(?:cjs|mjs|js|jsx|ts|tsx|py)$/i;
const TEST=/(?:^|\/)(?:test|tests|__tests__)(?:\/|$)|(?:\.|_)(?:test|spec)\./i;
const STOP=new Set(["arki","sicl","core","delta","sistema","capacidad","componente","funcional","modelo","idea","ideas","para","desde","sobre","como","entre","nivel","human","local","test","prueba","datos","version","fase","multi","basic","canonica"]);
const ALIASES={ocr:["ocr","extract","pdf"],"rvt":["revit","rvt"],"dwg":["dwg","dxf"],"gis":["gis","geojson","territory"],"parti":["parti","topology"],"mep":["mep"],"voz":["voice","speech"],"conocimiento":["knowledge","retrieval"],"normativa":["regulation","normative"],"cost":["cost","budget"],"geom":["geometry","geometric"],"aprendizaje":["learning","learn"],"bitácora":["journal","history"],"tutor":["tutor","evaluation"],"fuentes":["source","provenance"],"autonomía":["autonomy","self"]};
function tokens(name){
 const base=String(name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 const raw=base.match(/[a-z][a-z0-9]{2,}/g)||[];
 const out=new Set();
 for(const word of raw){if(STOP.has(word))continue;out.add(word);for(const [key,aliases] of Object.entries(ALIASES))if(word.includes(key))aliases.forEach(a=>out.add(a));}
 return [...out].filter(x=>x.length>=3).sort();
}
function tracked(root){
 if(!root||!fs.existsSync(root))return [];
 try{return cp.execFileSync("git",["-C",root,"ls-files","-z"],{encoding:"utf8",timeout:15000,maxBuffer:16*1024*1024}).split("\0").filter(x=>SOURCE.test(x)&&!x.includes("node_modules/")).sort();}catch{return []}
}
function catalog(roots){
 const result=[];
 for(const repo of ["web","core","acs"]){
  const root=roots[repo];if(!root)continue;
  for(const rel of tracked(root)){
   if(rel.split("/").includes("..")||path.isAbsolute(rel))continue;
   const full=path.resolve(root,rel);
   if(!full.startsWith(path.resolve(root)+path.sep))continue;
   let content;try{const st=fs.lstatSync(full);if(!st.isFile()||st.size>262144)continue;content=fs.readFileSync(full,"utf8");}catch{continue}
   const lines=content.split(/\r?\n/);
   const symbols=[];
   for(let i=0;i<lines.length;i++){
    const line=lines[i];
    const m=line.match(/^\s*(?:(?:export\s+)?(?:async\s+)?(?:function|class|interface|type|enum)\s+|(?:export\s+)?(?:const|let)\s+|(?:async\s+)?def\s+|class\s+)([A-Za-z_][A-Za-z0-9_]*)/);
    if(m)symbols.push({name:m[1],line:i+1});
    if(symbols.length>=100)break;
   }
   result.push({repository:repo,path:rel,kind:TEST.test(rel)?"TEST":"SOURCE",symbols});
  }
 }
 return result;
}
function discover(registry,roots){
 const previous=evaluate(registry,roots),files=catalog(roots);
 const pieces=previous.pieces.map(p=>{
  const terms=tokens(p.name);
  const matches=[];
  for(const f of files){
   const hay=(f.path+" "+f.symbols.map(s=>s.name).join(" ")).toLowerCase();
   const hits=terms.filter(t=>hay.includes(t));
   if(hits.length)matches.push({repository:f.repository,path:f.path,kind:f.kind,matchedTerms:hits,score:hits.length,symbols:f.symbols.filter(s=>hits.some(t=>s.name.toLowerCase().includes(t))).slice(0,5)});
  }
  matches.sort((a,b)=>b.score-a.score||(a.repository+":"+a.path).localeCompare(b.repository+":"+b.path,"en"));
  return {id:p.id,name:p.name,missions:p.missions,matchedByHistoricalReference:p.evidence.matchedFiles,
   functionalCandidates:matches.slice(0,12),candidateCount:matches.length,
   status:matches.length?"SYMBOL_OR_PATH_CANDIDATES_UNVERIFIED":"NO_SYMBOL_OR_PATH_MATCH",
   duplicates:"NOT_DETERMINED",dependencies:"NOT_DETERMINED",behavior:"NOT_VERIFIED",decision:"PO_APPROVAL_REQUIRED"};
 });
 const result={schema:"ARKI-MO075-FUNCTIONAL-SYMBOL-DISCOVERY-1",sourceReceipt:previous.receiptSha256,
  summary:{total:pieces.length,withFunctionalCandidates:pieces.filter(p=>p.candidateCount>0).length,withoutFunctionalCandidates:pieces.filter(p=>p.candidateCount===0).length,verifiedBehaviors:0,indexedSourceFiles:files.length},
  pieces,policy:{readOnly:true,noSourceExecution:true,noCanonicalWrites:true,noAutomaticPromotion:true,poApprovalRequired:true}};
 result.receiptSha256=sha(result);return result;
}
module.exports={discover,tokens,catalog};
if(require.main===module){
 const root=path.resolve(__dirname,"../.."),registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(discover(registry,{web:root,core:process.argv[2]||null,acs:process.argv[3]||null}),null,2)+"\n");
}
