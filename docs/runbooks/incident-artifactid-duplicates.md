# Playbook — Incidente: `artifactId` duplicado globalmente

**Severidad:** CRITICA. **Contrato:** ADR-0001. **Time-box: 2h.**

## Fase 0 — Deteccion (T+0)

Sintomas:
- Test `rejects globally duplicated artifactId across owners` falla.
- Test `rejects duplicate artifactId for the same owner in the same project` falla.
- En produccion: dos filas con el mismo `artifactId` en `parametric_files`.

Accion inmediata:
1. Confirmar severidad: produccion? cuantos duplicados?
2. Abrir canal de incidente.
3. NO ejecutar dedupe todavia.

## Fase 1 — Contencion (T+0 a T+15 min)

Verificar que V10 esta aplicado:

    cd /home/arki/ARKI/canonical/sicl-web
    grep -q 'memoryParametricFiles.has(file.artifactId)' server/db.ts && echo "MEMORIA_V10=yes" || echo "MEMORIA_V10=no"
    grep -q 'canArchiveParametricFile' server/db.ts && echo "ARCHIVE_GUARD=yes" || echo "ARCHIVE_GUARD=no"

Si `MEMORIA_V10=no`: re-aplicar V10 ya (ver `docs/runbooks/artifactid.md` seccion 2).

Verificar indice SQLite (si el repo SQLite existe; en `main` no existe, no aplica):

    sqlite3 data/memory/*.sqlite "SELECT name, sql FROM sqlite_master WHERE type='index' AND tbl_name='parametric_files';" 2>/dev/null

Debe incluir `parametric_files_artifactId_unique ON parametric_files (artifactId)`.

## Fase 2 — Diagnostico (T+15 a T+45 min)

Determinar causa:
- V10 se revirtio? -> re-aplicar.
- Indice SQLite compuesto? -> `.mo84` aplicado por error -> NO recrear hasta dedupe.
- Datos legados? -> dedupe.

## Fase 3 — Deduplicacion (T+45 a T+90 min)

No hay script de dedupe en `main` (V11-V16 no existen). Dedupe manual:

    # Dry-run: ver duplicados
    sqlite3 data/memory/*.sqlite "
      SELECT artifactId, COUNT(*) AS n, GROUP_CONCAT(DISTINCT ownerId) AS owners
      FROM parametric_files GROUP BY artifactId HAVING COUNT(*) > 1;
    "

    # Backup
    cp -a data/memory/*.sqlite data/memory/backup-dedupe-$(date +%Y%m%d-%H%M%S).sqlite

    # Renombrar perdedores (manual, revisar antes)
    # UPDATE parametric_files SET artifactId = artifactId || '__dup_' || ownerId || '_' || id WHERE id = ?;

## Fase 4 — Verificacion (T+90 a T+120 min)

    pnpm check
    node node_modules/vitest/vitest.mjs run server/db.memory.parametric-files.test.ts server/parametric/archiveAuthorization.test.ts --reporter=verbose
    git rev-parse HEAD

Esperado: `TYPESCRIPT_EXIT_CODE=0`, 11 tests PASS, HEAD sin cambios.

## Fase 5 — Post-mortem

Documentar en `docs/postmortems/YYYY-MM-DD-artifactid-duplicates.md`:
- Timeline.
- Causa raiz.
- Impacto.
- Acciones correctivas.
