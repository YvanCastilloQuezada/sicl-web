"use strict";
/** MO-04.2 isolated durable journal: explicit anchor required to detect truncation.
 * Not a canonical approval ledger. The caller owns the trusted anchor independently.
 */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const {append,verify,replay}=require("./arki-mo04-journal.cjs");
const SHA=/^[a-f0-9]{64}$/;
function readJournal(file,{expectedLength,expectedHead}={}){
 if(!Number.isSafeInteger(expectedLength)||expectedLength<0||!(expectedHead===null||SHA.test(expectedHead||"")))throw Error("TRUSTED_ANCHOR_REQUIRED");
 if(typeof file!=="string"||!path.isAbsolute(file))throw Error("ABSOLUTE_PATH_REQUIRED");
 let j;
 try{const stat=fs.lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>10000000)throw Error("UNSAFE_JOURNAL");j=JSON.parse(fs.readFileSync(file,"utf8"));}
 catch(e){if(e.code==="ENOENT"&&expectedLength===0&&expectedHead===null)j=[];else throw e;}
 const state=verify(j);
 if(state.length!==expectedLength||state.head!==expectedHead)throw Error("JOURNAL_ANCHOR_MISMATCH");
 return j;
}
function writeAtomic(file,journal){
 if(typeof file!=="string"||!path.isAbsolute(file))throw Error("ABSOLUTE_PATH_REQUIRED");
 verify(journal);
 const dir=path.dirname(file),name=path.basename(file);
 if(!fs.statSync(dir).isDirectory())throw Error("INVALID_DIRECTORY");
 try{const s=fs.lstatSync(file);if(!s.isFile()||s.isSymbolicLink())throw Error("UNSAFE_JOURNAL");}catch(e){if(e.code!=="ENOENT")throw e;}
 const tmp=path.join(dir,"."+name+"."+crypto.randomBytes(12).toString("hex")+".tmp");
 let fd;
 try{
  fd=fs.openSync(tmp,"wx",0o600);
  fs.writeFileSync(fd,JSON.stringify(journal,null,2)+"\n","utf8");fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;
  fs.renameSync(tmp,file);
  const d=fs.openSync(dir,"r");try{fs.fsyncSync(d)}finally{fs.closeSync(d)}
 }finally{if(fd!==undefined)fs.closeSync(fd);try{fs.unlinkSync(tmp)}catch(e){if(e.code!=="ENOENT")throw e}}
}
function appendDurable(file,anchor,event){
 const current=readJournal(file,anchor);
 const next=append(current,event);
 writeAtomic(file,next);
 return {anchor:verify(next),replay:replay(next)};
}
module.exports={readJournal,writeAtomic,appendDurable};
