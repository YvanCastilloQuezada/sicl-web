# MiLukita — AS-IS System Report

**Fecha de auditoría:** 23 de septiembre de 2026  
**Estado:** `PARTIAL / EVIDENCE-BOUNDED / NOT READY FOR BROAD IMPLEMENTATION`

## 1. Baselines observados

La auditoría encontró dos estados que no pueden fusionarse sin provenance adicional:

| Baseline | Evidencia | Interpretación |
|---|---|---|
| `main@37d03d1b540a698716e243958423127bcf9ff15c` | Árbol actual local: README, gobernanza, Work Orders y smoke evidence; sin `client/`, `server/`, `shared/` ni `drizzle/` | Checkout actual es **governance/recovery shell**, no workspace ejecutable de producto. |
| `origin/feature/luca-spatial-intelligence-control-center@bc652e70bf2f64e9737eeb06a7f2212f58d153ed` | Árbol estructurado con React, server, shared, Drizzle, tests, páginas territoriales, control y AR | **Structured workspace candidate**; es la base de esta reconstrucción funcional. |

El commit `a6dafc5118dc8f36a1a5b60a21406397c089650e`, citado por C-001, no está disponible como objeto verificable en el checkout actual. Por tanto, la evidencia de la rama feature se presenta como **branch evidence**, no como prueba de que sea el baseline canónico definitivo.

## 2. Qué es MiLukita hoy

Según el código y documentación del workspace estructurado, MiLukita es una plataforma web interactiva que combina experiencias, juegos, TV, control móvil, identidad, contenidos territoriales y una capa de inteligencia espacial/AR en expansión. El núcleo observable no es un único World Engine monolítico: es un conjunto distribuido de servicios de identidad, experiencia, control, confianza territorial, contenido, agentes y runtime.

El README del checkout actual sólo declara: “MiLukita - plataforma web interactiva, juegos, TV y control móvil”. La arquitectura más amplia aparece en la rama estructurada y en sus documentos; debe conservarse como **documentary/code evidence of that branch**, no como runtime probado en este checkout.

## 3. Arquitectura real observada en la rama estructurada

```text
USER
  ↓
IDENTITY / DEVICE / SESSION
  ↓
WEB OR MOBILE SURFACE
  ├── TV / overlay / games
  ├── Touch Remote / keyboard / trackpad
  ├── Territorial Field Entry / Mapper
  ├── The Eye / review
  └── AR / Lukita surfaces
  ↓
SERVER ROUTERS + DOMAIN SERVICES
  ├── control and pairing
  ├── territorial trust
  ├── claims / sources / evidence
  ├── identity and participation
  ├── agents and governance
  └── MJP CORE isolation
  ↓
DRIZZLE DATABASE / OBJECT STORAGE / AUDIT
  ↓
PUBLISHED RUNTIME OR CONTROL SESSION
```

## 4. Capability status

| Capability | Evidence | Current status | Limitation |
|---|---|---|---|
| Web application shell | `client/src`, `server`, `package.json` in feature branch | **IMPLEMENTED on branch** | Not present in current `main` checkout. |
| React/Vite/TypeScript runtime | `package.json`, client/server tree | **IMPLEMENTED on branch** | Build was not re-run in this audit. |
| Database and migrations | `drizzle/schema.ts`, migration files | **IMPLEMENTED on branch** | Staging/browser integration still requires environment evidence. |
| Identity | `milukita_identities`, sessions, consent and device models | **IMPLEMENTED / PARTIAL** | Effective authentication remains Manus OAuth; OTP/provider paths are not demonstrated. |
| Device model | `milukita_devices`, control tables | **IMPLEMENTED** | Physical devices and external adapters remain required. |
| TV/control API | `server/control.ts`, pairing/session/command contracts | **IMPLEMENTED / PARTIAL** | Cast/DLNA/AirPlay are prepared or external; physical validation pending. |
| Touch Remote | `client/src/pages/TouchRemotePage.tsx` | **IMPLEMENTED UI / PARTIAL integration** | Local profiles/scenes and control surfaces exist; universal device execution is adapter-dependent. |
| Pairing | `controlPairing` contracts and `MILUKITA_TV_PAIRING_PROTOCOL.md` | **IMPLEMENTED contract/backend** | QR visual and physical end-to-end pairing require separate validation. |
| WorldObject | `server/territorialTrust.ts`, schema and pages | **IMPLEMENTED** | WorldPoint is not a separate proven entity. |
| World Engine | distributed lifecycle logic and published filtering | **PARTIAL / IMPLEMENTED bounded scope** | It is not a single isolated engine; broader geospatial runtime remains partial. |
| Mapper | capture session, coordinates, claims, evidence, offline queue | **IMPLEMENTED backend / PARTIAL UI** | GPS, camera, permissions and offline physical behavior require devices. |
| The Eye | review queue, evidence matrix, decisions and audit | **IMPLEMENTED bounded workflow** | Human review and source quality remain authoritative. |
| Claims/Sources/Evidence | tables and `territorialTrust.ts` | **IMPLEMENTED** | Evidence quality is not automatically truth. |
| CREATE → PROPOSE → EVALUATE → PUBLISH | state transition contracts and tests/docs | **PARTIAL / bounded implemented** | Full public contributor runtime and all publication surfaces are not proven. |
| VERIFIED vs PUBLISHED | explicit status and runtime filter | **IMPLEMENTED bounded invariant** | Must be revalidated against canonical baseline. |
| GPS/geolocation | territorial capture and browser APIs | **IMPLEMENTED code / PHYSICAL_VALIDATION_REQUIRED** | Static evidence cannot certify device accuracy. |
| Camera/vision | field/AR surfaces and contracts | **PARTIAL / PHYSICAL_VALIDATION_REQUIRED** | No professional computer-vision capability is established by static code. |
| OCR | references/contracts only where present; no demonstrated production OCR path in audited baseline | **NOT_DEMONSTRATED** | Requires provider/runtime/e2e evidence. |
| AR | AR/Lukita pages, WebXR/GLB/device dependencies | **PARTIAL / PHYSICAL_VALIDATION_REQUIRED** | Device, camera, tracking and rendering tests are external. |
| 2D/3D | Three.js and AR/visual surfaces | **PARTIAL** | Not equivalent to a complete spatial digital twin. |
| Community Mapping | documents and pieces of capture/review | **PARTIAL / NOT_READY** | No complete executable public contributor flow is proven. |
| Offline/cache/sync | Service Worker, queue/sync contracts and tests | **PARTIAL** | Conflict, restart and device network behavior require physical/staging validation. |
| WebRTC/signaling | contracts/references | **PREPARED / EXTERNAL_REQUIRED** | No production device pairing evidence. |
| Voice | field voice contracts | **IMPLEMENTED bounded / provider-dependent** | Productive transcription provider not established. |
| Agents | registry, router, governance and safe capabilities | **IMPLEMENTED bounded contracts** | Most are propose/read/alert only; no autonomous authority to publish or modify MJP CORE. |
| Payments/wallet/blockchain | many documents and protected core references | **BLOCKED / NOT_CONFIGURED** | No claim of active money or blockchain capability. |
| Security/privacy | headers, rate limits, authz and isolation tests/docs | **PARTIAL / bounded implemented** | Full IDOR, staging, dependency and physical review remain open. |
| Production runtime | feature branch has server/build definitions | **NOT_DEMONSTRATED in current audit** | No live deployment or full regression executed here. |

