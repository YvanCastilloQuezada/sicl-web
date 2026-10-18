# V02E Security and Failure Matrix

**Scope:** future real-provider boundary only. No row was executed against a real provider. Provider output remains untrusted data even after transport authentication.

| Failure/threat | Detect | State | Retry? | Reconcile? | HUMAN_REQUIRED? | UNKNOWN effect? | Audit requirement |
|---|---|---|---|---|---|---|---|
| Timeout before provider receives request | Network/timeout with no send certainty | FAILED/RETRYABLE | Yes, bounded if request not sent | No | No | No | sanitized error, correlation ID |
| Timeout after provider may receive request | Timeout after write or ambiguous transport | EXTERNAL_EFFECT_UNKNOWN | No blind retry | Yes | Usually no until reconciliation fails | Yes | provider attempt, local uncertainty |
| Provider 4xx validation | HTTP 4xx | FAILED | No, except corrected adapter input | No | If credential/scope/material boundary | No | code, request ID, redacted message |
| Provider 401/403 | Auth/permission error | HUMAN_REQUIRED or BLOCKED | No | Optional identity check | Yes for credential/permission decision | No | no token, code and request ID only |
| Provider 5xx | HTTP 5xx | RETRYABLE/UNKNOWN by send certainty | Bounded only before certainty boundary | Yes after ambiguous mutation | No initially | Possibly | attempt count and backoff result |
| Rate limit 429 | HTTP 429 and rate headers | PAUSE/RETRYABLE | Bounded with provider reset guidance | No for pure read | No unless budget/cost decision | No | rate headers, no secrets |
| Malformed provider response | JSON/protocol parse failure | UNKNOWN if provider may have acted | No blind mutation retry | Yes | No initially | Yes for mutation | raw response hash, sanitized parse error |
| Structured schema violation/refusal | Local V1 validator/refusal | REVIEW_REQUIRED or HUMAN_REQUIRED | No automatic correction | No | If no safe interpretation | No | schema error/refusal marker |
| Webhook lost | Polling deadline/no event | UNKNOWN | No duplicate mutation | Yes via detail/listMessages | No until deadline exhausted | Yes | last poll, deadline, task ID |
| Webhook duplicated | Persistent event uniqueness conflict | Duplicate ignored | No | No | No | No | duplicate event ID/hash |
| Webhook delayed | Timestamp valid but late delivery | Processed if within window; otherwise expired | No | Poll fallback | No | No | received time, provider timestamp |
| Invalid signature | RSA verification failure | REJECTED | No | No, unless polling fallback | No | No | signature failure, no body content |
| Webhook replay | Old timestamp or durable duplicate | REJECTED/IGNORED | No | No | No | No | replay reason and event ID |
| Provider success + local DB failure | Persistence exception after success | EXTERNAL_EFFECT_UNKNOWN | No blind retry | Yes | No initially | Yes | preserve provider-success and local-failure truths |
| Credential invalid | Authentication failure | HUMAN_REQUIRED/BLOCKED | No | Identity/read-only check only | Yes | No | credential class only, never credential value |
| Credential revoked | Subsequent auth failure | BLOCKED | No | Confirm control-plane status | Yes | No | rotation/revocation event, no secret |
| Prompt injection in provider output | Untrusted content contains instructions | Contained as DATA | No action from content | No | If material classification results | No | content hash and policy decision |
| Scope injection | Output asks to expand scope or touch ARKI | HUMAN_REQUIRED | No | No | Yes | No | exact policy category and no-touch proof |
| Forged provider identity | Signature/key mismatch | REJECTED | No | Poll trusted endpoint if needed | No | No | verification failure |
| Duplicate execution | Local intent already IN_FLIGHT/SUCCEEDED | UNKNOWN or replayed | No blind retry | Yes | No | Possibly | effect ID/idempotency conflict |
| Unexpected tool request | OpenAI/Manus response asks for unapproved tool | HUMAN_REQUIRED/BLOCKED | No | No | Yes | No | tool name and policy reason |
| Compromised result | Valid transport but contradictory evidence | CONTRADICTED | No correction without policy | Yes | Often | No | evidence contradiction and verifier status |

## Security invariants

1. Provider outputs are untrusted data.
2. Transport authenticity is not artifact truth.
3. Unknown external effects cannot be retried blindly.
4. A material scope, credential, security, cost or professional boundary requires Human Authority.
5. Secrets never enter prompts, evidence, public errors or audit metadata.
6. `INDEPENDENTLY_VERIFIED` requires an independent verifier act.

## References

[1]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 webhook security"
[2]: https://open.manus.ai/docs/v2/task-lifecycle "Manus API v2 task lifecycle"
[3]: https://platform.openai.com/docs/api-reference/errors "OpenAI API authentication, errors, rate limits and request IDs"
[4]: https://platform.openai.com/docs/guides/production-best-practices "OpenAI production best practices"

**Consultation date:** 2026-09-25.
