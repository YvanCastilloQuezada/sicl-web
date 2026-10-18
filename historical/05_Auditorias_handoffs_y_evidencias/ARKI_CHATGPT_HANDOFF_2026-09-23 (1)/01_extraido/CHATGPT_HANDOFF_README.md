# ARKI — Paquete completo para ChatGPT

**Fecha:** 2026-09-23  
**Propósito:** entregar a ChatGPT el contexto acumulado, contratos, auditorías, estado real, evidencias y código de ARKI.

## Estado de gobierno

- Baseline de BKH-0: `c62183a5904f02aa0a935572454a5a35f9d167aa`.
- BKH-0: **VERIFIED**.
- BKH-1: bloqueado; requiere autorización posterior del Product Owner.
- E5: congelado como `E5-PREVIEW / FREEZE`.
- E6: congelado como `PARTIAL / IMPLEMENTATION FREEZE`.
- E7: ciclo 1/ciclo 2 documentados como `PARTIAL`.
- E8: pausado; no iniciado.
- No iniciar Academy/Tutor, Avatar, Luka, WebXR, nuevos kernels científicos ni nuevas disciplinas dentro de BKH.

## Instrucción para ChatGPT

Lee primero:

1. `BKH0_REPORT.md`
2. `BKH0_FORENSIC_MAP.md`
3. `BKH0_CANONICAL_OWNERSHIP_MAP.md`
4. `BKH0_MUTATION_PATH_MAP.md`
5. `BKH0_INVARIANT_REGISTRY.md`
6. `BKH_CONTRATO_CHATGPT_V1.md`
7. `RESUMEN_IMPLEMENTACION_ARKI_2026-09-23.md`

Después utiliza los documentos de E1-E8, E5/E6/E7, roadmap, flujo de trabajo y controles funcionales para recuperar el contexto completo.

## Regla estricta

No confundas documentación con implementación. No declares una capacidad como completa sin código, prueba y output real. No propongas crear una segunda entidad si ya existe una entidad parcial: primero clasifica `REUSE`, `EXTEND`, `CONSOLIDATE`, `DEPRECATE` o `CREATE`.

No ejecutes BKH-1 con este paquete. El siguiente paso permitido es una decisión explícita del Product Owner sobre BKH-1.

## Contenido del ZIP

El archivo contiene:

- Documentos estratégicos, contratos y addenda.
- Auditorías, veredictos y reportes E1-E8.
- Los doce entregables BKH-0 y sus outputs crudos.
- Código fuente `client`, `shared`, `server` y `scripts`.
- Fixtures y contratos necesarios para revisar las implementaciones.
- `CHATGPT_HANDOFF_FILELIST.txt`, con el inventario exacto del paquete.
- `CHATGPT_HANDOFF_SHA256SUMS.txt`, con hashes de los archivos incluidos.

Se excluyen `node_modules`, `.git`, `dist`, cachés y ZIPs previos para evitar duplicación y peso innecesario.

## Auditoría AKI-001 incluida

El paquete también contiene la auditoría diagnóstica `AKI001_*`. Esta auditoría reconstruye exclusivamente desde evidencia local qué ha estudiado ARKI, qué puede demostrar, qué aportó el arquitecto mentor y qué deficiencias permanecen. AKI-001 no modifica el Core, no modifica BKH y no inicia materias nuevas.
