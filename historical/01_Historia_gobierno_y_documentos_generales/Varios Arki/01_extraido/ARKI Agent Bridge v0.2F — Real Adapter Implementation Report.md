# ARKI Agent Bridge v0.2F — Real Adapter Implementation Report

**Orden:** `AB-V02F-REAL-ADAPTER-IMPLEMENTATION-001`  
**Baseline:** v0.2D / `0.2.0-alpha.7` + V02E discovery  
**Snapshot:** `0.2.0-alpha.8`  
**Fecha:** 2026-09-25  
**Clasificación máxima:** `REAL_ADAPTER_CODE_VERIFIED_LOCAL`

## Scope and activation boundary

This phase implemented provider adapters and boundary components without activating them. The default provider mode is `mock`. A real adapter requires an explicit `mode: 'real'` and a non-empty non-placeholder credential. No server path constructs a real adapter by default. No credential value was created, requested or stored.

The adapters use injected `fetch` implementations in all tests. The tests use fake URLs and fake credential labels only. No external network was used.

## Implemented components

| Component | File | Result |
|---|---|---|
| Provider mode and secret redaction | `src/provider-config.mjs` | Fail-closed mode, key boundary, redaction, OpenAI provider headers |
| OpenAI Responses adapter | `src/openai-real-adapter.mjs` | Responses-shaped synchronous request, strict schema, local V1 validation, refusal/tool/error mapping, IDs and usage metadata |
| Manus v2 real adapter | `src/manus-real-adapter.mjs` | Explicitly disabled wrapper over v2 adapter; real mode required |
| Manus public-key cache | `src/manus-webhook-key-cache.mjs` | Injectable transport, bounded TTL, cache hit, forced refresh, sanitized errors |
| Manus webhook envelope validation | `src/manus-webhook-schema.mjs` | Event ID, supported event type and task identity validation |
| Webhook route | `src/server.mjs` | Signature verification followed by explicit envelope validation and provenance response metadata |
| Provider metadata persistence | `src/store.mjs`, `src/orchestrator.mjs` | Redacted task/session metadata for request IDs, response IDs, usage, model, cursor and background state |
| Contract tests | `tests/provider-contract.test.mjs` | 20 fake-HTTP tests covering provider and security contracts |

## OpenAI implementation

`OpenAIRealAdapter` is behind the existing V1-shaped review interface. It constructs a synchronous `POST /v1/responses` request with tools disabled and a strict JSON Schema output. The response is locally parsed and passed through `validateArchitectOutput()`.

A refusal becomes `NON_EXECUTABLE_PROVIDER_RESULT`. An unexpected tool request becomes `UNEXPECTED_PROVIDER_TOOL`. Neither case can result in autonomous action. HTTP 401, 429 and 5xx responses are mapped to sanitized errors. Retry behavior is bounded and preserves provider errors after the retry budget is exhausted. Timeout/network ambiguity produces `OPENAI_TIMEOUT_OR_NETWORK`; the Core must treat a mutating uncertainty boundary through its existing external-effect policy.

The adapter preserves `response_id`, `x-request-id`, local client correlation ID, model, usage and sanitized rate-limit headers in `metadata`. These values are operational identifiers, not cryptographic evidence.

`OPENAI_ADAPTER_CONTRACT_V1` was not modified.

## Manus implementation

`ManusRealAdapter` requires explicit real mode and credential configuration before delegating to the existing v2 paths. It supports `task.create`, `task.detail`, `task.listMessages` and `task.sendMessage`. The existing bounded retry and pagination behavior remains in the underlying adapter.

The reconciler now stores `request_id`, cursor, status, `updated_at` and the three-valued background interpretation. When `has_running_background_jobs` is omitted, stored metadata is `UNKNOWN`; it is never inferred as `false`.

`ManusPublicKeyCache` uses an injected transport and supports cache hit, bounded TTL and controlled forced refresh. It does not invent key-version or rotation semantics. Webhook registration remains absent and was not executed.

The webhook route now validates the v2 envelope after signature verification. A valid signature is reported as:

```text
transport_authenticity = VERIFIED
verification_status    = PROVENANCE_VERIFIED
artifact_truth         = UNKNOWN
```

The route never assigns `INDEPENDENTLY_VERIFIED` from a signature alone.

## Tests and verification

The new contract suite passes:

```text
npm run test:provider-contract
# tests 20
# pass 20
# fail 0
```

The full regression suite passes:

```text
npm test
# tests 95
# pass 95
# fail 0
```

The previous 75-test baseline remains present and passing. The additional 20 tests cover the new provider boundary.

Mock E2E remains passing:

```text
npm run test:mock-e2e
MOCK_E2E_PASS scenarios=14
```

All JavaScript modules pass `node --check`. Tests use fake HTTP transports only. No external network access, real provider call, webhook registration or public endpoint was used.

## Required final status

```text
OPENAI_REAL_ADAPTER_IMPLEMENTED        YES
MANUS_REAL_ADAPTER_IMPLEMENTED         YES
MANUS_PUBLIC_KEY_CACHE_IMPLEMENTED     YES
WEBHOOK_V2_VALIDATION_IMPLEMENTED      YES
SECRET_BOUNDARY_IMPLEMENTED            YES
PROVIDER_FAIL_CLOSED                   YES
CONTRACT_V1_UNCHANGED                  YES
MOCK_E2E_REGRESSION                    PASS

REAL_OPENAI_CALLS                       0
REAL_MANUS_CALLS                        0
REAL_CREDENTIALS                        0
EXTERNAL_NETWORK                        0
ARKI_MODIFICATIONS                      0

REAL_ADAPTER_CODE_VERIFIED_LOCAL        YES
REAL_PROVIDER_VERIFIED                  NO
REAL_E2E_VERIFIED                       NO
```

## Residual limits

The implementation is locally verified only. It does not establish live credentials, live provider response behavior, provider idempotency, provider key rotation semantics, real webhook delivery, real rate-limit values, production retention configuration or model-specific compatibility. Those require a separate future authorization and must begin at R0.

## Files added or changed

Added:

- `src/provider-config.mjs`
- `src/openai-real-adapter.mjs`
- `src/manus-real-adapter.mjs`
- `src/manus-webhook-key-cache.mjs`
- `src/manus-webhook-schema.mjs`
- `tests/provider-contract.test.mjs`
- `V02F_REAL_ADAPTER_IMPLEMENTATION_REPORT.md`
- `V02F_PROVIDER_CONTRACT_TEST_MATRIX.md`
- `V02F_SECURITY_BOUNDARY_REPORT.md`
- `V02F_MANIFEST_SHA256.txt`

Changed:

- `src/server.mjs`
- `src/store.mjs`
- `src/orchestrator.mjs`
- `src/openai-real-adapter.mjs` after local test corrections
- `package.json`

No ARKI source or repository was inspected, modified or connected.

## References

[1]: https://open.manus.ai/docs/v2/task.create "Manus API v2 task.create"
[2]: https://open.manus.ai/docs/v2/task.detail "Manus API v2 task.detail"
[3]: https://open.manus.ai/docs/v2/task.listMessages "Manus API v2 task.listMessages"
[4]: https://open.manus.ai/docs/v2/task.sendMessage "Manus API v2 task.sendMessage"
[5]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 webhook security"
[6]: https://developers.openai.com/api/reference/resources/responses/methods/create "OpenAI Responses API create response"
[7]: https://developers.openai.com/api/docs/guides/structured-outputs "OpenAI Structured Outputs"

**Documentation consultation date:** 2026-09-25.
