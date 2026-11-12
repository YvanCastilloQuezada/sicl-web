/**
 * ARKI Identity Bridge — valida la sesión ARKI existente.
 * Acepta token opaco ARKI por Bearer o cookie JWT de login local/OIDC.
 * No crea tokens, no emite sesiones y no usa credenciales de SICL Core.
 */
import type { Request } from "express";
import { parse as parseCookie } from "cookie";
import { verifyArkiSessionJwt, isArkiSessionJwtRevoked } from "./arkiIdentity/auth";
import {
  identityEnabled,
  verifyToken,
  type VerifiedIdentity,
} from "./arkiIdentity";
import { getDb } from "./arkiIdentity/storage";

export const ARKI_IDENTITY_COOKIE = "arki_identity_session";

function bearer(req: Request): string | undefined {
  const raw = req.headers.authorization;
  if (typeof raw !== "string") return undefined;
  const match = /^Bearer\s+(.+)$/.exec(raw.trim());
  return match ? match[1] : undefined;
}

function cookieToken(req: Request): string | undefined {
  try {
    const parsed = parseCookie(req.headers.cookie ?? "");
    const value = parsed[ARKI_IDENTITY_COOKIE];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}

async function verifyCookieSession(token: string): Promise<VerifiedIdentity | null> {
  const secretRaw = process.env.JWT_SECRET ?? "";
  if (secretRaw.length < 32) {
    throw new Error("IDENTITY_JWT_SECRET_MISSING");
  }

  const claims = await verifyArkiSessionJwt(token);
  if (!claims || isArkiSessionJwtRevoked(claims.jti)) return null;
  const { openId, issuedAt, expiresAt } = claims;

  const prefix = openId.startsWith("arki-local:")
    ? "arki-local:"
    : openId.startsWith("arki-oidc-gitea:")
      ? "arki-oidc-gitea:"
      : null;
  if (!prefix) return null;
  const username = openId.slice(prefix.length);
  if (!username) return null;

  const db = getDb();
  const credential = db.prepare(
    "SELECT user_id FROM arki_identity_credentials WHERE username = ? AND enabled = 1 LIMIT 1",
  ).get(username) as { user_id: string } | undefined;
  if (!credential) return null;

  const client = db.prepare(
    "SELECT status FROM arki_identity_clients WHERE client_id = ? LIMIT 1",
  ).get("bridge-local") as { status: string } | undefined;
  if (!client || client.status !== "active") return null;

  // No se atribuyen scopes funcionales a la cookie. El acceso a Core es
  // explícitamente de usuario autenticado según la política aprobada por el operador.
  // Otros consumidores que exijan scopes no reciben permisos implícitos.
  return {
    sessionId: `jwt:${claims.jti}`,
    userId: credential.user_id,
    clientId: "bridge-local",
    scopes: [],
    expiresAt,
  };
}

export async function authenticateArkiIdentity(req: Request): Promise<VerifiedIdentity | null> {
  if (!identityEnabled()) return null;
  const token = bearer(req);
  if (token) {
    const identity = verifyToken(token);
    if (!identity) return null;
    const db = getDb();
    const client = db.prepare(
      "SELECT status FROM arki_identity_clients WHERE client_id = ? LIMIT 1",
    ).get(identity.clientId) as { status: string } | undefined;
    return client?.status === "active" ? identity : null;
  }
  const cookie = cookieToken(req);
  if (!cookie) return null;
  return verifyCookieSession(cookie);
}

export async function authenticateLocalIdentity(req: Request): Promise<VerifiedIdentity | null> {
  return authenticateArkiIdentity(req);
}

export { identityEnabled, verifyToken };
export type { VerifiedIdentity };
