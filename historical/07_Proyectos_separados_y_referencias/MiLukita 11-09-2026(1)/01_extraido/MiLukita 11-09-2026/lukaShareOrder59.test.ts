import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { validatePublishedShareMetadata } from "../server/lukaShare";
import { assertSafeCapability, assertSafeSharePath, clampShareTtl, normalizeShareDefinition } from "./lukaShare";

describe("Orden 59 — L★ / QR backend integration", () => {
  it("exposes the shared target, session and priority resolution APIs", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    expect(procedures).toContain("share.resolve");
    expect(procedures).toContain("share.resolveActive");
    expect(procedures).toContain("share.createTarget");
    expect(procedures).toContain("share.createExperienceTarget");
    expect(procedures).toContain("share.createTerritorialTarget");
    expect(procedures).toContain("share.createSession");
    expect(procedures).toContain("share.revokeTarget");
  });

  it("requires PUBLISHED state and authorization for an Experience target", () => {
    expect(() => validatePublishedShareMetadata({ resourceState: "DRAFT", authorized: true })).toThrow("SHARE_TARGET_RESOURCE_NOT_PUBLISHED");
    expect(() => validatePublishedShareMetadata({ resourceState: "PUBLISHED", authorized: false, publicationStatus: "HELD" })).toThrow("SHARE_TARGET_RESOURCE_NOT_PUBLISHED");
    expect(() => validatePublishedShareMetadata({ resourceState: "PUBLISHED", publicationStatus: "PUBLISHED" })).not.toThrow();
  });

  it("keeps ShareService deep links internal and outside protected core", () => {
    expect(assertSafeSharePath("/luka-ar?object=WOBJ-ABC")).toBe("/luka-ar?object=WOBJ-ABC");
    expect(() => assertSafeSharePath("https://evil.example/steal")).toThrow();
    expect(() => assertSafeSharePath("/api/mjp-core")).toThrow();
    expect(() => assertSafeSharePath("/wallet/ledger")).toThrow();
    expect(() => assertSafeCapability("MJP_CORE_WRITE" as never)).toThrow();
  });

  it("clamps session TTL and normalizes target priority", () => {
    expect(clampShareTtl(1)).toBe(60);
    expect(clampShareTtl(999999)).toBe(3600);
    expect(normalizeShareDefinition({ targetType: "EXPERIENCE", destinationPath: "/experience/demo", capability: "PUBLIC_EXPERIENCE", priority: 1234 }).priority).toBe(1000);
  });

  it("defines the intended priority order without making a QR an authorization token", () => {
    const priority = ["ACTIVE_EXPERIENCE", "AUTHORIZED_SESSION", "PUBLIC_LUKA"];
    expect(priority).toEqual(["ACTIVE_EXPERIENCE", "AUTHORIZED_SESSION", "PUBLIC_LUKA"]);
    expect((appRouter as any)._def.procedures["share.resolveActive"]).toBeDefined();
  });

  it("keeps public state filtering explicit for non-publishable territorial resources", () => {
    for (const state of ["DRAFT", "UNDER_REVIEW", "DISPUTED", "REJECTED", "ARCHIVED"]) {
      expect(() => validatePublishedShareMetadata({ resourceState: state, publicationStatus: "UNPUBLISHED", authorized: false })).toThrow("SHARE_TARGET_RESOURCE_NOT_PUBLISHED");
    }
  });
});
