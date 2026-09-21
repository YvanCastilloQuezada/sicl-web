import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { insertSiclProject, getSiclProject, listSiclProjects, updateSiclProject } from "./db";
import { type RecordKind, type SiclRecord, type SiclSnapshot } from "./siclCore";
import { siclCorePort } from "./siclCorePort";
import { analyzeVisualPhoto } from "./visualField";
import { extractOcr, classifyDocumentStructure, type OcrInputKind } from "./arkiOcr";
import { storagePut } from "./storage";
import { comparisonCollectionForRecommendation, nextRecommendationVersion } from "./recommendationVersion";
import { createCorePreference, createCoreProject, createCoreRecommendation, fetchCanonicalCouncil, fetchCanonicalHistory, fetchCanonicalSnapshot, fetchOperationsResearchMethods, hasCoreUrl, recordCoreDecision, recordCoreHumanReview } from "./coreHttpClient";
import { generateProjectId } from "@shared/project-id";
import { executeArchitecturalReasoning } from "./arkiD62ReasoningHarness";
import { generateArkiPhotorealisticVisual, VISUAL_PRESETS } from "./arkiVisualIntelligence";
import { executeProjectBrainWave1 } from "./arkiProjectBrain";
import { commercialApiContract, handleCommercialApiRequest } from "./arkiCommercialApi";

const recordKinds = ["sources", "evidence", "requirements", "objectives", "constraints", "preferences", "alternatives", "evaluations", "comparisons", "multiComparisons", "decisionConditions"] as const;
const projectInput = z.object({ name: z.string().trim().min(3), location: z.string().trim().optional(), projectId: z.string().trim().min(3).optional(), spatialScale: z.enum(["PROJECT", "SECTOR", "DISTRICT", "CITY", "METROPOLITAN_AREA", "REGION", "MACROREGION", "COUNTRY"]).default("PROJECT"), temporalHorizon: z.enum(["PRESENT", "2030", "2040", "2050"]).default("PRESENT") });
const versionInput = z.object({ projectId: z.string().min(1), expectedVersion: z.number().int().positive() });
const projectBrainInput = z.object({ projectId: z.string().min(1), name: z.string().min(1), typology: z.string().min(1), brief: z.string().min(10), location: z.string().optional(), jurisdiction: z.string().optional(), site: z.record(z.string(), z.unknown()).optional(), knownFacts: z.array(z.string()).default([]), assumptions: z.array(z.string()).default([]), unknowns: z.array(z.string()).default([]), conflicts: z.array(z.string()).default([]), requirements: z.array(z.string()).default([]), objectives: z.array(z.string()).default([]), constraints: z.array(z.string()).default([]), preferences: z.array(z.string()).default([]), activities: z.array(z.record(z.string(), z.unknown())).default([]), relationships: z.array(z.record(z.string(), z.unknown())).default([]), capacities: z.record(z.string(), z.number()).default({}), stakeholders: z.array(z.string()).default([]), sourceIds: z.array(z.string()).default([]) });

function fail(message: string): never { throw new TRPCError({ code: "BAD_REQUEST", message }); }
function event(actorId: number, type: string, entityId: string, data: Record<string, unknown>) {
  return { id: crypto.randomUUID(), type, entityId, actorId, createdAt: new Date().toISOString(), data };
}
function localCoreEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.SICL_ALLOW_LOCAL_CORE === "true";
}

function requireCanonicalCoreOrExplicitLocal() {
  if (!hasCoreUrl() && !localCoreEnabled()) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "SICL_CORE_URL is required; set SICL_ALLOW_LOCAL_CORE=true only for explicit local development" });
}


async function ownedProject(ownerId: number, projectId: string) {
  requireCanonicalCoreOrExplicitLocal();
  const project = await getSiclProject(ownerId, projectId);
  if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "SICL project not found" });
  return project;
}
async function saveNext(ownerId: number, projectId: string, expectedVersion: number, snapshot: SiclSnapshot, status?: "DRAFT" | "ACTIVE" | "DECIDED" | "ARCHIVED") {
  const updated = await updateSiclProject(ownerId, projectId, expectedVersion, JSON.stringify(snapshot), status);
  if (!updated) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving" });
  return { version: expectedVersion + 1, snapshot };
}

