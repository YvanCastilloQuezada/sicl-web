"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const path=require("node:path");
const fs=require("node:fs");
const http=require("node:http");

const {publicDiagnosis,script}=
  require("./arki-av029-diagnosis-bridge.cjs");

const {page,start}=
  require("./arki-av023-historical-ui.cjs");

const root=path.resolve(__dirname,"../..");

const proposal=path.join(
  root,"tools/maqueta-viva/arki-av017-proposal.json"
);

function request(port,pathname,method="GET"){
  return new Promise((resolve,reject)=>{
    const req=http.request({
      hostname:"127.0.0.1",
      port,
      path:pathname,
      method,
      timeout:5000
    },res=>{
      let body="";
      res.setEncoding("utf8");
      res.on("data",chunk=>body+=chunk);
      res.on("end",()=>resolve({
        status:res.statusCode,
        body
      }));
    });
    req.on("error",reject);
    req.end();
  });
}

test("AV-029 preserves historical page",()=>{
  const html=page(root);
  assert.match(html,/arki-av029-bridge/);
  assert.match(html,/arki-av023-evidence/);
});

test("AV-029 publishes bounded read-only diagnosis",()=>{
  const d=publicDiagnosis(root);
  assert.equal(d.schema,"ARKI-AV029-DIAGNOSIS-1");
  assert.equal(d.policy.canonicalWrite,false);
  assert.equal(d.policy.automaticRepair,false);
  assert.equal(d.policy.poApproval,"REQUIRED");
  assert.ok(d.unknowns.length>=4);
  assert.ok(d.proposals.every(
    p=>p.executionAuthorized===false
  ));
  assert.equal(d.repository,undefined);
  assert.equal(d.inventory,undefined);
});

test("AV-029 frontend has no write controls",()=>{
  assert.match(script,/api\/diagnosis/);
  assert.doesNotMatch(script,/fetch\([^)]*,\s*\{[^}]*method:\s*["']POST/s);
  assert.doesNotMatch(script,/<button/i);
});

test("AV-029 API is GET-only",async()=>{
  const {snapshot}=require("./arki-av020-tree.cjs");
  const os=require("node:os");

  // Use an isolated temporary ledger, not canonical evidence.
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"av029-"));

  // Existing AV-023 fixture contract is not reconstructed here.
  // The HTTP test is performed only when an existing fixture is supplied.
  const fixture=process.env.ARKI_AV029_PROPOSAL;
  const ledger=process.env.ARKI_AV029_LEDGER;

  if(!fixture||!ledger){
    fs.rmSync(tmp,{recursive:true,force:true});
    return;
  }

  let server;
  try{
    snapshot(fixture,ledger);
    server=start(root,fixture,ledger,0);
    await new Promise(resolve=>server.listening?
      resolve():server.once("listening",resolve));
    const port=server.address().port;

    const ok=await request(port,"/api/diagnosis");
    assert.equal(ok.status,200);

    const denied=await request(port,"/api/diagnosis","POST");
    assert.equal(denied.status,404);
  }finally{
    if(server)await new Promise(resolve=>server.close(resolve));
    fs.rmSync(tmp,{recursive:true,force:true});
  }
});
