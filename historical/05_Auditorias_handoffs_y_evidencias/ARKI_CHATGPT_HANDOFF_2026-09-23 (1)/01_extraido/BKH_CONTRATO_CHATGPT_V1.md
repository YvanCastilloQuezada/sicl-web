# ARKI — Contrato BIM Kernel Hardening v1.1

## Endurecimiento del núcleo BIM

**Fecha:** 23 de septiembre de 2026  
**Autor:** ChatGPT / Manus  
**Estado:** APPROVE WITH 3 FIXES — requiere aprobación final del Product Owner  
**E8:** pausado, no cancelado  
**E5, E6 y E7:** congelados; no se reabren dentro de BKH

## 1. Propósito

Este contrato crea la fase **BIM Kernel Hardening (BKH)**. Su objetivo es consolidar el núcleo BIM existente de ARKI antes de continuar con más superficie funcional.

BKH no es una expansión de módulos. Es el endurecimiento del corazón que ya existe para que ARKI sea:

- semántico;
- paramétrico;
- relacional;
- regenerable;
- transaccional;
- documentable;
- medible a escala.

La regla central es:

> **No se construye una segunda versión de una capacidad que ya exista parcialmente. Primero se audita, luego se extiende y sólo después se crea lo que falte.**

## 2. Separación de estados

BKH debe mantener separados los siguientes estados:

- `IMPLEMENTED`: existe código ejecutable.
- `VERIFIED`: existen pruebas y outputs reproducibles.
- `E2E_VERIFIED`: la cadena completa se verificó con datos representativos.
- `PARTIAL`: existe una capacidad incompleta.
- `NOT_DEMONSTRATED`: existe una idea o contrato sin evidencia suficiente.
- `PROFESSIONAL_VALIDATION_REQUIRED`: requiere revisión o firma profesional.
- `FUTURE`: no forma parte de la entrega actual.

Ningún documento BKH puede convertir una capacidad parcial en `VERIFIED` por descripción arquitectónica.

## 3. Alcance de BKH

BKH contiene ocho entregas ordenadas:

| Entrega | Nombre | Propósito |
|---|---|---|
| BKH-0 | Forensic Mapping | Auditar el repositorio real y evitar duplicaciones. |
| BKH-1 | Relationship Fabric | Unificar relaciones espaciales, técnicas, paramétricas, causales y documentales. |
| BKH-2 | Constraint Engine | Definir y validar restricciones con unidades, origen, prioridad y evidencia. |
| BKH-3 | Regeneration Engine | Propagar cambios y reconstruir sólo lo afectado. |
| BKH-4 | Transaction Engine | Ejecutar cambios con validación, commit, rollback, undo, redo e historial. |
| BKH-5 | Documentation Compiler MVP | Derivar planta, corte, elevación, schedules y cantidades del mismo modelo. |
| BKH-6 | Performance Baseline | Medir escala, memoria, latencia y degradación progresiva. |
| BKH-7 | Integrated Torture Test | Demostrar una mutación completa de extremo a extremo. |

Las entregas son secuenciales. No se autoriza BKH-1 hasta que BKH-0 tenga cierre `VERIFIED` o `APPROVE WITH FIXES` explícito.

## 4. BKH-0 — Forensic Mapping obligatorio

BKH-0 es la única entrega inicialmente autorizable. No modifica código de producto salvo que el Product Owner autorice una corrección puntual derivada de la auditoría.

Debe producir un mapa real de:

- entidades canónicas;
- archivos fuente;
- contratos existentes;
- relaciones existentes;
- familias y tipos;
- parámetros y generación;
- SceneModel;
- selección;
- persistencia;
- snapshots y auditoría;
- 5D;
- 4D;
- clashes;
- IFC;
- documentación;
- pruebas;
- duplicaciones;
- contratos que sólo están escritos;
- dependencias entre módulos.

Debe clasificar cada pieza como `EXISTS`, `PARTIAL`, `DUPLICATED`, `CONTRACT_ONLY`, `NOT_DEMONSTRATED` o `MISSING`.

### Entregables BKH-0

- `BKH0_FORENSIC_MAP.md`.
- `BKH0_ENTITY_REGISTRY.md`.
- `BKH0_RELATIONSHIP_INVENTORY.md`.
- `BKH0_DUPLICATION_REPORT.md`.
- `BKH0_DEPENDENCY_MAP.md`.
- `BKH0_IMPLEMENTATION_GAPS.md`.
- `BKH0_CANONICAL_OWNERSHIP_MAP.md`.
- `BKH0_MUTATION_PATH_MAP.md`.
- `BKH0_INVARIANT_REGISTRY.md`.
- `BKH0_OUTPUTS.txt`.
- `BKH0_MANIFEST.json`.
- `BKH0_REPORT.md`.

