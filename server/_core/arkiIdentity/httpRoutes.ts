/**
 * ARKI Identity — rutas HTTP de introspección.
 *
 * Loopback-only + X-Internal-Key (timing-safe).
 * NUNCA exponer a red externa. El Bridge llama esto en 127.0.0.1.
 *
 * Respuestas:
 *   200 { valid: true, subject, client_id, scopes, expires_at }
 *   200 { valid: false }                       — token inválido/expirado/revocado
 *   400 { error: "INVALID_BODY" }              — body malformado
 *   403 { error: "FORBIDDEN" }                 — no loopback o key incorrecta
 *   503 { error: "IDENTITY_DISABLED" }         — ARKI_IDENTITY_ENABLE != 1
 */
import type { Express, Request, Response } from "express";
import { timingSafeEqual } from "node:crypto";
import { identityEnabled, introspect } from "./index";

export const INTERNAL_KEY_HEADER = "x-internal-key";

function isLoopback(req: Request): boolean {
  // Express puede darnos req.socket.remoteAddress o req.ip.
  // Aceptamos 127.0.0.1, ::1, ::ffff:127.0.0.1.
  const raw = req.socket?.remoteAddress ?? req.ip ?? "";
  const addr = raw.replace(/^::ffff:/, "");
  return addr === "127.0.0.1" || addr === "::1";
}

function keyMatches(provided: unknown): boolean {
  const expected = process.env.ARKI_IDENTITY_INTERNAL_KEY ?? "";
  if (expected.length === 0) return false;
  if (typeof provided !== "string" || provided.length === 0) return false;
  // timing-safe: comparar buffers de igual longitud
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function registerArkiIdentityRoutes(app: Express): void {
  app.post("/api/internal/identity/introspect", (req: Request, res: Response) => {
    if (!identityEnabled()) {
      res.status(503).json({ error: "IDENTITY_DISABLED" });
      return;
    }
    if (!isLoopback(req)) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    if (!keyMatches(req.header(INTERNAL_KEY_HEADER))) {
      res.status(403).json({ error: "FORBIDDEN" });
      return;
    }
    const token = (req.body as { token?: unknown } | undefined)?.token;
    if (typeof token !== "string" || token.length === 0) {
      res.status(400).json({ error: "INVALID_BODY" });
      return;
    }
    res.status(200).json(introspect(token));
  });
}
