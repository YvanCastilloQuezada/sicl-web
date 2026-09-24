# A0_STANDARD_RUNTIME_RUNBOOK

## Canonical runtime

- Working directory: `/home/ubuntu/sicl-web`
- Source branch: `feature/arki-native-generator-v1`
- Production process: `node dist/index.js`
- Canonical port: `4001`
- Browser: Manus Browser through the 4001 preview/proxy
- First route: `/arki-design-funnel` for a deterministic boot check
- Expected marker: `#root[data-arki-boot-stage="REACT_MOUNTED"]`

## Procedure

1. Confirm the source HEAD and build timestamp before inspection.
2. Confirm the process bound to port 4001 is `node dist/index.js`.
3. Open `/arki-design-funnel` through the corresponding 4001 proxy.
4. Inspect `data-arki-boot-stage`; if it is not `REACT_MOUNTED`, stop.
5. Do not silently use ports 3000, 3001 or 3002. They are separate processes and are not the canonical A0 runtime.
6. Traverse declared routes and record redirects, auth, lazy fallback, dependency 503 and functional screens separately.
7. Preserve screenshots and page text for every observed state.

## Process hygiene

During A0.R2, processes were observed on 3000, 3001, 3002 and 4001. The 4001 process used for the baseline was PID 828478 (`node dist/index.js`). Development watchers on 3000–3002 were not treated as the product baseline. No process was killed.
