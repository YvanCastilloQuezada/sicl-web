# Manus API v2 Capability Matrix

**Consulta:** 2026-09-25. Las fuentes son documentación oficial Manus v2. La clasificación separa documentación externa de evidencia del código local.

| Capability | Official v2 finding | Current Bridge evidence | Classification | Gap / action |
|---|---|---|---|---|
| API version | Base documented as `https://api.manus.ai/v2` | `src/manus.mjs` uses same base | DOCUMENTED | Runtime compatibility still requires real validation. |
| Authentication | `x-manus-api-key` or `Authorization` Bearer; OAuth scopes vary by endpoint | API key header only | DOCUMENTED | Add OAuth only if required; preserve server-side key boundary. |
| `task.create` | Async creation; message, files, connectors/skills and optional project/configuration fields | Path/body/message/project_id/minimal connectors present | DOCUMENTED | Map `locale`, `allow_questions`, visibility, profile, title, structured schema. |
| Task lifecycle | `running`, `stopped`, `waiting`, `error`; stopped can coexist with background work | Reconciliation distinguishes stopped/background | DOCUMENTED | Preserve omitted background field as UNKNOWN. |
| `task.detail` | Returns task metadata, status, `has_running_background_jobs`, `request_id` | Query implemented; request ID not promoted | DOCUMENTED | Persist request ID and all relevant metadata redacted. |
| `task.listMessages` | Cursor pagination; messages include status updates, assistant content, questions, structured output | Pagination and message extraction implemented | DOCUMENTED | Support structured output and question metadata explicitly. |
| `task.sendMessage` | Follow-up; question replies use ordinary message; connector/schema behavior documented | Minimal `{task_id,message.content}` | DOCUMENTED | Add documented optional fields; no native idempotency guarantee found. |
| Projects | `project_id` applies project instruction | Supported in create body | DOCUMENTED | Validate project ownership/scoping before real use. |
| Agents/profiles | Stable `standard`, `lite`, `max` profiles | Not mapped | MISSING | Add explicit allowlist if used. |
| Files | Attachments/file references supported | Not mapped in adapter | MISSING | Separate file capability and evidence policy. |
| Webhooks | `task_created`, `task_stopped`; callback must answer 2xx promptly | Receiver exists; generic event handling | DOCUMENTED | Validate payload and decouple acknowledgment from heavy reconciliation. |
| Registration | `webhook.create` with HTTPS URL | Adapter method exists; no registration run | DOCUMENTED | Registration remains future authorized action. |
| Public key | `webhook.publicKey`; cache recommended | PEM environment variable only | DOCUMENTED | Add cache/refresh component. |
| Signature | RSA-SHA256, 2048-bit; signed `timestamp.url.sha256_hex(body)` | Exact local construction | DOCUMENTED | Official-vector test, then real validation. |
| Replay | Timestamp older than 5 minutes rejected; event dedupe local | Timestamp and durable event dedupe | DOCUMENTED | Provider delivery retry semantics remain UNKNOWN. |
| Request IDs | Responses expose `request_id` | Not first-class persisted | MISSING | Add redacted provider request correlation. |
| Correlation | `task_id`, event envelope IDs and request IDs are available in separate contexts | Task/event IDs local; request ID gap | DOCUMENTED | Map all IDs without treating them as cryptographic proof. |
| Pagination | Cursor-based with `has_more` and `next_cursor` | Implemented | DOCUMENTED | Contract test with multi-page fake. |
| Rate limits | Endpoint docs expose errors; exact limits not established in consulted pages | Retries 429 and 5xx | UNKNOWN | Honor Retry-After if documented/returned; do not invent limits. |
| Retries | Provider retry policy not fully specified in consulted pages | Bounded local retries/backoff | CODE_EVIDENCE | Retry only before certainty boundary; reconcile after timeout. |
| Error taxonomy | Error object has `code` and `message` | Sanitized local errors | DOCUMENTED | Preserve provider code/request ID internally, not raw secret-bearing body. |
| Idempotency | No documented native key found for create/send in consulted sources | ExternalEffectCoordinator local | UNKNOWN + CODE_EVIDENCE | Keep `INTENT_PERSISTED`, `IN_FLIGHT`, `UNKNOWN`, reconciliation. |
| Ownership/scoping | OAuth `create_task` limits access to tasks created by same OAuth client; API key identity visible | Local decision/task correlation | DOCUMENTED | Verify API-key task ownership in R1 read-only stage. |
| OAuth scopes | `create_task` / `manage_all_tasks` documented for relevant endpoints | No OAuth support | MISSING | Defer until a real multi-user requirement exists. |
| Result retrieval | Full event history through listMessages; detail for status | Implemented polling fallback | DOCUMENTED | Handle structured output result and waiting questions. |
| Stopped/input-required distinction | `waiting` and stopped reasons distinguish question vs finish | Generic status model exists | DOCUMENTED | Add explicit `ask`/`finish` handling before real use. |

## Capability conclusion

`MANUS_V2_CONTRACT_UNDERSTOOD = REQUIRES_REAL_VALIDATION`. The transport contract is clear enough for adapter implementation. Runtime compatibility, provider idempotency, key rotation and exact rate-limit behavior remain `REQUIRES_REAL_VALIDATION` or `UNKNOWN`.

## References

[1]: https://open.manus.ai/docs/v2/task.create "Manus API v2 task.create"
[2]: https://open.manus.ai/docs/v2/task-lifecycle "Manus API v2 task lifecycle"
[3]: https://open.manus.ai/docs/v2/task.listMessages "Manus API v2 task.listMessages"
[4]: https://open.manus.ai/docs/v2/task.sendMessage "Manus API v2 task.sendMessage"
[5]: https://open.manus.ai/docs/v2/task.detail "Manus API v2 task.detail"
[6]: https://open.manus.ai/docs/v2/authentication "Manus API v2 authentication"
[7]: https://open.manus.ai/docs/v2/webhooks-overview "Manus API v2 webhooks overview"
[8]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 webhook security"
[9]: https://open.manus.ai/docs/v2/webhook.publicKey "Manus API v2 webhook.publicKey"
[10]: https://open.manus.ai/docs/v2/webhook.create "Manus API v2 webhook.create"

**Consultation date:** 2026-09-25.
