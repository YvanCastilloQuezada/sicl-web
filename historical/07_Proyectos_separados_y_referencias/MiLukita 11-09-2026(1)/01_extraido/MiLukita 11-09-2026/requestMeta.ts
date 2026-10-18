import type { Request } from "express";
import { randomUUID } from "node:crypto";

export type RequestMetadata = {
  requestId: string;
  ip: string;
  userAgent: string;
};

function firstForwardedAddress(value: string | string[] | undefined): string | null {
  if (!value) return null;
  const normalized = Array.isArray(value) ? value[0] : value;
  const first = normalized.split(",")[0]?.trim();
  return first || null;
}

export function getRequestMetadata(req: Pick<Request, "headers" | "ip">): RequestMetadata {
  const requestIdHeader = req.headers["x-request-id"];
  const requestId = Array.isArray(requestIdHeader) ? requestIdHeader[0] : requestIdHeader;
  const userAgentHeader = req.headers["user-agent"];
  const userAgent = Array.isArray(userAgentHeader) ? userAgentHeader[0] : userAgentHeader;

  return {
    requestId: requestId?.slice(0, 128) || randomUUID(),
    ip: firstForwardedAddress(req.headers["x-forwarded-for"]) || req.ip || "unknown",
    userAgent: userAgent?.slice(0, 512) || "unknown",
  };
}
