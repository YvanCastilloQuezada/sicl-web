"use strict";
const {validateF6Revocation}=require("./arki-f6-revocation.cjs");
const REPO='YvanCastilloQuezada/sicl-web',OWNER='YvanCastilloQuezada',SHA=/^[a-f0-9]{40}$/i;
const PROTECTED=[/^\.github\//,/^docs\/arki-master-map\//,/^tools\/maqueta-viva\/arki-executor-gate\.mjs$/,/^ARKI-MAQUETA-VIVA\.cmd$/,/((^|\/)(AGENTS\.md|.*\.lock))$/i];
const TESTS=['pnpm check','pnpm test -- --run','pnpm build'];
const safe=p=>typeof p==='string'&&p.length>0&&p.length<=260&&!p.startsWith('/')&&!p.includes('\\')&&!p.split('/').some(x=>!x||x==='.'||x==='..')&&!/[\r\n\0*?\[\]]/.test(p);
const deny=m=>{throw Error(m);};
function scope(manifest,head,base,changes,state){
if(manifest.schema!=='ARKI-EXECUTOR-SCOPE-1'||!/^AC-[0-9]{1,5}$/.test(manifest.caseId))deny('INVALID_CASE_OR_SCHEMA');
if(!/^F(?:10|[1-9])$/.test(manifest.phase)||manifest.repository!==REPO||manifest.baseBranch!=='feat/f7-f8-integral-closure')deny('PHASE_REPO_OR_BRANCH_INVALID');
if(!SHA.test(manifest.baseSha)||manifest.baseSha.toLowerCase()!==base||!SHA.test(head))deny('EXACT_SHA_INVALID');
const phase=state.roadmap?.phases?.find(x=>x.id===manifest.phase);
if(!phase||phase.status==='FROZEN')
 deny('PHASE_UNKNOWN_OR_FROZEN');
if(manifest.phase==='F6'){
 validateF6Revocation(state.f6_freeze_revocation);
 deny('F6_PO_REVOCATION_RECONCILIATION_REQUIRED');
}
if(phase.status==='UNKNOWN'||
   phase.status==='RECONCILIATION_REQUIRED')
 deny('PHASE_NOT_RECONCILED');
if(!Array.isArray(manifest.allowedPaths)||manifest.allowedPaths.length<1||manifest.allowedPaths.length>12||new Set(manifest.allowedPaths).size!==manifest.allowedPaths.length)deny('ALLOWLIST_INVALID');
if(!manifest.allowedPaths.every(safe)||manifest.allowedPaths.some(p=>PROTECTED.some(r=>r.test(p))))deny('PROTECTED_ALLOWLIST');
if(!Array.isArray(changes)||changes.length<2||changes.length>13)deny('DIFF_INVALID');
if(!changes.some(c=>c.path==='tools/maqueta-viva/executor-scope.json'&&c.status==='A'))deny('MANIFEST_MUST_BE_ADDED');
const allowed=new Set([...manifest.allowedPaths,'tools/maqueta-viva/executor-scope.json']);
for(const c of changes)if(!c||!['A','M'].includes(c.status)||!safe(c.path)||!allowed.has(c.path)||PROTECTED.some(r=>r.test(c.path)))deny('SCOPE_DENIED:'+String(c?.path));
if(manifest.noCanonicalPromotion!==true||manifest.requiresRedTeam!==true||manifest.requiresOwnerAuthorization!==true)deny('MANDATORY_GATES_MISSING');
if(manifest.testCommands!==undefined&&JSON.stringify(manifest.testCommands)!==JSON.stringify(TESTS))deny('TESTS_NOT_FIXED');
return {caseId:manifest.caseId,phase:manifest.phase,phaseStatus:phase.status,headSha:head,baseSha:base,changedFiles:changes,scope:'PASS',tests:TESTS,ownerAuthorization:'NOT_VERIFIED',redTeam:'NOT_VERIFIED',acceptance:'BLOCKED'};
}
module.exports={scope};
