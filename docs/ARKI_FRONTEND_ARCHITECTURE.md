# ARKI / SICL — Arquitectura del Frontend

**Versión documental:** 2.2 + Guided UX

## 1. Propósito

El frontend `sicl-web` es la interfaz operativa de ARKI. Presenta el contexto del proyecto, guía el recorrido mínimo Camino A, consulta el Core remoto y expone herramientas de ayuda para aprender SICL. No es la autoridad del dominio y no sustituye la validación del Core.

## 2. Distinción fundamental

**ARKI** es el sistema de inteligencia de diseño espacial multiescala. Define el contexto de decisión, la organización de entidades, la trazabilidad y la relación entre escalas.

**SICL** es el Spatial Intelligence Command Language. Define la sintaxis formal de las operaciones que el usuario puede enviar al Core. La Command Bar traduce la interacción de la interfaz en comandos canónicos; no traduce ni modifica la semántica del protocolo.

El Core conserva la autoridad sobre persistencia, invariantes ontológicas, revisión humana y decisiones. El frontend solo presenta, solicita y explica resultados.

## 3. Camino A y mapa de módulos

El Camino A es el flujo mínimo: `Project → Preference → Recommendation → HumanReview → Decision → Audit`. El menú y el mapa visual contienen diez módulos porque agregan superficies complementarias: `Context / Site`, `Objectives & Constraints`, `Alternatives & Evaluation`, `Evidence`, `Evaluations`, `Comparisons`, `Council / Recommendation`, `Decision & Audit` y `Build Governance`.

El mapa es interactivo. Cada módulo enlaza a su ruta o ancla y, en modo principiante, muestra un preview emergente con una explicación y el estado `Activo` o `Disponible`. Los previews son informativos y no mutan estado.

## 4. Modos de experiencia

El modo guiado es el valor inicial. Muestra el mapa, el siguiente paso, tooltips, el recorrido de incorporación y mensajes de ayuda. El modo experto reduce la guía visual sin cambiar permisos, comandos ni reglas del Core. La preferencia se conserva localmente en `sims-dei-experience-mode`.

El recorrido inicial tiene tres momentos: comprender el mapa, abrir y usar la Command Bar y avanzar mediante el siguiente paso sin omitir HumanReview. Se puede omitir y completar una sola vez mediante `sims-dei-guided-tour`.

## 5. Ayuda y comandos

El Help Center se alimenta de `client/src/content/commands-catalog.json`, que representa el catálogo de comandos expuesto por `/HELP`. La búsqueda filtra nombres, sintaxis y categorías; ofrece sugerencias en tiempo real, resalta coincidencias y conserva hasta seis búsquedas recientes en `sims-dei-help-search-history`.

La Command Bar se abre con `Ctrl+K` o `Cmd+K`. La interfaz puede mostrar descripciones, argumentos y ejemplos, pero el comando ejecutado sigue siendo el comando SICL canónico. Los alias localizados son una ayuda de entrada y no una nueva semántica del Core.

## 6. Integridad y autoridad

Una Recommendation no es una Decision. Una Decision requiere HumanReview, actor y authority. El frontend no habilita atajos para saltar esa secuencia. Los errores del Core se pueden humanizar para facilitar la comprensión, pero el código técnico original no se pierde.

La distinción entre Fact, Assumption y Preference permanece visible en formularios y documentación. La interfaz no convierte una categoría epistemológica en otra.

## 7. Verificación de controles

Los controles interactivos deben cumplir cuatro condiciones: tener una acción visible, disponer de foco accesible, producir una navegación o cambio observable y conservar una ruta de retorno. Los desplegables deben abrir y cerrar con clic y teclado; los selectores deben mostrar la opción seleccionada; los enlaces del mapa deben resolver a una ruta o ancla válida.

La verificación automatizada cubre HelpButton, manuales, Command Bar, i18n, GuidedShell, páginas de Fase A y visualizaciones. La verificación de entrega requiere `pnpm test -- --run`, `pnpm check`, `pnpm build` y `git diff --check`.

## 8. Límites

El frontend no debe almacenar secretos del Core, inventar entidades, crear decisiones, usar fallback silencioso ni presentar un preview como evidencia persistida. El dominio público depende del binding de publicación WebDev; el preview es la referencia operativa verificable cuando el dominio no está disponible.
