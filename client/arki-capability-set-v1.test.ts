import { describe, expect, it } from "vitest";
import { buildCapabilityRegistry, buildCapabilitySetV1, buildFinalConvergenceProof, validateCapabilitySetV1 } from "./src/components/arkiCapabilitySetV1";

describe("ARKI Capability Set V1 after global unfreeze", () => {
  it("registers all authorized bounded surfaces without creating a new phase", () => {
    const registry = buildCapabilityRegistry();
    expect(registry.map((item) => item.id)).toEqual(expect.arrayContaining(["GDI-P9-P24", "A21-S2", "S1-S2", "V-A", "V-B", "V-C", "GIS-CADASTRE", "S3-S11", "S12-S18", "S19-S20"]));
    expect(registry.some((item) => item.id === "GDI-P25" || item.id === "S21" || item.id === "K12")).toBe(false);
    expect(registry.every((item) => item.humanAuthority === "PRESERVED")).toBe(true);
  });
  it("executes the authorized V-FINAL move as a child while preserving the parent", () => {
    const proof = buildFinalConvergenceProof();
    expect(proof.operation.state).toBe("EXECUTED");
    expect(proof.operation.parentUnchanged).toBe(true);
    expect(proof.childModel?.modelVersion).toBe(proof.parentModel.modelVersion);
    expect(proof.childViews.length).toBe(4);
    expect(proof.svgArtifacts.every((svg) => svg.includes("data-view-id"))).toBe(true);
    expect(proof.refreshed).toEqual(expect.arrayContaining(["geometry", "drawings", "visual", "engineering impact", "memory"]));
    expect(proof.humanReviewRequired).toBe(true);
    expect(proof.noAutomaticDecision).toBe(true);
    expect(proof.noAutomaticWinner).toBe(true);
  });
  it("validates the integrated Capability Set V1 deterministically", () => {
    const set = buildCapabilitySetV1();
    expect(validateCapabilitySetV1(set)).toBe(true);
    expect(set.status).toBe("IMPLEMENTED_WITH_EXPLICIT_OBSERVATIONS");
    expect(set.noNewPhaseCreated).toBe(true);
    expect(set.gdiPhases).toBe(16);
  });
  it("does not misrepresent external professional validation as local proof", () => {
    const set = buildCapabilitySetV1();
    expect(set.finalConvergence.exports.ifc).toBe("EXTERNAL_SPATIAL_REPRESENTATION_ADAPTER");
    expect(set.finalConvergence.exports.gis).toBe("REQUIRES_GEOREFERENCED_INPUT");
    expect(set.capabilities.find((item) => item.id === "V-C")?.state).toBe("EXTERNAL_VALIDATION_REQUIRED");
    expect(set.capabilities.find((item) => item.id === "S12-S18")?.observations.length).toBeGreaterThan(0);
  });
});
