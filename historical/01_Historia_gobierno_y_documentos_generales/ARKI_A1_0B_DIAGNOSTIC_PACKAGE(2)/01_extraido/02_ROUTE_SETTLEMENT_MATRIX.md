# Route settlement matrix

| ROUTE | ROUTE_TYPE | EXPECTED_CHUNK | MEANINGFUL_RENDER | FINAL_CLASSIFICATION | AUTH_REDIRECT | CORE_DEPENDENCY_ERROR | NOTES |
|---|---|---|---|---|---|---|---|
|/arki|NESTED_LAZY|UNKNOWN|TRUE|RENDERED_NORMAL|FALSE|FALSE|marker: Hola. Soy ARKI, tu asistente de arquitectura.|
|/arki-book|DIRECT_LAZY|ArkiBookPage-Dta2P80J.js|UNKNOWN|UNKNOWN|FALSE|FALSE|marker: Libro Vivo; fallback remained at 2/5/10/15 s in A1.0B run|
|/arki-device-bridge|DIRECT_LAZY|ArkiDeviceInteroperabilityPage-CcqzlCqa.js|TRUE|RENDERED_NORMAL|FALSE|FALSE|marker: Un teléfono, muchas herramientas|
|/arki-operations|DIRECT_LAZY|ArkiOperationsPage-C3AQbGJE.js|TRUE|RENDERED_NORMAL|FALSE|FALSE|marker: Manual + laboratorio de comandos|
|/arki-parametric-runtime|DIRECT_LAZY|ArkiParametricRuntimePage-BrOtj3Jh.js|UNKNOWN|BLOCKED_AUTH|TRUE|FALSE|fallback followed by navigation to Manus auth during observation|
|/arki-research-review|DIRECT_LAZY|ArkiResearchReviewPage-Ddx7VetF.js|UNKNOWN|UNKNOWN|FALSE|FALSE|fallback observed; no rejection; prior A1.0 render evidence preserved separately|
|/audit|NESTED_LAZY|NONE|TRUE|RENDERED_NORMAL|FALSE|FALSE|synchronous container plus nested workspace rendered|
|/comparisons|DIRECT_LAZY|ComparisonsPage-lcSh-sJL.js|TRUE|BLOCKED_CORE|FALSE|TRUE|route rendered; Core HTTP 503|
|/evaluations|DIRECT_LAZY|EvaluationsPage-D4Is2kpJ.js|TRUE|BLOCKED_CORE|FALSE|TRUE|route rendered; Core HTTP 503|
|/help/operations|DIRECT_LAZY|HelpArticlePage-BmQYr8gx.js|UNKNOWN|UNKNOWN|FALSE|FALSE|fallback remained at 2/5/10/15 s|
|/help/user|DIRECT_LAZY|HelpArticlePage-BmQYr8gx.js|TRUE|RENDERED_NORMAL|FALSE|FALSE|marker: Manual de Usuario de ARKI y SICL|
|/security-events|DIRECT_LAZY|SecurityEventsPage-BAICttcC.js|UNKNOWN|UNKNOWN|FALSE|FALSE|fallback observed; no positive failure evidence|
|/sources|DIRECT_LAZY|SourceLibraryPage-BcrHv29H.js|UNKNOWN|UNKNOWN|FALSE|FALSE|fallback observed in this pass; prior auth redirect is not reclassified as lazy failure|
|/spatial|DIRECT_LAZY|SpatialViewerPage-CYYyj_ii.js|UNKNOWN|UNKNOWN|FALSE|FALSE|fallback observed in this pass; prior Core evidence remains historical|
