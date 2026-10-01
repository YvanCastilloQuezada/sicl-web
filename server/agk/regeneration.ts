import type { AgkOperationalObject, AgkHostsDependency, AgkGeometry } from "../arkiGeometryKernel";
import type { AgkCausalModel, AgkFeature, AgkRegenerationReport } from "./types";

export type RegenerationFailure =
  | "DUPLICATE_FEATURE_ID"
  | "DUPLICATE_FEATURE_PRODUCER"
  | "DUPLICATE_FEATURE_INPUT"
  | "DUPLICATE_CONSTRAINT_ID"
  | "CAUSAL_DEPENDENCY_MISMATCH"
  | "FEATURE_OBJECT_NOT_FOUND"
  | "FEATURE_DEPENDENCY_NOT_FOUND"
  | "FEATURE_DEPENDENCY_CYCLE"
  | "INVALID_FEATURE_PARAMETER"
  | "FEATURE_GEOMETRY_MISMATCH"
  | "CONSTRAINT_OBJECT_NOT_FOUND"
  | "CONSTRAINT_VIOLATED";

export function geometryFromFeature(feature: AgkFeature): AgkGeometry {
  const p = feature.parameters;
  return {
    kind: "EXTRUDED_RECTANGLE",
    profile: { width_mm: p.width_mm, depth_mm: p.depth_mm, radius_mm: null },
    x_mm: p.x_mm,
    y_mm: p.y_mm,
    z_mm: p.z_mm,
    height_mm: p.height_mm,
  };
}

function geometryMatchesFeature(object: AgkOperationalObject, feature: AgkFeature): boolean {
  const expected = geometryFromFeature(feature);
  return object.geometry.kind === expected.kind &&
    object.geometry.profile.width_mm === expected.profile.width_mm &&
    object.geometry.profile.depth_mm === expected.profile.depth_mm &&
    object.geometry.profile.radius_mm === expected.profile.radius_mm &&
    object.geometry.x_mm === expected.x_mm &&
    object.geometry.y_mm === expected.y_mm &&
    object.geometry.z_mm === expected.z_mm &&
    object.geometry.height_mm === expected.height_mm;
}

