import {
  OeceChildRowIdentitySchema,
  OecePublicationIdentitySchema,
  type OeceChildRowIdentity,
  type OecePublicationIdentity,
} from "./arkiOecePublicationIdentity";

export type OeceMainRow = OecePublicationIdentity & { [field: string]: unknown };
export type OeceChildRow = OeceChildRowIdentity & { [field: string]: unknown };

export type OeceChildJoinResult<TChild extends OeceChildRow> = {
  matched: Array<{ publication: OeceMainRow; child: TChild }>;
  unmatched: Array<{ child: TChild; reason: "PARENT_PUBLICATION_NOT_FOUND" }>;
};

const compositeKey = (mainId: string, ocid: string) => JSON.stringify([mainId, ocid]);

/**
 * Joins a bulk OCDS child dataset to main.csv only by (mainId, ocid).
 * Orphan rows are returned explicitly; they are never silently discarded or
 * attached to another publication that happens to share the same OCID.
 */
export function joinOeceChildRows<TChild extends OeceChildRow>(
  mainRowsInput: OeceMainRow[],
  childRowsInput: TChild[],
): OeceChildJoinResult<TChild> {
  const mainRows = mainRowsInput.map(row => {
    const identity = OecePublicationIdentitySchema.parse({
      mainId: row.mainId,
      ocid: row.ocid,
      releaseId: row.releaseId,
      releaseDate: row.releaseDate,
      publishedDate: row.publishedDate,
      sourceArtifactSha256: row.sourceArtifactSha256,
      sourceArtifactRef: row.sourceArtifactRef,
      observedAt: row.observedAt,
    });
    return { ...row, ...identity };
  });
  const childRows = childRowsInput.map(row => ({
    ...row,
    ...OeceChildRowIdentitySchema.parse({
      mainId: row.mainId,
      ocid: row.ocid,
      childId: row.childId,
      dataset: row.dataset,
    }),
  }));

  const index = new Map<string, OeceMainRow>();
  const duplicates = new Set<string>();
  for (const publication of mainRows) {
    const key = compositeKey(publication.mainId, publication.ocid);
    if (index.has(key)) duplicates.add(key);
    else index.set(key, publication);
  }
  if (duplicates.size) {
    throw new Error(`OECE_DUPLICATE_MAIN_PUBLICATION_KEY:${[...duplicates].join(",")}`);
  }

  const matched: OeceChildJoinResult<TChild>["matched"] = [];
  const unmatched: OeceChildJoinResult<TChild>["unmatched"] = [];
  for (const child of childRows) {
    const publication = index.get(compositeKey(child.mainId, child.ocid));
    if (publication) matched.push({ publication, child });
    else unmatched.push({ child, reason: "PARENT_PUBLICATION_NOT_FOUND" });
  }
  return {
    matched,
    unmatched,
  };
}
