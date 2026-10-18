# ARKI-UI-GOVERNANCE-001.A1.0 — Lazy Route Root-Cause Diagnosis

**Mode:** diagnostic only. **Baseline:** A0.R3, checkpoint `69ff2ad2` (repository HEAD observed: `69ff2ad2f7537dd5b752ec8dce90f7c27d5ec3f6`). **Target count:** 14 exact `BLOCKED_LAZY` routes derived from `04_SCREEN_REGISTRY.json`.

## Final verdict

**LAZY_ROOT_CAUSE_PARTIAL**

No product repair was applied. The evidence confirms that the production chunks for the 12 genuinely lazy targets exist and return HTTP 200 with JavaScript content. The browser also confirms that at least `/arki-operations`, `/arki-book`, and `/arki-research-review` can resolve after an additional wait; `/arki-research-review` was still in `Suspense` after 2 seconds and rendered after approximately 6.5 seconds. This makes **premature visual observation / lazy-resolution latency PROBABLE**, not confirmed as the sole cause of every target.

The evidence also shows that `/arki` and `/audit` are not direct `React.lazy` routes at the route declaration level; they contain nested lazy components (`Home`/other pages). Their A0 component labels therefore do not represent the complete lazy chain. `/spatial` reaches its route UI but is blocked by an independent Core HTTP 503. One `/sources` navigation redirected to the Manus authentication page, so component evaluation could not be asserted from that attempt.

**Confirmed root-cause count:** 0. **Probable cluster count:** 1. **Possible/unknown clusters:** 3. **Repairs:** none. **Core work:** none. **Push/merge/deploy:** none.
