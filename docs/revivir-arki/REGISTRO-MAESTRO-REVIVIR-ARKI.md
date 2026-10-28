# REVIVIR ARKI — Registro maestro de continuidad

> Regla de evidencia: **NO EVIDENCIA = NO VERDE**. Distinguir siempre entre simulación, observación y hecho verificado. No declarar una etapa terminada sin evidencia reproducible.

## Propósito

Conservar el estado verificable de la etapa REVIVIR ARKI para que una sesión futura pueda continuar sin repetir trabajo ni perder decisiones. Este registro se mantiene en el repositorio `sicl-web`; los logs locales no sustituyen evidencia persistente en GitHub.

## Última actualización

- Fecha: 2026-10-22 (UTC).
- Repositorio: `YvanCastilloQuezada/sicl-web`.
- Último commit de `main` confirmado antes de esta actualización: `926a6b986441db7842f192119a0905bbf89d6afc`.
- Estado general de REVIVIR ARKI: **EN CURSO**. La integración de pruebas y documentación está confirmada; aún falta verificar la configuración real del despliegue objetivo.

## Hitos integrados

### Hito 1 — Pruebas de revalidación de almacenamiento

- PR: [#72 — test(storage): cover authorization revalidation edge cases](https://github.com/YvanCastilloQuezada/sicl-web/pull/72)
- Estado: **FUSIONADO Y CERRADO**.
- Commit de la rama del PR: `5a995e4aa6ae802457b09fcf1fd0894f4acb99b7`.
- Commit de integración en `main`: `8ba7fb32f3a70e3fe239866d13a23f17eb25ad21`.
- Archivo modificado: `server/_core/arkiAuthorizedStorage.test.ts`.
- Alcance: cuatro pruebas de regresión para cambios del propietario, proyecto, estado (READY/REVOKED) y clave del registro durante una lectura.
- CI: [SICL Web CI, ejecución #950](https://github.com/YvanCastilloQuezada/sicl-web/actions/runs/39742109215), conclusión **success**. Pasaron TypeScript check, pruebas y build de producción.
- El log CI muestra **111 archivos de prueba aprobados** y la prueba real MO-22 reporta **14/14 comprobaciones aprobadas**.
- Las comprobaciones de integración real incluyen: rutas deshabilitadas por defecto, escritura autenticada y estado READY en MariaDB, lectura de bytes exactos, usuario anónimo, propietario ajeno, app ajena, JWT alterado, proyecto incorrecto, base64 inválido, puente directo, revocación y rechazo de contenido alterado por SHA.
- Pruebas locales reportadas anteriormente: candidato 8/8 y regresión combinada 13/13.
- Logs locales referenciados en el historial (no verificados como respaldados fuera del entorno local):
  - `/home/arki/arki-revivir-regression-edge-final.log`
  - `/home/arki/arki-revivir-main-candidate-test-run-2.log`
  - `/home/arki/arki-revivir-publish-test-commit.log`
- Límite: CI valida un entorno aislado de GitHub Actions con MariaDB temporal. No demuestra que el adaptador esté habilitado en el despliegue real.

### Hito 2 — Registro maestro de continuidad

- PR: [#73 — docs(revivir-arki): add continuity evidence register](https://github.com/YvanCastilloQuezada/sicl-web/pull/73)
- Estado: **FUSIONADO Y CERRADO**.
- Commit de integración: `daf8ad49947c5eafad6d41148f9f723ba40d0371`.
- Archivo: `docs/revivir-arki/REGISTRO-MAESTRO-REVIVIR-ARKI.md`.
- CI: [SICL Web CI, ejecución #952](https://github.com/YvanCastilloQuezada/sicl-web/actions/runs/39742775598), conclusión **success**.

### Hito 3 — Trazado del adaptador y actualización de evidencia

- PR: [#74 — docs(revivir-arki): record CI and adapter trace findings](https://github.com/YvanCastilloQuezada/sicl-web/pull/74)
- Estado: **FUSIONADO Y CERRADO**.
- Commit de integración: `926a6b986441db7842f192119a0905bbf89d6afc`.
- Actualizó el registro con el trazado de código y la distinción entre CI y despliegue real.

## Trazado del adaptador — inspección estática del código en main

Fuentes revisadas:
- [Adaptador autorizado](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiAuthorizedStorage.mjs)
- [Puente MO-22](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiMo22Bridge.ts)
- [Rutas HTTP](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiHttpRoutes.mjs)
- [Repositorio MySQL](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiMysqlLedgerRepository.mjs)
- [Backend de archivos](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiFileBackend.mjs)
- [Inicialización del servidor](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/index.ts)
- [Prueba de integración real MO-22](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiMo22RealIntegration.test.ts)

Hallazgos observados:
1. `server/_core/index.ts` llama a `registerArkiMo22(app)` durante el arranque.
2. El puente solo registra rutas cuando `enabled()` resulta verdadero. Requiere `ARKI_STORAGE_MODE=local`, `ARKI_MO22_ENABLE=1`, `ARKI_DEV_OPEN` distinto de `1` y una combinación permitida de identidad. La identidad local requiere `ARKI_MO08_LOCAL_AUTH=1` y `NODE_ENV` distinto de `production`; la otra vía usa identidad Manus.
3. Al crear el servicio, el puente exige `DATABASE_URL` y `ARKI_STORAGE_ROOT` absoluto.
4. Las rutas exponen POST, GET y DELETE bajo `/api/arki-storage/projects/:projectId/objects`; la autenticación se delega al puente.
5. La lectura valida pertenencia al proyecto, estado READY, propietario, proyecto y clave antes y después de la lectura física, además de tamaño y SHA-256.
6. El repositorio MySQL usa transacciones para comprobar la propiedad del proyecto y cambiar estados PENDING/READY/REVOKED.
7. El backend local restringe la raíz, usa claves exactas, evita symlinks en aperturas y comprueba cambios del archivo durante la lectura.
8. El workflow CI crea un servicio MariaDB temporal, usa un directorio de almacenamiento aislado y ejecuta el conjunto de pruebas. El log de ejecución #950 muestra `MO22_REAL_E2E=14/14 PASS` y `111 passed`.

**Límite:** la inspección y CI demuestran que el camino funcional pasó en un entorno aislado de CI. No demuestran qué variables están configuradas en el despliegue actual ni que MO-22 esté habilitado en producción.

## Próximas etapas

### A — Verificar configuración del despliegue sin exponer secretos
- Estado: **PENDIENTE**.
- Confirmar en el entorno objetivo solo la presencia/ausencia y valores no secretos de `ARKI_STORAGE_MODE`, `ARKI_MO22_ENABLE`, `ARKI_DEV_OPEN`, `ARKI_IDENTITY_MODE`, `ARKI_MO08_LOCAL_AUTH`, `NODE_ENV`, y presencia de `DATABASE_URL`/`ARKI_STORAGE_ROOT` sin imprimir credenciales.
- No cambiar configuración ni activar el servicio como parte de la inspección.

### B — Demostrar el ciclo en el entorno objetivo
- Estado: **PENDIENTE**.
- Solo después de confirmar que el entorno es de prueba y está aislado, verificar solicitud autenticada → escritura → registro READY → lectura de bytes/hash → revocación → lectura denegada.
- No ejecutar contra una base productiva ni alterar datos reales.

### C — Cierre de deudas e integración
- Estado: **PENDIENTE**.
- Integrar únicamente cambios autorizados mediante el flujo existente.
- Evitar ramas de prueba innecesarias. No borrar respaldos ni cambios locales no relacionados.
- Comprobar estado de repositorio y diferencias antes de cualquier limpieza.

## Formato obligatorio para futuras entradas

Por cada ejecución, añadir:
1. Fecha y hora con zona horaria.
2. Repositorio, rama, SHA de base y SHA probado.
3. Objetivo y alcance autorizado.
4. Comandos ejecutados literalmente.
5. Resultado observado (incluido código de salida).
6. Enlaces a CI, PR, commits y logs persistentes.
7. Fallos, limitaciones y siguiente acción concreta.
8. Estado: **PENDIENTE**, **BLOQUEADO** o **VALIDADO CON EVIDENCIA**.

No convertir una intención en un resultado. Si no existe evidencia recuperable, marcarlo como pendiente.

---

### Hito 4 — Maqueta Viva servida en el puerto 8769 (2026-10-28)

- **PR:** pendiente (cambios en working tree).
- **Estado:** `IMPLEMENTED_LOCAL / NOT_COMMITTED`.
- **Archivos nuevos:**
  - `tools/maqueta-viva/arki-maqueta-viva-server.cjs` (3.5 KB) — servidor Node que sirve `maqueta-viva.template.html` con los 2 tokens inyectados.
  - `package.json` — script `maqueta-viva` añadido.
- **Servicio systemd:** `~/.config/systemd/user/arki-maqueta-viva.service`.
- **Puerto:** 8769 (el AV023 sigue en el 8768, sin conflicto).
- **Tokens inyectados:** `__ARKI_STATE_JSON__`, `__ARKI_ASSEMBLY_JSON__`.
- **Etapas:** F1-F10 (10 etapas completas).
- **Vistas:** 01 Plano ARKI, 02 Maqueta Viva, 03 Gemelo Digital, 04 Gemelo Predictivo, 05 ARKI Autocorrectivo.
- **Verificación:**
  - `HTTP 200` en `/health`.
  - `HTTP 200 — 558,248 bytes` en `/`.
  - `0` ocurrencias de tokens (100% reemplazados).
  - `F0, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10` presentes.
- **Límite:** este hito sirve la Maqueta Viva en el 8769, pero **no demuestra** que las 10 etapas estén funcionalmente conectadas al Core. Es la **capa visual** de la Maqueta Viva, no el ciclo vital REAL.
- **Próximo paso:** verificar que las 5 vistas funcionan en el navegador (no solo que el HTML se sirve).

**End of Hito 4 — 2026-10-28.**
