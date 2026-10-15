"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const {page,start}=require("./arki-av023-historical-ui.cjs");
const {checkpoint}=require("./arki-mo053-continuity.cjs");
const root=path.resolve(__dirname,"../..");
test("MO054 renders continuity status in historical UI",()=>{const html=page(root);assert.match(html,/Continuidad:/);assert.match(html,/arki-mo05-operational/);assert.match(html,/arki-av023-evidence/)});
test("MO054 returns verified continuity and refuses writes",async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo054-"));const jdir=path.join(dir,"journal"),adir=path.join(dir,"anchor");fs.mkdirSync(jdir);fs.mkdirSync(adir);
 const journal=path.join(jdir,"events.jsonl"),anchor=path.join(adir,"anchor.json");
 const proposal={schema:"ARKI-AV017-PO-PROPOSAL-1",scope:"CONTROLLED_FIXTURE_ONLY",originalHead:"a".repeat(40),decision:{status:"AWAITING_PO"},policy:{approved:false,canonicalMutation:false},alternatives:[]};
 proposal.receiptSha256=crypto.createHash("sha256").update(JSON.stringify(proposal)).digest("hex");
 const file=path.join(dir,"proposal.json"),ledger=path.join(dir,"ledger");fs.mkdirSync(ledger);fs.writeFileSync(file,JSON.stringify(proposal));
 const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));
 checkpoint(journal,anchor,registry);
 const prevJ=process.env.ARKI_MO05_JOURNAL,prevA=process.env.ARKI_MO05_ANCHOR;let server;
 try{
 process.env.ARKI_MO05_JOURNAL=journal;process.env.ARKI_MO05_ANCHOR=anchor;
 server=start(root,file,ledger,0);await new Promise(resolve=>server.once("listening",resolve));
 const base="http://127.0.0.1:"+server.address().port;
 const res=await fetch(base+"/api/operational");assert.equal(res.status,200);
 const data=await res.json();assert.equal(data.continuity.restartStatus,"RECOVERED_MATCH");assert.equal(data.continuity.history.length,1);
 assert.equal(data.policy.canonicalMutation,false);
 assert.equal((await fetch(base+"/api/operational",{method:"POST"})).status,404);
 }finally{if(server)await new Promise(resolve=>server.close(resolve));if(prevJ===undefined)delete process.env.ARKI_MO05_JOURNAL;else process.env.ARKI_MO05_JOURNAL=prevJ;if(prevA===undefined)delete process.env.ARKI_MO05_ANCHOR;else process.env.ARKI_MO05_ANCHOR=prevA;fs.rmSync(dir,{recursive:true,force:true})}
});
