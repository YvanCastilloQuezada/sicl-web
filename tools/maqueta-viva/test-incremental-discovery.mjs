#!/usr/bin/env node
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const folder=mkdtempSync(join(tmpdir(),'arki-discovery-'));
const script=new URL('./Discover-ARKI-Incremental.mjs',import.meta.url).pathname;
const run=args=>execFileSync(process.execPath,[script,...args],{encoding:'utf8'});
try{
 const a=join(folder,'a.json'),b=join(folder,'b.json');
 run(['--out',a]);const first=JSON.parse(readFileSync(a));
 assert.equal(first.schema,'ARKI-DISCOVERY-1');assert.equal(first.canonicalPromotion,false);
 assert(first.sources.length>=2);
 run(['--previous',a,'--out',b]);const second=JSON.parse(readFileSync(b));
 assert.equal(second.events.length,0,'unchanged inputs must be idempotent');
 assert.deepEqual(first.sources,second.sources);
 console.log('ARKI_DISCOVERY_SMOKE=PASS');
}finally{rmSync(folder,{recursive:true,force:true})}
