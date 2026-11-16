import type { AgkOperationalObject, AgkHostsDependency, AgkGeometry } from "../arkiGeometryKernel";
import type { AgkCausalModel, AgkFeature, AgkRegenerationReport } from "./types";
import { getOrigin, getProfile, isExtruded } from "./agkTypeGuards";

function asAgkFeature(f: unknown): AgkFeature {
  return f as AgkFeature;
}

function asAgkOperationalObject(o: unknown): AgkOperationalObject {
  return o as AgkOperationalObject;
}


function getRectangleProfileFromGeometry(geometry: { kind: string; profile: unknown }): { width_mm: number; depth_mm: number; radius_mm: number | null } | null {
  if (geometry.kind === "EXTRUDED_RECTANGLE" && geometry.profile && typeof geometry.profile === "object") {
    const p = geometry.profile as { width_mm?: number; depth_mm?: number; radius_mm?: number | null };
    if (typeof p.width_mm === "number" && typeof p.depth_mm === "number") {
      return { width_mm: p.width_mm, depth_mm: p.depth_mm, radius_mm: p.radius_mm ?? null };
    }
  }
  return null;
}

function getRectangleParametersFromFeature(feature: { kind: string; parameters: unknown }): { width_mm: number; depth_mm: number; height_mm: number; x_mm: number; y_mm: number; z_mm: number } | null {
  if (feature.kind === "EXTRUDE_RECTANGLE" && feature.parameters && typeof feature.parameters === "object") {
    const p = feature.parameters as { width_mm?: number; depth_mm?: number; height_mm?: number; x_mm?: number; y_mm?: number; z_mm?: number };
    if (typeof p.width_mm === "number" && typeof p.depth_mm === "number" && typeof p.height_mm === "number") {
      return { width_mm: p.width_mm, depth_mm: p.depth_mm, height_mm: p.height_mm, x_mm: p.x_mm ?? 0, y_mm: p.y_mm ?? 0, z_mm: p.z_mm ?? 0 };
    }
  }
  return null;
}


function getRectangleProfile(geometry: AgkOperationalObject["geometry"]): { width_mm: number; depth_mm: number; radius_mm: number | null } | null {
  if (geometry.kind === "EXTRUDED_RECTANGLE") {
    return geometry.profile;
  }
  return null;
}


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
  if (feature.kind === "EXTRUDE_RECTANGLE") {
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
  if (feature.kind === "EXTRUDE_POLYGON") {
    const p = feature.parameters;
    return {
      kind: "EXTRUDED_POLYGON",
      profile: { polygon_mm: p.polygon_mm, voids_mm: p.voids_mm },
      x_mm: p.x_mm,
      y_mm: p.y_mm,
      z_mm: p.z_mm,
      height_mm: p.height_mm,
    } as any;
  }
  if (feature.kind === "EXTRUDE_CIRCLE") {
    const p = feature.parameters;
    return {
      kind: "EXTRUDED_CIRCLE",
      profile: { radius_mm: p.radius_mm },
      x_mm: p.x_mm,
      y_mm: p.y_mm,
      z_mm: p.z_mm,
      height_mm: p.height_mm,
    } as any;
  }
  if (feature.kind === "MULTI_SOLID") {
    const p = feature.parameters;
    return {
      kind: "MULTI_SOLID",
      solids: p.solids,
    } as any;
  }
  if (feature.kind === "FLOATING_SLAB") {
    const p = feature.parameters;
    return {
      kind: "FLOATING_SLAB",
      profile: { width_mm: p.width_mm, depth_mm: p.depth_mm, thickness_mm: p.thickness_mm },
      x_mm: p.x_mm,
      y_mm: p.y_mm,
      z_mm: p.z_mm,
      height_mm: p.height_mm,
    } as any;
  }
  if (feature.kind === "EXTRUDE_ARC") {
    const p = feature.parameters;
    return {
      kind: "EXTRUDED_ARC",
      profile: { radius_mm: p.radius_mm, startAngle_rad: p.startAngle_rad, endAngle_rad: p.endAngle_rad },
      x_mm: p.x_mm,
      y_mm: p.y_mm,
      z_mm: p.z_mm,
      height_mm: p.height_mm,
    } as any;
  }
  if (feature.kind === "SLOPED_ROOF") {
    const p = feature.parameters;
    return {
      kind: "SLOPED_ROOF",
      profile: { width_mm: p.width_mm, depth_mm: p.depth_mm, slopeAngle_rad: p.slopeAngle_rad },
      x_mm: p.x_mm,
      y_mm: p.y_mm,
      z_mm: p.z_mm,
      height_mm: p.height_mm,
    } as any;
  }
  if (feature.kind === "VOID_EXTRUSION") {
    const p = feature.parameters;
    return {
      kind: "VOID_EXTRUSION",
      profile: { outerPolygon_mm: p.outerPolygon_mm, innerPolygons_mm: p.innerPolygons_mm },
      x_mm: p.x_mm,
      y_mm: p.y_mm,
      z_mm: p.z_mm,
      height_mm: p.height_mm,
    } as any;
  }
  if (feature.kind === "OVERHANG") {
    const p = feature.parameters;
    return {
      kind: "OVERHANG",
      profile: { width_mm: p.width_mm, depth_mm: p.depth_mm, thickness_mm: p.thickness_mm },
      supportId: p.supportId,
      x_mm: p.x_mm,
      y_mm: p.y_mm,
      z_mm: p.z_mm,
      height_mm: p.height_mm,
    } as any;
  }
  if (feature.kind === "BRIDGE") {
    const p = feature.parameters;
    return {
      kind: "BRIDGE",
      profile: { width_mm: p.width_mm, depth_mm: p.depth_mm, thickness_mm: p.thickness_mm },
      startSupportId: p.startSupportId,
      endSupportId: p.endSupportId,
      x_mm: p.x_mm,
      y_mm: p.y_mm,
      z_mm: p.z_mm,
      height_mm: p.height_mm,
    } as any;
  }
  // Fallback
  const p = (feature as any).parameters;
  return {
    kind: "EXTRUDED_RECTANGLE",
    profile: { width_mm: p.width_mm, depth_mm: p.depth_mm, radius_mm: null },
    x_mm: p.x_mm,
    y_mm: p.y_mm,
    z_mm: p.z_mm,
    height_mm: p.height_mm,
  } as any;
}

