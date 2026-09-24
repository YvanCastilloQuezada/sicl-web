# ARKI UI Visual Atlas — A0.R2

**Runtime:** production `node dist/index.js`, port `4001`, source HEAD `ccdc6d95`.

The historical A0-V captures remain preserved under `A0/PO_VISUAL_REVIEW/` and are valid evidence for the 3002 development runtime. This atlas is the production-runtime baseline. It does not fabricate screens for lazy-route, authentication, 503 or 404 states.

## Runtime baseline

The browser reached `data-arki-boot-stage=REACT_MOUNTED` on the canonical production preview. Design Funnel rendered its S1/S2 panels and architectural modes. The browser console was not treated as proof of route functionality; route state and visual evidence were recorded independently.

## Route registry

| Route | Classification | Evidence | Screenshot |
|---|---|---|---|
| `/` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_spatial.md` | `root.webp` |
| `/arki` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki.md` | `arki.webp` |
| `/evidence` | `USER_FACING_BLOCKED` | Screen rendered; canonical Core dependency is disconnected and fail-closed. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_evidence.md` | `evidence.webp` |
| `/evaluations` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_evaluations.md` | `evaluations.webp` |
| `/comparisons` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_comparisons.md` | `comparisons.webp` |
| `/multiobjective` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_multiobjective.md` | `multiobjective.webp` |
| `/arki-book` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-book.md` | `arki-book.webp` |
| `/spatial` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_spatial.md` | `spatial.webp` |
| `/spatial-comparison` | `DEPENDENCY_BLOCKED` | Route rendered an explicit Core/spatial dependency 503 state. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_spatial-comparison.md` | `spatial-comparison.webp` |
| `/sources` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_sources.md` | `sources.webp` |
| `/control-center` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_control-center.md` | `control-center.webp` |
| `/parametric-files` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_parametric-files.md` | `parametric-files.webp` |
| `/arki-operations` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-operations.md` | `arki-operations.webp` |
| `/arki-parametric-runtime` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-parametric-runtime.md` | `arki-parametric-runtime.webp` |
| `/arki-generator` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-generator.md` | `arki-generator.webp` |
| `/arki-family-studio` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-family-studio.md` | `arki-family-studio.webp` |
| `/arki-super-architect` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-super-architect.md` | `arki-super-architect.webp` |
| `/arki-design-funnel` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-design-funnel_r2prod_2.md` | `arki-design-funnel.webp` |
| `/arki-bim-visor` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-bim-visor.md` | `arki-bim-visor.webp` |
| `/arki-host-connections` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-host-connections.md` | `arki-host-connections.webp` |
| `/arki-device-bridge` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-device-bridge.md` | `arki-device-bridge.webp` |
| `/luka-control-center` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_luka-control-center.md` | `luka-control-center.webp` |
| `/federated-handoffs` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `UNKNOWN` | `federated-handoffs.webp` |
| `/arki-tv` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-tv.md` | `arki-tv.webp` |
| `/ar-lu-orchestrator` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_ar-lu-orchestrator.md` | `ar-lu-orchestrator.webp` |
| `/arki-marketplace` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-marketplace.md` | `arki-marketplace.webp` |
| `/arki-self-care` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-self-care.md` | `arki-self-care.webp` |
| `/field` | `USER_FACING_BLOCKED` | Screen rendered; canonical Core dependency is disconnected and fail-closed. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_field.md` | `field.webp` |
| `/security-events` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_security-events.md` | `security-events.webp` |
| `/arki-research-review` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-research-review.md` | `arki-research-review.webp` |
| `/audit` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_audit_audit.md` | `audit.webp` |
| `/help` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_help_user.md` | `help.webp` |
| `/help/user` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_help_user.md` | `help_user.webp` |
| `/help/operations` | `DEPENDENCY_BLOCKED` | React mounted but the route remained in Suspense lazy-module fallback. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_help_operations.md` | `help_operations.webp` |
| `/help/commands` | `USER_FACING_REACHABLE` | Meaningful user-facing screen rendered in production runtime 4001. | `UNKNOWN` | `help_commands.webp` |
| `/404` | `NOT_USER_FACING` | Explicit 404 utility route. | `4001-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_404.md` | `404.webp` |
| `__fallback__` | `NOT_USER_FACING` | Catch-all route; not a declared user-facing path. | `UNKNOWN` | `__fallback__.webp` |
| `__fallback_2__` | `NOT_USER_FACING` | Catch-all route; not a declared user-facing path. | `UNKNOWN` | `__fallback_2__.webp` |

## Major screen review

| Screen | Primary object/action | Evidence-based finding | Helps an architect decide? |
|---|---|---|---|
| First Contact (`/`, `/arki`) | Choose intent, scan QR, continue | Clear entry choices and Spanish default; Core remains visibly unconfigured. | YES |
| Design Funnel (`/arki-design-funnel`) | Compare P1–P16, inspect cost and architectural views | Three-column cost/architecture/context model is visible; human selection gate is explicit. | YES |
| Family Studio | Configure family, variant, area, capacity and city | Three synchronized viewers and deterministic generation controls are visible. | YES |
| BIM Viewer | Inspect ARK/IFC and run coordination checks | Format capabilities and MEP review gate are visible; specialist validation remains explicit. | YES |
| Field Mode | Capture observation and permissions | Fail-closed behavior is clear when Core/session is unavailable. | YES |
| AR-LU Orchestrator | Review agents, frozen ideas and providers | Federated separation and authority gates are visible. | YES |
| Lazy-route fallback | Await route module | The screen does not help the architect until the dependency resolves. | NO |
| Spatial comparison 503 | Explain missing Core spatial transport | The explicit non-fabrication message is useful, but the tool is unavailable. | NO |

## Visual interpretation

The production baseline confirms a minimalist dark professional interface, Spanish-first content on the main user-facing screens, persistent authority gates and visible UNKNOWN/blocked states. The baseline also preserves unfinished screens rather than beautifying them.
