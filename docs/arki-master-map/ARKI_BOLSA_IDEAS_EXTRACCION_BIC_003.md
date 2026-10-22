# ARKI — BIC-003 / Macrolote de extracción 2

Estado: PARTIAL / 2026-10-13. Evidencia: comparaciones GitHub main...rama; ninguna prueba runtime ejecutada.

## Nuevas ramas analizadas (12)
| Repo | Rama | Ahead | Behind | Idea o conjunto que se conserva |
|---|---|---:|---:|---|
| WEB | feat/arki-architectural-developer-c7 | 0 | 110 | Developer arquitectónico: estudiar funcionalidad actual, no descartar |
| WEB | feat/d63-to-d2-geometry-bridge | 1 | 81 | Puente geométrico D6.3 → D-2; conector D-2/AGK a validar |
| WEB | feat/capability-fabric-001-contract | 103 | 29 | Fabric de capacidades, repositorio de conocimiento, harvesting y pruebas |
| WEB | feat/visualization-engine-phase-1 | 0 | 385 | Motor de visualización; conservar intención y evaluar cobertura actual |
| WEB | feat/arki-autonomy-memory-main-20261013 | 2 | 0 | Memoria hash encadenada experimental; CI PR #58 fallido |
| WEB | feat/acs-v1-integration-lab | 149 | 29 | Laboratorio de integración ACS; comparación muestra AGK, Capability Fabric y E2E; revisar posible solapamiento |
| CORE | feat/arki-are-001-contract | 0 | 96 | Contrato de motor de representación ARE; conservar idea |
| CORE | feat/arki-are-002-runtime-foundation | 0 | 92 | Fundamentos de ejecución ARE; conservar idea |
| CORE | feat/arki-are-003-2d-projection | 0 | 89 | Proyección 2D ARE; conservar idea |
| CORE | feat/arkidraw-block1 | 0 | 113 | Dibujo ARKIDRAW; conservar idea |
| CORE | feat/arkidraw-block2-scene-adapter | 2 | 88 | Adaptador de escena; archivos: scene_adapter.py, test_drawing_block2.py y auditoría |
| CORE | feat/arki-m1-vector-plan-pipeline | 0 | 85 | Canal vectorial de planos; conservar idea |

## Nuevos clústeres candidatos
- CL-11 Representación ARE: ARE-001/002/003, M1 vector plan y visualización WEB. **Complementariedad hipotética**, no probada.
- CL-12 Dibujo ARKIDRAW: block1 + block2 scene adapter + RFC-034 layout. Diferenciar renderer, adaptador y composición de láminas.
- CL-13 Developer / promoción: C7, Core D-2 eventos, Capability Fabric. No cruzar fronteras de autoridad.
- CL-14 Puente D6.3 → D-2: evaluar compatibilidad con AGK único y ley de verdad geométrica.
- CL-15 ACS / Capability Fabric: ramas web de laboratorio y repo ACS; comparar funciones antes de deduplicar.

## Regla de conteo
Una rama puede originar varias fichas; un clúster puede contener varias ideas. El conteo definitivo permanece UNKNOWN hasta inspeccionar contenido, pruebas y equivalencias. `ahead=0` es estado Git, no estado de la idea.

## Pendientes
Ramas únicas comparadas acumuladas: 27 de 189 no-main (15 + 12). Restan 162 para comparación preliminar. No se ha ejecutado CI ni se han validado conectores. No se debe presentar esto como extracción completa.
