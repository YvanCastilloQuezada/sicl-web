import { describe, expect, it } from "vitest";
import { fingerprint } from "./arkiFingerprint";

describe("ARKI fingerprint", () => {
  it("produces lowercase SHA-256 hex with 64 characters", () => {
    expect(fingerprint({ a: 1, b: 2 })).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is stable for the same object serialization", () => {
    expect(fingerprint({ a: 1, b: 2 })).toBe(fingerprint({ a: 1, b: 2 }));
  });

  it("documents current insertion-order sensitivity", () => {
    expect(fingerprint({ a: 1, b: 2 })).not.toBe(fingerprint({ b: 2, a: 1 }));
  });
});
