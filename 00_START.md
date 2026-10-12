# 00_START — ARKI / ARQUI · continuidad y auditoría
Fecha: 2026-10-12
Estado: BORRADOR DE RECUPERACIÓN EN RAMA EXPERIMENTAL; NO CANÓNICO; NO FROZEN
Propósito: punto de entrada verificable para el siguiente chat. No sustituye otros 00_START existentes fuera de esta rama.


## PRINCIPIO FUNDACIONAL PRIORITARIO — ARKI DETERMINISTA / SICL (declaración del Product Owner, 2026-10-12)
**Instrucción expresa del Product Owner:** «ARKI es determinista. Eso es lo que lo hace distinto». Identifica a «SILC, S-I-L-C» como motor de búsqueda determinístico. **No borrar ni reinterpretar esa denominación sin investigación**.
**Contraste con fuente fundacional:** `docs/ARKI_AND_SICL_FOUNDATIONS.md` define **SICL** (S-I-C-L, Spatial Intelligence Command Language) como lenguaje formal de operación verificable del Core, con validación y persistencia canónica en `sicl-core`; no lo define literalmente como motor de búsqueda. Por tanto, **SILC (motor de búsqueda, según Product Owner) vs SICL (lenguaje formal, según documento) = NOMENCLATURA / IDENTIDAD TÉCNICA POR RECONCILIAR**. No asumir que son lo mismo ni inventar un motor nuevo.
**Invariante objetivo de determinismo, pendiente de prueba:** ante idéntica versión de código, estado inicial, entradas, reglas, parámetros, semillas y fuentes fijadas, el camino canónico de ARKI debe producir resultados reproducibles y rastreables; toda aleatoriedad o IA externa debe registrarse/aislarse y no promocionarse como verdad canónica sin verificación. Este criterio es una propuesta operacional de prueba, **no una certificación de determinismo E2E ya alcanzado**.
**Autoridad única:** un sistema ARKI, una autoridad arquitectónica semántica D-2, una autoridad geométrica AGK, Core para estado/validación, y revisión humana para decisiones. Los maestros externos y ACS son laboratorios/adaptadores subordinados, nunca motores canónicos paralelos. NO_NEW_ENGINE; NO_AUTOMATIC_CANONIZATION.
**Fuentes recuperadas:** `docs/ARKI_AND_SICL_FOUNDATIONS.md`, `docs/arki-knowledge/fundamental-research/FKCG-02/FKCG-02_FUNDAMENTAL_KNOWLEDGE_PRESERVATION.md`, `sicl-core/docs/ARKI_CORE_FROZEN_v1.0.md`, `docs/arki-master-map/AGK_OCCT_EXECUTION_EVIDENCE_V1.md`, `sicl-core/docs/rfc/RFC-037-MULTI-ENGINE-ABSORPTION-DOCTRINE.md`.
**Inventario detallado:** `docs/arki-master-map/ARKI_SUPERPOWERS_AUDIT_2026-10-12.md` incluye cinco SP oficiales, AGK/OCCT y deltas, Dynamo/Grasshopper/Revit/IFC, leyes de autoridad y límites de ejecución.
**Próxima tarea:** localizar implementación, pruebas y genealogía de la búsqueda determinística SILC/SICL; comparar replay, orden de resultados, hashes, idempotencia y efectos de proveedores externos; registrar SHA exacto y CI. No declarar probado sin ejecutar.


