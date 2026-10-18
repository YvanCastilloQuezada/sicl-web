# Pre-repair root-cause resolution

The browser trace followed the required chain: route → component → lazy/dynamic import → chunk response → module evaluation → providers/hooks → auth/data/Core → Suspense → mount.

| Route | Observed chain and stopping point | Classification |
|---|---|---|
| `/arki-book` | `App.tsx` lazy route → `ArkiBookPage` chunk (HTTP-loaded) → component mounted; visible `ARKI · LIBRO VIVO` and chapter content | `OTHER_CONFIRMED` resolved as rendered |
| `/arki-research-review` | lazy chunk loaded → `DashboardLayout` mounted → `research.candidates` returns permission message; page remains usable | `AUTH_DEPENDENCY` / controlled permission response |
| `/help/operations` | shared `HelpArticlePage` chunk loaded → Markdown module initialized → long manual rendered after ~20s cold observation | `OTHER_CONFIRMED` slow render, not lazy failure |
| `/security-events` | chunk loaded → route mounted → `security.recentEvents` returns permission/unavailable message | `AUTH_DEPENDENCY` / controlled response |
| `/sources` | navigation reaches authentication redirect to `manus.im/app-auth`; no lazy rejection | `AUTH_DEPENDENCY` |
| `/spatial` | `SpatialViewerPage` and `UPAO001SpatialViewer` resolve; page explicitly shows `Spatial representation unavailable` and `Core ... (503)` | `CORE_DEPENDENCY_FAILURE` |

Resource evidence shows the relevant lazy chunks download with successful HTTP responses. No 404, export mismatch, evaluation exception, or silent module rejection was reproduced. Consequently no repair was safe or necessary.
