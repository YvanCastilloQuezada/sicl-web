"use strict";
/** AV-004: explicit evidence inventory; no competence inferred. */
const {execFileSync}=require('node:child_process');
function inspect(root,reconciliation){
 if(reconciliation?.schema!=="ARKI-AV003-SOURCE-RECONCILIATION-1")throw Error('INVALID_RECONCILIATION');
 const files=new Set(execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8',timeout:15000}).split('\n'));
 const pairs=[...files].filter(p=>p.startsWith('tools/maqueta-viva/')&&p.endsWith('.test.cjs')&&files.has(p.replace('.test.cjs','.cjs'))).sort().map(test=>({source:test.replace('.test.cjs','.cjs'),test,status:'TRACKED_PAIR_NOT_EXECUTED'}));
 return {schema:'ARKI-AV004-EVIDENCE-INVENTORY-1',trackedPairs:pairs,proposals:reconciliation.items.map(x=>({id:x.id,originStatus:x.originStatus,competenceVerified:false,matchingTestEvidence:[]})),policy:{f6:'UNLOCKED_BY_PO',testsExecuted:false,canonicalMutation:false}};
}
module.exports={inspect};
