import { fingerprint } from "./arkiFingerprint";
import {
  bridgeD63ToD2Geometry,
  type D2ExtrudedRectangleGeometry,
  type D63ToD2GeometryBridgeFailureCode,
  type D63ToD2GeometryBridgeInput,
} from "./arkiD63ToD2GeometryBridge";

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
}

export type AgkCommand =
  | { kind: "MOVE"; objectId: string; delta_mm: { x: number; y: number; z: number } };

export type AgkFailureCode =
  | D63ToD2GeometryBridgeFailureCode
  | "OBJECT_NOT_FOUND"
  | "MOVE_DELTA_NOT_INTEGER"
  | "MOVE_DELTA_NOT_FINITE"
  | "DUPLICATE_OBJECT_ID"
  | "DEPENDENCY_OBJECT_NOT_FOUND"
  | "DEPENDENCY_SELF_REFERENCE"
  | "DEPENDENCY_CYCLE";

export type AgkResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: AgkFailureCode };

export interface AgkDraftState {
  phase: "DRAFT_OPERATIONAL_STATE";
  baseStateId: string;
  objects: readonly AgkOperationalObject[];
  dependencies: readonly AgkDependency[];
}

export interface AgkProvenanceEvent {
  kind: "AGK_COMMAND_COMMITTED";
  transactionId: string;
  beforeStateId: string;
  afterStateId: string;
  command: AgkCommand;
  affectedObjectIds: readonly string[];
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

function stateId(
  revision: number,
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkDependency[]
): string {
  return `agk-state-${fingerprint({
    revision,
    objects: canonicalObjects(objects),
    dependencies: canonicalDependencies(dependencies),
  }).slice(0, 24)}`;
}

function createState(
  revision: number,
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkDependency[]
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
    stateId: stateId(revision, objectSnapshot, dependencySnapshot),
    revision,
    objects: Object.freeze(objectSnapshot),
    dependencies: Object.freeze(dependencySnapshot),
  });
}

function validateDependencies(
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkDependency[]
): AgkFailureCode | null {
  const ids = new Set(objects.map((object) => object.objectId));
  const children = new Map<string, string[]>();
  for (const dependency of dependencies) {
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
  return { ok: true, value: createState(0, [{ objectId, geometry: adapted.value }], []) };
}

export function createAgkState(
  objects: readonly AgkOperationalObject[],
  dependencies: readonly AgkDependency[] = []
): AgkResult<AgkCommittedState> {
  if (new Set(objects.map((object) => object.objectId)).size !== objects.length) {
    return { ok: false, code: "DUPLICATE_OBJECT_ID" };
  }
  const dependencyFailure = validateDependencies(objects, dependencies);
  if (dependencyFailure) return { ok: false, code: dependencyFailure };
  return { ok: true, value: createState(0, objects, dependencies) };
}

export function applyAgkCommand(
  current: AgkCommittedState,
  command: AgkCommand
): AgkResult<AgkTransactionReceipt> {
  if (!current.objects.some((object) => object.objectId === command.objectId)) {
    return { ok: false, code: "OBJECT_NOT_FOUND" };
  }
  const deltas = [command.delta_mm.x, command.delta_mm.y, command.delta_mm.z];
  if (deltas.some((value) => !Number.isFinite(value))) {
    return { ok: false, code: "MOVE_DELTA_NOT_FINITE" };
  }
  if (deltas.some((value) => !Number.isInteger(value))) {
    return { ok: false, code: "MOVE_DELTA_NOT_INTEGER" };
  }

  const affected = affectedByMove(current, command.objectId);
  const draft: AgkDraftState = Object.freeze({
    phase: "DRAFT_OPERATIONAL_STATE",
    baseStateId: current.stateId,
    objects: current.objects.map((object) =>
    !affected.has(object.objectId)
      ? object
      : {
          ...object,
          geometry: {
            ...object.geometry,
            x_mm: object.geometry.x_mm + command.delta_mm.x,
            y_mm: object.geometry.y_mm + command.delta_mm.y,
            z_mm: object.geometry.z_mm + command.delta_mm.z,
          },
        }
    ),
    dependencies: current.dependencies.map((dependency) => ({ ...dependency })),
  });
  const draftFailure = validateDependencies(draft.objects, draft.dependencies);
  if (draftFailure) return { ok: false, code: draftFailure };
  const next = createState(current.revision + 1, draft.objects, draft.dependencies);
  const affectedObjectIds = current.objects
    .map((object) => object.objectId)
    .filter((objectId) => affected.has(objectId));
  const transactionId = `agk-tx-${fingerprint({
    beforeStateId: current.stateId,
    command,
    affectedObjectIds,
    afterStateId: next.stateId,
  }).slice(0, 24)}`;
  return {
    ok: true,
    value: {
      transactionId,
      beforeStateId: current.stateId,
      afterStateId: next.stateId,
      command,
      affectedObjectIds,
      committed: true,
      state: next,
      provenance: Object.freeze({
        kind: "AGK_COMMAND_COMMITTED",
        transactionId,
        beforeStateId: current.stateId,
        afterStateId: next.stateId,
        command,
        affectedObjectIds: Object.freeze([...affectedObjectIds]),
      }),
    },
  };
}

export function deriveAgkPlan(state: AgkCommittedState): readonly AgkPlanRectangle[] {
  return state.objects.map(({ objectId, geometry }) => ({
    objectId,
    kind: "RECTANGLE" as const,
    x_mm: geometry.x_mm,
    y_mm: geometry.y_mm,
    width_mm: geometry.profile.width_mm,
    depth_mm: geometry.profile.depth_mm,
  }));
}
