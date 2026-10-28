> **HISTÓRICO (2026-10-16).** Este documento se ha integrado como **Anexo G** en `00_REVIVIR.md` (2026-10-28). Se conserva para trazabilidad. Para el estado vigente, leer `00_REVIVIR.md`.

# ARKI-00 — MANUAL MAESTRO DE CONTINUIDAD Y REANIMACIÓN DE ARKI/ARQUI

**Fecha de corte:** 2026-10-16 (Perú)  
**Propietario del producto (PO):** arquitecto promotor de ARKI/ARQUI  
**Propósito:** entregar a un nuevo chat/agente la historia, el mapa físico de archivos, las decisiones del PO, la verdad verificable y el trabajo concreto para que ARKI cobre vida **en la interfaz ya elegida**, sin volver a crear ramas ni prototipos paralelos.  
**Estado del documento:** handoff operativo; **NO** certificación de producción ni de integración.  
**Regla de lectura:** primero este documento, después los archivos canónicos y el código; nunca deducir implementación de un nombre, un documento, un contador de pruebas o un HTTP 200.

> **ORDEN DEL PO:** «Meter ahí y borrar, meter y borrar». Recuperar lo valioso de las ramas y módulos existentes, integrarlo en el Árbol Vivo aprobado, verificar conservación y luego eliminar solamente lo redundante. No diseñar otra interfaz ni seguir abriendo ramas. El objetivo es **darle vida a ARKI**.

---

## 00. Respuesta ejecutiva obligatoria

**¿Está vivo ARKI?** A fecha de corte, **NO está acreditada su autonomía integral**. Sí está encendida una interfaz histórica de Árbol Vivo AV023 y pasan pruebas de varios módulos. No existe evidencia suficiente de un ciclo completo y conectado: autodiagnóstico real → tres experimentos reales con Core/AGK → métricas → autorización del PO en la interfaz elegida → integración controlada → persistencia/reinicio → reversión. No confundir «interfaz encendida» con «sistema vivo».

**¿Qué debe hacer el sucesor?** Terminar la integración **en la interfaz que ya decidió el PO**. Buscar primero los archivos y repositorios indicados en este documento. Inventariar qué está implementado, qué es documental y qué está aislado; incorporar componentes útiles; ejecutar una sola vertical funcional; cerrar con evidencia. No pedir al PO que vuelva a explicar la visión.

**¿Qué NO debe hacer?** No crear ramas nuevas; no desarrollar otro Árbol; no reemplazar la interfaz aprobada; no inventar resultados; no hacer cambios canónicos ni aprobaciones automáticas; no borrar ramas sin prueba de conservación; no promover hipótesis a mediciones.

---

## 01. Identidad del producto: qué es ARKI

ARKI/ARQUI es el proyecto anteriormente denominado SICL y Vitruvio. **No son tres proyectos distintos.** Es una inteligencia arquitectónica profesional multiescala que debe interpretar encargos, normas, sitio, objetivos y restricciones; aprender, razonar, diseñar, simular, comparar alternativas, evaluar, coordinar disciplinas, registrar evidencia, autocorregirse y evolucionar bajo autoridad humana.

**Escalas:** objeto y componente, interiores, edificación, conjuntos, paisaje, ciudad, macroregión, región y territorio. Cada escala tiene sus propias fuentes, normas, jurisdicciones, condiciones de aplicabilidad y validaciones. Nunca trasladar una norma de una escala a otra por analogía automática.

**Reglas de producto:** un solo núcleo geométrico **AGK**, estrategia 3D-First; no motores alternativos encadenados en runtime. Hipótesis de arquitectura del kernel congelada: **AGK = OCCT + ARKI_DELTA** (investigación/competencias de CGAL, Manifold, OpenVDB, libfive, PicoGK, SolveSpace/libslvs, Topologic, etc.). Esa fórmula es decisión de diseño, no prueba de implementación nativa completa.

**Inteligencia:** el sistema debe descubrir lo que sabe y no sabe, construir relaciones, diagnosticar déficits, formular tres soluciones, ensayarlas en el gemelo, presentar evidencia y pedir decisión. El PO **aprueba**; ARKI **propone, organiza, ejecuta de forma autorizada, aprende y registra**. La Universidad ARKI / Delta 6.2 es el cauce de adquisición y curaduría del conocimiento; conocimiento nuevo no equivale a competencia validada.

**No tocar:** MiLukita es proyecto hermano independiente. UPAO Plaza Center/UPAO-001 es un ejemplo histórico de prueba, no el objetivo actual ni el proyecto activo. No abrir un segundo AGK.

---

## 02. La interfaz gráfica que eligió el PO: UBICACIÓN EXACTA

**Esta sección es prioritaria. El sucesor NO debe buscar una interfaz nueva.**

### 02.1 Repositorio y archivo principal

Repositorio GitHub: **`YvanCastilloQuezada/sicl-web`**  
**Plantilla de interfaz aprobada que hay que completar:**  
`tools/maqueta-viva/maqueta-viva.template.html`

Buscar primero en la rama existente:
- `integration/arki-av035-main-20261015` (integración AV035);
- comparar con `experiment/arki-ideas-mapa-vivo-20261015` (trabajo posterior experimental);
- y con `feat/arbol-vivo-precedencias-seguras-20261010` (precedencias y plantilla histórica).

