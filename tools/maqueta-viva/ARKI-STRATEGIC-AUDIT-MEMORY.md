# ARKI — Memoria estratégica y auditorías para continuidad

**Clase:** contexto de transferencia, no certificado de estado actual.  
**Fecha de compilación:** 2026-10-10.  
**Regla:** toda afirmación sobre implementación, pruebas, CI, auditorías o congelamientos debe contrastarse con su fuente y SHA antes de utilizarse como hecho operativo.

## 1. Identidad, propósito y horizonte

ARKI/ARQUI (antes Vitruvio/SICL) aspira a ser un arquitecto inteligente capaz de razonar, diseñar, evaluar, aprender y operar a múltiples escalas: objeto, interior, edificio, conjunto, ciudad, región y territorio. La arquitectura se entiende como sistema espacial 3D interrelacionado, no como generación aislada de plantas. Se persigue negociación multiobjetivo entre clima, confort, costo, estética, rentabilidad, funcionalidad y normas de jurisdicción y escala aplicables.

**Horizonte, no implementación certificada:** aprendizaje autónomo multiescala, pensamiento 3D-First, gemelo digital multiescala, simulación, memoria temporal, trazabilidad de decisiones, evaluación con evidencia y continuidad entre conversaciones. Distinguir el gemelo digital del sistema ARKI de los futuros gemelos digitales de proyectos que diseñe.

## 2. Principios y restricciones

- Un solo kernel geométrico AGK; hipótesis congelada de diseño: OCCT como cuerpo principal y ARKI_KERNEL_DELTA como extensión. No encadenar múltiples backends en runtime. Hipótesis de arquitectura **no equivale a kernel completado**.
- Separar HECHOS, SUPUESTOS, OBJETIVOS, RESTRICCIONES, PREFERENCIAS, DECISIONES y evidencia.
- PASSIVE FIRST; no complacencia; no promover afirmaciones sin verificación.
- FROZEN no se modifica automáticamente. Los experimentos no son cambios canónicos.
- Secuencia epistemológica: idea original → hipótesis → protocolo → resultado declarado → revisión → reproducibilidad → conocimiento validado → promoción expresamente autorizada.
- Regla de calidad: CLAIM ≠ IMPLEMENTED ≠ EXECUTED ≠ VERIFIED. NO EVIDENCIA = NO VERDE. ZERO DEBT como criterio de aceptación, no como estado probado.
- Qwen es Equipo Rojo designado. Auditorías externas deben registrar fecha, autor, alcance, SHA, evidencia y contradicciones. No aceptar una opinión de auditor como prueba de CI.

## 3. Memoria de auditorías históricas: no asumir vigencia sin revalidación

### E2E-001 — Capability Fabric (2026-10-01)
Registro histórico: Qwen informó RED_TEAM_PASS para SHA 5d4277e90982dbf7f72963476670223b57e25586, CI #63 SUCCESS y FREEZE_AUTHORIZED. **ZERO_DEBT_FREEZE no quedó automáticamente cerrado.** Pendientes L-01..L-04: barrido de bypass repo-wide, provenance receipt, autenticación D-2 process-local y trigger CI AGK-only secuencial. Se registró hallazgo UNVALIDATED_STRUCTURAL_AGK_INPUT y correcciones en commits 2680c9d9 y 21be5b77; CI #65 estaba en progreso en el último registro histórico. E2E-002 Spatial Layout permanecía HOLD. **Consultar estado actual antes de cambiar estas etiquetas.**

### AGK — fase 0.d (2026-10-01)
Hipótesis OCCT + DELTA aprobada conceptualmente; matriz de benchmark pendiente. G-200 especificaba pruebas G0..G2; G3..G12 no estaban especificadas. Hallazgo G2: _ring_area() aplicaba abs() y perdía orientación CW/CCW. No inferir cierre de este hallazgo.

