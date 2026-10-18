# ARKI — Acta de implementación UI-2 v1.3

**Estado:** APPROVE WITH EVIDENCE  
**Product Owner:** Yvan Castillo  
**Implementación:** Manus  
**Alcance:** UI-2 opción B + PATCH NOW 6, 7 y 8.

## Correcciones aplicadas

`GeneratorModule`, `BimModule` y `DossierModule` ya no usan `.app-shell`, `.sidebar` ni `.main-content`. Los tres montan `.arki-module-body`; el Generador utiliza `.arki-generator-grid` con layout interno propio. El Navigator es fijo y overlay, por lo que el workspace padre fue corregido a dos columnas: canvas flexible + Info Box.

El tab bar dejó de tener una lista hardcodeada. Consume `availableModules`, derivado de `MODULE_DEFINITIONS.filter(({ name }) => isAccessAllowed(access, name))`. En el preview con perfil `user` se verificaron 12 módulos visibles; los estados y restricciones siguen gobernados por la matriz existente.

Se aplicó PATCH NOW 8.4: los selectores del shell, Navigator, tabs, toolbar, estado, contexto, Info Box, chip y estados de módulo quedan con tipografía mínima de 10 px, preservando tamaños mayores para jerarquías.

## Verificación

| Criterio | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm build` | PASS |
| Bundle JavaScript | 740.69 kB; menor que 757 kB |
| Regresión de dominio 1A–1C | PASS |
| Regresión profesional y expediente | PASS |
| Matriz de acceso | PASS; 4 roles × 16 módulos = 64 casos |
| Estados de módulos | PASS |
| Catálogo i18n | PASS; 8 idiomas |
| `test-modules-mount.ts` | PASS; sin layout heredado y con `arki-module-body` |
| `test-navigator-layout.ts` | PASS; tabs filtrados, overlay, toolbar, tipografía mínima 10 px |
| Generador vacío | Verificado visualmente |
| Generador con propuesta | Verificado visualmente |
| Tabs por rol | Verificado visualmente con perfil user; 12 módulos visibles |
| Navigator cerrado/overlay | Verificado visualmente |
| Modelo BIM y Expediente | Verificación de montaje conservada |
| Vista móvil 720 px | Verificada en la fase UI-2 |

## Contratos y archivos protegidos

No se modificó `shared/`, `client/src/i18n/`, backend, `MODULE_DEFINITIONS`, `isAccessAllowed`, `supportedLanguages`, `catalog` ni los contratos 1A–1C. No se añadieron entidades BIM, backend, Avatar, AR, E2E, canvas de selección ni i18n completo.

## Limitaciones vigentes

Modelo BIM, Expediente, Clashes y 4D mantienen estados `PARTIAL` según contrato. Planta, Corte y 3D mantienen estado `CONCEPTUAL`. O&M y Administración permanecen `FUTURE REFERENCE`. Costos contractuales continúan `NOT AVAILABLE`. El gateway sigue siendo un prototipo local y no reemplaza autenticación de producción.

## Veredicto

**APPROVE WITH EVIDENCE** para UI-2 v1.3. La migración estructural, el layout del Generador, la navegación por rol y la legibilidad tipográfica cumplen la Orden Maestra v1.3 sin ampliar el alcance de dominio.
