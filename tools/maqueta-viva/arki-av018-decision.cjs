"use strict";
/** AV-018: append-only in-memory PO decision ledger; no canonical integration rights. */
const crypto=require("node:crypto"),fs=require("node:fs");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function validate(proposal){
 if(!proposal||proposal.schema!=="ARKI-AV017-PO-PROPOSAL-1"||!proposal.receiptSha256)throw Error("INVALID_PROPOSAL");
 const {receiptSha256,...unsigned}=proposal;
 if(hash(unsigned)!==receiptSha256)throw Error("TAMPERED_PROPOSAL");
 if(proposal.decision?.status!=="AWAITING_PO"||proposal.policy?.approved!==false||proposal.policy?.canonicalMutation!==false||proposal.scope!=="CONTROLLED_FIXTURE_ONLY")throw Error("UNSAFE_PROPOSAL");
 if(!Array.isArray(proposal.alternatives)||proposal.alternatives.length!==3||new Set(proposal.alternatives.map(a=>a.id)).size!==3)throw Error("INVALID_ALTERNATIVES");
}
function record(proposal,action,selected,actor,previous=null){
 validate(proposal);
 if(!["APPROVE_EXPERIMENT","REJECT","REQUEST_INVESTIGATION"].includes(action)||typeof actor!=="string"||!/^PO:[a-zA-Z0-9_-]{1,64}$/.test(actor))throw Error("INVALID_DECISION");
 if(previous!==null){
  if(previous.schema!=="ARKI-AV018-DECISION-1"||previous.proposalReceipt!==proposal.receiptSha256||!previous.receiptSha256)throw Error("INVALID_PREVIOUS_DECISION");
  const {receiptSha256,...unsigned}=previous;
  if(hash(unsigned)!==receiptSha256)throw Error("TAMPERED_PREVIOUS_DECISION");
  throw Error("PROPOSAL_ALREADY_DECIDED");
 }
 if(action==="APPROVE_EXPERIMENT"){
  if(typeof selected!=="string"||!proposal.alternatives.some(a=>a.id===selected&&a.status==="PASS"&&a.eligibleForReview===true&&a.rollbackVerified===true))throw Error("CANDIDATE_NOT_ELIGIBLE");
 }else if(selected!==null)throw Error("UNEXPECTED_SELECTION");
 const result={schema:"ARKI-AV018-DECISION-1",proposalReceipt:proposal.receiptSha256,originalHead:proposal.originalHead,actor,action,selected:action==="APPROVE_EXPERIMENT"?selected:null,previousReceipt:null,decisionStatus:action==="APPROVE_EXPERIMENT"?"EXPERIMENT_APPROVED":action==="REJECT"?"REJECTED":"MORE_INVESTIGATION_REQUIRED",rights:{experimentalReviewOnly:true,canonicalIntegration:false,coreWrite:false,automaticPromotion:false},policy:{canonicalMutation:false,poApprovalRecorded:true}};
 result.receiptSha256=hash(result);return result;
}
module.exports={record};
if(require.main===module){try{if(process.argv.length<5||process.argv.length>6)throw Error("USAGE: node arki-av018-decision.cjs PROPOSAL_JSON ACTION ACTOR [SELECTED]");const p=process.argv[2],st=fs.lstatSync(p);if(!st.isFile()||st.isSymbolicLink()||st.size>3000000)throw Error("UNSAFE_PROPOSAL_FILE");const proposal=JSON.parse(fs.readFileSync(p,"utf8"));const action=process.argv[3],actor=process.argv[4],selected=process.argv[5]||null;process.stdout.write(JSON.stringify(record(proposal,action,selected,actor),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV018_FAIL: "+e.message+"\n");process.exitCode=1}}
