# V02E Provider Gap Analysis

**Rule:** `OPENAI_ADAPTER_CONTRACT_V1` is frozen. No V1 field is modified by this analysis.

| Contract field | Current Bridge expectation | Official capability | Mapping | Gap | Severity | Proposed adapter action |
|---|---|---|---|---|---|---|
| `decision_id` | Required string in input/output | Responses accepts arbitrary input content/metadata | Include in structured input and correlate output | None | Low | Keep V1 unchanged. |
| `task_id` | Required Manus task identity | OpenAI has no equivalent required field | Include as input data | None | Low | Preserve as local correlation field. |
| `project` | Required local project | OpenAI projects are account isolation, not prompt field | Adapter config plus input | ADAPTER_ONLY | Medium | Configure `OpenAI-Project`; do not expose provider config in V1. |
| `authorized_scope` | Required scope given to Architect | Responses accepts developer/system instructions and input | Map to developer instruction and input | ADAPTER_ONLY | High | Keep scope boundary in Bridge; provider output is untrusted. |
| `context`, `why`, `objective` | Required review context | Responses accepts structured input | Direct mapping | None | Low | Use explicit labeled input items. |
| `do_not_touch` | Required no-touch boundary | Responses follows developer instruction but cannot be authority | Developer instruction + data | CONTRACT_COMPATIBLE_EXTENSION | High | Retain local gate; never rely solely on model instruction. |
| `manus_result` | Untrusted result wrapper | Responses accepts text/JSON input | Map as untrusted object | None | High | Preserve provenance wrapper. |
| `evidence` | Array of untrusted evidence | Responses accepts JSON/text input | Map as untrusted items | None | High | Preserve Evidence Taxonomy locally. |
| `classification` | One of four V1 values | Provider can emit schema-constrained enum | JSON Schema enum | None | High | Validate again locally. |
| `assessment` | Required string | JSON Schema string | Direct | None | Low | Keep. |
| `next_action` | Required string | JSON Schema string | Direct | None | Medium | Treat as proposal, never authority. |
| `scope_delta` | Required boolean | JSON Schema boolean | Direct | None | High | Any true value routes to Human Authority. |
| `requires_human` | Required boolean | JSON Schema boolean | Direct | None | High | Local policy remains authoritative. |
| `reason` | Required string | JSON Schema string | Direct | None | Medium | Redact provider content before audit. |
| `evidence_to_preserve` | Required array | JSON Schema array | Direct | None | High | Never mark independent verification from this field. |
| `acceptance_status` | V1 enum PASS/FAIL/REQUIRES_REAL_VALIDATION/UNKNOWN | JSON Schema enum | Direct | None | High | Local transition policy remains authoritative. |
| `policy_category` | Optional V1-compatible extension | JSON Schema enum/string | Direct | CONTRACT_COMPATIBLE_EXTENSION | High | Keep optional and map material categories locally. |
| `contract` | Optional contract marker | JSON Schema string | Direct | None | Low | Validate expected contract marker. |
| Session creation | Local `createSession()` | Responses is response-oriented; no required session primitive | Adapter-generated local session | ADAPTER_ONLY | Medium | Create local session row; perform first Responses request. |
| Review call | Local `review()` returns output/events/usage | Responses returns response/output/usage and headers | Adapter mapping | ADAPTER_ONLY | High | Extract strict output and persist IDs. |
| Lifecycle events | V1 local events normalized | Responses can be synchronous or streamed/background | Map provider events to local events | UNKNOWN | Medium | First version use non-streaming synchronous response. |
| Refusal | No V1 refusal field | Provider can produce explicit refusal | Map to invalid/non-executable review state | CONTRACT_COMPATIBLE_EXTENSION | High | Do not alter V1; internal adapter status only. |
| Provider response ID | Not in V1 | Responses `id` | Store metadata only | ADAPTER_ONLY | Medium | Add redacted provider metadata to session/event. |
| Provider request ID | Not in V1 | `x-request-id` and client request ID | Store metadata only | ADAPTER_ONLY | Medium | Use local correlation ID as `X-Client-Request-Id`. |
| Provider usage | Adapter already returns usage nullable | Responses usage | Map exact fields | ADAPTER_ONLY | Medium | Budget counts provider tokens, not control calls. |
| Provider idempotency | V1 assumes local review claims | Native semantic guarantee not established | Local claims/coordinator | UNKNOWN | Critical | Keep local claim and no blind retry. |

## Gap classification summary

- **NONE:** Schema primitives and core V1 fields.
- **ADAPTER_ONLY:** HTTP transport, auth boundary, project headers, IDs, usage, refusal extraction, timeout handling.
- **CONTRACT_COMPATIBLE_EXTENSION:** internal metadata, refusal status, policy mapping; no V1 modification.
- **CONTRACT_V2_REQUIRED:** none established by current documentary evidence.
- **UNKNOWN:** provider semantic idempotency, exact lifecycle mapping for chosen operation mode, retention choice and real selected-model behavior.

## Decision

Do not modify `OPENAI_ADAPTER_CONTRACT_V1`. The first real adapter can be implemented as an adapter-only change if it uses synchronous Responses API, strict JSON output, no provider tools, and local session/claim persistence. A V2 contract may be proposed later only if streaming, refusal metadata, provider IDs or tool calls must become Core-visible.

## References

[1]: https://developers.openai.com/api/reference/resources/responses/methods/create "OpenAI Responses API create response"
[2]: https://developers.openai.com/api/docs/guides/structured-outputs "OpenAI Structured Outputs"
[3]: https://platform.openai.com/docs/api-reference/errors "OpenAI API authentication, errors, rate limits and request IDs"
[4]: https://platform.openai.com/docs/guides/production-best-practices "OpenAI production best practices"

**Consultation date:** 2026-09-25.
