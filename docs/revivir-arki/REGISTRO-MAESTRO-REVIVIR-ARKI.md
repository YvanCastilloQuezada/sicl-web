# REVIVIR ARKI — Registro maestro de continuidad

> Regla de evidencia: **NO EVIDENCIA = NO VERDE**. Distinguir siempre entre simulación, observación y hecho verificado. No declarar una etapa terminada sin evidencia reproducible.

## Propósito

Conservar el estado verificable de la etapa REVIVIR ARKI para que una sesión futura pueda continuar sin repetir trabajo ni perder decisiones. Este registro se mantiene en el repositorio `sicl-web`; los logs locales no sustituyen evidencia persistente en GitHub.

## Última actualización

- Fecha: 2026-10-22 (UTC).
- Repositorio: `YvanCastilloQuezada/sicl-web`.
- Último commit de `main` confirmado en esta actualización: merge de PR #73, `daf8ad49947c5eafad6d41148f9f723ba40d0371`.
- Estado general de REVIVIR ARKI: **EN CURSO**. Los cambios de documentación y las pruebas del adaptador no demuestran por sí solos operación completa en producción.

## Hitos integrados

### Hito 1 — Pruebas de revalidación de almacenamiento

- PR: [#72 — test(storage): cover authorization revalidation edge cases](https://github.com/YvanCastilloQuezada/sicl-web/pull/72)
- Estado: **FUSIONADO Y CERRADO**.
- Commit de la rama del PR: `5a995e4aa6ae802457b09fcf1fd0894f4acb99b7`.
- Commit de integración en `main`: `8ba7fb32f3a70e3fe239866d13a23f17eb25ad21`.
- Archivo modificado: `server/_core/arkiAuthorizedStorage.test.ts`.
- Alcance: cuatro pruebas de regresión para cambios del propietario, proyecto, estado (READY/REVOKED) y clave del registro durante una lectura.
- CI: [SICL Web CI, ejecución #950](https://github.com/YvanCastilloQuezada/sicl-web/actions/runs/39742109215), conclusión **success**. Pasaron TypeScript check, tests y build de producción.
- Pruebas locales reportadas: candidato 8/8 y regresión combinada 13/13.
- Logs locales referenciados en el historial (no verificados como respaldados fuera del entorno local):
  - `/home/arki/arki-revivir-regression-edge-final.log`
  - `/home/arki/arki-revivir-main-candidate-test-run-2.log`
  - `/home/arki/arki-revivir-publish-test-commit.log`
- Límite: esto prueba el conjunto ejecutado en CI, no que el adaptador esté habilitado en una instancia productiva.

### Hito 2 — Registro maestro de continuidad

- PR: [#73 — docs(revivir-arki): add continuity evidence register](https://github.com/YvanCastilloQuezada/sicl-web/pull/73)
- Estado: **FUSIONADO Y CERRADO**.
- Commit de integración: `daf8ad49947c5eafad6d41148f9f723ba40d0371`.
- Archivo: `docs/revivir-arki/REGISTRO-MAESTRO-REVIVIR-ARKI.md`.
- CI de la documentación: [SICL Web CI, ejecución #952](https://github.com/YvanCastilloQuezada/sicl-web/actions/runs/39742775598), conclusión **success**.

## Trazado del adaptador — inspección estática del código en main

Fuentes revisadas:
- [Adaptador autorizado](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiAuthorizedStorage.mjs)
- [Puente MO-22](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiMo22Bridge.ts)
- [Rutas HTTP](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiHttpRoutes.mjs)
- [Repositorio MySQL](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiMysqlLedgerRepository.mjs)
- [Backend de archivos](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiFileBackend.mjs)
- [Inicialización del servidor](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/index.ts)
- [Prueba de integración real MO-22](https://github.com/YvanCastilloQuezada/sicl-web/blob/main/server/_core/arkiMo22RealIntegration.test.ts)

Hallazgos observados en el código:
1. `server/_core/index.ts` llama a `registerArkiMo22(app)` durante el arranque.
2. El puente solo registra rutas cuando `enabled()` resulta verdadero. Requiere `ARKI_STORAGE_MODE=local`, `ARKI_MO22_ENABLE=1`, `ARKI_DEV_OPEN` distinto de `1` y una combinación permitida de identidad. La identidad local requiere `ARKI_MO08_LOCAL_AUTH=1` y `NODE_ENV` distinto de `production`; la otra vía usa identidad Manus.
3. Al crear el servicio, el puente exige `DATABASE_URL` y `ARKI_STORAGE_ROOT` absoluto.
4. Las rutas exponen POST, GET y DELETE bajo `/api/arki-storage/projects/:projectId/objects`; la autenticación se delega al puente.
5. La lectura valida pertenencia al proyecto, estado READY, propietario, proyecto y clave antes y después de la lectura física, además de tamaño y SHA-256.
6. El repositorio MySQL usa transacciones para comprobar la propiedad del proyecto y cambiar estados PENDING/READY/REVOKED.
7. El backend local restringe la raíz, usa claves exactas, evita symlinks en aperturas y comprueba cambios del archivo durante la lectura.
8. El CI de PR #72 ejecutó un job con TypeScript, pruebas y build exitosos. La prueba `arkiMo22RealIntegration.test.ts` contiene 13 comprobaciones de integración con MariaDB/HTTP, pero **no se ha obtenido todavía evidencia de una ejecución exitosa de esa prueba contra una instancia de MariaDB real en el entorno objetivo**.

Limitación importante: la inspección de código demuestra que hay un camino de registro condicionado por configuración; **no demuestra qué variables están configuradas en el despliegue actual ni que las rutas estén habilitadas en producción**.

## Próximas etapas

### A — Confirmar la ejecución de la integración real MO-22
- Estado: **PENDIENTE**.
- Encontrar una ejecución CI o de entorno controlado que muestre el resultado de `arkiMo22RealIntegration.test.ts` contra MariaDB real.
- Guardar logs completos y confirmar limpieza/aislamiento de las tablas y archivos temporales usados por la prueba.
- No ejecutar contra una base productiva ni alterar datos reales.

### B — Verificar configuración de despliegue sin exponer secretos
- Estado: **PENDIENTE**.
- Confirmar en el entorno objetivo solo la presencia/ausencia y valores no secretos de las variables de activación: `ARKI_STORAGE_MODE`, `ARKI_MO22_ENABLE`, `ARKI_DEV_OPEN`, `ARKI_IDENTITY_MODE`, `ARKI_MO08_LOCAL_AUTH`, `NODE_ENV`, y presencia de `DATABASE_URL`/`ARKI_STORAGE_ROOT` sin imprimir credenciales.
- No cambiar configuración ni activar el servicio como parte de la inspección.

### C — Demostrar un ciclo operativo seguro
- Estado: **PENDIENTE**.
- En un entorno aislado: solicitud autenticada → escritura → registro READY → lectura con bytes y hash verificados → revocación → lectura denegada.
- Incluir casos de identidad inválida, otro propietario/proyecto, contenido alterado y error parcial.
- Registrar comandos, códigos de salida, resultados y logs persistentes.

### D — Cierre de deudas e integración
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
