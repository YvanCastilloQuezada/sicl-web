import { applyAgkCommand, deriveAgkPlan, type AgkCommittedState, type AgkTransactionReceipt } from "../arkiGeometryKernel";
import { createDefaultCapabilityRouter } from "./defaultFabric";
import { verifyD2AuthorityToken, type D2AuthorityToken } from "../d2Authority";

export type E2E001Intent = {
  intentId: string;
  architecturalObjectId: string;
  operation: "TRANSLATE";
  delta_mm: { x: number; y: number; z: number };
  architecturalAuthority: "D2";
  authorityToken: D2AuthorityToken;
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
    !verifyD2AuthorityToken(intent.authorityToken, intent.intentId) ||
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
    execution.result.evidence.status !== "OBSERVED" ||
    execution.result.evidence.runtime.observed !== true ||
    execution.result.evidence.runtime.name !== "compas" ||
    execution.result.evidence.runtime.version !== "2.15.0"
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
  }, {
    sourceKind: "E2E001_D2_CAPABILITY_EXECUTION",
    sourceId: intent.intentId,
    evidence: {
      intentId: intent.intentId,
      architecturalAuthority: intent.architecturalAuthority,
      capabilityRequestId: execution.result.requestId,
      capability: execution.result.capability,
      operation: execution.result.operation,
      selectedProviderId: execution.result.providerId,
      providerAuthority: "NON_CANONICAL_PROVIDER",
      canonicalMutation: execution.result.canonicalMutation,
      evidenceStatus: execution.result.evidence.status,
      runtimeObserved: execution.result.evidence.runtime.observed,
      runtimeName: execution.result.evidence.runtime.name,
      runtimeVersion: execution.result.evidence.runtime.version,
    },
  });
  if (!committed.ok) return { ok: false, stage: "AGK", code: committed.code };

  const finalObject = committed.value.state.objects.find(
    item => item.objectId === intent.architecturalObjectId,
  );
  if (!finalObject) return { ok: false, stage: "ORACLE", code: "E2E001_COMMITTED_OBJECT_MISSING" };

  // Independent cross-engine oracle: COMPAS produced the expected point;
  // AGK independently materialized the MOVE command. Do not recompute the
  // expected position with AGK's source + delta semantics here.
  const expected = {
    x: transformed[0][0],
    y: transformed[0][1],
    z: transformed[0][2],
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
