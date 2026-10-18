# Module evaluation matrix

The distinction below is intentional: a `200` response proves transport, not parse/evaluation/export/render.

|route|chunk_requested|chunk_downloaded|HTTP|parsed|module_evaluated|export|component_rendered|suspense|
|---|---|---|---|---|---|---|---|---|
|/arki-operations|YES|YES|200|NOT_DIRECTLY_INSTRUMENTED|YES (meaningful UI rendered after wait)|YES (component rendered)|YES|RESOLVED after wait|
|/arki-book|YES|YES|200|NOT_DIRECTLY_INSTRUMENTED|YES (full page observed)|YES|YES|RESOLVED|
|/arki-research-review|YES|YES|200|NOT_DIRECTLY_INSTRUMENTED|YES after ~6.5s|YES|YES after ~6.5s|Fallback after 2s; resolved after longer wait|
|/arki|N/A direct route; nested Home lazy|NOT ISOLATED|N/A|UNKNOWN|YES (Home rendered)|YES nested|YES|Resolved|
|/audit|N/A direct route; nested Home lazy|NOT ISOLATED|N/A|UNKNOWN|UNKNOWN in A1.0|UNKNOWN|Immediate fallback observed|UNKNOWN|
|/spatial|YES|YES|200|UNKNOWN|YES enough to show Core 503|YES enough to render fallback|YES route fallback|RESOLVED; business/Core block|
