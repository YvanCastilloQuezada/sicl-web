import { describe, expect, it } from "vitest";
import { ingestS10NormalizedEnvelope, normalizeS10Project, reconcileS10Projects, S10_INTEROP_BOUNDARY, toProjectCostBaseline, verifyS10Apus, verifyS10Totals } from "./arkiS10Interop";

function s10(items: Array<{ itemId: string; code: string; description: string; unit: string; quantity: number; unitPrice: number; sourceRef: string; apuRef?: string }>) {
  return normalizeS10Project({
    projectId: "P1", sourceId: "EXPORT-1", sourceFormat: "STRUCTURED_EXPORT", sourceChecksum: "sha256:abc",
    effectiveDate: "2026-10-07", currency: "PEN", items, evidenceState: "VERIFIED_STRUCTURE", unknowns: [],
  });
}

describe("S10 project-local interoperability", () => {
  it("fails closed on malformed runtime S10 envelopes", () => {
    expect(() => ingestS10NormalizedEnvelope({
      projectId: "P1", sourceId: "X", sourceFormat: "STRUCTURED_EXPORT", sourceChecksum: "x", effectiveDate: "2026-10-07",
      currency: "PEN", items: [], evidenceState: "VERIFIED_STRUCTURE", unknowns: [], canonicalGeometry: true,
    })).toThrow("S10_ENVELOPE_INVALID");
  });

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
    const before = normalizeS10Project({
      projectId: "P1", sourceId: "EXPORT-1", sourceFormat: "STRUCTURED_EXPORT", sourceChecksum: "sha256:abc",
      effectiveDate: "2026-10-07", currency: "PEN", evidenceState: "VERIFIED_STRUCTURE", unknowns: [],
      items: [
        { itemId: "I1", code: "01.01", description: "Wall", unit: "m2", quantity: 10, unitPrice: 100, sourceRef: "S10:A", apuRef: "APU-1" },
        { itemId: "I2", code: "02.01", description: "Old", unit: "u", quantity: 1, unitPrice: 50, sourceRef: "S10:B" },
      ],
      apus: [{ apuId: "APU-1", itemCode: "01.01", sourceRef: "S10:APU-1", components: [] }],
    });
    const after = normalizeS10Project({
      projectId: "P1", sourceId: "EXPORT-2", sourceFormat: "STRUCTURED_EXPORT", sourceChecksum: "sha256:def",
      effectiveDate: "2026-10-07", currency: "PEN", evidenceState: "VERIFIED_STRUCTURE", unknowns: [],
      items: [
        { itemId: "I1", code: "01.01", description: "Wall", unit: "m2", quantity: 12, unitPrice: 110, sourceRef: "S10:C", apuRef: "APU-2" },
        { itemId: "I3", code: "03.01", description: "New", unit: "u", quantity: 1, unitPrice: 30, sourceRef: "S10:D" },
      ],
      apus: [{ apuId: "APU-2", itemCode: "01.01", sourceRef: "S10:APU-2", components: [] }],
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

  it("preserves budget hierarchy, APU resources and reconciles declared direct cost", () => {
    const project = normalizeS10Project({
      projectId: "P1", sourceId: "NATIVE-1", sourceFormat: "STRUCTURED_EXPORT", sourceChecksum: "sha256:s10",
      effectiveDate: "2026-10-07", currency: "PEN", evidenceState: "VERIFIED_STRUCTURE", unknowns: [],
      resources: [{ resourceId: "R1", code: "MAT-1", description: "Brick", unit: "u", unitPrice: 20, resourceType: "MATERIAL", sourceRef: "S10:R1" }],
      apus: [{ apuId: "APU-1", itemCode: "01.01", sourceRef: "S10:APU-1", components: [{ resourceId: "R1", quantity: 5, sourceRef: "S10:APU-1:R1" }] }],
      items: [{ itemId: "I1", code: "01.01", description: "Wall", unit: "m2", quantity: 10, unitPrice: 100, sourceRef: "S10:I1", apuRef: "APU-1" }],
      budgetNodes: [{ nodeId: "N1", code: "01", description: "Architecture", itemCodes: ["01.01"], sourceRef: "S10:N1" }],
      declaredTotals: { directCost: 1000, total: 1180, tax: 180, sourceRef: "S10:TOTALS" },
    });
    expect(project.apus?.[0].components[0].resourceId).toBe("R1");
    expect(project.budgetNodes?.[0].itemCodes).toEqual(["01.01"]);
    expect(verifyS10Totals(project)).toMatchObject({ status: "RECONCILED", delta: 0, footDelta: 0 });
    expect(verifyS10Apus(project)).toMatchObject({ status: "RECONCILED" });
  });

  it("detects APU composition mismatch independently from item totals", () => {
    const project = normalizeS10Project({
      projectId: "P1", sourceId: "APU-MISMATCH", sourceFormat: "STRUCTURED_EXPORT", sourceChecksum: "sha256:a",
      effectiveDate: "2026-10-07", currency: "PEN", evidenceState: "VERIFIED_STRUCTURE", unknowns: [],
      resources: [{ resourceId: "R1", code: "MAT", description: "Material", unit: "u", unitPrice: 10, resourceType: "MATERIAL", sourceRef: "S10:R" }],
      apus: [{ apuId: "A1", itemCode: "01", sourceRef: "S10:A", components: [{ resourceId: "R1", quantity: 5, sourceRef: "S10:AC" }] }],
      items: [{ itemId: "I1", code: "01", description: "Item", unit: "u", quantity: 1, unitPrice: 100, sourceRef: "S10:I", apuRef: "A1" }],
    });
    expect(verifyS10Apus(project)).toMatchObject({ status: "MISMATCH" });
    expect(verifyS10Apus(project).results[0]).toMatchObject({ calculatedUnitPrice: 50, declaredUnitPrice: 100, delta: -50 });
  });

  it("does not hide a direct-cost mismatch behind declared S10 totals", () => {
    const project = normalizeS10Project({
      projectId: "P1", sourceId: "REPORT-1", sourceFormat: "REPORT_EXTRACTION", sourceChecksum: "sha256:r",
      effectiveDate: "2026-10-07", currency: "PEN", evidenceState: "PARTIAL", unknowns: ["REPORT_EXTRACTION"],
      items: [{ itemId: "I1", code: "01.01", description: "Wall", unit: "m2", quantity: 10, unitPrice: 100, sourceRef: "REPORT:P1" }],
      declaredTotals: { directCost: 999, total: 999, sourceRef: "REPORT:TOTAL" },
    });
    expect(verifyS10Totals(project)).toMatchObject({ status: "MISMATCH", calculatedDirectCost: 1000, declaredDirectCost: 999, delta: 1 });
  });

  it("fails closed across project or currency boundaries", () => {
    const before = s10([]);
    const otherProject = normalizeS10Project({ ...before, projectId: "P2", sourceId: "E2", sourceChecksum: "x" });
    expect(() => reconcileS10Projects(before, otherProject)).toThrow("S10_RECONCILIATION_PROJECT_MISMATCH");
    const otherCurrency = normalizeS10Project({ ...before, currency: "USD", sourceId: "E3", sourceChecksum: "y" });
    expect(() => reconcileS10Projects(before, otherCurrency)).toThrow("S10_RECONCILIATION_CURRENCY_MISMATCH");
  });
});
