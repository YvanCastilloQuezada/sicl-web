/** ARKI deterministic critical-path planner. READ-ONLY: no canonical mutations. */
export type Activity = Readonly<{
 id:string; name:string; phase:number; duration:number;
 predecessors:readonly string[]; evidence?:readonly string[];
 state:'PENDING'|'VERIFIED'|'BLOCKED'|'UNKNOWN';
}>;
export type Goal = Readonly<{id:string; statement:string; acceptance:readonly string[]; targetActivities:readonly string[]}>;
export type ActivityTiming = Readonly<{id:string; phase:number; predecessors:readonly string[]; successors:readonly string[]; earliestStart:number; earliestFinish:number; latestStart:number; latestFinish:number; slack:number; critical:boolean; ready:boolean; blockers:readonly string[]}>;
export type Roadmap = Readonly<{schema:'ARKI-CRITICAL-PATH-1'; goal:Goal; duration:number; criticalPath:readonly string[]; activities:readonly ActivityTiming[]; status:'READY_FOR_REVIEW'|'BLOCKED' }>;
const idOK=/^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$/;
export function criticalPath(goal:Goal, activities:readonly Activity[]):Roadmap {
 if(!idOK.test(goal.id)||!goal.statement.trim()||!goal.acceptance.length||!goal.targetActivities.length)throw Error('GOAL_INCOMPLETE');
 const byId=new Map<string,Activity>();
 for(const a of activities){
  if(!idOK.test(a.id)||byId.has(a.id))throw Error('INVALID_OR_DUPLICATE_ACTIVITY');
  if(!Number.isInteger(a.phase)||a.phase<1||a.phase>10)throw Error('INVALID_PHASE:'+a.id);
  if(!Number.isFinite(a.duration)||a.duration<0)throw Error('INVALID_DURATION:'+a.id);
  if(!Array.isArray(a.predecessors)||a.predecessors.some(p=>typeof p!=='string'||!idOK.test(p)))throw Error('INVALID_PREDECESSORS:'+a.id);
  if(!['PENDING','VERIFIED','BLOCKED','UNKNOWN'].includes(a.state))throw Error('INVALID_STATE:'+a.id);
  byId.set(a.id,a);
 }
 for(const a of activities)for(const p of a.predecessors){if(!byId.has(p))throw Error('MISSING_PREDECESSOR:'+a.id+':'+p);if(p===a.id)throw Error('CYCLE:'+a.id);}
 for(const t of goal.targetActivities)if(!byId.has(t))throw Error('MISSING_GOAL_TARGET:'+t);
 const successors=new Map([...byId.keys()].map(id=>[id,[] as string[]]));
 for(const a of activities)for(const p of a.predecessors)successors.get(p)!.push(a.id);
 const degree=new Map(activities.map(a=>[a.id,a.predecessors.length]));
 const queue=[...degree].filter(([,n])=>n===0).map(([id])=>id).sort();
 const order:string[]=[];
 while(queue.length){const id=queue.shift()!;order.push(id);for(const next of successors.get(id)!.sort()){const d=degree.get(next)!-1;degree.set(next,d);if(d===0){queue.push(next);queue.sort();}}}
 if(order.length!==activities.length)throw Error('DEPENDENCY_CYCLE');
 // Only goal ancestors are part of the schedule; unrelated activities must not extend the critical path.
 const relevant=new Set<string>();
 function mark(id:string){if(relevant.has(id))return;relevant.add(id);for(const p of byId.get(id)!.predecessors)mark(p);}
 for(const id of goal.targetActivities)mark(id);
 const ordered=order.filter(id=>relevant.has(id));
 const es=new Map<string,number>(),ef=new Map<string,number>();
 for(const id of ordered){const a=byId.get(id)!;const start=Math.max(0,...a.predecessors.map(p=>ef.get(p)!));es.set(id,start);ef.set(id,start+a.duration);}
 const duration=Math.max(...goal.targetActivities.map(id=>ef.get(id)!),0);
 const ls=new Map<string,number>(),lf=new Map<string,number>();
 for(const id of [...ordered].reverse()){
  const next=successors.get(id)!.filter(n=>relevant.has(n));
  const finish=next.length?Math.min(...next.map(n=>ls.get(n)!)):duration;
  lf.set(id,finish);ls.set(id,finish-byId.get(id)!.duration);
 }
 const rows=ordered.map(id=>{
  const a=byId.get(id)!;
  const blockers=[...a.predecessors.filter(p=>byId.get(p)!.state!=='VERIFIED').map(p=>'PREDECESSOR_NOT_VERIFIED:'+p),...(a.state==='BLOCKED'?['ACTIVITY_BLOCKED']:[]),...(a.state==='UNKNOWN'?['ACTIVITY_UNKNOWN']:[])];
  const slack=ls.get(id)!-es.get(id)!;
  return {id,phase:a.phase,predecessors:[...a.predecessors].sort(),successors:successors.get(id)!.filter(n=>relevant.has(n)).sort(),earliestStart:es.get(id)!,earliestFinish:ef.get(id)!,latestStart:ls.get(id)!,latestFinish:lf.get(id)!,slack,critical:Math.abs(slack)<1e-9,ready:a.state==='PENDING'&&blockers.length===0,blockers};
 });
 const critical=rows.filter(r=>r.critical).map(r=>r.id);
 return {schema:'ARKI-CRITICAL-PATH-1',goal,duration,criticalPath:critical,activities:rows,status:rows.some(r=>r.blockers.length)?'BLOCKED':'READY_FOR_REVIEW'};
}
