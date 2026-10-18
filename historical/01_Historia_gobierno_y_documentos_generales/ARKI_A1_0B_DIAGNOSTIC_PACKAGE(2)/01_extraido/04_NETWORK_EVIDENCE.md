# Network evidence

The A1.0 source/build evidence was preserved: each of the 12 direct lazy targets has a generated JavaScript chunk returning HTTP 200 with `application/javascript; charset=UTF-8`; this is not reinterpreted as proof of module evaluation. During A1.0B the browser resource list showed the route chunks for observed routes. No 404/500, MIME error or dynamic-import rejection was captured.

Representative current resource observations are preserved under `evidence/console/` and the inherited A1.0 raw evidence. A1.0B does not declare global network health from one route.
