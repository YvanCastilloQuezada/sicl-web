# Archi — Paquete de documentos Markdown separados

## Instrucciones de envío

DeepSeek no debe recibir un ZIP. Enviar los archivos `.md` individualmente o copiar primero `01_MENSAJE_MAESTRO.md` y después adjuntar los demás documentos según el orden indicado.

La instrucción inmediata es: leer todo, auditar el repositorio real, actualizar la Addenda E en cuatro partes y ocho entregas, y devolver una única Orden Maestra consolidada. No debe comenzar código hasta que el contrato sea revisado.

## Archivos

| Orden | Archivo | Uso |
|---|---|---|
| 00 | `00_INDICE_Y_INSTRUCCIONES.md` | Cómo enviar el paquete. |
| 01 | `01_MENSAJE_MAESTRO.md` | Mensaje principal para copiar y pegar. |
| 02 | `02_RESUMEN_HISTORICO.md` | Evolución, decisiones y contexto. |
| 03 | `03_ESTADO_IMPLEMENTADO_PENDIENTE.md` | Estado real y brechas. |
| 04 | `04_ADDENDA_E_V2_4_PARTES_8_ENTREGAS.md` | Contrato ampliado principal. |
| 05 | `05_CONTROLES_16_MODULOS.md` | Controles funcionales de los 16 módulos. |
| 06 | `06_FLUJO_TRABAJO_PANELES.md` | Flujo y lógica de los paneles. |
| 07 | `07_ROADMAP_CORPORATIVO.md` | Roadmap corporativo. |
| 08 | `08_CONTRATO_UI3A.md` | Contrato UI-3A y canvas de selección. |
| 09 | `09_PROPUESTA_PLANTA_SVG_ARQUI.md` | Propuesta recibida de planta SVG interactiva. |
| 10 | `10_RESUMEN_PLANTA_SVG_Y_ESTADO.md` | Interpretación y estado de esa propuesta. |

## Regla de verificación

La propuesta SVG del archivo 09 es una referencia funcional, no evidencia de implementación actual. DeepSeek debe verificar qué existe realmente en el repositorio y marcar cada función como implementada, parcial, conceptual, no implementada o futura.


| 15 | `15_PROTOCOLO_DESBLOQUEO_TEMPORAL_REBLOQUEO.md` | Implementar temporalmente lo posible y restaurar el modo fail-closed. |


| 16 | `16_ORDEN_MAESTRA_CONSOLIDADA_V3.md` | Propuesta única v3.0 recibida de DeepSeek. |
| 17 | `17_VEREDICTO_PROPUESTA_V3.md` | Revisión preliminar: borrador aceptable, implementación deferida. |

| 18 | `18_RESPUESTA_VEREDICTO_FASE_0_AUTORIZADA.md` | Respuesta de DeepSeek: Fase 0 autorizada, E2-E8 deferidos. |
| 19 | `19_FASE_0_AUDITORIA_REAL_2026-09-23.md` | Auditoría real ejecutada por Manus, outputs y veredicto. |
| 20 | `20_ORDEN_MAESTRA_CONSOLIDADA_V3_1.md` | Versión operativa para cerrar Fase 0 y abrir E1. |
| 21 | `21_FASE_0_CLASIFICACION_ARCHIVOS.md` | FIX-0.1: clasificación de archivos del árbol. |
| 22 | `22_FASE_0_BASELINE_HASHES.md` | FIX-0.6: baseline y hashes operativos. |
| 23 | `23_FASE_0_ADRS_RECLASIFICADOS.md` | FIX-0.3: ADR-NUEVO versus ADR-EXTENSIÓN. |
| 24 | `24_FASE_0_BLOQUEO_CONFIRMADO.md` | FIX-0.5: E2-E8 y fail-closed confirmados. |
| 25 | `25_FASE_0_CAPTURAS_MANIFEST.md` | FIX-0.2: manifest de C1–C5 con hashes. |
| 26 | `26_DECISIONES_P0_PRODUCT_OWNER.md` | Tabla para resolver las cinco decisiones P0. |
| 27 | `27_DECISIONES_P0_RESUELTAS.md` | Resolución del Product Owner: visor, persistencia, IFC4, estructuras y MEP. |
| 28 | `28_ORDEN_MAESTRA_CONSOLIDADA_V3_2.md` | Cierre Fase 0 y preparación de E1; requiere firma PO. |
| 39 | `39_E1_README.md` | Alcance, entregables y criterio de cierre de E1. |
| 40 | `40_E1_VERIFICATION_OUTPUTS.txt` | Outputs brutos de check, build y pruebas de regresión. |
| 41 | `41_E1_VERIFICATION_REPORT.md` | Veredicto técnico provisional y condiciones de avance. |
| 47 | `47_E2_VERIFICATION_OUTPUTS.txt` | Outputs de check, build y regresión de E2. |
| 48 | `48_E2_VERIFICATION_REPORT.md` | Veredicto técnico provisional y límites de E2. |
| 49 | `49_E3_README.md` | Alcance y criterio de cierre del catálogo P2. |
| 50 | `50_E3_CATALOGO_18_DISCIPLINAS.md` | Catálogo de 18 disciplinas y dominios. |
| 51 | `51_E3_INVENTARIO_FAMILIAS_Y_EQUIPAMIENTO.md` | Familias, mobiliario, equipamiento e importación. |
| 52 | `52_E3_CATALOGOS_ESPECIALIZADOS.md` | Escaleras, ascensores, gases y seguridad. |
| 53 | `53_E3_MATRIZ_ESPECIALISTAS_BRECHAS.md` | Responsables, evidencias y brechas. |
| 54 | `54_E3_VERIFICATION_OUTPUTS.txt` | Outputs de check, build y regresión de E3. |
| 55 | `55_E3_VERIFICATION_REPORT.md` | Veredicto técnico provisional y límites de E3. |
| 56 | `56_E4_README.md` | Alcance y límites de contratos especializados. |
| 57 | `57_E4_ESQUEMA_COMUN_FAMILIAS_ESPECIALIZADAS.md` | Esquema común de datos y estados. |
| 58 | `58_E4_REGLAS_ESCALERAS_ASCENSORES.md` | Contratos paramétricos de escaleras y ascensores. |
| 59 | `59_E4_REGLAS_GASES_SEGURIDAD_MEP.md` | Contratos de gases, seguridad y MEP. |
| 60 | `60_E4_GOBIERNO_ESPECIALISTAS_REVISION.md` | Gobierno, revisión y aprobación profesional. |
| 61 | `61_E4_CATALOGO_PRUEBAS_E4.md` | Casos de aceptación E4-T01–E4-T10. |
| 62 | `62_E4_VERIFICATION_OUTPUTS.txt` | Outputs de check, build y regresión de E4. |
| 63 | `63_E4_VERIFICATION_REPORT.md` | Veredicto técnico provisional y límites de E4. |
