import { z } from "zod";

export const OeceAmountKindSchema = z.enum([
  "PROJECT_INVESTMENT_COST",
  "ESTIMATED_WORKS_BUDGET",
  "TENDER_ESTIMATED_VALUE",
  "AWARD_VALUE",
  "CONTRACT_VALUE",
  "CONTRACT_MODIFIED_VALUE",
  "UNKNOWN_AMOUNT_KIND",
]);
export type OeceAmountKind = z.infer<typeof OeceAmountKindSchema>;

export const OeceObservedAmountSchema = z.object({
  amountId: z.string().trim().min(1),
  value: z.number().finite().nonnegative(),
  currency: z.string().trim().length(3).transform(value => value.toUpperCase()),
  kind: OeceAmountKindSchema,
  observedAt: z.string().datetime({ offset: true }),
  sourceRef: z.string().trim().min(1),
  sourceSha256: z.string().regex(/^[a-f0-9]{64}$/i),
  priceBaseDate: z.string().date().optional(),
  geographicScope: z.string().trim().min(1).optional(),
}).strict();
export type OeceObservedAmount = z.infer<typeof OeceObservedAmountSchema>;

export type OeceAmountComparison = {
  comparable: boolean;
  reason: "COMPARABLE" | "AMOUNT_KIND_MISMATCH" | "CURRENCY_MISMATCH" | "UNKNOWN_KIND";
};

/**
 * Comparison is intentionally strict: no implicit FX conversion, inflation
 * adjustment, or substitution of investment cost for contract value.
 */
export function compareOeceAmounts(
  leftInput: OeceObservedAmount,
  rightInput: OeceObservedAmount,
): OeceAmountComparison {
  const left = OeceObservedAmountSchema.parse(leftInput);
  const right = OeceObservedAmountSchema.parse(rightInput);
  if (left.kind === "UNKNOWN_AMOUNT_KIND" || right.kind === "UNKNOWN_AMOUNT_KIND") {
    return { comparable: false, reason: "UNKNOWN_KIND" };
  }
  if (left.kind !== right.kind) {
    return { comparable: false, reason: "AMOUNT_KIND_MISMATCH" };
  }
  if (left.currency !== right.currency) {
    return { comparable: false, reason: "CURRENCY_MISMATCH" };
  }
  return { comparable: true, reason: "COMPARABLE" };
}

/** Rank only within an explicitly selected amount kind and currency. */
export function rankOeceAmounts(
  inputs: OeceObservedAmount[],
  selection: { kind: Exclude<OeceAmountKind, "UNKNOWN_AMOUNT_KIND">; currency: string },
): OeceObservedAmount[] {
  const currency = z.string().length(3).parse(selection.currency).toUpperCase();
  const values = inputs.map(value => OeceObservedAmountSchema.parse(value));
  return values
    .filter(value => value.kind === selection.kind && value.currency === currency)
    .sort((a, b) => b.value - a.value || a.amountId.localeCompare(b.amountId));
}
