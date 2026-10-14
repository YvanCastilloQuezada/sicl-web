# ARKI — ACE88 Core integration (offline)
Estado: CODE_INTEGRATED / MOCK_TESTS_NOT_EXECUTED / LIVE_E2E_PENDING.

Fuente Core inspeccionada: `api/routes/v1.py` define POST `/v1/projects/{project_id}/developer-promotions` con Bearer `SICL_CORE_SERVICE_TOKEN`. `api/schemas.py` exige fingerprint SHA-256 de 64 caracteres y campos `proposal_id`, `proposal_fingerprint`, `human_review_id`, `approval_payload`, `approval_signature_b64`.

Módulos Web: `arki-ace88-preflight-adapter.cjs` y `arki-ace88-core-transport.cjs`. El segundo acepta una función `transport` inyectada por la capa servidor. No realiza fetch directo, no almacena tokens y no verifica Ed25519: esas verificaciones pertenecen a Core. Si Core responde COMMITTED, Web solo registra observación de commit y requiere verificación independiente; `authorized` permanece `false`.

Pruebas: `arki-ace88-preflight-adapter.test.cjs` (10 casos) y `arki-ace88-core-transport.test.cjs` (6 casos) incluidas en runner offline, ahora 17 archivos.

Ejecución en copia limpia, Node 22:
```bash
node --test tools/maqueta-viva/arki-ace88-preflight-adapter.test.cjs tools/maqueta-viva/arki-ace88-core-transport.test.cjs
node tools/maqueta-viva/Run-ARKI-Offline-CI.cjs "$(git rev-parse HEAD)"
```

Pendiente: implementar el cliente HTTP real del lado servidor con TLS, timeout, protección de secretos y validación del origen; probar contra instancia Core de pruebas, no contra datos canónicos. La respuesta `COMMITTED` puede significar que Core ya mutó D-2: jamás hacer ensayos de integración con un proyecto productivo. Verificar recibos, snapshots, efectos, replay y autorización con pruebas de extremo a extremo y revisión de seguridad independiente.
