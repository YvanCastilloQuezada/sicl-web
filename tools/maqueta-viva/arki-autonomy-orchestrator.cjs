"use strict";
// Bounded autonomous planning. Never executes code or promotes canonical state.
const crypto = require("node:crypto");
const {planAssembly} = require("./arki-assembly-planner.cjs");
const {proposeStrategies} = require("./arki-assembly-strategies.cjs");
const PHASES = new Set(Array.from({length:10},(_,i)=>"F"+(i+1)));
const SORT = (a,b)=>a.id.localeCompare(b.id);
function orchestrate({parts,discovery,phaseRules={},evidence={}}) {
  if (!Array.isArray(parts) || !discovery || typeof evidence!=="object" || !evidence || Array.isArray(evidence)) throw Error("INVALID_INPUT");
  const plan=planAssembly(parts,phaseRules);
  const strategies=proposeStrategies(discovery);
  const work=plan.parts.map(p=>{
    const ev=evidence[p.id];
    const valid=ev && ev.verified===true && /^[0-9a-f]{40}$/.test(ev.commit||"") &&
      typeof ev.testReceipt==="string" && ev.testReceipt.length>0 &&
      typeof ev.source==="string" && ev.source.length>0;
    const phaseValid=PHASES.has(p.proposedPhase) && !p.reasons.includes("PHASE_CONFLICT");
    const frozen=p.reasons.includes("FROZEN_READ_ONLY");
    const blocked=p.status!=="PROPOSED" || !valid || !phaseValid || frozen || p.reasons.length>0;
    return {id:p.id,proposedPhase:p.proposedPhase,action:blocked?"EVIDENCE_OR_AUTHORITY_REVIEW":"ISOLATED_EXPERIMENT_CANDIDATE",
      reasons:[...p.reasons,...(!valid?["UNVERIFIED_EVIDENCE"]:[])],execution:"NOT_EXECUTED",
      canonicalMutation:false,ownerGate:"REQUIRED_FOR_PROMOTION"};
  }).sort(SORT);
  const digest=crypto.createHash("sha256").update(JSON.stringify({work,issues:plan.issues,strategies:strategies.strategies.map(s=>s.id)})).digest("hex");
  return {schema:"ARKI-AUTONOMY-ORCHESTRATOR-0.1",mode:"PLAN_ONLY",digest,work,issues:plan.issues,
    strategies:strategies.strategies,execution:"NOT_EXECUTED",canonicalMutation:false,
    authority:"HUMAN_REQUIRED_FOR_CANONICAL_PROMOTION",memoryWrite:"NOT_PERFORMED"};
}
module.exports={orchestrate};