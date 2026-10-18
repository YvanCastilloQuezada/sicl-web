import { describe, expect, it } from "vitest";
import { DEPENDENCY_REGISTRY, HUMAN_APPROVAL_MATRIX, LEGAL_ALLOWED_ACTIONS, LEGAL_FORBIDDEN_ACTIONS, ORDER_THREE_STATE_EQUIVALENCE, SYSTEM_TRUTH_REGISTRY, getMasterOrderSummary, isExpansionFrozen, isProtectedCoreSurface, canLegalExecute, legalClaimGuardStatus, MASTER_ORDER, MASTER_ORGANIGRAM } from "./milukitaMasterOrder";

describe("Milukita Master Order", () => {
  it("freezes expansion without disabling protected product operation", () => {
    expect(isExpansionFrozen()).toBe(true);
    expect(getMasterOrderSummary().protectedCoreCount).toBe(8);
    expect(getMasterOrderSummary().lrciDomains).toBe(13);
    expect(getMasterOrderSummary().reservedDomains).toBe(3);
  });

  it("registers Legal & Compliance as planned and disabled", () => {
    const summary = getMasterOrderSummary();
    expect(summary.legalStatus).toBe("PLANNED");
    expect(summary.legalExecution).toBe("DISABLED");
    expect(summary.legalClaimGuard).toBe("RESERVED_DISABLED");
    expect(canLegalExecute("READ")).toBe(false);
  });

  it("keeps legal authority bounded", () => {
    expect(LEGAL_ALLOWED_ACTIONS).toContain("PROPOSE");
    expect(LEGAL_FORBIDDEN_ACTIONS).toContain("MODIFY_MJP_CORE");
    expect(isProtectedCoreSurface("MJP_TV_MANIFEST")).toBe(true);
    expect(legalClaimGuardStatus()).toBe("RESERVED_DISABLED");
  });

  it("does not treat forbidden actions as executable", () => {
    for (const action of LEGAL_FORBIDDEN_ACTIONS) expect(canLegalExecute(action)).toBe(false);
  });

  it("registers the three experiences with conservative operational states", () => {
    expect(getMasterOrderSummary().experienceCount).toBe(3);
    expect(MASTER_ORDER.experiences.kids.state).toBe("PLANNED");
    expect(MASTER_ORDER.experiences.kids.execution).toBe("DISABLED");
    expect(MASTER_ORDER.experiences.main.state).toBe("PARTIALLY_IMPLEMENTED");
    expect(MASTER_ORDER.experiences.olderAdults.execution).toBe("DISABLED");
  });

  it("orders the constitutional layers above the protected core", () => {
    expect(MASTER_ORDER.constitutionalLayers[0]).toBe("MILUKITA NETWORK");
    expect(MASTER_ORDER.constitutionalLayers[MASTER_ORDER.constitutionalLayers.length - 1]).toBe("MJP CORE");
    expect(MASTER_ORGANIGRAM.map((group) => group.layer)).toEqual(MASTER_ORDER.constitutionalLayers);
    expect(getMasterOrderSummary().qualityGateCount).toBe(12);
  });

  it("keeps future distribution and legal capabilities conservative", () => {
    expect(MASTER_ORDER.externalDistribution.FAST).toBe("EXTERNAL_REQUIRED");
    expect(MASTER_ORDER.externalDistribution.OTT).toBe("EXTERNAL_REQUIRED");
    expect(MASTER_ORDER.legalCompliance.autonomy).toBe(0);
    expect(MASTER_ORDER.legalCompliance.execution).toBe("DISABLED");
  });

  it("maps the Order 3 terminology to the constitutional state model without hiding non-operation", () => {
    expect(ORDER_THREE_STATE_EQUIVALENCE.IMPLEMENTED).toBe("EXISTING");
    expect(ORDER_THREE_STATE_EQUIVALENCE.PARTIAL).toBe("PARTIALLY_IMPLEMENTED");
    expect(ORDER_THREE_STATE_EQUIVALENCE.NOT_IMPLEMENTED).toBe("NOT_IMPLEMENTED");
    expect(getMasterOrderSummary().sourceDocumentCount).toBe(3);
  });

  it("keeps the truth, dependency and human approval registries evidence-based", () => {
    expect(getMasterOrderSummary().truthRegistryCount).toBe(SYSTEM_TRUTH_REGISTRY.length);
    expect(SYSTEM_TRUTH_REGISTRY.find((entry) => entry.capability === "FAST / OTT / IPTV")?.state).toBe("EXTERNAL_REQUIRED");
    expect(SYSTEM_TRUTH_REGISTRY.find((entry) => entry.capability === "Legal & Compliance Intelligence")?.state).toBe("NOT_IMPLEMENTED");
    expect(DEPENDENCY_REGISTRY.find((entry) => entry.dependency === "Pagos, KYC/AML y dinero real")?.state).toBe("DISABLED");
    expect(HUMAN_APPROVAL_MATRIX.every((entry) => entry.required)).toBe(true);
  });
});
