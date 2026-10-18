import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { playerSessionManager } from "./playerSessionManager";

const requestId = z.string().min(8).max(96);
const sessionToken = z.string().min(8).max(96);

export const realtimeRouter = router({
  snapshot: publicProcedure.input(z.object({ roundId: z.string().min(4).max(40) })).query(({ input }) => playerSessionManager.snapshot(input.roundId)),
  join: publicProcedure.input(z.object({
    requestId, roundId: z.string().min(4).max(40), deviceId: z.string().min(4).max(96),
    nickname: z.string().min(2).max(24), avatar: z.string().max(120).default("default"), sessionToken: sessionToken.optional(),
  })).mutation(({ input }) => playerSessionManager.join(input)),
  heartbeat: publicProcedure.input(z.object({ requestId, sessionToken })).mutation(({ input }) => playerSessionManager.heartbeat(input.sessionToken, input.requestId)),
  reconnect: publicProcedure.input(z.object({ requestId, sessionToken, deviceId: z.string().min(4).max(96) })).mutation(({ input }) => playerSessionManager.reconnect(input.sessionToken, input.deviceId, input.requestId)),
  leave: publicProcedure.input(z.object({ requestId, sessionToken })).mutation(({ input }) => playerSessionManager.leave(input.sessionToken, input.requestId)),
});
