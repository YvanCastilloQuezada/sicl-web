import { describe, expect, it } from "vitest";
import {
  assertSafeSharePath,
  clampShareTtl,
  normalizeShareDefinition,
} from "./lukaShare";

describe("L★ ShareTarget contract", () => {
  it("normalizes safe public destinations and priority bounds", () => {
    const result = normalizeShareDefinition({
      targetType: "PUBLIC_LUKA",
      destinationPath: "/lukita-ar-stage?entry=qr",
      capability: "AR_VIEW",
      priority: 10_000,
      metadata: { source: "qr" },
    });
    expect(result.destinationPath).toBe("/lukita-ar-stage?entry=qr");
    expect(result.priority).toBe(1000);
    expect(result.metadata).toEqual({ source: "qr" });
  });

  it("rejects traversal, external-looking and API paths", () => {
    for (const path of ["//evil.example", "/../admin", "/api/trpc/share.resolve"]) {
      expect(() => assertSafeSharePath(path)).toThrow();
    }
  });

  it("rejects any target that attempts to name a protected core capability", () => {
    expect(() => assertSafeSharePath("/mjp-core/runtime")).toThrow(/protegida/);
    expect(() => assertSafeSharePath("/wallet/summary")).toThrow(/protegida/);
  });

  it("clamps session TTL to the backend safety window", () => {
    expect(clampShareTtl(-10)).toBe(60);
    expect(clampShareTtl(120)).toBe(120);
    expect(clampShareTtl(99_999)).toBe(3600);
  });

  it("rejects already expired definitions", () => {
    expect(() => normalizeShareDefinition({
      targetType: "EXPERIENCE",
      destinationPath: "/portal",
      capability: "PUBLIC_EXPERIENCE",
      expiresAt: new Date(Date.now() - 1),
    })).toThrow(/futuro/);
  });
});
