import type { AgkOperationalObject, AgkHostsDependency } from "../arkiGeometryKernel";
import type { AgkCausalModel, AgkFeature, AgkRegenerationReport } from "./types";

export type RegenerationFailure =
  | "DUPLICATE_FEATURE_ID"
  | "DUPLICATE_FEATURE_PRODUCER"
  | "DUPLICATE_CONSTRAINT_ID"
  | "CAUSAL_DEPENDENCY_MISMATCH"
  | "FEATURE_OBJECT_NOT_FOUND"
  | "FEATURE_DEPENDENCY_NOT_FOUND"
  | "FEATURE_DEPENDENCY_CYCLE"
  | "INVALID_FEATURE_PARAMETER"
  | "CONSTRAINT_OBJECT_NOT_FOUND"
  | "CONSTRAINT_VIOLATED";

export function validateCausalModel(
  objects: readonly AgkOperationalObject[],
  model: AgkCausalModel,
  dependencies: readonly AgkHostsDependency[] = []
): RegenerationFailure | null {
  const objectIds = new Set(objects.map(o => o.objectId));
  const featureIds = new Set<string>();
  const producerIds = new Set<string>();
  for (const f of model.features) {
    if (featureIds.has(f.featureId)) return "DUPLICATE_FEATURE_ID";
    featureIds.add(f.featureId);
    if (producerIds.has(f.producesObjectId)) return "DUPLICATE_FEATURE_PRODUCER";
    producerIds.add(f.producesObjectId);
    if (!objectIds.has(f.producesObjectId)) return "FEATURE_OBJECT_NOT_FOUND";
    if (Object.values(f.parameters).some(v => !Number.isFinite(v) || !Number.isInteger(v))) return "INVALID_FEATURE_PARAMETER";
  }
  for (const f of model.features) for (const up of f.inputFeatureIds) if (!featureIds.has(up)) return "FEATURE_DEPENDENCY_NOT_FOUND";
  try { topo(model.features, new Set(model.features.map(f => f.featureId))); } catch { return "FEATURE_DEPENDENCY_CYCLE"; }
  const constraintIds = new Set<string>();
  for (const c of model.constraints) {
    if (constraintIds.has(c.constraintId)) return "DUPLICATE_CONSTRAINT_ID";
    constraintIds.add(c.constraintId);
    if (!objectIds.has(c.hostObjectId) || !objectIds.has(c.dependentObjectId)) return "CONSTRAINT_OBJECT_NOT_FOUND";
  }
  const producerByObject = new Map(model.features.map(f => [f.producesObjectId, f.featureId]));
  const featureById = new Map(model.features.map(f => [f.featureId, f]));
  for (const d of dependencies) {
    const hostFeatureId = producerByObject.get(d.hostObjectId);
    const dependentFeatureId = producerByObject.get(d.dependentObjectId);
    if (!hostFeatureId || !dependentFeatureId) continue;
    const dependentFeature = featureById.get(dependentFeatureId)!;
    if (!dependentFeature.inputFeatureIds.includes(hostFeatureId)) return "CAUSAL_DEPENDENCY_MISMATCH";
  }
  return null;
}

function topo(features: readonly AgkFeature[], selected: ReadonlySet<string>): readonly string[] {
  const byId = new Map(features.map(f => [f.featureId, f]));
  const indegree = new Map<string, number>();
  const out = new Map<string, string[]>();
  for (const id of Array.from(selected)) indegree.set(id, 0);
  for (const id of Array.from(selected)) {
    const f = byId.get(id)!;
    for (const up of f.inputFeatureIds) if (selected.has(up)) {
      indegree.set(id, (indegree.get(id) ?? 0) + 1);
      out.set(up, [...(out.get(up) ?? []), id]);
    }
  }
  const ready = Array.from(selected).filter(id => indegree.get(id) === 0).sort();
  const order: string[] = [];
  while (ready.length) {
    const id = ready.shift()!;
    order.push(id);
    for (const next of (out.get(id) ?? []).sort()) {
      indegree.set(next, indegree.get(next)! - 1);
      if (indegree.get(next) === 0) { ready.push(next); ready.sort(); }
    }
  }
  if (order.length !== selected.size) throw new Error("cycle");
  return order;
}

