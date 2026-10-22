"use strict";
/* ARKI experimental advisory task ordering. No execution or canonical writes. */
function planTasks(registry, options = {}) {
  const ideas = Array.isArray(registry?.ideas) ? registry.ideas : [];
  const byId = new Map(ideas.map(i => [i.id, i]));
  const explicit = options.dependencies || {};
  const completed = new Set(options.completed || []);
  const tasks = ideas.filter(i => i && /^I-[0-9]+$/.test(i.id) && i.sourceStatus !== "RESEARCH_ONLY_OUT_OF_SCOPE");
  const tasksById = new Map(tasks.map(i => [i.id, i]));
  const out = tasks.map(i => {
    const deps = explicit[i.id];
    const hasDeclaredDeps = Array.isArray(deps);
    const valid = hasDeclaredDeps && deps.every(d => typeof d === "string" && d !== i.id && tasksById.has(d));
    const pending = valid ? deps.filter(d => !completed.has(d)) : [];
    const frozen = i.placement === "FROZEN" || i.sourceStatus === "FROZEN";
    const status = frozen ? "FROZEN_NO_MUTATION" : !hasDeclaredDeps ? "DEPENDENCIES_UNKNOWN" : !valid ? "INVALID_DEPENDENCY" : pending.length ? "BLOCKED_BY_DEPENDENCY" : "REVIEW_CANDIDATE";
    const phase = /^F(?:10|[1-9])$/.test(i.targetPhase || "") ? Number(i.targetPhase.slice(1)) : null;
    return {id:i.id,title:i.title,targetPhase:i.targetPhase,sourceStatus:i.sourceStatus,dependencies:hasDeclaredDeps ? [...deps] : null,pending,status,reason:status==="REVIEW_CANDIDATE"?"Declared dependencies completed; requires human review":status==="DEPENDENCIES_UNKNOWN"?"No verified task dependency graph supplied":status==="BLOCKED_BY_DEPENDENCY"?"Pending prerequisites: "+pending.join(", "):status,phase,canonicalMutation:false};
  });
  const candidates = out.filter(x=>x.status==="REVIEW_CANDIDATE").sort((a,b)=>(a.phase??99)-(b.phase??99)||a.id.localeCompare(b.id));
  return {schema:"ARKI-ADVISORY-TASK-PLAN-001",status:"EXPERIMENTAL_ADVISORY_ONLY",orderedCandidates:candidates.map(x=>x.id),tasks:out,criticalPath:"UNKNOWN_UNVERIFIED_DEPENDENCIES",execution:"BLOCKED",promotion:"BLOCKED",canonicalMutation:false};
}
if(typeof module!=="undefined")module.exports={planTasks};
