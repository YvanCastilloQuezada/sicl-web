"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {resolveInputs}=require("../../arki-arbol-vivo.cjs");
test("root entrypoint points to original Maqueta Viva, not parallel frontend",()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),"arki-root-"));
 try{const p=path.join(d,"proposal.json"),ledger=path.join(d,"ledger");fs.writeFileSync(p,"{}");fs.mkdirSync(ledger);
 const x=resolveInputs({HOME:d,ARKI_PROPOSAL_FILE:p,ARKI_LEDGER_DIR:ledger,ARKI_TREE_PORT:"8766"});
 assert.ok(x.template.endsWith("tools/maqueta-viva/maqueta-viva.template.html"));
 assert.equal(x.port,8766);
 assert.ok(fs.readFileSync(x.template,"utf8").includes("function arkiDecisionDocket("));
 }finally{fs.rmSync(d,{recursive:true,force:true})}
});
test("root entrypoint refuses missing proposal and unsafe port",()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),"arki-root-"));
 try{const ledger=path.join(d,"ledger");fs.mkdirSync(ledger);
 assert.throws(()=>resolveInputs({HOME:d,ARKI_LEDGER_DIR:ledger}),/PROPOSAL_MISSING/);
 assert.throws(()=>resolveInputs({HOME:d,ARKI_TREE_PORT:"80"}),/INVALID_PORT/);
 }finally{fs.rmSync(d,{recursive:true,force:true})}
});
