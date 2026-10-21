"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {resolveInputs}=require("../../arki-arbol-vivo.cjs");
test("official launcher uses historical AV-UI-001, never template",()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),"arki-root-"));
 try{const p=path.join(d,"proposal.json"),ledger=path.join(d,"ledger");fs.writeFileSync(p,"{}");fs.mkdirSync(ledger);
 const x=resolveInputs({HOME:d,ARKI_PROPOSAL_FILE:p,ARKI_LEDGER_DIR:ledger});
 assert.equal(x.port,8768);
 assert.ok(x.root.endsWith("sicl-web")||fs.existsSync(path.join(x.root,"package.json")));
 assert.equal(Object.hasOwn(x,"template"),false);
 }finally{fs.rmSync(d,{recursive:true,force:true})}
});
test("official launcher refuses missing proposal and unsafe port",()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),"arki-root-"));
 try{const ledger=path.join(d,"ledger");fs.mkdirSync(ledger);
 assert.throws(()=>resolveInputs({HOME:d,ARKI_LEDGER_DIR:ledger}),/PROPOSAL_MISSING/);
 assert.throws(()=>resolveInputs({HOME:d,ARKI_TREE_PORT:"80"}),/INVALID_PORT/);
 }finally{fs.rmSync(d,{recursive:true,force:true})}
});
