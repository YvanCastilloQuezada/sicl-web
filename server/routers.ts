import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { archiveParametricFile, insertParametricFile, insertSiclProject, getSiclProject, listArkiCommandSessions, listParametricFiles, listSiclProjects, saveArkiCommandSession, updateSiclProject } from "./db";
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
import { executeArkiSuperpowersPack } from "./arkiSuperpowersPack";
import { orchestrateAgents } from "./arkiAgentOrchestrator";
import { AGENT_REGISTRY } from "./arkiAgentRegistry";
import { nativeAdapterCapabilityMatrix } from "./arkiNativeAdapters";
import { executeParametricGraph, inspectParametricArtifact, parametricRuntimeCatalog, type ParametricGraph } from "./arkiParametricRuntime";
import { publishParametricEvent } from "./parametricRealtime";
import { executeAuthorizedHostWorker, hostWorkerCatalog } from "./parametricHostWorkers";
import { architecturalAssimilation, exchangePackage, parseArkProposal, type ArkGeometry } from "./arkiParametricExchange";
import { spatialArCatalog } from "./arkiSpatialAr";
import { architectureContractSummary, authorizeCoreOperation, layerCatalog, verticalFlowProof } from "./arkiThreeLayerArchitecture";
import { listSecurityEvents, verifySecurityEventChain } from "./security";
import { securityLayerCatalog } from "./arkiSecurityLayers";
import { ARKI_RESEARCH_SUPERPOWER, authorizeResearchWrite, buildExcelReviewRow, inspectPublicResearchSource, listResearchCandidates, researchCyclePolicy, reviewResearchCandidate, stageResearchCandidate } from "./arkiResearchSuperpower";
import { ENV } from "./_core/env";
import { arkiCostModuleContract, calculateArkiCostModel } from "./arkiCostIntelligence";
import { arkiEtiBimContract } from "./arkiEtiBim";
import { arkiBimViewerContract, detectBimInterferences, inspectBimArtifact, type BimViewerModel } from "./arkiBimViewer";
import { runPreliminaryPredimensioning, transversalKnowledgeContract } from "./arkiTransversalEngineering";
import { ARKI_TRANSVERSAL_SPECIALTIES, buildSpecialtyCoordinationPlan, validateAuthorizedExchangeHost } from "./arkiTransversalSpecialties";
import { professionalAuthorityContract, recordProfessionalReview } from "./arkiProfessionalReview";

const recordKinds = ["sources", "evidence", "requirements", "objectives", "constraints", "preferences", "alternatives", "evaluations", "comparisons", "multiComparisons", "decisionConditions"] as const;
const projectInput = z.object({ name: z.string().trim().min(3), location: z.string().trim().optional(), projectId: z.string().trim().min(3).optional(), spatialScale: z.enum(["PROJECT", "SECTOR", "DISTRICT", "CITY", "METROPOLITAN_AREA", "REGION", "MACROREGION", "COUNTRY"]).default("PROJECT"), temporalHorizon: z.enum(["PRESENT", "2030", "2040", "2050"]).default("PRESENT") });
const versionInput = z.object({ projectId: z.string().min(1), expectedVersion: z.number().int().positive() });
const initialIntakeInput = versionInput.extend({ intent: z.string().trim().min(1), location: z.string().trim().default("UNKNOWN"), site: z.string().trim().default("UNKNOWN"), dimensions: z.string().trim().default("UNKNOWN"), occupants: z.string().trim().default("UNKNOWN"), budget: z.string().trim().default("UNKNOWN") });
const projectBrainInput = z.object({ projectId: z.string().min(1), name: z.string().min(1), typology: z.string().min(1), brief: z.string().min(10), location: z.string().optional(), jurisdiction: z.string().optional(), site: z.record(z.string(), z.unknown()).optional(), knownFacts: z.array(z.string()).default([]), assumptions: z.array(z.string()).default([]), unknowns: z.array(z.string()).default([]), conflicts: z.array(z.string()).default([]), requirements: z.array(z.string()).default([]), objectives: z.array(z.string()).default([]), constraints: z.array(z.string()).default([]), preferences: z.array(z.string()).default([]), activities: z.array(z.record(z.string(), z.unknown())).default([]), relationships: z.array(z.record(z.string(), z.unknown())).default([]), capacities: z.record(z.string(), z.number()).default({}), stakeholders: z.array(z.string()).default([]), sourceIds: z.array(z.string()).default([]) });
const superpowersInput = z.object({ projectId: z.string().regex(/^[A-Z]{3}-[A-Z]{3}-\d{3}-\d{3}$/), projectName: z.string().min(1), typology: z.string().min(1), brief: z.string().min(10), context: z.record(z.string(), z.unknown()).default({}), constraints: z.array(z.string()).default([]), activities: z.array(z.record(z.string(), z.unknown())).default([]), relationships: z.array(z.record(z.string(), z.unknown())).default([]), subjects: z.array(z.string()).default([]), conditions: z.array(z.string()).default([]), unknowns: z.array(z.string()).default([]), envelope: z.object({ width: z.number().positive(), height: z.number().positive() }), sourceIds: z.array(z.string()).default([]), requestedPieces: z.array(z.string()).optional(), change: z.string().optional(), baselineDecision: z.string().optional(), alternatives: z.array(z.record(z.string(), z.unknown())).optional(), decisions: z.array(z.record(z.string(), z.unknown())).optional() });
const agentOrchestrationInput = superpowersInput.extend({ problem: z.string().optional(), phase: z.string().optional(), jurisdiction: z.string().optional(), requestedAgents: z.array(z.string()).optional() });

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

