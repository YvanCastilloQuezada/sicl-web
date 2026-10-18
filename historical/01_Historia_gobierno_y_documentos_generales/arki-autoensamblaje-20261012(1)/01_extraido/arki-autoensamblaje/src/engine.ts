import {createHash} from 'node:crypto';
import type {Capability, Registry, Blocker, Proposal, Option, Decision, Simulation} from './types.js';
export const stable=(v:unknown):string=>JSON.stringify(normalize(v));
function normalize(v:unknown):unknown {if(Array.isArray(v))return v.map(normalize);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,normalize(x)]));return v;}
export const digest=(v:unknown)=>createHash('sha256').update(stable(v)).digest('hex');
const idPattern=/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/;
export function validateRegistry(registry:Registry):void {
 if(registry.schema!=='ARKI-ASSEMBLY-REGISTRY-1'||!Array.isArray(registry.capabilities))throw Error('INVALID_REGISTRY');
 const ids=new Set<string>();
 for(const c of registry.capabilities){if(!idPattern.test(c.id)||ids.has(c.id))throw Error('INVALID_OR_DUPLICATE_ID:'+c.id);ids.add(c.id);
 if(c.phase!==null&&(!Number.isInteger(c.phase)||c.phase<1||c.phase>10))throw Error('INVALID_PHASE:'+c.id);
 if(!['CORE','D2','AGK','WEB','ACS','HUMAN'].includes(c.authority))throw Error('INVALID_AUTHORITY:'+c.id);
 for(const key of ['dependencies','inputs','outputs','evidence'] as const)if(!Array.isArray(c[key])||c[key].some(x=>typeof x!=='string'))throw Error('INVALID_'+key+':'+c.id);
 if(c.dependencies.includes(c.id))throw Error('SELF_DEPENDENCY:'+c.id);
 }
}
export function graph(registry:Registry):{order:string[]; missing:string[]; cycles:string[][]}{
 validateRegistry(registry);const byId=new Map(registry.capabilities.map(c=>[c.id,c]));const missing=new Set<string>();const state=new Map<string,number>();const order:string[]=[];const cycles:string[][]=[];const stack:string[]=[];
 function visit(id:string){if(state.get(id)===2)return;if(state.get(id)===1){const i=stack.indexOf(id);cycles.push([...stack.slice(i),id]);return;}state.set(id,1);stack.push(id);for(const d of [...byId.get(id)!.dependencies].sort()){if(!byId.has(d))missing.add(d);else visit(d);}stack.pop();state.set(id,2);order.push(id);}
 for(const id of [...byId.keys()].sort())visit(id);
 return {order,missing:[...missing].sort(),cycles};
}
export function plan(registry:Registry,capabilityId:string):Proposal{
 validateRegistry(registry);const c=registry.capabilities.find(x=>x.id===capabilityId);if(!c)throw Error('CAPABILITY_NOT_FOUND');const g=graph(registry);
 const blockers:Blocker[]=[];const known=new Map(registry.capabilities.map(x=>[x.id,x]));
 for(const d of [...c.dependencies].sort()){const dep=known.get(d);if(!dep)blockers.push({code:'MISSING_DEPENDENCY',detail:d});else if(dep.epistemic!=='VERIFIED'&&dep.epistemic!=='FROZEN')blockers.push({code:'DEPENDENCY_NOT_VERIFIED',detail:d});}
 if(g.cycles.some(cycle=>cycle.includes(c.id)))blockers.push({code:'DEPENDENCY_CYCLE',detail:'Cycle detected'});
 if(c.phase===null)blockers.push({code:'PHASE_UNKNOWN',detail:'Phase assignment requires evidence'});
 if(!c.inputs.length||!c.outputs.length)blockers.push({code:'CONTRACT_INCOMPLETE',detail:'Missing input or output'});
 if(c.epistemic!=='VERIFIED'&&c.epistemic!=='FROZEN')blockers.push({code:'NOT_VERIFIED',detail:c.epistemic});
 if(!c.evidence.length)blockers.push({code:'EVIDENCE_MISSING',detail:'No evidence supplied'});
 const checks=['HUMAN_APPROVAL','AUTHORITY_BOUNDARY','DETERMINISTIC_REPLAY','REGRESSION_PHASES_1_TO_10'];
 const mk=(kind:Option['kind'],title:string,rationale:string,risk:Option['risk'],extra:string[]):Option=>({id:c.id+':'+kind,kind,title,rationale,risk,checks:[...checks,...extra],permitted:false});
 const options:[Option,Option,Option]=[
 mk('DIRECT','Conexión directa','Reutilizar contrato existente; solo viable después de cerrar bloqueos','MEDIUM',['DIRECT_INTERFACE_TEST']),
 mk('ADAPTER','Adaptador subordinado','Compatibilizar interfaces sin autoridad adicional','MEDIUM',['ADAPTER_CONTRACT_TEST','NO_SECOND_AUTHORITY']),
 mk('LAB','Conservar en gemelo experimental','Obtener evidencia aislada antes de integración','LOW',['ISOLATION_TEST'])];
 const evidenceHash=digest({capability:c,dependencies:c.dependencies.map(id=>known.get(id)??null)});
 return {schema:'ARKI-ASSEMBLY-PROPOSAL-1',id:'AP-'+digest({id:c.id,evidenceHash}).slice(0,16),capabilityId:c.id,proposedPhase:c.phase,blockers,options,status:'PENDING_HUMAN_REVIEW',selected:null,evidenceHash};
}
export function simulate(p:Proposal,optionId:string):Simulation{
 const o=p.options.find(x=>x.id===optionId);if(!o)throw Error('UNKNOWN_OPTION');
 const findings=[...p.blockers.map(b=>b.code+':'+b.detail)];
 if(o.kind==='LAB')findings.push('ISOLATED_PROPOSAL_ONLY');
 else if(p.blockers.length)findings.push('CANONICAL_INTEGRATION_BLOCKED');
 findings.push('NO_REAL_CODE_EXECUTED','NO_CANONICAL_MUTATION');
 return {proposalId:p.id,optionId,passed:o.kind==='LAB'||p.blockers.length===0,findings,mode:'DRY_RUN_ONLY'};
}
export function authorize(p:Proposal,optionId:string,actorId:string,rationale:string,approvedAt:string):Decision{
 if(!p.options.some(x=>x.id===optionId))throw Error('UNKNOWN_OPTION');
 if(!actorId.trim()||!rationale.trim()||!/^\d{4}-\d\d-\d\dT/.test(approvedAt))throw Error('HUMAN_DECISION_FIELDS_REQUIRED');
 return {proposalId:p.id,optionId,actorId,rationale,approvedAt,evidenceHash:p.evidenceHash};
}
export function executionGate(p:Proposal,decision:Decision,sim:Simulation):{authorized:boolean;reason:string}{
 if(decision.proposalId!==p.id||decision.evidenceHash!==p.evidenceHash||decision.optionId!==sim.optionId||sim.proposalId!==p.id)return {authorized:false,reason:'STALE_OR_MISMATCHED_EVIDENCE'};
 if(!sim.passed)return {authorized:false,reason:'SIMULATION_FAILED'};
 if(p.blockers.length&&decision.optionId!==p.capabilityId+':LAB')return {authorized:false,reason:'UNRESOLVED_BLOCKERS'};
 return {authorized:false,reason:'REAL_EXECUTION_GATE_NOT_IMPLEMENTED'};
}
