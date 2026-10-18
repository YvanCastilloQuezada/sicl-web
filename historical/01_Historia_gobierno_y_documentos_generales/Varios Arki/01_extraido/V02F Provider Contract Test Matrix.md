# V02F Provider Contract Test Matrix

**Execution date:** 2026-09-25. **Transport:** fake HTTP only. **External network:** 0.

| ID | Contract scenario | Test | Result |
|---|---|---|---|
| O-01 | Provider mode defaults to mock | `provider mode defaults to mock...` | PASS |
| O-02 | Missing/placeholder credentials fail closed | same test | PASS |
| O-03 | Secret redaction | `secret redaction removes bearer...` | PASS |
| O-04 | OpenAI real adapter disabled by default | `OpenAI adapter is disabled...` | PASS |
| O-05 | Strict successful response | `OpenAI successful strict response...` | PASS |
| O-06 | Refusal | `OpenAI refusal is non-executable` | PASS |
| O-07 | Malformed JSON | `OpenAI malformed JSON...` | PASS |
| O-08 | Schema violation | `OpenAI malformed JSON and schema violations...` | PASS |
| O-09 | Unexpected tool request | `OpenAI unexpected tool request...` | PASS |
| O-10 | 401 | `OpenAI 401 is sanitized...` | PASS |
| O-11 | 429 | `OpenAI 401 is sanitized and 429/5xx...` | PASS |
| O-12 | 5xx and bounded retry | same test | PASS |
| O-13 | Timeout/ambiguous network | `OpenAI timeout produces...` | PASS |
| O-14 | Response/request IDs and usage | `OpenAI successful strict response...` | PASS |
| M-01 | Manus task.create/detail/listMessages/sendMessage | `Manus real adapter supports...` | PASS |
| M-02 | Manus disabled by default | `Manus real adapter is disabled...` | PASS |
| M-03 | Omitted background state remains unknown | `Manus task lifecycle preserves...` | PASS |
| M-04 | Cursor pagination | `Manus adapter handles cursor pagination...` | PASS |
| M-05 | Request IDs | same pagination test | PASS |
| M-06 | 401 | `Manus adapter maps 401...` | PASS |
| M-07 | 429/5xx bounded transient | same error test | PASS |
| M-08 | Ambiguous timeout | `Manus ambiguous network timeout...` | PASS |
| M-09 | Waiting/stopped state payloads | `Manus waiting and stopped...` | PASS |
| K-01 | Public key fetch | `Manus public key cache...` | PASS |
| K-02 | Cache hit | same cache test | PASS |
| K-03 | Forced refresh | same cache test | PASS |
| K-04 | Sanitized key-fetch failure | `Manus public key cache sanitizes...` | PASS |
| W-01 | Envelope event/task identity | `Manus webhook envelope validates...` | PASS |
| W-02 | Malformed envelope rejection | same envelope test | PASS |
| W-03 | RSA-SHA256 valid vector | `Manus RSA-SHA256 signature vector...` | PASS |
| W-04 | Replay timestamp rejection | same signature test | PASS |
| R-01 | Full regression | `npm test` | 95/95 PASS |
| R-02 | Previous Mock E2E | `npm run test:mock-e2e` | 14/14 PASS |
| R-03 | Syntax | `node --check` all modules | PASS |

## Interpretation

These results verify local contract behavior and composition with fake transports. They do not verify provider availability, credential validity, live endpoint behavior, provider idempotency or real webhook delivery. The correct maximum claim is `REAL_ADAPTER_CODE_VERIFIED_LOCAL`.

## References

[1]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 webhook security"
[2]: https://developers.openai.com/api/docs/guides/structured-outputs "OpenAI Structured Outputs"

**Execution date:** 2026-09-25.
