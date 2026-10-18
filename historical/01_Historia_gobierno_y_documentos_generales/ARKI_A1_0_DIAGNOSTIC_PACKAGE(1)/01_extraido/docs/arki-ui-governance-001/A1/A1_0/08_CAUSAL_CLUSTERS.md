# Causal clusters

| Cluster | Routes | Classification | Evidence | Confidence |
|---|---|---|---|---|
| Lazy resolution latency / observation window | `/arki-book`, `/arki-operations`, `/arki-research-review`, and likely peers | `SUSPENSE_NEVER_RESOLVES` is rejected for representatives; `PROXY_FAILURE`/late resolution remains probable | Chunks return 200; `/arki-operations` and `/arki-book` render after waiting; `/arki-research-review` renders after ~6.5s but remains fallback at 2s | PROBABLE, not confirmed as universal |
| A0 route-label mismatch / nested lazy chain | `/arki`, `/audit` | `ROUTE_CONFIGURATION_DEFECT` is not asserted; A0 label is incomplete relative to App.tsx | Direct route declarations use `HashWorkspaceRoute`/`AuditRoute`; no direct lazy declaration | CONFIRMED as a trace-shape fact, not as product defect |
| Core-dependent route | `/spatial` | `BLOCKED_CORE` outside A1.0 | Route UI renders `Core spatial representation unavailable (503)` after chunk 200 | CONFIRMED as boundary, excluded from lazy RCA |
| Auth/proxy or unobserved lazy state | `/sources` and remaining unverified targets | `UNKNOWN` | One navigation redirected to Manus auth; no route-specific clean console/evaluation chain was captured | UNKNOWN |
