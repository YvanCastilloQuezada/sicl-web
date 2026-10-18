import type { NextFunction, Request, RequestHandler, Response } from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

type RateLimitOptions = {
  windowMs?: number;
  apiLimit?: number;
  mutationLimit?: number;
  shareLimit?: number;
  uploadLimit?: number;
  authLimit?: number;
};

function isSafeE2EBypass(req: Request) {
  return process.env.NODE_ENV !== "production" && req.headers["x-milukita-e2e"] === "1";
}

function baseSkip(req: Request) {
  return req.method === "OPTIONS" || isSafeE2EBypass(req);
}

export function securityHeaders(): RequestHandler {
  return helmet({
    // Vite/SPA assets are dynamic in development. CSP remains explicitly pending
    // until the production asset allow-list is independently verified.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: process.env.NODE_ENV === "production"
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
  });
}

/**
 * Browser CSRF boundary for cookie-authenticated mutations. Native clients may
 * omit Origin; browser requests that do send it must match the current host or
 * an explicitly configured public origin.
 */
export function sameOriginMutationGuard(req: Request, res: Response, next: NextFunction) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  const origin = req.headers.origin;
  if (!origin) return next();
  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return res.status(403).json({ error: "CSRF_ORIGIN_INVALID" });
  }
  const allowed = new Set<string>([
    `${req.protocol}://${req.get("host")}`,
    process.env.PUBLIC_APP_ORIGIN,
  ].filter((value): value is string => Boolean(value)));
  if (!allowed.has(originUrl.origin)) return res.status(403).json({ error: "CSRF_ORIGIN_DENIED" });
  return next();
}

export function createRequestRateLimiters({
  windowMs = 60_000,
  apiLimit = 120,
  mutationLimit = 30,
  shareLimit = 30,
  uploadLimit = 12,
  authLimit = 20,
}: RateLimitOptions = {}) {
  const common = {
    windowMs,
    standardHeaders: "draft-8" as const,
    legacyHeaders: false,
    skip: baseSkip,
  };
  const scoped = (limit: number, message: string) => rateLimit({
    ...common,
    limit,
    message: { error: message },
  });

  return {
    apiLimiter: scoped(apiLimit, "Demasiadas solicitudes. Intenta nuevamente en un minuto."),
    mutationLimiter: rateLimit({
      ...common,
      limit: mutationLimit,
      skip: req => req.method === "GET" || baseSkip(req),
      message: { error: "Demasiadas acciones seguidas. Espera un momento antes de continuar." },
    }),
    shareLimiter: scoped(shareLimit, "Demasiadas resoluciones o sesiones QR. Espera un momento."),
    uploadLimiter: scoped(uploadLimit, "Demasiadas cargas de archivos. Espera antes de continuar."),
    authLimiter: scoped(authLimit, "Demasiados intentos de autenticación. Espera antes de reintentar."),
  };
}
