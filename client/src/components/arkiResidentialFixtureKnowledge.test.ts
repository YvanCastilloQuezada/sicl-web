import { describe, expect, it } from "vitest";
import { ARKI_FIXTURE_KNOWLEDGE_LIMITS, ARKI_RESIDENTIAL_FIXTURE_MINIMUMS, evaluateResidentialFixtureFit, fixtureMinimumFor, summarizeFixtureFit, validateFixtureKnowledge } from "./arkiResidentialFixtureKnowledge";
import { buildNeufertPlazolaCorrectedHouseProposal } from "./arkiNeufertPlazolaCorrectedHouse";

describe("residential fixture and sanitary minimum knowledge", () => {
  it("contains furniture, kitchen and sanitary fixture references", () => {
    expect(validateFixtureKnowledge()).toBe(true);
    expect(ARKI_RESIDENTIAL_FIXTURE_MINIMUMS.some((fixture) => fixture.id === "BED-DOUBLE")).toBe(true);
    expect(ARKI_RESIDENTIAL_FIXTURE_MINIMUMS.some((fixture) => fixture.id === "TOILET")).toBe(true);
    expect(ARKI_RESIDENTIAL_FIXTURE_MINIMUMS.some((fixture) => fixture.id === "KITCHEN-COUNTER")).toBe(true);
  });

  it("derives room envelopes from furniture and fixture clearances", () => {
    expect(fixtureMinimumFor("BATHROOM").map((fixture) => fixture.id)).toEqual(["TOILET", "LAVATORY", "SHOWER"]);
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const fit = evaluateResidentialFixtureFit(proposal.rooms);
    expect(summarizeFixtureFit(fit).insufficient).toBe(0);
    expect(fit.find((item) => item.programId === "BATHROOM")?.requiredWidthM).toBe(1.65);
    expect(fit.find((item) => item.programId === "BATHROOM")?.requiredDepthM).toBeCloseTo(1.8, 6);
  });

  it("rejects a room that is geometrically large enough by area but too narrow for use", () => {
    const proposal = buildNeufertPlazolaCorrectedHouseProposal();
    const bedroom = proposal.rooms.find((room) => room.id === "MASTER-N2")!;
    const fit = evaluateResidentialFixtureFit([{ ...bedroom, footprint: { minX: 0, minY: 0, maxX: 1.7, maxY: 12 }, areaM2: 20.4 }]);
    expect(fit[0].fits).toBe(false);
    expect(fit[0].status).toBe("INSUFFICIENT");
  });

  it("preserves epistemic and human-review limits", () => {
    expect(ARKI_FIXTURE_KNOWLEDGE_LIMITS.dimensionsAreNotUniversalCode).toBe(true);
    expect(ARKI_FIXTURE_KNOWLEDGE_LIMITS.humanReviewRequired).toBe(true);
  });
});
