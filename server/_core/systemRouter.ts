import { z } from "zod";
import { notifyOwner } from "./notification";
import { execSync } from "child_process";
import { adminProcedure, publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  gpuUsage: publicProcedure.query(() => {
    try {
      const output = execSync("nvidia-smi --query-gpu=index,name,utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits", { encoding: "utf-8", timeout: 3000 });
      const lines = output.trim().split("\n").filter(Boolean);
      const gpus = lines.map(line => {
        const [index, name, usage, memUsed, memTotal] = line.split(",").map(value => value.trim());
        return {
          index: parseInt(index, 10),
          name,
          usage: parseInt(usage, 10),
          memoryUsed: parseInt(memUsed, 10),
          memoryTotal: parseInt(memTotal, 10),
        };
      });
      return { status: "OK", gpus };
    } catch (e) {
      return { status: "ERROR", gpus: [], message: e instanceof Error ? e.message : "Unknown error" };
    }
  }),
});
