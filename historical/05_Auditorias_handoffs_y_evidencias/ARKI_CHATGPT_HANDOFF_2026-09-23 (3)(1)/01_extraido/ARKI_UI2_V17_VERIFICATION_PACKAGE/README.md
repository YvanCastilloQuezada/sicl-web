# ARKI UI-2 v1.7 — PATCH NOW 10

## Estado

PATCH NOW 10 fue aplicado y verificado con compilación, regresión de dominio y pruebas específicas. UI-2 queda **APPROVE WITH EVIDENCE para PATCH NOW 10**, no como BIM completo.

## Cambios ejecutados

1. Se corrigió el montaje de `DossierModule`: la condición canónica ahora es `activeModule === "EXP-TEC"`.
2. Se eliminó del Navigator el bloque de perfil activo, el motor local y los badges de estado por módulo.
3. Se añadió al pie compacto del Navigator el proyecto, versión, cantidad de módulos y advertencias.
4. Se limpió el status bar: conserva motor, versión y advertencias.
5. Se limpió la toolbar: conserva nombre del módulo y acciones.
6. Se eliminó `PERFIL LOCAL` del badge superior.
7. Se compactó el Generador: título de una línea y subtítulo breve; se eliminaron los eyebrow y contadores solicitados.
8. Se implementó layout fijo `240px minmax(0, 1fr) 260px`, con colapso responsive del Info Box a 1050px y de laterales a 720px.

## Evidencia

- `pnpm check`: PASS.
- `pnpm build`: PASS.
- Regresión de dominio/profesional/técnica/serialización/coherencia/presupuesto/recalculation: PASS.
- Matriz de acceso, estados, i18n, montaje de módulos y taxonomía: PASS.
- `test-no-inherited-cleanup.ts`: PASS.
- `test-dossier-mount.ts`: PASS.
- `test-navigator-layout.ts`: PASS.
- Verificación visual del workspace de tres columnas y selección de EXP-TEC realizada en preview.

## Limitaciones

El Info Box todavía no recibe una selección semántica real del canvas. Los módulos Planta, Corte y 3D continúan siendo estados conceptuales cuando no existe un modelo conectado. La autenticación mostrada sigue siendo local/prototipo. Estas limitaciones pertenecen a UI-3 o a fases posteriores y no se declaran como resueltas por este parche.
