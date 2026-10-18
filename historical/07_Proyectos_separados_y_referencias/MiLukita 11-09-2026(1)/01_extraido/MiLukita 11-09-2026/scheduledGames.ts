import type { Request, Response } from "express";
import { runSupervisedSchedulerWorker } from "./supervisedWorker";
import { sdk } from "./_core/sdk";

export async function handleScheduledGameRounds(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    const result = await runSupervisedSchedulerWorker({ taskUid: user.taskUid });
    return res.json({ ...result, worker: "supervised", idempotent: true });
  } catch {
    return res.status(500).json({ error: "scheduled-game-cycle-failed", timestamp: new Date().toISOString() });
  }
}
