# ARKI MO-37 — CODER benchmark

Modelos probados: 12; registros: 24

| Modelo | Prueba | Estado | Segundos | TTFT | Tokens/s |
|---|---|---|---:|---:|---:|
| qwen3-coder:30b | B01 | RESPUESTA | 23.75 | 8.56 | 39.9 |
| qwen3-coder:30b | B02 | RESPUESTA | 21.38 | 0.59 | 39.92 |
| qwen3-coder-next:q4_K_M | B01 | RESPUESTA | 80.56 | 47.99 | 27.63 |
| qwen3-coder-next:q4_K_M | B02 | RESPUESTA | 34.55 | 2.35 | 27.95 |
| deepcoder:14b | B01 | SIN_RESPUESTA_VISIBLE | 37.9 | — | 33.52 |
| deepcoder:14b | B02 | SIN_RESPUESTA_VISIBLE | 27.17 | — | 33.4 |
| yi-coder:9b | B01 | RESPUESTA | 14.03 | 6.39 | 58.78 |
| yi-coder:9b | B02 | RESPUESTA | 12.01 | 0.1 | 58.74 |
| deepseek-coder-v2:16b | B01 | RESPUESTA | 18.17 | 9.58 | 104.7 |
| deepseek-coder-v2:16b | B02 | RESPUESTA | 7.95 | 0.28 | 106.47 |
| deepseek-coder:1.3b | B01 | RESPUESTA | 5.16 | 3.74 | 271.56 |
| deepseek-coder:1.3b | B02 | RESPUESTA | 3.52 | 0.09 | 260.25 |
| devstral-small-2:24b | B01 | RESPUESTA | 148.44 | 18.15 | 6.7 |
| devstral-small-2:24b | B02 | RESPUESTA | 125.53 | 0.79 | 6.67 |
| granite4.2:8b | B01 | RESPUESTA | 23.36 | 7.19 | 55.65 |
| granite4.2:8b | B02 | RESPUESTA | 16.63 | 0.19 | 54.77 |
| gpt-oss:20b | B01 | RESPUESTA | 41.7 | 28.55 | 42.35 |
| gpt-oss:20b | B02 | RESPUESTA | 20.92 | 11.38 | 43.91 |
| ornith-1.5:9b | B01 | RESPUESTA | 26.68 | 9.52 | 52.45 |
| ornith-1.5:9b | B02 | RESPUESTA | 17.48 | 0.3 | 52.39 |
| ALIENTELLIGENCE/schematicdesign:latest | B01 | RESPUESTA | 25.26 | 16.63 | 64.56 |
| ALIENTELLIGENCE/schematicdesign:latest | B02 | RESPUESTA | 7.57 | 0.15 | 64.61 |
| ALIENTELLIGENCE/computervisionengineer:latest | B01 | RESPUESTA | 13.59 | 5.05 | 64.62 |
| ALIENTELLIGENCE/computervisionengineer:latest | B02 | RESPUESTA | 9.54 | 0.11 | 64.57 |

**Advertencia:** este benchmark mide generación y respuestas, no certifica código correcto, integración real, seguridad ni ejecución de pruebas. Revisar respuestas completas en resultados.json.
