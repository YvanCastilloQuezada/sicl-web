"use strict";
/** MO-07.4: bounded, read-only file evidence inspection; never executes inspected source. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {assess}=require("./arki-mo073-dual-mission.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const CODE=/\.(?:cjs|mjs|js|jsx|ts|tsx|py|rs|cpp|c|h|hpp)$/i;
const TEST=/(?:^|\/)(?:test|tests|__tests__)(?:\/|$)|(?:\.|_)(?:test|spec)\./i;
const DOC=/\.(?:md|mdx|txt|json|yaml|yml)$/i;
function inspect(piece,roots){
 const entries=[];
 const seen=new Set();
 for(const ref of piece.codeCandidates||[]){
  for(const match of ref.matches||[]){
   const root=roots[match.repository],rel=match.path;
   if(!root||!rel||path.isAbsolute(rel)||rel.split("/").includes(".."))continue;
   const key=match.repository+":"+rel;
   if(seen.has(key))continue;seen.add(key);
   const full=path.resolve(root,rel),base=path.resolve(root)+path.sep;
   if(!full.startsWith(base))continue;
   let status="UNREADABLE",bytes=0,digest=null;
   try{
    const stat=fs.lstatSync(full);
    if(stat.isFile()&&stat.size<=1024*1024){
     const data=fs.readFileSync(full);bytes=data.length;digest=crypto.createHash("sha256").update(data).digest("hex");status="CONTENT_READ";
    }else status=stat.isSymbolicLink()?"SYMLINK_NOT_FOLLOWED":"NOT_REGULAR_OR_TOO_LARGE";
   }catch{}
   entries.push({repository:match.repository,path:rel,match:match.match,status,bytes,sha256:digest,kind:TEST.test(rel)?"TEST":CODE.test(rel)?"SOURCE":DOC.test(rel)?"DOCUMENT":"OTHER"});
  }
 }
 entries.sort((a,b)=>(a.repository+":"+a.path).localeCompare(b.repository+":"+b.path,"en"));
 const source=entries.filter(x=>x.kind==="SOURCE"&&x.status==="CONTENT_READ").length;
 const tests=entries.filter(x=>x.kind==="TEST"&&x.status==="CONTENT_READ").length;
 return {id:piece.id,name:piece.name,missions:piece.missionAssessment.missions,
  evidence:{matchedFiles:entries.length,sourceFilesRead:source,testFilesRead:tests,files:entries},
  maturity:"NOT_CERTIFIED",evidenceLevel:source?"CANDIDATE_SOURCE_READ":entries.length?"PATH_CANDIDATE_ONLY":"NO_MATCHED_REFERENCES",
  impact:"NOT_EVALUATED",decision:"PO_REVIEW_PENDING",behavior:"NOT_EXECUTED_OR_VERIFIED",
  dependencies:"NOT_VERIFIED",duplicates:"NOT_EVALUATED"};
}
function evaluate(registry,roots){
 const previous=assess(registry,roots);
 const pieces=previous.pieces.map(p=>inspect(p,roots));
 const result={schema:"ARKI-MO074-FUNCTIONAL-EVIDENCE-SCREEN-1",sourceReceipt:previous.receiptSha256,
  note:"Matching a path and reading bytes does not establish runtime behavior, test coverage, implementation maturity, or dependency.",
  summary:{total:pieces.length,withCandidateSource:pieces.filter(p=>p.evidence.sourceFilesRead>0).length,
   withoutMatchedReferences:pieces.filter(p=>p.evidence.matchedFiles===0).length,verifiedBehaviors:0},
  pieces,policy:{readOnly:true,noExecution:true,noCanonicalWrites:true,poApprovalRequired:true}};
 result.receiptSha256=sha(result);return result;
}
module.exports={evaluate,inspect};
if(require.main===module){
 const root=path.resolve(__dirname,"../..");
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 process.stdout.write(JSON.stringify(evaluate(registry,{web:root,core:process.argv[2]||null,acs:process.argv[3]||null}),null,2)+"\n");
}
