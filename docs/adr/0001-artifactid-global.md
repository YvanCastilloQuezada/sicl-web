# ADR-0001 — `artifactId` es globalmente único en `parametric_files`

- **Estado:** Aceptado
- **Fecha:** 2026-11-06
- **Contexto:** SICL Web, módulo de archivos paramétricos (`parametric_files`)
- **Decisores:** Equipo ARKI (producto + ingeniería)
- **Supera a:** backup `drizzle/schema.sqlite.ts.mo84-backup-20261104-184556` (owner-scoped), que no debe aplicarse.

## Contexto

El identificador `artifactId` de `parametric_files` ha tenido dos interpretaciones:

1. **Global** — un `artifactId` no puede repetirse, ni siquiera entre propietarios.
2. **Por propietario** (`ownerId + artifactId`) — dos propietarios pueden tener el mismo `artifactId`.

Evidencia del árbol:

| Fuente | Contrato |
|--------|----------|
| `drizzle/sqlite/migrations/0000_initial.sql:62` (vigente) | `UNIQUE(artifactId)` → **global** |
| `drizzle/schema.ts:32` (MySQL vigente) | `.unique()` → **global** |
| `server/db.memory.parametric-files.test.ts` | rechazo entre owners → **global** |
| `drizzle/schema.sqlite.ts.mo84-backup-…:86-87` | `uniqueIndex(ownerId, artifactId)` → **owner-scoped** (histórico) |
| `server/db.ts` (memoria, pre-V10) | clave `ownerId:artifactId` → **owner-scoped** (bug) |

El contrato vigente es **global**.

## Decisión

**`artifactId` es globalmente único.** Es la única fuente de verdad. Cualquier capa que no lo respete es un bug.

Consecuencias:

- `server/db.ts` (memoria) **debe** rechazar un `artifactId` ya existente, sin importar `ownerId` ni `projectId`.
- La clave del `Map` en memoria **es** `artifactId` (no `ownerId:artifactId`).
- `archiveParametricFile` en memoria **debe** comprobar `ownerId` y `projectId` explícitamente.
- El índice `UNIQUE(artifactId)` en SQLite y MySQL **no se toca**.
- Los tests de memoria que exigen rechazo entre owners **no se tocan**.
- El backup `.mo84` **no se aplica**. Se conserva como historia.

## Alternativas consideradas

### A. Owner-scoped (`ownerId + artifactId`)
Contradice esquema vigente, tests vigentes y esquema MySQL. Requiere migración de índice + cambio de tests + revisión de consumidores. Sin evidencia de que el producto lo necesite. **Rechazada.**

### B. Project-scoped (`ownerId + projectId + artifactId`)
Ningún test lo exige; consumidores no lo asumen; migración innecesaria. **Rechazada.**

### C. Global (esta ADR)
Coincide con esquema SQLite vigente, esquema MySQL, ambos tests y consumidores. Cambio mínimo: solo `server/db.ts`. Un `artifactId` no puede reutilizarse entre owners. Aceptable: `artifactId` se deriva del checksum del contenido (`server/arkiParametricRuntime.ts:43` → `${format}-${checksum.slice(7,23)}`), por lo que un mismo contenido produce el mismo `artifactId`; rechazar el duplicado es correcto (el archivo ya existe). **Aceptada.**

## Consecuencias

- **Cambio de código:** `server/db.ts` (insert + archive en memoria). Aplicado en commit `f07e2bcf`.
- **Sin migración de esquema:** SQLite y MySQL ya son globales.
- **Sin migración de datos:** el índice global ya estaba aplicado.
- **Tests nuevos:** duplicado mismo owner, colisión entre proyectos, archive cruzado.
- **Backup `.mo84`:** marcado como obsoleto.
- **Documentación:** esta ADR es la referencia.

## Referencias

- `drizzle/sqlite/migrations/0000_initial.sql:62`
- `drizzle/schema.ts:32`
- `server/db.memory.parametric-files.test.ts`
- `server/db.ts`
- `server/parametric/archiveAuthorization.ts`
- `server/arkiParametricRuntime.ts:43`
- Commit `f07e2bcf` (V10 aplicado)
- Commit `ee18cfbb` (V9-01, regresión de V8 revertida en V10)
