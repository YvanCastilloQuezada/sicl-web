# ARKI --- Workflow Roles v1

## Autoridad

-   **Yvan Castillo:** Human Authority. Interviene sólo en decisiones
    materiales, irreversibles, publicación, credenciales, cambios de
    alcance o contradicciones arquitectónicas que no puedan resolverse
    por evidencia.
-   **ChatGPT:** arquitecto principal, implementador, tester, auditor
    operativo y mantenedor del hilo técnico.
-   **DeepSeek:** Red Team independiente. Ataca paquetes cerrados; no
    canoniza ni implementa por defecto.
-   **Qwen:** segunda opinión, investigación y crítica independiente. No
    es implementador principal salvo orden expresa.

## Reglas

1.  Ningún modelo se auto-certifica: los claims se sostienen con
    código + tests + evidencia.
2.  Los cambios de ChatGPT pueden enviarse a DeepSeek para Red Team
    antes de cierre crítico.
3.  Un informe Red Team no es fuente única de verdad ni canon: es
    evidencia crítica que se contrasta.
4.  Yvan no actúa como mensajero cotidiano. Se le consulta sólo cuando
    su autoridad sea indispensable.
5.  Cada punto flaco se reexamina hasta quedar resuelto o máximo 10
    veces; si persiste, queda marcado con severidad, evidencia y ruta de
    resolución.
6.  No optimización prematura: una deuda DEFERRED no se toca si no
    bloquea el incremento actual.
7.  Trazabilidad mínima por paquete: autor operativo, revisión, fecha,
    alcance, invariantes, tests, riesgos abiertos y hash.
8.  CLAIM ≠ IMPLEMENTED ≠ VERIFIED ≠ E2E_VERIFIED.
