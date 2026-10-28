# RFC-022 — Frontend Guided Interface

**Estado:** IMPLEMENTED ON MAIN — integrado en `main@17422b2922918512dc5f93bb8371e57f0038d54a`.

## 1. Objetivo

RFC-022 define una interfaz guiada para ARKI que reduzca la curva de aprendizaje sin alterar la ontología de SICL ni transferir autoridad decisoria al frontend. El modo guiado es la experiencia inicial; el modo experto permanece disponible como preferencia explícita.

## 2. Alcance

La interfaz cubre el Camino A: `Project → Preference → Recommendation → HumanReview → Decision → Audit`. El mapa visual también expone módulos complementarios: Context/Site, Objectives & Constraints, Alternatives & Evaluation, Evidence, Evaluations, Comparisons, Council/Recommendation y Build Governance.

El mapa completo no implica que todos los módulos sean pasos obligatorios del Camino A. Cada módulo tiene estado, descripción, navegación y tooltip contextual.

## 3. Catálogos guiados

El frontend incorpora catálogos de selección para escalas espaciales, horizontes temporales, estados epistemológicos, tipos de variable, estados de factibilidad, tipos de evidencia, niveles de autoridad, roles de actores, estados de Recommendation, estados de HumanReview, estados de Decision, métodos de simulación, métodos de generación y familias de comandos.

Los catálogos son ayudas de entrada y no constituyen por sí mismos hechos, restricciones, recomendaciones ni decisiones. Sus valores deben ser validados por el Core remoto.

## 4. Experiencia de usuario

El modo guiado muestra el progreso del Camino A, identifica el siguiente paso y ofrece un recorrido inicial de tres etapas. El usuario puede abrir los módulos desde el mapa, consultar el estado actual y cambiar al modo experto. La preferencia se conserva localmente y puede revertirse en cualquier momento.

La interfaz ofrece mensajes de error en lenguaje humano, pero conserva el código técnico original para diagnóstico y trazabilidad.

## 5. Variables y factibilidad

El panel de factibilidad permite introducir una alternativa y valores de variables para solicitar evaluación al Core. Muestra estados `FEASIBLE`, `INFEASIBLE`, `UNKNOWN` e `INSUFFICIENT_DATA` y distingue restricciones duras de blandas cuando el Core devuelve esa información.

El panel no crea `Recommendation`, `HumanReview` ni `Decision`. La evaluación de factibilidad tampoco autoriza automáticamente una alternativa.

## 6. Command Bar

La Command Bar permanece disponible como herramienta opcional para usuarios expertos. El modo guiado prioriza formularios, catálogos, ejemplos y el siguiente paso. La ejecución de comandos sigue estando sujeta al contrato del Core, a la autenticación del servicio y a los invariantes de autoridad humana.

## 7. Invariantes constitucionales

1. `Fact`, `Assumption` y `Preference` permanecen epistemológicamente separados.
2. `Recommendation` no es `Decision`.
3. `HumanReview` es distinto de `Decision` y precede a una decisión autorizada.
4. El frontend no puede inventar autoridad ni convertir una sugerencia en una decisión.
5. La factibilidad no equivale a autorización.
6. Los valores de catálogo son sugerencias de entrada; el Core conserva la validación canónica.
7. La UI debe fallar cerrada cuando el Core remoto obligatorio no está disponible.

## 8. Accesibilidad y localización

Los controles tienen nombres accesibles, foco visible, estados `aria-expanded` y `aria-live` donde corresponde. Los catálogos y mensajes se localizan en español, inglés, portugués, italiano, francés, alemán, ruso y chino.

## 9. Integración remota

El frontend consume métodos del cliente SICL para crear y listar variables, evaluar factibilidad y solicitar el frente Pareto factible. El token del servicio permanece exclusivamente en el servidor. No se introduce fallback silencioso para producción.

## 10. Verificación

La implementación debe verificarse con typecheck, suite completa, build de producción y `git diff --check`. La integración final requiere además ejecutar la suite del Core RFC-019/020/021 y comprobar que los contratos HTTP se mantienen alineados.

## 11. Limitaciones

La interfaz guiada no reemplaza la revisión profesional de arquitectura, la revisión normativa ni la autoridad del Product Owner. La integración del frontend con un Core desplegado depende de que RFC-019, RFC-020 y RFC-021 hayan sido fusionados y publicados en el servicio remoto.

## 12. Firma

RFC-022 queda documentado como implementación frontend integrada en `main@17422b2922918512dc5f93bb8371e57f0038d54a`. Su validación de producción contra el Core remoto permanece condicionada a la configuración real de `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN` definida por RFC-023.


## 13. Baseline y límites actuales

La implementación está publicada en GitHub en `main@74bf4aed554555866aa58096f31b5444e47b8796`. La suite frontend reporta `120/120` tests pasando, typecheck PASS, build PASS y `git diff --check` PASS. No existe un RFC-024 implementado ni una rama RFC-024 publicada.
