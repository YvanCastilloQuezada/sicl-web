import { describe, expect, it } from "vitest";
import { ARKI_RESEARCH_SUPERPOWER, authorizeResearchWrite, buildExcelReviewRow, isAllowedResearchUrl, normalizeResearchUrl, researchCyclePolicy } from "./arkiResearchSuperpower";

describe("ARKI web research superpower", () => {
  it("is bounded, provenance-first and human-gated", () => {
    expect(ARKI_RESEARCH_SUPERPOWER.invariants).toContain("NO_UNBOUNDED_CRAWLING");
    expect(ARKI_RESEARCH_SUPERPOWER.invariants).toContain("NO_AUTOMATIC_FACT_PROMOTION");
    expect(researchCyclePolicy().scheduleEnabled).toBe(false);
  });

  it("allowlists public architecture sources and blocks private hosts", () => {
    expect(isAllowedResearchUrl("https://www.pritzkerprize.com/ laureates".replace(" ", ""))).toBe(true);
    expect(isAllowedResearchUrl("https://archdaily.com/example")).toBe(true);
    expect(isAllowedResearchUrl("http://localhost:3000/private")).toBe(false);
    expect(isAllowedResearchUrl("https://127.0.0.1/admin")).toBe(false);
    expect(normalizeResearchUrl("https://www.dezeen.com/article#fragment")).toBe("https://www.dezeen.com/article");
  });

  it("stages Excel rows without promoting them to canonical knowledge", () => {
    const row = buildExcelReviewRow({ sourceId: "WEB-001", title: "A public architecture page", url: "https://www.archdaily.com/example", topic: "hospital design", abstract: "Abstract only", terms: ["atrium", "daylight"] });
    expect(row.DESTINO).toBe("EXCEL_REVIEW_STAGING");
    expect(row.NOTAS).toContain("HUMAN_REVIEW_REQUIRED=YES");
    expect(authorizeResearchWrite({ humanApproved: false, rights: "UNKNOWN", target: "EXCEL_REVIEW_STAGING" }).allowed).toBe(false);
    expect(authorizeResearchWrite({ humanApproved: true, rights: "UNKNOWN", target: "EXCEL_REVIEW_STAGING" }).allowed).toBe(true);
    expect(authorizeResearchWrite({ humanApproved: true, rights: "OPEN_LICENSE", target: "CANONICAL_CORE" }).allowed).toBe(false);
  });
});
