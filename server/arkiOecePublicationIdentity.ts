import { createHash } from "node:crypto";
import { z } from "zod";

/**
 * Identity boundary for OECE bulk OCDS publications.
 *
 * OCID identifies the procurement process; mainId identifies the published
 * main.csv row/release context. Child CSV rows must be attached to a main row
 * by (mainId, ocid), never by OCID alone.
 */
const NonEmpty = z.string().trim().min(1);
const Sha256 = z.string().regex(/^[a-f0-9]{64}$/i, "OECE_SHA256_INVALID");

export const OecePublicationIdentitySchema = z.object({
  mainId: NonEmpty,
  ocid: NonEmpty,
  releaseId: NonEmpty.optional(),
  releaseDate: z.string().datetime({ offset: true }).optional(),
  publishedDate: z.string().datetime({ offset: true }).optional(),
  sourceArtifactSha256: Sha256,
  sourceArtifactRef: NonEmpty,
  observedAt: z.string().datetime({ offset: true }),
}).strict();

export type OecePublicationIdentity = z.infer<typeof OecePublicationIdentitySchema>;

export const OeceChildRowIdentitySchema = z.object({
  mainId: NonEmpty,
  ocid: NonEmpty,
  childId: NonEmpty,
  dataset: z.enum([
    "parties", "tender_items", "tender_documents", "awards",
    "contracts", "awards_suppliers", "tender_tenderers",
  ]),
}).strict();

export type OeceChildRowIdentity = z.infer<typeof OeceChildRowIdentitySchema>;

const digest = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

/** Stable publication identity. Does not collapse multiple publications of one OCID. */
export function oecePublicationKey(value: OecePublicationIdentity): string {
  const parsed = OecePublicationIdentitySchema.parse(value);
  return `OECE-PUBLICATION:${digest([parsed.mainId, parsed.ocid, parsed.sourceArtifactSha256])}`;
}

/** Stable child identity within one published main-row context. */
export function oeceChildRowKey(value: OeceChildRowIdentity): string {
  const parsed = OeceChildRowIdentitySchema.parse(value);
  return `OECE-CHILD:${digest([parsed.dataset, parsed.mainId, parsed.ocid, parsed.childId])}`;
}

/**
 * Enforces the exact composite relationship used by bulk OCDS tables.
 * Same OCID with a different mainId is a different publication context.
 */
export function assertOeceChildBelongsToPublication(
  publication: OecePublicationIdentity,
  child: OeceChildRowIdentity,
): void {
  const main = OecePublicationIdentitySchema.parse(publication);
  const row = OeceChildRowIdentitySchema.parse(child);
  if (row.mainId !== main.mainId || row.ocid !== main.ocid) {
    throw new Error("OECE_CHILD_PUBLICATION_LINK_MISMATCH");
  }
}
