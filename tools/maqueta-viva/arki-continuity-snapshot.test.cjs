"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {build,loadLedger}=require("./arki-continuity-snapshot.cjs");
test("ledger has unique IDs and evidence",()=>{
 const events=loadLedger(),seen=new Set();
 assert.ok(events.length>=4);
 for(const e of events){assert.ok(e.id&&e.at&&e.kind&&e.summary&&e.evidence);assert.ok(!seen.has(e.id));seen.add(e.id);}
});
test("snapshot identifies source and cannot claim Core validation",()=>{
 const text=build();
 assert.match(text,/MAPA VIVO DE CONTINUIDAD/);
 assert.match(text,/Estado de Core\/D-2\/AGK: NOT_VERIFIED/);
 assert.match(text,/CI exacto y E2E: NOT_VERIFIED/);
 assert.match(text,/NO_AUTORIZADA_POR_ESTE_MAPA/);
 assert.match(text,/CONT-20261013-001/);
});
test("snapshot includes Git SHA and commit chronology",()=>{
 const text=build();
 assert.match(text,/Último SHA de cambios sustantivos \(excluye snapshot\): `[0-9a-f]{40}`/);
 assert.match(text,/Últimos 80 commits observados/);
});

test("snapshot is deterministic when Git and ledger are unchanged",()=>{assert.equal(build(),build());});

test("rejects missing, malformed, duplicate, and incomplete evidence",()=>{
 const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-continuity-")),file=path.join(dir,"events.jsonl");
 const event={id:"TEST-001",at:"2026-10-13",kind:"TEST",summary:"fixture",evidence:"local test",status:"TEST_ONLY"};
 try{
  assert.throws(()=>loadLedger(file),/Missing continuity ledger/);
  for(const content of ["{broken",JSON.stringify({...event,status:""}),JSON.stringify({...event,at:"invalid"}),JSON.stringify(event)+"\n"+JSON.stringify(event)]){
   fs.writeFileSync(file,content+"\n");
   assert.throws(()=>loadLedger(file));
  }
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
