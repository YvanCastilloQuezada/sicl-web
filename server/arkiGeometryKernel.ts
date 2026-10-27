// L-04 empirical canary: AGK-only path trigger; no runtime behavior change.
import { fingerprint } from "./arkiFingerprint";
import {
  bridgeD63ToD2Geometry,
  type D2ExtrudedRectangleGeometry,
  type D63ToD2GeometryBridgeFailureCode,
  type D63ToD2GeometryBridgeInput,
} from "./arkiD63ToD2GeometryBridge";
import type { AgkCausalModel, AgkFeatureParameterName, AgkRegenerationReport } from "./agk/types";
import { regenerateFromFeatureChange, validateCausalModel, type RegenerationFailure } from "./agk/regeneration";

export type AgkGeometry = D2ExtrudedRectangleGeometry;

export interface AgkOperationalObject {
  objectId: string;
  geometry: AgkGeometry;
}

export interface AgkHostsDependency {
  kind: "HOSTS";
  hostObjectId: string;
  dependentObjectId: string;
}
export type AgkDependency = AgkHostsDependency;

export interface AgkCommittedState {
  stateId: string;
  revision: number;
  objects: readonly AgkOperationalObject[];
  dependencies: readonly AgkDependency[];
  causalModel?: AgkCausalModel;
}

export type AgkCommand =
  | { kind: "MOVE"; objectId: string; delta_mm: { x: number; y: number; z: number } }
  | { kind: "SET_FEATURE_PARAMETER"; featureId: string; parameter: AgkFeatureParameterName; value: number };

export type AgkFailureCode =
  | D63ToD2GeometryBridgeFailureCode
  | "OBJECT_NOT_FOUND"
  | "MOVE_DELTA_NOT_INTEGER"
  | "MOVE_DELTA_NOT_FINITE"
  | "DUPLICATE_OBJECT_ID"
  | "OPERATIONAL_OBJECT_ID_INVALID"
  | "OPERATIONAL_GEOMETRY_INVALID"
  | "DEPENDENCY_OBJECT_NOT_FOUND"
  | "DEPENDENCY_SELF_REFERENCE"
  | "DEPENDENCY_CYCLE"
  | "DUPLICATE_DEPENDENCY"
  | RegenerationFailure
  | "FEATURE_NOT_FOUND";

export type AgkResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: AgkFailureCode };

export interface AgkDraftState {
  phase: "DRAFT_OPERATIONAL_STATE";
  baseStateId: string;
  objects: readonly AgkOperationalObject[];
  dependencies: readonly AgkDependency[];
  causalModel?: AgkCausalModel;
}

export interface AgkExternalProvenance {
  readonly sourceKind: string;
  readonly sourceId: string;
  readonly evidence: Readonly<Record<string, unknown>>;
}

export interface AgkProvenanceEvent {
  kind: "AGK_COMMAND_COMMITTED";
  transactionId: string;
  beforeStateId: string;
  afterStateId: string;
  command: AgkCommand;
  affectedObjectIds: readonly string[];
  regenerationReport?: AgkRegenerationReport;
  external?: AgkExternalProvenance;
}

export interface AgkTransactionReceipt {
  transactionId: string;
  beforeStateId: string;
  afterStateId: string;
  command: AgkCommand;
  affectedObjectIds: readonly string[];
  committed: true;
  state: AgkCommittedState;
  provenance: AgkProvenanceEvent;
  regenerationReport?: AgkRegenerationReport;
  externalProvenance?: AgkExternalProvenance;
}

export interface AgkPlanRectangle {
  objectId: string;
  kind: "RECTANGLE";
  x_mm: number;
  y_mm: number;
  width_mm: number;
  depth_mm: number;
}

function canonicalObjects(objects: readonly AgkOperationalObject[]): readonly AgkOperationalObject[] {
  return [...objects].sort((a, b) => a.objectId.localeCompare(b.objectId));
}

function canonicalDependencies(dependencies: readonly AgkDependency[]): readonly AgkDependency[] {
  return [...dependencies].sort((a, b) =>
    a.hostObjectId.localeCompare(b.hostObjectId) ||
    a.dependentObjectId.localeCompare(b.dependentObjectId) ||
    a.kind.localeCompare(b.kind)
  );
}

