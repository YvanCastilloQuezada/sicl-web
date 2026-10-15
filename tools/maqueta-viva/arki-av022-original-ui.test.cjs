"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const {integrate,hydrate,start}=require("./arki-av022-original-ui.cjs");
const {append}=require("./arki-av019-ledger.cjs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
const original=path.join(__dirname,"maqueta-viva.template.html");
test("AV-022 preserves original frontend and inserts only read-only sync",()=>{const source=fs.readFileSync(original,"utf8");const result=integrate(source);assert.ok(result.includes("function arkiDecisionDocket("));assert.ok(result.includes("function av020ObservationPanel()"));assert.ok(result.includes("av022Update"));assert.ok(result.length>source.length);assert.equal(result.split("av022Update=async").length,2)});
test("AV-022 fails closed on incompatible original template",()=>assert.throws(()=>integrate("<html></html>"),/UNSUPPORTED_ORIGINAL_TEMPLATE/));
test("AV-022 serves original UI and same-origin evidence with no write routes",async()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),"arki-av022-"));let server;try{
 const proposal={schema:"ARKI-AV017-PO-PROPOSAL-1",scope:"CONTROLLED_FIXTURE_ONLY",originalHead:"a".repeat(40),decision:{status:"AWAITING_PO"},policy:{approved:false,canonicalMutation:false},alternatives:[{id:"A",status:"PASS",eligibleForReview:true,rollbackVerified:true},{id:"B",status:"FAIL",eligibleForReview:false,rollbackVerified:true},{id:"C",status:"PASS",eligibleForReview:true,rollbackVerified:true}]};proposal.receiptSha256=hash(proposal);
 const file=path.join(dir,"proposal.json"),ledger=path.join(dir,"ledger");fs.mkdirSync(ledger);fs.writeFileSync(file,JSON.stringify(proposal));server=start(original,file,ledger,0);await new Promise(resolve=>server.once("listening",resolve));const base="http://127.0.0.1:"+server.address().port;
 const page=await fetch(base+"/");assert.equal(page.status,200);assert.match(await page.text(),/av022Update/);
 let response=await fetch(base+"/api/tree");assert.equal((await response.json()).decision.status,"AWAITING_PO");
 append(ledger,proposal,"REQUEST_INVESTIGATION",null,"PO:owner");response=await fetch(base+"/api/tree");assert.equal((await response.json()).decision.status,"MORE_INVESTIGATION_REQUIRED");
 response=await fetch(base+"/api/tree",{method:"POST"});assert.equal(response.status,404);
 }finally{if(server)await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true})}});

test("AV-022 hydrates both original state placeholders with real repository JSON",()=>{
 const template=fs.readFileSync(original,"utf8");
 const page=hydrate(integrate(template),path.resolve(__dirname,"../.."));
 assert.ok(!page.includes("__ARKI_STATE_JSON__"));
 assert.ok(!page.includes("__ARKI_ASSEMBLY_JSON__"));
 const extract=(id)=>{const prefix='<script type="application/json" id="'+id+'">';const begin=page.indexOf(prefix);assert.ok(begin>=0,"missing "+id);const finish=page.indexOf("</script>",begin+prefix.length);assert.ok(finish>begin,"unterminated "+id);return page.slice(begin+prefix.length,finish);};
 const state=[null,extract("arki-state")];
 const assembly=[null,extract("arki-assembly")];
 assert.ok(state);assert.ok(assembly);
 assert.ok(Array.isArray(JSON.parse(state[1]).roadmap.phases));
 assert.equal(JSON.parse(assembly[1]).schema,"ARKI-MAQUETA-ASSEMBLY-REGISTRY-0.1");
});
