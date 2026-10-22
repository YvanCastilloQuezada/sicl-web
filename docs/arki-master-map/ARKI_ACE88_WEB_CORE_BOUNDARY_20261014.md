# ARKI — Puerta Web → Core ACE88: contrato de integración mínima

**Fecha:** 2026-10-14. **Estado:** CONTRACT_PROPOSED / ADAPTER_NOT_IMPLEMENTED / SECURITY_FREEZE_PENDING.

## Fuente verificada

`sicl-core/docs/ace88/ACE88_ROOT_INTEGRATION.md` en rama `feat/ace88-core-service-auth` declara `FUNCTIONAL_APPROVED / REGRESSION_PASS / SECURITY_FREEZE_PENDING`. El documento registra PASS de regresión local en ARKI-02 (14-10-2026), rechazo de aprobación sin firma, SQLite OK, HTTP firmado, idempotencia y persistencia tras reinicio. **Es evidencia declarada por el repositorio Core, no pruebas ejecutadas en esta revisión.** La auditoría independiente sigue pendiente.

## Límite de confianza

- **Web:** genera propuesta, contexto, evidencias, diff y solicitud de decisión. Una acción UI no representa firma.
- **Core ACE88:** verifica identidad, firma, revisión, fingerprint, propuesta, proyecto, actor, clave, decisión, tiempo y nonce. Solo Core decide autorización criptográfica.
- **Motor canónico:** aplica únicamente cuando ACE88 confirma autorización vinculada a la revisión exacta y los demás gates están en PASS.
- **Árbol Vivo / Gemelo:** refleja estado, jamás reinterpreta `UNKNOWN` como aprobación.

## Máquina de estados propuesta

`OBSERVED → PROPOSED → TESTED → AWAITING_OWNER_AUTHORIZATION → AUTHORIZED → APPLYING → VERIFIED`.

Salidas seguras: `BLOCKED`, `REJECTED`, `EXPIRED`, `STALE_REVISION`, `ROLLBACK_REQUIRED`.

Invariantes:

1. Si la evidencia de prueba es insuficiente, detener en `PROPOSED` o `BLOCKED`.
2. Si cambian propuesta, revisión, fingerprint, proyecto o contexto después de la firma, detener en `STALE_REVISION`; nunca reutilizar la autorización.
3. Sin firma ACE88 válida, nunca `AUTHORIZED`; una aprobación de interfaz es solo intención del usuario.
4. Reintentos idénticos deben ser idempotentes; el mismo nonce para contenido diferente debe rechazarse.
5. No promover a FROZEN ni actualizar estado canónico hasta completar validación posterior a la aplicación.
6. Un resultado `UNKNOWN`, timeout o error de red es **denegación temporal**, no permiso.
7. Registrar referencias a evidencia y digest, sin persistir claves privadas, tokens o bases operativas en Git.

## Datos mínimos del intercambio (esquema lógico, no endpoint real)

- `projectId`, `proposalId`, `proposalRevision`, `proposalFingerprint`.
- `actorId`, `keyId`, `decision`, `issuedAt`, `expiresAt`, `nonce`.
- `evidenceDigest`, `sourceCommit`, `dependencySnapshotDigest`, `frozenContractDigest`.
- `signature` y `verificationReceipt` en formatos **por descubrir en la API real**.

**No se inventan rutas HTTP, algoritmos criptográficos, nombres de funciones ni formato wire.** Antes de implementar el adaptador, inspeccionar `src/sicl`, tests `test_ace88_service_auth.py` y `test_ace88_signed_promotion.py` para respetar los contratos reales.

## Casos adversariales de aceptación

| Caso | Resultado requerido |
|---|---|
| UI aprueba sin firma | DENY |
| Firma válida sobre revisión antigua | DENY |
| Mismo nonce, propuesta distinta | DENY |
| Firma sobre proyecto distinto | DENY |
| ACE88 inaccesible | BLOCKED |
| FROZEN modificado entre firma y aplicación | BLOCKED |
| Dependencia incompleta | BLOCKED |
| Aplicación parcial | ROLLBACK_REQUIRED |
| Recibo correcto y tests posteriores fallidos | NOT_VERIFIED |
| Misma solicitud repetida sin cambios | IDEMPOTENT |

## Condición de cierre

Adaptador real y suite de pruebas contractuales contra Core; validación local en SHA exacto; revisión de seguridad independiente; aprobación explícita del PO. **Hasta entonces: NO_CANONICAL_MUTATION / NO_FREEZE.**
