import type { Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { runLiveHeartbeat } from "./live24Runtime";

export async function handleScheduledLive24(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    const result = await runLiveHeartbeat(user.taskUid);
    return res.json({ ...result, worker: "live24", virtualOnly: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Error desconocido";
    return res.status(500).json({ error: "scheduled-live24-failed", detail: detail.slice(0, 255), timestamp: new Date().toISOString() });
  }
}
