"use strict";
/** MO-07.1: evidence-first inventory audit. File presence is not behavioral verification. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const hash=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");
function audit(registry,root){
 if(!registry||!Array.isArray(registry.ideas)||!Array.isArray(registry.components))throw Error("INVALID_REGISTRY");
 const all=[...registry.ideas.map(x=>({...x,kind:"IDEA"})),...registry.components.map(x=>({...x,kind:"COMPONENT"}))];
 const seen=new Set();
 const pieces=all.map(x=>{
  if(!x.id||seen.has(x.id))throw Error("INVALID_OR_DUPLICATE_ID");seen.add(x.id);
  const refs=[...String(x.sourceEvidence||"").matchAll(/`([^`]+)`/g)].map(m=>m[1]);
  const candidates=refs.map(ref=>{
   const file=ref.replace(/:\d+(?:[-,]\d+)*.*$/,"").trim();
   const resolved=path.resolve(root,file);
   const inside=resolved.startsWith(path.resolve(root)+path.sep);
   return {reference:ref,file,status:!inside?"UNSAFE_REFERENCE":fs.existsSync(resolved)?"PATH_PRESENT_NOT_BEHAVIOR_VERIFIED":"PATH_NOT_FOUND"};
  });
  const purpose=String(x.purpose||"").trim();
  const gap=String(x.sourceGap||"").trim();
  const missing=[];
  if(!purpose)missing.push("PURPOSE_NOT_DOCUMENTED");
  if(!x.sourceEvidence)missing.push("CURRENT_CODE_EVIDENCE_NOT_PROVIDED");
  if(!Array.isArray(x.dependencies))missing.push("DEPENDENCIES_UNDECLARED");
  if(!/^F(?:10|[1-9])$/.test(x.targetPhase||""))missing.push("PHASE_UNASSIGNED");
  if(candidates.some(c=>c.status==="PATH_NOT_FOUND"))missing.push("HISTORICAL_PATH_NOT_FOUND");
  return {id:x.id,kind:x.kind,name:x.title||null,purpose:purpose||null,historicalPhase:x.targetPhase||null,
   historicalStatus:x.sourceStatus||null,descriptionBasis:x.purposeBasis||null,
   historicalCodeReferences:candidates,knownGap:gap||null,declaredDependencies:x.dependencies||null,
   missingEvidence:missing,namePurposeConsistency:"NOT_SEMANTICALLY_VERIFIED",
   codeBehavior:"NOT_EXECUTED_OR_VERIFIED",phaseDecision:"HOLD_HISTORICAL_PROPOSAL",
   predecessorDecision:"UNKNOWN_UNLESS_VERIFIED",nextAction:missing.length?"RECOVER_AND_VALIDATE_EVIDENCE":"VERIFY_BEHAVIOR_AND_SEMANTICS"};
 });
 const result={schema:"ARKI-MO071-EVIDENCE-FIRST-INVENTORY-1",counts:{ideas:registry.ideas.length,components:registry.components.length,total:pieces.length,missingPurpose:pieces.filter(p=>!p.purpose).length,undeclaredDependencies:pieces.filter(p=>p.missingEvidence.includes("DEPENDENCIES_UNDECLARED")).length},
  pieces,policy:{fileExistsDoesNotProveBehavior:true,nameMatchNotInferred:true,phaseNotPromoted:true,dependenciesNotInvented:true,canonicalMutation:false,poApproval:"REQUIRED"}};
 result.receiptSha256=hash(result);return result;
}
module.exports={audit};
if(require.main===module){const registry=JSON.parse(fs.readFileSync(path.join(__dirname,"assembly-registry.json"),"utf8"));process.stdout.write(JSON.stringify(audit(registry,path.resolve(__dirname,"../..")),null,2)+"\n")}
