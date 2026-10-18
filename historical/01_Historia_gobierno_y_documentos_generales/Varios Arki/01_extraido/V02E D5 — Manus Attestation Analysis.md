# V02E D5 — Manus Attestation Analysis

**Consulta:** 2026-09-25. **Estado:** análisis documental y comparación estática; no se verificó una firma contra Manus real.

## Officially documented contract

| Property | Official finding | Classification |
|---|---|---|
| Algorithm | RSA-SHA256 with 2048-bit key | DOCUMENTED |
| Headers | `X-Webhook-Signature`, `X-Webhook-Timestamp` | DOCUMENTED |
| Timestamp | Reject older than five minutes | DOCUMENTED |
| Signed material | `{timestamp}.{url}.{sha256_hex(body)}` | DOCUMENTED |
| Body digest | SHA-256 hexadecimal digest of raw body | DOCUMENTED |
| URL | Full callback URL included in signed material | DOCUMENTED |
| Public key | Obtained from `webhook.publicKey` | DOCUMENTED |
| Cache | Documentation recommends caching because key rarely changes | DOCUMENTED |
| Key rotation | No rotation protocol or key-version field found in consulted pages | UNKNOWN |
| Event ID | Webhook envelope includes `event_id`; nested question event ID is different | DOCUMENTED |
| Request ID | API responses expose `request_id` | DOCUMENTED |
| Provenance | Valid signature authenticates message transport and integrity | DOCUMENTED |
| Artifact truth | Not established by signature | CODE_EVIDENCE / SECURITY INFERENCE |

## Current Bridge comparison

`src/security.mjs` performs the documented digest and signature reconstruction. It requires an HTTPS canonical URL, verifies a five-minute timestamp window and uses RSA-SHA256. `src/server.mjs` reads the raw body before JSON parsing. These are **CODE_EVIDENCE** matches.

The current implementation receives the public key from an environment variable. It does not call `webhook.publicKey`, cache the result, track a key version or perform controlled refresh. These are **MISSING** capabilities for a real provider boundary, not defects that authorize modifying the receiver in this phase.

The persistent event table deduplicates by source plus external event ID and also by payload hash. That provides local replay/delivery protection. It does not prove that the provider will retry, redeliver or order events in any particular way.

## Evidence mapping

A correctly verified webhook should create a provenance record with the following semantics:

```json
{
  "verification_status": "PROVENANCE_VERIFIED",
  "verification_basis": "MANUS_WEBHOOK_RSA_SHA256",
  "transport_authenticity": "VERIFIED",
  "artifact_truth": "UNKNOWN",
  "producer": "ManusWebhook",
  "event_id": "provider event_id",
  "request_id": "provider request_id when available"
}
```

The record must not be assigned `INDEPENDENTLY_VERIFIED`. That status requires an independent verifier act. A signature proves that a trusted key signed the received bytes at the specified URL and timestamp. It does not prove that the agent’s content is accurate, safe, authorized or complete.

## D5 decision

`D5_ATTESTATION_RESOLVED = REQUIRES_REAL_VALIDATION`.

The cryptographic contract is resolved sufficiently for an adapter implementation. Key rotation, cache invalidation, request-ID propagation and provider delivery semantics remain open. The future implementation order should first add a public-key cache with controlled refresh, then run signed test vectors, and only later validate against a real registered webhook under a separate authorization.

## References

[1]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 webhook security"
[2]: https://open.manus.ai/docs/v2/webhook.publicKey "Manus API v2 webhook.publicKey"
[3]: https://open.manus.ai/docs/v2/webhooks-overview "Manus API v2 webhooks overview"
[4]: https://open.manus.ai/docs/v2/webhook.create "Manus API v2 webhook.create"

**Consultation date:** 2026-09-25.
