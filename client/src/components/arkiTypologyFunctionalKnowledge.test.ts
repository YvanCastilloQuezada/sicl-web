import { describe, expect, it } from "vitest";
import { ARKI_TYPOLOGY_FUNCTIONAL_PROFILES, buildFunctionalKnowledgeLesson, getTypologyFunctionalProfile, validateFunctionalRelation } from "./arkiTypologyFunctionalKnowledge";

describe("ARKI typology functional knowledge", () => {
  it("covers the eight comparable typology families without treating them as code", () => {
    expect(ARKI_TYPOLOGY_FUNCTIONAL_PROFILES).toHaveLength(8);
    expect(ARKI_TYPOLOGY_FUNCTIONAL_PROFILES.every((profile) => profile.epistemicStatus === "SOURCE_DERIVED_HYPOTHESIS")).toBe(true);
    expect(ARKI_TYPOLOGY_FUNCTIONAL_PROFILES.every((profile) => profile.humanReviewRequired)).toBe(true);
  });

  it("keeps residential kitchen-dining communication open-capable", () => {
    const residential = getTypologyFunctionalProfile("RESIDENTIAL");
    expect(validateFunctionalRelation(residential, "DINING", "KITCHEN")).toBe("PREFERRED");
    expect(residential.relations.some((relation) => relation.from === "DINING" && relation.to === "KITCHEN" && relation.kind === "ALLOWED_WITH_FILTER")).toBe(true);
    expect(residential.recurringInterfaces).toContain("open kitchen-dining connection");
  });

  it("distinguishes conflicts from preferences", () => {
    const healthcare = getTypologyFunctionalProfile("HEALTHCARE");
    expect(validateFunctionalRelation(healthcare, "CLEAN_STERILE", "DIRTY")).toBe("CONFLICT");
    expect(validateFunctionalRelation(healthcare, "PUBLIC_RECEPTION", "OUTPATIENT")).toBe("REQUIRED");
    expect(validateFunctionalRelation(healthcare, "UNKNOWN", "UNKNOWN")).toBe("UNKNOWN");
  });

  it("teaches a reusable function-first lesson", () => {
    const lesson = buildFunctionalKnowledgeLesson("RESIDENTIAL");
    expect(lesson.principle).toMatch(/Function before beauty/);
    expect(lesson.exercises).toHaveLength(4);
  });
});
