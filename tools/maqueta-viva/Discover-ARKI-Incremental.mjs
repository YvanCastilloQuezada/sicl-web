#!/usr/bin/env node
// ARKI Maqueta Viva: read-only incremental discovery, never canonical promotion.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,relative} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(import.meta.dirname,'../..');
const inputs=['docs/arki-master-map/ARKI_MASTER_MAP_STATE.json','tools/maqueta-viva/assembly-registry.json','docs/arki-master-map/ARKI_TEN_PHASE_PRODUCT_INTEGRATION_ROADMAP_V1.md'];
const sha=x=>createHash('sha256').update(x).digest('hex');
const arg=k=>{const i=process.argv.indexOf('--'+k);return i<0?null:process.argv[i+1]};
const out=arg('out'),previous=arg('previous');
if(!out)throw Error('Missing --out (write outside canonical source files)');
const dest=resolve(out);
if(inputs.some(p=>resolve(root,p)===dest))throw Error('Canonical input is immutable');
const prior=previous&&existsSync(resolve(previous))?JSON.parse(readFileSync(resolve(previous),'utf8')):null;
if(prior&&(prior.schema!=='ARKI-DISCOVERY-1'||!Array.isArray(prior.sources)))throw Error('INVALID_PREVIOUS_MANIFEST');
const old=new Map((prior?.sources||[]).map(s=>[s.path,s]));
const sources=[],events=[],unknowns=[];
for(const path of inputs){
 const full=resolve(root,path);
 if(!existsSync(full)){unknowns.push({path,reason:'SOURCE_MISSING'});continue}
 const content=readFileSync(full),hash=sha(content),before=old.get(path);
 sources.push({path,sha256:hash,bytes:content.length});
 if(!before)events.push({type:'ADDED',path,after:hash,authority:'OBSERVATION_ONLY'});
 else if(before.sha256!==hash)events.push({type:'MODIFIED',path,before:before.sha256,after:hash,authority:'OBSERVATION_ONLY'});
}
for(const [path,oldSource] of old)if(!sources.some(s=>s.path===path))events.push({type:'REMOVED_FROM_SOURCE',path,before:oldSource.sha256,authority:'REVIEW_REQUIRED'});
let gitHead=null;
try{gitHead=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim()}catch{unknowns.push({reason:'GIT_HEAD_UNAVAILABLE'})}
const report={schema:'ARKI-DISCOVERY-1',gitHead,sources,events,unknowns,status:unknowns.length?'SYNC_PARTIAL':'OBSERVED',canonicalPromotion:false};
writeFileSync(dest,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,events:events.length,unknowns:unknowns.length,gitHead}));
