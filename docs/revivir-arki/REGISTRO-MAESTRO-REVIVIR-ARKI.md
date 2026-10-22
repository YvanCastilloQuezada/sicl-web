# REVIVIR ARKI — Registro maestro de continuidad

> Regla de evidencia: **NO EVIDENCIA = NO VERDE**. Distinguir siempre entre simulación, observación y hecho verificado. No declarar una etapa terminada sin evidencia reproducible.

## Propósito

Conservar el estado verificable de la etapa REVIVIR ARKI para que una sesión futura pueda continuar sin repetir trabajo ni perder decisiones. Este registro se mantiene en el repositorio `sicl-web`; los logs locales no sustituyen evidencia persistente en GitHub.

## Última actualización

- Fecha: 2026-10-22 (UTC).
- Repositorio: `YvanCastilloQuezada/sicl-web`.
- Rama de integración: `main`.
- Commit actual de `main` verificado tras PR #72: `8ba7fb32f3a70e3fe239866d13a23f17eb25ad21`.
- Estado general de REVIVIR ARKI: **EN CURSO**. La fusión del PR no implica que el sistema completo esté operativo.

## Registro de hitos verificados

### Hito 1 — Pruebas de revalidación de almacenamiento

- PR: [#72 — test(storage): cover authorization revalidation edge cases](https://github.com/YvanCastilloQuezada/sicl-web/pull/72)
- Estado: **FUSIONADO Y CERRADO**.
- Commit de la rama del PR: `5a995e4aa6ae802457b09fcf1fd0894f4acb99b7`.
- Commit de integración en `main`: `8ba7fb32f3a70e3fe239866d13a23f17eb25ad21`.
- Archivo modificado: `server/_core/arkiAuthorizedStorage.test.ts`.
- Alcance: cuatro pruebas de regresión para cambios del propietario, proyecto, estado (READY/REVOKED) y clave del registro durante una lectura.
- Evidencia de pruebas reportada en el PR: candidato ejecutado con Vitest 2.1.9, **8/8 pruebas aprobadas**. La regresión combinada local previamente reportada fue **13/13**.
- Logs locales referenciados en el historial de trabajo (no se ha verificado aquí que estén respaldados fuera del entorno local):
  - `/home/arki/arki-revivir-regression-edge-final.log`
  - `/home/arki/arki-revivir-main-candidate-test-run-2.log`
  - `/home/arki/arki-revivir-publish-test-commit.log`
- Limitación: estas pruebas no demuestran por sí solas que el adaptador esté activado en producción ni que el ciclo completo de ARKI funcione.

## Próximas etapas

### A — Verificar CI e integración
- Estado: **PENDIENTE DE CIERRE DOCUMENTAL**.
- Revisar la ejecución de GitHub Actions asociada al PR #72 y registrar su conclusión real. En la última consulta anterior a la fusión, el workflow `SICL Web CI` estaba `in_progress`; no asumir que pasó sin comprobarlo.
- Confirmar que `main` contiene el merge commit registrado arriba.

### B — Trazar el recorrido real del adaptador
- Estado: **PENDIENTE**.
- Identificar los puntos de entrada y consumidores reales de `server/_core/arkiAuthorizedStorage.mjs`, las rutas de autorización y el estado persistido.
- Documentar referencias de código y pruebas existentes antes de modificar nada.
- No afirmar que el servicio está activo en producción sin evidencia de ejecución.

### C — Pruebas integrales y adversariales
- Estado: **PENDIENTE**.
- Validar accesos revocados, cambios de propietario/proyecto/clave, fallos parciales, integridad de contenido y compensación ante errores.
- Registrar comandos exactos, código de salida y resultados. Separar pruebas unitarias de integración y de entorno real.

### D — Demostrar un ciclo operativo seguro
- Estado: **PENDIENTE**.
- Evidenciar el ciclo de solicitud → acción autorizada → revalidación → resultado → registro de evidencia.
- Probar que las acciones no autorizadas se rechazan y que los fallos no se reportan como éxito.

### E — Cierre de deudas e integración
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