function requireOwnerHumanAuthority(ctx: { user: { role: string; openId: string } }) {
  if (ctx.user.role !== "admin" || !ENV.ownerOpenId || ctx.user.openId !== ENV.ownerOpenId) throw new TRPCError({ code: "FORBIDDEN", message: "OWNER_HUMAN_AUTHORITY_REQUIRED" });
}


async function ownedProject(ownerId: number, projectId: string) {
  requireCanonicalCoreOrExplicitLocal();
  const project = await getSiclProject(ownerId, projectId);
  if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "SICL project not found" });
  return project;
}
async function saveNext(ownerId: number, projectId: string, expectedVersion: number, snapshot: SiclSnapshot, status?: "DRAFT" | "ACTIVE" | "DECIDED" | "ARCHIVED", operation: "PROJECT_STATE_COMMIT" | "INITIAL_INTAKE_COMMIT" | "REASONING_APPEND" | "HUMAN_REVIEW_APPEND" | "HUMAN_DECISION_APPEND" = "PROJECT_STATE_COMMIT", humanApproved = false) {
  const authorization = authorizeCoreOperation({
    operation,
    sourceLayer: "CORE_TRUST",
    authority: operation === "HUMAN_REVIEW_APPEND" || operation === "HUMAN_DECISION_APPEND" ? "HUMAN" : "SYSTEM",
    humanApproved,
  });
  if (!verifySecurityEventChain()) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "MANIAC_CORE_DENY: audit integrity failure" });
  const updated = await updateSiclProject(ownerId, projectId, expectedVersion, JSON.stringify(snapshot), status);
  if (!updated) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving" });
  return { version: expectedVersion + 1, snapshot, authorization };
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
    generate: protectedProcedure.input(z.object({ projectId: z.string().min(1), prompt: z.string().trim().min(10), quality: z.enum(["HD", "2K", "FULL_HD", "4K", "8K", "16K"]), purpose: z.enum(["EXTERIOR_RENDER", "INTERIOR_RENDER", "MATERIAL_STUDY", "AR_OVERLAY", "SITE_CONTEXT"]), referenceImageUrl: z.string().url().optional(), preserveGeometry: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
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
  superpowers: router({
    run: protectedProcedure.input(superpowersInput).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      return executeArkiSuperpowersPack(input as never);
    }),
  }),
  agents: router({
    registry: publicProcedure.query(() => ({ version: "ARKI-KR6.3-AGENT-REGISTRY", note: "Read-only registry; A00–A59 external specialists remain target catalog only.", agents: AGENT_REGISTRY })),
    orchestrate: protectedProcedure.input(agentOrchestrationInput).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      return orchestrateAgents(input as never);
    }),
  }),
  commercialApi: router({
    contract: publicProcedure.query(() => commercialApiContract()),
    capabilities: publicProcedure.query(() => handleCommercialApiRequest({ apiVersion: "v1", tenantId: "public", actorId: "catalog", plan: "EVALUATION", operation: "CAPABILITIES", idempotencyKey: "catalog" }).result),
    register: protectedProcedure.input(z.object({ tenantId: z.string().min(1), plan: z.enum(["EVALUATION", "PROFESSIONAL", "ENTERPRISE"]), operation: z.enum(["CAPABILITIES", "ARCHITECTURE_PLAN", "EXPORT_REQUEST"]), idempotencyKey: z.string().min(1) })).mutation(({ ctx, input }) => handleCommercialApiRequest({ apiVersion: "v1", tenantId: input.tenantId, actorId: String(ctx.user.id), plan: input.plan, operation: input.operation, idempotencyKey: input.idempotencyKey })),
  }),
  nativeAdapters: router({
    registry: publicProcedure.query(() => ({ version: "ARKI-NATIVE-ADAPTERS-1.0", execution: "CONTRACTS_ONLY_WORKERS_NOT_INSTALLED", adapters: nativeAdapterCapabilityMatrix(), humanReviewRequired: true })),
  }),
  spatialAr: router({
    catalog: publicProcedure.query(() => spatialArCatalog()),
  }),
  architecture: router({
    contract: publicProcedure.query(() => architectureContractSummary()),
    layers: publicProcedure.query(() => layerCatalog()),
    verticalProof: publicProcedure.query(() => verticalFlowProof()),
  }),
  costs: router({
    contract: publicProcedure.query(() => arkiCostModuleContract()),
    calculate: protectedProcedure.input(z.object({
      projectId: z.string().min(1),
      currency: z.string().min(1),
      overheadRate: z.number().min(0).max(1).optional(),
      profitRate: z.number().min(0).max(1).optional(),
      taxRate: z.number().min(0).max(1).optional(),
      horizonYears: z.number().int().min(0).optional(),
      lines: z.array(z.object({
        id: z.string().min(1), type: z.enum(["OBSERVED_PRICE", "INPUT_UNIT_PRICE", "APU", "QUOTATION", "QUANTITY_TAKEOFF", "BUDGET", "IUPC_REFERENCE", "DERIVED_CALCULATION"]), code: z.string().optional(), description: z.string().min(1), unit: z.string().min(1), quantity: z.number().min(0), unitPrice: z.number().min(0), currency: z.string().min(1), confidence: z.enum(["VERIFIED", "PARTIALLY_VERIFIED", "DECLARED", "ESTIMATE", "UNKNOWN"]), observedAt: z.string().optional(), baseDate: z.string().optional(), validityUntil: z.string().optional(), region: z.string().optional(), supplier: z.string().optional(), sourceUrl: z.string().url().optional(), sourceDocument: z.string().optional(), sourcePage: z.string().optional(), taxStatus: z.enum(["INCLUDED", "EXCLUDED", "NOT_APPLICABLE", "UNKNOWN"]), taxRate: z.number().min(0).max(1).optional(), freight: z.number().min(0).optional(), installation: z.number().min(0).optional(), notes: z.string().optional(),
      })),
    })).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      return calculateArkiCostModel(input);
    }),
  }),
  etiBim: router({
    contract: publicProcedure.query(() => arkiEtiBimContract()),
  }),
  bimViewer: router({
    contract: publicProcedure.query(() => arkiBimViewerContract()),
    inspect: protectedProcedure.input(z.object({ projectId: z.string().min(1), fileName: z.string().min(1), content: z.string().max(25_000_000) })).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      return inspectBimArtifact(input.fileName, input.content);
    }),
    clashes: protectedProcedure.input(z.object({ projectId: z.string().min(1), tolerance: z.number().positive().max(1).optional(), models: z.array(z.unknown()).max(100) })).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      return detectBimInterferences(input.models as BimViewerModel[], input.tolerance);
    }),
  }),
  transversal: router({
    contract: publicProcedure.query(() => transversalKnowledgeContract()),
    specialties: publicProcedure.query(() => ({ schema: "ARKI-TRANSVERSAL-SPECIALTIES-1.0", count: ARKI_TRANSVERSAL_SPECIALTIES.length, specialties: ARKI_TRANSVERSAL_SPECIALTIES, humanReviewRequired: true as const })),
    coordinationPlan: protectedProcedure.input(z.object({ projectType: z.enum(["HOSPITAL", "AIRPORT", "COMPLEX_BUILDING"]), country: z.string().min(2), jurisdiction: z.string().optional(), codeFamilies: z.array(z.string()), sourceIds: z.array(z.string()), effectiveDate: z.string().optional(), verifiedBy: z.string().optional() })).mutation(({ input }) => buildSpecialtyCoordinationPlan(input.projectType, input)),
    validateHost: protectedProcedure.input(z.object({ format: z.enum(["RVT", "DYN", "IFC"]), hostId: z.string().optional(), hostVersion: z.string().optional(), capabilities: z.array(z.string()) })).mutation(({ input }) => validateAuthorizedExchangeHost(input)),
    predimensioning: protectedProcedure.input(z.object({ projectId: z.string().min(1), use: z.string().min(1), floors: z.number().int().min(1).max(200), typicalSpanM: z.number().positive(), maxSpanM: z.number().positive().optional(), floorToFloorM: z.number().positive(), structuralSystem: z.enum(["REINFORCED_CONCRETE_FRAME", "STEEL_FRAME", "MASONRY", "TIMBER", "UNKNOWN"]), columnWidthM: z.number().positive().optional(), columnDepthM: z.number().positive().optional(), beamDepthM: z.number().positive().optional(), slabThicknessM: z.number().positive().optional(), wetAreaCount: z.number().int().min(0).optional(), electricalRoomCount: z.number().int().min(0).optional(), hvacRequired: z.boolean().optional(), healthcareCritical: z.boolean().optional(), serviceShaftCount: z.number().int().min(0).optional() })).mutation(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); return runPreliminaryPredimensioning(input); }),
  }),
  professionalReview: router({
    contract: publicProcedure.query(() => professionalAuthorityContract()),
    submit: protectedProcedure.input(z.object({ projectId: z.string().min(1), specialtyId: z.string().min(1), role: z.enum(["ARCHITECT", "STRUCTURAL_ENGINEER", "SANITARY_ENGINEER", "ELECTRICAL_ENGINEER", "MECHANICAL_ENGINEER", "FIRE_ENGINEER", "BIOSAFETY_SPECIALIST", "ENVIRONMENTAL_SPECIALIST", "SOMA_SPECIALIST", "TRAFFIC_ENGINEER", "BIM_MANAGER", "OTHER_SPECIALIST"]), packageVersion: z.string().min(1), evidenceIds: z.array(z.string()), calculations: z.array(z.string()), openUnknowns: z.array(z.string()), proposedCorrections: z.array(z.string()), reviewerIdentity: z.string().optional(), licenseOrCredentialReference: z.string().optional(), decision: z.enum(["ACCEPT", "ACCEPT_WITH_CORRECTIONS", "REJECT", "REQUEST_MORE_EVIDENCE"]) })).mutation(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); return recordProfessionalReview(input); }),
  }),
  security: router({
    policy: adminProcedure.query(() => securityLayerCatalog()),
    recentEvents: adminProcedure.input(z.object({ limit: z.number().int().min(1).max(500).default(100) })).query(({ input }) => ({ events: listSecurityEvents(input.limit), retention: "IN_MEMORY_RING_BUFFER", auditIntegrity: verifySecurityEventChain(), note: "Production persistence requires the enterprise audit store." })),
  }),
  research: router({
    policy: publicProcedure.query(() => researchCyclePolicy()),
    inspect: protectedProcedure.input(z.object({ url: z.string().url().max(2048) })).mutation(async ({ ctx, input }) => {
      requireOwnerHumanAuthority(ctx);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8_000);
      try {
        return await inspectPublicResearchSource(input.url, controller.signal);
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "RESEARCH_SOURCE_UNAVAILABLE" });
      } finally {
        clearTimeout(timeout);
      }
    }),
    stageExcelRow: protectedProcedure.input(z.object({ sourceId: z.string().min(1), title: z.string().min(1), author: z.string().optional(), url: z.string().url(), topic: z.string().min(1), abstract: z.string().min(1).max(2000), terms: z.array(z.string().min(1)).max(30), rights: z.enum(["PUBLIC_METADATA_ONLY", "OPEN_LICENSE", "COPYRIGHTED", "UNKNOWN"]).default("UNKNOWN"), humanApproved: z.boolean().default(false) })).mutation(({ ctx, input }) => {
      requireOwnerHumanAuthority(ctx);
      const authorization = authorizeResearchWrite({ humanApproved: input.humanApproved, rights: input.rights, target: "EXCEL_REVIEW_STAGING" });
      if (!authorization.allowed) throw new TRPCError({ code: "FORBIDDEN", message: authorization.reason });
      return { authorization, row: stageResearchCandidate(input), stage: "STAGED_FOR_EXCEL", canonicalPromotion: "NOT_REQUESTED" };
    }),
    candidates: adminProcedure.query(() => ({ candidates: listResearchCandidates(), canonicalPromotion: "HUMAN_APPROVAL_REQUIRED" })),
    reviewCandidate: adminProcedure.input(z.object({ candidateId: z.string().min(1), decision: z.enum(["APPROVED_FOR_CORE", "REJECTED"]), correctedAbstract: z.string().max(2000).optional(), correctedTerms: z.array(z.string().min(1)).max(30).optional(), ownerAuthorityConfirmed: z.literal(true) })).mutation(({ ctx, input }) => {
      requireOwnerHumanAuthority(ctx);
      const candidate = reviewResearchCandidate(input.candidateId, input.decision, { abstract: input.correctedAbstract, terms: input.correctedTerms });
      return { candidate, corePromotion: input.decision === "APPROVED_FOR_CORE" ? "QUEUED_FOR_SEPARATE_CORE_VALIDATION" : "NOT_REQUESTED", authority: "OWNER_HUMAN_CONFIRMED" };
    }),
    contract: publicProcedure.query(() => ARKI_RESEARCH_SUPERPOWER),
  }),
  parametricRuntime: router({
    catalog: publicProcedure.query(() => parametricRuntimeCatalog()),
    inspect: protectedProcedure.input(z.object({ fileName: z.string().min(1), content: z.union([z.string(), z.instanceof(Buffer)]) })).mutation(({ input }) => inspectParametricArtifact(input)),
    list: protectedProcedure.input(z.object({ projectId: z.string().min(3) })).query(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); return listParametricFiles(ctx.user.id, input.projectId); }),
    upload: protectedProcedure.input(z.object({ projectId: z.string().min(3), fileName: z.string().trim().min(1).max(180), mimeType: z.string().min(1).max(120), dataUrl: z.string().startsWith("data:").max(25_000_000) })).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      const channel = `project:${input.projectId}`;
      publishParametricEvent(channel, { type: "UPLOAD_STARTED", projectId: input.projectId, fileName: input.fileName, progress: 5, message: "Upload started", humanReviewRequired: true, at: new Date().toISOString() });
      const [, base64] = input.dataUrl.split(",", 2);
      if (!base64) fail("Parametric file data is not valid base64");
      const content = Buffer.from(base64, "base64");
      publishParametricEvent(channel, { type: "VALIDATION_PROGRESS", projectId: input.projectId, fileName: input.fileName, progress: 45, message: "Inspecting format and checksum", humanReviewRequired: true, at: new Date().toISOString() });
      const manifest = inspectParametricArtifact({ fileName: input.fileName, content });
      const stored = await storagePut(`users/${ctx.user.id}/parametric/${Date.now()}-${input.fileName}`, content, input.mimeType);
      publishParametricEvent(channel, { type: "REVIEW_REQUIRED", projectId: input.projectId, artifactId: manifest.artifactId, fileName: input.fileName, progress: 80, message: manifest.hostRequired ? `Host gate: ${manifest.hostRequired}` : "Manifest ready for human review", humanReviewRequired: true, at: new Date().toISOString() });
      const persisted = await insertParametricFile({ ownerId: ctx.user.id, projectId: input.projectId, artifactId: manifest.artifactId, fileName: manifest.fileName, format: manifest.format, sizeBytes: manifest.sizeBytes, checksum: manifest.checksum, parsed: manifest.parsed ? 1 : 0, declaredDependencies: JSON.stringify(manifest.declaredDependencies), capabilities: JSON.stringify(manifest.capabilities), hostRequired: manifest.hostRequired, status: manifest.status, storageKey: stored.key, storageUrl: stored.url, humanReviewRequired: 1 });
      publishParametricEvent(channel, { type: "UPLOAD_COMPLETED", projectId: input.projectId, artifactId: manifest.artifactId, fileName: input.fileName, progress: 100, message: "Persisted and awaiting human review", humanReviewRequired: true, at: new Date().toISOString() });
      return { ...manifest, ...persisted, declaredDependencies: manifest.declaredDependencies, capabilities: manifest.capabilities, storageKey: stored.key, storageUrl: stored.url, humanReviewRequired: true };
    }),
    archive: protectedProcedure.input(z.object({ projectId: z.string().min(3), artifactId: z.string().min(1) })).mutation(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); return { archived: await archiveParametricFile(ctx.user.id, input.projectId, input.artifactId), artifactId: input.artifactId }; }),
    execute: protectedProcedure.input(z.object({ projectId: z.string().min(1), graph: z.object({ contractVersion: z.literal("ARKI-PARAMETRIC-1.0"), graphId: z.string().min(1), nodes: z.array(z.object({ id: z.string().min(1), op: z.enum(["constant", "add", "multiply", "rectangle_points", "translate_points", "scale_points"]), params: z.record(z.string(), z.unknown()) })), outputs: z.array(z.string()), units: z.string().min(1), tolerance: z.number().positive().max(1), humanReviewRequired: z.literal(true) }) })).mutation(async ({ ctx, input }) => {
      await ownedProject(ctx.user.id, input.projectId);
      return executeParametricGraph(input.graph as ParametricGraph);
    }),
    exportPackage: protectedProcedure.input(z.object({ projectId: z.string().min(3), name: z.string().min(1).max(120), geometry: z.object({ kind: z.enum(["RECTANGULAR_MASS", "COURTYARD_MASS", "POINTS"]), width: z.number().positive(), depth: z.number().positive(), height: z.number().positive(), floors: z.number().int().positive().max(100), courtyardRatio: z.number().min(0).max(0.9).optional(), points: z.array(z.tuple([z.number(), z.number(), z.number()])).optional() }), graph: z.object({ contractVersion: z.literal("ARKI-PARAMETRIC-1.0"), graphId: z.string().min(1), nodes: z.array(z.object({ id: z.string().min(1), op: z.enum(["constant", "add", "multiply", "rectangle_points", "translate_points", "scale_points"]), params: z.record(z.string(), z.unknown()) })), outputs: z.array(z.string()), units: z.string().min(1), tolerance: z.number().positive().max(1), humanReviewRequired: z.literal(true) }) })).mutation(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); return exchangePackage({ ...input, geometry: input.geometry as ArkGeometry, graph: input.graph as ParametricGraph }); }),
    assimilateArk: protectedProcedure.input(z.object({ projectId: z.string().min(3), content: z.string().max(5_000_000) })).mutation(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); const proposal = parseArkProposal(input.content); if (!("formatVersion" in proposal)) return proposal; return architecturalAssimilation(proposal); }),
    hostWorkers: router({
      catalog: publicProcedure.query(() => hostWorkerCatalog()),
      dispatch: protectedProcedure.input(z.object({ projectId: z.string().min(3), artifactId: z.string().min(1), kind: z.enum(["DYNAMO_REVIT", "RHINO_GRASSHOPPER", "BLENDER"]), command: z.enum(["VALIDATE", "EXECUTE", "EXPORT"]), payload: z.record(z.string(), z.unknown()), humanReviewApproved: z.literal(true) })).mutation(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); return executeAuthorizedHostWorker(input); }),
    }),
    sessions: router({
      list: protectedProcedure.input(z.object({ projectId: z.string().min(3) })).query(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); return listArkiCommandSessions(ctx.user.id, input.projectId); }),
      save: protectedProcedure.input(z.object({ projectId: z.string().min(3), sessionId: z.string().min(8).max(128), commandName: z.string().min(1).max(180), parameters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])), previewResult: z.record(z.string(), z.unknown()), tutorialStep: z.number().int().min(0).max(100), exerciseScore: z.number().int().min(0).max(100).nullable(), exerciseState: z.enum(["IN_PROGRESS", "PASSED", "REVIEW_REQUIRED"]), lastAction: z.enum(["AUTOSAVE", "EXERCISE_SUBMIT", "MANUAL_SAVE", "COMMAND_CHANGE"]) })).mutation(async ({ ctx, input }) => { await ownedProject(ctx.user.id, input.projectId); return saveArkiCommandSession({ ownerId: ctx.user.id, projectId: input.projectId, sessionId: input.sessionId, commandName: input.commandName, parameters: JSON.stringify(input.parameters), previewResult: JSON.stringify(input.previewResult), tutorialStep: input.tutorialStep, exerciseScore: input.exerciseScore, exerciseState: input.exerciseState, lastAction: input.lastAction }); }),
    }),
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
      authorizeCoreOperation({ operation: "PROJECT_CREATE", sourceLayer: "BRAIN", authority: "SYSTEM" });
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
    saveInitialIntake: protectedProcedure.input(initialIntakeInput).mutation(async ({ ctx, input }) => {
      if (hasCoreUrl()) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Initial intake requires the canonical SICL intake endpoint; local persistence is not guessed when SICL Core is configured" });
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving intake" });
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      const initialIntake = { intent: input.intent, location: input.location || "UNKNOWN", site: input.site || "UNKNOWN", dimensions: input.dimensions || "UNKNOWN", occupants: input.occupants || "UNKNOWN", budget: input.budget || "UNKNOWN", provenance: "USER_PROVIDED" as const, epistemicStatus: "UNVERIFIED" as const, capturedAt: new Date().toISOString() };
      const next = { ...snapshot, initialIntake, events: [...snapshot.events, event(ctx.user.id, "INITIAL_INTAKE_PERSISTED", input.projectId, { observedVersion: input.expectedVersion, provenance: initialIntake.provenance, epistemicStatus: initialIntake.epistemicStatus })] };
      return { ...(await saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "ACTIVE", "INITIAL_INTAKE_COMMIT")), initialIntake, persistence: "PROJECT_STATE" as const };
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
      const saved = await saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "ACTIVE", "REASONING_APPEND");
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
      requireOwnerHumanAuthority(ctx);
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving" });
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      const recommendation = snapshot.recommendations.find((item) => item.id === input.recommendationId);
      if (!recommendation || Number(recommendation.recommendationVersion) !== input.recommendationVersion) fail("HumanReview recommendation version mismatch");
      const review = { id: input.reviewId, recommendationId: input.recommendationId, actorId: input.actorId, confirmationId: input.confirmationId, reason: input.reason, status: input.status, observedVersion: input.expectedVersion, recommendationVersion: input.recommendationVersion };
      const next = siclCorePort.appendHumanReview(snapshot, review, event(ctx.user.id, "HUMAN_REVIEW_RECORDED", review.id, { observedVersion: input.expectedVersion, recommendationVersion: input.recommendationVersion }));
      return saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "ACTIVE", "HUMAN_REVIEW_APPEND", true);
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
      requireOwnerHumanAuthority(ctx);
      const project = await ownedProject(ctx.user.id, input.projectId);
      if (project.version !== input.expectedVersion) throw new TRPCError({ code: "CONFLICT", message: "Project changed; reload before saving" });
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      if (!snapshot.alternatives.some((item) => item.id === input.selectedAlternativeId)) fail("Decision selectedAlternativeId does not exist");
      const decision = { id: input.decisionId, selectedAlternativeId: input.selectedAlternativeId, actorId: input.actorId, authorityBasis: input.authorityBasis, confirmationId: input.confirmationId, rationale: input.rationale, observedVersion: input.expectedVersion, decisionType: "HUMAN" };
      const next = siclCorePort.appendHumanDecision(snapshot, decision, event(ctx.user.id, "HUMAN_DECISION_RECORDED", decision.id, { observedVersion: input.expectedVersion, actorId: input.actorId, authorityBasis: input.authorityBasis }));
      return saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "DECIDED", "HUMAN_DECISION_APPEND", true);
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
