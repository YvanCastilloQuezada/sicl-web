"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const {page,start}=require("./arki-av023-historical-ui.cjs");
const root=path.resolve(__dirname,"../..");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
test("MO05 is embedded into the official historical UI without replacing it",()=>{
 const html=page(root);assert.match(html,/arki-mo05-operational/);assert.match(html,/\/api\/operational/);assert.match(html,/arki-av023-evidence/);
});
test("MO05 API is read-only, provenance-carrying, and refuses writes",async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-mo05-ui-"));let server;
 try{
 const proposal={schema:"ARKI-AV017-PO-PROPOSAL-1",scope:"CONTROLLED_FIXTURE_ONLY",originalHead:"a".repeat(40),decision:{status:"AWAITING_PO"},policy:{approved:false,canonicalMutation:false},alternatives:[]};proposal.receiptSha256=hash(proposal);
 const file=path.join(dir,"proposal.json"),ledger=path.join(dir,"ledger");fs.mkdirSync(ledger);fs.writeFileSync(file,JSON.stringify(proposal));
 server=start(root,file,ledger,0);await new Promise(resolve=>server.once("listening",resolve));
 const base="http://127.0.0.1:"+server.address().port;
 const res=await fetch(base+"/api/operational");assert.equal(res.status,200);const data=await res.json();
 assert.equal(data.schema,"ARKI-MO05-OPERATIONAL-PROJECTION-1");assert.equal(data.policy.canonicalMutation,false);
 assert.equal(data.policy.poApproval,"REQUIRED_PER_EXECUTION");assert.equal(data.views.gemelo.simulation,"NOT_EXECUTED");
 assert.equal((await fetch(base+"/api/operational",{method:"POST"})).status,404);
 }finally{if(server)await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true})}
});
