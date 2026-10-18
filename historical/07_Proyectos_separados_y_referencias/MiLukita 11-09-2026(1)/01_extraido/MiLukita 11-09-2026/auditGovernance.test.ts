import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import { assertCapability, assertHumanAuthority, verifyAuditChainRows } from "../server/auditGovernance";
import { GOVERNANCE_STATES, requiresHumanAuthority } from "./auditGovernance";

type AuditRow = Parameters<typeof verifyAuditChainRows>[0][number];

const legacyRow = (overrides: Partial<AuditRow> = {}): AuditRow => ({
  id: 1,
  publicId: "AUD-1",
  actorUserId: null,
  actorRole: null,
  eventType: "TEST_EVENT",
  entityType: "TEST_RESOURCE",
  entityPublicId: "RES-1",
  action: null,
  previousStateJson: null,
  newStateJson: null,
  metadataJson: null,
  correlationId: null,
  payloadJson: "{\"value\":1}",
  previousHash: null,
  eventHash: "",
  createdAt: new Date("2026-09-07T00:00:00.000Z"),
  ...overrides,
});

describe("Order 56 Audit / Governance backend contract", () => {
  it("exposes governance history, integrity, state, human and capability procedures", () => {
    const procedures = Object.keys((appRouter as any)._def.procedures);
    for (const name of ["governance.history", "governance.integrity", "governance.recordEvent", "governance.recordState", "governance.assertHuman", "governance.assertCapability"]) expect(procedures).toContain(name);
  });

  it("defines explicit governance states and never treats READY as evidence", () => {
    expect(GOVERNANCE_STATES).toEqual(expect.arrayContaining(["IMPLEMENTED", "PARTIAL", "SIMULATED", "PENDING", "BLOCKED", "EXTERNAL_REQUIRED", "REQUIRES_HUMAN", "NOT_VERIFIED", "DEPRECATED"]));
    expect((GOVERNANCE_STATES as readonly string[]).includes("READY")).toBe(false);
  });

  it("detects a tampered legacy chain row", () => {
    const original = legacyRow();
    const firstHash = createHash("sha256").update("GENESIS|TEST_EVENT|TEST_RESOURCE|RES-1|{\"value\":1}").digest("hex");
    const valid = { ...original, eventHash: firstHash };
    expect(verifyAuditChainRows([valid]).valid).toBe(true);
    expect(verifyAuditChainRows([{ ...valid, payloadJson: "{\"value\":2}" }]).failures.map(item => item.reason)).toContain("EVENT_HASH_INVALID");
  });

  it("detects previous-hash sequence tampering for the new envelope", () => {
    const first = { ...legacyRow({ action: "INTENT_DETECTED", eventType: "INTENT_DETECTED", metadataJson: "{}", payloadJson: "{}", correlationId: "corr:RES-1", previousStateJson: "null", newStateJson: "{\"intent\":\"OPEN\"}" }), eventHash: "invalid" };
    const result = verifyAuditChainRows([first]);
    expect(result.failures).toEqual(expect.arrayContaining([{ publicId: "AUD-1", reason: "EVENT_HASH_INVALID" }]));
  });

  it("separates intent from action and blocks protected core writes", async () => {
    expect(requiresHumanAuthority("PUBLISH")).toBe(true);
    expect(requiresHumanAuthority("ACTION_EXECUTED")).toBe(false);
    await expect(assertCapability({ capability: "TERRITORIAL_RUNTIME", action: "ACTION_EXECUTED", intentRecorded: false })).rejects.toThrow("INTENT_REQUIRED_BEFORE_ACTION");
    await expect(assertCapability({ capability: "MJP_CORE_WRITE", action: "ACTION_EXECUTED", intentRecorded: true })).rejects.toThrow("MJP_CORE_WRITE_BLOCKED");
    await expect(assertHumanAuthority({ actorUserId: -1, action: "PUBLISH", resource: "WORLD_OBJECT", resourceId: "WOBJ-TEST" })).rejects.toThrow();
  });
});
