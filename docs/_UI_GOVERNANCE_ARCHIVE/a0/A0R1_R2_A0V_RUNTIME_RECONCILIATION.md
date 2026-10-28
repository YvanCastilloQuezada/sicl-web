# ARKI-UI-GOVERNANCE-001.A0.R1
## R2 ↔ A0-V Runtime Reconciliation

**Estado:** diagnóstico completado. No se aplicaron reparaciones, cambios de configuración, cambios de autenticación, commits, push ni despliegues.

## Conclusión ejecutiva

La contradicción entre R2 y A0-V no demuestra una regresión de `client/src/main.tsx` ni de `vite.config.ts`. Ambos archivos tienen exactamente los mismos blobs en el HEAD R2 documentado (`d22e71dd`) y en el estado actual (`a8f6abf`). La diferencia principal es el proceso utilizado para servir la aplicación.

R2 fue verificado contra el preview de producción en el puerto **4001**. Ese proceso ejecuta `node dist/index.js` y sirve el bundle compilado. El navegador marcó `REACT_MOUNTED`, cargó el bundle de producción y renderizó Design Funnel.

A0-V se ejecutó contra un servidor de desarrollo temporal en el puerto **3002**. Ese proceso ejecuta `NODE_ENV=development tsx watch server/_core/index.ts --host 0.0.0.0`. El navegador recibió módulos Vite de desarrollo, pero no alcanzó `REACT_MOUNTED`; el HTML inicial permaneció visible. Por tanto, el resultado A0-V es válido para el proceso 3002, pero no es una repetición del runtime R2.

Existe además un segundo hallazgo en 4001: Design Funnel monta correctamente, mientras `/arki-generator` y `/control-center` llegan a `REACT_MOUNTED` pero permanecen en el fallback de lazy route **“Cargando módulo”**. Este problema es distinto del bloqueo global de 3002 y no se reparó.

## R2 evidence

The R2 observation supplied by the control order is preserved:

- Design Funnel loaded.
- The sequence P1 → P4 → P9 → P16 was verified.
- Final Four was verified.
- Planta, 3D, Corte and Programa were verified.
- Console was clean.

The production reproduction performed during this reconciliation confirmed the relevant part of that observation. At `/arki-design-funnel` on port 4001, the page exposed the S1/S2 interface, sixteen proposals, the cost panel, architecture modes and the contextual inspector. Browser runtime inspection returned `data-arki-boot-stage=REACT_MOUNTED`.

The R2 source identity supplied by the order is `feature/arki-native-generator-v1` at `d22e71ddba8d610ddca1f0a3ae38381ee5062de5`. The current branch is also `feature/arki-native-generator-v1`. The current HEAD is `a8f6abf`; the additional commits after `d22e71dd` contain audit/documentation history, while the bootstrap file blobs remain identical.

## A0-V evidence

A0-V observed the following through the temporary 3002 preview:

- `/` remained at `Cargando Architectural Intelligence Workspace…`.
- `/arki-design-funnel` remained at the same initial shell.
- `/control-center` remained at the same initial shell.
- `/arki-generator` remained at the same initial shell.
- The root element had no `data-arki-boot-stage` attribute.
- The browser resource list contained `@vite/client`, `__manus__/debug-collector.js`, `/src/main.tsx`, the manifest and the icon, but no imported application modules after `main.tsx`.
- The browser console had no application error output.

A0-V therefore captured the observable reality of the 3002 process and correctly classified route-specific content as inaccessible in that process. It should not be interpreted as evidence that the 4001 production preview was also blocked.

## Exact runtime comparison

