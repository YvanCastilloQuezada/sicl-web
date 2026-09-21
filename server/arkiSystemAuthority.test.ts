import { describe, expect, it } from "vitest";
import { ARKI_SYSTEM_AUTHORITY, ARKI_SYSTEM_POWER_SET, getArkiSystemAuthority, hasSystemPower } from "./arkiSystemAuthority";

describe("ARKI system authority 2.0", () => {
  it("exposes the full governed super-architect power set", () => {
    const profile = getArkiSystemAuthority();
    expect(profile.version).toBe("ARKI-SYSTEM-AUTHORITY-2.0");
    expect(profile.mode).toBe("SUPER_ARCHITECT_GOVERNED");
    expect(profile.oneMotor).toBe(true);
    expect(profile.powers.length).toBe(ARKI_SYSTEM_POWER_SET.length);
    expect(profile.powers.length).toBeGreaterThanOrEqual(20);
  });

  it("includes research, synthesis, evaluation, representation and governance powers", () => {
    for (const power of ["KNOWLEDGE_RETRIEVAL", "TYPOLOGY_TRANSFER", "PARTI_GENERATION", "TOPOLOGY_GENERATION", "CONCEPTUAL_GEOMETRY", "ADVERSARIAL_EVALUATION", "MUTATION_REJECTION_BACKTRACK", "FROZEN_ORDER_EXECUTION", "APPLICABILITY_PROTOCOL_EXECUTION", "CONCEPTUAL_EXPORT_PREPARATION", "HUMAN_REVIEW_HANDOFF"]) expect(hasSystemPower(power)).toBe(true);
    expect(new Set(ARKI_SYSTEM_AUTHORITY.map((item) => item.class)).size).toBeGreaterThanOrEqual(4);
  });

  it("preserves professional and epistemic boundaries", () => {
    const profile = getArkiSystemAuthority();
    expect(profile.invariant).toBe("HUMAN_AUTHORITY_FINAL");
    expect(profile.nativeProfessionalExport).toBe(false);
    expect(profile.autonomousProfessionalSignoff).toBe(false);
    expect(profile.powers.every((power) => power.gate.length > 0 && power.prohibitedClaim.length > 0 && power.humanReview.length > 0)).toBe(true);
  });
});
