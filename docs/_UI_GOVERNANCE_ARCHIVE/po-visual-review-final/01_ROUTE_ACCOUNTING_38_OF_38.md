# Route accounting — 38 of 38

A0.R3 accounts for exactly 38 entries. The two `UNKNOWN_FALLBACK` entries are retained because A0's canonical route map explicitly included them; they are not user-facing routes.

| Screen ID | Route | Primary classification | Evidence finding | Source trace |
|---|---|---|---|---|
| R3-001 | `/` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 78 |
| R3-002 | `/404` | `NOT_USER_FACING` | The declared path rendered the product 404 screen. | src line 113 |
| R3-003 | `/ar-lu-orchestrator` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 102 |
| R3-004 | `/arki` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 79 |
| R3-005 | `/arki-bim-visor` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 96 |
| R3-006 | `/arki-book` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 84 |
| R3-007 | `/arki-design-funnel` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 95 |
| R3-008 | `/arki-device-bridge` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 98 |
| R3-009 | `/arki-family-studio` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 93 |
| R3-010 | `/arki-generator` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 92 |
| R3-011 | `/arki-host-connections` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 97 |
| R3-012 | `/arki-marketplace` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 103 |
| R3-013 | `/arki-operations` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 90 |
| R3-014 | `/arki-parametric-runtime` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 91 |
| R3-015 | `/arki-research-review` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 107 |
| R3-016 | `/arki-self-care` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 104 |
| R3-017 | `/arki-super-architect` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 94 |
| R3-018 | `/arki-tv` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 101 |
| R3-019 | `/audit` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 108 |
| R3-020 | `/comparisons` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 82 |
| R3-021 | `/control-center` | `NOT_IMPLEMENTED` | The declared path rendered the product 404 screen. | src line 88 |
| R3-022 | `/evaluations` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 81 |
| R3-023 | `/evidence` | `BLOCKED_CORE` | The screen rendered in fail-closed mode because canonical Core/session state is unavailable. | src line 80 |
| R3-024 | `/federated-handoffs` | `UNKNOWN` | No route-specific page-text artifact is available for this route. | src line 100 |
| R3-025 | `/field` | `BLOCKED_CORE` | The screen rendered in fail-closed mode because canonical Core/session state is unavailable. | src line 105 |
| R3-026 | `/help` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 109 |
| R3-027 | `/help/commands` | `UNKNOWN` | No route-specific page-text artifact is available for this route. | src line 112 |
| R3-028 | `/help/operations` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 111 |
| R3-029 | `/help/user` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 110 |
| R3-030 | `/luka-control-center` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 99 |
| R3-031 | `/multiobjective` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 83 |
| R3-032 | `/parametric-files` | `RENDERED` | Meaningful route-specific screen rendered in the production 4001 evidence set. | src line 89 |
| R3-033 | `/security-events` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 106 |
| R3-034 | `/sources` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 87 |
| R3-035 | `/spatial` | `BLOCKED_LAZY` | React shell rendered but Suspense remained in the lazy-module fallback. | src line 85 |
| R3-036 | `/spatial-comparison` | `BLOCKED_CORE` | The route rendered an explicit unavailable/Core spatial state. | src line 86 |
| R3-037 | `UNKNOWN_FALLBACK_1` | `NOT_USER_FACING` | Catch-all fallback declared by the route map; not a user-facing route. | src line 115 |
| R3-038 | `UNKNOWN_FALLBACK_2` | `NOT_USER_FACING` | Catch-all fallback declared by the route map; not a user-facing route. | src line 115 |

## Reconciliation

The previous 15 rendered + 20 blocked summary did not expose the three non-user-facing/unknown accounting rows. A0.R3 retains all 38 and distinguishes `NOT_USER_FACING`, `NOT_IMPLEMENTED`, `UNKNOWN`, `BLOCKED_LAZY`, `BLOCKED_CORE`, and `RENDERED`.