function canonicalCausalModel(model?: AgkCausalModel): AgkCausalModel | undefined {
  if (!model) return undefined;
  const features = [...model.features].map(feature => {
    const parameters = Object.freeze({ ...feature.parameters });
    const inputFeatureIds = Object.freeze([...feature.inputFeatureIds].sort());
    return Object.freeze({ ...feature, parameters, inputFeatureIds });
  }).sort((a,b)=>a.featureId.localeCompare(b.featureId));
  const constraints = [...model.constraints].map(constraint =>
    Object.freeze({ ...constraint, offset_mm: Object.freeze({ ...constraint.offset_mm }) })
  ).sort((a,b)=>a.constraintId.localeCompare(b.constraintId));
  return Object.freeze({
    features: Object.freeze(features),
    constraints: Object.freeze(constraints),
  });
}

function stateId(
  revision: number,
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkDependency[],
  causalModel?: AgkCausalModel
): string {
  return `agk-state-${fingerprint({
    revision,
    objects: canonicalObjects(objects),
    dependencies: canonicalDependencies(dependencies),
    causalModel: canonicalCausalModel(causalModel),
  }).slice(0, 24)}`;
}

function createState(
  revision: number,
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkDependency[],
  causalModel?: AgkCausalModel
): AgkCommittedState {
  const objectSnapshot = objects.map((object) => ({
    objectId: object.objectId,
    geometry: { ...object.geometry, profile: { ...object.geometry.profile } },
  }));
  const dependencySnapshot = dependencies.map((dependency) => Object.freeze({ ...dependency }));
  for (const object of objectSnapshot) {
    Object.freeze(object.geometry.profile);
    Object.freeze(object.geometry);
    Object.freeze(object);
  }
  return Object.freeze({
    stateId: stateId(revision, objectSnapshot, dependencySnapshot, causalModel),
    revision,
    objects: Object.freeze(objectSnapshot),
    dependencies: Object.freeze(dependencySnapshot),
    causalModel: canonicalCausalModel(causalModel),
  });
}

function validateOperationalObjects(objects: readonly AgkOperationalObject[]): AgkFailureCode | null {
  for (const candidate of objects as readonly unknown[]) {
    if (!candidate || typeof candidate !== "object") return "OPERATIONAL_GEOMETRY_INVALID";
    const object = candidate as { objectId?: unknown; geometry?: unknown };
    if (typeof object.objectId !== "string" || !object.objectId.trim()) return "OPERATIONAL_OBJECT_ID_INVALID";
    if (!object.geometry || typeof object.geometry !== "object") return "OPERATIONAL_GEOMETRY_INVALID";
    const geometry = object.geometry as {
      kind?: unknown;
      profile?: unknown;
      x_mm?: unknown;
      y_mm?: unknown;
      z_mm?: unknown;
      height_mm?: unknown;
    };
    if (geometry.kind !== "EXTRUDED_RECTANGLE" || !geometry.profile || typeof geometry.profile !== "object") {
      return "OPERATIONAL_GEOMETRY_INVALID";
    }
    const profile = geometry.profile as { width_mm?: unknown; depth_mm?: unknown; radius_mm?: unknown };
    const positiveInteger = (value: unknown): value is number =>
      typeof value === "number" && Number.isInteger(value) && value > 0;
    const integer = (value: unknown): value is number =>
      typeof value === "number" && Number.isInteger(value);
    if (
      !positiveInteger(profile.width_mm) ||
      !positiveInteger(profile.depth_mm) ||
      profile.radius_mm !== null ||
      !integer(geometry.x_mm) ||
      !integer(geometry.y_mm) ||
      !integer(geometry.z_mm) ||
      !positiveInteger(geometry.height_mm)
    ) return "OPERATIONAL_GEOMETRY_INVALID";
  }
  return null;
}

