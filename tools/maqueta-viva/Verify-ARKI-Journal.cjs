"use strict";
/** Read-only, fail-closed verification of externally persisted ARKI journal JSON.
 * No file creation, canonical mutation, or authenticity assertion.
 */
const fs=require("node:fs");
const {validate}=require("./arki-autonomy-memory.cjs");
function inspectPersistedJournal(filename,expectedHead){
 if(typeof filename!=="string"||!filename)throw Error("JOURNAL_PATH_REQUIRED");
 const stat=fs.lstatSync(filename);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size>16*1024*1024)throw Error("INVALID_JOURNAL_FILE");
 const bytes=fs.readFileSync(filename,"utf8");
 let data;
 try{data=JSON.parse(bytes)}catch{throw Error("JOURNAL_JSON_INVALID")}
 const history=Array.isArray(data)?data:data&&Object.keys(data).length===1&&Array.isArray(data.history)?data.history:null;
 if(!history)throw Error("JOURNAL_SCHEMA_INVALID");
 const result=validate(history);
 if(expectedHead&&(!/^[0-9a-f]{64}$/.test(expectedHead)||expectedHead!==result.headHash))throw Error("JOURNAL_HEAD_MISMATCH");
 return {...result,storage:"EXTERNAL_FILE_INSPECTED",authenticity:"NOT_ESTABLISHED",canonicalMutation:false};
}
if(require.main===module){
 try{
  if(process.argv.length<3||process.argv.length>4)throw Error("USAGE: node Verify-ARKI-Journal.cjs FILE [EXPECTED_HEAD_SHA256]");
  process.stdout.write(JSON.stringify(inspectPersistedJournal(process.argv[2],process.argv[3]),null,2)+"\n");
 }catch(e){process.stderr.write("ARKI_JOURNAL_VERIFY_FAIL: "+e.message+"\n");process.exitCode=1}
}
module.exports={inspectPersistedJournal};
