"use strict";
/** ACE88 transport adapter. Core alone verifies signature and performs promotion.
 * Injectable transport makes offline tests possible without network or secrets.
 */
const {prepareAce88Request}=require("./arki-ace88-preflight-adapter.cjs");
function blocked(reason){return {status:"BLOCKED",reason,authorized:false,canonicalMutation:false}}
async function requestAce88Promotion({proposal,proof,gate,transport,serviceToken,timeoutMs=5000}={}){
 const preflight=prepareAce88Request({proposal,proof,gate});
 if(preflight.status!=="READY_FOR_CORE_VERIFICATION")return preflight;
 if(typeof transport!=="function"||typeof serviceToken!=="string"||!serviceToken.trim())return blocked("CORE_TRANSPORT_NOT_CONFIGURED");
 if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>30000)return blocked("INVALID_TIMEOUT");
 const project=encodeURIComponent(proposal.projectId);
 const path="/v1/projects/"+project+"/developer-promotions";
 let response;
 try{
  response=await transport({method:"POST",path,headers:{"Authorization":"Bearer "+serviceToken,"Content-Type":"application/json"},body:preflight.request,timeoutMs});
 }catch{return blocked("CORE_UNAVAILABLE")}
 if(!response||response.statusCode!==200||!response.body||response.body.status!=="OK"||response.body.code!=="OK")return blocked("CORE_REJECTED_OR_UNKNOWN");
 const data=response.body.data;
 if(!data||data.status!=="COMMITTED"||data.proposal_id!==proposal.proposalId||typeof data.snapshot_id!=="string"||!data.snapshot_id||!Number.isInteger(data.d2_version)||data.d2_version<1)return blocked("CORE_RECEIPT_INVALID");
 if(data.effects_status!=="COMPLETE")return {status:"CORE_COMMITTED_EFFECTS_UNVERIFIED",authorized:false,canonicalMutation:false,coreCommitObserved:true,reason:"EFFECTS_NOT_COMPLETE",snapshotId:data.snapshot_id,d2Version:data.d2_version};
 return {status:"CORE_COMMITTED_REQUIRES_INDEPENDENT_VERIFICATION",authorized:false,canonicalMutation:false,coreCommitObserved:true,snapshotId:data.snapshot_id,d2Version:data.d2_version};
}
module.exports={requestAce88Promotion};
