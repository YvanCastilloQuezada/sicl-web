# 00_START — ARKI / ARQUI · continuidad y auditoría
Fecha: 2026-10-12
Estado: BORRADOR DE RECUPERACIÓN EN RAMA EXPERIMENTAL; NO CANÓNICO; NO FROZEN
Propósito: punto de entrada verificable para el siguiente chat. No sustituye otros 00_START existentes fuera de esta rama.

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
