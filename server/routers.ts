import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { insertSiclProject, getSiclProject, listSiclProjects, updateSiclProject } from "./db";
import { type RecordKind, type SiclRecord, type SiclSnapshot } from "./siclCore";
import { siclCorePort } from "./siclCorePort";
import { comparisonCollectionForRecommendation, nextRecommendationVersion } from "./recommendationVersion";
import { createCoreProject, createCoreRecommendation, fetchCanonicalCouncil, fetchCanonicalSnapshot, fetchOperationsResearchMethods, hasCoreUrl, recordCoreDecision, recordCoreHumanReview } from "./coreHttpClient";

const recordKinds = ["sources", "evidence", "requirements", "objectives", "constraints", "alternatives"] as const;
const projectInput = z.object({ name: z.string().trim().min(3), location: z.string().trim().optional(), projectId: z.string().trim().min(3).optional(), spatialScale: z.enum(["PROJECT", "SECTOR", "DISTRICT", "CITY", "METROPOLITAN_AREA", "REGION", "MACROREGION", "COUNTRY"]).default("PROJECT"), temporalHorizon: z.enum(["PRESENT", "2030", "2040", "2050"]).default("PRESENT") });
const versionInput = z.object({ projectId: z.string().min(1), expectedVersion: z.number().int().positive() });

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
    create: protectedProcedure.input(projectInput).mutation(async ({ ctx, input }) => {
      requireCanonicalCoreOrExplicitLocal();
      const projectId = input.projectId ?? `SICL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
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
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      const record = input.record as SiclRecord;
      const next = siclCorePort.appendRecord(snapshot, input.kind as RecordKind, record, event(ctx.user.id, "SICL_RECORD_ADDED", record.id, { kind: input.kind, observedVersion: input.expectedVersion }));
      return saveNext(ctx.user.id, input.projectId, input.expectedVersion, next, "ACTIVE");
    }),
    council: protectedProcedure.input(z.object({ projectId: z.string().min(1) })).query(async ({ ctx, input }) => {
      const project = await ownedProject(ctx.user.id, input.projectId);
      const council = await fetchCanonicalCouncil(project.projectId);
      if (council && "not_found" in council) throw new TRPCError({ code: "NOT_FOUND", message: council.detail ?? "SICL project not found" });
      if (council) return council;
      const canonical = await fetchCanonicalSnapshot(project.projectId);
      if (canonical && "not_found" in canonical) throw new TRPCError({ code: "NOT_FOUND", message: canonical.detail ?? "SICL project not found" });
      const snapshot = canonical && "snapshot" in canonical ? siclCorePort.parseSnapshot(JSON.stringify(canonical.snapshot)) : siclCorePort.parseSnapshot(project.snapshot);
      const version = canonical && "observed_version" in canonical ? canonical.observed_version : project.version;
      return { projectId: project.projectId, version, ...siclCorePort.analysisView(snapshot) };
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
      const snapshot = siclCorePort.parseSnapshot(project.snapshot);
      return { projectId: project.projectId, version: project.version, events: snapshot.events, humanReviews: snapshot.humanReviews, decisions: snapshot.decisions };
    }),
  }),
});

export type AppRouter = typeof appRouter;
