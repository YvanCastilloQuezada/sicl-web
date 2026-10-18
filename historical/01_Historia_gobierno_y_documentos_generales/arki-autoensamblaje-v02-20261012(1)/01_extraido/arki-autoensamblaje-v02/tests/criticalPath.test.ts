import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {criticalPath,type Activity,type Goal} from '../src/criticalPath.js';
const goal:Goal={id:'ASSEMBLE',statement:'Ensamblar ARKI conforme al mapa maestro',acceptance:['Regresión de diez fases'],targetActivities:['D']};
const activities:Activity[]=[
{id:'A',name:'Core',phase:1,duration:3,predecessors:[],state:'VERIFIED'},
{id:'B',name:'Semántica',phase:2,duration:4,predecessors:['A'],state:'VERIFIED'},
{id:'C',name:'Experimento',phase:3,duration:2,predecessors:['A'],state:'PENDING'},
{id:'D',name:'Integración',phase:4,duration:5,predecessors:['B','C'],state:'PENDING'},
{id:'Z',name:'Trabajo no relacionado',phase:10,duration:999,predecessors:[],state:'PENDING'}];
test('ruta crítica basada en meta, no en actividades ajenas',()=>{const r=criticalPath(goal,activities);assert.equal(r.duration,12);assert.deepEqual(r.criticalPath,['A','B','D']);assert.ok(!r.activities.some(a=>a.id==='Z'));});
test('no habilita actividad sin antecesores verificados',()=>{const r=criticalPath(goal,activities);assert.equal(r.activities.find(a=>a.id==='D')!.ready,false);assert.deepEqual(r.activities.find(a=>a.id==='D')!.blockers,['PREDECESSOR_NOT_VERIFIED:C']);assert.equal(r.activities.find(a=>a.id==='C')!.ready,true);});
test('detección de ciclo y antecedente inexistente',()=>{assert.throws(()=>criticalPath(goal,[...activities,{id:'X',name:'X',phase:1,duration:1,predecessors:['Y'],state:'PENDING'}]),/MISSING_PREDECESSOR/);assert.throws(()=>criticalPath(goal,activities.map(a=>a.id==='A'?{...a,predecessors:['D']}:a)),/DEPENDENCY_CYCLE/);});
test('determinismo con orden de entrada distinto',()=>{assert.deepEqual(criticalPath(goal,activities),criticalPath(goal,[...activities].reverse()));});
test('la meta es obligatoria',()=>{assert.throws(()=>criticalPath({...goal,acceptance:[]},activities),/GOAL_INCOMPLETE/);});
