"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {record}=require("./arki-autonomy-memory.cjs");
const {inspectPersistedJournal}=require("./Verify-ARKI-Journal.cjs");
const input={type:"OBSERVATION",subject:"F1",sourceSha:"b".repeat(40),evidenceRef:"audit:local",payload:{status:"UNKNOWN"}};
function withFile(value,fn){
 const d=fs.mkdtempSync(path.join(os.tmpdir(),"arki-journal-"));
 try{const f=path.join(d,"journal.json");fs.writeFileSync(f,value);return fn(f,d)}
 finally{fs.rmSync(d,{recursive:true,force:true})}
}
test("valid persisted journal with pinned head",()=>{
 const h=record([],input);
 withFile(JSON.stringify(h),f=>{
  const {validate}=require("./arki-autonomy-memory.cjs");
  const r=inspectPersistedJournal(f,validate(h).headHash);
  assert.equal(r.count,1);assert.equal(r.authenticity,"NOT_ESTABLISHED");
 });
});
test("fail on mismatched anchored head",()=>withFile(JSON.stringify(record([],input)),f=>assert.throws(()=>inspectPersistedJournal(f,"c".repeat(64)),/JOURNAL_HEAD_MISMATCH/)));
test("fail on modified payload",()=>{
 const h=record([],input);h[0].payload.status="PASS";
 withFile(JSON.stringify(h),f=>assert.throws(()=>inspectPersistedJournal(f),/MEMORY_INTEGRITY_FAILURE/));
});
test("fail on invalid JSON",()=>withFile("{",f=>assert.throws(()=>inspectPersistedJournal(f),/JOURNAL_JSON_INVALID/)));
test("fail on unrecognized schema",()=>withFile(JSON.stringify({events:[]}),f=>assert.throws(()=>inspectPersistedJournal(f),/JOURNAL_SCHEMA_INVALID/)));
test("reject symlink",()=>withFile("[]",(f,d)=>{
 const link=path.join(d,"link.json");fs.symlinkSync(f,link);
 assert.throws(()=>inspectPersistedJournal(link),/INVALID_JOURNAL_FILE/);
}));
test("reject oversized file",()=>withFile("[]",(f)=>{
 fs.truncateSync(f,16*1024*1024+1);
 assert.throws(()=>inspectPersistedJournal(f),/INVALID_JOURNAL_FILE/);
}));
