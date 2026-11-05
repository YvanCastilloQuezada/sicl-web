import { z } from "zod";

/**
 * Shared integration envelope for the six public-procurement modules.
 * It links evidence without asserting that a candidate relationship is true.
 * This contract is metadata-only: it does not ingest sources or mutate Core.
 */
export const ProcurementModuleSchema = z.enum([
  "INVESTMENT_OBSERVATORY",
  "TERRITORIAL_INTELLIGENCE",
  "CONTRACT_HISTORY",
  "PAC_RADAR",
  "COMMERCIAL_RADAR",
  "TECHNICAL_LIBRARY",
]);

export const ProcurementLinkStatusSchema = z.enum([
  "VERIFIED",
  "CANDIDATE",
  "UNKNOWN",
  "CONTRADICTED",
]);

const NonEmpty = z.string().trim().min(1);
const Sha256 = z.string().regex(/^[a-f0-9]{64}$/i);

export const ProcurementWorkspaceContextSchema = z.object({
  workspaceId: NonEmpty,
  jurisdiction: NonEmpty,
  entityId: NonEmpty.optional(),
  fiscalYear: z.number().int().min(2000).max(2200).optional(),
  geographicScope: NonEmpty.optional(),
  observedFrom: z.string().datetime({ offset: true }).optional(),
  observedTo: z.string().datetime({ offset: true }).optional(),
}).strict().superRefine((value, ctx) => {
  if (value.observedFrom && value.observedTo && value.observedFrom > value.observedTo) {
    ctx.addIssue({ code: "custom", path: ["observedTo"], message: "PROCUREMENT_WORKSPACE_DATE_RANGE_INVALID" });
  }
});

export const ProcurementWorkspaceRecordSchema = z.object({
  recordId: NonEmpty,
  module: ProcurementModuleSchema,
  recordType: NonEmpty,
  sourceRef: NonEmpty,
  sourceSha256: Sha256,
  observedAt: z.string().datetime({ offset: true }),
  entityId: NonEmpty.optional(),
  ocid: NonEmpty.optional(),
  mainId: NonEmpty.optional(),
  pacItemId: NonEmpty.optional(),
  territoryRef: NonEmpty.optional(),
  supplierRef: NonEmpty.optional(),
  expedienteRef: NonEmpty.optional(),
  amountId: NonEmpty.optional(),
}).strict().superRefine((record, ctx) => {
  if (record.module === "INVESTMENT_OBSERVATORY" || record.module === "CONTRACT_HISTORY") {
    if (!record.ocid || !record.mainId) {
      ctx.addIssue({ code: "custom", path: ["mainId"], message: "OECE_RECORD_REQUIRES_MAIN_ID_AND_OCID" });
    }
  }
  if (record.module === "PAC_RADAR" && !record.pacItemId) {
    ctx.addIssue({ code: "custom", path: ["pacItemId"], message: "PAC_RECORD_REQUIRES_ITEM_ID" });
  }
  if (record.module === "TERRITORIAL_INTELLIGENCE" && !record.territoryRef) {
    ctx.addIssue({ code: "custom", path: ["territoryRef"], message: "TERRITORIAL_RECORD_REQUIRES_TERRITORY_REF" });
  }
  if (record.module === "TECHNICAL_LIBRARY" && !record.expedienteRef) {
    ctx.addIssue({ code: "custom", path: ["expedienteRef"], message: "ETO_RECORD_REQUIRES_EXPEDIENTE_REF" });
  }
});

export const ProcurementWorkspaceLinkSchema = z.object({
  linkId: NonEmpty,
  fromRecordId: NonEmpty,
  toRecordId: NonEmpty,
  relation: z.enum([
    "PAC_TO_PROCEDURE",
    "PROCEDURE_TO_AWARD",
    "AWARD_TO_CONTRACT",
    "CONTRACT_TO_EXPEDIENTE",
    "PROCUREMENT_TO_TERRITORY",
    "CONTRACT_TO_SUPPLIER",
    "RECORD_TO_AMOUNT",
    "RELATED_CONTEXT",
  ]),
  status: ProcurementLinkStatusSchema,
  evidenceRefs: z.array(NonEmpty),
  rationale: z.string(),
  reviewedAt: z.string().datetime({ offset: true }).optional(),
  reviewerId: NonEmpty.optional(),
}).strict().superRefine((link, ctx) => {
  if (link.status === "VERIFIED" && !link.evidenceRefs.length) {
    ctx.addIssue({ code: "custom", path: ["evidenceRefs"], message: "VERIFIED_WORKSPACE_LINK_REQUIRES_EVIDENCE" });
  }
  if (link.status === "VERIFIED" && (!link.reviewerId || !link.reviewedAt)) {
    ctx.addIssue({ code: "custom", path: ["reviewerId"], message: "VERIFIED_WORKSPACE_LINK_REQUIRES_HUMAN_REVIEW" });
  }
});

