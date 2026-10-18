import { describe, expect, it } from "vitest";
import { ARKI_AUTHORIZED_POWER_SET, authorityFor, getArkiAuthorityProfile } from "./arkiAuthorityProfile";
import { executeActivationRun } from "./arkiActivationOrchestrator";

describe("ARKI authority profile", () => {
  it("authorizes exactly the requested five pieces", () => {
    expect(ARKI_AUTHORIZED_POWER_SET).toEqual(["MC-02", "MC-03", "FKCG-02", "DS-EVAL-001", "DG-01B"]);
    expect(getArkiAuthorityProfile().powers).toHaveLength(5);
    expect(getArkiAuthorityProfile().invariant).toBe("HUMAN_AUTHORITY_FINAL");
  });

  it("assigns operational powers and preserves each human gate", () => {
    expect(authorityFor("MC-02")?.mode).toBe("EXECUTION_AUTHORIZED");
    expect(authorityFor("MC-03")?.mode).toBe("EXECUTION_AUTHORIZED");
    expect(authorityFor("FKCG-02")?.mode).toBe("EVIDENCE_AUTHORIZED");
    expect(authorityFor("DS-EVAL-001")?.mode).toBe("EVIDENCE_AUTHORIZED");
    expect(authorityFor("DG-01B")?.mode).toBe("PROTOCOL_AUTHORIZED");
    expect(getArkiAuthorityProfile().powers.every((power) => power.humanGate.length > 0)).toBe(true);
  });

  it("attaches the authority profile to activation runs", () => {
    const run = executeActivationRun({ projectId: "AUT-HOR-001-001", projectName: "Authority test", typology: "MIXED_USE", brief: "Test case", context: {}, constraints: ["human review"], activities: [], relationships: [], subjects: [], conditions: [], unknowns: [], envelope: { width: 20, height: 20 }, sourceIds: [] });
    expect(run.authorityProfile.powers.map((power) => power.pieceId)).toEqual([...ARKI_AUTHORIZED_POWER_SET]);
    expect(run.humanAuthority).toBe("FINAL");
  });
});
