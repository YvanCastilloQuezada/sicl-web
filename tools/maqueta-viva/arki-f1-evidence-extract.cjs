"use strict";
/** Extract source-grounded inventory statements, without inventing dependency edges. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const sha=x=>crypto.createHash("sha256").update(x).digest("hex");
const clean=s=>s.replace(/\*\*/g,"").replace(/\s+/g," ").trim();
function extract({agenda,sourceText,sourcePath,sourceSha256}){
 if(!agenda||agenda.schema!=="ARKI-F1-RESEARCH-AGENDA-1"||!Array.isArray(agenda.tasks)||agenda.canonicalMutation!==false||typeof sourceText!=="string"||!sourceText||!sourcePath||sha(sourceText)!==sourceSha256)throw Error("INVALID_EVIDENCE_INPUT");
 const {receiptSha256,...unsigned}=agenda;if(sha(JSON.stringify(unsigned))!==receiptSha256)throw Error("AGENDA_RECEIPT_MISMATCH");
 const lines=sourceText.split(/\r?\n/),rows=[];
 for(let i=0;i<lines.length;i++){const line=lines[i];if(!line.startsWith("| I-"))continue;const cells=line.split("|").slice(1,-1).map(clean);if(cells.length<8)continue;rows.push({line:i+1,id:cells[0],claim:cells[1],recordedStatus:cells[4],decision:cells[5],trace:cells[6],unknowns:cells[7]})}
 const byId=new Map(rows.map(x=>[x.id,x]));
 const findings=agenda.tasks.map(t=>{const row=byId.get(t.id);return {id:t.id,status:row?"DOCUMENTARY_CLAIM_EXTRACTED_NOT_VERIFIED":"NO_EXACT_INVENTORY_ROW",source:row?{path:sourcePath,sha256:sourceSha256,line:row.line}:null,claim:row?.claim||null,recordedStatus:row?.recordedStatus||null,decision:row?.decision||null,trace:row?.trace||null,unknowns:row?.unknowns||null,dependencyState:"UNDECLARED",automaticPromotion:false}});
 const result={schema:"ARKI-F1-EXTRACTED-EVIDENCE-1",agendaReceipt:receiptSha256,findings,extracted:findings.filter(x=>x.source).length,dependencyRelations:[],interpretation:"DOCUMENTARY_ONLY_NOT_SEMANTICALLY_VERIFIED",nextGate:"D6_2_REASONING_WITH_SOURCE_AND_COUNTEREXAMPLE",canonicalMutation:false,poApproval:"NOT_GRANTED"};result.receiptSha256=sha(JSON.stringify(result));return result;
}
module.exports={extract};
if(require.main===module){try{const [agendaFile,sourceFile]=process.argv.slice(2);if(!agendaFile||!sourceFile||process.argv.length!==4)throw Error("USAGE: node arki-f1-evidence-extract.cjs AGENDA_JSON SOURCE_MD");const safe=f=>{const s=fs.lstatSync(f);if(!s.isFile()||s.isSymbolicLink()||s.size>1024*1024)throw Error("UNSAFE_FILE");return fs.readFileSync(f,"utf8")};const sourceText=safe(sourceFile);process.stdout.write(JSON.stringify(extract({agenda:JSON.parse(safe(agendaFile)),sourceText,sourcePath:path.resolve(sourceFile),sourceSha256:sha(sourceText)}),null,2)+"\n")}catch(e){process.stderr.write("ARKI_EVIDENCE_EXTRACT_FAIL: "+e.message+"\n");process.exitCode=1}}
