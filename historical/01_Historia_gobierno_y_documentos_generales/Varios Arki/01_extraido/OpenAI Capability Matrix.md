# OpenAI Capability Matrix

**Consulta:** 2026-09-25. No se ejecutaron llamadas OpenAI.

| Capability | Official current finding | Current Bridge evidence | Classification | Gap / action |
|---|---|---|---|---|
| Recommended API | Responses API is the current surface for direct model responses, tools, text and structured JSON | Bridge has an Agents-shaped transport abstraction only | DOCUMENTED | Implement a Responses transport behind V1. |
| Endpoint | `POST /v1/responses` | No HTTP OpenAI adapter | MISSING | Adapter-only implementation. |
| Authentication | Bearer API key or short-lived workload identity token | No real credential path | MISSING | Server-side secret injection only; no keys in Core. |
| Project isolation | Organization/project headers and separate staging/production projects are documented | No OpenAI org/project fields | MISSING | Add configuration at adapter boundary. |
| Model selection | `model` is a request field; model capability varies | No model field in V1 adapter contract | DOCUMENTED | Adapter configuration, not V1 contract change. |
| Structured Outputs | JSON Schema strict output is supported; Responses uses `text.format`/SDK parse helpers | Local strict schema validator exists | DOCUMENTED | Map V1 output schema; retain local validation. |
| Strict schema | Required fields and `additionalProperties: false` are needed in supported subset | Local strict object validation | DOCUMENTED | Test refusal, schema violation and missing output. |
| Refusal behavior | Structured outputs provide programmatically detectable refusals | V1 has no explicit refusal field | DOCUMENTED | Adapter must map refusal to non-executable review outcome without changing V1. |
| Response identifier | Response object has `id` | OpenAI session/event IDs are local/fake | MISSING | Persist provider response ID. |
| Request identifier | `x-request-id`; client may supply `X-Client-Request-Id` | No HTTP request ID capture | MISSING | Use local correlation ID as client request ID and persist response header. |
| Usage | Responses expose usage data | Orchestrator already accepts usage/tokens | DOCUMENTED | Map exact usage fields and preserve unknown fields redacted. |
| Errors | HTTP errors and headers include request/rate-limit metadata | Public error sanitization exists | DOCUMENTED | Map 401/403/408/409/429/5xx without raw body leakage. |
| Rate limits | `x-ratelimit-*` headers are documented | Local budget is internal, not provider rate limit | DOCUMENTED | Store headers as telemetry; do not treat as autonomy budget. |
| Retry behavior | Backoff is recommended operationally; native semantic idempotency not established | Local coordinator blocks blind retry | DOCUMENTED | No retry after uncertain submission; reconcile/retrieve where possible. |
| Timeout behavior | API can fail without response; request IDs assist lookup | Local timeout patterns exist for Manus only | MISSING | Add timeout/error boundary for OpenAI transport. |
| State/storage | Responses supports retrieval and stateful continuation options; retention settings affect behavior | Local sessions/events persist SQLite | DOCUMENTED | Choose stateless review or explicit previous-response mapping. |
| Data retention | Project/API settings and storage behavior affect production design | No provider retention configuration | MISSING | Decide `store`/retention policy before real calls. |
| Tool requests | Responses can call tools | V1 review contract is output-only | DOCUMENTED | Reject unexpected tool calls in first adapter version. |
| OpenAI V1 mapping | Current V1 fields can be emitted as strict JSON object | Frozen local schema | DOCUMENTED | Adapter-only mapping; do not modify V1. |
| Runtime compatibility | Official docs support the needed primitives | No real transport or credential validation | REQUIRES_REAL_VALIDATION | R0–R2 only under separate authorization. |

## OpenAI V1 conclusion

`OPENAI_CONTRACT_UNDERSTOOD = REQUIRES_REAL_VALIDATION`. The provider primitives are documented and map cleanly to an adapter boundary. The remaining uncertainty concerns exact production response extraction, refusal mapping, retention mode, and real API behavior under selected model/project settings.

## References

[1]: https://developers.openai.com/api/reference/resources/responses/methods/create "OpenAI Responses API create response"
[2]: https://developers.openai.com/api/docs/guides/structured-outputs "OpenAI Structured Outputs"
[3]: https://platform.openai.com/docs/api-reference/errors "OpenAI API authentication, errors, rate limits and request IDs"
[4]: https://platform.openai.com/docs/guides/production-best-practices "OpenAI production best practices"
[5]: https://platform.openai.com/docs/api-reference/responses "OpenAI Responses API reference"

**Consultation date:** 2026-09-25.
