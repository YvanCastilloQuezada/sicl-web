import { createHash } from "node:crypto";
import { z } from "zod";

/**
 * Versioned PAC observation. A plan item is not a procurement procedure:
 * each source publication and revision remains independently traceable.
 */
const NonEmpty = z.string().trim().min(1);
const Sha256 = z.string().regex(/^[a-f0-9]{64}$/i, "PAC_SHA256_INVALID");

export const PacChangeKindSchema = z.enum([
  "INITIAL_INCLUSION",
  "MODIFICATION",
  "EXCLUSION",
  "RESCHEDULING",
  "CARRY_FORWARD",
  "UNKNOWN_CHANGE",
]);
export type PacChangeKind = z.infer<typeof PacChangeKindSchema>;

export const PacPublicationIdentitySchema = z.object({
  entityId: NonEmpty,
  fiscalYear: z.number().int().min(2000).max(2200),
  publicationId: NonEmpty,
  versionId: NonEmpty,
  publishedAt: z.string().datetime({ offset: true }),
  observedAt: z.string().datetime({ offset: true }),
  sourceRef: NonEmpty,
  sourceSha256: Sha256,
}).strict();
export type PacPublicationIdentity = z.infer<typeof PacPublicationIdentitySchema>;

export const PacPlanItemSchema = z.object({
  identity: PacPublicationIdentitySchema,
  itemId: NonEmpty,
  objectDescription: NonEmpty,
  cubsoCode: NonEmpty.optional(),
  changeKind: PacChangeKindSchema,
  scheduledPeriod: z.string().trim().min(1).optional(),
  estimatedValue: z.number().finite().nonnegative().optional(),
  currency: z.string().trim().length(3).transform(value => value.toUpperCase()).optional(),
  amountBasis: z.enum([
    "PAC_ESTIMATED_VALUE",
    "UNKNOWN_AMOUNT_BASIS",
  ]),
  status: z.enum(["ACTIVE", "EXCLUDED", "SUPERSEDED", "UNKNOWN"]),
}).strict().superRefine((item, ctx) => {
  if (item.estimatedValue !== undefined && !item.currency) {
    ctx.addIssue({ code: "custom", path: ["currency"], message: "PAC_CURRENCY_REQUIRED_WITH_VALUE" });
  }
  if (item.estimatedValue === undefined && item.amountBasis === "PAC_ESTIMATED_VALUE") {
    ctx.addIssue({ code: "custom", path: ["amountBasis"], message: "PAC_AMOUNT_BASIS_REQUIRES_VALUE" });
  }
});
export type PacPlanItem = z.infer<typeof PacPlanItemSchema>;

export type PacReconciliationStatus =
  | "MATCHED"
  | "NOT_MATCHED_IN_OBSERVED_CORPUS"
  | "AMBIGUOUS"
  | "NOT_ASSESSED";

export type PacProcurementReference = {
  entityId: string;
  fiscalYear: number;
  procedureId: string;
  sourceRef: string;
  sourceSha256: string;
  objectCode?: string;
  description?: string;
};

export type PacReconciliation = {
  status: PacReconciliationStatus;
  pacItemId: string;
  candidates: string[];
  evaluatedAt: string;
  limitation: string;
};

/** Stable key includes publication/version so PAC revisions are never overwritten. */
export function pacPublicationKey(input: PacPublicationIdentity): string {
  const value = PacPublicationIdentitySchema.parse(input);
  const digest = createHash("sha256")
    .update(JSON.stringify([
      value.entityId,
      value.fiscalYear,
      value.publicationId,
      value.versionId,
      value.sourceSha256,
    ]))
    .digest("hex");
  return `PAC-PUBLICATION:${digest}`;
}

export function pacPlanItemKey(input: PacPlanItem): string {
  const item = PacPlanItemSchema.parse(input);
  const digest = createHash("sha256")
    .update(JSON.stringify([pacPublicationKey(item.identity), item.itemId]))
    .digest("hex");
  return `PAC-ITEM:${digest}`;
}

/**
 * Conservative deterministic reconciliation. It only produces MATCHED when
 * exactly one candidate shares entity/year and an exact non-empty object code.
 * Text similarity is intentionally not treated as proof of identity.
 */
export function reconcilePacItem(
  input: PacPlanItem,
  candidates: PacProcurementReference[],
  evaluatedAt: string,
): PacReconciliation {
  const item = PacPlanItemSchema.parse(input);
  const at = z.string().datetime({ offset: true }).parse(evaluatedAt);
  const valid = candidates.map(candidate => ({
    ...candidate,
    entityId: NonEmpty.parse(candidate.entityId),
    fiscalYear: z.number().int().min(2000).max(2200).parse(candidate.fiscalYear),
    procedureId: NonEmpty.parse(candidate.procedureId),
    sourceRef: NonEmpty.parse(candidate.sourceRef),
    sourceSha256: Sha256.parse(candidate.sourceSha256),
  }));
  const sameEntityYear = valid.filter(candidate =>
    candidate.entityId === item.identity.entityId
    && candidate.fiscalYear === item.identity.fiscalYear
  );
  const matches = item.cubsoCode
    ? sameEntityYear.filter(candidate => candidate.objectCode === item.cubsoCode)
    : [];
  const status: PacReconciliationStatus = matches.length === 1
    ? "MATCHED"
    : matches.length > 1
      ? "AMBIGUOUS"
      : "NOT_MATCHED_IN_OBSERVED_CORPUS";
  return {
    status,
    pacItemId: item.itemId,
    candidates: (matches.length ? matches : sameEntityYear).map(candidate => candidate.procedureId),
    evaluatedAt: at,
    limitation: "No match in the observed corpus does not prove the item was never procured; source coverage, later PAC revisions, exclusions, object-code changes and publication timing may be incomplete.",
  };
}
