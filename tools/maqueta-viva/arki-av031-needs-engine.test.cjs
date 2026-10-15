"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");

const {
  buildNeeds
}=require("./arki-av031-needs-engine.cjs");

function fixture(){
  return {
    schema:"ARKI-AV029-DIAGNOSIS-1",
    head:"test-head",
    receiptSha256:"test-receipt",
    checks:[
      {id:"CHECK_A",status:"PASS"},
      {id:"CHECK_B",status:"FAIL",detail:"missing"}
    ],
    unknowns:[
      {id:"UNKNOWN_A",status:"UNKNOWN",reason:"not tested"},
      {id:"UNKNOWN_B",status:"UNKNOWN",reason:"no evidence"}
    ],
    policy:{
      canonicalWrite:false,
      automaticRepair:false,
      poApproval:"REQUIRED"
    }
  };
}

test("AV031 converts UNKNOWN and FAIL into needs",()=>{
  const r=buildNeeds(fixture());

  assert.equal(r.summary.total,3);
  assert.equal(r.summary.unknown,2);
  assert.equal(r.summary.failed,1);
  assert.equal(r.summary.executable,0);
});

test("AV031 generates exactly three strategies",()=>{
  const r=buildNeeds(fixture());

  for(const n of r.needs){
    assert.equal(n.strategies.length,3);

    assert.deepEqual(
      n.strategies.map(x=>x.id),
      ["A","B","C"]
    );

    assert.ok(n.strategies.every(
      x=>x.status==="HYPOTHESIS"
    ));
  }
});

test("AV031 blocks execution and propagation",()=>{
  const r=buildNeeds(fixture());

  assert.equal(r.gates.canonicalWrite,false);
  assert.equal(r.gates.automaticRepair,false);
  assert.equal(r.gates.dependencyPropagation,false);

  for(const n of r.needs){
    assert.equal(n.executionAuthorized,false);
    assert.equal(n.propagation,"BLOCKED");
    assert.equal(n.promotion,"BLOCKED");
  }
});

test("AV031 never fabricates phase mappings",()=>{
  const r=buildNeeds(fixture());

  for(const n of r.needs){
    assert.deepEqual(n.phaseMapping.phases,[]);
    assert.equal(n.phaseMapping.status,"UNRESOLVED");
    assert.equal(n.dependencies.unresolved,true);
  }
});

test("AV031 refuses unsafe diagnosis",()=>{
  const d=fixture();
  d.policy.canonicalWrite=true;

  assert.throws(
    ()=>buildNeeds(d),
    /UNSAFE_DIAGNOSIS_POLICY/
  );
});

test("AV031 refuses duplicated source IDs",()=>{
  const d=fixture();
  d.unknowns.push({
    id:"UNKNOWN_A",
    status:"UNKNOWN"
  });

  assert.throws(
    ()=>buildNeeds(d),
    /DUPLICATE_NEED_ID/
  );
});

test("AV031 rejects invalid status",()=>{
  const d=fixture();
  d.unknowns[0].status="PASS";

  assert.throws(
    ()=>buildNeeds(d),
    /UNKNOWN_STATUS_MISMATCH/
  );
});

test("AV031 deterministic receipts",()=>{
  const a=buildNeeds(fixture());
  const b=buildNeeds(fixture());

  assert.equal(a.receiptSha256,b.receiptSha256);
  assert.deepEqual(a.needs,b.needs);
});
