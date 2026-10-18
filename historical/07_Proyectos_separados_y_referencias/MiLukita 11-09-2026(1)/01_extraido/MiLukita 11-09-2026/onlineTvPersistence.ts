import { eq } from "drizzle-orm";
import { onlineTvActions, onlineTvSessions } from "../drizzle/schema";
import type { OnlineTvAction } from "../shared/onlineTvGames";
import type { OnlineTvSession } from "../shared/onlineTvGames";
import { getDb } from "./db";

export async function persistOnlineTvSession(session: OnlineTvSession): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(onlineTvSessions).values({
    publicId: session.sessionId,
    gameId: session.gameId,
    difficulty: session.difficulty,
    contentVersion: session.contentVersion,
    phase: session.phase,
    startedAt: new Date(session.startedAt),
    expiresAt: new Date(session.expiresAt),
    participantCount: session.participantCount,
    score: session.score,
    progress: session.progress,
    threshold: session.threshold,
    targetJson: JSON.stringify(session.target ?? {}),
  }).onDuplicateKeyUpdate({ set: {
    phase: session.phase,
    participantCount: session.participantCount,
    score: session.score,
    progress: session.progress,
    targetJson: JSON.stringify(session.target ?? {}),
  } });
}

export async function recordOnlineTvAction(sessionId: string, action: OnlineTvAction, accepted: boolean, scoreDelta: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return true;
  const actionId = action.actionId ?? `${sessionId}:${action.participantId ?? "anonymous"}:${action.type}:${JSON.stringify(action)}`;
  try {
    await db.insert(onlineTvActions).values({ publicId: actionId.slice(0, 64), sessionId, participantId: action.participantId ?? "anonymous", actionType: action.type, payloadJson: JSON.stringify(action), accepted, scoreDelta });
    return true;
  } catch (error) {
    if (String(error).toLowerCase().includes("duplicate") || String(error).toLowerCase().includes("unique")) return false;
    throw error;
  }
}

export async function finalizeOnlineTvAction(actionId: string, accepted: boolean, scoreDelta: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(onlineTvActions).set({ accepted, scoreDelta }).where(eq(onlineTvActions.publicId, actionId.slice(0, 64)));
}

export async function loadOnlineTvSession(sessionId: string): Promise<OnlineTvSession | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(onlineTvSessions).where(eq(onlineTvSessions.publicId, sessionId)).limit(1);
  const row = rows[0];
  if (!row) return undefined;
  return {
    sessionId: row.publicId,
    gameId: row.gameId as OnlineTvSession["gameId"],
    difficulty: row.difficulty,
    contentVersion: row.contentVersion,
    phase: row.phase,
    roundNumber: 1,
    startedAt: row.startedAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
    score: row.score,
    participantCount: row.participantCount,
    target: JSON.parse(row.targetJson) as Record<string, unknown>,
    cooperative: row.gameId === "TEAM_CLOCK" || row.gameId === "TEAM_SCORE" || row.gameId === "COOP_CODE",
    progress: row.progress,
    threshold: row.threshold,
  };
}
