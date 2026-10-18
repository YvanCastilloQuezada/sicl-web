import { COOKIE_NAME } from "../shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./_core/trpc";
import {
  GAME_TYPES,
  activateBingoRecalibration,
  activateMjpExtra39,
  activateRecalibratedGameRules,
  activateUniformCreditRules,
  bootstrapPilotRules,
  claimDailyReward,
  claimMissionReward,
  closeAndDrawRound,
  closeCuratedMarket,
  confirmMarketPositionBatchPreview,
  confirmPilotTicketBatchPreview,
  createCuratedMarket,
  createDisabledYapeReference,
  enrollAssistedPlan,
  getMarketBatchReceipt,
  getMarketSummary,
  getMissionSummary,
  getMyAssistedPlans,
  getMyMarketBatches,
  getMyTicketBatches,
  getOperationsOverview,
  getPublicMarkets,
  getPublicRounds,
  getPublicRtpDashboard,
  getRoundProof,
  getSocialImpactSummary,
  getTicketBatchReceipt,
  getWalletSummary,
  listAssistedPlanDefinitions,
  previewMarketPositionBatch,
  previewPilotTicketBatch,
  publishRulesetRevision,
  registerVerificationMission,
  reserveMarketPosition,
  reservePilotTicket,
  reservePilotTicketBatch,
  resolveCuratedMarket,
  updateAssistedPlanStatus,
  updatePromotionStatus,
  updateResponsibleSettings,
  voidCuratedMarket,
} from "./pilot";
import { getKycAmlReadiness } from "../shared/kycAmlReadiness";
import {
  SCHEDULED_GAME_DEFINITIONS,
  enableScheduledGame,
  getScheduledGameOverview,
} from "./pilot";
import { parse as parseCookie } from "cookie";
import { createHeartbeatJob } from "./_core/heartbeat";
import {
  calculateFinancialProjection,
  DEFAULT_FINANCIAL_MODEL,
  type FinancialModelInput,
} from "../shared/financialModel";
import {
  createRoundQr,
  getBroadcastRound,
  getBroadcastRounds,
  getBroadcastSignalMetrics,
  recordBroadcastSignal,
  validateRoundQrPayload,
  BROADCAST_ID,
} from "./broadcast";
import { GAME_REGISTRY } from "../shared/gameRegistry";
import { appendOperationalEvent, listOperationalEvents } from "./eventStore";
import { auditRound, listRecentAudits } from "./auditorAgent";
import { calculateRetention, recordProductEvent } from "./productAnalytics";
import {
  getControlState,
  runSafeAutopilotHeartbeat,
  runWatchdog,
  setControlMode,
} from "./autonomy";
import {
  buildLive24Report,
  getLiveHeartbeatHealth,
  getPublicAgentHealth,
  runLiveHeartbeat,
  runLiveWatchdog,
} from "./live24Runtime";
import { getYoutubeLiveStatus } from "./youtubeLive";
import { proposeSchedule } from "./schedulerEngine";
import {
  generateLukitaScriptVariations,
  listLukitaScripts,
  listLukitaScriptHistory,
  resetLukitaScript,
  saveLukitaScript,
} from "./lukitaScripts";
import { LUKITA_SCRIPT_TRIGGERS } from "../shared/lukitaScripts";
import {
  generateUnifiedReportPdf,
  getAuditReportDownload,
  getUnifiedReportPreview,
  listAuditReportArtifacts,
} from "./auditReports";
import {
  exportAutonomySimulation,
  getAutonomySimulationPreview,
} from "./autonomyReport";
import { realtimeRouter } from "./realtime/router";
import { bossFightRouter } from "./routers/bossFight";
import { rewardsRouter } from "./routers/rewards";
import { onlineTvGamesRouter } from "./routers/onlineTvGames";
import { runAgentRuntimeAutonomyTest } from "../shared/agentRuntimeAutonomy";
import {
  buildDefaultLiveSchedule,
  projectLiveManifest,
  simulateLiveDay,
} from "../shared/liveChannel";
import {
  activateQrTimerPalette,
  getActiveQrTimerPalette,
  listQrTimerPalettes,
  saveQrTimerPalette,
} from "./qrTimerPalettes";
import {
  createLrciReviewCase,
  exportLrciCaseHistoryPdf,
  exportLrciReviewCasesPdf,
  listLrciCaseHistory,
  listLrciExpiryNotifications,
  listLrciReviewCases,
  markLrciNotificationRead,
  updateLrciReviewCase,
  LRCI_CASE_STATUSES,
} from "./lrciReviewCases";
import {
  createMilukitaEventContext,
  createMilukitaParticipationSession,
  ensureMilukitaIdentity,
  evaluateMilukitaParticipation,
  exportMilukitaSessions,
  getMilukitaEventContext,
  getMilukitaIdentityOverview,
  getNotificationPreferences,
  recordFunnelEvent,
  registerMilukitaDevice,
  revokeMilukitaDevice,
  revokeMilukitaSession,
  transitionMilukitaParticipation,
  updateNotificationPreferences,
  uploadMilukitaAvatar,
} from "./identityParticipation";
import {
  exportConstitutionalDecisionPdf,
  recordConstitutionalContractDecision,
} from "./constitutionalContract";
import {
  assignControllerRole,
  closeControllerSession,
  connectControllerSession,
  connectControllerSessionWithManualCode,
  createControllerSession,
  getControllerRole,
  getControllerScreenSnapshot,
  importSharedControllerProfile,
  sendControllerCommand,
  shareControllerProfile,
} from "./controllerLab";
import {
  CONTROLLER_COMMANDS,
  CONTROLLER_MODES,
  CONTROLLER_ROLES,
} from "../shared/controllerLab";
import {
  addTerritorialClaim,
  addTerritorialEvidence,
  addTerritorialSource,
  createTerritorialObject,
  getTerritorialObject,
  listPublishedTerritorialObjects,
  listTerritorialObjects,
  publishTerritorialObject,
  reviewTerritorialObject,
  assignTerritorialRole,
  getTerritorialRole,
  listTerritorialRoles,
  uploadTerritorialAsset,
  exportTerritorialData,
  importTerritorialData,
  createTerritorialCaptureSession,
  listTerritorialCaptureSessions,
  getTerritorialCaptureSession,
  updateTerritorialObject,
  createTerritorialSnapshot,
  listTerritorialSnapshots,
  getTerritorialSnapshot,
  restoreTerritorialSnapshot,
  listTerritorialOfflineCaptures,
  queueOfflineCapture,
  syncOfflineCapture,
  resolveOfflineConflict,
} from "./territorialTrust";
import { CONFLICT_RESOLUTIONS, MAPPER_ROLES, REVIEW_DECISIONS, WORLD_OBJECT_STATUSES } from "../shared/territorialTrust";
import { syncFieldGateReport, listFieldGateReports, exportFieldGateReports, exportPilotMetricsPdf, exportPilotMetricsCsv, exportTerritorialManual } from "./fieldGateReports";
import { createShareSession, createShareTarget, listOwnedShareTargets, resolveShareTarget, revokeShareTarget } from "./lukaShare";
import { SHARE_CAPABILITIES, SHARE_TARGET_TYPES } from "../shared/lukaShare";

const controllerProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(30),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    layout: z.enum(["compact", "spacious"]),
    vibration: z.boolean(),
    sound: z.boolean(),
    mode: z.enum(["remote", "gamepad", "trackpad", "keyboard"]),
    chrome: z.object({
      modePosition: z.string().max(24),
      lockPosition: z.string().max(24),
      returnPosition: z.string().max(24),
      connectionPosition: z.string().max(24),
      modeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      lockColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      returnColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      connectionColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    }),
    orientation: z.enum(["horizontal", "vertical", "auto"]),
    trackpadPercent: z.number().int().min(20).max(45),
    icon: z.enum(["sparkles", "gamepad", "pointer", "keyboard"]),
  })
  .strict();

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  territorial: router({
    list: adminProcedure.input(z.object({ status: z.enum(WORLD_OBJECT_STATUSES).optional() }).optional()).query(({ input }) => listTerritorialObjects(input?.status)),
    detail: adminProcedure.input(z.object({ publicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/) })).query(({ input }) => getTerritorialObject(input.publicId)),
    captureSessions: adminProcedure.query(({ ctx }) => listTerritorialCaptureSessions(ctx.user.id)),
    captureSessionDetail: adminProcedure.input(z.object({ publicId: z.string().regex(/^TSES-[A-F0-9]{24}$/) })).query(({ ctx, input }) => { void ctx; return getTerritorialCaptureSession(input.publicId); }),
    createCaptureSession: adminProcedure.input(z.object({ name: z.string().trim().min(2).max(180), territory: z.string().trim().min(2).max(180), area: z.record(z.string(), z.unknown()).optional() })).mutation(({ ctx, input }) => createTerritorialCaptureSession({ ...input, actorUserId: ctx.user.id })),
    updateObject: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/), objectType: z.string().trim().min(2).max(48), name: z.string().trim().min(2).max(180), description: z.string().trim().min(2).max(10_000), latitude: z.string().regex(/^-?\\d{1,3}(?:\\.\\d{1,8})?$/), longitude: z.string().regex(/^-?\\d{1,3}(?:\\.\\d{1,8})?$/), accuracyMeters: z.number().int().min(0).max(100_000) })).mutation(({ ctx, input }) => updateTerritorialObject({ ...input, actorUserId: ctx.user.id })),
    snapshots: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/) })).query(({ input }) => listTerritorialSnapshots(input.objectPublicId)),
    snapshotDetail: adminProcedure.input(z.object({ snapshotPublicId: z.string().regex(/^SNAP-[A-F0-9]{24}$/) })).query(({ input }) => getTerritorialSnapshot(input.snapshotPublicId)),
    createSnapshot: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/) })).mutation(({ ctx, input }) => createTerritorialSnapshot(input.objectPublicId, ctx.user.id)),
    restoreSnapshot: adminProcedure.input(z.object({ snapshotPublicId: z.string().regex(/^SNAP-[A-F0-9]{24}$/) })).mutation(({ ctx, input }) => restoreTerritorialSnapshot(input.snapshotPublicId, ctx.user.id)),
    create: adminProcedure.input(z.object({ objectType: z.string().trim().min(2).max(48), name: z.string().trim().min(2).max(180), description: z.string().trim().min(2).max(10_000), latitude: z.string().regex(/^-?\\d{1,3}(?:\\.\\d{1,8})?$/), longitude: z.string().regex(/^-?\\d{1,3}(?:\\.\\d{1,8})?$/), accuracyMeters: z.number().int().min(0).max(100_000), geometry: z.record(z.string(), z.unknown()), attributes: z.record(z.string(), z.unknown()).optional(), relations: z.record(z.string(), z.unknown()).optional(), assets: z.array(z.record(z.string(), z.unknown())).max(100).optional(), captureSessionPublicId: z.string().regex(/^TSES-[A-F0-9]{24}$/).optional() })).mutation(({ ctx, input }) => createTerritorialObject({ ...input, actorUserId: ctx.user.id })),
    addClaim: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/), text: z.string().trim().min(2).max(10_000), claimType: z.string().trim().min(2).max(48), observations: z.string().trim().max(10_000).default("") })).mutation(({ ctx, input }) => addTerritorialClaim({ ...input, actorUserId: ctx.user.id })),
    addSource: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/), institutionOrPerson: z.string().trim().min(2).max(180), sourceType: z.string().trim().min(2).max(48), referenceUrl: z.string().url().max(768).optional(), sourceDate: z.coerce.date().optional(), author: z.string().trim().max(180).optional(), documentRef: z.string().trim().max(512).optional(), authorityLevel: z.number().int().min(0).max(100), observations: z.string().trim().max(10_000).default("") })).mutation(({ ctx, input }) => addTerritorialSource({ ...input, actorUserId: ctx.user.id })),
    addEvidence: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/), claimPublicId: z.string().regex(/^CLM-[A-F0-9]{24}$/).optional(), evidenceType: z.string().trim().min(2).max(48), origin: z.string().trim().min(2).max(512), capturedAt: z.coerce.date(), integrityHash: z.string().trim().min(32).max(128), metadata: z.record(z.string(), z.unknown()).optional() })).mutation(({ ctx, input }) => addTerritorialEvidence({ ...input, actorUserId: ctx.user.id })),
    review: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/), decision: z.enum(REVIEW_DECISIONS), reason: z.string().trim().min(2).max(10_000), evidenceReviewed: z.array(z.string().min(2).max(48)).max(100) })).mutation(({ ctx, input }) => reviewTerritorialObject({ ...input, actorUserId: ctx.user.id })),
    publish: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/) })).mutation(({ ctx, input }) => publishTerritorialObject(input.objectPublicId, ctx.user.id)),
    runtimePublished: publicProcedure.query(() => listPublishedTerritorialObjects()),
    myRole: adminProcedure.query(({ ctx }) => getTerritorialRole(ctx.user.id)),
    roles: adminProcedure.query(() => listTerritorialRoles()),
    assignRole: adminProcedure.input(z.object({ userId: z.number().int().positive(), role: z.enum(MAPPER_ROLES) })).mutation(({ ctx, input }) => assignTerritorialRole({ ...input, assignedByUserId: ctx.user.id })),
    uploadAsset: adminProcedure.input(z.object({ objectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/), assetType: z.string().trim().min(2).max(32), originalName: z.string().trim().min(1).max(255), mimeType: z.string().max(128), base64Data: z.string().min(1).max(28_000_000), accessScope: z.enum(["ADMIN_ONLY", "REVIEW_ONLY", "PUBLISHED_RUNTIME"]), evidencePublicId: z.string().regex(/^EVD-[A-F0-9]{24}$/).optional(), sourcePublicId: z.string().regex(/^SRC-[A-F0-9]{24}$/).optional() })).mutation(({ ctx, input }) => uploadTerritorialAsset({ ...input, actorUserId: ctx.user.id })),
    exportData: adminProcedure.input(z.object({ format: z.enum(["csv", "geojson"]), status: z.enum(WORLD_OBJECT_STATUSES).optional() })).mutation(({ input }) => exportTerritorialData(input.format, input.status)),
    importData: adminProcedure.input(z.object({ format: z.enum(["csv", "geojson"]), content: z.string().min(2).max(5_000_000), captureSessionPublicId: z.string().regex(/^TSES-[A-F0-9]{24}$/).optional() })).mutation(({ ctx, input }) => importTerritorialData({ ...input, actorUserId: ctx.user.id })),
    offlineCaptures: adminProcedure.query(({ ctx }) => listTerritorialOfflineCaptures(ctx.user.id)),
    queueOfflineCapture: adminProcedure.input(z.object({ payload: z.object({ clientCaptureId: z.string().min(8).max(96), deviceFingerprint: z.string().min(8).max(128), captureSessionPublicId: z.string().regex(/^TSES-[A-F0-9]{24}$/).optional(), targetObjectPublicId: z.string().regex(/^WOBJ-[A-F0-9]{24}$/).optional(), baseVersion: z.number().int().positive().optional(), worldObject: z.object({ objectType: z.string().min(2).max(48), name: z.string().min(2).max(180), description: z.string().min(2).max(10_000), latitude: z.string(), longitude: z.string(), accuracyMeters: z.number().min(0), geometry: z.record(z.string(), z.unknown()), attributes: z.record(z.string(), z.unknown()).optional(), relations: z.record(z.string(), z.unknown()).optional(), assets: z.array(z.record(z.string(), z.unknown())).optional() }), evidence: z.array(z.record(z.string(), z.unknown())).optional(), notes: z.string().max(10_000).optional(), capturedAt: z.string() }) })).mutation(({ ctx, input }) => queueOfflineCapture({ payload: input.payload, actorUserId: ctx.user.id })),
    syncOfflineCapture: adminProcedure.input(z.object({ publicId: z.string().regex(/^OCAP-[A-F0-9]{24}$/) })).mutation(({ ctx, input }) => syncOfflineCapture({ publicId: input.publicId, actorUserId: ctx.user.id })),
    resolveOfflineConflict: adminProcedure.input(z.object({ publicId: z.string().regex(/^OCAP-[A-F0-9]{24}$/), resolution: z.enum(CONFLICT_RESOLUTIONS), merged: z.object({ objectType: z.string().min(2).max(48).optional(), name: z.string().min(2).max(180).optional(), description: z.string().min(2).max(10_000).optional(), latitude: z.string().optional(), longitude: z.string().optional(), accuracyMeters: z.number().min(0).optional(), geometry: z.record(z.string(), z.unknown()).optional(), attributes: z.record(z.string(), z.unknown()).optional(), relations: z.record(z.string(), z.unknown()).optional(), assets: z.array(z.record(z.string(), z.unknown())).optional() }).optional() })).mutation(({ ctx, input }) => resolveOfflineConflict({ ...input, actorUserId: ctx.user.id })),
    fieldGateReports: adminProcedure.query(({ ctx }) => listFieldGateReports(ctx.user.id)),
    syncFieldGateReport: adminProcedure.input(z.object({ report: z.object({ publicId: z.string().optional(), protocol: z.string().min(2).max(160), deviceA: z.string().max(255), deviceB: z.string().max(255), severity: z.enum(["PASS", "BLOCKER", "CRITICAL", "MAJOR", "MINOR", "OBSERVATION"]), observations: z.string().max(10000), completedSteps: z.array(z.number().int().min(0).max(20)), stepResults: z.record(z.string(), z.string()) }) })).mutation(({ ctx, input }) => syncFieldGateReport({ actorUserId: ctx.user.id, report: input.report })),
    exportFieldGateReports: adminProcedure.input(z.object({ format: z.enum(["csv", "pdf"]) })).mutation(({ ctx, input }) => exportFieldGateReports(ctx.user.id, input.format)),
    exportPilotMetricsPdf: adminProcedure.input(z.object({ from: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(), to: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(), device: z.string().trim().max(255).optional() })).mutation(({ ctx, input }) => exportPilotMetricsPdf(ctx.user.id, input)),
    exportPilotMetricsCsv: adminProcedure.input(z.object({ from: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(), to: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional(), device: z.string().trim().max(255).optional() })).mutation(({ ctx, input }) => exportPilotMetricsCsv(ctx.user.id, input)),
    exportManual: adminProcedure.input(z.object({ manual: z.enum(["MAPPER", "THE_EYE"]) })).mutation(({ ctx, input }) => exportTerritorialManual(ctx.user.id, input.manual)),
  }),
  share: router({
    resolve: publicProcedure
      .input(z.object({ publicId: z.string().regex(/^(SHARE|SSN)-[A-F0-9]{20}$/), token: z.string().min(16).max(128).optional() }))
      .query(({ input }) => resolveShareTarget(input)),
    listMine: protectedProcedure.query(({ ctx }) => listOwnedShareTargets(ctx.user.id)),
    createTarget: protectedProcedure
      .input(z.object({
        targetType: z.enum(SHARE_TARGET_TYPES),
        destinationPath: z.string().min(2).max(512),
        metadata: z.record(z.string(), z.unknown()).optional(),
        capability: z.enum(SHARE_CAPABILITIES),
        priority: z.number().int().min(0).max(1000).optional(),
        expiresAt: z.coerce.date().nullable().optional(),
      }))
      .mutation(({ ctx, input }) => createShareTarget({ ownerUserId: ctx.user.id, definition: input })),
    createSession: protectedProcedure
      .input(z.object({ sharePublicId: z.string().regex(/^SHARE-[A-F0-9]{20}$/), expiresInSeconds: z.number().int().min(1).max(86_400), origin: z.string().url().max(512) }))
      .mutation(({ ctx, input }) => createShareSession({ ownerUserId: ctx.user.id, ...input })),
    revokeTarget: protectedProcedure
      .input(z.object({ publicId: z.string().regex(/^SHARE-[A-F0-9]{20}$/) }))
      .mutation(({ ctx, input }) => revokeShareTarget({ ownerUserId: ctx.user.id, ...input })),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  identity: router({
    overview: protectedProcedure.query(({ ctx }) =>
      getMilukitaIdentityOverview(ctx.user.id)
    ),
    ensure: protectedProcedure.mutation(({ ctx }) =>
      ensureMilukitaIdentity(ctx.user.id)
    ),
    registerDevice: protectedProcedure
      .input(z.object({ deviceHash: z.string().min(8).max(256) }))
      .mutation(({ ctx, input }) =>
        registerMilukitaDevice(ctx.user.id, input.deviceHash)
      ),
    revokeDevice: protectedProcedure
      .input(z.object({ devicePublicId: z.string().min(8).max(40) }))
      .mutation(({ ctx, input }) =>
        revokeMilukitaDevice(ctx.user.id, input.devicePublicId)
      ),
    revokeSession: protectedProcedure
      .input(z.object({ sessionPublicId: z.string().min(8).max(40) }))
      .mutation(({ ctx, input }) =>
        revokeMilukitaSession(ctx.user.id, input.sessionPublicId)
      ),
    notificationPreferences: protectedProcedure.query(({ ctx }) =>
      getNotificationPreferences(ctx.user.id)
    ),
    updateNotificationPreferences: protectedProcedure
      .input(
        z.object({
          inAppEnabled: z.boolean(),
          qrUpdatesEnabled: z.boolean(),
          securityAlertsEnabled: z.boolean(),
          sessionAlertsEnabled: z.boolean(),
          criticalExpiryEnabled: z.boolean(),
        })
      )
      .mutation(({ ctx, input }) =>
        updateNotificationPreferences(ctx.user.id, input)
      ),
    uploadAvatar: protectedProcedure
      .input(
        z.object({
          dataUrl: z.string().max(3_000_000),
          mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
        })
      )
      .mutation(({ ctx, input }) => uploadMilukitaAvatar(ctx.user.id, input)),
    exportSessions: adminProcedure
      .input(z.object({ format: z.enum(["csv", "pdf"]) }))
      .mutation(({ input }) => exportMilukitaSessions(input.format)),
    createParticipation: protectedProcedure
      .input(
        z.object({
          eventId: z.string().min(1).max(96),
          deviceHash: z.string().min(8).max(256).optional(),
          source: z.enum(["qr", "tv", "web", "pwa"]).default("qr"),
        })
      )
      .mutation(({ ctx, input }) =>
        createMilukitaParticipationSession({ userId: ctx.user.id, ...input })
      ),
    eligibility: protectedProcedure
      .input(
        z.object({
          eventIsOpen: z.boolean(),
          freeParticipationAllowed: z.boolean().default(true),
        })
      )
      .query(({ ctx, input }) =>
        evaluateMilukitaParticipation(
          ctx.user.id,
          input.eventIsOpen,
          input.freeParticipationAllowed
        )
      ),
    transitionParticipation: protectedProcedure
      .input(
        z.object({
          participationPublicId: z.string().min(8).max(64),
          nextStatus: z.enum([
            "IDENTIFIED",
            "ELIGIBLE",
            "STARTED",
            "SUBMITTED",
            "COMPLETED",
            "EXPIRED",
            "REJECTED",
            "CANCELLED",
          ]),
        })
      )
      .mutation(({ ctx, input }) =>
        transitionMilukitaParticipation(
          ctx.user.id,
          input.participationPublicId,
          input.nextStatus
        )
      ),
    eventContext: publicProcedure
      .input(z.object({ publicId: z.string().min(8).max(64) }))
      .query(({ input }) => getMilukitaEventContext(input.publicId)),
    createEventContext: adminProcedure
      .input(
        z.object({
          eventId: z.string().min(1).max(96),
          expiresAt: z.coerce.date(),
          showId: z.string().max(96).optional(),
          segmentId: z.string().max(96).optional(),
          campaignId: z.string().max(96).optional(),
          distributionContext: z.string().max(96).optional(),
        })
      )
      .mutation(({ input }) => createMilukitaEventContext(input)),
    funnelEvent: publicProcedure
      .input(
        z.object({
          eventType: z.enum([
            "qr_scanned",
            "landing_viewed",
            "participation_clicked",
            "identity_started",
            "otp_requested",
            "otp_verified",
            "session_created",
            "eligibility_checked",
            "participation_started",
            "participation_submitted",
            "participation_completed",
            "participation_rejected",
            "session_expired",
            "return_visit",
            "premium_viewed",
            "premium_selected",
          ]),
          anonymousSessionId: z.string().max(96).optional(),
          sessionId: z.string().max(96).optional(),
          userId: z.number().int().positive().optional(),
          source: z
            .enum(["web", "pwa", "tv", "simulator", "secondary_screen"])
            .default("web"),
          payload: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .mutation(({ input }) => recordFunnelEvent(input)),
  }),
  controller: router({
    myRole: protectedProcedure.query(({ ctx }) =>
      getControllerRole(ctx.user.id, ctx.user.role)
    ),
    assignRole: adminProcedure
      .input(
        z.object({
          targetUserId: z.number().int().positive(),
          controllerRole: z.enum(CONTROLLER_ROLES),
        })
      )
      .mutation(({ ctx, input }) =>
        assignControllerRole({ ...input, assignedByUserId: ctx.user.id })
      ),
    createSession: protectedProcedure
      .input(
        z.object({
          origin: z.string().url(),
          expiresInSeconds: z.number().int().min(60).max(1800).default(600),
        })
      )
      .mutation(({ ctx, input }) =>
        createControllerSession({
          userId: ctx.user.id,
          baseRole: ctx.user.role,
          ...input,
        })
      ),
    connect: protectedProcedure
      .input(
        z.object({
          publicId: z.string().min(8).max(48),
          mobileToken: z.string().min(16).max(96),
        })
      )
      .mutation(({ ctx, input }) =>
        connectControllerSession({
          userId: ctx.user.id,
          baseRole: ctx.user.role,
          ...input,
        })
      ),
    connectWithManualCode: protectedProcedure
      .input(z.object({ manualCode: z.string().regex(/^\d{8}$/) }))
      .mutation(({ ctx, input }) =>
        connectControllerSessionWithManualCode({
          userId: ctx.user.id,
          baseRole: ctx.user.role,
          ...input,
        })
      ),
    sendCommand: protectedProcedure
      .input(
        z.object({
          publicId: z.string().min(8).max(48),
          mobileToken: z.string().min(16).max(96),
          requestId: z.string().min(8).max(96),
          mode: z.enum(CONTROLLER_MODES),
          commandType: z.enum(CONTROLLER_COMMANDS),
          payload: z.record(z.string(), z.string()).default({}),
        })
      )
      .mutation(({ ctx, input }) =>
        sendControllerCommand({
          userId: ctx.user.id,
          baseRole: ctx.user.role,
          ...input,
        })
      ),
    screenSnapshot: publicProcedure
      .input(
        z.object({
          publicId: z.string().min(8).max(48),
          screenToken: z.string().min(16).max(96),
          afterCommandId: z.number().int().min(0).optional(),
        })
      )
      .query(({ input }) => getControllerScreenSnapshot(input)),
    closeSession: protectedProcedure
      .input(z.object({ publicId: z.string().min(8).max(48) }))
      .mutation(({ ctx, input }) =>
        closeControllerSession({
          userId: ctx.user.id,
          baseRole: ctx.user.role,
          ...input,
        })
      ),
    shareProfile: protectedProcedure
      .input(z.object({ profile: controllerProfileSchema }))
      .mutation(({ ctx, input }) =>
        shareControllerProfile({ userId: ctx.user.id, profile: input.profile })
      ),
    importProfile: protectedProcedure
      .input(z.object({ shareCode: z.string().regex(/^ML[0-9A-F]{8}$/) }))
      .mutation(({ ctx, input }) =>
        importSharedControllerProfile({
          userId: ctx.user.id,
          shareCode: input.shareCode,
        })
      ),
  }),
  games: router({
    rounds: publicProcedure.query(() => getPublicRounds()),
    verify: publicProcedure
      .input(z.object({ publicId: z.string().min(4).max(40) }))
      .query(({ input }) => getRoundProof(input.publicId)),
    reserveTicket: protectedProcedure
      .input(
        z.object({
          roundPublicId: z.string().min(4).max(40),
          picks: z.array(z.number().int()).min(1).max(24),
          quantity: z.number().int().min(1).max(10),
          idempotencyKey: z.string().min(8).max(96),
          planPublicId: z.string().min(4).max(40).optional(),
          extraPick: z.number().int().min(1).max(39).optional(),
          bonusBallCount: z.number().int().min(0).max(3).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        reservePilotTicket({ userId: ctx.user.id, ...input })
      ),
    reserveTicketBatch: protectedProcedure
      .input(
        z.object({
          roundPublicId: z.string().min(4).max(40),
          manual: z
            .array(
              z.object({
                picks: z.array(z.number().int()).min(1).max(24),
                copies: z.number().int().min(1).max(10),
                extraPick: z.number().int().min(1).max(39).optional(),
                planPublicId: z.string().min(4).max(40).optional(),
              })
            )
            .max(10),
          randomCount: z.number().int().min(0).max(10),
          randomMjpExtra: z.boolean(),
          idempotencyKey: z.string().min(8).max(96),
        })
      )
      .mutation(({ ctx, input }) =>
        reservePilotTicketBatch({ userId: ctx.user.id, ...input })
      ),
    previewTicketBatch: protectedProcedure
      .input(
        z.object({
          roundPublicId: z.string().min(4).max(40),
          manual: z
            .array(
              z.object({
                picks: z.array(z.number().int()).min(1).max(24),
                copies: z.number().int().min(1).max(10),
                extraPick: z.number().int().min(1).max(39).optional(),
                bonusBallCount: z.number().int().min(0).max(3).optional(),
                planPublicId: z.string().min(4).max(40).optional(),
              })
            )
            .max(10),
          randomCount: z.number().int().min(0).max(10),
          randomMjpExtra: z.boolean(),
          randomBonusBallCount: z.number().int().min(0).max(3).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        previewPilotTicketBatch({ userId: ctx.user.id, ...input })
      ),
    confirmTicketBatchPreview: protectedProcedure
      .input(
        z.object({
          previewPublicId: z.string().min(4).max(40),
          idempotencyKey: z.string().min(8).max(96),
        })
      )
      .mutation(({ ctx, input }) =>
        confirmPilotTicketBatchPreview({ userId: ctx.user.id, ...input })
      ),
  }),
  batches: router({
    mine: protectedProcedure
      .input(z.object({ gameType: z.enum(GAME_TYPES).optional() }).optional())
      .query(({ ctx, input }) => getMyTicketBatches(ctx.user.id, input)),
    receipt: protectedProcedure
      .input(z.object({ batchPublicId: z.string().min(4).max(40) }))
      .query(({ ctx, input }) =>
        getTicketBatchReceipt(ctx.user.id, input.batchPublicId)
      ),
  }),
  plans: router({
    list: publicProcedure.query(() => listAssistedPlanDefinitions()),
    mine: protectedProcedure.query(({ ctx }) =>
      getMyAssistedPlans(ctx.user.id)
    ),
    enroll: protectedProcedure
      .input(
        z.object({
          planCode: z.enum([
            "semana_4",
            "mes_16",
            "trimestre_48",
            "semestre_96",
            "anual_192",
          ]),
          gameType: z.enum([
            "loteria_29",
            "loteria_39",
            "loteria_49",
            "loteria_59",
          ]),
          picks: z.array(z.number().int()).length(6),
        })
      )
      .mutation(({ ctx, input }) =>
        enrollAssistedPlan({ userId: ctx.user.id, ...input })
      ),
    updateStatus: protectedProcedure
      .input(
        z.object({
          publicId: z.string().min(4).max(40),
          action: z.enum(["pause", "resume", "cancel"]),
        })
      )
      .mutation(({ ctx, input }) =>
        updateAssistedPlanStatus({ userId: ctx.user.id, ...input })
      ),
  }),
  rtpDashboard: router({
    public: publicProcedure.query(() => getPublicRtpDashboard()),
  }),
  readiness: router({
    kycAml: publicProcedure.query(() => getKycAmlReadiness()),
  }),
  realtime: realtimeRouter,
  bossFight: bossFightRouter,
  rewards: rewardsRouter,
  onlineTvGames: onlineTvGamesRouter,
  broadcast: router({
    id: publicProcedure.query(() => ({
      broadcastId: BROADCAST_ID,
      virtualOnly: true,
      creditsOnly: true,
    })),
    rounds: publicProcedure.query(() => getBroadcastRounds()),
    round: publicProcedure
      .input(z.object({ roundId: z.string().min(4).max(40) }))
      .query(({ input }) => getBroadcastRound(input.roundId)),
    manifest: publicProcedure
      .input(z.object({ roundId: z.string().min(4).max(40) }))
      .query(
        async ({ input }) =>
          (await getBroadcastRound(input.roundId))?.manifest ?? null
      ),
    livePreview: publicProcedure
      .input(
        z
          .object({
            minute: z.number().int().min(0).max(1439).optional(),
            players: z.number().int().min(0).max(100).optional(),
          })
          .optional()
      )
      .query(({ input }) => {
        const schedule = buildDefaultLiveSchedule();
        return {
          manifest: projectLiveManifest(
            schedule,
            input?.minute ??
              new Date().getUTCHours() * 60 + new Date().getUTCMinutes(),
            input?.players ?? 0
          ),
          schedule: schedule.slice(0, 12),
          pilotOnly: true,
        };
      }),
    liveHeartbeatHealth: publicProcedure.query(() => getLiveHeartbeatHealth()),
    agentHealth: publicProcedure.query(() => getPublicAgentHealth()),
    qr: publicProcedure
      .input(
        z.object({
          roundId: z.string().min(4).max(40),
          broadcastId: z.string().min(4).max(80).optional(),
        })
      )
      .query(({ input }) => createRoundQr(input.roundId, input.broadcastId)),
    validateQr: publicProcedure
      .input(
        z.object({
          payload: z.object({
            broadcastId: z.string(),
            roundId: z.string(),
            gameType: z.string(),
            gameName: z.string(),
            rulesetVersion: z.string(),
            openAt: z.string(),
            closeAt: z.string(),
            nonce: z.string(),
            url: z.string(),
            verifyUrl: z.string(),
            version: z.string(),
            signature: z.string(),
            eventId: z.string().optional(),
            experienceId: z.string().optional(),
            expiresAt: z.string().optional(),
            sessionToken: z.string().optional(),
          }),
        })
      )
      .query(({ input }) => ({ valid: validateRoundQrPayload(input.payload) })),
  }),
  wallet: router({
    summary: protectedProcedure.query(({ ctx }) =>
      getWalletSummary(ctx.user.id)
    ),
    claimDailyReward: protectedProcedure.mutation(({ ctx }) =>
      claimDailyReward(ctx.user.id)
    ),
    updateResponsibleSettings: protectedProcedure
      .input(
        z.object({
          sessionLimitMinutes: z.number().int().min(15).max(180),
          pauseHours: z.number().int().min(0).max(720),
          countryCode: z.enum(["PE", "CO", "CL", "EC", "BO", "AR", "UY", "PY"]),
        })
      )
      .mutation(({ ctx, input }) =>
        updateResponsibleSettings(ctx.user.id, input)
      ),
  }),
  missions: router({
    summary: protectedProcedure.query(({ ctx }) =>
      getMissionSummary(ctx.user.id)
    ),
    claim: protectedProcedure
      .input(z.object({ code: z.string().min(3).max(64) }))
      .mutation(({ ctx, input }) =>
        claimMissionReward(ctx.user.id, input.code)
      ),
    registerVerification: protectedProcedure.mutation(({ ctx }) =>
      registerVerificationMission(ctx.user.id)
    ),
  }),
  payments: router({
    createDisabledReference: protectedProcedure
      .input(
        z.object({
          virtualAmount: z.number().int().positive(),
          idempotencyKey: z.string().min(8).max(96),
        })
      )
      .mutation(({ ctx, input }) =>
        createDisabledYapeReference(
          ctx.user.id,
          input.virtualAmount,
          input.idempotencyKey
        )
      ),
  }),
  market: router({
    list: publicProcedure.query(() => getPublicMarkets()),
    summary: protectedProcedure.query(({ ctx }) =>
      getMarketSummary(ctx.user.id)
    ),
    reserve: protectedProcedure
      .input(
        z.object({
          marketPublicId: z.string().min(4).max(40),
          side: z.enum(["yes", "no"]),
          contracts: z.number().int().min(1).max(10),
          idempotencyKey: z.string().min(8).max(96),
        })
      )
      .mutation(({ ctx, input }) =>
        reserveMarketPosition({ userId: ctx.user.id, ...input })
      ),
    previewBatch: protectedProcedure
      .input(
        z.object({
          marketPublicId: z.string().min(4).max(40),
          manual: z
            .array(
              z.object({
                side: z.enum(["yes", "no"]),
                copies: z.number().int().min(1).max(10),
              })
            )
            .max(10),
          randomCount: z.number().int().min(0).max(10),
        })
      )
      .mutation(({ ctx, input }) =>
        previewMarketPositionBatch({ userId: ctx.user.id, ...input })
      ),
    confirmBatchPreview: protectedProcedure
      .input(
        z.object({
          previewPublicId: z.string().min(4).max(40),
          idempotencyKey: z.string().min(8).max(96),
        })
      )
      .mutation(({ ctx, input }) =>
        confirmMarketPositionBatchPreview({ userId: ctx.user.id, ...input })
      ),
    batchesMine: protectedProcedure.query(({ ctx }) =>
      getMyMarketBatches(ctx.user.id)
    ),
    batchReceipt: protectedProcedure
      .input(z.object({ batchPublicId: z.string().min(4).max(40) }))
      .query(({ ctx, input }) =>
        getMarketBatchReceipt(ctx.user.id, input.batchPublicId)
      ),
    socialImpact: publicProcedure.query(() => getSocialImpactSummary()),
  }),
  operations: router({
    overview: adminProcedure.query(() => getOperationsOverview()),
    scheduledGames: adminProcedure.query(() => getScheduledGameOverview()),
    bootstrapPilot: adminProcedure.mutation(({ ctx }) =>
      bootstrapPilotRules(ctx.user.id)
    ),
    activateBingoRecalibration: adminProcedure.mutation(({ ctx }) =>
      activateBingoRecalibration(ctx.user.id)
    ),
    activateRecalibratedGameRules: adminProcedure.mutation(({ ctx }) =>
      activateRecalibratedGameRules(ctx.user.id)
    ),
    activateMjpExtra39: adminProcedure.mutation(({ ctx }) =>
      activateMjpExtra39(ctx.user.id)
    ),
    activateUniformCreditRules: adminProcedure.mutation(({ ctx }) =>
      activateUniformCreditRules(ctx.user.id)
    ),
    activateScheduledGame: adminProcedure
      .input(
        z.object({
          gameType: z.enum([
            "sueldo_vida",
            "raspa_digital",
            "pick_3",
            "pick_4",
            "loto_diario",
            "loto_express",
          ]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const definition = SCHEDULED_GAME_DEFINITIONS[input.gameType];
        const schedules = await getScheduledGameOverview();
        const existing = schedules.find(
          schedule => schedule.gameType === input.gameType
        );
        if (existing?.scheduleCronTaskUid)
          return {
            gameType: input.gameType,
            taskUid: existing.scheduleCronTaskUid,
            cronExpression: existing.cronExpression,
            enabled: existing.isEnabled,
            recovered: true,
            pilotOnly: true,
          };
        const sessionToken =
          parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";
        const job = await createHeartbeatJob(
          {
            name: `pilot-round-${input.gameType}`,
            cron: definition.cronExpression,
            path: "/api/scheduled/game-rounds",
            payload: { gameType: input.gameType },
            description: `Cierre automático virtual de ${definition.label}`,
          },
          sessionToken
        );
        return {
          ...(await enableScheduledGame({
            actorUserId: ctx.user.id,
            gameType: input.gameType,
            taskUid: job.taskUid,
          })),
          recovered: false,
        };
      }),
    closeAndDraw: adminProcedure
      .input(z.object({ publicId: z.string().min(4).max(40) }))
      .mutation(({ ctx, input }) =>
        closeAndDrawRound(ctx.user.id, input.publicId)
      ),
    publishRulesetRevision: adminProcedure
      .input(z.object({ gameType: z.enum(GAME_TYPES) }))
      .mutation(({ ctx, input }) =>
        publishRulesetRevision(ctx.user.id, input.gameType)
      ),
    updatePromotionStatus: adminProcedure
      .input(
        z.object({ code: z.string().min(3).max(64), isActive: z.boolean() })
      )
      .mutation(({ ctx, input }) =>
        updatePromotionStatus(ctx.user.id, input.code, input.isActive)
      ),
    createCuratedMarket: adminProcedure
      .input(
        z.object({
          title: z.string().min(12).max(220),
          description: z.string().min(20).max(3000),
          category: z.enum([
            "cultura",
            "entretenimiento",
            "tecnologia",
            "educacion",
          ]),
          sourceLabel: z.string().min(3).max(160),
          sourceUrl: z.string().url().max(512),
          resolutionRule: z.string().min(20).max(3000),
          closesAt: z
            .date()
            .refine(
              value => value.getTime() > Date.now(),
              "El cierre debe estar en el futuro."
            ),
        })
      )
      .mutation(({ ctx, input }) => createCuratedMarket(ctx.user.id, input)),
    closeCuratedMarket: adminProcedure
      .input(z.object({ marketPublicId: z.string().min(4).max(40) }))
      .mutation(({ ctx, input }) =>
        closeCuratedMarket(ctx.user.id, input.marketPublicId)
      ),
    resolveCuratedMarket: adminProcedure
      .input(
        z.object({
          marketPublicId: z.string().min(4).max(40),
          outcome: z.enum(["yes", "no"]),
          resolutionUrl: z.string().url().max(512),
        })
      )
      .mutation(({ ctx, input }) => resolveCuratedMarket(ctx.user.id, input)),
    voidCuratedMarket: adminProcedure
      .input(
        z.object({
          marketPublicId: z.string().min(4).max(40),
          resolutionUrl: z.string().url().max(512),
        })
      )
      .mutation(({ ctx, input }) => voidCuratedMarket(ctx.user.id, input)),
    supportedGames: publicProcedure.query(() => GAME_TYPES),
    gameRegistry: publicProcedure.query(() => GAME_REGISTRY),
    broadcastSignalMetrics: adminProcedure
      .input(
        z
          .object({ limit: z.number().int().min(1).max(500).optional() })
          .optional()
      )
      .query(({ input }) => getBroadcastSignalMetrics(input?.limit)),
    operationalEvents: adminProcedure
      .input(
        z
          .object({ limit: z.number().int().min(1).max(500).optional() })
          .optional()
      )
      .query(({ input }) => listOperationalEvents(input?.limit)),
    reviewConstitutionalContract: adminProcedure
      .input(
        z.object({
          decision: z.enum(["HUMAN_APPROVED", "HUMAN_REJECTED"]),
          comment: z.string().trim().max(1000).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        recordConstitutionalContractDecision({
          actorUserId: ctx.user.id,
          ...input,
        })
      ),
    exportConstitutionalDecisionPdf: adminProcedure
      .input(
        z.object({
          decision: z.enum(["HUMAN_APPROVED", "HUMAN_REJECTED"]),
          comment: z.string().trim().max(1000).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        exportConstitutionalDecisionPdf({ actorUserId: ctx.user.id, ...input })
      ),
    recentAudits: adminProcedure
      .input(
        z
          .object({ limit: z.number().int().min(1).max(100).optional() })
          .optional()
      )
      .query(({ input }) => listRecentAudits(input?.limit)),
    productRetention: adminProcedure
      .input(
        z
          .object({ windowDays: z.number().int().min(30).max(365).optional() })
          .optional()
      )
      .query(({ input }) => calculateRetention(input?.windowDays)),
    controlState: adminProcedure.query(() => getControlState()),
    setControlMode: adminProcedure
      .input(
        z.object({
          mode: z.enum(["NORMAL", "DEGRADED", "STOPPED", "MAINTENANCE"]),
          reason: z.string().min(3).max(255),
        })
      )
      .mutation(({ ctx, input }) =>
        setControlMode(input.mode, input.reason, ctx.user.id)
      ),
    watchdogHealth: adminProcedure.query(() => runWatchdog()),
    live24Report: adminProcedure.query(() => buildLive24Report()),
    live24Watchdog: adminProcedure.query(() => runLiveWatchdog()),
    live24Heartbeat: adminProcedure
      .input(
        z.object({ taskUid: z.string().min(1).max(128).optional() }).optional()
      )
      .mutation(({ ctx, input }) =>
        runLiveHeartbeat(input?.taskUid, ctx.user.id)
      ),
    autonomyRuntimeSummary: adminProcedure.query(() => {
      const report = runAgentRuntimeAutonomyTest();
      return {
        passed: report.passed,
        chainCompleted: report.chainCompleted,
        minutes: report.minutes,
        uniqueEventIds: report.uniqueEventIds,
        chaosPassed: report.chaos.every(scenario => scenario.passed),
        chaosCount: report.chaos.length,
        killLukitaPassed: report.killLukita.passed,
        checkedAt: new Date().toISOString(),
        limitations: report.limitations,
      };
    }),
    youtubeLiveStatus: adminProcedure.query(() => getYoutubeLiveStatus()),
    qrTimerPalettes: adminProcedure.query(() => listQrTimerPalettes()),
    qrTimerPaletteSave: adminProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(96),
          palette: z.object({
            green: z.string(),
            yellow: z.string(),
            orange: z.string(),
            red: z.string(),
          }),
          activate: z.boolean().default(false),
        })
      )
      .mutation(({ ctx, input }) =>
        saveQrTimerPalette({ userId: ctx.user.id, ...input })
      ),
    qrTimerPaletteActivate: adminProcedure
      .input(z.object({ publicId: z.string().min(8).max(40) }))
      .mutation(({ ctx, input }) =>
        activateQrTimerPalette(input.publicId, ctx.user.id)
      ),
    qrTimerPalettesActive: publicProcedure.query(() =>
      getActiveQrTimerPalette()
    ),
    scheduleProposal: adminProcedure
      .input(
        z.object({
          startAt: z.number().int(),
          hours: z.number().int().min(1).max(24),
          candidates: z
            .array(
              z.object({
                gameId: z.string().min(1),
                title: z.string().min(1),
                frequencyPerWeek: z.number().int().min(0),
                durationMinutes: z.number().int(),
                priority: z.enum(["HIGH", "NORMAL", "LOW"]),
                primeTime: z.boolean(),
                minGapMinutes: z.number().int().min(0),
                category: z.string().min(1),
                rulesetValid: z.boolean().optional(),
                rtpValidated: z.boolean().optional(),
                experienceComplete: z.boolean().optional(),
                contingencyConfigured: z.boolean().optional(),
                contentConfigured: z.boolean().optional(),
                tvConfigured: z.boolean().optional(),
                mobileConfigured: z.boolean().optional(),
                resourcesAvailable: z.boolean().optional(),
              })
            )
            .max(30),
        })
      )
      .query(({ input }) =>
        proposeSchedule(input.candidates, input.startAt, input.hours)
      ),
    autopilotHeartbeat: adminProcedure.mutation(({ ctx }) =>
      runSafeAutopilotHeartbeat(ctx.user.id)
    ),
    recordProductEvent: protectedProcedure
      .input(
        z.object({
          anonymousSessionId: z.string().min(8).max(96).optional(),
          eventType: z.enum([
            "session_started",
            "session_returned",
            "game_viewed",
            "participation_confirmed",
            "result_viewed",
            "verification_viewed",
            "broadcast_viewed",
            "secondary_screen_viewed",
            "secondary_screen_returned",
            "access_mode_selected",
          ]),
          gameType: z.string().max(32).optional(),
          sessionId: z.string().min(8).max(96).optional(),
          source: z
            .enum(["web", "pwa", "tv", "simulator", "secondary_screen"])
            .optional(),
          payload: z.record(z.string(), z.unknown()).optional(),
          idempotencyKey: z.string().min(8).max(128),
        })
      )
      .mutation(({ ctx, input }) =>
        recordProductEvent({ ...input, userId: ctx.user.id })
      ),
    auditRound: adminProcedure
      .input(z.object({ roundPublicId: z.string().min(4).max(64) }))
      .mutation(({ ctx, input }) =>
        auditRound(input.roundPublicId, ctx.user.id)
      ),
    recordBroadcastSignal: adminProcedure
      .input(
        z.object({
          broadcastId: z.string().min(4).max(96).optional(),
          videoId: z.string().min(6).max(64).optional(),
          source: z.enum(["local_probe", "youtube_api", "operator"]),
          status: z.enum(["healthy", "degraded", "offline", "unknown"]),
          latencyMs: z.number().int().min(0).max(120_000).optional(),
          droppedFramesPercent: z.number().int().min(0).max(100).optional(),
          detail: z.string().max(255).optional(),
        })
      )
      .mutation(({ input }) => recordBroadcastSignal(input)),
    lukitaScripts: adminProcedure.query(({ ctx }) =>
      listLukitaScripts(ctx.user.id)
    ),
    lukitaScriptHistory: adminProcedure
      .input(
        z
          .object({
            trigger: z.enum(LUKITA_SCRIPT_TRIGGERS).optional(),
            category: z.string().trim().max(40).optional(),
            status: z.enum(["draft", "active", "archived"]).optional(),
            limit: z.number().int().min(1).max(200).optional(),
          })
          .optional()
      )
      .query(({ input }) => listLukitaScriptHistory(input)),
    saveLukitaScript: adminProcedure
      .input(
        z.object({
          trigger: z.enum(LUKITA_SCRIPT_TRIGGERS),
          text: z.string().trim().min(1).max(280),
          fallback: z.string().trim().min(1).max(280),
          enabled: z.boolean(),
          source: z.enum(["operator_edit", "ai_generated"]).optional(),
          category: z.string().trim().min(1).max(40).optional(),
          tags: z.array(z.string().trim().min(1).max(24)).max(8).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        saveLukitaScript({ actorUserId: ctx.user.id, ...input })
      ),
    resetLukitaScript: adminProcedure
      .input(z.object({ trigger: z.enum(LUKITA_SCRIPT_TRIGGERS) }))
      .mutation(({ ctx, input }) =>
        resetLukitaScript(ctx.user.id, input.trigger)
      ),
    generateLukitaVariations: adminProcedure
      .input(
        z.object({
          trigger: z.enum(LUKITA_SCRIPT_TRIGGERS),
          game: z.string().trim().min(1).max(80),
          currentText: z.string().max(280),
          fallback: z.string().max(280),
          count: z.number().int().min(1).max(3).default(3),
        })
      )
      .mutation(({ input }) => generateLukitaScriptVariations(input)),
    lrciCases: adminProcedure
      .input(
        z
          .object({
            status: z.enum(LRCI_CASE_STATUSES).optional(),
            jurisdiction: z.string().trim().min(2).max(64).optional(),
          })
          .optional()
      )
      .query(({ input }) => listLrciReviewCases(input)),
    createLrciCase: adminProcedure
      .input(
        z.object({
          title: z.string().trim().min(3).max(160),
          domain: z.string().trim().min(3).max(48),
          scope: z.string().trim().min(3).max(255),
          jurisdiction: z.string().trim().min(2).max(64),
          expiresAt: z.date().nullable().optional(),
          responsibleUserId: z.number().int().positive().optional(),
          responsibleLabel: z.string().trim().min(2).max(160),
          sourceRef: z.string().trim().max(512).optional(),
          evidenceSummary: z.string().trim().max(10_000).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        createLrciReviewCase({ actorUserId: ctx.user.id, ...input })
      ),
    exportLrciCasesPdf: adminProcedure
      .input(
        z
          .object({
            status: z.enum(LRCI_CASE_STATUSES).optional(),
            jurisdiction: z.string().trim().min(2).max(64).optional(),
          })
          .optional()
      )
      .mutation(({ ctx, input }) =>
        exportLrciReviewCasesPdf({ actorUserId: ctx.user.id, ...input })
      ),
    lrciCaseHistory: adminProcedure
      .input(z.object({ publicId: z.string().regex(/^LRCI-[A-F0-9]{20}$/) }))
      .query(({ input }) => listLrciCaseHistory(input.publicId)),
    exportLrciCaseHistoryPdf: adminProcedure
      .input(z.object({ publicId: z.string().regex(/^LRCI-[A-F0-9]{20}$/) }))
      .mutation(({ ctx, input }) =>
        exportLrciCaseHistoryPdf({
          actorUserId: ctx.user.id,
          publicId: input.publicId,
        })
      ),
    lrciNotifications: adminProcedure
      .input(
        z
          .object({
            includeRead: z.boolean().optional(),
            severity: z.enum(["HIGH", "CRITICAL"]).optional(),
            from: z.coerce.date().optional(),
            to: z.coerce.date().optional(),
          })
          .optional()
      )
      .query(({ input }) => listLrciExpiryNotifications(input ?? {})),
    markLrciNotificationRead: adminProcedure
      .input(z.object({ publicId: z.string().regex(/^LRCI-N-[A-F0-9]{18}$/) }))
      .mutation(({ ctx, input }) =>
        markLrciNotificationRead(input.publicId, ctx.user.id)
      ),
    updateLrciCase: adminProcedure
      .input(
        z.object({
          publicId: z.string().regex(/^LRCI-[A-F0-9]{20}$/),
          status: z.enum(LRCI_CASE_STATUSES),
          reviewerComment: z.string().trim().max(10_000).optional(),
          expiresAt: z.date().nullable().optional(),
          responsibleUserId: z.number().int().positive().nullable().optional(),
          responsibleLabel: z.string().trim().min(2).max(160).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        updateLrciReviewCase({ actorUserId: ctx.user.id, ...input })
      ),
    auditReportPreview: adminProcedure.query(() => getUnifiedReportPreview()),
    auditReportHistory: adminProcedure
      .input(
        z
          .object({ limit: z.number().int().min(1).max(100).optional() })
          .optional()
      )
      .query(({ input }) => listAuditReportArtifacts(input?.limit)),
    generateAuditReportPdf: adminProcedure.mutation(({ ctx }) =>
      generateUnifiedReportPdf(ctx.user.id)
    ),
    auditReportDownload: adminProcedure
      .input(z.object({ publicId: z.string().regex(/^RPT-[A-F0-9]{20}$/) }))
      .query(({ input }) => getAuditReportDownload(input.publicId)),
    autonomySimulationPreview: adminProcedure.query(() =>
      getAutonomySimulationPreview()
    ),
    autonomySimulationExport: adminProcedure
      .input(z.object({ format: z.enum(["csv", "pdf"]) }))
      .query(({ input }) => exportAutonomySimulation(input.format)),
    liveChannelPreview: adminProcedure
      .input(
        z
          .object({
            minute: z.number().int().min(0).max(1439).optional(),
            players: z.number().int().min(0).max(100).optional(),
          })
          .optional()
      )
      .query(({ input }) => {
        const schedule = buildDefaultLiveSchedule();
        return {
          manifest: projectLiveManifest(
            schedule,
            input?.minute ?? 0,
            input?.players ?? 0
          ),
          schedule: schedule.slice(0, 12),
          pilotOnly: true,
        };
      }),
    liveChannelSimulation: adminProcedure.query(() => simulateLiveDay()),
    financialProjection: adminProcedure
      .input(
        z
          .object({
            dailyPlays: z.number().int().min(0).max(10_000_000).optional(),
            ticketPriceSoles: z.number().min(1).max(100).optional(),
            rtp: z.number().min(0.85).max(1).optional(),
            gameTaxRate: z.number().min(0).max(1).optional(),
            maintenanceRate: z.number().min(0).max(1).optional(),
            iscRate: z.number().min(0).max(1).optional(),
            gatewayRate: z.number().min(0).max(1).optional(),
            marketingRate: z.number().min(0).max(1).optional(),
            daysPerMonth: z.number().int().min(1).max(31).optional(),
          })
          .optional()
      )
      .query(({ input }) =>
        calculateFinancialProjection({
          ...DEFAULT_FINANCIAL_MODEL,
          ...(input ?? {}),
        } as FinancialModelInput)
      ),
  }),
});

export type AppRouter = typeof appRouter;
