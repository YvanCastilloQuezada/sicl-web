# ARKI — Veredicto sobre la Orden Maestra UI-2

**Fecha:** 22 de septiembre de 2026.  
**Revisión:** Manus contra el código real y la decisión del Product Owner.

## Veredicto

**APPROVE — Orden autorizada para pasar a implementación, no código todavía en este documento.**

## Evidencia de revisión

La opción B coincide con la decisión formal: migración estructural y Generador integrado solamente. La orden excluye explícitamente canvas BIM nuevo, selección, Info Box poblado, clashes visuales, propiedades por elemento, backend, Avatar, realidad aumentada, i18n completo y cambios de dominio.

Los componentes que se propone extraer existen realmente en `client/src/pages/Home.tsx`: `ConstructionPanel`, `Metric` y `DossierWorkspace`. También existen en el código los contratos de UI-1 citados: `MODULE_DEFINITIONS`, `isAccessAllowed`, `MODULE_LABEL_KEYS`, `EmptyModuleState`, `supportedLanguages`, `useTranslation`, `t()` y el gateway de accesos.

La comprobación actual de TypeScript pasa con `pnpm check`. La orden conserva la regresión de los 12 comandos existentes y agrega `test-modules-mount.ts`, por lo que la aceptación queda verificable.

## Condiciones de implementación

DeepSeek debe inspeccionar nuevamente el código real antes de escribir. Si los nombres, props o firmas difieren, debe registrar la discrepancia antes de corregirla. No se autoriza tocar `shared/`, `client/src/i18n/`, backend ni contratos de dominio.

La implementación debe evitar duplicación: después de extraer los componentes, `Home.tsx` no debe conservar copias inline. El `ProjectContext` debe limitarse al `GeneratedBuilding` y su setter, sin convertirse en un nuevo contrato de dominio.

La aceptación de UI-2 requerirá los 13 outputs reales, el diff completo, manifest, riesgos, limitaciones y verificación de que las exportaciones, S10, guardado, comparación, expediente y generador siguen funcionando.

## Estados posteriores esperados

UI-2 podrá quedar `APPROVE` o `APPROVE WITH FIXES`. Modelo BIM, Expediente, Clashes y 4D permanecerán `PARTIAL` cuando corresponda. UI-3 a UI-6, UI-1.5 y Avatar seguirán bloqueados hasta una orden independiente.