export function validateCausalModel(
  objects: readonly AgkOperationalObject[],
  model: AgkCausalModel,
  dependencies: readonly AgkHostsDependency[] = []
): RegenerationFailure | null {
  const objectIds = new Set(objects.map(o => o.objectId));
  const objectById = new Map(objects.map(o => [o.objectId, o]));
  const featureIds = new Set<string>();
  const producerIds = new Set<string>();
  for (const f of model.features) {
    if (featureIds.has(f.featureId)) return "DUPLICATE_FEATURE_ID";
    featureIds.add(f.featureId);
    if (producerIds.has(f.producesObjectId)) return "DUPLICATE_FEATURE_PRODUCER";
    producerIds.add(f.producesObjectId);
    if (!objectIds.has(f.producesObjectId)) return "FEATURE_OBJECT_NOT_FOUND";
    if (new Set(f.inputFeatureIds).size !== f.inputFeatureIds.length) return "DUPLICATE_FEATURE_INPUT";
    const entries = Object.entries(f.parameters);
    if (entries.some(([,v]) => !Number.isFinite(v) || !Number.isInteger(v))) return "INVALID_FEATURE_PARAMETER";
    if (f.parameters.width_mm <= 0 || f.parameters.depth_mm <= 0 || f.parameters.height_mm <= 0) return "INVALID_FEATURE_PARAMETER";
    if (!geometryMatchesFeature(objectById.get(f.producesObjectId)!, f)) return "FEATURE_GEOMETRY_MISMATCH";
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
    if (!featureById.get(dependentFeatureId)!.inputFeatureIds.includes(hostFeatureId)) return "CAUSAL_DEPENDENCY_MISMATCH";
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

export function regenerateFromFeatureChange(
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkHostsDependency[],
  model: AgkCausalModel,
  rootObjectId: string,
): { ok: true; objects: readonly AgkOperationalObject[]; model: AgkCausalModel; report: AgkRegenerationReport } | { ok:false; code: RegenerationFailure } {
  // Validate graph shape against a temporary object set rebuilt from the features,
  // so a legitimate parameter edit is not rejected as a pre-existing mismatch.
  const featureByObject = new Map(model.features.map(f => [f.producesObjectId, f]));
  const rebuiltObjects = objects.map(o => {
    const f = featureByObject.get(o.objectId);
    return f ? { ...o, geometry: geometryFromFeature(f) } : o;
  });
  const invalid = validateCausalModel(rebuiltObjects, model, dependencies);
  if (invalid) return {ok:false,code:invalid};

  const affected = new Set<string>([rootObjectId]);
  const queue=[rootObjectId];
  while(queue.length){
    const host=queue.shift()!;
    for(const d of dependencies.filter(d=>d.hostObjectId===host).sort((a,b)=>a.dependentObjectId.localeCompare(b.dependentObjectId))) {
      if(!affected.has(d.dependentObjectId)){affected.add(d.dependentObjectId);queue.push(d.dependentObjectId);}
    }
  }
  const selected = new Set<string>();
  for(const id of Array.from(affected)){ const f=featureByObject.get(id); if(f) selected.add(f.featureId); }
  let grew=true;
  while(grew){
    grew=false;
    for(const f of model.features) if(!selected.has(f.featureId)&&f.inputFeatureIds.some(x=>selected.has(x))){
      selected.add(f.featureId); affected.add(f.producesObjectId); grew=true;
    }
  }
  const order=topo(model.features,selected);
  const nextFeatures = new Map(model.features.map(f=>[f.featureId,{...f,parameters:{...f.parameters},inputFeatureIds:[...f.inputFeatureIds]}]));
  const nextObjects=new Map(objects.map(o=>[o.objectId,{...o,geometry:{...o.geometry,profile:{...o.geometry.profile}}}]));
  const regenerated:string[]=[];

  for(const fid of order){
    const f=nextFeatures.get(fid)!;
    const c=model.constraints.find(c=>c.dependentObjectId===f.producesObjectId);
    if(c){
      const host=nextObjects.get(c.hostObjectId)!;
      f.parameters.x_mm=host.geometry.x_mm+c.offset_mm.x;
      f.parameters.y_mm=host.geometry.y_mm+c.offset_mm.y;
      f.parameters.z_mm=host.geometry.z_mm+c.offset_mm.z;
    }
    const obj=nextObjects.get(f.producesObjectId)!;
    obj.geometry=geometryFromFeature(f);
    regenerated.push(obj.objectId);
  }

  const nextModel: AgkCausalModel={features:model.features.map(f=>nextFeatures.get(f.featureId)!),constraints:model.constraints};
  const evaluated:string[]=[];
  for(const c of [...model.constraints].sort((a,b)=>a.constraintId.localeCompare(b.constraintId))){
    if(!affected.has(c.hostObjectId)&&!affected.has(c.dependentObjectId)) continue;
    evaluated.push(c.constraintId);
    const host=nextObjects.get(c.hostObjectId)!, child=nextObjects.get(c.dependentObjectId)!;
    if(child.geometry.x_mm!==host.geometry.x_mm+c.offset_mm.x || child.geometry.y_mm!==host.geometry.y_mm+c.offset_mm.y || child.geometry.z_mm!==host.geometry.z_mm+c.offset_mm.z) return {ok:false,code:"CONSTRAINT_VIOLATED"};
    if(c.requireWithinHostX && (c.offset_mm.x<0 || c.offset_mm.x+child.geometry.profile.width_mm>host.geometry.profile.width_mm)) return {ok:false,code:"CONSTRAINT_VIOLATED"};
  }
  const finalObjects=objects.map(o=>nextObjects.get(o.objectId)!);
  const finalInvalid=validateCausalModel(finalObjects,nextModel,dependencies);
  if(finalInvalid) return {ok:false,code:finalInvalid};
  const affectedIds=Array.from(affected).sort();
  return {ok:true,objects:finalObjects,model:nextModel,report:{rootChangedObjectIds:[rootObjectId],affectedObjectIds:affectedIds,affectedFeatureIds:Array.from(selected).sort(),evaluatedConstraintIds:evaluated,regeneratedObjectIds:Array.from(new Set(regenerated)).sort(),unchangedObjectIds:objects.map(o=>o.objectId).filter(id=>!affected.has(id)).sort(),executionOrder:order}};
}
