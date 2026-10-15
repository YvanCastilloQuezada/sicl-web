"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const path=require("node:path");
const fs=require("node:fs");
const http=require("node:http");

const root=path.resolve(__dirname,"../..");

const {
  publicNeeds,script
}=require("./arki-av032-needs-bridge.cjs");

const {
  page,start
}=require("./arki-av023-historical-ui.cjs");

const proposal=path.join(
  process.env.HOME,
  "ARKI/continuity/arki-av017-proposal.json"
);

const ledger=path.join(
  process.env.HOME,
  "ARKI/continuity/arki-po-ledger"
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
    req.on("timeout",()=>{
      req.destroy(Error("REQUEST_TIMEOUT"));
    });
    req.end();
  });
}

test("AV032 exposes current research needs",()=>{
  const r=publicNeeds(root);

  assert.equal(r.schema,"ARKI-AV032-PUBLIC-NEEDS-1");
  assert.equal(
    r.summary.total,
    r.needs.length
  );
  assert.ok(r.summary.total>=4);
  assert.equal(
    r.summary.unknown,
    r.needs.filter(
      n=>n.sourceType==="UNKNOWN"
    ).length
  );
  assert.equal(r.summary.executable,0);

  assert.equal(r.gates.canonicalWrite,false);
  assert.equal(r.gates.dependencyPropagation,false);

  for(const n of r.needs){
    assert.equal(n.strategies.length,3);
    assert.equal(n.executionAuthorized,false);
    assert.equal(n.propagation,"BLOCKED");
    assert.equal(n.phaseMapping.status,"UNRESOLVED");
  }
});

test("AV032 embeds panel without replacing HTML",()=>{
  const html=page(root);

  assert.match(html,/arki-av023-evidence/);
  assert.match(html,/arki-av029-bridge/);
  assert.match(html,/arki-av032-bridge/);

  assert.match(script,/api\/needs/);
  assert.doesNotMatch(script,/<button/i);
});

test("AV032 serves GET-only HTTP endpoints",async()=>{
  assert.ok(
    fs.existsSync(proposal),
    "REQUIRED_PROPOSAL_MISSING"
  );
  assert.ok(
    fs.existsSync(ledger),
    "REQUIRED_LEDGER_MISSING"
  );

  const server=start(root,proposal,ledger,0);

  try{
    if(!server.listening){
      await new Promise((resolve,reject)=>{
        server.once("listening",resolve);
        server.once("error",reject);
      });
    }

    const port=server.address().port;

    const response=await request(
      port,"/api/needs"
    );

    assert.equal(response.status,200);

    const data=JSON.parse(response.body);

    assert.equal(
      data.schema,"ARKI-AV032-PUBLIC-NEEDS-1"
    );
    assert.equal(
      data.summary.total,
      data.needs.length
    );
    assert.ok(data.summary.total>=4);

    const denied=await request(
      port,"/api/needs","POST"
    );

    assert.equal(denied.status,404);

    const tree=await request(port,"/api/tree");
    assert.equal(tree.status,200);

    const diagnosis=await request(
      port,"/api/diagnosis"
    );
    assert.equal(diagnosis.status,200);

    const html=await request(port,"/");
    assert.equal(html.status,200);
    assert.match(html.body,/arki-av032-bridge/);

  }finally{
    await new Promise((resolve,reject)=>{
      server.close(error=>
        error?reject(error):resolve()
      );
    });
  }
});
