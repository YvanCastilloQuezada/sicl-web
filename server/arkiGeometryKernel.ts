import { fingerprint } from "./arkiFingerprint";
import {
  bridgeD63ToD2Geometry,
  type D2ExtrudedRectangleGeometry,
  type D63ToD2GeometryBridgeFailureCode,
  type D63ToD2GeometryBridgeInput,
} from "./arkiD63ToD2GeometryBridge";

/**
 * AGK-001 operational spine.
 *
 * D-2 owns architectural meaning. AGK owns deterministic operational geometry.
 * This module does not persist canonical state and does not create a second
 * semantic authority. It is a pure transactional geometry executor.
 *
 * The legacy D6.3 -> D-2 rectangle bridge is deliberately hidden behind AGK
 * as a transitional backend adapter. Callers outside AGK must not use it as a
 * competing productive geometry path.
 */

export type AgkGeometry = D2ExtrudedRectangleGeometry;

export interface AgkOperationalObject {
  objectId: string;
  geometry: AgkGeometry;
}

export interface AgkCommittedState {
  stateId: string;
  revision: number;
  objects: readonly AgkOperationalObject[];
}

export type AgkCommand =
  | { kind: "MOVE"; objectId: string; delta_mm: { x: number; y: number; z: number } };

export type AgkFailureCode =
  | D63ToD2GeometryBridgeFailureCode
  | "OBJECT_NOT_FOUND"
  | "MOVE_DELTA_NOT_INTEGER"
  | "MOVE_DELTA_NOT_FINITE"
  | "DUPLICATE_OBJECT_ID"\n  | "DEPENDENCY_OBJECT_NOT_FOUND"\n  | "DEPENDENCY_SELF_REFERENCE"\n  | "DEPENDENCY_CYCLE";

export type AgkResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: AgkFailureCode };

export interface AgkTransactionReceipt {
  transactionId: string;
  beforeStateId: string;
  afterStateId: string;
  command: AgkCommand;
  committed: true;
  state: AgkCommittedState;
}

export interface AgkPlanRectangle {
  objectId: string;
  kind: "RECTANGLE";
  x_mm: number;
  y_mm: number;
  width_mm: number;
  depth_mm: number;
}

function stateId(revision: number, objects: readonly AgkOperationalObject[]): string {
  return `agk-state-${fingerprint({ revision, objects }).slice(0, 24)}`;
}

function createState(revision: number, objects: readonly AgkOperationalObject[]): AgkCommittedState {
  const snapshot = objects.map((object) => ({
    objectId: object.objectId,
    geometry: {
      ...object.geometry,
      profile: { ...object.geometry.profile },
    },
  }));
  return Object.freeze({
    stateId: stateId(revision, snapshot),
    revision,
    objects: Object.freeze(snapshot),
  });
}

export function materializeD63Geometry(
  objectId: string,
  input: D63ToD2GeometryBridgeInput
): AgkResult<AgkCommittedState> {
  const adapted = bridgeD63ToD2Geometry(input);
  if (!adapted.ok) return adapted;
  return {
    ok: true,
    value: createState(0, [{ objectId, geometry: adapted.value }], []),
  };
}

export function createAgkState(objects: readonly AgkOperationalObject[]): AgkResult<AgkCommittedState> {
  if (new Set(objects.map((object) => object.objectId)).size !== objects.length) {
    return { ok: false, code: "DUPLICATE_OBJECT_ID" };
  }
  return { ok: true, value: createState(0, objects) };
}

export function applyAgkCommand(
  current: AgkCommittedState,
  command: AgkCommand
): AgkResult<AgkTransactionReceipt> {
  const target = current.objects.find((object) => object.objectId === command.objectId);
  if (!target) return { ok: false, code: "OBJECT_NOT_FOUND" };

  const deltas = [command.delta_mm.x, command.delta_mm.y, command.delta_mm.z];
  if (deltas.some((value) => !Number.isFinite(value))) {
    return { ok: false, code: "MOVE_DELTA_NOT_FINITE" };
  }
  if (deltas.some((value) => !Number.isInteger(value))) {
    return { ok: false, code: "MOVE_DELTA_NOT_INTEGER" };
  }

  const objects = current.objects.map((object) =>
    object.objectId !== command.objectId
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
  );
  const next = createState(current.revision + 1, objects, current.dependencies);\n  const affectedObjectIds = current.objects.map((object) => object.objectId).filter((id) => affected.has(id));
  return {
    ok: true,
    value: {
      transactionId: `agk-tx-${fingerprint({
        beforeStateId: current.stateId,
        command,
        afterStateId: next.stateId,
      }).slice(0, 24)}`,
      beforeStateId: current.stateId,
      afterStateId: next.stateId,
      command,
      committed: true,
      state: next,
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
