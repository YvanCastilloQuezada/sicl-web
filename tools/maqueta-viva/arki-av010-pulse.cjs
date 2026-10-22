"use strict";
/** ARKI AV-010: one opt-in operational pulse, not autonomous repair or promotion. */
const path=require("node:path"),fs=require("node:fs"),crypto=require("node:crypto");
const {run:live}=require("./arki-live-cycle.cjs");
const {run:coverage}=require("./arki-av007-coverage.cjs");
const {assess}=require("./arki-av006-diagnostic.cjs");
const {investigate}=require("./arki-av008-investigate.cjs");
const {reproduce}=require("./arki-av009-reproduce.cjs");
const sha=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function pulse(coreDir,webDir,stateDir){
 const cycle=live({coreDir:path.resolve(coreDir),webDir:path.resolve(webDir),stateDir:path.resolve(stateDir)});
 const tests=coverage(webDir);
 if(cycle.webHead!==tests.webHead)throw Error("HEAD_CHANGED_DURING_PULSE");
 const diagnosis=assess(cycle,tests),plan=investigate(diagnosis);
 const reproduction=reproduce(webDir,plan);
 if([diagnosis.webHead,plan.webHead,reproduction.webHead].some(x=>x!==cycle.webHead))throw Error("BROKEN_PROVENANCE");
 const result={schema:"ARKI-AV010-OPERATIONAL-PULSE-1",webHead:cycle.webHead,coreHead:cycle.coreHead,receipts:{cycle:cycle.receiptSha256,tests:tests.receiptSha256,diagnosis:diagnosis.receiptSha256,investigation:plan.receiptSha256,reproduction:reproduction.receiptSha256},counts:{testsPassed:diagnosis.counts.passed,testsFailed:diagnosis.counts.failed,untested:diagnosis.counts.untested,incidents:diagnosis.incidents.length,reproduced:reproduction.cases.filter(x=>x.classification==="REPRODUCED").length,unreproduced:reproduction.cases.filter(x=>x.classification==="NOT_REPRODUCED").length,inconclusive:reproduction.cases.filter(x=>x.classification==="INCONCLUSIVE").length},incidents:reproduction.cases,policy:{execution:"EXPLICIT_OPT_IN",canonicalMutation:false,repairApplied:false,autoApproval:false,architecturalCompetence:"NOT_DEMONSTRATED"}};
 result.receiptSha256=sha(result);return result;
}
module.exports={pulse};
if(require.main===module){try{if(process.argv.length!==5)throw Error("USAGE: node arki-av010-pulse.cjs CORE_DIR WEB_DIR STATE_DIR");const result=pulse(...process.argv.slice(2));process.stdout.write(JSON.stringify(result,null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV010_FAIL: "+e.message+"\n");process.exitCode=1}}
