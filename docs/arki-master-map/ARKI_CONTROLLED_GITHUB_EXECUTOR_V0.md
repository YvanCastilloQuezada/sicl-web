# ARKI — Ejecutor GitHub controlado V0

**Estado:** puerta de verificación implementada en GitHub; **no es todavía un ejecutor que escriba o corrija código automáticamente**. La Maqueta Viva funciona sin red. Su autorización local `AUTORIZO` permite preparar una orden, no autoriza merge ni promoción canónica.

## Secuencia obligatoria

1. En Evolución 05 / Autocorrectivo: registrar caso AC-n, evaluar impacto y autorizar la preparación. Exportar JSON.
2. Crear una **rama de corrección separada** basada en `feat/f7-f8-integral-closure` (nunca `main`). Proponer cambios únicamente en archivos expresamente autorizados. Crear `tools/maqueta-viva/executor-scope.json` en esa rama con el esquema inferior.
3. Abrir PR **hacia** `feat/f7-f8-integral-closure`. El manifest declara `baseSha` exacto de la rama destino y lista de rutas **exactas** (sin comodines). Si cambia el SHA de base, actualizar la propuesta y revalidar. Prohibidas modificaciones de archivos de autoridad canónica, workflows, script de seguridad, lockfiles, AGENTS.md; prohibidas eliminaciones y renombres; máximo 12 archivos autorizados más el manifest.
4. Con el SHA final del PR, el propietario del repositorio publica un comentario **exacto**: `ARKI-AUTHORIZE-SHA: <SHA_DE_40_CARACTERES>`. Cualquier commit nuevo invalida esa autorización.
5. Configurar la variable GitHub `ARKI_RED_TEAM_GITHUB_LOGIN` con un revisor independiente autorizado para dar fe de la auditoría de **Qwen (Equipo Rojo)**. Debe existir un GitHub PR review `APPROVED` de esa identidad **en el SHA exacto**. El informe de Qwen debe adjuntarse y revisarse por separado: un GitHub APPROVED no demuestra por sí mismo que Qwen ejecutó una auditoría.
6. GitHub Actions ejecuta, con permisos **solo lectura**, comprobación SHA y alcance, instalación congelada, `pnpm check`, `pnpm test -- --run`, `pnpm build`, y las verificaciones de autorización y revisor. El artefacto es un recibo de alcance, no un certificado de aceptación.
**Re-ejecución:** si la autorización del propietario o la revisión independiente llegan después de que el workflow haya fallado, utilizar **Re-run failed jobs** en GitHub Actions sobre el mismo PR/SHA. No crear commits para forzar un reintento: cambiaría el SHA y exigiría nueva autorización y revisión.

7. **Aceptación o reversión:** todavía es una operación externa y explícita. El workflow no hace merge, push, cambios en estados FROZEN ni rollback. Hacen falta comprobación de PR/CI, decisión independiente y evidencia de la reversión o aceptación. Las reglas de protección de ramas deben configurarse en GitHub Settings: el workflow por sí solo no impide merges manuales.

## Manifest de alcance

Agregar a la rama del PR, como archivo nuevo `tools/maqueta-viva/executor-scope.json`:

```json
{
  "schema": "ARKI-EXECUTOR-SCOPE-1",
  "caseId": "AC-1",
  "phase": "F7",
  "repository": "YvanCastilloQuezada/sicl-web",
  "baseBranch": "feat/f7-f8-integral-closure",
  "baseSha": "REEMPLAZAR_POR_SHA_REAL_DE_40_CARACTERES",
  "allowedPaths": ["shared/archivo-autorizado.ts"],
  "noCanonicalPromotion": true,
  "requiresRedTeam": true,
  "requiresOwnerAuthorization": true,
  "testCommands": ["pnpm check", "pnpm test -- --run", "pnpm build"]
}
```

El manifest es una **declaración de alcance, no una autorización**. Se admite como única excepción añadida al diff fuera de la allowlist; su contenido queda incluido en el SHA final del PR. No se aceptan rutas ambiguas.

## Estados y límites

- `BLOCKED`: falta SHA, alcance, pruebas, autorización del propietario o revisión independiente.
- `SCOPE_PASS`: solo alcance y SHA comprobados; no significa que las pruebas hayan pasado.
- `AWAITING_TESTS_AND_MANUAL_DECISION`: comprobación de comentarios/review, aún sujeto al resultado del workflow y aceptación externa.
- `ACCEPTED` / `REVERTED`: **V0 no los emite**. Requieren acción externa, pruebas y evidencia de decisión.

**NO EVIDENCIA = NO VERDE.** No confundir PROPUESTO, AUTORIZADO, EJECUTADO, VERIFICADO y ACEPTADO. El roadmap oficial es de solo lectura en este circuito.
