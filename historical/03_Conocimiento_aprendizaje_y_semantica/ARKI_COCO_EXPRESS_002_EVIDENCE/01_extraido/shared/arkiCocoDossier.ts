export type DossierDocumentType = "DESIGN_BRIEF" | "DESCRIPTIVE_REPORT" | "CALCULATION_REPORT" | "DRAWING" | "TECHNICAL_SPECIFICATION" | "QUANTITY_TAKEOFF" | "COST_ITEM" | "UNIT_PRICE_ANALYSIS" | "BUDGET" | "SCHEDULE" | "REVISION" | "OBSERVATION" | "RESPONSE" | "APPROVAL" | "SIGNATURE_REQUIREMENT" | "SUPPORTING_EVIDENCE";
export type DossierReviewState = "DRAFT" | "UNDER_REVIEW" | "OBSERVED" | "CORRECTED" | "REVALIDATION_REQUIRED" | "APPROVED" | "SUPERSEDED" | "UNKNOWN";
export type DossierResponsibility = "COMPUTED" | "GENERATED" | "CHECKED" | "PROFESSIONALLY_REVIEWED" | "SIGNED" | "ISSUED";
export type DossierLinkKind = "ELEMENT" | "DRAWING" | "SPECIFICATION" | "CALCULATION" | "BUDGET" | "VERSION" | "DOCUMENT";
export type DossierLink = Readonly<{ kind: DossierLinkKind; sourceId: string; targetId: string; evidenceRef: string }>;
export type DossierDocument = Readonly<{ id: string; projectId: string; revisionId: string; type: DossierDocumentType; title: string; state: DossierReviewState; responsibility: DossierResponsibility; contentFingerprint: string; traceability: readonly DossierLink[]; provenance: Readonly<{ source: string; actorId?: string; evidenceRefs: readonly string[] }>; unknowns: readonly string[] }>;
export type DossierConsistencyIssue = Readonly<{ code: "DRAWING_MODEL" | "MODEL_QUANTITY" | "QUANTITY_BUDGET" | "SPECIFICATION_MODEL" | "SCHEDULE_SCOPE" | "REVISION"; severity: "WARNING" | "ERROR" | "UNKNOWN"; documentIds: readonly string[]; message: string }>;

export const isProfessionallySigned = (document: DossierDocument) => document.responsibility === "SIGNED";
export const canIssue = (document: DossierDocument) => document.state === "APPROVED" && isProfessionallySigned(document);
export const trace = (documents: readonly DossierDocument[], sourceId: string, kind?: DossierLinkKind) => documents.flatMap((document) => document.traceability.filter((link) => link.sourceId === sourceId && (!kind || link.kind === kind)).map((link) => ({ documentId: document.id, link })));
export const detectDossierConsistency = (documents: readonly DossierDocument[]): DossierConsistencyIssue[] => {
  const issues: DossierConsistencyIssue[] = [];
  const byType = (type: DossierDocumentType) => documents.filter((document) => document.type === type);
  for (const quantity of byType("QUANTITY_TAKEOFF")) if (!trace(documents, quantity.id, "ELEMENT").length && !quantity.unknowns.length) issues.push({ code: "MODEL_QUANTITY", severity: "UNKNOWN", documentIds: [quantity.id], message: "Quantity has no demonstrated element traceability." });
  for (const document of documents) if (document.state === "SUPERSEDED" && document.responsibility === "SIGNED") issues.push({ code: "REVISION", severity: "ERROR", documentIds: [document.id], message: "Superseded document cannot be issued." });
  return issues;
};
export const dossierFingerprint = (document: DossierDocument) => `${document.projectId}:${document.id}:${document.revisionId}:${document.contentFingerprint}`;