### Criterio de cierre BKH-0

BKH-0 sólo se cierra cuando cada entidad, relación y contrato relevante tiene ubicación, estado, prueba o limitación explícita. El mapa debe indicar qué se reutiliza, qué se extiende y qué se crea desde cero.

Además, BKH-0 debe identificar un único **Canonical Owner** para cada concepto crítico. Como mínimo debe resolver la autoridad semántica de `Wall`, `Geometry`, `Relationship`, `Constraint`, `ProjectVersion`, `Snapshot`, `Quantity`, `Cost`, `Schedule`, `SceneRepresentation` y `HumanDecision`.

También debe registrar todos los **Mutation Paths** actuales: edición directa, controles paramétricos, Generador, comandos SICL, inteligencia ARKI e importación IFC. Para cada ruta debe indicar si termina en la misma autoridad canónica, qué validaciones ejecuta y si puede mutar silenciosamente el proyecto.

Finalmente, BKH-0 debe crear el **Invariant Registry**. El registro inicial debe comprobar, como mínimo: identidad semántica única; ausencia de mutación silenciosa; diferencia entre candidato y decisión; diferencia entre generado y hecho; diferencia entre preview y commit; rollback exacto; estabilidad de entidades no relacionadas; GUID estable tras guardar y reabrir; documentación referida a entidades canónicas; y autoridad humana no evadible.

Cada entrega BKH-1 a BKH-7 deberá declarar qué invariantes preserva y aportar una prueba para los invariantes que su alcance pueda afectar.

## 5. BKH-1 — Relationship Fabric

BKH-1 debe evolucionar las relaciones existentes hacia una Fabric única. No se permite crear un segundo Dependency Engine o un segundo Impact Graph.

La Fabric debe soportar, como mínimo, estos grupos:

| Grupo | Relaciones iniciales |
|---|---|
| Espacial | `contains`, `contained_by`, `adjacent_to`, `bounded_by`, `hosted_by` |
| Geométrico | `aligned_with`, `parallel_to`, `perpendicular_to`, `intersects`, `offset_from` |
| Estructural | `supports`, `supported_by`, `transfers_load_to` |
| MEP | `feeds`, `connected_to`, `returns_to`, `drains_to`, `serves` |
| Funcional | `requires`, `accesses`, `serves` |
| Paramétrico | `depends_on`, `driven_by`, `constrains` |
| Causal | `affects`, `causes`, `invalidates`, `propagates_to` |
| Documental | `represented_by`, `annotated_by`, `scheduled_by` |
| Epistémico | `supported_by_evidence`, `assumed_from`, `conflicts_with`, `unknown_dependency` |

Cada relación debe tener identidad, dirección, tipo, origen, destino, evidencia, versión y estado.

## 6. BKH-2 — Constraint Engine

Las restricciones deben tener como mínimo:

- `constraintId`;
- tipo;
- origen y destino;
- valor y unidad;
- prioridad;
- origen de la regla;
- evidencia;
- jurisdicción;
- estado;
- `hard`, `soft` o `unknown`;
- posibilidad de override humano;
- mensaje de violación.

Debe distinguir restricciones geométricas, arquitectónicas, estructurales, normativas, constructivas, económicas y de preferencia.

Una restricción no es sólo una ecuación. Debe conservar por qué existe y qué ocurre si se viola.

## 7. BKH-3 — Regeneration Engine

El motor debe calcular el conjunto afectado por una mutación y regenerar sólo lo necesario.

Debe distinguir:

- afectados;
- potencialmente afectados;
- no afectados;
- inválidos;
- recálculos requeridos;
- documentación afectada;
- elementos desconocidos;
- revisión humana requerida.

Caso mínimo obligatorio:

```text
Cambio de retícula
→ columnas
→ vigas
→ losa
→ fachada
→ conflictos MEP
→ metrados
→ costos
→ documentación
```

La regeneración debe ser determinista, trazable y reversible.

## 8. BKH-4 — Transaction Engine

Toda mutación relevante debe ejecutarse como transacción:

```text
BEGIN
→ observar versión
→ calcular afectados
→ proponer mutaciones
→ validar restricciones
→ propagar
→ regenerar
→ calcular consecuencias
→ previsualizar
→ revisión humana
→ COMMIT o ROLLBACK
```

Debe soportar:

- atomicidad;
- commit;
- rollback;
- undo;
- redo;
- history;
- diff;
- branch o alternativa;
- control de versión;
- operación inválida sin corromper el proyecto.

El sistema debe poder informar una transacción sin aplicarla.

## 9. BKH-5 — Documentation Compiler MVP

El compilador debe generar representaciones del mismo modelo canónico. No debe copiar elementos a dibujos independientes.

El MVP debe incluir:

