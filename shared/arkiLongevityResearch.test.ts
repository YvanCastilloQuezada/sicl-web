import { describe, expect, it } from "vitest";
import {
  ARKI_LONGEVITY_RESEARCH,
  getLongevityResearchStatus,
  isLongevityResearchActive
} from "./arkiLongevityResearch";

describe("ARKI Longevity Research Module", () => {
  it("declares OUT_OF_SCOPE status", () => {
    expect(ARKI_LONGEVITY_RESEARCH.status).toBe("OUT_OF_SCOPE");
    expect(ARKI_LONGEVITY_RESEARCH.scope).toBe("RESEARCH_ONLY");
  });

  it("is not active", () => {
    expect(isLongevityResearchActive()).toBe(false);
  });

  it("declares no integration with ARKI", () => {
    expect(ARKI_LONGEVITY_RESEARCH.integration).toBe("NONE");
  });

  it("documents ethical boundaries", () => {
    const boundaries = ARKI_LONGEVITY_RESEARCH.ethicalBoundaries;
    expect(boundaries.length).toBeGreaterThan(0);
    expect(boundaries.some(b => b.includes("No ofrecer tratamientos"))).toBe(true);
  });

  it("returns status correctly", () => {
    const status = getLongevityResearchStatus();
    expect(status.status).toBe("OUT_OF_SCOPE");
    expect(status.scope).toBe("RESEARCH_ONLY");
    expect(status.integration).toBe("NONE");
    expect(status.boundaries.length).toBeGreaterThan(0);
  });
});
