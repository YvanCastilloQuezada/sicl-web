import { applyAgkCommand, deriveAgkPlan, type AgkCommittedState, type AgkTransactionReceipt } from "../arkiGeometryKernel";
import { createDefaultCapabilityRouter } from "./defaultFabric";

export type E2E001Intent = {
  intentId: string;
  architecturalObjectId: string;
  operation: "TRANSLATE";
  delta_mm: { x: number; y: number; z: number };
  architecturalAuthority: "D2";
};

export type E2E001Result =
  | {
      ok: true;
      intent: E2E001Intent;
      providerEvidence: {
        providerId: string;
        status: "OBSERVED" | "SIMULATED" | "UNKNOWN";
        canonicalMutation: false;
      };
      agk: AgkTransactionReceipt;
      oracle: {
        status: "VERIFIED";
        expectedPosition_mm: { x: number; y: number; z: number };
        observedPosition_mm: { x: number; y: number; z: number };
      };
      derivedPlan: ReturnType<typeof deriveAgkPlan>;
      authority: {
        architecturalMeaning: "D2";
        provider: "NON_CANONICAL";
        operationalGeometry: "AGK";
      };
    }
  | { ok: false; stage: "INTENT" | "FABRIC" | "ADAPTER" | "AGK" | "ORACLE"; code: string };

function integerDelta(delta: E2E001Intent["delta_mm"]): boolean {
  return [delta.x, delta.y, delta.z].every(Number.isInteger);
}

export async function executeE2E001(
  initial: AgkCommittedState,
  intent: E2E001Intent,
): Promise<E2E001Result> {
  if (
    intent.architecturalAuthority !== "D2" ||
    intent.operation !== "TRANSLATE" ||
    !intent.intentId.trim() ||
    !intent.architecturalObjectId.trim() ||
    !integerDelta(intent.delta_mm)
  ) return { ok: false, stage: "INTENT", code: "E2E001_INTENT_INVALID" };

  const object = initial.objects.find(item => item.objectId === intent.architecturalObjectId);
  if (!object) return { ok: false, stage: "INTENT", code: "E2E001_OBJECT_NOT_FOUND" };

  const source = {
    x: object.geometry.x_mm,
    y: object.geometry.y_mm,
    z: object.geometry.z_mm,
  };
  const matrix = [
    [1, 0, 0, intent.delta_mm.x],
    [0, 1, 0, intent.delta_mm.y],
    [0, 0, 1, intent.delta_mm.z],
    [0, 0, 0, 1],
  ];

  const router = createDefaultCapabilityRouter();
  const execution = await router.execute<
    { points: number[][]; matrix: number[][] },
    { points: number[][] }
  >({
    requestId: `e2e001:${intent.intentId}`,
    capability: "TRANSFORM_POINTS_3D",
    operation: "VERIFY",
    selectedProviderId: "compas-core-2.15.0",
    input: { points: [[source.x, source.y, source.z]], matrix },
  });
  if (!execution.ok) return { ok: false, stage: "FABRIC", code: execution.code };

  if (
    execution.result.canonicalMutation !== false ||
    execution.result.evidence.status !== "OBSERVED"
  ) return { ok: false, stage: "FABRIC", code: "E2E001_PROVIDER_NOT_OBSERVED_NONCANONICAL" };

  const transformed = execution.result.output.points;
  if (
    transformed.length !== 1 ||
    transformed[0].length !== 3 ||
    transformed[0].some(value => !Number.isInteger(value))
  ) return { ok: false, stage: "ADAPTER", code: "E2E001_PROVIDER_OUTPUT_INVALID" };

  const observedDelta = {
    x: transformed[0][0] - source.x,
    y: transformed[0][1] - source.y,
    z: transformed[0][2] - source.z,
  };
  if (
    observedDelta.x !== intent.delta_mm.x ||
    observedDelta.y !== intent.delta_mm.y ||
    observedDelta.z !== intent.delta_mm.z
  ) return { ok: false, stage: "ADAPTER", code: "E2E001_PROVIDER_OUTPUT_MISMATCH" };

  const committed = applyAgkCommand(initial, {
    kind: "MOVE",
    objectId: intent.architecturalObjectId,
    delta_mm: observedDelta,
  });
  if (!committed.ok) return { ok: false, stage: "AGK", code: committed.code };

  const finalObject = committed.value.state.objects.find(
    item => item.objectId === intent.architecturalObjectId,
  );
  if (!finalObject) return { ok: false, stage: "ORACLE", code: "E2E001_COMMITTED_OBJECT_MISSING" };

  const expected = {
    x: source.x + intent.delta_mm.x,
    y: source.y + intent.delta_mm.y,
    z: source.z + intent.delta_mm.z,
  };
  const observed = {
    x: finalObject.geometry.x_mm,
    y: finalObject.geometry.y_mm,
    z: finalObject.geometry.z_mm,
  };
  if (expected.x !== observed.x || expected.y !== observed.y || expected.z !== observed.z) {
    return { ok: false, stage: "ORACLE", code: "E2E001_POSITION_ORACLE_FAILED" };
  }

  return {
    ok: true,
    intent,
    providerEvidence: {
      providerId: execution.result.providerId,
      status: execution.result.evidence.status,
      canonicalMutation: false,
    },
    agk: committed.value,
    oracle: { status: "VERIFIED", expectedPosition_mm: expected, observedPosition_mm: observed },
    derivedPlan: deriveAgkPlan(committed.value.state),
    authority: {
      architecturalMeaning: "D2",
      provider: "NON_CANONICAL",
      operationalGeometry: "AGK",
    },
  };
}
