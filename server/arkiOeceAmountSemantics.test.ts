import { describe, expect, it } from "vitest";
import { compareOeceAmounts, rankOeceAmounts, type OeceObservedAmount } from "./arkiOeceAmountSemantics";

const amount = (overrides: Partial<OeceObservedAmount> = {}): OeceObservedAmount => ({
  amountId: "A1",
  value: 100,
  currency: "PEN",
  kind: "ESTIMATED_WORKS_BUDGET",
  observedAt: "2026-10-01T10:00:00Z",
  sourceRef: "OECE:source:A1",
  sourceSha256: "a".repeat(64),
  ...overrides,
});

describe("OECE amount semantics", () => {
  it("does not compare investment cost with contract value", () => {
    expect(compareOeceAmounts(amount({ kind: "PROJECT_INVESTMENT_COST" }), amount({ kind: "CONTRACT_VALUE" })))
      .toEqual({ comparable: false, reason: "AMOUNT_KIND_MISMATCH" });
  });

  it("does not compare amounts in different currencies without an explicit conversion", () => {
    expect(compareOeceAmounts(amount(), amount({ currency: "USD" })))
      .toEqual({ comparable: false, reason: "CURRENCY_MISMATCH" });
  });

  it("keeps unknown amount semantics outside comparisons", () => {
    expect(compareOeceAmounts(amount({ kind: "UNKNOWN_AMOUNT_KIND" }), amount()))
      .toEqual({ comparable: false, reason: "UNKNOWN_KIND" });
  });

  it("compares only matching amount kinds and currencies", () => {
    expect(compareOeceAmounts(amount(), amount({ amountId: "A2", value: 200 })))
      .toEqual({ comparable: true, reason: "COMPARABLE" });
  });

  it("ranks a selected comparable group without silently mixing amount types", () => {
    const ranked = rankOeceAmounts([
      amount({ amountId: "contract", value: 900, kind: "CONTRACT_VALUE" }),
      amount({ amountId: "budget-small", value: 120 }),
      amount({ amountId: "budget-large", value: 800 }),
      amount({ amountId: "usd", value: 500, currency: "USD" }),
      amount({ amountId: "unknown", value: 1000, kind: "UNKNOWN_AMOUNT_KIND" }),
    ], { kind: "ESTIMATED_WORKS_BUDGET", currency: "PEN" });
    expect(ranked.map(value => value.amountId)).toEqual(["budget-large", "budget-small"]);
  });

  it("rejects negative, non-finite, and unprovenanced amounts", () => {
    expect(() => compareOeceAmounts(amount({ value: -1 }), amount())).toThrow();
    expect(() => compareOeceAmounts(amount({ value: Number.NaN }), amount())).toThrow();
    expect(() => compareOeceAmounts(amount({ sourceSha256: "bad" }), amount())).toThrow();
  });
});
