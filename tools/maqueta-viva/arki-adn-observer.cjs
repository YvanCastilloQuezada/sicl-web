"use strict";
// Experimental self-triggering proposals from a local observation inbox.
// No Core/AGK execution, canonical mutation, or promotion.
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {propose}=require("./arki-adn-mejora-continua.cjs");
const digest=x=>crypto.createHash("sha256").update(x).digest("hex");
function directory(p){const d=path.resolve(p),s=fs.lstatSync(d);if(!s.isDirectory()||s.isSymbolicLink())throw Error("UNSAFE_DIRECTORY");return d}
function safeRead(dir,name){
 if(!/^[\w.-]{1,100}\.json$/.test(name))throw Error("INVALID_NAME");
 const file=path.join(dir,name),s=fs.lstatSync(file);
 if(!s.isFile()||s.isSymbolicLink()||s.size>100000)throw Error("UNSAFE_FILE");
 return fs.readFileSync(file,"utf8");
}
function ledger(dir){
 const names=fs.readdirSync(dir).filter(n=>/^event-[0-9]{6}\.json$/.test(n)).sort();
 const reports=fs.readdirSync(dir).filter(n=>/^proposal-[0-9]{6}\.json$/.test(n));
 if(reports.length!==names.length)throw Error("ORPHAN_OR_MISSING_REPORT");
 let prev="GENESIS",ids=new Set(),digests=new Set();
 if(names.length>10000)throw Error("LEDGER_LIMIT");
 for(let i=0;i<names.length;i++){
  const event=JSON.parse(safeRead(dir,names[i]));
  const {eventHash,...body}=event;
  if(body.schema!=="ARKI-ADN-LEDGER-1"||body.seq!==i+1||body.previous!==prev||body.canonicalMutation!==false||digest(JSON.stringify(body))!==eventHash)throw Error("LEDGER_INVALID");
  const reportName="proposal-"+String(i+1).padStart(6,"0")+".json";
  const reportText=safeRead(dir,reportName);
  if(digest(reportText)!==body.reportHash)throw Error("REPORT_TAMPER_DETECTED");
  const report=JSON.parse(reportText);
  if(report.schema!=="ARKI-ADN-AUTO-PROPOSAL-1"||report.canonicalMutation!==false||report.canonicalPromotion!=="BLOCKED"||report.result.observationDigest!==body.observationDigest||report.result.observationId!==body.observationId)throw Error("REPORT_INVALID");
  if(ids.has(body.observationId)||digests.has(body.observationDigest))throw Error("LEDGER_DUPLICATE");
  ids.add(body.observationId);digests.add(body.observationDigest);prev=eventHash;
 }
 return {seq:names.length,prev,ids,digests};
}
function processOnce(inbox,outbox){
 const input=directory(inbox),output=directory(outbox);
 if(input===output||input.startsWith(output+path.sep)||output.startsWith(input+path.sep))throw Error("UNSAFE_DIRECTORY_LAYOUT");
 const state=ledger(output),files=fs.readdirSync(input).filter(n=>n.endsWith(".json")).sort();
 if(files.length>1000)throw Error("INBOX_LIMIT");
 let added=0,skipped=0;
 for(const name of files){
  const result=propose(JSON.parse(safeRead(input,name)));
  if(state.ids.has(result.observationId)||state.digests.has(result.observationDigest)){skipped++;continue}
  const report={schema:"ARKI-ADN-AUTO-PROPOSAL-1",sourceFile:name,result,execution:"NOT_EXECUTED",learning:"NOT_VERIFIED",canonicalPromotion:"BLOCKED",canonicalMutation:false};
  const reportText=JSON.stringify(report,null,2)+"\n",reportHash=digest(reportText);
  const body={schema:"ARKI-ADN-LEDGER-1",seq:state.seq+1,previous:state.prev,observationId:result.observationId,observationDigest:result.observationDigest,reportHash,canonicalMutation:false};
  const eventHash=digest(JSON.stringify(body));
  const num=String(body.seq).padStart(6,"0");
  fs.writeFileSync(path.join(output,"proposal-"+num+".json"),reportText,{flag:"wx"});
  fs.writeFileSync(path.join(output,"event-"+num+".json"),JSON.stringify({...body,eventHash},null,2)+"\n",{flag:"wx"});
  state.seq++;state.prev=eventHash;state.ids.add(result.observationId);state.digests.add(result.observationDigest);added++;
 }
 return {added,skipped,events:state.seq,execution:"NOT_EXECUTED",canonicalMutation:false};
}
async function main(args){
 const [mode,input,output,...rest]=args;
 if(mode==="--once"&&rest.length===0){console.log(JSON.stringify(processOnce(input,output)));return}
 if(mode!=="--watch"||rest.length!==4||rest[0]!=="--interval-ms"||rest[2]!=="--max-polls")throw Error("USAGE: --once IN OUT | --watch IN OUT --interval-ms N --max-polls N");
 const interval=Number(rest[1]),polls=Number(rest[3]);
 if(!Number.isInteger(interval)||interval<1000||interval>60000||!Number.isInteger(polls)||polls<1||polls>1000)throw Error("INVALID_BUDGET");
 for(let i=0;i<polls;i++){console.log(JSON.stringify({poll:i+1,...processOnce(input,output)}));if(i+1<polls)await new Promise(resolve=>setTimeout(resolve,interval))}
}
if(require.main===module)main(process.argv.slice(2)).catch(e=>{console.error("ARKI_ADN_OBSERVER_FAIL: "+e.message);process.exitCode=1});
module.exports={processOnce,ledger};
