import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";
import { awardPersistentVirtualReward, listPersistentVirtualRewards } from "../rewards/persistentRewardLedger";

export const rewardsRouter = router({
  mine: protectedProcedure.query(({ ctx }) => listPersistentVirtualRewards(ctx.user.id)),
  award: adminProcedure.input(z.object({ userId: z.number().int().positive(), kind: z.enum(["TOURNAMENT_PRIZE", "COOPERATIVE_ACHIEVEMENT"]), amount: z.number().int().positive().max(1_000_000), reason: z.string().trim().min(3).max(255), idempotencyKey: z.string().trim().min(8).max(128), metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional() })).mutation(({ input }) => awardPersistentVirtualReward(input)),
});