| Condition | R2 | A0-V | Evidence / status |
|---|---|---|---|
| Repository | `sicl-web` | `sicl-web` | CONFIRMED |
| Branch | `feature/arki-native-generator-v1` | `feature/arki-native-generator-v1` | CONFIRMED |
| HEAD | `d22e71dd` as supplied by the order | `a8f6abf` | DIFFERENT HEAD; bootstrap blobs equal |
| Bootstrap blobs | R2 files | Current files | `main.tsx` and `vite.config.ts` blob IDs equal |
| Worktree | Not fully preserved in R2 record | Untracked audit artifacts and restored PNGs | R2 detail UNKNOWN |
| Startup command | Production preview procedure | `NODE_ENV=development tsx watch server/_core/index.ts --host 0.0.0.0` | CONFIRMED for A0-V; R2 command inferred from process evidence |
| Working directory | `/home/ubuntu/sicl-web` | `/home/ubuntu/sicl-web` | CONFIRMED |
| Vite mode | Production bundle | Development transform | CONFIRMED |
| `NODE_ENV` | Production process | Development process | CONFIRMED by process command / script |
| Host | Managed preview / sandbox proxy | `0.0.0.0` on local process | CONFIRMED for A0-V |
| Port | 4001 | 3002 | CONFIRMED |
| Preview URL | `4001` sandbox public port | `3002` sandbox public port | CONFIRMED |
| Manus proxy | Points to 4001 process | Points to 3002 process | CONFIRMED by browser resource URLs |
| HMR | Not present in production bundle | Vite dev client requested | CONFIRMED |
| React Refresh | Not present in production bundle | Not proven to execute | UNKNOWN; no app modules mounted |
| JSX transform | Production plugin output | Development Vite transform | CONFIRMED by process mode and response shape |
| `main.tsx` | Bundled into `assets/index-DNwvu7b4.js` | Served as `/src/main.tsx` | CONFIRMED |
| `vite.config.ts` | Same source blob | Same source blob | CONFIRMED |
| Build used | Yes | No | CONFIRMED |
| Dev server used | No for the R2 production preview | Yes | CONFIRMED |
| Preview server used | Yes | No managed preview; manual dev process | CONFIRMED |
| Authentication | No user cookie observed | No user cookie observed | CONFIRMED for browser checks; authorization state otherwise UNKNOWN |
| Session state | UNKNOWN | No `document.cookie`; session storage empty | Partial evidence |
| Cookies | Empty in 4001 browser context | Not captured in the 3002 run | A0-V UNKNOWN |
| Service worker | No controller observed in 4001 check | Not captured in the 3002 run | Partial evidence |
| Cache | UNKNOWN | UNKNOWN | No cache reset performed |
| Environment values | UNKNOWN exact values; names available | Same process environment family, exact values not recorded | Do not infer equality |
| Backend process | `node dist/index.js` | `tsx watch server/_core/index.ts` | CONFIRMED process tree |
| Backend URL | Same project server family | Same project server family | Exact internal binding UNKNOWN |
| API health | UNKNOWN; not required for Design Funnel mount | UNKNOWN; bootstrap stopped before app API use | Do not infer |
| Initial route | `/arki-design-funnel` | `/`, then `/arki-design-funnel`, `/control-center`, `/arki-generator` | CONFIRMED |
| Browser context | Manus Browser | Manus Browser | CONFIRMED |
| Browser profile | Same persistent sandbox browser profile | Same persistent sandbox browser profile | Browser tool context; exact profile ID UNKNOWN |
| Timestamp | R2 historical evidence | 2026-09-24 reconciliation run | CONFIRMED at run level |

## Source and checkpoint consistency

The following checks were performed:

```text
branch: feature/arki-native-generator-v1
R2 HEAD supplied: d22e71ddba8d610ddca1f0a3ae38381ee5062de5
current HEAD: a8f6abf

client/src/main.tsx
R2 blob:      8c7eb09e3633ce6822af988a2379e50c894193be
current blob: 8c7eb09e3633ce6822af988a2379e50c894193be

vite.config.ts
R2 blob:      49dd5f24cc00e1fe95743662970e4c5c4f921287
current blob: 49dd5f24cc00e1fe95743662970e4c5c4f921287
```

The source bootstrap is therefore consistent. The differing current HEAD is not evidence of a bootstrap source change.

## Process reality and chain proof

### R2 chain

```text
/home/ubuntu/sicl-web
  → production build in dist/public + dist/index.js
  → node dist/index.js
  → port 4001
  → sandbox public preview URL for port 4001
  → Manus Browser
  → assets/index-DNwvu7b4.js
  → data-arki-boot-stage=REACT_MOUNTED
  → Design Funnel rendered
```

### A0-V chain

```text
/home/ubuntu/sicl-web
  → no new production build
  → NODE_ENV=development tsx watch server/_core/index.ts --host 0.0.0.0
  → port 3002 because port 3000 was already occupied
  → sandbox public URL for port 3002
  → Manus Browser
  → @vite/client + /src/main.tsx
  → no dependent application modules mounted
  → data-arki-boot-stage absent
  → initial HTML loading shell remained
```

The exact active A0-V server process was PID 840765, a child of the `tsx watch` process PID 840749. The port 4001 production process was PID 828478 and executed `node dist/index.js`. Additional simultaneous processes existed on ports 3000 and 3001. This process multiplicity is itself a reproducibility risk.

## Exact wait condition

The global loading text is emitted in `client/index.html:20` as the initial HTML fallback. React is expected to replace `#root` when `client/src/main.tsx:86-96` executes. The entrypoint marks the transitions `ENTRYPOINT_LOADED`, `REACT_MOUNTING` and `REACT_MOUNTED` at `client/src/main.tsx:30`, `86` and `96`.

In the A0-V 3002 browser:

- `#root` remained equal to the initial HTML shell.
- `data-arki-boot-stage` remained absent.
- `/src/main.tsx` returned HTTP 200 with JavaScript MIME type.
- No dependent application module requests appeared after `/src/main.tsx`.
- No browser console error was captured.