export const ArkiPublicProcurementWorkspaceSchema = z.object({
  schema: z.literal("ARKI-PUBLIC-PROCUREMENT-WORKSPACE-1.0"),
  context: ProcurementWorkspaceContextSchema,
  records: z.array(ProcurementWorkspaceRecordSchema),
  links: z.array(ProcurementWorkspaceLinkSchema),
  moduleCoverage: z.record(ProcurementModuleSchema, z.enum(["CONNECTED", "PARTIAL", "NOT_CONNECTED", "UNKNOWN"])),
  canonicalMutation: z.literal(false),
}).strict().superRefine((workspace, ctx) => {
  const ids = new Set<string>();
  for (const record of workspace.records) {
    if (ids.has(record.recordId)) {
      ctx.addIssue({ code: "custom", path: ["records"], message: `PROCUREMENT_WORKSPACE_DUPLICATE_RECORD:${record.recordId}` });
    }
    ids.add(record.recordId);
  }
  const linkIds = new Set<string>();
  for (const link of workspace.links) {
    if (linkIds.has(link.linkId)) {
      ctx.addIssue({ code: "custom", path: ["links"], message: `PROCUREMENT_WORKSPACE_DUPLICATE_LINK:${link.linkId}` });
    }
    linkIds.add(link.linkId);
    if (!ids.has(link.fromRecordId) || !ids.has(link.toRecordId)) {
      ctx.addIssue({ code: "custom", path: ["links"], message: `PROCUREMENT_WORKSPACE_LINK_ENDPOINT_MISSING:${link.linkId}` });
    }
  }
});

export type ArkiPublicProcurementWorkspace = z.infer<typeof ArkiPublicProcurementWorkspaceSchema>;

export function validatePublicProcurementWorkspace(input: unknown) {
  const workspace = ArkiPublicProcurementWorkspaceSchema.parse(input);
  return {
    schema: workspace.schema,
    workspaceId: workspace.context.workspaceId,
    moduleCount: Object.keys(workspace.moduleCoverage).length,
    connectedModules: Object.values(workspace.moduleCoverage).filter(value => value === "CONNECTED").length,
    partialModules: Object.values(workspace.moduleCoverage).filter(value => value === "PARTIAL").length,
    disconnectedModules: Object.values(workspace.moduleCoverage).filter(value => value === "NOT_CONNECTED").length,
    recordCount: workspace.records.length,
    linkCount: workspace.links.length,
    verifiedLinks: workspace.links.filter(link => link.status === "VERIFIED").length,
    unresolvedLinks: workspace.links.filter(link => link.status === "CANDIDATE" || link.status === "UNKNOWN").length,
    contradictedLinks: workspace.links.filter(link => link.status === "CONTRADICTED").length,
    canonicalMutation: false as const,
    limitations: [
      "This contract validates shared identity and explicit relationships; it does not acquire source data or prove source completeness.",
      "CANDIDATE, UNKNOWN and CONTRADICTED links are never promoted to VERIFIED automatically.",
      "OECE publication identity requires both mainId and ocid; OCID alone is not a unique publication key.",
      "Territorial, PAC, supplier and technical-expedient relationships require their own source evidence.",
    ],
  };
}

export function publicProcurementWorkspaceContract() {
  return {
    schema: "ARKI-PUBLIC-PROCUREMENT-WORKSPACE-1.0",
    modules: ProcurementModuleSchema.options,
    sharedContext: ["jurisdiction", "entityId", "fiscalYear", "geographicScope", "observationWindow"],
    sharedIdentity: ["mainId", "ocid", "pacItemId", "territoryRef", "supplierRef", "expedienteRef", "amountId"],
    relationshipStatuses: ProcurementLinkStatusSchema.options,
    evidenceRequiredForVerifiedLinks: true,
    humanReviewRequiredForVerifiedLinks: true,
    canonicalMutation: false,
    oneWorkspace: true,
  } as const;
}
