"use strict";
/** Local primary-source audit for ARKI F1 agenda; no inferred dependency claims. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const digest=x=>crypto.createHash("sha256").update(x).digest("hex");
function safeFile(root,relative){
 if(typeof relative!=="string"||!relative.startsWith("docs/")||relative.includes("\\")||relative.split("/").includes("..")||path.isAbsolute(relative))return null;
 const full=path.join(root,relative);
 try{const s=fs.lstatSync(full);if(!s.isFile()||s.isSymbolicLink()||s.size>1024*1024)return null;return {path:relative,bytes:s.size,sha256:digest(fs.readFileSync(full))}}catch(e){if(e.code==="ENOENT")return null;throw e}
}
function auditSources({agenda,root}){
 if(!agenda||agenda.schema!=="ARKI-F1-RESEARCH-AGENDA-1"||agenda.canonicalMutation!==false||!Array.isArray(agenda.tasks)||!path.isAbsolute(root))throw Error("INVALID_RESEARCH_AGENDA");
 const {receiptSha256,...unsigned}=agenda;
 if(digest(JSON.stringify(unsigned))!==receiptSha256)throw Error("AGENDA_RECEIPT_MISMATCH");
 const findings=agenda.tasks.map(t=>{
  const source=safeFile(root,t.origin);
  return {id:t.id,origin:t.origin||null,status:source?"SOURCE_FILE_PRESENT_NOT_SEMANTICALLY_VERIFIED":"SOURCE_NOT_AVAILABLE_AT_DECLARED_PATH",source,dependencyState:"UNDECLARED",relationCandidates:agenda.relationCandidates.filter(x=>x.after===t.id).map(x=>x.id),action:source?"REVIEW_SOURCE_CONTENT_AND_VERIFY_CLAIMS":"LOCATE_PRIMARY_SOURCE_AND_RECONCILE_PATH"};
 });
 const result={schema:"ARKI-F1-SOURCE-AUDIT-1",agendaReceipt:receiptSha256,findings,summary:{present:findings.filter(x=>x.source).length,missing:findings.filter(x=>!x.source).length},knowledge:"SOURCE_PRESENCE_ONLY",competence:"NOT_VERIFIED",canonicalMutation:false,poApproval:"NOT_GRANTED"};
 result.receiptSha256=digest(JSON.stringify(result));return result;
}
module.exports={auditSources};
if(require.main===module){try{
 const [agendaFile,repoRoot]=process.argv.slice(2);
 if(!agendaFile||!repoRoot||process.argv.length!==4)throw Error("USAGE: node arki-f1-source-audit.cjs AGENDA_JSON ABSOLUTE_REPO_ROOT");
 const s=fs.lstatSync(agendaFile);if(!s.isFile()||s.isSymbolicLink()||s.size>1024*1024)throw Error("UNSAFE_AGENDA_FILE");
 process.stdout.write(JSON.stringify(auditSources({agenda:JSON.parse(fs.readFileSync(agendaFile,"utf8")),root:repoRoot}),null,2)+"\n");
}catch(e){process.stderr.write("ARKI_SOURCE_AUDIT_FAIL: "+e.message+"\n");process.exitCode=1}}
