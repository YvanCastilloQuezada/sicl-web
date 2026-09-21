import type { NextFunction, Request, RequestHandler, Response } from "express";
import { createHash } from "node:crypto";

const WINDOW_MS = 60_000;
const MAX_SECURITY_EVENTS = 500;
const events: SecurityEvent[] = [];

type Bucket = { count: number; resetAt: number };
export type SecurityEvent = { id: string; at: string; kind: "RATE_LIMIT" | "ORIGIN_BLOCK" | "CSP_REPORT" | "WS_BLOCK"; path: string; method: string; ip: string; status: number; detail: string; previousIntegrityHash: string; integrityHash: string };

function clientKey(req: Request) {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

export type SecurityEventInput = Omit<SecurityEvent, "id" | "at" | "previousIntegrityHash" | "integrityHash">;

export function recordSecurityEvent(event: SecurityEventInput) {
  const previousIntegrityHash = events[0]?.integrityHash ?? "GENESIS";
  const id = crypto.randomUUID();
  const at = new Date().toISOString();
  const integrityHash = createHash("sha256").update(JSON.stringify({ ...event, id, at, previousIntegrityHash })).digest("hex");
  events.unshift({ ...event, id, at, previousIntegrityHash, integrityHash });
  if (events.length > MAX_SECURITY_EVENTS) events.length = MAX_SECURITY_EVENTS;
}

export function listSecurityEvents(limit = 100) {
  return events.slice(0, Math.max(1, Math.min(limit, MAX_SECURITY_EVENTS)));
}

export function verifySecurityEventChain() {
  return events.every((event, index) => event.previousIntegrityHash === (events[index + 1]?.integrityHash ?? "GENESIS"));
}

export const STRICT_CSP = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; media-src 'self' blob:; worker-src 'self' blob:; frame-src 'self'; form-action 'self'; report-uri /api/security/csp-report";

export function securityHeaders(): RequestHandler {
  return (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(self), microphone=(self), geolocation=(self), xr-spatial-tracking=(self)");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    res.setHeader("X-Download-Options", "noopen");
    res.setHeader("Origin-Agent-Cluster", "?1");
    res.setHeader("Reporting-Endpoints", 'csp-endpoint="/api/security/csp-report"');
    const cspHeader = process.env.NODE_ENV === "production" ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";
    res.setHeader(cspHeader, STRICT_CSP);
    const forwarded = String(req.headers["x-forwarded-proto"] ?? "").split(",").map((value) => value.trim());
    if (req.protocol === "https" || forwarded.includes("https")) {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  };
}

export function sameOriginGuard(): RequestHandler {
  return (req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || ["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    const expected = `${req.protocol}://${req.get("host")}`;
    const configured = (process.env.ARKI_ALLOWED_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean);
    if (origin === expected || configured.includes(origin)) return next();
    recordSecurityEvent({ kind: "ORIGIN_BLOCK", path: req.path, method: req.method, ip: clientKey(req), status: 403, detail: `Origin rejected: ${origin}` });
    res.status(403).json({ error: "ORIGIN_NOT_ALLOWED" });
  };
}

export function rateLimit(options: { windowMs?: number; max: number; name: string }): RequestHandler {
  const windowMs = options.windowMs ?? WINDOW_MS;
  const buckets = new Map<string, Bucket>();
  return (req, res, next) => {
    const now = Date.now();
    const key = `${options.name}:${clientKey(req)}`;
    const current = buckets.get(key);
    const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    bucket.count += 1;
    buckets.set(key, bucket);
    if (buckets.size > 10_000) buckets.forEach((value, bucketKey) => { if (value.resetAt <= now) buckets.delete(bucketKey); });
    res.setHeader("X-RateLimit-Limit", String(options.max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, options.max - bucket.count)));
    if (bucket.count > options.max) {
      const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSeconds));
      recordSecurityEvent({ kind: "RATE_LIMIT", path: req.path, method: req.method, ip: clientKey(req), status: 429, detail: `${options.name} limit exceeded` });
      res.status(429).json({ error: "RATE_LIMITED", retryAfterSeconds });
      return;
    }
    next();
  };
}

export function writeRequestGuard(req: Request, res: Response, next: NextFunction) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  return sameOriginGuard()(req, res, next);
}
