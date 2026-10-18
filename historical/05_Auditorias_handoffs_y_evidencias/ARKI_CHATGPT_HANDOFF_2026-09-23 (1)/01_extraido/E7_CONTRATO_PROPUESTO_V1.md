# ARKI — Contrato E7 v1.0

## Costos 5D, planificación 4D, coordinación, estructuras y MEP

**Fecha:** 23 de septiembre de 2026  
**Estado:** PROPUESTO — requiere aprobación del Product Owner antes de ejecución

## 1. Contexto

E5 permanece `E5-PREVIEW / IMPLEMENTATION FREEZE`. E6 permanece `PARTIAL / IMPLEMENTATION FREEZE`. E7 se abre como una única entrega integral por decisión expresa del Product Owner.

E7 no reabre ni modifica E5 o E6. Las 15 deudas heredadas permanecen en el ledger. E7 puede consumir contratos y datos existentes, pero no puede declarar cerradas capacidades heredadas que no estén dentro de este contrato.

## 2. Objetivo

E7 debe conectar el modelo constructivo semántico con costos, planificación, coordinación y dominios técnicos preliminares. La entrega debe demostrar una cadena verificable:

```text
modelo BIM → metrados → partidas/APU → presupuesto 5D → actividades 4D
           → recursos y ruta crítica → clashes reales → consecuencias técnicas
           → evidencia, auditoría y revisión humana
```

La entrega no convierte a ARKI en software de cálculo firmado. Los resultados estructurales y MEP serán predimensionamiento o contrato técnico con stub, salvo que exista un solver real autorizado y fixtures suficientes.

## 3. Decisiones de alcance adoptadas para este contrato

| ID | Decisión | Resolución propuesta |
|---|---|---|
| E7-D1 | E7 completo o dividido | Completo, una sola entrega |
| E7-D2 | Prioridad | Integración conjunta: 5D, 4D, coordinación, estructuras y MEP |
| E7-D3 | OpenSees | Contrato de StructuralModel y adaptador stub funcional; solver real sólo si el entorno está disponible |
| E7-D4 | MEP | Contrato de MEPModel y reglas verificables; cálculo productivo real queda fuera si no existe solver autorizado |
| E7-D5 | Fixtures propios | Sí, mínimo tres fixtures: costos/cronograma, estructura y MEP |
| E7-D6 | Normativa MEP | Subset inicial: gases medicinales, seguridad y sanitarias |
| E7-D7 | Estado profesional | Predimensionamiento; `PROFESSIONAL_VALIDATION_REQUIRED` cuando corresponda |

## 4. Bloques internos de E7

Aunque E7 sea una sola entrega contractual, se ejecutará en bloques internos con gates técnicos. Estos bloques no crean fases independientes ni autorizan promoción parcial automática.

### Bloque A — Gobierno de datos 5D y 4D

Debe conectar elementos, cantidades, unidades, partidas, precios, APU, presupuesto, recursos, actividades, duraciones, precedencias y ruta crítica. Cada resultado debe conservar trazabilidad hasta el elemento BIM y la fuente de precio o rendimiento.

Debe incluir:

- PriceBook corporativo versionado.
- Partidas y APU vinculados a metrados.
- Reconciliación cantidad × precio = costo.
- Recursos y unidades de producción.
- Actividades 4D vinculadas a elementos o partidas.
- Precedencias y ruta crítica.
- Avance planificado y estado de actividad.
- Cambios de modelo que invalidan costo o plazo.

### Bloque B — Coordinación y clashes reales

Debe detectar intersecciones volumétricas entre elementos y registrar disciplina, severidad, tolerancia, elementos afectados, ubicación, estado, responsable, evidencia y resolución.

No se acepta una lista conceptual de interferencias. El fixture debe producir al menos una colisión geométrica reproducible y una no-colisión controlada.

Debe incluir:

- Índice espacial o estrategia equivalente documentada.
- Detección de volumen intersectado.
- Tolerancias explícitas.
- Clashes entre arquitectura, estructura y MEP.
- Estados: abierto, revisado, aceptado, resuelto, rechazado.
- Reporte antes/después.
- Relación con snapshots y auditoría existente.

### Bloque C — StructuralModel

Debe definir un contrato formal para nodos, barras, apoyos, cargas, combinaciones, materiales, unidades, resultados y límites. El adaptador OpenSees será stub funcional si no hay solver real autorizado.

El stub no puede simular resultados profesionales. Debe devolver estado `NOT_DEMONSTRATED` o `PROFESSIONAL_VALIDATION_REQUIRED` cuando no haya cálculo real.

### Bloque D — MEPModel

Debe definir sistemas, redes, conectores, fuentes, ramales, dispositivos, caudal, presión, pérdida, diámetro, material, pendiente y relaciones topológicas.

El subset inicial cubre:

- Gases medicinales: oxígeno, vacío, aire medicinal, óxido nitroso y dióxido de carbono.
- Seguridad: detección, alarma, CCTV, control de acceso, incendio, evacuación, intrusión y emergencia.
- Sanitarias: agua, desagüe, ventilación sanitaria y equipos relacionados.

