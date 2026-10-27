"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const {auditSources}=require("./arki-f1-source-audit.cjs");
const hash=x=>crypto.createHash("sha256").update(x).digest("hex");
function agenda(origin){const a={schema:"ARKI-F1-RESEARCH-AGENDA-1",canonicalMutation:false,tasks:[{id:"I-01",origin}],relationCandidates:[]};return {...a,receiptSha256:hash(JSON.stringify(a))}}
function sandbox(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),"arki-audit-"));try{fn(root)}finally{fs.rmSync(root,{recursive:true,force:true})}}
test("existing primary source is hashed but not promoted to knowledge",()=>sandbox(root=>{fs.mkdirSync(path.join(root,"docs"));fs.writeFileSync(path.join(root,"docs","source.md"),"evidence");const r=auditSources({agenda:agenda("docs/source.md"),root});assert.equal(r.summary.present,1);assert.equal(r.findings[0].source.sha256,hash("evidence"));assert.equal(r.knowledge,"SOURCE_PRESENCE_ONLY");assert.equal(r.canonicalMutation,false)}));
test("missing source remains missing, not invented",()=>sandbox(root=>{const r=auditSources({agenda:agenda("docs/missing.md"),root});assert.equal(r.summary.missing,1);assert.equal(r.findings[0].dependencyState,"UNDECLARED")}));
test("traversal rejected",()=>sandbox(root=>{const r=auditSources({agenda:agenda("docs/../secrets"),root});assert.equal(r.summary.present,0)}));
test("tampered agenda rejected",()=>sandbox(root=>{const a=agenda("docs/a.md");a.tasks[0].id="FORGED";assert.throws(()=>auditSources({agenda:a,root}),/AGENDA_RECEIPT_MISMATCH/)}));
test("symlink source not followed",()=>sandbox(root=>{fs.mkdirSync(path.join(root,"docs"));fs.writeFileSync(path.join(root,"outside"),"secret");fs.symlinkSync(path.join(root,"outside"),path.join(root,"docs","link.md"));const r=auditSources({agenda:agenda("docs/link.md"),root});assert.equal(r.summary.present,0)}));
