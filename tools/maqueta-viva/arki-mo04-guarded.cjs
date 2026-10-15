"use strict";
/** MO-04.3 guarded advisory history. Independent anchor location, fail-closed lock.
 * Local integrity only: same-host compromise can rewrite both files.
 * No silent crash recovery, canonical mutation, or PO approval.
 */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {readJournal,appendDurable}=require("./arki-mo04-persistence.cjs");
const {verify,replay}=require("./arki-mo04-journal.cjs");
function ensurePaths(journal,anchor){
 if(!path.isAbsolute(journal)||!path.isAbsolute(anchor)||path.resolve(path.dirname(journal))===path.resolve(path.dirname(anchor))||journal===anchor)throw Error("INDEPENDENT_ANCHOR_DIRECTORY_REQUIRED");
}
function atomic(file,value){
 const dir=path.dirname(file);
 if(!fs.statSync(dir).isDirectory())throw Error("ANCHOR_DIRECTORY_INVALID");
 try{const s=fs.lstatSync(file);if(!s.isFile()||s.isSymbolicLink())throw Error("UNSAFE_ANCHOR");}catch(e){if(e.code!=="ENOENT")throw e}
 const temp=path.join(dir,"."+path.basename(file)+"."+crypto.randomBytes(12).toString("hex")+".tmp");
 let fd;
 try{
  fd=fs.openSync(temp,"wx",0o600);
  fs.writeFileSync(fd,JSON.stringify(value)+"\n");fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;
  fs.renameSync(temp,file);
  const d=fs.openSync(dir,"r");try{fs.fsyncSync(d)}finally{fs.closeSync(d)}
 }finally{if(fd!==undefined)fs.closeSync(fd);try{fs.unlinkSync(temp)}catch(e){if(e.code!=="ENOENT")throw e}}
}
function anchorRead(file){
 let s;
 try{s=fs.lstatSync(file)}catch(e){if(e.code==="ENOENT")return null;throw e}
 if(!s.isFile()||s.isSymbolicLink()||s.size>4096)throw Error("UNSAFE_ANCHOR");
 const x=JSON.parse(fs.readFileSync(file,"utf8"));
 if(x.schema!=="ARKI-MO04-ANCHOR-1"||!Number.isSafeInteger(x.expectedLength)||x.expectedLength<0||!(x.expectedHead===null||/^[0-9a-f]{64}$/.test(x.expectedHead)))throw Error("INVALID_ANCHOR");
 return x;
}
function inspect(journal,anchor){
 ensurePaths(journal,anchor);
 const a=anchorRead(anchor);
 if(!a){
  if(fs.existsSync(journal))throw Error("MISSING_TRUSTED_ANCHOR");
  return {anchor:{expectedLength:0,expectedHead:null},replay:replay([])};
 }
 const entries=readJournal(journal,a);
 return {anchor:a,replay:replay(entries)};
}
function appendGuarded(journal,anchor,event){
 ensurePaths(journal,anchor);
 const lock=journal+".lock";
 let fd;
 try{
  fd=fs.openSync(lock,"wx",0o600);
  fs.writeSync(fd,JSON.stringify({pid:process.pid,policy:"MANUAL_REVIEW_ON_STALE_LOCK"}));
  fs.fsyncSync(fd);
  const state=inspect(journal,anchor);
  const result=appendDurable(journal,state.anchor,event);
  atomic(anchor,{schema:"ARKI-MO04-ANCHOR-1",expectedLength:result.anchor.length,expectedHead:result.anchor.head});
  return result;
 }finally{
  if(fd!==undefined){fs.closeSync(fd);fs.unlinkSync(lock)}
 }
}
module.exports={inspect,appendGuarded};