export const appRouter = router({
  system: systemRouter,
  visualField: router({
    analyze: protectedProcedure.input(z.object({ projectId: z.string().min(1), spatialScope: z.string().min(1), imageDataUrl: z.string().startsWith("data:image/") })).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      const analysis = await analyzeVisualPhoto(input.imageDataUrl, { spatialScope: input.spatialScope });
      return { projectId: input.projectId, mediaId: null, proposals: analysis.observations.map((observation, index) => ({ evidence_id: `VAI-${Date.now().toString(36).toUpperCase()}-${index + 1}`, ...observation, status: "AI_PROPOSED", provider: analysis.provider, model: analysis.model })), decisionCreated: false, humanReviewRequired: true };
    }),
    ingest: protectedProcedure.input(z.object({ projectId: z.string().min(1), fileName: z.string().trim().min(1), mimeType: z.string().min(1), dataUrl: z.string().startsWith("data:"), sourceType: z.enum(["CAMERA_SOURCE", "PHOTO_SOURCE", "SITE_SOURCE", "DOCUMENT_SOURCE", "BOOK_SOURCE", "DRAWING_SOURCE", "PLAN_SOURCE", "TABLE_SOURCE", "MAP_SOURCE", "USER_PROVIDED_SOURCE"]), spatialScope: z.string().default("PROJECT"), ocrKind: z.enum(["IMAGE", "PDF", "SCANNED_PDF", "PLAN", "BOOK_PAGE", "TABLE", "PHOTO_OF_DOCUMENT"]).default("IMAGE"), language: z.string().default("eng"), runOcr: z.boolean().default(true), analyzeVisual: z.boolean().default(false), note: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const project = await ownedProject(ctx.user.id, input.projectId);
      const sourceId = `SRC-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const base64 = input.dataUrl.split(",", 2)[1];
      if (!base64) fail("Media data is not valid base64");
      const media = await storagePut(`projects/${input.projectId}/sources/${input.fileName}`, Buffer.from(base64, "base64"), input.mimeType);
      const ocr = input.runOcr ? await extractOcr({ sourceId, dataUrl: input.dataUrl, kind: input.ocrKind as OcrInputKind, language: input.language }) : [];
      const visual = input.analyzeVisual && input.mimeType.startsWith("image/") ? await analyzeVisualPhoto(input.dataUrl, { spatialScope: input.spatialScope, mediaId: media.key }) : null;
      const sourceRecord = { id: sourceId, name: input.fileName, status: "SOURCE_INGESTED", provenance: [`MEDIA:${media.key}`, `PROJECT:${input.projectId}`, `CAPTURE_TYPE:${input.sourceType}`], data: { sourceType: input.sourceType, mimeType: input.mimeType, mediaUrl: media.url, mediaKey: media.key, captureTimestamp: new Date().toISOString(), note: input.note ?? "", ocr: ocr as unknown as string, visual: visual ? JSON.stringify(visual) : "", documentStructure: ocr[0] ? JSON.stringify(classifyDocumentStructure(ocr.map((item) => item.normalizedText).join("\n"))) : "" } } as unknown as SiclRecord;
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      const next = siclCorePort.appendRecord(snapshot, "sources", sourceRecord, event(ctx.user.id, "MULTIMODAL_SOURCE_INGESTED", sourceId, { observedVersion: project.version, sourceType: input.sourceType, ocrCount: ocr.length, visualCount: visual?.observations.length ?? 0, humanReviewRequired: true }));
      const saved = await saveNext(ctx.user.id, input.projectId, project.version, next, "ACTIVE");
      return { projectId: input.projectId, sourceId, media, ocr, visual, version: saved.version, humanReviewRequired: true, promotion: "PROMOTION_NOT_REQUESTED" };
    }),
  }),
  visualGeneration: router({
    presets: publicProcedure.query(() => ({ presets: VISUAL_PRESETS, arCapabilities: ["camera_context_overlay", "photorealistic_reference_render", "two_stake_calibration", "geospatial_anchor_candidate", "WebXR_optional", "occlusion_and_scale_require_device_validation"] })),
    generate: protectedProcedure.input(z.object({ projectId: z.string().min(1), prompt: z.string().trim().min(10), quality: z.enum(["HD", "2K", "FULL_HD", "4K"]), purpose: z.enum(["EXTERIOR_RENDER", "INTERIOR_RENDER", "MATERIAL_STUDY", "AR_OVERLAY", "SITE_CONTEXT"]), referenceImageUrl: z.string().url().optional(), preserveGeometry: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      return generateArkiPhotorealisticVisual(input);
    }),
  }),
  projectBrain: router({
    analyze: protectedProcedure.input(projectBrainInput).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      return executeProjectBrainWave1(input as never);
    }),
  }),
  commercialApi: router({
    contract: publicProcedure.query(() => commercialApiContract()),
    capabilities: publicProcedure.query(() => handleCommercialApiRequest({ apiVersion: "v1", tenantId: "public", actorId: "catalog", plan: "EVALUATION", operation: "CAPABILITIES", idempotencyKey: "catalog" }).result),
    register: protectedProcedure.input(z.object({ tenantId: z.string().min(1), plan: z.enum(["EVALUATION", "PROFESSIONAL", "ENTERPRISE"]), operation: z.enum(["CAPABILITIES", "ARCHITECTURE_PLAN", "EXPORT_REQUEST"]), idempotencyKey: z.string().min(1) })).mutation(({ ctx, input }) => handleCommercialApiRequest({ apiVersion: "v1", tenantId: input.tenantId, actorId: String(ctx.user.id), plan: input.plan, operation: input.operation, idempotencyKey: input.idempotencyKey })),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }),
  }),
  projects: router({
    operationsResearchMethods: protectedProcedure.query(async () => {
      requireCanonicalCoreOrExplicitLocal();
      return (await fetchOperationsResearchMethods()) ?? { contract_version: "local", read_only: true, methods: [] };
    }),
    list: protectedProcedure.query(({ ctx }) => { requireCanonicalCoreOrExplicitLocal(); return listSiclProjects(ctx.user.id); }),
    get: protectedProcedure.input(z.object({ projectId: z.string().min(1) })).query(async ({ ctx, input }) => {
      const project = await ownedProject(ctx.user.id, input.projectId);
      const canonical = await fetchCanonicalSnapshot(project.projectId);
      if (canonical && "not_found" in canonical) throw new TRPCError({ code: "NOT_FOUND", message: canonical.detail ?? "SICL project not found" });
      if (!canonical) return { ...project, snapshot: siclCorePort.parseSnapshot(project.snapshot) };
      const localContext = siclCorePort.parseSnapshot(project.snapshot);
      const parsedCanonical = siclCorePort.parseSnapshot(JSON.stringify(canonical.snapshot));
      const snapshot = { ...parsedCanonical, spatialScope: parsedCanonical.spatialScope ?? localContext.spatialScope, temporalScope: parsedCanonical.temporalScope ?? localContext.temporalScope };
      return { ...project, snapshot };
    }),
    sources: protectedProcedure.input(z.object({ projectId: z.string().min(1), sourceType: z.string().optional() })).query(async ({ ctx, input }) => {
      const project = await ownedProject(ctx.user.id, input.projectId);
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      const sources = input.sourceType ? snapshot.sources.filter((source) => String((source.data as Record<string, unknown> | undefined)?.sourceType ?? "") === input.sourceType) : snapshot.sources;
      return { projectId: project.projectId, version: project.version, sources, humanReviewRequired: sources.some((source) => source.status === "SOURCE_INGESTED" || source.status === "AI_PROPOSED") };
    }),
    create: protectedProcedure.input(projectInput).mutation(async ({ ctx, input }) => {
      requireCanonicalCoreOrExplicitLocal();
      const projectId = input.projectId ?? generateProjectId();
      if (hasCoreUrl()) {
        const canonical = await createCoreProject(projectId, input.name, { spatialScope: { scale: input.spatialScale, id: projectId, name: input.location || input.name }, temporalScope: { horizon: input.temporalHorizon } });
        const snapshot = { ...canonical.snapshot, spatial_scope: { scale: input.spatialScale, id: projectId, name: input.location || input.name }, temporal_scope: { horizon: input.temporalHorizon } };
        await insertSiclProject({ ownerId: ctx.user.id, projectId, name: input.name, location: input.location ?? null, version: canonical.observed_version, snapshot: JSON.stringify(snapshot), status: "ACTIVE" });
        return { projectId, version: canonical.observed_version };
      }
      const snapshot = siclCorePort.emptySnapshot();
      snapshot.spatialScope = { scale: input.spatialScale, id: projectId, name: input.location || input.name };
      snapshot.temporalScope = { horizon: input.temporalHorizon };
      snapshot.events.push(event(ctx.user.id, "PROJECT_CREATED", projectId, { name: input.name, spatialScale: input.spatialScale, temporalHorizon: input.temporalHorizon }));
      await insertSiclProject({ ownerId: ctx.user.id, projectId, name: input.name, location: input.location ?? null, status: "DRAFT", version: 1, snapshot: JSON.stringify(snapshot) });
      return { projectId, version: 1 };
    }),
    addRecord: protectedProcedure.input(versionInput.extend({ kind: z.enum(recordKinds), record: z.record(z.string(), z.unknown()) })).mutation(async ({ ctx, input }) => {
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving" });
      const record = input.record as SiclRecord;
      const rawRecord = input.record as Record<string, unknown>;
      if (hasCoreUrl() && input.kind === "decisionConditions") fail("Decision Conditions require a canonical endpoint; local authoring is disabled when SICL_CORE_URL is configured");
      if (hasCoreUrl() && input.kind === "preferences") {
        const requiredText = (key: string) => { const value = rawRecord[key]; if (typeof value !== "string" || !value.trim()) fail(`Preference ${key} is required`); return value; };
        const scopeType = typeof rawRecord.scopeType === "string" ? rawRecord.scopeType : "PROJECT";
        const strength = typeof rawRecord.strength === "string" ? rawRecord.strength : "SOFT";
        const status = typeof rawRecord.status === "string" ? rawRecord.status : "ACTIVE";
        return createCorePreference(input.projectId, { preference_id: requiredText("id"), name: requiredText("name"), justification: requiredText("justification"), domain: typeof rawRecord.domain === "string" && rawRecord.domain.trim() ? rawRecord.domain : "GENERAL", strength, scope_type: scopeType, scope_id: requiredText("scopeId"), provenance: Array.isArray(rawRecord.provenance) ? rawRecord.provenance : [], valid_from: typeof rawRecord.validFrom === "string" ? rawRecord.validFrom : null, valid_until: typeof rawRecord.validUntil === "string" ? rawRecord.validUntil : null, status, expected_project_version: input.expectedVersion, event_id: crypto.randomUUID() });
      }
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      const next = siclCorePort.appendRecord(snapshot, input.kind as RecordKind, record, event(ctx.user.id, "SICL_RECORD_ADDED", record.id, { kind: input.kind, observedVersion: input.expectedVersion }));
      return saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "ACTIVE");
    }),
    council: protectedProcedure.input(z.object({ projectId: z.string().min(1) })).query(async ({ ctx, input }) => {
      const project = await ownedProject(ctx.user.id, input.projectId);
      const council = await fetchCanonicalCouncil(project.projectId);
      if (council && "not_found" in council) throw new TRPCError({ code: "NOT_FOUND", message: typeof council.detail === "string" ? council.detail : "SICL project not found" });
      if (council) return council;
      const canonical = await fetchCanonicalSnapshot(project.projectId);
      if (canonical && "not_found" in canonical) throw new TRPCError({ code: "NOT_FOUND", message: canonical.detail ?? "SICL project not found" });
      const snapshot = canonical && "snapshot" in canonical ? siclCorePort.parseSnapshot(JSON.stringify(canonical.snapshot)) : siclCorePort.parseSnapshot(project.snapshot);
      const version = canonical && "observed_version" in canonical ? canonical.observed_version : project.version;
      return { projectId: project.projectId, version, ...siclCorePort.analysisView(snapshot) };
    }),
    reasoningExecute: protectedProcedure.input(versionInput.extend({ executionId: z.string().min(1), brief: z.string().trim().min(10), context: z.record(z.string(), z.unknown()), constraints: z.array(z.string()), knownFacts: z.array(z.string()).optional(), unknowns: z.array(z.string()).optional(), requestedReasoningDepth: z.enum(["MINIMUM", "STANDARD", "DEEP"]), seed: z.string().optional(), perturbations: z.array(z.object({ id: z.string().min(1), statement: z.string().min(1), changes: z.record(z.string(), z.unknown()).optional() })).optional(), failures: z.array(z.object({ id: z.string().min(1), statement: z.string().min(1), affectedElement: z.string().optional() })).optional(), counterexamples: z.array(z.object({ id: z.string().min(1), claim: z.string().min(1), observation: z.string().min(1) })).optional() })).mutation(async ({ ctx, input }) => {
      if (hasCoreUrl()) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "L2 reasoning requires a canonical reasoning-write endpoint; no remote write is guessed or emulated." });
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before reasoning" });
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      const result = executeArchitecturalReasoning({ executionId: input.executionId, projectId: input.projectId, brief: input.brief, context: input.context, constraints: input.constraints, knownFacts: input.knownFacts, unknowns: input.unknowns, requestedReasoningDepth: input.requestedReasoningDepth, seed: input.seed, perturbations: input.perturbations, failures: input.failures, counterexamples: input.counterexamples }, snapshot, project.version, "ARKI-L2-TRANSFER-1.0");
      const next = { ...snapshot, reasoningExecutions: [...snapshot.reasoningExecutions, result.execution], events: [...snapshot.events, event(ctx.user.id, "ARCHITECTURAL_REASONING_EXECUTED", result.execution.executionId, { observedVersion: input.expectedVersion, transferCount: result.transferDecisions.length, strategyCount: result.strategies.length, humanReviewRequired: true })] };
      const saved = await saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "ACTIVE");
      return { ...result, version: saved.version, persistence: "PASS", humanAuthority: "FINAL", promotion: "HUMAN_REVIEW_REQUIRED" };
    }),
    recommendationCreate: protectedProcedure.input(versionInput.extend({ recommendationId: z.string().min(1), alternativeId: z.string().min(1), reason: z.string().trim().min(10), basedOn: z.string().min(1), basedOnKind: z.enum(["BINARY", "MULTI_CRITERIA", "COUNCIL_FINDING", "COUNCIL_ASSESSMENT", "COLLECTIVE_AGGREGATE"]), source: z.literal("ANALYTICAL") })).mutation(async ({ ctx, input }) => {
      if (hasCoreUrl()) return createCoreRecommendation(input.projectId, { recommendation_id: input.recommendationId, alternative_id: input.alternativeId, based_on: input.basedOn, based_on_kind: input.basedOnKind, reason: input.reason, expected_project_version: input.expectedVersion, event_id: crypto.randomUUID() });
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving" });
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      if (!snapshot.alternatives.some((item) => item.id === input.alternativeId)) fail("Recommendation alternativeId does not exist");
      if (input.source === "ANALYTICAL") { const comparisonCollection = comparisonCollectionForRecommendation(input.basedOnKind, snapshot); if (!comparisonCollection.some((item) => item.id === input.basedOn)) fail("Analytical recommendation requires an existing comparison of the declared kind"); }
      const recommendationVersion = nextRecommendationVersion(snapshot.recommendations.filter((item) => item.id === input.recommendationId).map((item) => item.recommendationVersion));
      const recommendation = { id: input.recommendationId, name: `Recommendation ${input.recommendationId}`, alternativeId: input.alternativeId, reason: input.reason, basedOn: input.basedOn, basedOnKind: input.basedOnKind, source: input.source, recommendationVersion };
      const next = siclCorePort.appendRecord(snapshot, "recommendations", recommendation, event(ctx.user.id, "RECOMMENDATION_CREATED", recommendation.id, { observedVersion: input.expectedVersion, recommendationVersion }));
      return saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "ACTIVE");
    }),
    reviewRecord: protectedProcedure.input(versionInput.extend({ reviewId: z.string().min(1), recommendationId: z.string().min(1), actorId: z.string().min(1), confirmationId: z.string().min(1), reason: z.string().trim().min(10), recommendationVersion: z.number().int().positive(), status: z.enum(["ACCEPTED", "MODIFIED", "REJECTED"]), authorityBasis: z.string().min(1).default("HUMAN_REVIEW") })).mutation(async ({ ctx, input }) => {
      if (hasCoreUrl()) return recordCoreHumanReview(input.projectId, { review_id: input.reviewId, recommendation_id: input.recommendationId, actor_id: input.actorId, authority_basis: input.authorityBasis, confirmation_id: input.confirmationId, status: input.status, reason: input.reason, observed_project_version: input.expectedVersion, recommendation_version: input.recommendationVersion, expected_project_version: input.expectedVersion, event_id: crypto.randomUUID() });
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving" });
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      const recommendation = snapshot.recommendations.find((item) => item.id === input.recommendationId);
      if (!recommendation || Number(recommendation.recommendationVersion) !== input.recommendationVersion) fail("HumanReview recommendation version mismatch");
      const review = { id: input.reviewId, recommendationId: input.recommendationId, actorId: input.actorId, confirmationId: input.confirmationId, reason: input.reason, status: input.status, observedVersion: input.expectedVersion, recommendationVersion: input.recommendationVersion };
      const next = siclCorePort.appendHumanReview(snapshot, review, event(ctx.user.id, "HUMAN_REVIEW_RECORDED", review.id, { observedVersion: input.expectedVersion, recommendationVersion: input.recommendationVersion }));
      return saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "ACTIVE");
    }),
    decisionPrepare: protectedProcedure.input(versionInput.extend({ selectedAlternativeId: z.string().min(1), actorId: z.string().min(1), authorityBasis: z.string().min(1), confirmationId: z.string().min(1), rationale: z.string().trim().min(10) })).query(async ({ ctx, input }) => {
      const project = await ownedProject(ctx.user.id, input.projectId);
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before preparing" });
      if (!snapshot.alternatives.some((item) => item.id === input.selectedAlternativeId)) fail("Decision selectedAlternativeId does not exist");
      return { ready: true, writeRequired: true, decisionType: "HUMAN", observedVersion: input.expectedVersion, actorId: input.actorId, authorityBasis: input.authorityBasis, confirmationId: input.confirmationId, rationale: input.rationale, selectedAlternativeId: input.selectedAlternativeId };
    }),
    decisionRecord: protectedProcedure.input(versionInput.extend({ decisionId: z.string().min(1), selectedAlternativeId: z.string().min(1), actorId: z.string().min(1), authorityBasis: z.string().min(1), confirmationId: z.string().min(1), rationale: z.string().trim().min(10) })).mutation(async ({ ctx, input }) => {
      if (hasCoreUrl()) return recordCoreDecision(input.projectId, { decision_id: input.decisionId, selected_alternative_id: input.selectedAlternativeId, decision_maker: input.actorId, rationale: input.rationale, expected_project_version: input.expectedVersion, event_id: crypto.randomUUID(), authority_context: { actor_id: input.actorId, authority_basis: input.authorityBasis, confirmation_id: input.confirmationId } });
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving" });
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      if (!snapshot.alternatives.some((item) => item.id === input.selectedAlternativeId)) fail("Decision selectedAlternativeId does not exist");
      const decision = { id: input.decisionId, selectedAlternativeId: input.selectedAlternativeId, actorId: input.actorId, authorityBasis: input.authorityBasis, confirmationId: input.confirmationId, rationale: input.rationale, observedVersion: input.expectedVersion, decisionType: "HUMAN" };
      const next = siclCorePort.appendHumanDecision(snapshot, decision, event(ctx.user.id, "HUMAN_DECISION_RECORDED", decision.id, { observedVersion: input.expectedVersion, actorId: input.actorId, authorityBasis: input.authorityBasis }));
      return saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "DECIDED");
    }),
    audit: protectedProcedure.input(z.object({ projectId: z.string().min(1) })).query(async ({ ctx, input }) => {
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (hasCoreUrl()) {
        const history = await fetchCanonicalHistory(project.projectId);
        if (history && "not_found" in history) throw new TRPCError({ code: "NOT_FOUND", message: history.detail ?? "SICL project not found" });
        if (history) {
          const canonical = await fetchCanonicalSnapshot(project.projectId);
          const snapshot = canonical && "snapshot" in canonical ? siclCorePort.parseSnapshot(JSON.stringify(canonical.snapshot)) : siclCorePort.emptySnapshot();
          return { projectId: project.projectId, version: history.observed_version, events: history.events, humanReviews: snapshot.humanReviews, decisions: snapshot.decisions };
        }
      }
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      return { projectId: project.projectId, version: project.version, events: snapshot.events, humanReviews: snapshot.humanReviews, decisions: snapshot.decisions };
    }),
  }),
});

export type AppRouter = typeof appRouter;
