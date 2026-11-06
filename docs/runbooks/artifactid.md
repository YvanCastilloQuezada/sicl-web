# Runbook — `artifactId` global en `parametric_files`

**Contrato:** ADR-0001. **`artifactId` globalmente único.**

## 1. Verificación rápida (5 min)

Ejecuta:

    cd /home/arki/ARKI/canonical/sicl-web
    grep -q 'memoryParametricFiles.has(file.artifactId)' server/db.ts && echo "MEMORIA_V10=yes" || echo "MEMORIA_V10=no"
    grep -q 'memoryParametricFiles.set(file.artifactId, stored)' server/db.ts && echo "CLAVE_ARTIFACTID=yes" || echo "CLAVE_ARTIFACTID=no"
    grep -q 'canArchiveParametricFile' server/db.ts && echo "ARCHIVE_GUARD=yes" || echo "ARCHIVE_GUARD=no"
    grep -q 'ne(parametricFiles.status, "ARCHIVED")' server/db.ts && echo "LIST_NE_ARCHIVED=yes" || echo "LIST_NE_ARCHIVED=no"

Esperado: todos `yes`.

## 2. Aplicar el parche V10 (si no está aplicado)

Si `MEMORIA_V10=no`:

1. Backup:

       TS=$(date +%Y%m%d-%H%M%S)
       cp -a server/db.ts "server/db.ts.bak-$TS"
       cp -a server/db.memory.parametric-files.test.ts "server/db.memory.parametric-files.test.ts.bak-$TS"
       echo "BACKUP_TS=$TS" > /tmp/arki-v10-backup-ts.txt

2. Aplicar el diff de `docs/adr/0001-artifactid-global.md` sección "Consecuencias".

3. Verificar:

       pnpm check
       node node_modules/vitest/vitest.mjs run server/db.memory.parametric-files.test.ts server/parametric/archiveAuthorization.test.ts --reporter=verbose

Esperado: `TYPESCRIPT_EXIT_CODE=0`, 11 tests PASS.

## 3. Rollback

    cd /home/arki/ARKI/canonical/sicl-web
    TS=$(cat /tmp/arki-v10-backup-ts.txt | cut -d= -f2)
    cp -a "server/db.ts.bak-$TS" server/db.ts
    cp -a "server/db.memory.parametric-files.test.ts.bak-$TS" server/db.memory.parametric-files.test.ts

## 4. Alertas

| Alerta | Accion |
|--------|--------|
| Test `rejects globally duplicated artifactId across owners` falla | Re-aplicar V10 |
| Test `rejects duplicate artifactId for the same owner` falla | Re-aplicar V10 |
| Test `does not archive another owner's file` falla | Re-aplicar V10 |

## 5. Rotacion de token ARKI Bridge (otro repo)

    NEW=$(python3 -c 'import secrets; print(secrets.token_hex(32))')
    sudo sed -i "s|^ARKI_BRIDGE_TOKEN=.*|ARKI_BRIDGE_TOKEN=$NEW|" /etc/arki-bridge/bridge.env
    unset NEW
    sudo chmod 600 /etc/arki-bridge/bridge.env
    sudo chown root:root /etc/arki-bridge/bridge.env
    sudo systemctl restart arki-bridge

Nunca pegar el token en chat, terminal con historial, ni git commit.

## 6. Referencias

- ADR-0001: `docs/adr/0001-artifactid-global.md`
- Playbook: `docs/runbooks/incident-artifactid-duplicates.md`
- Commit V10: `f07e2bcf`
