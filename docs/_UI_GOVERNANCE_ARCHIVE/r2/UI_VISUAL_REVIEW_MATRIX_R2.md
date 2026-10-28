# A0.R2 Visual Review Matrix

| Area | Runtime state | Finding | Classification |
|---|---|---|---|
| Bootstrap | React mounted on 4001 | `REACT_MOUNTED` observed before sweep | FUNCTIONAL |
| Design Funnel | Full S1/S2 baseline rendered | P1–P16, Planta, 3D, Corte and Programa visible | FUNCTIONAL |
| Family Studio | Full screen rendered | Three viewers and deterministic inputs visible | FUNCTIONAL |
| BIM Viewer | Full screen rendered | ARK/IFC capabilities and coordination controls visible | FUNCTIONAL |
| Field Mode | Full screen rendered | Session/Core dependency fail-closed | BLOCKED_BY_DEPENDENCY |
| Spatial comparison | Explicit 503 rendered | Core spatial representation unavailable | BLOCKED_BY_DEPENDENCY |
| Generator | Suspense fallback persists | Chunk requested; module/render completion unverified | UNKNOWN_UNVERIFIED |
| Control Center | Suspense fallback persists | Chunk requested; module/render completion unverified | UNKNOWN_UNVERIFIED |
| Lazy routes | Several fallback states | No source repair performed | DEPENDENCY_BLOCKED |
| Auth-gated routes | Manus login shown | No takeover or login performed | AUTH_REQUIRED |
| 404 | Explicit NotFound screen | Utility state captured | NOT_USER_FACING |

The matrix distinguishes static route declaration, React mount, chunk request, module evaluation and final screen render. A downloaded chunk is not counted as a functional route.