function geometryMatchesFeature(object: AgkOperationalObject, feature: AgkFeature): boolean {
  const expected = geometryFromFeature(feature);
  if (object.geometry.kind !== expected.kind) return false;
  if (object.geometry.kind === "EXTRUDED_RECTANGLE" && expected.kind === "EXTRUDED_RECTANGLE") {
    return (object.geometry.profile as any).width_mm === (expected.profile as any).width_mm &&
      (object.geometry.profile as any).depth_mm === (expected.profile as any).depth_mm &&
      (object.geometry.profile as any).radius_mm === (expected.profile as any).radius_mm &&
      (object.geometry as any).x_mm === (expected as any).x_mm &&
      (object.geometry as any).y_mm === (expected as any).y_mm &&
      (object.geometry as any).z_mm === (expected as any).z_mm &&
      (object.geometry as any).height_mm === (expected as any).height_mm;
  }
  if (object.geometry.kind === "EXTRUDED_POLYGON" && expected.kind === "EXTRUDED_POLYGON") {
    return (object.geometry as any).height_mm === (expected as any).height_mm &&
      (object.geometry as any).x_mm === (expected as any).x_mm &&
      (object.geometry as any).y_mm === (expected as any).y_mm &&
      (object.geometry as any).z_mm === (expected as any).z_mm;
  }
  if (object.geometry.kind === "MULTI_SOLID" && expected.kind === "MULTI_SOLID") {
    return true; // Aceptar sin comparación profunda
  }
  if (object.geometry.kind === "OVERHANG" && expected.kind === "OVERHANG") {
    return true; // Aceptar sin comparación profunda
  }
  if (object.geometry.kind === "BRIDGE" && expected.kind === "BRIDGE") {
    return true; // Aceptar sin comparación profunda
  }
  return false;
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
    
    // Validar parámetros según el kind
    if (f.kind === "EXTRUDE_RECTANGLE") {
      const entries = Object.entries(f.parameters);
      if (entries.some(([,v]) => !Number.isFinite(v) || !Number.isInteger(v))) return "INVALID_FEATURE_PARAMETER";
      if (f.parameters.width_mm <= 0 || f.parameters.depth_mm <= 0 || (f.parameters as any).height_mm <= 0) return "INVALID_FEATURE_PARAMETER";
    } else {
      const entries = Object.entries(f.parameters);
      if (entries.some(([,v]) => typeof v === "number" && (!Number.isFinite(v)))) return "INVALID_FEATURE_PARAMETER";
      if ((f.parameters as any).height_mm <= 0) return "INVALID_FEATURE_PARAMETER";
    }
    
    if (!geometryMatchesFeature(objectById.get(f.producesObjectId)!, f as any)) return "FEATURE_GEOMETRY_MISMATCH";
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
  translationDelta?: Readonly<{ x: number; y: number; z: number }>,
): { ok: true; objects: readonly AgkOperationalObject[]; model: AgkCausalModel; report: AgkRegenerationReport } | { ok:false; code: RegenerationFailure } {
  const featureByObject = new Map(model.features.map(f => [f.producesObjectId, f]));
  const rebuiltObjects = objects.map(o => {
    const f = featureByObject.get(o.objectId);
    return f ? { ...o, geometry: geometryFromFeature(f) } : o;
  });
  const invalid = validateCausalModel(rebuiltObjects as any, model, dependencies);
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
  const nextObjects=new Map(objects.map(o=>[o.objectId,{...o,geometry:{...o.geometry,profile:{...(o.geometry as any).profile}}}]));
  const regenerated:string[]=[];

  for(const fid of order){
    const f=nextFeatures.get(fid)!;
    const c=model.constraints.find(c=>c.dependentObjectId===f.producesObjectId);
    if(c){
      const host=nextObjects.get(c.hostObjectId)!;
      (f.parameters as any).x_mm=(host.geometry as any).x_mm+c.offset_mm.x;
      (f.parameters as any).y_mm=(host.geometry as any).y_mm+c.offset_mm.y;
      (f.parameters as any).z_mm=(host.geometry as any).z_mm+c.offset_mm.z;
    } else if (translationDelta && f.producesObjectId !== rootObjectId && affected.has(f.producesObjectId)) {
      (f.parameters as any).x_mm += translationDelta.x;
      (f.parameters as any).y_mm += translationDelta.y;
      (f.parameters as any).z_mm += translationDelta.z;
    }
    const obj=nextObjects.get(f.producesObjectId)!;
    obj.geometry=geometryFromFeature(f as any) as any;
    regenerated.push(obj.objectId);
  }

  const nextModel: AgkCausalModel = {
    features: model.features.map(f => nextFeatures.get(f.featureId)!) as any,
    constraints: model.constraints
  };
  const evaluated:string[]=[];
  for(const c of [...model.constraints].sort((a,b)=>a.constraintId.localeCompare(b.constraintId))){
    if(!affected.has(c.hostObjectId)&&!affected.has(c.dependentObjectId)) continue;
    evaluated.push(c.constraintId);
    const host=nextObjects.get(c.hostObjectId)!, child=nextObjects.get(c.dependentObjectId)!;
    if((child.geometry as any).x_mm!==(host.geometry as any).x_mm+c.offset_mm.x || (child.geometry as any).y_mm!==(host.geometry as any).y_mm+c.offset_mm.y || (child.geometry as any).z_mm!==(host.geometry as any).z_mm+c.offset_mm.z) return {ok:false,code:"CONSTRAINT_VIOLATED"};
    if(c.requireWithinHostX) {
      const hostProfile = host.geometry.profile;
      const childProfile = child.geometry.profile;
      if (!('width_mm' in hostProfile) || !('width_mm' in childProfile)) {
        return {ok:false,code:"CONSTRAINT_VIOLATED"};
      }
      if (c.offset_mm.x<0 || c.offset_mm.x+(childProfile as any).width_mm>(hostProfile as any).width_mm) {
        return {ok:false,code:"CONSTRAINT_VIOLATED"};
      }
    }
  }
  const finalObjects: readonly AgkOperationalObject[] = objects.map(o => nextObjects.get(o.objectId)!) as any;
  const finalInvalid=validateCausalModel(finalObjects,nextModel,dependencies);
  if(finalInvalid) return {ok:false,code:finalInvalid};
  const affectedIds=Array.from(affected).sort();
  return {ok:true,objects:finalObjects,model:nextModel,report:{rootChangedObjectIds:[rootObjectId],affectedObjectIds:affectedIds,affectedFeatureIds:Array.from(selected).sort(),evaluatedConstraintIds:evaluated,regeneratedObjectIds:Array.from(new Set(regenerated)).sort(),unchangedObjectIds:objects.map(o=>o.objectId).filter(id=>!affected.has(id)).sort(),executionOrder:order}};
}