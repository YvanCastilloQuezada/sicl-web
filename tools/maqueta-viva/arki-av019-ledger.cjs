"use strict";
/** AV-019 durable, exclusive PO ledger. Append is atomic by immutable numbered files. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {record}=require("./arki-av018-decision.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const name=n=>String(n).padStart(8,"0")+".json";
function readLedger(dir){
 if(!fs.existsSync(dir))return [];
 if(!fs.lstatSync(dir).isDirectory()||fs.lstatSync(dir).isSymbolicLink())throw Error("UNSAFE_LEDGER_DIR");
 const files=fs.readdirSync(dir);
 if(files.some(f=>!/^\d{8}\.json$/.test(f)))throw Error("UNEXPECTED_LEDGER_FILE");
 const ordered=files.sort(),entries=[];
 for(let i=0;i<ordered.length;i++){
  if(ordered[i]!==name(i+1))throw Error("LEDGER_SEQUENCE_GAP");
  const p=path.join(dir,ordered[i]),st=fs.lstatSync(p);
  if(!st.isFile()||st.isSymbolicLink()||st.size>1000000)throw Error("UNSAFE_LEDGER_ENTRY");
  const e=JSON.parse(fs.readFileSync(p,"utf8"));
  if(e.schema!=="ARKI-AV019-LEDGER-EVENT-1"||e.sequence!==i+1||e.previousHash!==(i?entries[i-1].eventHash:null)||!e.decision||e.decision.schema!=="ARKI-AV018-DECISION-1")throw Error("LEDGER_CHAIN_INVALID");
  const {eventHash,...unsigned}=e;
  if(hash(unsigned)!==eventHash)throw Error("LEDGER_HASH_INVALID");
  const {receiptSha256,...decisionUnsigned}=e.decision;
  if(hash(decisionUnsigned)!==receiptSha256||e.decision.rights?.coreWrite!==false||e.decision.rights?.canonicalIntegration!==false||e.decision.policy?.canonicalMutation!==false)throw Error("LEDGER_DECISION_INVALID");
  if(entries.some(x=>x.decision.proposalReceipt===e.decision.proposalReceipt))throw Error("DUPLICATE_PROPOSAL");
  entries.push(e);
 }
 return entries;
}
function append(dir,proposal,action,selected,actor){
 const target=path.resolve(dir);
 // Directory must already exist and be a trusted dedicated directory.
 if(!fs.existsSync(target)||!fs.lstatSync(target).isDirectory()||fs.lstatSync(target).isSymbolicLink())throw Error("LEDGER_DIR_MUST_EXIST");
 const lock=path.join(target,".av019.lock");
 let fd;
 try{
  fd=fs.openSync(lock,"wx",0o600);
  const entries=readLedgerUnlocked(target);
  if(entries.some(e=>e.decision.proposalReceipt===proposal.receiptSha256))throw Error("PROPOSAL_ALREADY_DECIDED");
  const decision=record(proposal,action,selected,actor);
  const event={schema:"ARKI-AV019-LEDGER-EVENT-1",sequence:entries.length+1,previousHash:entries.length?entries.at(-1).eventHash:null,decision};
  event.eventHash=hash(event);
  const entryPath=path.join(target,name(event.sequence));
  const entryFd=fs.openSync(entryPath,"wx",0o600);
  try{fs.writeFileSync(entryFd,JSON.stringify(event,null,2)+"\n");fs.fsyncSync(entryFd)}finally{fs.closeSync(entryFd)}
  const dirFd=fs.openSync(target,"r");try{fs.fsyncSync(dirFd)}finally{fs.closeSync(dirFd)}
  return event;
 }finally{if(fd!==undefined){fs.closeSync(fd);fs.unlinkSync(lock)}}
}
function readLedgerUnlocked(dir){
 const files=fs.readdirSync(dir).filter(x=>x!==".av019.lock");
 if(files.some(f=>!/^\d{8}\.json$/.test(f)))throw Error("UNEXPECTED_LEDGER_FILE");
 const ordered=files.sort(),entries=[];
 for(let i=0;i<ordered.length;i++){
  if(ordered[i]!==name(i+1))throw Error("LEDGER_SEQUENCE_GAP");
  const p=path.join(dir,ordered[i]),st=fs.lstatSync(p);
  if(!st.isFile()||st.isSymbolicLink()||st.size>1000000)throw Error("UNSAFE_LEDGER_ENTRY");
  const e=JSON.parse(fs.readFileSync(p,"utf8"));
  if(e.schema!=="ARKI-AV019-LEDGER-EVENT-1"||e.sequence!==i+1||e.previousHash!==(i?entries[i-1].eventHash:null)||!e.decision||e.decision.schema!=="ARKI-AV018-DECISION-1")throw Error("LEDGER_CHAIN_INVALID");
  const {eventHash,...unsigned}=e;
  if(hash(unsigned)!==eventHash)throw Error("LEDGER_HASH_INVALID");
  const {receiptSha256,...decisionUnsigned}=e.decision;
  if(hash(decisionUnsigned)!==receiptSha256||e.decision.rights?.coreWrite!==false||e.decision.rights?.canonicalIntegration!==false||e.decision.policy?.canonicalMutation!==false)throw Error("LEDGER_DECISION_INVALID");
  if(entries.some(x=>x.decision.proposalReceipt===e.decision.proposalReceipt))throw Error("DUPLICATE_PROPOSAL");
  entries.push(e);
 }return entries;
}
module.exports={append,readLedger};
if(require.main===module){try{
 const [mode,dir,proposalFile,action,actor,selected]=process.argv.slice(2);
 if(mode==="verify"&&dir&&process.argv.length===4){const entries=readLedger(dir);process.stdout.write(JSON.stringify({verified:true,events:entries.length,head:entries.at(-1)?.eventHash||null})+"\n")}
 else if(mode==="append"&&dir&&proposalFile&&action&&actor&&process.argv.length>=7&&process.argv.length<=8){
 const s=fs.lstatSync(proposalFile);if(!s.isFile()||s.isSymbolicLink()||s.size>3000000)throw Error("UNSAFE_PROPOSAL_FILE");
 process.stdout.write(JSON.stringify(append(dir,JSON.parse(fs.readFileSync(proposalFile,"utf8")),action,selected||null,actor),null,2)+"\n")
 }else throw Error("USAGE: verify DIR | append DIR PROPOSAL_JSON ACTION ACTOR [SELECTED]");
 }catch(e){process.stderr.write("ARKI_AV019_FAIL: "+e.message+"\n");process.exitCode=1}}
