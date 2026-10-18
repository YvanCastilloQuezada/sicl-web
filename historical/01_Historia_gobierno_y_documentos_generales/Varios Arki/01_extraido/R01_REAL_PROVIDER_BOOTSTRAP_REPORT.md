# R01 — Real Provider Bootstrap Report

**Orden:** `AB-R01-REAL-PROVIDER-BOOTSTRAP-001`  
**Baseline:** v0.2F / `0.2.0-alpha.8`  
**Baseline ZIP SHA-256:** `5746b6fd38edfb430d139b7739f1c477a0ba9d85eabbbba5ff4b0d61c1490fcd`  
**Fecha:** 2026-09-25

## BASELINE

The baseline version is `0.2.0-alpha.8`. The baseline ZIP hash matches the required SHA-256 exactly. No source, tests, migrations or ARKI files were modified during R0–R1. The workspace is not a Git repository; verification was performed from the project filesystem and baseline hash.

## PRE_FLIGHT

```text
VERSION                         0.2.0-alpha.8
NODE                            v22.13.0
NPM                             10.9.2
BASELINE_ZIP                    MATCH
NPM_TEST                       PASS — 95/95
PROVIDER_CONTRACT_TEST          PASS — 20/20
MOCK_E2E                       PASS — 14/14
NODE_CHECK                      PASS
DEFAULT_PROVIDER_MODE           mock
SECRET_SCAN                     PASS
GIT_REPOSITORY                  NO — filesystem snapshot
ENV_OR_CREDENTIAL_FILES         NONE FOUND
```

No credential value, token, header, response body or secret-bearing artifact was printed or stored in the report.

## R0 — CREDENTIAL BOUNDARY

The session provides a secure environment boundary for the OpenAI credential. The presence of the credential was checked without printing or inspecting its value. No `OPENAI_PROJECT_ID` is configured. No Manus credential is configured in this session.

For Manus, the required safe input status is:

```text
CREDENTIAL_INPUT_REQUIRED
SAFE_INPUT_MECHANISM = secure environment variable or connector-secret injection; Manus credential is not configured in this session
```

The Manus credential was **not requested in chat** and no value was pasted, logged, written to source, reports, tests, database or evidence.

The code remains fail-closed: the default provider mode is `mock`, and a provider credential alone does not activate real traffic.

## OPENAI_R1

One and only one real external OpenAI call was made:

```text
Operation class:  read-only model listing
Endpoint class:  GET /v1/models
HTTP result:     200
Content sent:    none; no project content, ARKI content or Manus result
Review executed: 0
Request ID:      not returned in response headers
```

The HTTP 200 result demonstrates that the credential was accepted by the reachable OpenAI endpoint. It does **not** establish the expected project boundary because `OPENAI_PROJECT_ID` is absent, and it does not provide a captured provider request ID. No generative operation was used to compensate for these gaps.

## MANUS_R1

No real Manus call was made because `MANUS_API_KEY` is not configured. No task, message, webhook, project, file, connector or persistent provider resource was created.

The official Manus documentation confirms that `GET /v2/user.me` is a read-only identity endpoint requiring no OAuth scope and returning the authenticated Manus user ID. It was not called because the credential boundary was unavailable.

```text
MANUS_R1_REQUIRES_R3 = NO
MANUS_R1_BLOCKED_BY_CREDENTIAL = YES
```

## REQUEST_IDS_CAPTURED

```text
OPENAI: NO — response did not return x-request-id
MANUS:  NO — no call was made
```

The client correlation ID was supplied on the OpenAI request, but the provider request ID requirement remains unmet.

## ACCOUNT_PROJECT_MATCH

```text
OPENAI_PROJECT_MATCH = UNKNOWN — OPENAI_PROJECT_ID absent; no project boundary assertion possible
MANUS_ACCOUNT_MATCH  = UNKNOWN — credential absent; user.me not called
```

No identity or project mismatch was detected; neither provider passed the complete identity-boundary test.

## PERMISSIONS

```text
OPENAI = PARTIAL — read-only models listing accepted; future R2 permission not established
MANUS  = UNKNOWN — no credential and no identity call
```

No broader scope was requested, inferred or tested. No task creation permission was exercised.

## SECRET_LEAK_SCAN

```text
SECRET_SCAN      PASS
SECRET_LEAK_SCAN PASS
```

The post-R1 scan covered source, tests, reports, logs, temporary artifacts controlled by the Bridge and SQLite/audit locations available in the workspace. No credential value, Authorization header, Manus API-key header or raw authentication error body was present. The OpenAI response body and header capture were deleted after extracting only status and presence metadata.

## MUTATIONS_CREATED

```text
MANUS_TASKS_CREATED       0
OPENAI_REVIEWS_EXECUTED   0
WEBHOOKS_REGISTERED       0
PROJECTS_CREATED          0
AGENTS_CREATED            0
FILES_CREATED_PROVIDER    0
CONNECTORS_CREATED        0
PERSISTENT_RESOURCES      0
ARKI_MODIFICATIONS        0
```

The only external operation was the single read-only OpenAI model-list request.

## EXTERNAL_CALL_COUNT

```text
OPENAI_REAL_CALLS = 1
MANUS_REAL_CALLS  = 0
TOTAL_EXTERNAL_CALLS = 1
EXTERNAL_MUTATIONS = 0
```

## REGRESSION

Post-R1 validation was completed after returning to the safe default mode:

```text
npm test                    95/95 PASS
npm run test:provider-contract 20/20 PASS
npm run test:mock-e2e       14/14 PASS
node --check                PASS
DEFAULT_PROVIDER_MODE       mock
```

## BLOCKERS

1. `OPENAI_PROJECT_ID` is absent, so expected project/account matching is `UNKNOWN`.
2. OpenAI did not return an `x-request-id`, so the required provider request-ID capture is incomplete.
3. `MANUS_API_KEY` is absent, so Manus R1 identity validation cannot run.
4. No R2 OpenAI architectural review is authorized by this order.
5. No R3 Manus task operation is authorized by this order.

The safe next action for Manus is configuration through a secure environment variable or connector-secret injection, not pasting a credential into chat. The exact secret value is not requested here.

## FINAL CLASSIFICATION

```text
R0_CREDENTIAL_BOUNDARY_READY        YES
OPENAI_R1_IDENTITY_VERIFIED         PARTIAL
MANUS_R1_IDENTITY_VERIFIED          NO

OPENAI_REAL_CALLS                   1
MANUS_REAL_CALLS                    0

MANUS_TASKS_CREATED                 0
OPENAI_REVIEWS_EXECUTED             0
WEBHOOKS_REGISTERED                 0
ARKI_MODIFICATIONS                  0

SECRET_LEAK_SCAN                    PASS
PROVIDER_MODE_RETURNED_TO_MOCK      YES

READY_FOR_R2_OPENAI                 NO
READY_FOR_R3_MANUS                  NO
```

`READY` is not authorization. R2 and R3 remain blocked by the explicit Decision Lock and by incomplete identity-boundary evidence.

## STOP

R0–R1 ended here. No R2, R3, webhook registration, task creation, architectural review, ARKI connection or deployment was performed.

## Source consulted

[1]: https://open.manus.ai/docs/v2/user.me "Manus API v2 user.me read-only identity endpoint"

**Consultation date:** 2026-09-25.
