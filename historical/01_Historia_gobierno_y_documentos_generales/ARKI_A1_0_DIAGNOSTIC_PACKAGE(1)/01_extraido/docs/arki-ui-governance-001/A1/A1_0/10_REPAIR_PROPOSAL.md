# Repair proposal — not applied

1. Add a bounded, observable lazy-load diagnostic with route name, requested chunk, import settlement, error boundary and elapsed time.
2. Change the governance capture harness to wait for `REACT_MOUNTED` plus route-specific meaningful-render evidence, with a documented timeout; do not classify a route as permanently blocked from an immediate Suspense snapshot.
3. Trace `/arki` and `/audit` through their nested lazy components separately.
4. Keep `/spatial` and auth redirects in their own `BLOCKED_CORE`/authentication categories rather than mixing them with lazy loading.
5. Only after human approval, run A1.1 as a separate repair wave. No source, Vite, auth, Core, UI, push, merge or deploy change was applied by A1.0.
