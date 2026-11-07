/**
 * ARKI Identity Bridge — punto único de autenticación local.
 * Delega a arkiIdentity/ (SQLite). Ya NO usa MO08/MySQL.
 *
 * Si ARKI_IDENTITY_ENABLE !== "1", devuelve null sin tocar storage.
 * Mantiene la firma pública usada por MO22 y otros consumidores.
 */
import type { Request } from "express";
import { parse as parseCookie } from "cookie";
import {
  identityEnabled,
  verifyToken,
  type VerifiedIdentity,
} from "./arkiIdentity";

export const ARKI_IDENTITY_COOKIE = "arki_identity_session";

function bearer(req: Request): string | undefined {
  const raw = req.headers.authorization;
  if (typeof raw !== "string") return undefined;
  const m = /^Bearer\s+(.+)$/.exec(raw.trim());
  return m ? m[1] : undefined;
}

function cookieToken(req: Request): string | undefined {
  try {
    const parsed = parseCookie(req.headers.cookie ?? "");
    const v = parsed[ARKI_IDENTITY_COOKIE];
    return typeof v === "string" && v.length > 0 ? v : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extrae el token de la request (Bearer o cookie) y lo verifica.
 * Devuelve null si no hay token, si no es válido, o si identidad está off.
 */
export function authenticateArkiIdentity(req: Request): VerifiedIdentity | null {
  if (!identityEnabled()) return null;
  const token = bearer(req) ?? cookieToken(req);
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Compatibilidad con consumidores previos (MO22, routers).
 * Devuelve la identidad verificada o null. No lanza.
 */
export async function authenticateLocalIdentity(req: Request): Promise<VerifiedIdentity | null> {
  return authenticateArkiIdentity(req);
}

export { identityEnabled, verifyToken };
export type { VerifiedIdentity };
