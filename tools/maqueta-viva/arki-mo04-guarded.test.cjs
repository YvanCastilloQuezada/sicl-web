"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {inspect,appendGuarded}=require("./arki-mo04-guarded.cjs");
const receipt="c".repeat(64);
function fixture(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo043-"));const j=path.join(root,"journal","events.json"),a=path.join(root,"anchors","trusted.json");fs.mkdirSync(path.dirname(j));fs.mkdirSync(path.dirname(a));try{fn(j,a)}finally{fs.rmSync(root,{recursive:true,force:true})}}
const event={kind:"DIAGNOSIS",sourceReceipt:receipt,payload:{blocked:50}};
test("append and restart inspect",()=>fixture((j,a)=>{const r=appendGuarded(j,a,event);assert.equal(r.anchor.length,1);assert.equal(inspect(j,a).replay.length,1);assert.equal(fs.existsSync(j+".lock"),false)}));
test("serial appends maintain anchored chain",()=>fixture((j,a)=>{appendGuarded(j,a,event);appendGuarded(j,a,{kind:"PROPOSAL",sourceReceipt:receipt,payload:{candidate:1}});assert.equal(inspect(j,a).replay.length,2)}));
test("concurrent lock fails closed",()=>fixture((j,a)=>{fs.writeFileSync(j+".lock","occupied");assert.throws(()=>appendGuarded(j,a,event),/EEXIST/);assert.equal(fs.existsSync(j+".lock"),true)}));
test("missing anchor with journal fails closed",()=>fixture((j,a)=>{appendGuarded(j,a,event);fs.unlinkSync(a);assert.throws(()=>inspect(j,a),/MISSING_TRUSTED_ANCHOR/)}));
test("journal truncation fails closed",()=>fixture((j,a)=>{appendGuarded(j,a,event);fs.writeFileSync(j,"[]");assert.throws(()=>inspect(j,a),/JOURNAL_ANCHOR_MISMATCH/)}));
test("independent directories required",()=>fixture((j,a)=>assert.throws(()=>inspect(j,path.join(path.dirname(j),"anchor.json")) ,/INDEPENDENT_ANCHOR_DIRECTORY_REQUIRED/)));
test("symlink anchor rejected",()=>fixture((j,a)=>{appendGuarded(j,a,event);const copy=a+".copy";fs.copyFileSync(a,copy);fs.unlinkSync(a);fs.symlinkSync(copy,a);assert.throws(()=>inspect(j,a),/UNSAFE_ANCHOR/)}));
test("recorded PO decision never grants authority",()=>fixture((j,a)=>{appendGuarded(j,a,{kind:"DECISION_RECORDED",sourceReceipt:receipt,payload:{approved:true}});assert.equal(inspect(j,a).replay.approval,"NOT_INFERRED")}));
