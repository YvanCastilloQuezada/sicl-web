# V02E Real E2E Plan

**Status:** plan only. No stage is authorized or executed by this order.

| Stage | Prerequisite | Action | Expected result | Evidence | Rollback | Stop condition |
|---|---|---|---|---|---|---|
| R0 — credentials configured | Separate owner authorization; secrets manager/env boundary; staging projects | Configure short-lived or project-scoped credentials without writing values to repo/logs | Adapters load secrets and redact them | secret-loading test, redaction scan | Remove/rotate credentials | Any secret exposure or wrong project |
| R1 — identity/read-only capability | R0; no mutating calls | OpenAI identity/model capability check and Manus read-only `user.me`/detail capability | Correct provider identity and permissions | Request IDs and sanitized responses | Revoke test credential | Identity mismatch, unexpected scope |
| R2 — minimal OpenAI real call | R1; selected model; budget cap | One Responses request with strict V1-shaped JSON and no tools | Valid response ID, usage, request ID and schema output | Redacted request/response metadata | Delete/revoke test project resources as applicable | Refusal, schema mismatch, wrong project, cost anomaly |
| R3 — minimal Manus real task | R1; isolated private task policy | One `task.create` with minimal prompt and no connectors/files | Task ID, request ID, private visibility | Redacted task metadata | Stop/delete task only if documented and authorized | Wrong ownership, public visibility, unexpected tool access |
| R4 — Manus reconciliation | R3 | Retrieve detail and listMessages until bounded terminal/unknown state | Correct lifecycle interpretation | Task status, cursor and message hashes | Stop polling; leave task isolated | Background field omitted/unknown beyond deadline |
| R5 — signed webhook verification | R3; HTTPS callback; webhook registration approval | Register callback, retrieve/cache public key, verify one event | `PROVENANCE_VERIFIED`, not independent truth | Signature vector, event ID, request ID | Disable/delete webhook if supported | Key mismatch, URL mismatch, replay failure |
| R6 — real OpenAI review | R4/R5; V1 schema validated locally | Review one Manus result through Responses adapter | Valid V1 output; no automatic correction yet | Response ID, usage, schema and audit | Mark REVIEW_REQUIRED and stop | Material category, refusal, tool request |
| R7 — one isolated Bridge decision | R0–R6 pass; explicit owner authorization | Execute exactly one private Bridge decision | Full correlation and audit chain | decision/task/effect/evidence IDs | Revoke decision; reconcile unknown effects | Any unauthorized continuation |
| R8 — controlled correction | R7 pass; correction within original scope | Permit one bounded correction only | One idempotent send and re-review | correction count, effect status | Revoke and reconcile | Scope delta, duplicate or unknown effect |
| R9 — failure/recovery validation | R7/R8; test budget and isolated task | Validate timeout, duplicate webhook, restart, claim recovery, credential failure | Fail-closed and recoverable states | Failure matrix evidence | Kill/revoke and rotate credentials | Blind redispatch, secret leakage or state ambiguity |
| R10 — REAL_E2E_VERIFIED candidate | All prior evidence independently reviewed; owner decision | Prepare candidate report only; do not infer success from tests | Candidate status for human review | Complete manifest and provenance | Stop; no ARKI connection | Any missing evidence or material ambiguity |

## Guardrails

The plan must not be executed by interpreting a readiness result as authorization. Each stage requires its own explicit scope, and R7 onward requires a new decision lock because it mutates external provider state. ARKI remains outside this plan until `REAL_E2E_VERIFIED` and separate authorization exist.

## References

[1]: https://open.manus.ai/docs/v2/authentication "Manus API v2 authentication"
[2]: https://open.manus.ai/docs/v2/task.create "Manus API v2 task.create"
[3]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 webhook security"
[4]: https://developers.openai.com/api/reference/resources/responses/methods/create "OpenAI Responses API create response"
[5]: https://platform.openai.com/docs/guides/production-best-practices "OpenAI production best practices"

**Consultation date:** 2026-09-25.