### Core y semántica
Registro histórico: Core v1.0, pruebas focales H-001..H-004 y suite global informadas como aprobadas en septiembre; DeepSeek observó cero eventos DERIVATION_RECORDED en SQLite real y riesgos RT-89, RT-90, RT-91. Requieren revalidación de evidencia y de alcance antes de usarlos para planificar.

### Diseño arquitectónico y Spatial Layout
Red Team aprobó estratégicamente que Spatial Layout formalice programa arquitectónico, relaciones espaciales, restricciones y partido arquitectónico, en vez de acomodar habitaciones aleatoriamente. Esto es dirección conceptual, no prueba de implementación.

## 4. Estado experimental de ÁRBOL Vivo al 2026-10-10

Repositorio: YvanCastilloQuezada/sicl-web. Rama experimental: feat/arbol-vivo-precedencias-seguras-20261010. PR #55 era borrador en el registro histórico; comprobar vigencia.

- Interfaz HTML experimental: cinco pestañas Plano Vivo, ÁRBOL Vivo, Gemelo Digital, Cerebro relacional, Vista 3D; F1..F10, inventario documental, propuestas A/B/C y formularios de expediente científico. La fuente instalada por el usuario en SHA 5e98296c5989c1b60f20ac7c5bd6e2326711efcc reportó 10 fases, 24 hojas, 63 registros históricos y pruebas Node sintéticas PASS. El diagnóstico mostró 23 ideas elegibles; no confundir con las 24 hojas totales.
- Planificador consultivo aislado: commits 1de8814 y e2161a1; el usuario ejecutó sus tests Node con PASS. Ordena candidatas **solo cuando recibe dependencias declaradas**, detecta bloqueos y protege FROZEN; no es un planificador autónomo certificado.
- Diagnóstico en Plano Vivo: commits 583f631 y 5e98296; pruebas Node sintéticas PASS reportadas por instalador. Actualmente diagnostica UNKNOWN sin integrar el ordenamiento real.
- Pestañas degradadas con separadores: commit 2a27dd3; el usuario confirmó que el resultado visual le gustó.
- Artefactos de experimentación: hipótesis, protocolos, resultados autodeclarados, revisión, informes adjuntos, exportación/importación, verificador de SHA y repetibilidad; no prueban por sí solos ejecución científica, replicación independiente ni promoción canónica.
- Browser E3: pendiente de aceptación completa; tests DOM sintéticos no equivalen a E3.

## 5. Brechas que condicionan la siguiente acción

1. No existe aún una fuente reconciliada y verificable de dependencias entre ideas y tareas. No inventar ruta crítica.
2. Integrar el planificador consultivo probado con Plano Vivo; debe consumir relaciones documentales trazables y distinguir UNKNOWN.
3. Implementar memoria operativa portable y **resúmenes de auditorías con procedencia**, vigencia, contradicciones y enlaces a evidencia.
4. Generar un handoff autocontenido y legible por un nuevo chat con: identidad/visión, invariantes, auditorías, decisiones, estado de repositorios/SHAs, pruebas, bloqueos, próxima tarea y criterios de aceptación.
5. Validar en navegador E3 y revisar interfaz A/B/C compacta antes de reclamar cierre.
6. El aprendizaje autónomo multiescala es horizonte de investigación/desarrollo; no atribuirlo al prototipo actual.

## 6. Contrato de lectura para un nuevo chat

Primero: leer esta memoria estratégica, el estado operativo actual y el índice de auditorías. Segundo: verificar SHA de GitHub, PR, CI y evidencia de pruebas; señalar diferencias con el handoff. Tercero: construir una tabla HECHO VERIFICADO / DECLARADO / HISTÓRICO / UNKNOWN. Cuarto: proponer la siguiente tarea desbloqueada con justificación y pruebas de aceptación. Quinto: ejecutar solo acciones autorizadas y preservar Core, FROZEN, AGK y restricciones de promoción.

**No inferir** que la última conversación equivale al estado actual de los repositorios. Esta memoria contextualiza; los registros con SHA y evidencia actualizada gobiernan las afirmaciones técnicas.