export function regenerateMove(
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkHostsDependency[],
  model: AgkCausalModel,
  rootObjectId: string,
  delta: {x:number;y:number;z:number}
): { ok: true; objects: readonly AgkOperationalObject[]; report: AgkRegenerationReport } | { ok:false; code: RegenerationFailure } {
  const invalid = validateCausalModel(objects, model, dependencies);
  if (invalid) return {ok:false,code:invalid};
  const affected = new Set<string>([rootObjectId]), queue=[rootObjectId];
  while(queue.length){ const host=queue.shift()!; for(const d of dependencies.filter(d=>d.hostObjectId===host).sort((a,b)=>a.dependentObjectId.localeCompare(b.dependentObjectId))) if(!affected.has(d.dependentObjectId)){affected.add(d.dependentObjectId);queue.push(d.dependentObjectId);} }
  const byObject = new Map(model.features.map(f=>[f.producesObjectId,f]));
  const selected = new Set<string>();
  for(const id of Array.from(affected)){ const f=byObject.get(id); if(f) selected.add(f.featureId); }
  let grew=true; while(grew){grew=false; for(const f of model.features) if(!selected.has(f.featureId)&&f.inputFeatureIds.some(x=>selected.has(x))){selected.add(f.featureId);affected.add(f.producesObjectId);grew=true;}}
  const order=topo(model.features,selected);
  const next=new Map(objects.map(o=>[o.objectId,{...o,geometry:{...o.geometry,profile:{...o.geometry.profile}}}]));
  const root=next.get(rootObjectId); if(root){root.geometry={...root.geometry,x_mm:root.geometry.x_mm+delta.x,y_mm:root.geometry.y_mm+delta.y,z_mm:root.geometry.z_mm+delta.z};}
  const regenerated:string[]=[];
  for(const fid of order){
    const f=model.features.find(x=>x.featureId===fid)!;
    const obj=next.get(f.producesObjectId)!;
    const c=model.constraints.find(c=>c.dependentObjectId===obj.objectId);
    if(c){
      const host=next.get(c.hostObjectId)!;
      obj.geometry={...obj.geometry,x_mm:host.geometry.x_mm+c.offset_mm.x,y_mm:host.geometry.y_mm+c.offset_mm.y,z_mm:host.geometry.z_mm+c.offset_mm.z};
    } else if(obj.objectId!==rootObjectId && affected.has(obj.objectId)){
      obj.geometry={...obj.geometry,x_mm:obj.geometry.x_mm+delta.x,y_mm:obj.geometry.y_mm+delta.y,z_mm:obj.geometry.z_mm+delta.z};
    }
    regenerated.push(obj.objectId);
  }
  const evaluated:string[]=[];
  for(const c of [...model.constraints].sort((a,b)=>a.constraintId.localeCompare(b.constraintId))){
    if(!affected.has(c.hostObjectId)&&!affected.has(c.dependentObjectId)) continue;
    evaluated.push(c.constraintId);
    const host=next.get(c.hostObjectId)!, child=next.get(c.dependentObjectId)!;
    if(child.geometry.x_mm!==host.geometry.x_mm+c.offset_mm.x || child.geometry.y_mm!==host.geometry.y_mm+c.offset_mm.y || child.geometry.z_mm!==host.geometry.z_mm+c.offset_mm.z) return {ok:false,code:"CONSTRAINT_VIOLATED"};
    if(c.requireWithinHostX && (c.offset_mm.x<0 || c.offset_mm.x+child.geometry.profile.width_mm>host.geometry.profile.width_mm)) return {ok:false,code:"CONSTRAINT_VIOLATED"};
  }
  const affectedIds=Array.from(affected).sort();
  return {ok:true,objects:objects.map(o=>next.get(o.objectId)!),report:{rootChangedObjectIds:[rootObjectId],affectedObjectIds:affectedIds,affectedFeatureIds:Array.from(selected).sort(),evaluatedConstraintIds:evaluated,regeneratedObjectIds:Array.from(new Set(regenerated)).sort(),unchangedObjectIds:objects.map(o=>o.objectId).filter(id=>!affected.has(id)).sort(),executionOrder:order}};
}
