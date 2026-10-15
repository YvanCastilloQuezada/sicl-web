"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const {page,start}=require("./arki-av023-historical-ui.cjs");
const root=path.resolve(__dirname,"../..");
test("MO056 renders proposals inside historical panel",()=>{
 const html=page(root);assert.match(html,/Árbol Vivo · propuestas y alternativas/);assert.match(html,/arki-mo05-operational/);assert.match(html,/arki-av023-evidence/);
});
test("MO056 returns three unexecuted alternatives and refuses writes",async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo056-"));let server;
 try{
 const proposal={schema:"ARKI-AV017-PO-PROPOSAL-1",scope:"CONTROLLED_FIXTURE_ONLY",originalHead:"a".repeat(40),decision:{status:"AWAITING_PO"},policy:{approved:false,canonicalMutation:false},alternatives:[]};
 proposal.receiptSha256=crypto.createHash("sha256").update(JSON.stringify(proposal)).digest("hex");
 const file=path.join(dir,"proposal.json"),ledger=path.join(dir,"ledger");fs.mkdirSync(ledger);fs.writeFileSync(file,JSON.stringify(proposal));
 server=start(root,file,ledger,0);await new Promise(resolve=>server.once("listening",resolve));
 const base="http://127.0.0.1:"+server.address().port;
 const res=await fetch(base+"/api/operational");assert.equal(res.status,200);const data=await res.json();
 assert.equal(data.proposals.schema,"ARKI-MO055-PROPOSALS-1");
 assert.equal(data.proposals.summary.proposals,data.proposals.proposals.length);
 assert(data.proposals.proposals.length>0);
 assert(data.proposals.proposals.every(x=>x.alternatives.length===3&&x.executionAuthorized===false));
 assert.equal(data.proposals.policy.simulationExecuted,false);
 assert.equal((await fetch(base+"/api/operational",{method:"POST"})).status,404);
 }finally{if(server)await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true})}
});
