import { z } from "zod";

const OeceAcsHealthSchema = z.object({
  contract: z.literal("ARKI-ACS-OECE-READ-1.0"),
  status: z.enum(["AVAILABLE"]),
  corpus: z.literal("legacy-ocid-only"),
  records: z.number().int().nonnegative(),
  mainIdAvailable: z.literal(false),
  crossPublicationJoinAllowed: z.literal(false),
  readOnly: z.literal(true),
}).strict();

const OeceAcsRecordsSchema = z.object({
  contract: z.literal("ARKI-ACS-OECE-READ-1.0"),
  corpus: z.literal("legacy-ocid-only"),
  mainIdAvailable: z.literal(false),
  crossPublicationJoinAllowed: z.literal(false),
  returned: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  records: z.array(z.record(z.string(), z.unknown())),
}).strict();

export type OeceAcsSearchInput = {
  years?: number[];
  categories?: string[];
  methods?: string[];
  department?: string;
  minAmount?: number;
  q?: string;
  limit?: number;
};

function endpoint(path: string) {
  const base = process.env.ACS_OECE_API_URL?.trim();
  if (!base) return null;
  return new URL(path, base.endsWith("/") ? base : `${base}/`);
}

async function getJson(url: URL) {
  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`ACS_OECE_HTTP_${response.status}`);
  return response.json() as Promise<unknown>;
}

export async function getOeceAcsHealth() {
  const url = endpoint("/api/oece/v1/health");
  if (!url) return { configured: false as const, available: false as const };
  const payload = OeceAcsHealthSchema.parse(await getJson(url));
  return { configured: true as const, available: true as const, ...payload };
}

export async function searchOeceAcsCorpus(input: OeceAcsSearchInput) {
  const url = endpoint("/api/oece/v1/records");
  if (!url) return { configured: false as const, available: false as const, records: [] as const };
  for (const year of input.years ?? []) url.searchParams.append("years", String(year));
  for (const category of input.categories ?? []) url.searchParams.append("categories", category);
  for (const method of input.methods ?? []) url.searchParams.append("methods", method);
  if (input.department) url.searchParams.set("department", input.department);
  if (input.minAmount !== undefined) url.searchParams.set("minAmount", String(input.minAmount));
  if (input.q) url.searchParams.set("q", input.q);
  url.searchParams.set("limit", String(input.limit ?? 50));

  const payload = OeceAcsRecordsSchema.parse(await getJson(url));
  return {
    configured: true as const,
    available: true as const,
    corpus: payload.corpus,
    mainIdAvailable: payload.mainIdAvailable,
    crossPublicationJoinAllowed: payload.crossPublicationJoinAllowed,
    returned: payload.returned,
    limit: payload.limit,
    records: payload.records,
    limitations: [
      "The ACS corpus currently exposes legacy OCID-only rows.",
      "mainId is unavailable; do not merge releases or create VERIFIED publication links.",
      "These results are source records, not a complete investment, contract-history or award ledger.",
    ],
  };
}
