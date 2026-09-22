import { describe, expect, it } from "vitest";
import { ARKI_TYPOLOGIES, arkiTypologySummary, getArkiTypology, instantiateArkiTypology } from "../shared/arkiTypologyLibrary";

describe("ARKI typology library", () => {
  it("contains the complete declarative catalog with unique IDs", () => {
    expect(arkiTypologySummary().total).toBeGreaterThanOrEqual(40);
    expect(ARKI_TYPOLOGIES.length).toBeGreaterThanOrEqual(51);
    expect(new Set(ARKI_TYPOLOGIES.map((item) => item.id)).size).toBe(ARKI_TYPOLOGIES.length);
    expect(ARKI_TYPOLOGIES.every((item) => item.parameters.length >= 5 && item.ruleDomains.length > 0 && item.evidenceRequired.length > 0)).toBe(true);
  });

  it("covers the requested building, landscape and urban scales", () => {
    expect(getArkiTypology("HEALTH_HOSPITAL_GENERAL")?.name).toBe("Hospital general");
    expect(getArkiTypology("TRANS_AEROPUERTO")?.ruleDomains).toContain("OACI");
    expect(getArkiTypology("URB_CIUDAD")?.scale).toBe("CITY");
    expect(getArkiTypology("LAND_HUMEDAL_ARTIFICIAL")?.category).toBe("LANDSCAPE");
  });

  it("creates a proposal without approving or mutating Project State", () => {
    const proposal = instantiateArkiTypology("HEALTH_HOSPITAL_GENERAL", { capacity: 400, country: "PE" });
    expect(proposal).toMatchObject({ typologyId: "HEALTH_HOSPITAL_GENERAL", status: "AI_PROPOSED", humanReviewRequired: true });
    expect(proposal?.parameters.capacity).toBe(400);
    expect(instantiateArkiTypology("NOT_FOUND")).toBeNull();
  });
});
