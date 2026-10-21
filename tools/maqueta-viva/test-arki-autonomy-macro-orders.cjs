"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {runMacroOrder}=require("./arki-autonomy-macro-orders.cjs");
const {validate}=require("./arki-autonomy-memory.cjs");
const store=require("./arki-automejora-operativa.cjs");
const base={command:"AUDIT_AND_PLAN",parts:[{id:"A",path:"src/a.ts",phase:"F2",dependencies:[]}],
 discovery:{schema:"ARKI-CAPABILITY-DISCOVERY-1",totalFiles:1,unclassified:0,sourceSnapshot:"fixture"},sourceSha:"a".repeat(40)};
function memoryFile(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-macro-order-"));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return path.join(dir,"memory.json");}
test("macro-order persists a verifiable journal",t=>{
 const file=memoryFile(t),r=runMacroOrder({...base,memoryFile:file});
 assert.equal(validate(r.journal).count,2);
 assert.equal(r.plan.work[0].action,"EVIDENCE_OR_AUTHORITY_REVIEW");
 assert.equal(r.persistence.appendedCount,2);
 assert.equal(r.persistence.duplicateCount,0);
 assert.equal(r.journal[0].payload.epistemicState,"PLAN_ONLY_NOT_FACT");
 assert.deepEqual(store.readStore(file).events,r.journal);
});
test("reassess appends to durable history without losing prior events",t=>{
 const file=memoryFile(t);
 const a=runMacroOrder({...base,memoryFile:file});
 const b=runMacroOrder({...base,command:"REASSESS",memoryFile:file});
 assert.equal(a.journal.length,2);
 assert.equal(b.journal.length,5);
 assert.equal(validate(b.journal).count,5);
 assert.equal(b.persistence.appendedCount,3);
 assert.equal(store.readStore(file).events.length,5);
});
test("repeating the same macro-order does not duplicate events",t=>{
 const file=memoryFile(t);
 const a=runMacroOrder({...base,memoryFile:file});
 const b=runMacroOrder({...base,memoryFile:file});
 assert.equal(a.journal.length,2);
 assert.equal(b.journal.length,2);
 assert.equal(b.persistence.appendedCount,0);
 assert.equal(b.persistence.duplicateCount,2);
 assert.deepEqual(a.journal,b.journal);
});
test("invalid macro-order rejected",t=>assert.throws(()=>runMacroOrder({...base,command:"EXECUTE_CANONICAL",memoryFile:memoryFile(t)}),/INVALID_MACRO_ORDER/));
test("persistent memory path is mandatory",()=>assert.throws(()=>runMacroOrder(base),/MEMORY_FILE_REQUIRED/));
test("journal tampering blocks further planning",t=>{
 const file=memoryFile(t);
 const a=runMacroOrder({...base,memoryFile:file});
 const broken=JSON.parse(fs.readFileSync(file,"utf8"));
 broken.events[0].payload.parts=100;
 fs.writeFileSync(file,JSON.stringify(broken));
 assert.throws(()=>runMacroOrder({...base,memoryFile:file}),/MEMORY_INTEGRITY_FAILURE/);
 assert.equal(a.journal.length,2);
});
test("macro-order is deterministic across fresh stores",t=>{
 const a=runMacroOrder({...base,memoryFile:memoryFile(t)});
 const b=runMacroOrder({...base,memoryFile:memoryFile(t)});
 assert.deepEqual(a.plan,b.plan);
 assert.deepEqual(a.journal,b.journal);
});
