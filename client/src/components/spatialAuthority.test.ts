import { describe, it, expect } from "vitest";
import { classifySpatialAuthority } from "./spatialAuthority";

describe("ACE85 visual authority", () => {
  const cases = [
    ["SYNTHETIC", "SYNTHETIC / EDUCATIONAL / MODEL PROJECT", true, "EDUCATIONAL"],
    ["PROJECT", "DERIVED_FROM_PROJECT_ALTERNATIVE", true, "DERIVED"],
    ["MISSING", undefined, true, "UNKNOWN"],
    ["UNKNOWN", "UNRECOGNIZED_SOURCE", true, "UNKNOWN"],
    ["CLAIMED_CANONICAL", "AGK_CANONICAL", true, "UNKNOWN"],
    ["READ_ONLY_FALSE", "DERIVED_FROM_PROJECT_ALTERNATIVE", false, "UNKNOWN"],
  ] as const;

  it.each(cases)("%s", (_name, provenance, readOnly, expected) => {
    const result = classifySpatialAuthority(provenance, readOnly);
    expect(result.status).toBe(expected);
    expect(result.canonicalVerified).toBe(false);
    expect(result.mutationAuthorized).toBe(false);
    expect(result.label.length).toBeGreaterThan(0);
  });

  it("fails closed without read_only", () => {
    expect(classifySpatialAuthority(
      "DERIVED_FROM_PROJECT_ALTERNATIVE", undefined
    ).status).toBe("UNKNOWN");
  });
});
