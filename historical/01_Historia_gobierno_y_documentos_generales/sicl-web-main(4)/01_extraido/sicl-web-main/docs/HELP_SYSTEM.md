# Help System

## Overview

The frontend exposes a **Help** button in the main and Phase A headers. The button opens a compact menu with the User Manual, Operations Manual, and Commands Reference. Each manual can be read inside the application, downloaded as a PDF, or opened in the canonical `sicl-core` GitHub repository.

The internal routes are:

- `/help` — manual index.
- `/help/user` — User Manual.
- `/help/operations` — Operations Manual.
- `/help/commands` — Commands Reference.

The reader uses `react-markdown` with GitHub-Flavored Markdown, heading slugs, and linked headings. Tables and code blocks are styled for a readable maximum line length of approximately 800px.

## Source files

The checked-in copies live in `client/src/content/manuals/`:

- `USER_MANUAL.md`
- `OPERATIONS_MANUAL.md`
- `COMMANDS_REFERENCE.md`

The source of truth remains the documentation in the `sicl-core` repository. The frontend copies are intentionally versioned so a deployed frontend remains self-contained and reproducible.

## Synchronization

Run the following command from the frontend repository:

```bash
SICL_CORE_PATH=/absolute/path/to/sicl-core ./scripts/sync-manuals.sh
```

If `SICL_CORE_PATH` is not set, the script looks for a sibling checkout at `../sicl-core`. The script copies all three Markdown files and regenerates all three PDFs. It fails closed when the Core checkout or any source manual is missing.

After synchronization, review the diff and commit the updated Markdown and PDF assets together:

```bash
git diff -- client/src/content/manuals client/public/manuals
git add client/src/content/manuals client/public/manuals
git commit -m "docs: sync help manuals"
```

## PDF generation

PDFs are generated with the repository utility `manus-md-to-pdf`. The generated files are published as static assets:

- `client/public/manuals/user-manual.pdf`
- `client/public/manuals/operations-manual.pdf`
- `client/public/manuals/commands-reference.pdf`

The converter derives headings and pagination from the Markdown. The PDFs are not used to render the internal article pages; they are download artifacts.

## Adding a manual

1. Add the source Markdown file to the Core documentation repository.
2. Extend `client/src/config/manuals.ts` with an ID, title, description, internal path, PDF URL, and canonical GitHub URL.
3. Copy the new Markdown into `client/src/content/manuals/` and add its PDF under `client/public/manuals/`.
4. Add the corresponding title and description under the `help` namespace in all eight locale files.
5. Add a route in `client/src/App.tsx` and a content import in `HelpArticlePage.tsx`.
6. Add tests for the new menu item, route, and translated labels.
7. Run `pnpm check`, `pnpm test -- --run`, and `pnpm build`.

## Accessibility and behavior

The Help button has an accessible label and exposes its expanded state. Keyboard focus remains visible, links opened in a new tab use `rel="noreferrer"`, and the menu does not alter Core state or make network calls. The help system is intentionally read-only.

## Known limitations

The frontend does not fetch documentation at runtime. A new Core manual requires synchronization and a frontend build. The current PDF utility provides standard Markdown pagination; it does not provide a custom cover-page template or a generated table-of-contents page independent of the Markdown headings. The Commands Reference currently tracks the dedicated documentation branch where that reference was published.


## Mapa interactivo de módulos

La página inicial muestra un mapa interactivo de los diez módulos operativos del frontend: **Project**, **Context / Site**, **Objectives & Constraints**, **Alternatives & Evaluation**, **Evidence**, **Evaluations**, **Comparisons**, **Council / Recommendation**, **Decision & Audit** y **Build Governance**. Cada módulo es un enlace navegable hacia su ruta o sección correspondiente. En modo principiante, el atributo de ayuda de cada módulo explica su función dentro del flujo.

