import {loadRegistry} from './registry.js';import {graph,plan,simulate} from './engine.js';
const args=process.argv.slice(2);const cmd=args[0]??'help';const file=args[1]??'examples/capabilities.json';
try{if(cmd==='inspect'){console.log(JSON.stringify(graph(loadRegistry(file)),null,2));}
else if(cmd==='plan'){if(!args[2])throw Error('Usage: plan registry.json CAPABILITY_ID');console.log(JSON.stringify(plan(loadRegistry(file),args[2]),null,2));}
else if(cmd==='demo'){const r=loadRegistry(file);const g=graph(r);console.log('DEPENDENCIES',JSON.stringify(g));for(const c of r.capabilities){const p=plan(r,c.id);console.log(JSON.stringify({proposal:p,experiments:p.options.map(o=>simulate(p,o.id))},null,2));}}
else{console.log('Usage: node dist/src/cli.js inspect [registry.json] | plan registry.json ID | demo [registry.json]');}}
catch(e){console.error(e instanceof Error?e.message:String(e));process.exitCode=1;}
