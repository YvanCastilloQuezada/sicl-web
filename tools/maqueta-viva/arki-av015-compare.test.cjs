"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict");
const {compare}=require("./arki-av015-compare.cjs");
const incident={schema:"ARKI-AV014-CONTROLLED-INCIDENT-1",baseline:"FAIL",diagnosticIncidents:1,reproduction:"REPRODUCED",dossiers:1,originalHead:"a".repeat(40),receipts:{dossier:"d"},policy:{canonicalMutation:false,repairApplied:false}};
const experiment={schema:"ARKI-AV012-REPAIR-EXPERIMENT-1",scope:"CONTROLLED_FIXTURE_ONLY",baseline:{status:"FAIL"},receiptSha256:"x",policy:{canonicalMutation:false,repairPromoted:false},candidates:[{id:"A",status:"PASS",rollbackVerified:true,canonicalMutation:false},{id:"B",status:"FAIL",rollbackVerified:true,canonicalMutation:false},{id:"C",status:"PASS",rollbackVerified:true,canonicalMutation:false}]};
test("AV-015 compares but never claims same-incident repair",()=>{const r=compare(incident,experiment);assert.equal(r.summary.passing,2);assert.equal(r.summary.selected,null);assert.equal(r.sameIncidentPatchDemonstrated,false)});
test("AV-015 rejects unverified rollback",()=>assert.throws(()=>compare(incident,{...experiment,candidates:[{...experiment.candidates[0],rollbackVerified:false},...experiment.candidates.slice(1)]})));
test("AV-015 rejects unconfirmed incident",()=>assert.throws(()=>compare({...incident,reproduction:"NOT_REPRODUCED"},experiment)));
