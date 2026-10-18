import {readFileSync} from 'node:fs';
import {criticalPath} from './criticalPath.js';
import type {Activity,Goal} from './criticalPath.js';
const file=process.argv[2]??'examples/roadmap.json';
try {
 const data=JSON.parse(readFileSync(file,'utf8')) as {goal:Goal;activities:Activity[]};
 console.log(JSON.stringify(criticalPath(data.goal,data.activities),null,2));
} catch(error) { console.error(error instanceof Error?error.message:String(error)); process.exitCode=1; }
