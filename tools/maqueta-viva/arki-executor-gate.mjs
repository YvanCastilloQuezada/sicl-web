#!/usr/bin/env node
/* ARKI controlled PR gate: read-only; never changes repository or GitHub. */
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import scopeModule from './arki-executor-scope.cjs';
const {scope}=scopeModule;
const REPO='YvanCastilloQuezada/sicl-web',OWNER='YvanCastilloQuezada',SHA=/^[a-f0-9]{40}$/i;
const PROTECTED=[/^\.github\//,/^docs\/arki-master-map\//,/^tools\/maqueta-viva\/arki-executor-gate\.mjs$/,/^ARKI-MAQUETA-VIVA\.cmd$/,/((^|\/)(AGENTS\.md|.*\.lock))$/i];
const TESTS=['pnpm check','pnpm test -- --run','pnpm build'];
const arg=n=>{const i=process.argv.indexOf('--'+n);return i<0?'':(process.argv[i+1]||'');};
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:8*1024*1024}).trim();
const deny=m=>{throw Error(m);};
const safe=p=>typeof p==='string'&&p.length>0&&p.length<=260&&!p.startsWith('/')&&!p.includes('\\')&&!p.split('/').some(x=>!x||x==='.'||x==='..')&&!/[\r\n\0*?\[\]]/.test(p);
const read=p=>JSON.parse(readFileSync(resolve(p),'utf8'));
function scope(manifest,head,base,changes,state){
if(manifest.schema!=='ARKI-EXECUTOR-SCOPE-1'||!/^AC-[0-9]{1,5}$/.test(manifest.caseId))deny('INVALID_CASE_OR_SCHEMA');
if(!/^F(?:10|[1-9])$/.test(manifest.phase)||manifest.repository!==REPO||manifest.baseBranch!=='feat/f7-f8-integral-closure')deny('PHASE_REPO_OR_BRANCH_INVALID');
if(!SHA.test(manifest.baseSha)||manifest.baseSha.toLowerCase()!==base||!SHA.test(head))deny('EXACT_SHA_INVALID');
const phase=state.roadmap?.phases?.find(x=>x.id===manifest.phase);
if(!phase||phase.status==='FROZEN')deny('PHASE_UNKNOWN_OR_FROZEN');
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

async function verifyGitHub(receipt,head,pr){
if(!process.env.GH_TOKEN)deny('GH_TOKEN_REQUIRED');
if(!Number.isInteger(pr)||pr<1)deny('PR_INVALID');
const api=async p=>{const r=await fetch('https://api.github.com/repos/'+REPO+'/'+p,{headers:{Authorization:'Bearer '+process.env.GH_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});if(!r.ok)deny('GITHUB_API_'+r.status);return r.json();};
const pull=await api('pulls/'+pr);
if(pull.head?.sha?.toLowerCase()!==head||pull.base?.ref!=='feat/f7-f8-integral-closure'||pull.head?.repo?.full_name!==REPO||pull.state!=='open')deny('PR_HEAD_OR_BASE_CHANGED');
const comments=await api('issues/'+pr+'/comments?per_page=100');
if(!comments.some(c=>c.user?.login===OWNER&&c.body?.trim()==='ARKI-AUTHORIZE-SHA: '+head))deny('OWNER_EXACT_SHA_AUTHORIZATION_MISSING');
receipt.ownerAuthorization='PASS_OWNER_COMMENT_EXACT_SHA';
const reviewer=String(process.env.ARKI_RED_TEAM_GITHUB_LOGIN||'').trim();
if(!reviewer||reviewer===OWNER||!/^[a-z0-9-]{1,39}$/i.test(reviewer))deny('INDEPENDENT_RED_TEAM_NOT_CONFIGURED');
const reviews=await api('pulls/'+pr+'/reviews?per_page=100');
const latest=reviews.filter(r=>r.user?.login===reviewer&&r.commit_id?.toLowerCase()===head).sort((a,b)=>Date.parse(b.submitted_at||0)-Date.parse(a.submitted_at||0))[0];
if(latest?.state!=='APPROVED')deny('RED_TEAM_EXACT_SHA_REVIEW_MISSING');
receipt.redTeam='PASS_INDEPENDENT_GITHUB_REVIEW_'+reviewer;
receipt.acceptance='AWAITING_TESTS_AND_MANUAL_DECISION';
return receipt;
}
async function main(){
const head=arg('head').toLowerCase(),base=arg('base').toLowerCase();
if(!SHA.test(head)||!SHA.test(base)||git('rev-parse','HEAD').toLowerCase()!==head||git('rev-parse','--verify',base+'^{commit}').toLowerCase()!==base)deny('SHA_OR_CHECKOUT_MISMATCH');
const lines=git('diff','--name-status','--no-renames',base+'...'+head,'--').split('\n').filter(Boolean);
const changed=lines.map(line=>{const [status,path]=line.split('\t');return {status,path};});
let receipt=scope(read(arg('manifest')||'tools/maqueta-viva/executor-scope.json'),head,base,changed,read('docs/arki-master-map/ARKI_MASTER_MAP_STATE.json'));
if(arg('pr'))receipt=await verifyGitHub(receipt,head,Number(arg('pr')));
if(arg('receipt'))writeFileSync(resolve(arg('receipt')),JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
}
main().catch(e=>{process.stderr.write('ARKI_EXECUTOR_BLOCKED: '+e.message+'\n');process.exitCode=1;});