Enlaces directos:
- [Plantilla en integración AV035](https://github.com/YvanCastilloQuezada/sicl-web/blob/integration/arki-av035-main-20261015/tools/maqueta-viva/maqueta-viva.template.html)
- [Plantilla en rama experimental existente](https://github.com/YvanCastilloQuezada/sicl-web/blob/experiment/arki-ideas-mapa-vivo-20261015/tools/maqueta-viva/maqueta-viva.template.html)
- [Prototipo de referencia AV-UI-001](https://github.com/YvanCastilloQuezada/sicl-web/blob/integration/arki-av035-main-20261015/tools/maqueta-viva/av-ui-001-readonly-prototype.html)

**Hallazgo verificado en GitHub el 16/10:** la plantilla contiene código de la vista «02 · Maqueta Viva», el árbol de evolución F1→F10, la clase CSS `arki-tree`, relaciones y espinas, panel de información y cinco vistas conceptuales. **No se ha certificado que sea una escena Three.js 3D real.** El PO se refiere a su página/visión gráfica 3D: localizar su implementación exacta antes de afirmar que está integrada; no sustituirla por la página histórica AV023.

### 02.2 Servidor histórico que sí está encendido en ARKI-02

Ruta de checkout local:  
`/home/arki/ARKI/av023-arbol-vivo/`

Servidor Node histórico:
`/home/arki/ARKI/av023-arbol-vivo/tools/maqueta-viva/arki-av023-historical-ui.cjs`

Proceso visto en octubre:
`node /home/arki/ARKI/av023-arbol-vivo/tools/maqueta-viva/arki-av023-historical-ui.cjs /home/arki/ARKI/av023-arbol-vivo /home/arki/ARKI/continuity/arki-av017-proposal.json /home/arki/ARKI/continuity/arki-po-ledger 8768`

**URL en el navegador del propio equipo:** `http://127.0.0.1:8768/`  
La respuesta HTTP 200 incluía el título `ARKI · ÁRBOL Vivo / ÁRBOL Gemelo Digital · Prototipo aislado`.

**NO confundir puertos:** `127.0.0.1:3000` sirvió **Gitea login**, no ARKI. Una prueba Chrome MO-07B declaró tres rutas renderizadas por confundir Gitea con ARKI; el resultado fue rectificado y **E3 real sigue pendiente**. El puerto 8768 sirve **AV023 histórico**, no certifica AV036 ni el frontend definitivo.

### 02.3 Diseño visual y funcional aprobado por el PO

- **Árbol central:** tronco vertical F1 abajo hasta F10 arriba, ramas por fase, espinas/actividades, hojas/frutos de evidencia.
- **Al seleccionar una fase:** abrir por defecto columna vertebral/ruta crítica y espinas; mostrar dependencias, estado, alternativas, precedencia y urgencia.
- **Izquierda:** leyenda, aprobaciones, información; **derecha:** propuestas pendientes y alternativas; centro con scroll.
- **Madurez:** gradiente violeta→verde; rojo revisión; madurez separada de autorización. Nunca poner verde sin evidencia.
- **Vistas:** 01 Plano ARKI (estructura); 02 Maqueta Viva (piezas/fases/espinas/alternativas); 03 Gemelo Digital (estado real y sincronización); 04 Gemelo Predictivo (escenarios y métricas); 05 ARKI Autocorrectivo (diagnóstico/autorización/reversión).
- **Barra superior en orden:** Estructura · Conexiones · Roadmap · Escenarios · Inventario · Flotantes · Pendientes · Ideas Dispersas · FROZEN · Ideas ARKI · Research & Trends · Historial fuentes · Pruebas E3 Windows · buscador PIEZA con lupa.
- **Ocultar** entradas técnicas Estado/Borrador/Inventario JSON del flujo de uso normal.
- **Precedencia:** no ejecutar F10 cuando F1/F2 incompletas; detectar ciclos F2↔F6; bloquear propagación por dependencias incompletas.
- **Escala de trabajo:** ordenar ~80–100 actividades, identificar ~5 «primogénitas», urgencia, dependencias y puertas de control.
- **Tres alternativas:** mediciones reales separadas de hipótesis, impacto, coste, velocidad, calidad; PO decide en pantalla única; integración posterior con rollback.
- **Autocorrección:** inspeccionar, diagnosticar, proponer, simular, pedir aprobación, aplicar, propagar, reevaluar, registrar historial y poder revertir.
- **Sin nueva interfaz:** mejorar e integrar la seleccionada, no crear otro Command Center, clon de árbol ni otra «demo».

### 02.4 Otros archivos visuales y rutas que se deben localizar

Dentro de `sicl-web`, buscar:
`client/src/App.tsx` — rutas React;  
`client/src/pages/ArkiControlCenterPage.tsx`;  
`client/src/pages/ArkiSuperarchitectCommandCenterPage.tsx`;  
`client/src/pages/ArkiSuperArchitectViewerPage.tsx`;  
`tools/maqueta-viva/maqueta-viva.template.html`;  
`tools/maqueta-viva/av-ui-001-readonly-prototype.html`.

Rutas que aparecen en el frontend: `/control-center`, `/arki-command-center`, `/arki-super-architect`. **Estas rutas no están demostradas como la pantalla 3D oficial**. Examinar código de componentes, escena y datos antes de decidir dónde montar la integración. La plantilla de árbol aprobada es la referencia de diseño y comportamiento; la localización de la escena 3D nativa definitiva permanece por verificar.

---

## 03. Tres repositorios técnicos y tres ramas web que deben examinarse

**Repositorios verificados en GitHub:**
1. [`YvanCastilloQuezada/sicl-web`](https://github.com/YvanCastilloQuezada/sicl-web) — UI, Árbol Vivo, propuestas, coordinación web y experimentos.
2. [`YvanCastilloQuezada/sicl-core`](https://github.com/YvanCastilloQuezada/sicl-core) — Core Python, autoridad/capacidades, contratos y pruebas.
3. [`YvanCastilloQuezada/arki-acs`](https://github.com/YvanCastilloQuezada/arki-acs) — frente ACS/CAD e integración geométrica. Los tres tienen rama por defecto `main` según consulta del 16/10.

**Tres ramas web prioritarias existentes (NO crear otras):**
1. `main`: verdad publicada del repositorio, requiere contrastar SHA y contenidos; no asumir que incluye la interfaz posterior.
2. `integration/arki-av035-main-20261015`: integración candidata donde aparece la plantilla seleccionada.
3. `experiment/arki-ideas-mapa-vivo-20261015`: módulos recuperados REC-001/002/003/006 y pruebas MO-04..MO-07.

**Ramas históricas auxiliares que pueden contener material exclusivo:** `feat/arbol-vivo-precedencias-seguras-20261010`, `feat/arbol-vivo-functional-repair-20261014`, `feat/arki-autonomy-orchestrator-20261013`, `feat/arki-autonomy-memory-main-20261013`, `feat/arki-master-map-live-v1`, `feat/agk-001-operational-spine`, `feat/arki-frontend-assembly-v1`, `audit/mapa-arbol-gemelo-reconciliacion-20261014`, `feat/arki-operational-vitality-mo05-20261015`, `experiment/arki-ideas-web-20261015`. Son **fuentes a revisar**, no nuevos destinos. Comprobar presencia y SHA actuales antes de operar.

**Inventario de ramas:** una auditoría anterior reportó 92 examinadas, 52 eliminadas y 40 conservadas; una consulta posterior de GitHub mostró una lista distinta/más amplia de nombres. Por tanto, **NO tratar 40 como conteo actual** sin una consulta fresca. La consolidación de código/documentos/pruebas/ideas antes de la poda **NO está cerrada**. No borrar ramas por su antigüedad ni por nombre; conservar blobs, historia y procedencia.

---

## 04. Dónde buscar los archivos fundacionales y el conocimiento

### 04.1 Mapa Maestro (entrada canónica documental)

En `sicl-web`, buscar:
`docs/arki-master-map/ARKI_MASTER_MAP_LIVE.md`  
`docs/arki-master-map/ARKI_MASTER_MAP_STATE.json`

El documento `ARKI_MASTER_MAP_LIVE.md` declara ser el **punto canónico de continuidad** para web, Core, ACS y AGK; no convierte declaraciones documentales en implementación. El JSON observado tenía fecha `updated_at=2026-10-07` y hablaba de F7, por lo que **puede estar desactualizado** respecto a F1–F10 posteriores. Revisar historial y fuentes de verdad antes de actualizarlo.

Otros puntos de entrada:
`README.md`; `docs/ARKI_FRONTEND_HANDOFF.md`; `docs/ARKI_PROJECT_HANDOFF_2026-09-16.docx`; `docs/arki-knowledge/`; `docs/arki-predictive/R1_ARCHITECTURE_ENGINEERING_HANDOFF.md`; `docs/arki-architecture/`; `tools/maqueta-viva/ARBOL-GEMELO-DIGITAL.md`.

Buscar literalmente nombres: `FROZEN`, `DELTA`, `D6.2`, `D6.3`, `AGK`, `OCCT`, `ACE88`, `ARKI_MASTER_MAP`, `ARBOL-GEMELO-DIGITAL`, `FOUNDATION`, `FUNDACIONAL`, `handoff`, `source`, `provenance`, `PO`, `rollback`. **No afirmar que un archivo existe hasta comprobarlo.**

### 04.2 Fuentes fundacionales de arquitectura profesional

El PO priorizó obras de **Francis D. K. Ching** (Forma, espacio y orden), **Edward T. White** (conceptos de formas arquitectónicas y partido), sistemas de ordenamiento y `101 Things I Learned in Architecture School`. Los PDF se compartieron en conversaciones anteriores; **no están certificados dentro de estos repositorios**. Recuperarlos desde adjuntos/Library si están disponibles, registrar autor, procedencia, derechos y alcance, y someter su aprendizaje a curaduría Delta 6.2. No fingir que ARKI ya asimiló su contenido.

**Concepto crucial del PO:** partido arquitectónico no es «acomodar habitaciones»; debe traducir programa, restricciones, relaciones espaciales, estructura, forma, orden, jerarquías y creatividad arquitectónica a conocimiento ejecutable y comprobable. E2E-002 Spatial Layout fue replanteado en esa dirección, pero su aceptación integral sigue pendiente.

### 04.3 Otras fuentes técnicas

- G-200: protocolo geométrico G0 punto (Vec3/schema), G1 línea (tres representaciones), G2 polígono (pérdida de orientación por `abs()`); 75 pruebas G0..G2 especificadas, sin asumir que todas pasan hoy.
- E2E-001 Capability Fabric: cierre histórico con SHA `5d4277e` y CI #63; limitaciones L-01..L-04 documentadas.
- L-01: `UNVALIDATED_STRUCTURAL_AGK_INPUT`, fixes históricos commits `2680c9d9` y `21be5b77`, estado AWAITING_CI entonces; verificar estado actual.
- L-02 procedencia parcial, L-03 autoridad D-2, L-04 disparador CI AGK-only pendientes según auditorías históricas.
- F8 PR #52: pruebas 10/10 en rama de origen, pero árbol de merge no demostrado; PO exigió Vía A (rebase y ejecución sobre merge), no excepción documental. No transferir PASS de una rama a otra.
- E3 Windows/browser y AGK nativo siguen sin cierre global acreditado.

---

## 05. Mapa de módulos existentes del Árbol Vivo

Buscar en `sicl-web/tools/maqueta-viva/` (especialmente checkout local `~/ARKI/av023-arbol-vivo`):

| Archivo | Rol probable o probado | Límite |
|---|---|---|
| `maqueta-viva.template.html` | UI seleccionada y vistas del Árbol | No equivale por sí sola a 3D nativo |
| `av-ui-001-readonly-prototype.html` | referencia gráfica aislada | no es producto final |
| `arki-av023-historical-ui.cjs` | servidor de la UI histórica | read-only; no es AV036 |
| `arki-av020-tree.cjs` | estructura del árbol | inspeccionar contrato real |
| `arki-av002-precedence.cjs` | referencias, precedencias, ciclos | tests locales aprobados |
| `arki-av017-proposal.cjs` | propuestas y decisión PO | no autoaprobación |
| `arki-twin-three-alternatives.cjs` | tres alternativas | hipótesis ≠ medición |
| `arki-arbol-vivo-auto.cjs` | inventario/automatización | asignación de fase NO autónoma |
| `arki-live-pulse.cjs` | pulso/observación | no prueba ciclo completo |
| `arki-core-mapa-vivo-bridge.cjs` | puente Core↔mapa | inspeccionar ejecución real |
| `arki-map-adn-bridge.cjs` | puente mapa↔ADN | inspeccionar |
| `arki-autonomy-orchestrator.cjs` | orquestación | ubicar rama/versión y verificar |
| `arki-autonomy-memory.cjs` | memoria | verificar persistencia/reinicio |
| `arki-multiscale-design.test.cjs` | pruebas de diseño multiescala | pruebas ≠ aprendizaje autónomo |
| `arki-f1-source-audit.cjs` | fuentes F1 | no certificar otras fases |

**Módulos experimentales posteriores:** `experiments/arki-ideas/` en `experiment/arki-ideas-mapa-vivo-20261015`:
- REC-001: coordinador de sistemas vivos;
- REC-002: aprendizaje relacional;
- REC-003: gemelo digital con tres alternativas hipotéticas;
- REC-006: pulso de solo lectura.

**Regla de recuperación:** comparar interfaces, dependencias y evidencia; extraer capacidades probadas, integrarlas en los puntos existentes, eliminar duplicación una vez que esté demostrado que nada se perdió. No encadenar motores ni inventar una autoridad paralela.

---

## 06. Evidencia y estado técnico conocido al 16/10/2026

### 06.1 AV023 local: evidencia directa del PO

Comando ejecutado en `/home/arki/ARKI/av023-arbol-vivo`:

```bash
node --test \
 tools/maqueta-viva/arki-av023-historical-ui.test.cjs \
 tools/maqueta-viva/arki-av002-precedence.test.cjs \
 tools/maqueta-viva/arki-av017-proposal.test.cjs \
 tools/maqueta-viva/arki-arbol-vivo-auto.test.cjs \
 tools/maqueta-viva/arki-twin-three-alternatives.test.cjs
```

**Resultado:** `tests=22; pass=22; fail=0; duration_ms=533.035395`. Archivo de salida local:
`~/ARKI/AV036-RESULTADOS/AV023-AUDITORIA-FUNCIONAL.tap`.

Resultado textual significativo:
`ARKI_ARBOL_VIVO_AUTO_001=PASS; INVENTORY=51; PHASE_ASSIGNMENT_NOT_AUTONOMOUS; REAL_EXPERIMENT_NOT_EXECUTED`.

Comprobado por pruebas: clasificación de referencias ausentes, detección de ciclos transitivos/duplicados, rechazo de nodos inválidos, no mutación del registro, rechazo de evidencia adulterada y ausencia de rollback, interfaz histórica read-only, tres alternativas y métricas con controles. **No demuestra** diseño autónomo, motor geométrico real ni integración E2E.

### 06.2 AV036 experimentos aislados

- MO-04: **38/38 PASS**.
- MO-05: **42/42 PASS**.
- MO-06: **47/47 PASS** tras correcciones SSRF/red privada/HTTPS; `NETWORK_TRANSPORT=DISABLED_UNTIL_PINNED`, `SOURCE_PROVENANCE=UNATTESTED_ZIP`, `PRODUCTION_SECURITY=NOT_CERTIFIED`.
- MO-07A: **4/4 PASS** de preflight de rutas; `E3_BROWSER=NOT_EXECUTED`.
- MO-07B: Chrome obtuvo páginas HTML en puerto 3000, pero eran **Gitea**, no ARKI; `RENDER_GATE=PASS_3_ROUTES` del script fue **falso positivo**. **E3 no aprobado.**
- AV023 puerto 8768: HTTP 200 y título correcto, pero eso solo confirma servidor histórico, no interacción completa ni integración AV036.

Documentos de recibos en rama experimental:
`docs/arki-ideas/AV036-23_MO06_LOCAL_ADVERSARIAL_PASS_20261016.md`;
`docs/arki-ideas/AV036-24_MO07_E3_PREFLIGHT_PASS_20261016.md`;
`docs/arki-ideas/AV036-25_MO07B_BROWSER_E3_GATE_20261016.md`;
`docs/arki-ideas/AV036-26_MO07B_BROWSER_RENDER_PASS_20261016.md` **requiere errata explícita** por falso positivo.

Commits históricos citados:
`cd01415942888663ea77eafff9e1b36acb29593d` (MO06 receipt);
`47e0ca1fe3dc8e5c6555cdcba295bafde575191a` (MO07A);
`71a0c012bd7b5b28e44177af70eeaa85d591f461` (gate);
`c3b4f6a911d5527e2ce42ceb1c912521dbffe724` (recibo MO07B erróneo). Nunca usar el último como prueba de E3.

### 06.3 Regresión amplia del 15/10

Se reportó candidata con `264/264` Node y `628/628` Vitest, TypeScript, build y diff-check PASS; correspondía a HEAD `9914f5df...` **más siete archivos nuevos/modificados**, `NO_COMMIT_NO_PUSH_NO_MERGE`. No certifica el main integrado. Informe diario reportó 27 fallos + 1 error ACE88/Core como **último resultado histórico**, no medición actual. Debe repetirse sobre SHA exacto cuando se integre, no exigir repetir suites ya probadas sin motivo.

---

## 07. Qué está hecho, qué falta y cómo distinguirlo

| Capacidad | Evidencia actual | Estado honesto |
|---|---|---|
| Árbol visible F1–F10 y UI histórica | HTML 8768, tests AV023 | funciona como prototipo |
| Precedencias, ciclos, bloqueo | tests AV023 | probado en módulo |
| Propuestas PO sin autoaprobación | tests AV017 | probado en módulo |
| Tres alternativas con validación de evidencia | tests | estructura probada, experimentos reales no |
| Inventario de 51 ítems | salida módulo auto | no asigna fases autónomamente |
| Aprendizaje profesional Delta 6.2 | contratos/ideas | sin demostración E2E |
| Detección autónoma de déficit real | piezas parciales | sin demostración completa |
| Experimento con AGK único y Core real | histórico parcial | no demostrado E2E |
| Aprobación desde UI elegida → ACE88/Core | contratos parciales | no conectado E2E |
| Mutación autorizada → persistencia → reinicio → rollback | pruebas parciales | no demostrado E2E |
| 3D nativo en interfaz elegida | diseño objetivo | localización y funcionamiento por verificar |
| Código consolidado y poda segura | 52 ramas reportadas eliminadas | consolidación incompleta |
| CI sobre main integrado limpio | regresiones de candidata | no certificado |

**Regla epistémica:** `UNKNOWN` cuando falta evidencia; `PARTIAL` cuando se prueba una pieza; `PASS` solo para contrato exacto probado. No confundir test unitario con competencia arquitectónica.

---

## 08. Hoja de ruta ejecutable: darle vida SIN abrir ramas

**Principio:** reutilizar repositorios y ramas existentes; integrar sobre un baseline aprobado por el PO, sin cambios destructivos prematuros. El PO no quiere ciclos infinitos de auditorías; cada fase debe entregar funcionalidad integrada.

### Paso A — Reconocer la casa existente (una vez)

1. Abrir este `ARKI-00.md`.
2. Revisar `ARKI_MASTER_MAP_LIVE.md` y `ARKI_MASTER_MAP_STATE.json` en la rama donde existan.
3. Identificar SHAs actuales de `main`, `integration/arki-av035-main-20261015` y `experiment/arki-ideas-mapa-vivo-20261015`; listar estado de `sicl-core` y `arki-acs`.
4. Encontrar **la pantalla elegida** en `maqueta-viva.template.html`, su montaje y los archivos de datos; verificar si la página 3D final existe y dónde está. No inventarla.
5. Confirmar qué proceso sirve el puerto 8768, y no usar 3000 sin identificar servidor.
6. Confeccionar un mapa **archivo → función → evidencia → ubicación actual → destino de integración → duplicado a retirar**. Una fila por componente, no otra presentación conceptual.

### Paso B — Reunir piezas sin perder ideas

1. Comparar archivos y commits de las tres ramas web prioritarias; buscar material exclusivo en auxiliares.
2. Recuperar documentos, código, tests, UI, evidencias y procedencia **antes** de borrar referencias.
3. Consolidar inventario de ideas en una sola ubicación existente de GitHub (dentro del repositorio acordado); conservar SHA original y estado `idea / parcial / probado / integrado / obsoleto`.
4. Integrar en la interfaz aprobada, no en un clon; retirar duplicados solo después de demostrar equivalencia funcional.
5. Eliminar ramas únicamente cuando su contenido exclusivo esté conservado, el PO autorice la poda y no existan PR/protecciones/bloqueos. No confundir historia Git alcanzable con catálogo organizado.

### Paso C — Primer ciclo vital REAL

Elegir una carencia real y de bajo riesgo detectada por el propio Árbol, por ejemplo una dependencia inválida o capacidad faltante con evidencia. El ciclo debe ser:

1. **Autoinspección:** inventario real del sistema y estado de capacidades.
2. **Autodiagnóstico:** carencia priorizada, causa, dependencias y restricciones FROZEN.
3. **Diseño de alternativas:** exactamente tres opciones diferenciadas, con hipótesis explícitas.
4. **Experimento real:** ejecutar con Core/AGK cuando el caso requiera geometría; si no hay AGK, **bloquear y reportar**, no simular métricas falsas.
5. **Comparación:** resultados medidos, procedencia, costos/beneficios, rechazos.
6. **Aprobación PO:** la UI aprobada muestra opciones y solicita autorización explícita vinculada a un identificador y SHA.
7. **Aplicación:** cambios permitidos, acotados, idempotentes y reversibles; nunca escribir contratos FROZEN sin permiso.
8. **Propagación:** actualizar dependencias, fases, árbol, evidencias, ideas, FROZEN y mapa maestro afectados.
9. **Persistencia:** reiniciar y recuperar exactamente estado, decisión y prueba.
10. **Rollback y reevaluación:** revertir ante fallo, comparar con baseline, registrar diagnóstico y nueva necesidad.

**Criterio de «ARKI vivo»:** este ciclo funciona sobre código integrado y una UI real, con autoridad humana, motor real cuando corresponda, evidencia verificable y persistencia/reversión. Un HTTP 200, 22/22 tests o tres alternativas hipotéticas no bastan.

### Paso D — Prueba de aceptación única, no cien rondas aisladas

Capturar: SHAs exactos de Web/Core/ACS; diff integrado; interacción en navegador **ARKI real**; solicitud PO; decisión; ejecución Core/AGK; evidencia y métricas; reinicio; reversión; estado del árbol. Probar errores adversariales (evidencia alterada, autorización ausente, dependencia bloqueada, fallo de motor, caída a mitad de persistencia). Si algo falla, corregir **la misma base** y repetir solo las pruebas afectadas más regresión necesaria.

### Paso E — Limpieza final

Después de integrar y verificar: podar ramas redundantes, conservar trazabilidad y actualizar `ARKI-00.md`, mapa maestro y catálogo. **«Meter, verificar, borrar»** es el flujo. No borrar para ocultar deuda.

---

## 09. Autoridad, seguridad y no-negociables

- **Un solo AGK**, OCCT+DELTA como arquitectura aprobada; geometría 3D-First.
- **FROZEN**: contratos inmutables salvo autorización expresa y procedimiento de migración.
- **PO** decide promociones y mutaciones canónicas; ninguna sugerencia de ARKI equivale a autorización.
- **Tres alternativas** por propuesta; nunca declarar resultados hipotéticos como medidos.
- **Procedencia:** baseline, input, unknowns, reasoning, reused/new knowledge, deficits, candidates, rejected, geometry mutations, relationships, topology, scenario results, dependency propagation, coverage, evidence, UNKNOWN y ruta de resolución.
- **Seguridad de fuentes externas:** MO06 deshabilitó transporte real pendiente de canal HTTPS seguro y fijación de destino; no reactivar red sin hardening, DNS/IP controls y pruebas.
- **CERO DEUDA**: no maquillar limitaciones como `PASS`, no FUTURE_TEST para cerrar bloqueos críticos.
- **No tocar repositorios/proyectos hermanos** sin pedido del PO.

---

## 10. Rutas operativas del equipo ARKI-02

Host: `arki@Arki-02`, Ubuntu, Node 22.x. Rutas conocidas:

- `~/ARKI/av023-arbol-vivo/` — checkout histórico con interfaz y herramientas.
- `~/ARKI/av023-arbol-vivo/tools/maqueta-viva/` — UI histórica, tests, árbol, gemelo y propuestas.
- `~/ARKI/av035-main-integration/` — zona local de integración AV035 mencionada en trabajo anterior; **comprobar que exista**.
- `~/ARKI/AV036-VALIDACION/sicl-web-experiment-arki-ideas-mapa-vivo-20261015/` — extracción local de ZIP experimental; **no fuente Git canónica sin procedencia**.
- `~/ARKI/AV036-RESULTADOS/` — TAP/logs de pruebas.
- `~/ARKI/continuity/arki-av017-proposal.json` — entrada histórica de propuestas.
- `~/ARKI/continuity/arki-po-ledger` — registro histórico PO.
- `~/Descargas/sicl-web-experiment-arki-ideas-mapa-vivo-20261015.zip` — paquete descargado; SHA256 registrado `94995c16d477a5572663744c3585955588d0c92c55b301eba7354ef803b7eb93`.
- `~/sicl-web`, `~/sicl-core`, `~/ARKI` — rutas candidatas; **no asumir que todas son checkouts Git válidos**.

Comandos de inspección **no destructiva**:

```bash
# Identidad del servicio real
ss -ltnp | grep -E ':(3000|8768|5173|8080)\\b' || true
curl -fsS http://127.0.0.1:8768/ | head -c 300

# Inspeccionar checkouts conocidos
for p in "$HOME/ARKI/av023-arbol-vivo" "$HOME/ARKI/av035-main-integration" "$HOME/sicl-web" "$HOME/sicl-core"; do
  [ -d "$p" ] || continue
  echo "== $p"
  git -C "$p" rev-parse --show-toplevel 2>/dev/null || true
  git -C "$p" rev-parse HEAD 2>/dev/null || true
  git -C "$p" status --short 2>/dev/null || true
done

# Localizar la plantilla seleccionada, sin modificar archivos
find "$HOME/ARKI" "$HOME/sicl-web" -type f -name 'maqueta-viva.template.html' 2>/dev/null
```

**No ejecutar** automáticamente `git reset --hard`, `git clean -fd`, `git branch -D`, `git push --force`, `rm -rf`, migraciones destructivas ni promociones. Confirmar destino, conservación y autorización primero.

---

## 11. Documentación de continuidad y tareas pendientes

Mantener un registro único, en el repositorio existente, con:
- estado exacto por SHA y fecha;
- qué funciona en pantalla elegida;
- módulos integrados y procedencia;
- pruebas ya hechas y qué cubren;
- bloqueos verdaderos y siguiente acción;
- decisiones del PO, incluyendo revocaciones;
- ramas aún por consolidar y criterio para podarlas.

**No repetir trabajo ya aprobado** salvo cambio de SHA/contrato o evidencia de fallo. La última conversación demostró que el problema no es falta de tests unitarios sino falta de **ensamblaje real**.

**Bloqueos abiertos conocidos:** identidad de la página 3D final; asignación autónoma de fases; experimento real con Core/AGK; autoridad ACE88/Core E2E; persistencia y rollback integrados; E3 navegador real; procedencia ZIP experimental; consolidación completa de ramas/ideas; reconciliación de la candidata web probada con `main`.

**Lista de flotantes históricos (no elevar a implementado):**
`S10_BACKUP_ENGINE_VERSION_UNKNOWN`, `S10_RESTORE_AND_BUDGET_INVENTORY_NOT_EXECUTED`, `S10_NATIVE_WRITE_NOT_CLAIMED`, `S10_ROUND_TRIP_NOT_CLAIMED`, `RVT_NATIVE_SEMANTIC_EXTRACTION_NOT_DEMONSTRATED`, `OECE_COMPLETE_TECHNICAL_DOSSIER_NOT_DEMONSTRATED_FOR_THIS_SPECIMEN`; además identidad/Project State, Universidad/conocimiento, inteligencia arquitectónica, partido/topología, construcción/obra y operación/aprendizaje pendientes de reconciliación.

**Hitos de fuentes y curaduría:** I-08 ingestión multimodal/OCR, HC-14 fuentes, HC-15 OCR PDF, I-05 D6.1 recuperación, I-09 transferencia L1→L2, I-11 continuación; son borradores/puertas, no evidencia de ejecución.

---

## 12. Material adjunto en la conversación del 16/10

El PO adjuntó dos archivos ZIP de ramas `main`: `sicl-web-main (2)(3).zip` y `sicl-core-main(2).zip`. En la inspección local del adjunto web se observó `docs/ARKI_FRONTEND_HANDOFF.md` y abundante código, pero **no se encontró `tools/maqueta-viva/maqueta-viva.template.html` ni `docs/arki-master-map/ARKI_MASTER_MAP_LIVE.md` dentro de ese ZIP**. Esto prueba que **el ZIP adjunto no contiene por sí solo todo el trabajo posterior**: consultar las ramas GitHub existentes antes de concluir que se perdió la interfaz.

Los ZIP son **instantáneas de origen a comparar**, no autorización para sustituir una integración más nueva por archivos de `main`.

---

## 13. Guion de arranque para el siguiente chat/agente

1. Leer **`ARKI-00.md` entero**.
2. Responder al PO en una frase: «ARKI tiene el Árbol Vivo AV023 encendido, pero falta el ciclo autónomo integrado; voy a completarlo en la interfaz aprobada, sin crear ramas».
3. Abrir **`tools/maqueta-viva/maqueta-viva.template.html`** de la rama `integration/arki-av035-main-20261015` y localizar dónde se monta. Inspeccionar también el checkout `~/ARKI/av023-arbol-vivo`.
4. Abrir el Mapa Maestro y archivos fundacionales; buscar código actual de Web/Core/ACS y la escena 3D real.
5. Producir una matriz concreta **existente → falta → archivo destino → cambio**; hacer cambios reales en la base autorizada, sin bifurcar.
6. Conectar primero una vertical completa (autodetección → 3 alternativas → PO → Core/AGK → persistencia → árbol). No entregar otro plan interminable.
7. Validar interacción en la **página correcta**, corregir fallos sobre la misma base, registrar evidencia y estado.
8. Consolidar contenido exclusivo de ramas y podar solo lo preservado.
9. Actualizar este archivo y mapa maestro tras cada hito real.

**Regla final del PO:** «Quiero que ARKI tenga vida. No más ramas. No más vueltas. Meter lo útil en la interfaz que decidí y borrar lo que ya no sirve». La medida del éxito no es la cantidad de tests ni documentos, sino **una ejecución real, conectada, segura, verificable y persistente en el ARKI existente**.


---

## Actualización de continuidad — auditoría de ramas y generador (2026-10-22)

- **Copia de continuidad:** este `ARKI-00.md` se ha copiado desde `main` a la rama existente de MEMORY para que el handoff maestro esté disponible en el mismo contexto que el catálogo y la auditoría. Se conserva el contenido original y se añade esta actualización al final.
- **Informe de ramas:** [`docs/arki-master-map/ARKI_SICL_WEB_BRANCH_AUDIT_20261022.md`](docs/arki-master-map/ARKI_SICL_WEB_BRANCH_AUDIT_20261022.md). Estado PARCIAL: 30 ramas comparadas contra `main`; quedan 68 por comparar del inventario consultado de 98 ramas, incluida `main`.
- **Catálogo:** [`docs/arki-master-map/ARKI_SICL_WEB_BRANCH_CATALOG_20261021.md`](docs/arki-master-map/ARKI_SICL_WEB_BRANCH_CATALOG_20261021.md). El catálogo anterior es un inventario de cabezas, no una validación técnica de cada rama.
- **Generador del Mapa Vivo localizado:** `tools/maqueta-viva/arki-continuity-snapshot.cjs`. Lee `docs/arki-master-map/ARKI_CONTINUITY_EVENTS.jsonl`, extrae historia Git y genera `docs/arki-master-map/ARKI_MAPA_VIVO_CONTINUIDAD.md`. El código declara explícitamente que el mapa no verifica CI, arquitectura ni despliegue.
- **Pruebas del generador:** `tools/maqueta-viva/arki-continuity-snapshot.test.cjs`; el runner de verificación local `tools/maqueta-viva/arki-continuity-local-verify.cjs` ejecuta las pruebas, genera el mapa y verifica determinismo con `--check`. El workflow `.github/workflows/arki-continuity-map.yml` también genera y verifica el mapa.
- **Límite importante:** el generador encontrado solo produce el Mapa Vivo de continuidad. No se encontró evidencia de que genere automáticamente este `ARKI-00.md`, el catálogo de ramas o el informe de auditoría. Esos documentos se actualizaron explícitamente en esta rama; no se debe suponer que el generador los mantendrá sincronizados.
- **Estado de ejecución:** el código generador y sus pruebas fueron inspeccionados en GitHub, pero no se ejecutaron en un checkout local durante esta acción. No declarar sus pruebas verdes por inspección estática.
- **Sin alteración de ramas de producto:** no se creó ninguna rama, no se fusionó ni eliminó ninguna rama y no se cambió `main`. La copia y los informes quedan en `feat/arki-autonomy-memory-main-20261013` para revisión.
- **Siguiente paso:** completar la comparación de las ramas restantes, revisar commits exclusivos y CI por SHA, y comprobar en el entorno local el generador con `node --test tools/maqueta-viva/arki-continuity-snapshot.test.cjs` y `node tools/maqueta-viva/arki-continuity-snapshot.cjs --check`. No modificar el ledger ni regenerar el mapa sin verificar primero el estado del checkout.


## Actualización de continuidad — 2026-10-22: auditoría de ramas y entorno REVIVIR ARKI

- El inventario remoto de `YvanCastilloQuezada/sicl-web` devuelve 98 ramas incluyendo `main`. El informe de auditoría documenta 48 ramas comparadas y deja 49 ramas distintas de `main` pendientes de comparación.
- La revisión prioritaria identificó que las ramas grandes de ARBOL Vivo/Gemelo Digital comparten una genealogía y mucha divergencia; no deben fusionarse en bloque. En `feat/arbol-vivo-functional-repair-20261014`, el historial reciente incluye implementación del gate de dependencias basada en evidencia seguida de reversiones; comprobar el estado final del código antes de considerar ese gate recuperable.
- La rama AGK más acotada detectada para inspección es `feat/agk-003-parametric-family-unification` (11 commits exclusivos según compare, con compiler/regeneration/tests). Esto es una prioridad de revisión, no una aprobación para integrar.
- El generador de continuidad ya fue identificado por inspección estática en `tools/maqueta-viva/arki-continuity-snapshot.cjs`; sus pruebas están en `tools/maqueta-viva/arki-continuity-snapshot.test.cjs`, y el verificador local en `tools/maqueta-viva/arki-continuity-local-verify.cjs`. Aún no se ha ejecutado en el checkout local real de Arki-02.
- Evidencia del entorno local compartida por el PO: el comando ejecutado desde `/home/arki` no encontró variables de entorno exportadas para MO-22/storage/identity ni `DATABASE_URL` o `ARKI_STORAGE_ROOT`; sí observó el proceso `node /home/arki/ARKI/repositorios/sicl-web/dist/index.js`, el proceso de UI histórica AV-023, Docker y un proxy en `127.0.0.1:3307`. Esto describe el entorno de terminal/procesos mostrado, no prueba que las variables falten dentro del proceso Node ni en producción.
- Próximo paso seguro en Arki-02: entrar explícitamente al checkout `/home/arki/ARKI/repositorios/sicl-web`, capturar `git status --short --branch` y verificar existencia/estado de los scripts del generador antes de ejecutar nada. No hacer reset/stash/checkout destructivo ni regenerar el mapa antes de preservar y revisar cambios locales.
- Referencias: [auditoría de ramas](docs/arki-master-map/ARKI_SICL_WEB_BRANCH_AUDIT_20261022.md), [catálogo de ramas](docs/arki-master-map/ARKI_SICL_WEB_BRANCH_CATALOG_20261021.md).


### Corrección de inventario — 2026-10-22, segundo lote

La auditoría comparativa ya documenta **58 ramas de 97 candidatas distintas de `main`**; quedan **39 ramas** por comparar. Diez ramas adicionales se compararon en esta tanda: nueve están detrás de `main` sin commits exclusivos y `feat/m001-e3-gate-hardening` diverge ampliamente (436 ahead/69 behind). El conteo anterior de 48/49 pendientes queda reemplazado por este corte más reciente. No se ha fusionado, creado ni eliminado ninguna rama.