## DECISIÓN DE DISEÑO PROPUESTA POR PRODUCT OWNER — FASE 1: ENCARGO ÚNICO (2026-10-12)
**Orden conceptual:** la jerarquía de diez fases debe comenzar en Fase 1 con recepción del encargo/intención del cliente. Ejemplo: «Diseñar un rascacielos de 120 pisos». El concepto de proyecto nace y se registra allí, no en una capa externa por encima de las diez fases. Fases 2–10 continúan el proceso interno conforme a sus definiciones oficiales (nombres y correspondencia por verificar; no inventar fases).
**Contrato propuesto de Fase 1:** solicitud original literal, intención/idea del cliente, escala y tipología, programa preliminar, sitio y jurisdicción conocidos o UNKNOWN, objetivos y preferencias, restricciones conocidas con fuentes, supuestos explícitos, conflictos/preguntas, identificación del proyecto, procedencia y versión, revisión humana requerida cuando aplique. Separar la idea recibida del concepto arquitectónico desarrollado y evaluado posteriormente.
**Flujo:** FASE 1 / ENCARGO → D-2 autoridad semántica → Project State / Core / trazabilidad → ejecución gobernada de FASES 2–10 → AGK único para geometría canónica → representaciones 2D/3D/BIM/IFC. SICL/SILC nomenclatura por reconciliar; determinismo de entradas, reglas, estado y resultados por demostrar E2E.
**No confundir:** «todo en Fase 1» significa **un punto de captura de toda la información disponible**, no ejecutar allí todas las actividades, ni declarar datos desconocidos como hechos, ni introducir motor adicional. Mantener fases como jerarquía, vertebra/espinas y dependencias actualizables; una nueva idea posterior se versiona y propaga mediante autoridad, no reinicia ni modifica FROZEN silenciosamente.
**Estatus:** DECISIÓN DE INTENCIÓN / PROPUESTA DE CONTRATO, NO IMPLEMENTADA NI VALIDADA. Auditar mapa de diez fases existente y su interfaz antes de cambiar código o numeración.

## Orden de trabajo
1. Auditar y conectar Maqueta Viva, Plano Vivo, Árbol Vivo y Árbol Gemelo Digital, con estado único y evidencia.
2. Auditar ADN de Mejora Continua: observación → déficit → hipótesis → alternativas → pruebas autorizadas → comparación → aprendizaje trazable. Sin autopromoción ni mutación FROZEN.
3. Cerrar continuidad: descubrir el 00_START original si existe fuera de GitHub, reconciliar este borrador, comprobar generación de handoff y lectura por otro chat.
4. Posponer recuperación gráfica hasta después del cierre de continuidad; no perder inventario histórico de capacidades.

## Repositorios y ramas inspeccionados (GitHub)
- WEB: YvanCastilloQuezada/sicl-web, main SHA ec6ede75a13e6a346816dfd96816272926a575b9, observado 2026-10-12.
- Rama experimental: feat/arbol-vivo-autoensamblaje-20261011, SHA de inspección 03438511975da868a94bcb17f30d3a30103c7907.
- CORE: YvanCastilloQuezada/sicl-core. Integración con WEB NO VERIFICADA en esta auditoría.
- No mezclar MiLukita; proyecto independiente.

## Evidencia real recuperada
- En main no se encontró tools/maqueta-viva ni 00_START en raíz. La rama experimental sí incluye tools/maqueta-viva, ARBOL-GEMELO-DIGITAL.md, scripts de descubrimiento, ADN y pruebas.
- tools/maqueta-viva/README.md: maqueta offline, estado local no canónico; no detecta ramas remotas automáticamente; exportación JSON requerida para respaldo.
- tools/maqueta-viva/ARBOL-GEMELO-DIGITAL.md: tres vistas documentales sincronizadas; la vista 3D es conceptual, no geometría AGK. Propagación documental, no causalidad runtime demostrada.
- tools/maqueta-viva/ARKI-ADN-MEJORA-CONTINUA-CONTRATO-PROPUESTO.md: ADN experimental A0/A1; observador local de JSON, no integrado al Core ni servicio autónomo persistente; promoción supervisada.
- docs/arki-master-map/AV_UI_001_ARBOL_VIVO_PREPARATION.md: interfaz unificada en estado PREPARATION_ONLY, sin aceptación canónica.
- GitHub Actions del SHA 0343851: ARKI Assembly Planner run 38192989124 FAILURE; ARKI Maqueta Viva smoke run 38192989034 FAILURE. NO VERDE.
- No se han ejecutado pruebas locales ni E2E en esta sesión; lectura estática + consulta CI solamente.

## Continuidad funcional buscada
Cambio real (código, ideas, evidencia, decisión) → descubrimiento incremental → clasificación con procedencia → dependencias y FROZEN → estado temporal y vista compartida → autodiagnóstico → propuesta de mejora → prueba aislada autorizada → resultado y registro → handoff verificable.
Cada flecha debe probarse; no suponer implementación por existir archivos o vistas.