Sin solver real, el sistema debe validar topología, unidades, reglas básicas, conflictos y datos faltantes, pero no declarar dimensionamiento firmado.

### Bloque E — Consecuencias interdisciplinarias

Un cambio en un elemento debe poder reportar consecuencias potenciales en costos, cronograma, clashes, estructura o MEP. La primera versión puede ser un grafo de impactos explícito y determinista; no se exige todavía razonamiento autónomo completo.

Cada consecuencia debe indicar:

- origen;
- elemento o sistema afectado;
- tipo de impacto;
- operación requerida;
- severidad;
- evidencia;
- estado de revisión humana.

## 5. Archivos autorizados

Se pueden crear:

- `shared/arki5d/`;
- `shared/arki4d/`;
- `shared/coordination/`;
- `shared/structural/`;
- `shared/mep/`;
- `client/src/modules/` para paneles de E7;
- `client/src/coordination/`;
- `scripts/test-e7-*.ts`;
- `fixtures/e7/`;
- `evidence/E7_CAPTURAS/`;
- ADRs específicos de E7.

Se pueden extender de forma aditiva los contratos de selección, SceneModel y persistencia cuando sea necesario y documentado.

No se permite:

- reabrir E5 o E6;
- reemplazar `ConstructionModel`, `Muro` o entidades canónicas;
- modificar el catálogo de 16 módulos sin contrato adicional;
- declarar solver estructural o MEP real sin recurso real y evidencia;
- crear integraciones externas simuladas.

## 6. Pruebas mínimas

E7 exige como mínimo 22 pruebas nuevas:

- 4 de PriceBook, partidas y APU.
- 3 de reconciliación de metrados y costos.
- 3 de actividades, precedencias y ruta crítica.
- 4 de clashes geométricos y estados.
- 3 de StructuralModel y límites del stub OpenSees.
- 3 de MEPModel, conectores y topología.
- 2 de consecuencias interdisciplinarias.

Todas deben imprimir `{ "status": "PASS", ... }` con datos reales de fixtures. Las pruebas previas de E5 y E6 deben continuar pasando.

## 7. Fixtures mínimos

E7 debe incluir al menos:

1. `fixture_cost_schedule_project.json`: elementos, cantidades, partidas, precios, actividades y precedencias.
2. `fixture_structural_small_frame.json`: nodos, barras, cargas, apoyos y materiales.
3. `fixture_mep_hospital_subset.json`: gases, sanitarias, seguridad, conectores y conflictos.

Cada fixture debe tener hash SHA-256 y provenance.

## 8. Capturas obligatorias

E7 debe entregar al menos ocho capturas con SHA-256 y metadatos:

1. Metrado enlazado a partida y precio.
2. Presupuesto 5D reconciliado.
3. Cronograma 4D con ruta crítica.
4. Clash geométrico abierto.
5. Clash resuelto o aceptado.
6. StructuralModel con límites del stub visibles.
7. MEPModel topológico con conectores y datos faltantes.
8. Panel de consecuencias interdisciplinarias.

## 9. Outputs y manifest

La entrega debe incluir:

- `E7_OUTPUTS.txt` con outputs crudos completos.
- `E7_MANIFEST.json` con hashes.
- `E7_REPORT.md`.
- `E7_SCOPE_LIMITS.md`.
- `E7_DEBT_INHERITED.md`.
- ADRs firmados o marcados como propuestos antes de código.

## 10. Criterios de aceptación

E7 sólo podrá declararse `VERIFIED` cuando:

- el contrato y ADRs estén aprobados;
- `pnpm check` y `pnpm build` pasen;
- las 22 pruebas nuevas pasen con outputs reales;
- los tres fixtures existan con hash;
- las ocho capturas existan con hash y metadatos;
- 5D reconcilie cantidades, partidas y precios;
- 4D calcule precedencias y ruta crítica;
- al menos un clash geométrico real sea reproducible;
- StructuralModel y MEPModel distingan claramente contrato, stub y cálculo real;
- las consecuencias interdisciplinarias sean trazables;
- no existan regresiones;
- DeepSeek emita veredicto corto;
- el Product Owner firme el cierre.

## 11. Límite temporal

E7 tiene un máximo de dos ciclos de trabajo en estado `PARTIAL`. Si no cumple los criterios al finalizar el segundo ciclo, se congela como `PARTIAL / IMPLEMENTATION FREEZE` y se registra toda la deuda en el ledger. No se permite inflar el alcance para evitar el cierre.

## 12. Acción solicitada al Product Owner

Aprobar o modificar este contrato. La aprobación debe indicar expresamente si acepta:

- E7 como una sola entrega completa;
- OpenSees y cálculo MEP como contrato + stub cuando no exista solver real;
- subset MEP de gases medicinales, seguridad y sanitarias;
- mínimo de tres fixtures;
- mínimo de 22 pruebas;
- mínimo de ocho capturas;
- límite de dos ciclos;
- E7B o nuevas entregas posteriores bloqueadas hasta cierre de E7.

**Estado actual:** no se ejecuta código E7 hasta recibir aprobación explícita del contrato.
