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
 assert.match(text,/SHA observado: `[0-9a-f]{40}`/);
 assert.match(text,/Últimos 80 commits observados/);
});
