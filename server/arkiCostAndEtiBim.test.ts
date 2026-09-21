import { describe, expect, it } from "vitest";
import { calculateArkiCostModel } from "./arkiCostIntelligence";
import { DEFAULT_EXPEDIENTE_BIM_CONTAINERS, buildEtiBimPackage } from "./arkiEtiBim";

const source = { sourceDocument: "quotation-001.pdf", sourcePage: "2", region: "La Libertad", taxStatus: "EXCLUDED" as const };

describe("ARKI cost and ETI-BIM contracts", () => {
  it("keeps market evidence, tax and source warnings explicit", () => {
    const result = calculateArkiCostModel({
      projectId: "TRU-HOS-400-001",
      currency: "PEN",
      overheadRate: 0.1,
      profitRate: 0.08,
      taxRate: 0.18,
      lines: [{ id: "P-001", type: "QUOTATION", description: "Concrete", unit: "m3", quantity: 10, unitPrice: 250, currency: "PEN", confidence: "VERIFIED", ...source }],
    });
    expect(result.schema).toBe("ARKI-COST-MODEL-1.0");
    expect(result.directCost).toBe(2500);
    expect(result.total).toBe(3504.6);
    expect(result.evidenceByType.QUOTATION).toBe(1);
    expect(result.humanReviewRequired).toBe(true);
    expect(result.marketResearch.automaticInternetPurchase).toBe(false);
  });

  it("does not treat an IUPC reference as a local quotation", () => {
    const result = calculateArkiCostModel({ projectId: "TRU-HOS-400-001", currency: "PEN", lines: [{ id: "IUPC-01", type: "IUPC_REFERENCE", description: "Reference index", unit: "index", quantity: 1, unitPrice: 100, currency: "PEN", confidence: "DECLARED", taxStatus: "UNKNOWN", sourceDocument: "INEI bulletin" }] });
    expect(result.warnings).toContain("IUPC_IS_REFERENCE_NOT_LOCAL_QUOTATION:IUPC-01");
    expect(result.warnings).toContain("TAX_STATUS_UNKNOWN:IUPC-01");
    expect(result.marketResearch.priceAdoptionStatus).toBe("CANDIDATES_ONLY");
  });

  it("blocks ETI-BIM readiness when required containers or evidence are missing", () => {
    const result = buildEtiBimPackage({ projectId: "TRU-HOS-400-001", typology: "HOSPITAL", jurisdiction: "PE-TRU", phase: "DESIGN", items: [{ id: "ARCH-001", block: "ENGINEERING_AND_DETAIL", discipline: "ARCHITECTURE", title: "Plans", status: "PRESENT", sourceIds: ["SRC-001"] }], bimContainers: [{ type: "PIR", id: "PIR-001", status: "PRESENT", sourceIds: ["SRC-001"] }] });
    expect(result.status).toBe("INCOMPLETE");
    expect(result.missingBimContainers).toEqual(expect.arrayContaining(DEFAULT_EXPEDIENTE_BIM_CONTAINERS.filter((type) => type !== "PIR")));
    expect(result.gates.bimInformationRequirements).toBe("BLOCKED");
    expect(result.gates.costTraceability).toBe("BLOCKED");
    expect(result.humanAuthority).toBe("FINAL");
  });
});
