# Route migration map — F0

The canonical ARKI shell is now the shared surface for secondary routes. The root workspace remains the project workspace because it already contains the project-state interaction model. `/arki` remains an alias. No capability was silently removed.

| Route | Existing component | Decision | Runtime state | Note |
|---|---|---|---|---|
| `/` | `HashWorkspaceRoute` | KEEP | `CORE_BLOCKED` | Route rendered a meaningful shell but its canonical Core-dependent data path returned 503. |
| `/404` | `NotFound` | KEEP | `RENDERED_404` | Not-found screen rendered. |
| `/ar-lu-orchestrator` | `ArLuOrchestratorPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki` | `HashWorkspaceRoute` | KEEP | `CORE_BLOCKED` | Route rendered a meaningful shell but its canonical Core-dependent data path returned 503. |
| `/arki-bim-visor` | `ArkiBimViewerPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-book` | `ArkiBookPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-design-funnel` | `ArkiDesignFunnelPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-device-bridge` | `ArkiDeviceInteroperabilityPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-family-studio` | `ArkiFamilyStudioPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-generator` | `ArkiGeneratorPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-host-connections` | `ArkiHostConnectionsPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-marketplace` | `ArkiMarketplacePage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-operations` | `ArkiOperationsPage` | KEEP | `BLOCKED_LAZY` | Snapshot captured the shared lazy-loading fallback; meaningful render not observed in the capture window. |
| `/arki-parametric-runtime` | `ArkiParametricRuntimePage` | KEEP | `BLOCKED_LAZY` | Snapshot captured the shared lazy-loading fallback; meaningful render not observed in the capture window. |
| `/arki-research-review` | `ArkiResearchReviewPage` | KEEP | `BLOCKED_LAZY` | Snapshot captured the shared lazy-loading fallback; meaningful render not observed in the capture window. |
| `/arki-self-care` | `ArkiSelfCarePage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-super-architect` | `ArkiSuperArchitectViewerPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/arki-tv` | `ArkiTvPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/audit` | `AuditRoute` | KEEP | `BLOCKED_LAZY` | Snapshot captured the shared lazy-loading fallback; meaningful render not observed in the capture window. |
| `/comparisons` | `ComparisonsPage` | KEEP | `CORE_BLOCKED` | Route rendered a meaningful shell but its canonical Core-dependent data path returned 503. |
| `/control-center` | `ArkiControlCenterPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/evaluations` | `EvaluationsPage` | KEEP | `CORE_BLOCKED` | Route rendered a meaningful shell but its canonical Core-dependent data path returned 503. |
| `/evidence` | `EvidencePage` | KEEP | `CORE_BLOCKED` | Route rendered a meaningful shell but its canonical Core-dependent data path returned 503. |
| `/federated-handoffs` | `FederatedHandoffInboxPage` | KEEP | `UNKNOWN` | No deterministic classification from preserved page text. |
| `/field` | `FieldModePage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/help` | `HelpPage` | KEEP | `BLOCKED_LAZY` | Snapshot captured the shared lazy-loading fallback; meaningful render not observed in the capture window. |
| `/help/commands` | `HelpArticlePage` | KEEP | `BLOCKED_LAZY` | Snapshot captured the shared lazy-loading fallback; meaningful render not observed in the capture window. |
| `/help/operations` | `HelpArticlePage` | KEEP | `BLOCKED_LAZY` | Snapshot captured the shared lazy-loading fallback; meaningful render not observed in the capture window. |
| `/help/user` | `HelpArticlePage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/luka-control-center` | `LucaControlCenterPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/multiobjective` | `MultiobjectivePage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/parametric-files` | `ParametricFilesPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/security-events` | `SecurityEventsPage` | KEEP | `RENDERED` | Meaningful route content and controls were observed. |
| `/sources` | `SourceLibraryPage` | KEEP | `UNKNOWN` | No deterministic classification from preserved page text. |
| `/spatial` | `SpatialViewerPage` | KEEP | `BLOCKED_LAZY` | Snapshot captured the shared lazy-loading fallback; meaningful render not observed in the capture window. |
| `/spatial-comparison` | `SpatialComparisonPage` | KEEP | `CORE_BLOCKED` | Route rendered a meaningful shell but its canonical Core-dependent data path returned 503. |
