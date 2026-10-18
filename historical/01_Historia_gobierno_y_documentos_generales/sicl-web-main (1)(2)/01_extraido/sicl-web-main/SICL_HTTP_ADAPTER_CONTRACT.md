# SICL Core HTTP Adapter Contract

## Purpose

`sicl-web` is a client of the SICL Core. The Python core remains the sole authority for domain validation, Council analysis, Recommendation creation, HumanReview persistence and Decision persistence. The HTTP service is an anti-corruption boundary; it must not expose authentication tokens to the core or reproduce domain rules in TypeScript.

## Version

The current contract version is `sicl-core-http/0.2`. Every response includes `contract_version`, `project_id`, and `observed_version` where a project snapshot is involved. Version 0.2 adds optional `spatial_scope` and `temporal_scope` fields to `POST /v1/projects`; clients that omit them remain valid.

## Authentication boundary

The web server authenticates the browser session. The adapter service receives a service-to-service credential only through server-side configuration. Browser cookies, OAuth tokens, JWTs and raw identity assertions never cross into the domain payload.

## Project scope

`spatial_scope` contains `scale`, `id`, `name` and an optional `parent_id`. Supported scales are `PROJECT`, `SECTOR`, `DISTRICT`, `CITY`, `METROPOLITAN_AREA`, `REGION`, `MACROREGION` and `COUNTRY`. `temporal_scope` contains a `horizon` of `PRESENT`, `2030`, `2040` or `2050` and an optional `scenario`. These fields frame the evidence and analysis; they do not create forecasts, winners or authority.

## Read operations

`GET /v1/projects/{project_id}/snapshot` returns the canonical persisted snapshot from the core.

`POST /v1/projects/{project_id}/council/analyze` is read-only. It accepts an explicit `observed_version` and a declared analysis request. It returns Council findings, comparisons, diagnostics and statuses. It must never create Recommendation, HumanReview or Decision records.

## Human-boundary operations

`POST /v1/projects/{project_id}/recommendations` accepts an explicit recommendation payload and expected project version. The core validates source, reason, based-on reference and recommendation version.

`POST /v1/projects/{project_id}/human-reviews` accepts actor, confirmation, reason, observed version and recommendation version. The core validates all references and performs optimistic concurrency control.

`POST /v1/projects/{project_id}/decisions/prepare` is read-only and returns a durable-write preview. It does not append an event.

`POST /v1/projects/{project_id}/decisions` requires a verified human authority context, observed version, actor, authority basis, confirmation and rationale. The core alone may append the durable Decision and event.

## Error mapping

The adapter preserves core errors without translating them into success responses. `409` represents optimistic concurrency failure, `422` represents a domain contract violation, `403` represents insufficient authenticated access, and `404` represents a missing project or reference.

## Non-negotiable invariants

Council cannot write authority records. Authentication cannot become authority by itself. A Recommendation cannot become a Decision implicitly. Every durable write includes an observed version and append-only event identity. The adapter does not accept or return secrets.
