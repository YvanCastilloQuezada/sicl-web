import { describe, expect, it } from "vitest";
import {
  ArkiPublicProcurementWorkspaceSchema,
  publicProcurementWorkspaceContract,
  validatePublicProcurementWorkspace,
} from "./arkiPublicProcurementWorkspace";

const record = (recordId: string, module: "INVESTMENT_OBSERVATORY" | "CONTRACT_HISTORY") => ({
  recordId,
  module,
  recordType: "PROCUREMENT_PUBLICATION",
  sourceRef: `source:${recordId}`,
  sourceSha256: "a".repeat(64),
  observedAt: "2026-11-01T10:00:00Z",
  entityId: "ENTITY-01",
  ocid: "ocds-example-001",
  mainId: `MAIN-${recordId}`,
});

const workspace = () => ({
  schema: "ARKI-PUBLIC-PROCUREMENT-WORKSPACE-1.0",
  context: {
    workspaceId: "WS-001",
    jurisdiction: "PE",
    entityId: "ENTITY-01",
    fiscalYear: 2026,
    geographicScope: "PE-LIM",
  },
  records: [
    record("INV-001", "INVESTMENT_OBSERVATORY"),
    record("HIST-001", "CONTRACT_HISTORY"),
  ],
  links: [{
    linkId: "LINK-001",
    fromRecordId: "INV-001",
    toRecordId: "HIST-001",
    relation: "RELATED_CONTEXT",
    status: "CANDIDATE",
    evidenceRefs: [],
    rationale: "Shared OCID but distinct publication context; relation not yet proven.",
  }],
  moduleCoverage: {
    INVESTMENT_OBSERVATORY: "PARTIAL",
    TERRITORIAL_INTELLIGENCE: "NOT_CONNECTED",
    CONTRACT_HISTORY: "PARTIAL",
    PAC_RADAR: "NOT_CONNECTED",
    COMMERCIAL_RADAR: "PARTIAL",
    TECHNICAL_LIBRARY: "NOT_CONNECTED",
  },
  canonicalMutation: false,
});

describe("ARKI shared public-procurement workspace", () => {
  it("defines one shared workspace for exactly six modules", () => {
    const contract = publicProcurementWorkspaceContract();
    expect(contract.oneWorkspace).toBe(true);
    expect(contract.modules).toHaveLength(6);
  });

  it("validates shared context and keeps candidate links unresolved", () => {
    const result = validatePublicProcurementWorkspace(workspace());
    expect(result.moduleCount).toBe(6);
    expect(result.partialModules).toBe(3);
    expect(result.unresolvedLinks).toBe(1);
    expect(result.verifiedLinks).toBe(0);
    expect(result.canonicalMutation).toBe(false);
  });

  it("requires mainId and ocid for investment/history records", () => {
    const value = workspace();
    value.records[0] = { ...value.records[0], mainId: undefined } as never;
    expect(() => ArkiPublicProcurementWorkspaceSchema.parse(value)).toThrow("OECE_RECORD_REQUIRES_MAIN_ID_AND_OCID");
  });

  it("does not allow verified links without evidence and human review", () => {
    const value = workspace();
    value.links[0] = { ...value.links[0], status: "VERIFIED" };
    expect(() => ArkiPublicProcurementWorkspaceSchema.parse(value)).toThrow("VERIFIED_WORKSPACE_LINK_REQUIRES_EVIDENCE");
  });

  it("rejects links to records outside the shared workspace", () => {
    const value = workspace();
    value.links[0] = { ...value.links[0], toRecordId: "MISSING" };
    expect(() => ArkiPublicProcurementWorkspaceSchema.parse(value)).toThrow("PROCUREMENT_WORKSPACE_LINK_ENDPOINT_MISSING");
  });

  it("rejects invalid observation windows", () => {
    const value = workspace();
    value.context.observedFrom = "2026-12-01T00:00:00Z";
    value.context.observedTo = "2026-01-01T00:00:00Z";
    expect(() => ArkiPublicProcurementWorkspaceSchema.parse(value)).toThrow("PROCUREMENT_WORKSPACE_DATE_RANGE_INVALID");
  });
});
