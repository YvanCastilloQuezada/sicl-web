import { describe, expect, it } from "vitest";
import { CAPABILITY_GATE_STAGES, SICL_65_CAPABILITY_GATES, isSequentialCapabilityGateLedger } from "@shared/siclGovernance";

describe("Capability Gate Ledger", () => {
  it("keeps the approved stages in strict sequential order", () => {
    expect(isSequentialCapabilityGateLedger(SICL_65_CAPABILITY_GATES)).toBe(true);
    expect(SICL_65_CAPABILITY_GATES.map((record) => record.stage)).toEqual([...CAPABILITY_GATE_STAGES]);
  });

  it("requires construction roles and traceable references", () => {
    expect(new Set(SICL_65_CAPABILITY_GATES.map((record) => record.owner))).toEqual(new Set(["PRODUCT_OWNER", "CHIEF_ARCHITECT", "IMPLEMENTATION_ENGINEER"]));
    expect(SICL_65_CAPABILITY_GATES.every((record) => record.reference.trim().length > 0)).toBe(true);
  });

  it("contains no domain decision or alternative authority fields", () => {
    expect(SICL_65_CAPABILITY_GATES.every((record) => !Object.hasOwn(record, "decision") && !Object.hasOwn(record, "selectedAlternativeId"))).toBe(true);
  });
});
