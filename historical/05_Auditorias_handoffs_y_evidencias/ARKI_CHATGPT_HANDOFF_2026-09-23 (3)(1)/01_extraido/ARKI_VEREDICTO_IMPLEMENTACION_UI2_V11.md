# ARKI — Acta de implementación UI-2 v1.1

**Estado:** APPROVE WITH EVIDENCE  
**Fecha:** 22 de septiembre de 2026.  
**Alcance:** opción B, migración estructural del Generador integrado.

## Implementación realizada

Se convirtió `Home.tsx` en un orquestador ligero y se creó el conjunto de módulos `GeneratorModule`, `BimModule`, `DossierModule` y `MetricsModule`. Se añadió `ProjectContext` para conservar el `GeneratedBuilding` activo entre las pestañas del shell. El shell monta el Generador, Modelo BIM y Expediente según la pestaña activa; los módulos aún no autorizados conservan su `EmptyModuleState` explícito.

El módulo Generador conserva generación, guardado, restauración, comparación, vistas Planta/Corte/3D y exportaciones. El módulo Modelo BIM muestra el modelo constructivo, inventario de elementos, métrados resumidos, 5D, simulación 4D, clashes tipificados, importación S10 y exportación IFC semántica. El módulo Expediente muestra especificaciones, encofrados, APU/5D, RNE y descarga Markdown.

Se aplicó la **Paleta Propuesta B** únicamente a los tokens `--arki-*` del workspace y gateway. Se conservaron los tokens propios del canvas del generador. No se modificaron `shared/`, `client/src/i18n/` ni backend.

## Verificaciones

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm build` | PASS |
| Tamaño JS generado | 742.30 kB; dentro del máximo de 757 kB |
| Tests de dominio 1A–1C | PASS |
| Tests profesional y expediente | PASS |
| Tests de serialización, coherencia, presupuesto y recálculo | PASS |
| Matriz de acceso | PASS; 64 casos |
| Estados de módulos | PASS; 16 módulos |
| Catálogo i18n | PASS; 8 idiomas |
| `test-modules-mount.ts` | PASS |
| Navegación Generador | Verificada en preview |
| Navegación Modelo BIM | Verificada en preview con datos generados |
| Navegación Expediente | Verificada en preview con especificaciones, encofrados y RNE |
| Planta, Corte, 3D y Presupuesto | Verificados como estados explícitos según alcance UI-2 |

## Límites respetados

No se implementó canvas BIM nuevo, selección de elementos, Info Box poblado, clash detection visual, propiedades por elemento, nueva integración con `FamilyInstance` o `ProjectSnapshot`, backend, expediente PDF, costos contractuales, realidad aumentada, Avatar ni i18n completo.

## Estado posterior

UI-2 queda lista para cierre con evidencia. Modelo BIM, Expediente, Clashes y 4D mantienen los estados parciales definidos por contrato cuando no existe todavía selección visual, PDF definitivo o coordinación gráfica. UI-3 a UI-6, UI-1.5 y Avatar permanecen fuera de esta entrega.
