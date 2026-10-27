"use strict";
/** ACE88 Web-side preflight adapter. Never authorizes or promotes.
 * Core is the only trust anchor. This module is intentionally transport-free.
 */
const CONTRACT="ARKI_HUMAN_APPROVAL_V2";
const ACTION="DEVELOPER_PROPOSAL_APPROVE";
const fields=["contract","action","projectId","proposalId","fingerprint","actorId","reviewId","keyId","decision","issuedAt","expiresAt","nonce"];
function nonempty(x){return typeof x==="string"&&x.trim().length>0}
function reject(reason){return {status:"BLOCKED",reason,authorized:false,canonicalMutation:false}}
function prepareAce88Request({proposal,proof,gate}={}){
 if(!proposal||!["projectId","proposalId","fingerprint","reviewId"].every(k=>nonempty(proposal[k])))return reject("PROPOSAL_BINDING_REQUIRED");
 if(!/^[0-9a-f]{64}$/.test(proposal.fingerprint))return reject("INVALID_PROPOSAL_FINGERPRINT");
 if(!gate||gate.tests!=="PASS"||gate.dependencies!=="PASS"||gate.frozen!=="PASS"||gate.evidence!=="PASS")return reject("PRECONDITIONS_NOT_VERIFIED");
 if(!proof||!proof.payload||!nonempty(proof.signature_b64))return reject("SIGNED_AUTHORITY_PROOF_REQUIRED");
 const p=proof.payload;
 if(typeof p!=="object"||Array.isArray(p)||Object.keys(p).length!==fields.length||fields.some(k=>!Object.hasOwn(p,k)))return reject("INVALID_AUTHORITY_FIELDS");
 if(p.contract!==CONTRACT||p.action!==ACTION||p.decision!=="APPROVED")return reject("INVALID_AUTHORITY_SCOPE");
 if(p.projectId!==proposal.projectId||p.proposalId!==proposal.proposalId||p.fingerprint!==proposal.fingerprint||p.reviewId!==proposal.reviewId)return reject("AUTHORITY_BINDING_MISMATCH");
 if(["actorId","keyId","nonce"].some(k=>!nonempty(p[k])))return reject("INVALID_AUTHORITY_IDENTITY");
 if(!nonempty(p.issuedAt)||!nonempty(p.expiresAt))return reject("INVALID_AUTHORITY_TIME");
 const issued=Date.parse(p.issuedAt),expires=Date.parse(p.expiresAt),now=Date.now();
 if(!Number.isFinite(issued)||!Number.isFinite(expires)||issued>now||expires<=now||expires<=issued||expires-issued>300000)return reject("AUTHORITY_EXPIRED_OR_INVALID");
 if(!/^[A-Za-z0-9+/]+={0,2}$/.test(proof.signature_b64))return reject("INVALID_SIGNATURE_ENCODING");
 return {status:"READY_FOR_CORE_VERIFICATION",authorized:false,canonicalMutation:false,coreVerification:"REQUIRED",request:{project_id:proposal.projectId,proposal_id:proposal.proposalId,proposal_fingerprint:proposal.fingerprint,human_review_id:proposal.reviewId,approval_payload:{...p},approval_signature_b64:proof.signature_b64}};
}
module.exports={prepareAce88Request,CONTRACT,ACTION};
