import type { NextFunction, Request, RequestHandler, Response } from "express";

const WINDOW_MS = 60_000;

type Bucket = { count: number; resetAt: number };

function clientKey(req: Request) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

export function securityHeaders(): RequestHandler {
  return (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(self), microphone=(self), geolocation=(self), xr-spatial-tracking=(self)");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    res.setHeader("Origin-Agent-Cluster", "?1");
    res.setHeader("Content-Security-Policy-Report-Only", "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; connect-src 'self' https: wss:");
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
    if (buckets.size > 10_000) {
      buckets.forEach((value, bucketKey) => { if (value.resetAt <= now) buckets.delete(bucketKey); });
    }
    res.setHeader("X-RateLimit-Limit", String(options.max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, options.max - bucket.count)));
    if (bucket.count > options.max) {
      res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      res.status(429).json({ error: "RATE_LIMITED", retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) });
      return;
    }
    next();
  };
}

export function writeRequestGuard(req: Request, res: Response, next: NextFunction) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  return sameOriginGuard()(req, res, next);
}
