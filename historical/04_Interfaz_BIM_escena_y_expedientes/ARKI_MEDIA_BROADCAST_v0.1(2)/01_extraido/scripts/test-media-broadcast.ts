import assert from "node:assert/strict";
import {createPerformancePlan} from "../shared/avatar/performancePlanner";
import {reviewDistribution} from "../shared/broadcast/gate";

const speech=[{id:"s1",language:"es" as const,text:"Importante: esta cifra requiere verificación.",claims:[{claimId:"c1",text:"x",state:"UNKNOWN" as const,provenanceIds:[]}]}];
const p=createPerformancePlan("p1",speech,"rev-1");
assert.equal(p.canMutateProjectState,false);
assert.equal(p.gestures[0].kind,"CAUTION");
assert.equal(p.visemes.length,0);

const d=reviewDistribution({
 requestId:"d1",
 master:{masterId:"m1",mode:"REALTIME",video:{codec:"H264",width:1920,height:1080,fps:30,bitrateKbps:6000},audio:[],captions:[],provenanceIds:[],humanApprovedForDistribution:false},
 targets:["PREVIEW","OTT_HLS"],territories:["PE"],rightsReferenceIds:[],requestedBy:"test"
});
assert.equal(d.published,false);
assert.equal(d.allowedTargets.length,0);
assert.ok(d.blockedTargets.some(x=>x.target==="OTT_HLS"));
console.log("ARKI_MEDIA_BROADCAST_STARTER=PASS");
console.log("PUBLISHED=false");
console.log("CAN_MUTATE_PROJECT_STATE=false");
