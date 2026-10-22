# ARKI — Ley de reutilización y evolución canónica

**Estado:** PRINCIPIO DE ARQUITECTURA APROBADO POR EL USUARIO. **No equivale a auditoría técnica completada.**
**Fecha:** 2026-10-10.

## Ley

Antes de desarrollar una capacidad, ARKI debe identificar, auditar y reutilizar las capacidades existentes. Está prohibido crear sistemas paralelos que dupliquen una fuente de verdad. Toda ampliación debe integrarse con la arquitectura vigente y conservar trazabilidad, contratos, evidencia y decisiones FROZEN.

## Aplicación a la memoria viva

- `arki-living-memory.cjs` es un **prototipo aislado y en cuarentena**; no autorizar su integración como fuente canónica.
- Se deben examinar las memorias, eventos, estado y conocimiento existentes en `sicl-core`, `sicl-web` y ramas pertinentes.
- La búsqueda de código realizada el 2026-10-10 para `memory`, `knowledge`, `event` y `derivation` no devolvió coincidencias a través del buscador disponible. **No es prueba de ausencia**. La comprobación de varias rutas tentativas en `sicl-core/main` tampoco localizó archivos; no demuestra inexistencia.
- Identificar para cada capacidad: repositorio, ruta, SHA, contrato, productor, consumidor, persistencia, evidencias, autoridad canónica, compatibilidad y brechas.
- Si existe una capacidad adecuada: reutilizar o extender. Si está incompleta: corregir o ampliar bajo contrato. Solo crear nueva implementación cuando se demuestre ausencia o incompatibilidad no subsanable y se documente decisión.
- No ejecutar migraciones, reemplazos ni modificaciones canónicas durante esta auditoría.

## Puertas de verificación

1. Inventario verificable del árbol de archivos y ramas, no únicamente búsqueda indexada.
2. Lectura del código y pruebas de las implementaciones encontradas.
3. Mapa de flujo: ingestión → eventos → estado → conocimiento → derivación → memoria → handoff.
4. Determinación de fuente única de verdad y reconciliación de duplicados.
5. Dictamen con evidencias y decisión de reutilizar, adaptar o retirar el prototipo.
6. Integración y pruebas E2E antes de cualquier declaración de cierre.

**Veredicto actual:** REUSE_AUDIT_IN_PROGRESS / CANONICAL_SOURCE_UNKNOWN / NEW_MEMORY_INTEGRATION_HOLD.
