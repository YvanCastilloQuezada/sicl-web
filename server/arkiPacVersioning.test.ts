import { describe, expect, it } from "vitest";
import {
  pacPlanItemKey,
  pacPublicationKey,
  PacPlanItemSchema,
  reconcilePacItem,
  type PacPlanItem,
} from "./arkiPacVersioning";

const item = (overrides: Partial<PacPlanItem> = {}): PacPlanItem => ({
  identity: {
    entityId: "20123456789",
    fiscalYear: 2026,
    publicationId: "PAC-2026-001",
    versionId: "v1",
    publishedAt: "2025-12-15T10:00:00Z",
    observedAt: "2026-01-03T10:00:00Z",
    sourceRef: "OECE:PAC:2026:publication-1",
    sourceSha256: "a".repeat(64),
  },
  itemId: "ITEM-001",
  objectDescription: "Mejoramiento de infraestructura educativa",
  cubsoCode: "72121400",
  changeKind: "INITIAL_INCLUSION",
  scheduledPeriod: "2026-Q2",
  estimatedValue: 1500000,
  currency: "PEN",
  amountBasis: "PAC_ESTIMATED_VALUE",
  status: "ACTIVE",
  ...overrides,
});

const candidate = (overrides: Record<string, unknown> = {}) => ({
  entityId: "20123456789",
  fiscalYear: 2026,
  procedureId: "ocds-dgv273-seacev3-123",
  sourceRef: "OECE:OCDS:2026:main.csv",
  sourceSha256: "b".repeat(64),
  objectCode: "72121400",
  ...overrides,
});

describe("versioned PAC evidence", () => {
  it("preserves distinct PAC versions of the same entity and year", () => {
    expect(pacPublicationKey(item().identity))
      .not.toBe(pacPublicationKey({
        ...item().identity,
        versionId: "v2",
        sourceSha256: "c".repeat(64),
      }));
  });

  it("keeps an item identity scoped to its exact publication version", () => {
    expect(pacPlanItemKey(item()))
      .not.toBe(pacPlanItemKey(item({
        identity: { ...item().identity, versionId: "v2", sourceSha256: "c".repeat(64) },
      })));
  });

  it("validates currency and amount-basis consistency", () => {
    expect(() => PacPlanItemSchema.parse(item({ currency: undefined }))).toThrow();
    expect(() => PacPlanItemSchema.parse(item({
      estimatedValue: undefined,
      amountBasis: "PAC_ESTIMATED_VALUE",
    }))).toThrow();
    expect(PacPlanItemSchema.parse(item({ currency: "pen" })).currency).toBe("PEN");
  });

  it("matches only one exact entity/year/object-code candidate", () => {
    expect(reconcilePacItem(item(), [candidate()], "2026-11-01T12:00:00Z"))
      .toMatchObject({ status: "MATCHED", candidates: ["ocds-dgv273-seacev3-123"] });
  });

  it("does not use description similarity as proof of a match", () => {
    expect(reconcilePacItem(item(), [candidate({ objectCode: "72121500" })], "2026-11-01T12:00:00Z").status)
      .toBe("NOT_MATCHED_IN_OBSERVED_CORPUS");
  });

  it("marks multiple exact candidates ambiguous", () => {
    expect(reconcilePacItem(item(), [
      candidate(),
      candidate({ procedureId: "ocds-dgv273-seacev3-456" }),
    ], "2026-11-01T12:00:00Z").status).toBe("AMBIGUOUS");
  });

  it("does not interpret no observed match as proof of no procurement", () => {
    const result = reconcilePacItem(item(), [], "2026-11-01T12:00:00Z");
    expect(result.status).toBe("NOT_MATCHED_IN_OBSERVED_CORPUS");
    expect(result.limitation).toContain("does not prove the item was never procured");
  });

  it("rejects invalid source hashes and negative PAC values", () => {
    expect(() => PacPlanItemSchema.parse(item({
      identity: { ...item().identity, sourceSha256: "invalid" },
    }))).toThrow();
    expect(() => PacPlanItemSchema.parse(item({ estimatedValue: -1 }))).toThrow();
  });
});
