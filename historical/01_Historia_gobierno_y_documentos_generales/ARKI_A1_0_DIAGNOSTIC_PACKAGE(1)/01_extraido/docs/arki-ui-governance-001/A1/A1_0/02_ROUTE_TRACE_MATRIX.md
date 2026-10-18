# Route trace matrix

The source/build trace is deterministic. Route declaration lines are taken from `client/src/App.tsx`; lazy declarations and source modules are derived by `scripts/a1_trace_source_build.py`.

|route|route_declaration|lazy|source|export|chunk|
|---|---|---|---|---|---|
|/arki|App.tsx:79|NOT_LAZY_DECLARATION|NOT_APPLICABLE|NOT_APPLICABLE|NONE|
|/arki-book|App.tsx:84|const ArkiBookPage = lazy(() => import("./pages/ArkiBookPage"))|client/src/pages/ArkiBookPage.tsx|default@137|ArkiBookPage-Dta2P80J.js|
|/arki-device-bridge|App.tsx:98|const ArkiDeviceInteroperabilityPage = lazy(() => import("./pages/ArkiDeviceInteroperabilityPage"))|client/src/pages/ArkiDeviceInteroperabilityPage.tsx|default@18|ArkiDeviceInteroperabilityPage-CcqzlCqa.js|
|/arki-operations|App.tsx:90|const ArkiOperationsPage = lazy(() => import("./pages/ArkiOperationsPage"))|client/src/pages/ArkiOperationsPage.tsx|default@31|ArkiOperationsPage-C3AQbGJE.js|
|/arki-parametric-runtime|App.tsx:91|const ArkiParametricRuntimePage = lazy(() => import("./pages/ArkiParametricRuntimePage"))|client/src/pages/ArkiParametricRuntimePage.tsx|default@61|ArkiParametricRuntimePage-BrOtj3Jh.js|
|/arki-research-review|App.tsx:107|const ArkiResearchReviewPage = lazy(() => import("./pages/ArkiResearchReviewPage"))|client/src/pages/ArkiResearchReviewPage.tsx|default@8|ArkiResearchReviewPage-Ddx7VetF.js|
|/audit|App.tsx:108|NOT_LAZY_DECLARATION|NOT_APPLICABLE|NOT_APPLICABLE|NONE|
|/comparisons|App.tsx:82|const ComparisonsPage = lazy(() => import("./pages/ComparisonsPage"))|client/src/pages/ComparisonsPage.tsx|default@9|ComparisonsPage-lcSh-sJL.js|
|/evaluations|App.tsx:81|const EvaluationsPage = lazy(() => import("./pages/EvaluationsPage"))|client/src/pages/EvaluationsPage.tsx|default@9|EvaluationsPage-D4Is2kpJ.js|
|/help/operations|App.tsx:111|const HelpArticlePage = lazy(() => import("./pages/HelpArticlePage"))|client/src/pages/HelpArticlePage.tsx|default@15|HelpArticlePage-BmQYr8gx.js|
|/help/user|App.tsx:110|const HelpArticlePage = lazy(() => import("./pages/HelpArticlePage"))|client/src/pages/HelpArticlePage.tsx|default@15|HelpArticlePage-BmQYr8gx.js|
|/security-events|App.tsx:106|const SecurityEventsPage = lazy(() => import("./pages/SecurityEventsPage"))|client/src/pages/SecurityEventsPage.tsx|default@7|SecurityEventsPage-BAICttcC.js|
|/sources|App.tsx:87|const SourceLibraryPage = lazy(() => import("./pages/SourceLibraryPage"))|client/src/pages/SourceLibraryPage.tsx|default@13|SourceLibraryPage-BcrHv29H.js|
|/spatial|App.tsx:85|const SpatialViewerPage = lazy(() => import("./pages/SpatialViewerPage"))|client/src/pages/SpatialViewerPage.tsx|default@4|SpatialViewerPage-CYYyj_ii.js|
