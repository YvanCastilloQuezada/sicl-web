"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {execute}=require("./arki-integrated-diagnosis.cjs");
const {inspect}=require("./arki-mo04-guarded.cjs");
const registry=require("./assembly-registry.json");
const {planMo03}=require("./arki-mo03-autoplan.cjs");
const sha="a".repeat(40),webSha="b".repeat(40);
function fixture(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),"arki-integration-"));const journal=path.join(root,"journal","events.json"),anchor=path.join(root,"anchor","anchor.json");fs.mkdirSync(path.dirname(journal));fs.mkdirSync(path.dirname(anchor));try{fn(journal,anchor)}finally{fs.rmSync(root,{recursive:true,force:true})}}
test("real registry diagnoses and persists read-only history",()=>fixture((journal,anchor)=>{
 const coreMap={schema:"ARKI-CORE-MAPA-VIVO-1",coreHead:sha,phases:[]};
 const webSnapshot={schema:"ARKI-WEB-MAPA-VIVO-1",webHead:webSha,map:{findings:[]}};
 assert.throws(()=>execute({registry,coreMap,webSnapshot,expectedCoreHead:sha,journal,anchor}));
 assert.equal(inspect(journal,anchor).replay.length,0);
}));
