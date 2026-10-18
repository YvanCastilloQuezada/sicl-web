# ARKI Frontend F0 — Gate A inventory and snapshot

> Scope: **read-only inventory and visual/runtime snapshot**. No product source, Core, authentication, permissions, or data was changed.

- Captured: `2026-09-25T01:30:25.378685+00:00`
- Branch: `refactor/arki-frontend-clean-v1`
- Runtime: `https://4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer`
- Unique route entries: **36**

## Runtime classification

| Status | Count | Meaning |
|---|---:|---|
| `BLOCKED_LAZY` | 8 | Shared lazy-loading fallback remained visible during capture. |
| `CORE_BLOCKED` | 6 | Screen rendered but canonical Core data path returned 503. |
| `RENDERED` | 19 | Meaningful screen and controls observed. |
| `RENDERED_404` | 1 | Not-found screen observed. |
| `UNKNOWN` | 2 | Insufficient deterministic evidence. |

## Route matrix

| Route | Component | Declared | Status | Evidence |
|---|---|---:|---|---|
| `/` | `HashWorkspaceRoute` | YES | `CORE_BLOCKED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_.md` |
| `/404` | `NotFound` | YES | `RENDERED_404` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_404.md` |
| `/ar-lu-orchestrator` | `ArLuOrchestratorPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_ar-lu-orchestrator.md` |
| `/arki` | `HashWorkspaceRoute` | YES | `CORE_BLOCKED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki.md` |
| `/arki-bim-visor` | `ArkiBimViewerPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-bim-visor.md` |
| `/arki-book` | `ArkiBookPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-book.md` |
| `/arki-design-funnel` | `ArkiDesignFunnelPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-design-funnel.md` |
| `/arki-device-bridge` | `ArkiDeviceInteroperabilityPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-device-bridge.md` |
| `/arki-family-studio` | `ArkiFamilyStudioPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-family-studio.md` |
| `/arki-generator` | `ArkiGeneratorPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-generator.md` |
| `/arki-host-connections` | `ArkiHostConnectionsPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-host-connections.md` |
| `/arki-marketplace` | `ArkiMarketplacePage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-marketplace.md` |
| `/arki-operations` | `ArkiOperationsPage` | YES | `BLOCKED_LAZY` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-operations.md` |
| `/arki-parametric-runtime` | `ArkiParametricRuntimePage` | YES | `BLOCKED_LAZY` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-parametric-runtime.md` |
| `/arki-research-review` | `ArkiResearchReviewPage` | YES | `BLOCKED_LAZY` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-research-review.md` |
| `/arki-self-care` | `ArkiSelfCarePage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-self-care.md` |
| `/arki-super-architect` | `ArkiSuperArchitectViewerPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-super-architect.md` |
| `/arki-tv` | `ArkiTvPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_arki-tv.md` |
| `/audit` | `AuditRoute` | YES | `BLOCKED_LAZY` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_audit_audit.md` |
| `/comparisons` | `ComparisonsPage` | YES | `CORE_BLOCKED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_comparisons.md` |
| `/control-center` | `ArkiControlCenterPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_control-center.md` |
| `/evaluations` | `EvaluationsPage` | YES | `CORE_BLOCKED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_evaluations.md` |
| `/evidence` | `EvidencePage` | YES | `CORE_BLOCKED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_evidence.md` |
| `/federated-handoffs` | `FederatedHandoffInboxPage` | YES | `UNKNOWN` | `none` |
| `/field` | `FieldModePage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_field.md` |
| `/help` | `HelpPage` | YES | `BLOCKED_LAZY` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_help.md` |
| `/help/commands` | `HelpArticlePage` | YES | `BLOCKED_LAZY` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_help_commands.md` |
| `/help/operations` | `HelpArticlePage` | YES | `BLOCKED_LAZY` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_help_operations.md` |
| `/help/user` | `HelpArticlePage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_help_user.md` |
| `/luka-control-center` | `LucaControlCenterPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_luka-control-center.md` |
| `/multiobjective` | `MultiobjectivePage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_multiobjective.md` |
| `/parametric-files` | `ParametricFilesPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_parametric-files.md` |
| `/security-events` | `SecurityEventsPage` | YES | `RENDERED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_security-events.md` |
| `/sources` | `SourceLibraryPage` | YES | `UNKNOWN` | `none` |
| `/spatial` | `SpatialViewerPage` | YES | `BLOCKED_LAZY` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_spatial.md` |
| `/spatial-comparison` | `SpatialComparisonPage` | YES | `CORE_BLOCKED` | `4003-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer_spatial-comparison.md` |

## Key findings

- The root workspace, BIM visor, design funnel, family studio, generator, Control Center, Field Mode, LUKA panel, multiobjective view, parametric files, security events, and several Core-backed screens rendered meaningful content in the snapshot.
- `/arki-operations`, `/arki-parametric-runtime`, `/arki-research-review`, `/help`, `/help/commands`, `/help/operations`, `/audit`, `/spatial`, and `/federated-handoffs` require follow-up because the capture preserved a lazy-loading or synchronization fallback.
- `/comparisons`, `/evaluations`, and `/evidence` rendered their forms while reporting the canonical Core as unavailable (HTTP 503).
- Authentication redirects were preserved as evidence. No bypass or credential handling was performed.
- The WebDev checkpoint remains pending because of ten pre-existing PNG files larger than 1 MB. They were not moved, deleted, uploaded, or modified.

## Gate A decision

**PASS WITH BLOCKERS**: the existing frontend is sufficiently inventoried to begin a future redesign, but reconstruction must remain stopped until a later gate explicitly approves product changes and the checkpoint/media policy is resolved.
