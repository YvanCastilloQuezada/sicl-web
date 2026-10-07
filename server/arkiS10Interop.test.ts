import { describe, expect, it } from "vitest";
import { normalizeS10Project, reconcileS10Projects, S10_INTEROP_BOUNDARY, toProjectCostBaseline } from "./arkiS10Interop";

function s10(items: Array<{ itemId: string; code: string; description: string; unit: string; quantity: number; unitPrice: number; sourceRef: string; apuRef?: string }>) {
  return normalizeS10Project({
    projectId: "P1", sourceId: "EXPORT-1", sourceFormat: "STRUCTURED_EXPORT", sourceChecksum: "sha256:abc",
    effectiveDate: "2026-10-07", currency: "PEN", items, evidenceState: "VERIFIED_STRUCTURE", unknowns: [],
  });
}

describe("S10 project-local interoperability", () => {
  it("normalizes S10 evidence into an immutable project cost baseline without claiming global truth", () => {
    const source = s10([{ itemId: "I1", code: "01.01", description: "Wall", unit: "m2", quantity: 10, unitPrice: 100, sourceRef: "S10:01.01" }]);
    const baseline = toProjectCostBaseline(source);
    expect(baseline.projectId).toBe("P1");
    expect(baseline.immutable).toBe(true);
    expect(baseline.items[0].sourceRef).toBe("S10:01.01");
    expect(S10_INTEROP_BOUNDARY.sourceAuthority).toBe("PROJECT_LOCAL_EVIDENCE");
    expect(S10_INTEROP_BOUNDARY.canonicalGeometryAuthority).toBe(false);
  });

  it("reconciles quantity, price, APU, additions and removals deterministically", () => {
    const before = s10([
      { itemId: "I1", code: "01.01", description: "Wall", unit: "m2", quantity: 10, unitPrice: 100, sourceRef: "S10:A", apuRef: "APU-1" },
      { itemId: "I2", code: "02.01", description: "Old", unit: "u", quantity: 1, unitPrice: 50, sourceRef: "S10:B" },
    ]);
    const after = normalizeS10Project({
      ...before, sourceId: "EXPORT-2", sourceChecksum: "sha256:def",
      items: [
        { itemId: "I1", code: "01.01", description: "Wall", unit: "m2", quantity: 12, unitPrice: 110, sourceRef: "S10:C", apuRef: "APU-2" },
        { itemId: "I3", code: "03.01", description: "New", unit: "u", quantity: 1, unitPrice: 30, sourceRef: "S10:D" },
      ],
    });
    const result = reconcileS10Projects(before, after);
    expect(result.status).toBe("RECONCILED");
    expect(result.changes.map(x => x.kind)).toEqual(expect.arrayContaining(["QUANTITY_CHANGED", "PRICE_CHANGED", "APU_CHANGED", "REMOVED", "ADDED"]));
    expect(result.directCostBefore).toBe(1050);
    expect(result.directCostAfter).toBe(1350);
    expect(result.directCostDelta).toBe(300);
    expect(result.writeBackClaim).toBe(false);
    expect(S10_INTEROP_BOUNDARY.notClaimed).toContain("S10_ROUND_TRIP");
  });

  it("fails closed across project or currency boundaries", () => {
    const before = s10([]);
    const otherProject = normalizeS10Project({ ...before, projectId: "P2", sourceId: "E2", sourceChecksum: "x" });
    expect(() => reconcileS10Projects(before, otherProject)).toThrow("S10_RECONCILIATION_PROJECT_MISMATCH");
    const otherCurrency = normalizeS10Project({ ...before, currency: "USD", sourceId: "E3", sourceChecksum: "y" });
    expect(() => reconcileS10Projects(before, otherCurrency)).toThrow("S10_RECONCILIATION_CURRENCY_MISMATCH");
  });
});
