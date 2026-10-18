import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { adminQrTimerPalettes } from "../drizzle/schema";
import { normalizeTimerPalette, type TimerPalette } from "../shared/qrTimerPalette";
import { getDb } from "./db";
import { appendOperationalEvent } from "./eventStore";

export type StoredQrTimerPalette = {
  publicId: string;
  name: string;
  palette: TimerPalette;
  isActive: boolean;
  createdByUserId: number;
  createdAt: Date;
  updatedAt: Date;
};

function mapPalette(row: typeof adminQrTimerPalettes.$inferSelect): StoredQrTimerPalette {
  let parsed: Partial<TimerPalette> = {};
  try { parsed = JSON.parse(row.paletteJson) as Partial<TimerPalette>; } catch { /* Fallback seguro en normalizeTimerPalette. */ }
  return { publicId: row.publicId, name: row.name, palette: normalizeTimerPalette(parsed), isActive: row.isActive, createdByUserId: row.createdByUserId, createdAt: row.createdAt, updatedAt: row.updatedAt };
}

export async function listQrTimerPalettes(): Promise<StoredQrTimerPalette[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(adminQrTimerPalettes).orderBy(desc(adminQrTimerPalettes.updatedAt));
  return rows.map(mapPalette);
}

export async function getActiveQrTimerPalette(): Promise<StoredQrTimerPalette | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(adminQrTimerPalettes).where(eq(adminQrTimerPalettes.isActive, true)).orderBy(desc(adminQrTimerPalettes.updatedAt)).limit(1);
  return rows[0] ? mapPalette(rows[0]) : null;
}

export async function saveQrTimerPalette(input: { userId: number; name: string; palette: Partial<TimerPalette>; activate: boolean }): Promise<StoredQrTimerPalette> {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para guardar la paleta administrativa.");
  const palette = normalizeTimerPalette(input.palette);
  const publicId = `QRP-${randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`;
  return db.transaction(async (tx) => {
    if (input.activate) await tx.update(adminQrTimerPalettes).set({ isActive: false }).where(eq(adminQrTimerPalettes.isActive, true));
    await tx.insert(adminQrTimerPalettes).values({ publicId, name: input.name.trim(), paletteJson: JSON.stringify(palette), isActive: input.activate, createdByUserId: input.userId });
    await appendOperationalEvent({ eventType: input.activate ? "QR_TIMER_PALETTE_CREATED_AND_ACTIVATED" : "QR_TIMER_PALETTE_CREATED", aggregateType: "qr_timer_palette", aggregateId: publicId, actorUserId: input.userId, source: "control_room", payload: { name: input.name.trim(), active: input.activate }, idempotencyKey: `qr-palette-create:${publicId}` }, tx);
    const rows = await tx.select().from(adminQrTimerPalettes).where(eq(adminQrTimerPalettes.publicId, publicId)).limit(1);
    return mapPalette(rows[0]);
  });
}

export async function activateQrTimerPalette(publicId: string, actorUserId?: number): Promise<StoredQrTimerPalette> {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible para activar la paleta administrativa.");
  return db.transaction(async (tx) => {
    const target = await tx.select().from(adminQrTimerPalettes).where(eq(adminQrTimerPalettes.publicId, publicId)).limit(1);
    if (!target[0]) throw new Error("La plantilla de paleta no existe.");
    await tx.update(adminQrTimerPalettes).set({ isActive: false }).where(eq(adminQrTimerPalettes.isActive, true));
    await tx.update(adminQrTimerPalettes).set({ isActive: true }).where(eq(adminQrTimerPalettes.publicId, publicId));
    await appendOperationalEvent({ eventType: "QR_TIMER_PALETTE_ACTIVATED_OR_ROLLED_BACK", aggregateType: "qr_timer_palette", aggregateId: publicId, actorUserId, source: "control_room", payload: { action: "activate_or_rollback" }, idempotencyKey: `qr-palette-activate:${publicId}:${new Date().toISOString()}` }, tx);
    const rows = await tx.select().from(adminQrTimerPalettes).where(eq(adminQrTimerPalettes.publicId, publicId)).limit(1);
    return mapPalette(rows[0]);
  });
}
