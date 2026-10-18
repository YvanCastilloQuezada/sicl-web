# 03 — Organigrama MiLukita

```text
HUMAN AUTHORITY
├── Governance / Audit / Legal boundaries
├── Territorial Trust
│   ├── Mapper Operator → CAPTURE
│   ├── Eye Reviewer → VERIFY / DISPUTE
│   └── Runtime → consume PUBLISHED
├── LUKA Experiences
│   ├── Portal / L★ / QR Lab
│   ├── LUKA AR / WebXR
│   ├── LUKA TV / Remote Lab
│   └── Voice Copilot
├── Identity / Sessions / Consent
└── External integrations
    ├── OAuth
    ├── S3
    ├── Maps
    ├── Browser media APIs
    ├── WebXR
    └── Cast/DLNA (external gate)

MJP CORE — PROTECTED BOUNDARY
├── RNG
├── RTP
├── Rules
├── Wallet / Ledger
├── Settlement
└── MjpTvManifest
```

Los agentes se sitúan como observadores, alertadores, proponentes o proyectores, nunca como autoridades sobre el núcleo protegido. El organigrama se deriva de `shared/agentRegistry.ts`, `shared/mjpCoreIsolation.test.ts`, `shared/territorialTrust.ts` y los routers territoriales.
