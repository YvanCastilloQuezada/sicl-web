/**
 * ARKI Identity — API pública.
 *
 * Activación: ARKI_IDENTITY_ENABLE=1
 * Storage:    ARKI_IDENTITY_DB_PATH (default: data/memory/identity.sqlite)
 * TTL:        ARKI_IDENTITY_TOKEN_TTL_SECONDS (default: 86400)
 */
export { getDb, closeDb, dbExists } from "./storage";
export { issueToken, generateOpaqueToken, isValidTokenFormat, hashToken, listSessionsForUser }
  from "./issuer";
export type { IssuedToken, IssueOptions } from "./issuer";
export { verifyToken, hasScope, requireScope } from "./verify";
export type { VerifiedIdentity } from "./verify";
export { revokeByToken, revokeBySessionId } from "./revoke";
export { createCredential, verifyCredential, disableCredential } from "./auth";
export type { CreateCredentialInput } from "./auth";

export function identityEnabled(): boolean {
  return process.env.ARKI_IDENTITY_ENABLE === "1";
}

export const KNOWN_SCOPES = [
  "git:read",
  "files:read",
  "services:read",
  "test:run",
] as const;
export type KnownScope = (typeof KNOWN_SCOPES)[number];

export { introspect } from "./verify";
export type { IntrospectResponse } from "./verify";
