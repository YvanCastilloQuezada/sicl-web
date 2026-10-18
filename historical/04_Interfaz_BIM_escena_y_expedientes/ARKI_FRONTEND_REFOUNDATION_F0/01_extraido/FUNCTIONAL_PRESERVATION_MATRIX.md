# Functional preservation matrix — F0

| Capability | Existing source | New surface | Status | Boundary |
|---|---|---|---|---|
| Project context and version | `AppHeader.tsx`, `ProjectWorkspace.tsx` | `AppHeader` in canonical shell | PRESERVED | Backend authority unchanged |
| Human authority and MANIAC gates | Existing page contracts and state | Visible status/context rail | PRESERVED | No automatic decision introduced |
| Design Funnel N → 16 → 4 → 1 | `ArkiDesignFunnelPage.tsx` | `/arki-design-funnel` | PRESERVED | Human selection remains required |
| Cost provenance and UNKNOWNs | `shared/arkiCostBudgetS2.ts` and page | Design Funnel | PRESERVED | Estimates remain estimates |
| BIM / IFC coordination | `ArkiBimViewerPage.tsx` | `/arki-bim-visor` | PRESERVED | Host-dependent formats remain explicit |
| Parametric generation | `ArkiGeneratorPage.tsx`, `ArkiFamilyStudioPage.tsx` | Generation workspace group | PRESERVED | No geometry engine rewrite |
| Field and spatial workflows | `FieldModePage.tsx`, `SpatialViewerPage.tsx` | Project workspace group | PRESERVED | Core availability remains visible |
| Knowledge and research | `ArkiBookPage.tsx`, `SourceLibraryPage.tsx` | Knowledge workspace group | PRESERVED | External knowledge remains untrusted data |
| AR–LU federation | Existing orchestrator and handoff pages | Ecosystem workspace group | PRESERVED | Handoffs remain traceable |
| Authentication | `useAuth`, Manus OAuth | Shell gate | PRESERVED | No bypass or cookie manipulation |
