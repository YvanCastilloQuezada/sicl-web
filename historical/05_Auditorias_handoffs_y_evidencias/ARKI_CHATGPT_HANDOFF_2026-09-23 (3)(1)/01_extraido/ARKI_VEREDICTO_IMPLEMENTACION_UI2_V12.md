# ARKI — Acta de implementación UI-2 v1.2

**Estado:** APPROVE WITH EVIDENCE  
**Fecha:** 22 de septiembre de 2026.  
**Alcance:** UI-2 opción B + PATCH NOW 6 (paleta B) + PATCH NOW 7 (layout de navegación).

## Cambios realizados

Se eliminó el sidebar heredado del Generador. Comparador, Exportaciones, Buscar familia y Nuevo ahora se presentan en `ModuleToolbar`, encima del canvas del módulo activo. El `ArkiNavigator` quedó colapsado por defecto y se abre como overlay flotante con backdrop, sin empujar el canvas. El tab bar conserva las diez pestañas visibles, añade el chip de proyecto activo y muestra puntos de estado según `MODULE_DEFINITIONS`.

Se mantuvo `ProjectContext`, el montaje de `GeneratorModule`, `BimModule`, `DossierModule` y `MetricsModule`, y la conservación del `building` entre pestañas. No se modificó `shared/`, `client/src/i18n/`, backend ni contratos de dominio.

## Evidencia de validación

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm build` | PASS |
| Bundle JavaScript | 740.10 kB; menor que el límite de 757 kB |
| Tests de dominio 1A–1C | PASS |
| Tests profesional y expediente | PASS |
| Tests serialización, coherencia, presupuesto y recálculo | PASS |
| Matriz de acceso | PASS; 64 casos |
| Estados de módulos | PASS; 16 módulos |
| Catálogo i18n | PASS; 8 idiomas |
| `test-modules-mount.ts` | PASS |
| `test-navigator-layout.ts` | PASS; Navigator overlay, 10 tabs, sidebar heredado ausente |
| Generador vacío | Verificado en preview |
| Generador con propuesta | Verificado en preview |
| Navigator abierto/cerrado | Verificado en preview |
| Modelo BIM | Verificado en preview |
| Expediente | Verificado en preview |
| EmptyModuleState | Verificado en Planta, Corte, 3D y módulos no montados |
| Gateway desktop y móvil | Capturas realizadas |

## Estado de módulos

Generador, Gateway y shell están verificados. Modelo BIM y Expediente continúan `PARTIAL` por las exclusiones contractuales de esta fase. Planta, Corte y 3D continúan `CONCEPTUAL`. Clashes y 4D continúan `PARTIAL`. No se promovió ninguna capacidad de dominio por efecto del rediseño visual.

## Exclusiones respetadas

No se implementaron canvas BIM nuevo, selección de elementos, Info Box poblado, clash detection visual, propiedades por elemento, integración FamilyInstance o ProjectSnapshot, backend, expediente PDF definitivo, costos contractuales avanzados, Avatar, AR ni traducción completa.

## Riesgo conocido

El workspace sigue siendo un prototipo local: los cuatro accesos del gateway no constituyen autenticación de producción. Los botones y módulos fuera del alcance funcional conservan estados explícitos para evitar presentar capacidades no implementadas como terminadas.
