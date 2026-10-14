# ARKI — Validación local sin GitHub Actions (14-10-2026)

**Estado:** RUNNER_IMPLEMENTED / NOT_EXECUTED_ON_ARKI_02 / NO_CANONICAL_PROMOTION.

## Propósito

Reutiliza 13 suites de `tools/maqueta-viva` para detectar regresiones del Mapa/Árbol/Gemelo y autonomía, sin depender de runners de pago. El script **no realiza checkout, merge, push ni escrituras canónicas**; requiere Node 22, HEAD exacto y worktree limpio.

## Ejecución segura (Ubuntu ARKI-02)

Desde un clon experimental separado; **no cambiar la rama de un repositorio con trabajo activo**:

```bash
git clone --no-local /home/arki/ARKI/repositorios/sicl-web /tmp/arki-offline-ci-web
cd /tmp/arki-offline-ci-web
git fetch origin test/arki-autonomy-offline-ci-20261014
git switch --detach c7744aba22ba801758d5bf612de0d9047641d880
node --version
node tools/maqueta-viva/Run-ARKI-Offline-CI.cjs c7744aba22ba801758d5bf612de0d9047641d880 > /tmp/arki-offline-ci-result.json
echo "EXIT_CODE=$?"
```

**Nota:** el SHA y el comando solo son válidos para la versión indicada. Si Git local no tiene la rama o commit, sincronizar antes con el remoto; no forzar cambios en el árbol de trabajo principal.

## Interpretación

- `status=PASS`: únicamente suites Node enumeradas y comprobación de integridad del worktree para ese SHA; **no** E3 Windows, ACE88, geometría AGK ni simulación real.
- `status=FAIL`: leer `results[]`, `stderr`, `error`, `signal`; `MISSING` es fallo, no salto silencioso.
- `ARKI_OFFLINE_CI_FAIL`: error de precondición (SHA, Git, Node, worktree).
- Nunca promover FROZEN por la mera ejecución de estas suites.

## Auditoría de cobertura pendiente

1. Prueba adversarial de identidad y firma ACE88 de extremo a extremo.
2. Persistencia/replay de memoria tras reinicio (módulo actual en memoria, sin adapter probado).
3. Sincronización entre estado maestro y visualizaciones, incluidas dependencias.
4. E3 Windows/Edge y AGK geométrico real.
5. Reconciliación del PR #57 y del handoff `00_START.md`.

El fallo instantáneo de Actions sin runner asignado **es compatible** con bloqueo de facturación/cuota, pero no prueba una deuda específica.

## Extensión del 14-10: reconciliación y memoria

El runner offline incluye ahora **15 archivos de pruebas**: 13 originales, `test-Verify-ARKI-Journal.cjs` y `test-Reconcile-ARKI-Branches.cjs`. Los resultados siguen siendo `NOT_EXECUTED` hasta que ARKI-02 emita recibo local.

Para producir un informe de divergencias sin mutar Git:

```bash
git fetch origin
node tools/maqueta-viva/Reconcile-ARKI-Branches.cjs origin/feat/arbol-vivo-autoensamblaje-20261011 origin/feat/arki-autonomy-orchestrator-20261013 > /tmp/arki-branch-reconciliation.json
```

`potentialConflicts` es solo la intersección de rutas modificadas desde el ancestro común, **no** la detección definitiva de conflictos de merge. La reconciliación debe seguir siendo manual y revisada.

Para ejecutar todas las pruebas, usar el SHA HEAD real de la rama local y worktree limpio. La documentación anterior muestra un SHA histórico: **no usarlo como expected SHA después de estos commits**. Ejecutar `git rev-parse HEAD` y pasarlo como argumento.

La integridad de memoria no es firma ACE88 ni autenticidad externa. Ninguna prueba local sustituye E3 Windows, pruebas geométricas AGK ni autorización del PO.