El mapa no reemplaza el Camino A. El Camino A es el recorrido mínimo de seis pasos: `Project → Preference → Recommendation → HumanReview → Decision → Audit`. Los otros módulos aportan contexto, objetivos, alternativas, evidencia, análisis, comparación, consejo y gobernanza. `Preference` forma parte del flujo guiado aunque se opere dentro del espacio de proyecto; `Decision & Audit` agrupa dos resultados relacionados para facilitar la navegación.

## Búsqueda y autocompletado

El centro de ayuda incluye una búsqueda en tiempo real sobre el catálogo canónico de 67 comandos. La búsqueda examina el nombre, la sintaxis y la categoría de cada comando. Mientras el usuario escribe se muestran sugerencias de autocompletado; al seleccionar una sugerencia, el texto se coloca en el campo y se muestran la sintaxis completa y el enlace a la referencia de comandos.

La búsqueda es de solo lectura y no ejecuta comandos ni modifica el Core. Los resultados se generan desde `client/src/content/commands-catalog.json`, que debe permanecer alineado con la salida `/HELP` del Core.

## Modo principiante y tooltips

El modo principiante conserva el mapa y muestra tooltips breves en los módulos complementarios. El modo experto minimiza la guía y permite trabajar directamente con las superficies operativas. La preferencia se guarda en `localStorage` con la clave `sims-dei-experience-mode`. El cambio de modo muestra una notificación visual y utiliza una transición breve, respetando la accesibilidad del foco.


## Previews de estado y recorrido inicial

En modo principiante, cada módulo del mapa muestra un preview al pasar el cursor o recibir foco. El preview resume su función y distingue el módulo activo de los módulos disponibles. Al hacer clic, el enlace navega a la sección correspondiente.

El recorrido inicial aparece una vez en tres pasos. Primero explica el mapa, después la Command Bar y finalmente el uso del siguiente paso del Camino A. El usuario puede avanzar, terminar u omitir el recorrido. El estado se guarda localmente y puede restablecerse borrando `sims-dei-guided-tour`.

## Resaltado e historial de búsquedas

Las coincidencias del Help Center se resaltan visualmente en el nombre y la sintaxis del comando. Al pulsar `Enter`, la búsqueda se guarda en un historial local de hasta seis elementos bajo `sims-dei-help-search-history`. Seleccionar una búsqueda reciente la reutiliza sin modificar el catálogo ni ejecutar un comando.


## Estado vigente de integración con el Core

La interfaz guiada, la Command Bar y el Help Center son capacidades de presentación. Las llamadas al Core pasan por el proxy server-side. Nunca se expone `SICL_CORE_SERVICE_TOKEN` en el navegador.

El Core vigente incluye RFC-027 BIM/IFC, RFC-028 GIS/Catastro y RFC-029 Copiloto Ollama. El frontend puede presentar estados de `PREVIEW_ONLY`, `HUMAN_REVIEW_REQUIRED`, `CORE_UNAVAILABLE` y `CORE_UNAUTHORIZED`. La ausencia de `SICL_CORE_URL` debe mostrarse como infraestructura no configurada, no como un error ontológico.

La conexión productiva requiere configurar server-side `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN`. El manual de despliegue del Core define el procedimiento y la suite remota pendiente.


## Manual de primer contacto

La guía `ARKI_FIRST_CONTACT_MANUAL.md` está destinada a las primeras sesiones de usuarios nuevos. Presenta el momento inicial, el Camino A, las tres reglas epistemológicas y el límite entre recomendación y decisión.


## Auditoría RFC-015–026

La matriz vigente del Core se encuentra en `SICL Core current architecture matrix`. En particular, `monte_carlo_v1`, el filtro `feasible_pareto_front`, la generación evolutiva, las variables por escala, el corpus RNE y el Design Knowledge Agent deben presentarse como capacidades analíticas o de consulta, nunca como decisiones automáticas. RFC-019 de alias localizados es independiente del RFC-019 de escalas del Core.
