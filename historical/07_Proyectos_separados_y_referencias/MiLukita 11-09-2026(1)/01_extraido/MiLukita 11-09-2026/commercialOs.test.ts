import { describe, expect, it } from "vitest";
import { COMMERCIAL_AUTHORITY_BOUNDARY, commercialCanMutateCore, createEmptyCommercialState, filterCommercialPipeline, qualifyLead } from "./commercialOs";

describe("Commercial OS governance", () => {
  it("starts without audience or revenue claims", () => {
    const state = createEmptyCommercialState();
    expect(state.audience.evidence).toBe("NO_DATA");
    expect(state.audience.dau).toBeNull();
    expect(state.realMoneyEnabled).toBe(false);
    expect(state.externalIntegrationsEnabled).toBe(false);
  });

  it("keeps commercial agents unable to mutate Core", () => {
    expect(commercialCanMutateCore()).toBe(false);
    expect(COMMERCIAL_AUTHORITY_BOUNDARY).toContain("MJP_CORE");
    expect(COMMERCIAL_AUTHORITY_BOUNDARY).toContain("MjpTvManifest");
  });

  it("qualifies only scored leads and preserves explicit statuses", () => {
    expect(qualifyLead(null)).toBe("NO_DATA");
    expect(qualifyLead(30)).toBe("LOW");
    expect(qualifyLead(61)).toBe("HIGH");
    expect(qualifyLead(90)).toBe("PRIORITY");
    const leads = [{ id: "1", companyName: "Empresa autorizada", category: "Retail", source: "MANUAL" as const, score: 70, status: "QUALIFIED" as const, consentState: "AUTHORIZED" as const, lastContactedAt: null }];
    expect(filterCommercialPipeline(leads, "QUALIFIED")).toHaveLength(1);
    expect(filterCommercialPipeline(leads, "PAUSED")).toHaveLength(0);
  });
});
