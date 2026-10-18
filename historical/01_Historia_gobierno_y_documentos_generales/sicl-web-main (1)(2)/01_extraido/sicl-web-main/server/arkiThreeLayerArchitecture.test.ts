import { describe, expect, it } from "vitest";
import { architectureContractSummary, assertLayerDependency, authorizeCoreOperation, boundaryEvent, brainCandidate, edgePreview, isEpistemicPromotionForbidden, isolationPolicy, verticalFlowProof } from "./arkiThreeLayerArchitecture";

describe("ARKI three-layer architecture boundaries", () => {
  it("keeps one canonical contract and explicit authority rules", () => {
    const summary = architectureContractSummary();
    expect(summary.contract.oneArki).toBe(true);
    expect(summary.invariants).toContain("EDGE_CANNOT_SILENTLY_COMMIT");
    expect(summary.invariants).toContain("HUMAN_AUTHORITY_FINAL");
    expect(summary.invariants).toContain("EXTERNAL_HOST_FAILURE_DEGRADES_GRACEFULLY");
  });
  it("allows Edge to request Brain/Core but prevents Core dependencies outward", () => {
    expect(() => assertLayerDependency("EDGE", "BRAIN")).not.toThrow();
    expect(() => assertLayerDependency("BRAIN", "CORE_TRUST")).not.toThrow();
    expect(() => assertLayerDependency("CORE_TRUST", "EDGE")).toThrow("Forbidden layer dependency");
  });
  it("keeps preview local and candidate generated without canonical mutation", () => {
    const preview = edgePreview({ width: 24 });
    const candidate = brainCandidate({ geometry: preview.value });
    expect(preview.projectStateEffect).toBe("NO_CANONICAL_MUTATION");
    expect(candidate.requiresCoreCommit).toBe(true);
    expect(candidate.epistemicStatus).toBe("GENERATED");
  });
  it("requires Human Authority for human review and decision", () => {
    expect(() => authorizeCoreOperation({ operation: "HUMAN_DECISION_APPEND", sourceLayer: "BRAIN", authority: "SYSTEM", humanApproved: false })).toThrow("requires HUMAN authority");
    expect(authorizeCoreOperation({ operation: "HUMAN_DECISION_APPEND", sourceLayer: "BRAIN", authority: "HUMAN", humanApproved: true }).allowed).toBe(true);
  });
  it("prevents silent epistemic promotion", () => {
    expect(isEpistemicPromotionForbidden("UNKNOWN", "FACT")).toBe(true);
    expect(isEpistemicPromotionForbidden("GENERATED", "FACT")).toBe(true);
    expect(isEpistemicPromotionForbidden("FACT", "FACT")).toBe(false);
  });
  it("isolates failures and emits bounded boundary telemetry", () => {
    expect(isolationPolicy().BRAIN_FAILURE).toBe("CORE_SURVIVES");
    expect(isolationPolicy().WEBXR_FAILURE).toContain("FALLBACK");
    expect(boundaryEvent({ layer: "BRAIN", actorId: "user-1", projectId: "P-1", authority: "SYSTEM", operation: "ANALYZE", result: "GENERATED" })).toMatchObject({ type: "ARKI_BOUNDARY_EVENT", privatePayloadIncluded: false, projectId: "P-1" });
  });
  it("proves the vertical Edge -> Brain -> Core -> History -> Reopen flow", () => {
    const proof = verticalFlowProof();
    expect(proof.flow).toEqual(["USER", "EDGE", "PARAMETRIC_EXPLORE", "BRAIN_ANALYSIS", "USER_APPLY", "COMMAND_RESOLUTION", "CORE_VALIDATION", "PROJECT_STATE", "HISTORY", "CLOSE", "REOPEN"]);
    expect(proof.preview.projectStateEffect).toBe("NO_CANONICAL_MUTATION");
    expect(proof.candidate.requiresCoreCommit).toBe(true);
    expect(proof.committed.canonical).toBe(true);
    expect(proof.reopenedCanonical).toBe(true);
  });
});