- plan por nivel;
- sección por línea de corte;
- elevación básica;
- schedule de muros o elementos;
- quantities;
- sheet o conjunto de láminas básico.

Caso mínimo:

```text
Mover un muro
→ cambia el modelo
→ recompila planta
→ recompila sección
→ recompila elevación
→ recompila schedule
→ recompila cantidades
```

Cada salida debe guardar referencia al snapshot, vista, versión del modelo y elementos representados.

## 10. BKH-6 — Performance Baseline

Esta entrega no exige optimizar inmediatamente. Exige medir y establecer límites.

Fixtures progresivos:

- 1.000 objetos;
- 10.000 objetos;
- 50.000 objetos;
- 100.000 objetos;
- 500.000 objetos;
- 1.000.000 objetos.

Métricas mínimas:

- tiempo de carga;
- tiempo de guardado;
- memoria;
- FPS;
- latencia de selección;
- latencia de consulta;
- recorrido de relaciones;
- propagación de restricciones;
- commit;
- rollback;
- regeneración documental;
- exportación IFC.

El resultado puede ser `DEGRADED` o `NOT_SUPPORTED`. La medición honesta es el objetivo inicial.

## 11. BKH-7 — Integrated Torture Test

La prueba final debe construir un edificio pequeño y ejecutar:

1. abrir;
2. seleccionar una retícula;
3. moverla;
4. identificar dependencias;
5. detectar violaciones;
6. proponer mutaciones;
7. regenerar elementos afectados;
8. recalcular consecuencias;
9. recompilar documentación;
10. comparar antes y después;
11. solicitar revisión humana;
12. hacer commit;
13. ejecutar undo;
14. ejecutar redo;
15. guardar;
16. cerrar;
17. reabrir;
18. comprobar identidad, relaciones, propiedades y decisiones.

La prueba debe demostrar que se modificó lo que debía modificarse, que no se modificó lo que debía permanecer estable y que lo desconocido quedó visible.

Debe incluir además la comprobación semántica de reversión:

```text
HASH / STATE BEFORE
→ MUTATION
→ COMMIT
→ UNDO
→ COMPARE WITH ORIGINAL
→ SEMANTICALLY IDENTICAL
```

No basta con que la vista parezca igual. Deben coincidir identidad, relaciones, propiedades, decisiones y estado canónico, salvo metadatos de auditoría explícitamente permitidos.

## 12. Archivos protegidos

BKH debe conservar las entidades canónicas actuales. No puede crear versiones paralelas de:

- `ConstructionModel`;
- `Muro`;
- familias dinámicas;
- relaciones existentes;
- `SceneModel`;
- selección BIM;
- persistencia E6;
- contratos 5D/4D/clashes de E7.

Toda extensión debe ser aditiva, documentada y compatible con el estado real del repositorio.

## 13. Evidencia obligatoria

Cada entrega BKH debe incluir código o documentación según su alcance, pruebas, outputs crudos, capturas cuando exista UI, manifest con hashes, limitaciones y clasificación de estado.

No se permite cerrar una entrega con frases como “listo”, “implementado completamente” o “equivalente a Revit” sin evidencia correspondiente.

## 14. Reglas de gobierno

E8 queda pausado, no cancelado, hasta que BKH-0 produzca el mapa real. E5, E6 y E7 quedan congelados y no se reabren dentro de BKH.

No se incorporan Avatar, Luka, WebXR, nuevos kernels científicos ni nuevas disciplinas dentro de BKH-0. Si una capacidad aparece durante la auditoría, se registra como fuera de alcance.

Manus implementa y reporta. ChatGPT revisa y propone. DeepSeek puede emitir veredictos sobre paquetes verificables. El Product Owner aprueba contratos y cierres.

## 15. Condición de inicio

El único paso autorizado inmediatamente después de aprobar este contrato es **BKH-0 Forensic Mapping**. No se autoriza BKH-1 ni código de endurecimiento hasta revisar y aprobar sus resultados.

## 16. Aprobación solicitada

El Product Owner debe aprobar:

- BKH como fase estratégica;
- BKH-0 como primera entrega;
- E8 pausado mientras se ejecuta BKH-0;
- protección de E5, E6 y E7;
- prohibición de duplicar grafos y entidades;
- promoción secuencial BKH-0 → BKH-7.

**Estado final:** contrato propuesto; no inicia implementación hasta aprobación explícita.

## Referencias

[1]: `RESUMEN_IMPLEMENTACION_ARKI_2026-09-23.md` "Resumen de implementación acumulada de ARKI"

[2]: `ARKI_ADDENDA_SEPARACION_INTELIGENCIA_Y_BIM_KERNEL_V1.md` "Separación entre ARKI Intelligence y BIM Kernel"

[3]: `pasted_content_79.txt` "Propuesta de BIM Kernel Hardening recibida el 23 de septiembre de 2026"