function validateDependencies(
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkDependency[]
): AgkFailureCode | null {
  const ids = new Set(objects.map((object) => object.objectId));
  const children = new Map<string, string[]>();
  const dependencyKeys = new Set<string>();
  for (const dependency of dependencies) {
    const dependencyKey = `${dependency.kind}:${dependency.hostObjectId}:${dependency.dependentObjectId}`;
    if (dependencyKeys.has(dependencyKey)) return "DUPLICATE_DEPENDENCY";
    dependencyKeys.add(dependencyKey);
    if (!ids.has(dependency.hostObjectId) || !ids.has(dependency.dependentObjectId)) {
      return "DEPENDENCY_OBJECT_NOT_FOUND";
    }
    if (dependency.hostObjectId === dependency.dependentObjectId) {
      return "DEPENDENCY_SELF_REFERENCE";
    }
    children.set(dependency.hostObjectId, [
      ...(children.get(dependency.hostObjectId) ?? []),
      dependency.dependentObjectId,
    ]);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycle = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const child of children.get(id) ?? []) if (hasCycle(child)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  for (const id of Array.from(ids)) if (hasCycle(id)) return "DEPENDENCY_CYCLE";
  return null;
}

function affectedByMove(state: AgkCommittedState, rootObjectId: string): Set<string> {
  const affected = new Set<string>([rootObjectId]);
  const queue = [rootObjectId];
  while (queue.length > 0) {
    const host = queue.shift()!;
    for (const dependency of state.dependencies) {
      if (dependency.hostObjectId !== host || affected.has(dependency.dependentObjectId)) continue;
      affected.add(dependency.dependentObjectId);
      queue.push(dependency.dependentObjectId);
    }
  }
  return affected;
}

export function materializeD63Geometry(
  objectId: string,
  input: D63ToD2GeometryBridgeInput
): AgkResult<AgkCommittedState> {
  const adapted = bridgeD63ToD2Geometry(input);
  if (!adapted.ok) return adapted;
  return createAgkState([{ objectId, geometry: adapted.value }]);
}

export function createAgkState(
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkDependency[] = [],
  causalModel?: AgkCausalModel
): AgkResult<AgkCommittedState> {
  const objectFailure = validateOperationalObjects(objects);
  if (objectFailure) return { ok: false, code: objectFailure };
  if (new Set(objects.map((object) => object.objectId)).size !== objects.length) {
    return { ok: false, code: "DUPLICATE_OBJECT_ID" };
  }
  const dependencyFailure = validateDependencies(objects, dependencies);
  if (dependencyFailure) return { ok: false, code: dependencyFailure };
  if (causalModel) { const causalFailure = validateCausalModel(objects, causalModel, dependencies); if (causalFailure) return { ok:false, code:causalFailure }; }
  return { ok: true, value: createState(0, objects, dependencies, causalModel) };
}

export function applyAgkCommand(
  current: AgkCommittedState,
  command: AgkCommand,
  externalProvenance?: AgkExternalProvenance
): AgkResult<AgkTransactionReceipt> {
  if (command.kind === "MOVE") {
    const object = current.objects.find(o => o.objectId === command.objectId);
    if (!object) return { ok: false, code: "OBJECT_NOT_FOUND" };
    const deltas = [command.delta_mm.x, command.delta_mm.y, command.delta_mm.z];
    if (deltas.some(value => !Number.isFinite(value))) return { ok: false, code: "MOVE_DELTA_NOT_FINITE" };
    if (deltas.some(value => !Number.isInteger(value))) return { ok: false, code: "MOVE_DELTA_NOT_INTEGER" };

    if (current.causalModel) {
      const rootFeature = current.causalModel.features.find(f => f.producesObjectId === command.objectId);
      if (!rootFeature) return { ok: false, code: "FEATURE_NOT_FOUND" };
      const model: AgkCausalModel = {
        ...current.causalModel,
        features: current.causalModel.features.map(f => f.featureId !== rootFeature.featureId ? f : ({
          ...f,
          parameters: {
            ...f.parameters,
            x_mm: f.parameters.x_mm + command.delta_mm.x,
            y_mm: f.parameters.y_mm + command.delta_mm.y,
            z_mm: f.parameters.z_mm + command.delta_mm.z,
          },
        })),
      };
      const regenerated = regenerateFromFeatureChange(
        current.objects,
        current.dependencies,
        model,
        command.objectId,
        command.delta_mm,
      );
      if (!regenerated.ok) return regenerated;
      return commit(current, command, regenerated.objects, regenerated.report, regenerated.model, externalProvenance);
    }

    const affected = affectedByMove(current, command.objectId);
    const objects = current.objects.map(o => !affected.has(o.objectId) ? o : ({
      ...o,
      geometry: {
        ...o.geometry,
        x_mm: o.geometry.x_mm + command.delta_mm.x,
        y_mm: o.geometry.y_mm + command.delta_mm.y,
        z_mm: o.geometry.z_mm + command.delta_mm.z,
      },
    }));
    return commit(current, command, objects, undefined, current.causalModel, externalProvenance);
  }

  if (!Number.isFinite(command.value) || !Number.isInteger(command.value)) return { ok:false, code:"INVALID_FEATURE_PARAMETER" };
  if (!current.causalModel) return { ok:false, code:"FEATURE_NOT_FOUND" };
  const feature = current.causalModel.features.find(f => f.featureId === command.featureId);
  if (!feature) return { ok:false, code:"FEATURE_NOT_FOUND" };
  if ((command.parameter === "width_mm" || command.parameter === "depth_mm" || command.parameter === "height_mm") && command.value <= 0) {
    return { ok:false, code:"INVALID_FEATURE_PARAMETER" };
  }
  const model: AgkCausalModel = {
    ...current.causalModel,
    features: current.causalModel.features.map(f => f.featureId !== command.featureId ? f : ({
      ...f,
      parameters: { ...f.parameters, [command.parameter]: command.value },
    })),
  };
  const regenerated = regenerateFromFeatureChange(current.objects, current.dependencies, model, feature.producesObjectId);
  if (!regenerated.ok) return regenerated;
  return commit(current, command, regenerated.objects, regenerated.report, regenerated.model, externalProvenance);
}

function commit(current: AgkCommittedState, command: AgkCommand, objects: readonly AgkOperationalObject[], report?: AgkRegenerationReport, causalModel: AgkCausalModel | undefined = current.causalModel, externalProvenance?: AgkExternalProvenance): AgkResult<AgkTransactionReceipt> {
  const draft: AgkDraftState={phase:"DRAFT_OPERATIONAL_STATE",baseStateId:current.stateId,objects,dependencies:current.dependencies,causalModel};
  const objectFailure=validateOperationalObjects(draft.objects); if(objectFailure)return {ok:false,code:objectFailure};
  const failure=validateDependencies(draft.objects,draft.dependencies); if(failure)return {ok:false,code:failure};
  const next=createState(current.revision+1,draft.objects,draft.dependencies,draft.causalModel);
  const affected=report?.affectedObjectIds ?? current.objects.filter((o,i)=>JSON.stringify(o)!==JSON.stringify(objects[i])).map(o=>o.objectId);
  return receipt(current,command,next,affected,report,externalProvenance);
}

function receipt(current:AgkCommittedState,command:AgkCommand,next:AgkCommittedState,affectedObjectIds:readonly string[],regenerationReport?:AgkRegenerationReport,externalProvenance?:AgkExternalProvenance):AgkResult<AgkTransactionReceipt>{
  const external = externalProvenance ? Object.freeze({
    sourceKind: externalProvenance.sourceKind,
    sourceId: externalProvenance.sourceId,
    evidence: Object.freeze({ ...externalProvenance.evidence }),
  }) : undefined;
  const transactionId=`agk-tx-${fingerprint({beforeStateId:current.stateId,command,affectedObjectIds:[...affectedObjectIds].sort(),afterStateId:next.stateId}).slice(0,24)}`;
  const provenance=Object.freeze({kind:"AGK_COMMAND_COMMITTED" as const,transactionId,beforeStateId:current.stateId,afterStateId:next.stateId,command,affectedObjectIds:Object.freeze([...affectedObjectIds].sort()),regenerationReport,external});
  return {ok:true,value:{transactionId,beforeStateId:current.stateId,afterStateId:next.stateId,command,affectedObjectIds:[...affectedObjectIds].sort(),committed:true,state:next,provenance,regenerationReport,externalProvenance:external}};
}

export function deriveAgkPlan(state: AgkCommittedState): readonly AgkPlanRectangle[] {
  return [...state.objects].sort((a,b)=>a.objectId.localeCompare(b.objectId)).map(({ objectId, geometry }) => ({
    objectId,
    kind: "RECTANGLE" as const,
    x_mm: geometry.x_mm,
    y_mm: geometry.y_mm,
    width_mm: geometry.profile.width_mm,
    depth_mm: geometry.profile.depth_mm,
  }));
}
