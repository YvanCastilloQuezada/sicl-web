import { describe, expect, it } from "vitest";
import { enablementFailures, solverCandidates } from "./solverCatalog";

describe("solver harvest catalog", () => {
  it("records broad solver coverage without pretending candidates are integrated", () => {
    const candidates = solverCandidates();
    expect(candidates.length).toBeGreaterThanOrEqual(20);
    expect(new Set(candidates.map(candidate => candidate.domain))).toEqual(
      expect.objectContaining(new Set(["GEOMETRY", "STRUCTURAL", "ENERGY", "CFD", "BIM_IFC"])),
    );
    for (const candidate of candidates) {
      expect(candidate.lifecycle).toBe("CANDIDATE");
      expect(candidate.licenseVerified).toBe(false);
      expect(candidate.runtimeVerified).toBe(false);
      expect(enablementFailures(candidate)).toContain("LICENSE_UNVERIFIED");
      expect(enablementFailures(candidate)).toContain("RUNTIME_UNVERIFIED");
    }
  });

  it("permits enablement only after license, runtime, and capability evidence exist", () => {
    expect(enablementFailures({
      solverId: "verified-test",
      domain: "GEOMETRY",
      requestedCapabilities: ["TEST_CAPABILITY"],
      lifecycle: "VERIFIED",
      executionMode: "WORKER",
      licenseSpdx: "MIT",
      licenseVerified: true,
      runtimeVerified: true,
      source: "ARKI_HARVEST",
      notes: [],
    })).toEqual([]);
  });
});
