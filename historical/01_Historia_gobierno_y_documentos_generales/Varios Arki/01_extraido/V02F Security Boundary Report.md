# V02F Security Boundary Report

## Boundary rules implemented

The Bridge Core does not receive provider API keys, provider project IDs, HTTP headers or provider-specific response-format details. Those values are confined to provider adapters. The default mode is `mock`; unknown or absent `PROVIDER_MODE` never activates real traffic. Real mode requires explicit construction with `mode: 'real'` and a non-empty non-placeholder credential.

The current server continues to construct the existing mock-compatible `ManusAdapter` by default. Adding real adapter source therefore does not activate provider traffic. The OpenAI real adapter is not connected to a default server route.

## Secret handling

The boundary provides redaction for Authorization, API-key, token, password, secret and cookie-like fields. Provider metadata persisted by the Store is redacted before storage. Provider error bodies are not returned to callers. Tests assert that bearer and key-like values are removed.

No real secret exists in the source, test fixtures, reports or package configuration. Test strings such as `unit-key` are non-credential labels used only by injected fake transports.

## OpenAI controls

- Bearer authentication is constructed only inside the OpenAI adapter.
- Project selection is an adapter concern.
- `X-Client-Request-Id` is generated from Bridge correlation.
- `x-request-id`, response ID, usage and rate-limit headers are metadata, not evidence.
- Structured output is strict and locally validated again.
- Refusals become `NON_EXECUTABLE_PROVIDER_RESULT`.
- Tool requests are disabled in the request and blocked if returned.
- 401, 429 and 5xx responses are sanitized and bounded.

## Manus controls

- API key is constructed only inside the Manus adapter.
- v2 paths are inherited from the documented v2 adapter.
- Public-key acquisition uses an injected transport and bounded cache.
- No webhook is registered.
- Signature verification precedes JSON envelope validation.
- A valid signature maps to `PROVENANCE_VERIFIED` and `artifact_truth=UNKNOWN`.
- Event uniqueness and replay protection remain durable/local.
- Omitted `has_running_background_jobs` is preserved as `UNKNOWN`.

## External effects

The existing `ExternalEffectCoordinator` remains in place. A provider timeout after uncertain submission is not converted into a successful result and is not blindly retried. Reconciliation remains required. Provider IDs are correlation data and are never treated as cryptographic evidence.

## Security test result

```text
provider contract tests: 20/20 PASS
full regression: 95/95 PASS
Mock E2E: 14/14 PASS
external network: 0
real credentials: 0
```

## Residual risks

The source is not a substitute for live security validation. The following remain unverified: real key rotation behavior, live provider identity and scope, provider request delivery semantics, exact rate-limit headers under load, production retention configuration and live webhook delivery/retry ordering.

## Status

```text
SECRET_BOUNDARY_IMPLEMENTED = YES
PROVIDER_FAIL_CLOSED        = YES
REAL_PROVIDER_VERIFIED      = NO
REAL_E2E_VERIFIED           = NO
```

## References

[1]: https://open.manus.ai/docs/v2/authentication "Manus API v2 authentication"
[2]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 webhook security"
[3]: https://platform.openai.com/docs/api-reference/errors "OpenAI API authentication, errors, rate limits and request IDs"
[4]: https://platform.openai.com/docs/guides/production-best-practices "OpenAI production best practices"

**Consultation and implementation date:** 2026-09-25.