## Inventario histórico y representación
- ARKI tiene capacidades históricas de programa, partido, geometría, validaciones, agentes y evaluación; su integración completa actual no está demostrada.
- HOUSE-A21: en commit histórico 0376f24, synthesizeHouseA21Configuration usa terreno fijo 24×18m y diez rectángulos con coordenadas explícitas. No demuestra diseño general autónomo.
- Se investigaban Torre/Vertical Aurora y Puente Ucayali/Pucallpa, sin expediente verificado aún.
- Funnel 16 variantes usa previews demo en versión investigada, no afirmar geometría generativa completa.
- Recuperación de representación gráfica queda en HOLD, no abandonada.
- AGK único, 3D-First, diseño multiescala, cero deudas, pruebas SHA exacto y revisión Qwen como reglas de trabajo.

## Próxima auditoría obligatoria
A. Localizar el 00_START original y fuente canónica del estado.
B. Analizar causas de ambos CI fallidos, ejecutar suites aisladas y registrar SHA, logs y cobertura.
C. Comprobar persistencia, replay, hashes, eventos, sincronización Maqueta/Plano/Árbol/Gemelo, actualizaciones de FROZEN y handoff.
D. Determinar si Plano Vivo tiene módulo real o es denominación de interfaz; UNKNOWN hasta localizarlo.
E. Verificar trigger autónomo, ciclo de aprendizaje repetido, seguridad, reversibilidad y autorización; NO declarar automejora verificada sin E2E.
F. Actualizar este documento tras pruebas; solicitar auditoría Qwen y autorización antes de promover cambios.

## Disciplina
CLAIM ≠ IMPLEMENTED ≠ EXECUTED ≠ VERIFIED ≠ FROZEN.
Sin evidencia no hay verde. Este documento es memoria de trabajo, no certificación ni reemplazo automático de la fuente canónica.

## Auditoría histórica de tres repositorios — 2026-10-12
Inventario auxiliar guardado en `docs/arki-master-map/ARKI_SUPERPOWERS_AUDIT_2026-10-12.md` (commit `eb7ae3afbb25331e06f078bdcb413b0e0465b86e`). Tres pasadas documentales/estáticas: anatomía, genealogía mediante auditorías históricas y contraste epistemológico/CI. No implica recorrido exhaustivo de commits ni pruebas E2E. Cinco superpoderes formales SP-01..SP-05; otras capacidades WEB/CORE/ACS inventariadas. Leer junto con MASTER_MAP_LIVE y MASTER_MAP_STATE. CI de rama experimental continúa con fallos históricos sin causa diagnosticada.

## FUENTE HISTÓRICA PRIORITARIA — origen, evolución y visión futura de ARKI (2026-10-12)
**Archivo localizado en WEB main:** `docs/arki-knowledge/preserved/03_ARKI_Historia_y_Evolucion_v1.0.xlsx` (Git blob SHA `4ff13995f1ffad49a2c3d022488a12ea61067ffe`, 6349 bytes). Enlace: https://github.com/YvanCastilloQuezada/sicl-web/blob/main/docs/arki-knowledge/preserved/03_ARKI_Historia_y_Evolucion_v1.0.xlsx
**Declaración del Product Owner:** este documento recoge cómo nació ARKI y lo que debe llegar a ser. **IMPORTANTE: contenido de las hojas AÚN NO LEÍDO**; la herramienta GitHub disponible rechazó la extracción del XLSX binario. No inferir contenido ni declararlo auditado.
**Próxima acción obligatoria:** materializar/descargar XLSX con un mecanismo binario válido; leer todas las hojas, contrastar origen, decisiones, cambios de nombre SICL→Vitruvio→ARKI, visión futura, autoridad y determinismo; incorporar los hallazgos documentados aquí y al mapa maestro con referencia exacta de hoja/celda. Distinguir historia, intención, implementación y evidencia.
**Otra fuente de preservación:** `docs/arki-knowledge/preserved/01_ARKI_Decisiones_y_Constitucion_v1.0.xlsx`, también pendiente de lectura integral.
