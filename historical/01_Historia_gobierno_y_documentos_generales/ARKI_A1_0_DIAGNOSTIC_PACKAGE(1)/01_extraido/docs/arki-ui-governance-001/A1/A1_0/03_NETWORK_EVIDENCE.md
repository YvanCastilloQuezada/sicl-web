# Network evidence

Local canonical production server: `http://127.0.0.1:4001`. Each chunk below was requested directly after the production build and returned `200 OK`, `Content-Type: application/javascript; charset=UTF-8`, `Cache-Control: public, max-age=0`. Browser performance evidence for `/arki-operations` observed the route chunk and its icon dependencies as JavaScript resources; the route later rendered. Browser performance evidence for `/arki-research-review` observed its route chunk and `save` dependency.

|route|chunk|status|content_type|bytes|cache|etag|
|---|---|---|---|---|---|---|
|/arki|NO_REQUEST|UNKNOWN|UNKNOWN|UNKNOWN|UNKNOWN|UNKNOWN|
|/arki-book|ArkiBookPage-Dta2P80J.js|200|application/javascript; charset=UTF-8|62249|public, max-age=0|W/"f329-1a0d5efef95"|
|/arki-device-bridge|ArkiDeviceInteroperabilityPage-CcqzlCqa.js|200|application/javascript; charset=UTF-8|12193|public, max-age=0|W/"2fa1-1a0d5efef95"|
|/arki-operations|ArkiOperationsPage-C3AQbGJE.js|200|application/javascript; charset=UTF-8|14301|public, max-age=0|W/"37dd-1a0d5efef95"|
|/arki-parametric-runtime|ArkiParametricRuntimePage-BrOtj3Jh.js|200|application/javascript; charset=UTF-8|140961|public, max-age=0|W/"226a1-1a0d5efef95"|
|/arki-research-review|ArkiResearchReviewPage-Ddx7VetF.js|200|application/javascript; charset=UTF-8|5115|public, max-age=0|W/"13fb-1a0d5efef95"|
|/audit|NO_REQUEST|UNKNOWN|UNKNOWN|UNKNOWN|UNKNOWN|UNKNOWN|
|/comparisons|ComparisonsPage-lcSh-sJL.js|200|application/javascript; charset=UTF-8|3677|public, max-age=0|W/"e5d-1a0d5efef95"|
|/evaluations|EvaluationsPage-D4Is2kpJ.js|200|application/javascript; charset=UTF-8|4981|public, max-age=0|W/"1375-1a0d5efef95"|
|/help/operations|HelpArticlePage-BmQYr8gx.js|200|application/javascript; charset=UTF-8|297175|public, max-age=0|W/"488d7-1a0d5efef95"|
|/help/user|HelpArticlePage-BmQYr8gx.js|200|application/javascript; charset=UTF-8|297175|public, max-age=0|W/"488d7-1a0d5efef95"|
|/security-events|SecurityEventsPage-BAICttcC.js|200|application/javascript; charset=UTF-8|4300|public, max-age=0|W/"10cc-1a0d5efef95"|
|/sources|SourceLibraryPage-BcrHv29H.js|200|application/javascript; charset=UTF-8|9023|public, max-age=0|W/"233f-1a0d5efef95"|
|/spatial|SpatialViewerPage-CYYyj_ii.js|200|application/javascript; charset=UTF-8|736|public, max-age=0|W/"2e0-1a0d5efef95"|
