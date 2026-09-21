import { describe, expect, it } from "vitest";
import { ARKI_RESEARCH_SUPERPOWER, authorizeResearchWrite, buildExcelReviewRow, closeResearchInternetAccess, grantResearchInternetLease, isAllowedResearchUrl, normalizeResearchUrl, researchCyclePolicy, researchInternetLeaseStatus, reviewResearchCandidate, stageResearchCandidate } from "./arkiResearchSuperpower";

describe("ARKI web research superpower", () => {
  it("is bounded, provenance-first and human-gated", () => {
    expect(ARKI_RESEARCH_SUPERPOWER.invariants).toContain("NO_UNBOUNDED_CRAWLING");
    expect(ARKI_RESEARCH_SUPERPOWER.invariants).toContain("NO_AUTOMATIC_FACT_PROMOTION");
    expect(ARKI_RESEARCH_SUPERPOWER.invariants).toContain("NO_RESEARCH_WITHOUT_ACTIVE_LEASE");
    expect(researchCyclePolicy().scheduleEnabled).toBe(true);
    expect(ARKI_RESEARCH_SUPERPOWER.maxPagesPerCycle).toBe(30);
    expect(ARKI_RESEARCH_SUPERPOWER.preferredSourceHost).toBe("archive.org");
    expect(ARKI_RESEARCH_SUPERPOWER.defaultLeaseMinutes).toBe(10);
  });

  it("allowlists public architecture sources and blocks private hosts", () => {
    expect(isAllowedResearchUrl("https://www.pritzkerprize.com/laureates")).toBe(true);
    expect(isAllowedResearchUrl("https://archdaily.com/example")).toBe(true);
    expect(isAllowedResearchUrl("https://archive.org/details/example")).toBe(true);
    expect(isAllowedResearchUrl("http://localhost:3000/private")).toBe(false);
    expect(isAllowedResearchUrl("https://127.0.0.1/admin")).toBe(false);
    expect(normalizeResearchUrl("https://www.dezeen.com/article#fragment")).toBe("https://www.dezeen.com/article");
  });

  it("requires owner authority and closes the research lease explicitly", () => {
    closeResearchInternetAccess();
    expect(researchInternetLeaseStatus().active).toBe(false);
    expect(() => grantResearchInternetLease({ ownerAuthorized: false })).toThrow("OWNER_HUMAN_AUTHORITY_REQUIRED");
    const lease = grantResearchInternetLease({ ownerAuthorized: true });
    expect(lease.durationMinutes).toBe(10);
    expect(researchInternetLeaseStatus().active).toBe(true);
    expect(() => grantResearchInternetLease({ ownerAuthorized: true, durationMinutes: 11 })).toThrow("EXPLICIT_OWNER_EXTENSION_REQUIRED");
    const extended = grantResearchInternetLease({ ownerAuthorized: true, durationMinutes: 11, explicitlyExtended: true });
    expect(extended.explicitlyExtended).toBe(true);
    closeResearchInternetAccess();
    expect(researchInternetLeaseStatus().active).toBe(false);
  });

  it("stages Excel rows without promoting them to canonical knowledge", () => {
    const row = buildExcelReviewRow({ sourceId: "WEB-001", title: "A public architecture page", url: "https://www.archdaily.com/example", topic: "hospital design", abstract: "Abstract only", terms: ["atrium", "daylight"] });
    expect(row.DESTINO).toBe("EXCEL_REVIEW_STAGING");
    expect(row.NOTAS).toContain("HUMAN_REVIEW_REQUIRED=YES");
    expect(authorizeResearchWrite({ humanApproved: false, rights: "UNKNOWN", target: "EXCEL_REVIEW_STAGING" }).allowed).toBe(false);
    expect(authorizeResearchWrite({ humanApproved: true, rights: "UNKNOWN", target: "EXCEL_REVIEW_STAGING" }).allowed).toBe(true);
    expect(authorizeResearchWrite({ humanApproved: true, rights: "OPEN_LICENSE", target: "CANONICAL_CORE" }).allowed).toBe(false);
  });

  it("supports correction and explicit owner review without Core promotion", () => {
    const staged = stageResearchCandidate({ sourceId: "WEB-REVIEW-001", title: "Review source", url: "https://www.archdaily.com/review", topic: "architecture", abstract: "Candidate", terms: ["courtyard"] });
    const reviewed = reviewResearchCandidate(staged.candidateId, "APPROVED_FOR_CORE", { abstract: "Corrected candidate", terms: ["courtyard", "daylight"] });
    expect(reviewed.reviewDecision).toBe("APPROVED_FOR_CORE");
    expect(reviewed.correctedTerms).toEqual(["courtyard", "daylight"]);
    expect(authorizeResearchWrite({ humanApproved: true, rights: "OPEN_LICENSE", target: "CANONICAL_CORE" }).allowed).toBe(false);
  });
});
