"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {readJournal,appendDurable}=require("./arki-mo04-persistence.cjs");
const receipt="b".repeat(64);
function sandbox(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo04-"));try{return fn(path.join(dir,"journal.json"))}finally{fs.rmSync(dir,{recursive:true,force:true})}}
test("durable append survives reopening",()=>sandbox(file=>{const a=appendDurable(file,{expectedLength:0,expectedHead:null},{kind:"DIAGNOSIS",sourceReceipt:receipt,payload:{blocked:50}});assert.equal(readJournal(file,{expectedLength:1,expectedHead:a.anchor.head}).length,1);const b=appendDurable(file,{expectedLength:1,expectedHead:a.anchor.head},{kind:"PROPOSAL",sourceReceipt:receipt,payload:{pending:50}});assert.equal(b.anchor.length,2);assert.equal(b.replay.length,2)}));
test("stale anchor rejects append",()=>sandbox(file=>{appendDurable(file,{expectedLength:0,expectedHead:null},{kind:"OBSERVATION",sourceReceipt:receipt,payload:{}});assert.throws(()=>appendDurable(file,{expectedLength:0,expectedHead:null},{kind:"PROPOSAL",sourceReceipt:receipt,payload:{}}),/JOURNAL_ANCHOR_MISMATCH/)}));
test("tampering rejected",()=>sandbox(file=>{const a=appendDurable(file,{expectedLength:0,expectedHead:null},{kind:"OBSERVATION",sourceReceipt:receipt,payload:{x:1}});const j=JSON.parse(fs.readFileSync(file));j[0].payload.x=2;fs.writeFileSync(file,JSON.stringify(j));assert.throws(()=>readJournal(file,{expectedLength:1,expectedHead:a.anchor.head}),/JOURNAL_TAMPERED/)}));
test("truncation rejected",()=>sandbox(file=>{const a=appendDurable(file,{expectedLength:0,expectedHead:null},{kind:"OBSERVATION",sourceReceipt:receipt,payload:{x:1}});fs.writeFileSync(file,"[]");assert.throws(()=>readJournal(file,{expectedLength:1,expectedHead:a.anchor.head}),/JOURNAL_ANCHOR_MISMATCH/)}));
test("missing journal with nonempty anchor rejected",()=>sandbox(file=>assert.throws(()=>readJournal(file,{expectedLength:1,expectedHead:receipt}),/ENOENT/)));
test("symlink rejected",()=>sandbox(file=>{fs.symlinkSync(path.join(os.tmpdir(),"untrusted-arki-target"),file);assert.throws(()=>readJournal(file,{expectedLength:0,expectedHead:null}),/UNSAFE_JOURNAL/)}));
test("missing anchor rejected",()=>sandbox(file=>assert.throws(()=>readJournal(file),/TRUSTED_ANCHOR_REQUIRED/)));
