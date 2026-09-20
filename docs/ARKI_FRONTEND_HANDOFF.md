# Handoff operativo del frontend ARKI

**Repositorio:** `YvanCastilloQuezada/sicl-web`
**Main fusionado:** `f74bf6e7637fa1483b0e1e27a7efa23664858735`
**Checkpoint WebDev:** `manus-webdev://6abca7fe`

## Propósito

El frontend es la capa de interacción de ARKI. Su prioridad es reducir la curva de aprendizaje y conservar visibles las fronteras de autoridad. Guided Mode es el modo inicial. Expert Mode es una preferencia configurable.

## Capacidades entregadas

- Camino A guiado.
- Mapa interactivo de módulos.
- Catálogos guiados y formularios que generan comandos.
- Command Bar con búsqueda, descripciones, argumentos y ejemplos.
- Alias localizados en ocho idiomas como capa de interfaz.
- Help Center con búsqueda, sugerencias, historial y tooltips.
- Tour inicial de tres pasos.
- Etiquetas `Fact`, `Assumption` y `Preference`.
- Visualizaciones Pareto y Event Timeline.
- Estados de carga, skeletons y Core no configurado.
- Mock mode explícito para pruebas sin Core remoto.
- Proxy server-side para ocultar el token.
- PDFs de manuales sincronizados desde el Core.

## RFC relevantes

RFC-015 define el frontend funcional. RFC-022 define la interfaz guiada. RFC-023 define conectividad segura. RFC-024 define cierre operativo local/mock. RFC-019 del frontend define alias localizados; no cambia la gramática canónica del Core.

## Variables server-side

```text
SICL_CORE_URL=https://<core-real>
SICL_CORE_SERVICE_TOKEN=<token-real>
```

Nunca utilice el token como `VITE_*`. Si falta `SICL_CORE_URL`, debe mostrarse `Core no configurado. Contacta al administrador.` y no debe intentarse un fallback Railway.

## Verificación local

```bash
pnpm test -- --run
pnpm check
pnpm build
git diff --check
```

Resultado del baseline transferido:

```text
126 tests passed
typecheck PASS
build PASS
git diff --check PASS
```

## Sincronización documental

Desde el frontend:

```bash
SICL_CORE_PATH=/ruta/a/sicl-core bash scripts/sync-manuals.sh
```

El script copia `USER_MANUAL.md`, `OPERATIONS_MANUAL.md` y `COMMANDS_REFERENCE.md`, y regenera los tres PDFs de `client/public/manuals/`.

## Reglas de UX y autoridad

Una recomendación se presenta como análisis. Una decisión exige HumanReview aprobada. Un error de infraestructura no debe presentarse como error ontológico. Una propuesta de Ollama debe indicar que está en `PREVIEW_ONLY`.

El frontend puede ayudar a aprender SICL, pero el comando canónico y la validación real pertenecen al Core.

## Pendientes

- Configurar el Core remoto real.
- Ejecutar E2E frontend → Core.
- Confirmar persistencia después del reinicio del servicio remoto.
- Configurar Ollama productivo si se requiere Copilot.
- No declarar Revit/Archicad nativos sin sus hosts y SDKs.

## Referencias

- `docs/ARKI_FIRST_CONTACT_MANUAL.md`.
- `docs/DOCUMENTATION_COHERENCE_2.11.md`.
- `docs/HELP_SYSTEM.md`.
- `docs/RFC-023_CORE_CONNECTIVITY_AND_DEPLOYMENT.md`.
- `docs/PROJECT_CLOSURE_REPORT.md`.
- `client/src/components/GuidedShell.tsx`.
- `client/src/components/CommandBar.tsx`.
- `server/coreHttpClient.ts`.

## References

[1]: https://github.com/YvanCastilloQuezada/sicl-core "SICL Core repository"
[2]: https://github.com/YvanCastilloQuezada/sicl-web "ARKI web repository"