Therefore the actual transition that failed was **before or during execution of the module graph beginning at `main.tsx`**. The exact JavaScript exception was not exposed by the browser console, so the precise subcondition is **UNKNOWN**. It is not valid to claim that auth, session, API, service worker or route state caused the 3002 block.

For route-level loading in 4001, `client/src/App.tsx:76-77` supplies the Suspense fallback `PageLoadingFallback`. `ArkiControlCenterPage` and `ArkiGeneratorPage` are lazy imports at `client/src/App.tsx:26` and `42`. In 4001, the lazy chunks were requested successfully, React mounted, but those two routes still showed `Cargando módulo`. The final unresolved condition for those routes is not proven; possible causes remain module evaluation or a lazy import dependency, and are recorded as UNKNOWN rather than repaired.

## Root-cause classification

### A0-V global block on 3002

- **ENVIRONMENT_MISMATCH:** confirmed. A0-V used development mode while R2 used production preview.
- **PROCESS_MISMATCH:** confirmed. A0-V used `tsx watch`; R2 used `node dist/index.js`.
- **PROXY_MISMATCH:** confirmed at runtime level. The browser was pointed at a different port/process.
- **AUDIT_TOOLING_EFFECT:** plausible and supported by the different capture route, but not a product defect.
- **BOOTSTRAP_CODE_REGRESSION:** not supported. The source blobs are equal and production reproduction mounted React.
- **AUTH_SESSION_MISMATCH:** not supported by the available evidence.
- **BACKEND_UNAVAILABLE:** not established.
- **CACHE_SERVICE_WORKER:** not established.

### 4001 route-level lazy loading

- **UNKNOWN:** exact unresolved condition.
- A route-level lazy module or dependency remains pending even though the production entrypoint mounts and the chunk request succeeds.
- This is separate from the global 3002 bootstrap discrepancy.

## Reproduction procedure

### Successful R2-equivalent reproduction

1. Use `/home/ubuntu/sicl-web`.
2. Use the already-built production output in `dist/`.
3. Run `NODE_ENV=production node dist/index.js` on port 4001.
4. Open `/arki-design-funnel` in the same Manus Browser context.
5. Confirm `data-arki-boot-stage=REACT_MOUNTED` and the visible S1/S2 interface.

This procedure reproduced React mounting and Design Funnel rendering.

### A0-V reproduction

1. Use `/home/ubuntu/sicl-web`.
2. Start `NODE_ENV=development tsx watch server/_core/index.ts --host 0.0.0.0`.
3. Because port 3000 was occupied, the process selected port 3002.
4. Open `/`, `/arki-design-funnel`, `/control-center` or `/arki-generator` on the 3002 public URL.
5. Observe the initial loading shell and absent `data-arki-boot-stage`.

This procedure reproduced the A0-V observation, but it is not equivalent to the R2 production procedure.

## Resolution of the contradiction

The contradiction is resolved as a **runtime/process mismatch**, not as a confirmed product regression. A0-V must be repeated against the same production preview process used by R2 before the visual atlas can claim product-wide coverage.

The 4001 route-level lazy-loading observation must remain a separate UNKNOWN until it is reproduced with a clean browser context and its import/runtime error is captured. No source change is authorized by this reconciliation.

## Remaining UNKNOWNs

The following remain intentionally unresolved:

- Exact browser exception, if any, that prevented `main.tsx` execution on 3002.
- Exact reason `Cargando módulo` remains visible for `/arki-generator` and `/control-center` on 4001.
- Exact R2 cookies, service-worker state and cache state.
- Exact backend API health at the time of the historical R2 run.
- Whether any persistent browser cache influenced either route.
- Whether the 4001 process was started from exactly the same build timestamp as the R2 evidence.
- Classification of all 38 routes as user-facing, alias, internal or unreachable. This requires the corrected runtime and is not fabricated here.

## Final gate status

A0 is **not yet complete as a full visual atlas**. The reconciliation is complete, but the final visual gate remains pending because the runtime must first be standardized and the 4001 lazy routes must be separately explained. No A1, UI repair, redesign, geometry propagation, APU/S10 work, push, merge or deploy was performed.

## Evidence files

- `client/src/main.tsx`
- `client/src/App.tsx`
- `client/index.html`
- `vite.config.ts`
- `docs/arki-ui-governance-001/A0/PO_VISUAL_REVIEW/UI_SCREEN_REGISTRY.json`
- `docs/arki-ui-governance-001/A0/PO_VISUAL_REVIEW/ARKI_UI_VISUAL_ATLAS.md`
- Browser capture and runtime logs under `/home/ubuntu/screenshots/` and `/home/ubuntu/console_outputs/`

## References

[1]: https://vite.dev/guide/ "Vite guide and development server behavior"
[2]: https://react.dev/reference/react/lazy "React lazy reference"
[3]: https://react.dev/reference/react/Suspense "React Suspense reference"
