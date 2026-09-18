import { describe, expect, it } from "vitest";
import { assessHouseVerticalCoherence, createHospitalVerticalValidationFixture, createHouseArchitecturalExample } from "./arquiResidentialExample";

describe("ARQUI residential example", () => {
  it("makes the house reasoning chain usable and preserves conceptual limits", () => {
    const example = createHouseArchitecturalExample();
    const result = assessHouseVerticalCoherence(example);
    expect(example.typology).toBe("SINGLE_FAMILY_HOUSE");
    expect(example.spaces).toHaveLength(6);
    expect(result.assessment.state).toBe("COHERENT");
    expect(result.assessment.massAlignment).toBe("SUPPORTED");
    expect(result.assessment.verticalCirculation).toBe("UNKNOWN");
    expect(example.spaces.every((space) => space.status !== "GEOMETRICALLY_REALIZED")).toBe(true);
    expect(example.facultyAssessment.humanAuthority).toBe("PRESERVED");
  });

  it("defines a hospital validation fixture without making compliance claims", () => {
    const fixture = createHospitalVerticalValidationFixture();
    expect(fixture.levels).toHaveLength(2);
    expect(fixture.members).toHaveLength(2);
    expect(fixture.expectedChecks).toContain("vertical core continuity");
    expect(fixture.expectedChecks).toContain("fire egress");
    expect(fixture.prohibitedClaims).toContain("code compliance");
    expect(fixture.prohibitedClaims).toContain("structural safety");
  });
});
