import { describe, expect, it } from "vitest";
import { createAgkState } from "../arkiGeometryKernel";
import { executeE2E001 } from "./e2e001";
import { issueD2AuthorityToken } from "../d2Authority";

describe("ARKI E2E-001 vertical slice", () => {
  it.runIf(process.env.ARKI_REQUIRE_COMPAS === "1")(
    "preserves D2 intent, observes COMPAS, commits only through AGK, verifies and derives plan",
    async () => {
      const initial = createAgkState([{
        objectId: "facade-1",
        geometry: {
          kind: "EXTRUDED_RECTANGLE",
          profile: { width_mm: 4000, depth_mm: 200, radius_mm: null },
          x_mm: 1000,
          y_mm: 2000,
          z_mm: 0,
          height_mm: 2800,
        },
      }]);
      expect(initial.ok).toBe(true);
      if (!initial.ok) return;

      const intentId = "move-facade-plus-600";
      const result = await executeE2E001(initial.value, {
        intentId,
        architecturalObjectId: "facade-1",
        operation: "TRANSLATE",
        delta_mm: { x: 600, y: 0, z: 0 },
        architecturalAuthority: "D2",
        authorityToken: issueD2AuthorityToken(intentId),
      });

      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.authority).toEqual({
        architecturalMeaning: "D2",
        provider: "NON_CANONICAL",
        operationalGeometry: "AGK",
      });
      expect(result.providerEvidence).toEqual({
        providerId: "compas-core-2.15.0",
        status: "OBSERVED",
        canonicalMutation: false,
      });
      expect(result.agk.beforeStateId).toBe(initial.value.stateId);
      expect(result.agk.state.revision).toBe(1);
      expect(result.agk.externalProvenance).toEqual({
        sourceKind: "E2E001_D2_CAPABILITY_EXECUTION",
        sourceId: intentId,
        evidence: {
          intentId,
          architecturalAuthority: "D2",
          capabilityRequestId: `e2e001:${intentId}`,
          capability: "TRANSFORM_POINTS_3D",
          operation: "VERIFY",
          selectedProviderId: "compas-core-2.15.0",
          providerAuthority: "NON_CANONICAL_PROVIDER",
          canonicalMutation: false,
          evidenceStatus: "OBSERVED",
          runtimeObserved: true,
          runtimeName: "compas",
          runtimeVersion: "2.15.0",
        },
      });
      expect(result.agk.provenance.external).toEqual(result.agk.externalProvenance);
      expect(Object.isFrozen(result.agk.externalProvenance)).toBe(true);
      expect(Object.isFrozen(result.agk.externalProvenance?.evidence)).toBe(true);
      expect(result.agk.provenance.kind).toBe("AGK_COMMAND_COMMITTED");
      expect(result.agk.provenance.command).toEqual({
        kind: "MOVE",
        objectId: "facade-1",
        delta_mm: { x: 600, y: 0, z: 0 },
      });
      expect(result.oracle).toEqual({
        status: "VERIFIED",
        expectedPosition_mm: { x: 1600, y: 2000, z: 0 },
        observedPosition_mm: { x: 1600, y: 2000, z: 0 },
      });
      expect(result.derivedPlan).toEqual([{
        objectId: "facade-1",
        kind: "RECTANGLE",
        x_mm: 1600,
        y_mm: 2000,
        width_mm: 4000,
        depth_mm: 200,
      }]);
      expect(initial.value.revision).toBe(0);
      expect(initial.value.objects[0].geometry.x_mm).toBe(1000);
    },
  );

  it("fails before execution when D2 authority is absent", async () => {
    const initial = createAgkState([{
      objectId: "facade-1",
      geometry: {
        kind: "EXTRUDED_RECTANGLE",
        profile: { width_mm: 4000, depth_mm: 200, radius_mm: null },
        x_mm: 1000, y_mm: 2000, z_mm: 0, height_mm: 2800,
      },
    }]);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;

    const result = await executeE2E001(initial.value, {
      intentId: "invalid",
      architecturalObjectId: "facade-1",
      operation: "TRANSLATE",
      delta_mm: { x: 600, y: 0, z: 0 },
      architecturalAuthority: "FABRIC",
      authorityToken: issueD2AuthorityToken("invalid"),
    } as unknown as Parameters<typeof executeE2E001>[1]);
    expect(result).toEqual({ ok: false, stage: "INTENT", code: "E2E001_INTENT_INVALID" });
    expect(initial.value.revision).toBe(0);
    expect(initial.value.objects[0].geometry.x_mm).toBe(1000);
  });
  it("rejects a spoofed D2 label without an issued authority capability", async () => {
    const initial = createAgkState([{
      objectId: "facade-1",
      geometry: {
        kind: "EXTRUDED_RECTANGLE",
        profile: { width_mm: 4000, depth_mm: 200, radius_mm: null },
        x_mm: 1000, y_mm: 2000, z_mm: 0, height_mm: 2800,
      },
    }]);
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;

    const result = await executeE2E001(initial.value, {
      intentId: "spoofed",
      architecturalObjectId: "facade-1",
      operation: "TRANSLATE",
      delta_mm: { x: 600, y: 0, z: 0 },
      architecturalAuthority: "D2",
      authorityToken: Object.freeze({ intentId: "spoofed", authority: "D2" }),
    } as Parameters<typeof executeE2E001>[1]);

    expect(result).toEqual({ ok: false, stage: "INTENT", code: "E2E001_INTENT_INVALID" });
    expect(initial.value.revision).toBe(0);
    expect(initial.value.objects[0].geometry.x_mm).toBe(1000);
  });

});
