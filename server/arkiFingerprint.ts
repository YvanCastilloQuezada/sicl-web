import { createHash } from "node:crypto";

/**
 * SHA-256 lowercase hex fingerprint.
 *
 * Canonicalization intentionally remains JSON.stringify(value), preserving
 * insertion-order behavior from the original D6.2 implementation.
 *
 * A future coordinated migration may adopt canonical JSON for cryptographic
 * proposal -> review -> promotion binding. Core currently validates format
 * only and does not recompute this digest.
 */
export function fingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
