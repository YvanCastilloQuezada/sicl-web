import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createOnlineTvSession, getOnlineTvSession, joinOnlineTvSession, submitOnlineTvActionPersisted } from "../onlineTvGames";
import { buildOnlineTvManifest } from "../../shared/tvManifest";
import { loadOnlineTvSession } from "../onlineTvPersistence";
import { ONLINE_TV_DIFFICULTIES, ONLINE_TV_GAME_IDS } from "../../shared/onlineTvGames";

const action = z.discriminatedUnion("type", [
  z.object({ type: z.literal("REFLEX"), atMs: z.number().int() }),
  z.object({ type: z.literal("PRECISION"), x: z.number().min(0).max(100), y: z.number().min(0).max(100) }),
  z.object({ type: z.literal("TRIVIA"), answerIndex: z.number().int().min(0).max(4) }),
  z.object({ type: z.literal("COMBINATION"), values: z.array(z.string().min(1).max(20)).max(6) }),
  z.object({ type: z.literal("MEMORY"), sequence: z.array(z.number().int().min(0).max(9)).max(12) }),
  z.object({ type: z.literal("TEAM_CLOCK"), correct: z.boolean() }),
  z.object({ type: z.literal("TEAM_SCORE"), points: z.number().int().min(-1).max(100) }),
  z.object({ type: z.literal("TRAFFIC_LIGHT"), signal: z.enum(["GO", "STOP"]) }),
  z.object({ type: z.literal("ODD_ONE_OUT"), index: z.number().int().min(0).max(8) }),
  z.object({ type: z.literal("COOP_CODE"), fragment: z.string().min(1).max(10) }),
]);
export const onlineTvGamesRouter = router({
  create: protectedProcedure.input(z.object({ gameId: z.enum(ONLINE_TV_GAME_IDS), difficulty: z.enum(ONLINE_TV_DIFFICULTIES).default("STANDARD") })).mutation(({ input }) => createOnlineTvSession(input.gameId, input.difficulty)),
  state: protectedProcedure.input(z.object({ sessionId: z.string().min(8).max(64) })).query(async ({ input }) => getOnlineTvSession(input.sessionId) ?? await loadOnlineTvSession(input.sessionId) ?? null),
  manifest: protectedProcedure.input(z.object({ sessionId: z.string().min(8).max(64) })).query(async ({ input }) => { const session = getOnlineTvSession(input.sessionId) ?? await loadOnlineTvSession(input.sessionId); return session ? buildOnlineTvManifest(session) : null; }),
  join: protectedProcedure.input(z.object({ sessionId: z.string().min(8).max(64), participantCount: z.number().int().min(1).max(100).optional() })).mutation(({ input }) => joinOnlineTvSession(input.sessionId, input.participantCount)),
  submit: protectedProcedure.input(z.object({ sessionId: z.string().min(8).max(64), action })).mutation(({ input }) => submitOnlineTvActionPersisted(input.sessionId, input.action)),
});