## 5. Corrected lifecycle

The evidence-backed lifecycle is:

```text
USER / DEVICE
  ↓
IDENTITY + CONSENT + SESSION
  ↓
PERCEPTION OR INPUT
(GPS, camera, QR, touch, keyboard, voice, web form)
  ↓
CAPTURE SESSION / DRAFT / OBSERVATION
  ↓
WORLD OBJECT + CLAIMS + SOURCES + EVIDENCE
  ↓
TERRITORIAL TRUST / CONSISTENCY CHECKS
  ↓
THE EYE REVIEW
(REQUEST_EVIDENCE / VERIFY / DISPUTE / REJECT / ARCHIVE)
  ↓
HUMAN AUTHORITY PUBLICATION GATE
  ↓
PUBLISHED VERSION
  ↓
RUNTIME / AR / MAP / DISCOVERY / SHARING
```

The control path is separate:

```text
USER → IDENTITY → DEVICE OWNERSHIP → PAIRING → AUTHORIZED SESSION
→ COMMAND → ACK/OBSERVED STATE → AUDIT
```

## 6. Truth and Human Authority

The project explicitly preserves:

- `CREATE ≠ PUBLISH`.
- `VERIFIED ≠ PUBLISHED`.
- Public Contributor `≠` professional Mapper.
- A score or agent proposal `≠` Human Authority decision.
- A command sent `≠` device state observed.

The evidence supports a bounded review/publish separation. It does not support claiming that every surface, agent or public contributor path enforces the distinction completely in production.

## 7. Runtime and tests

The feature branch documents substantial test evidence, including TypeScript, build, Vitest, territorial, pairing and visual tests. However, this audit did not re-run that full suite, did not connect a staging database, did not use a physical phone/TV/camera/GPS device and did not publish a resource. Therefore those claims remain **branch/document evidence**, not new runtime evidence from this audit.

## 8. Final status

**MiLukita/LUCA is a structured, partially implemented platform on the feature branch, with real territorial trust, control/pairing, identity, TV/mobile and agent infrastructure. It is not presently proven as a production-ready spatial/AR world platform.**

**Current checkout status:** `C-001 remains BLOCKED for canonical reproducibility; branch evidence is sufficient for planning, not for broad implementation.`

## 9. Recommended next work orders

1. **C-000/C-001 reproducibility:** establish the authenticated canonical workspace and baseline commit.
2. **Environment verification:** install dependencies, run declared typecheck/build/test commands, and record outputs.
3. **Security decision:** review headers, authz, IDOR, storage and external provider boundaries.
4. **Territorial authorization:** prove the complete CREATE → PROPOSE → EVALUATE → PUBLISH path in staging.
5. **Public Contributor specification:** define role, limits and moderation before implementation.
6. **Physical validation:** mobile GPS/camera/mic, TV, browser, WebXR and offline restart tests.

**Verdict:** `PARTIAL — PLANNING-READY, NOT PRODUCT-READY`.
