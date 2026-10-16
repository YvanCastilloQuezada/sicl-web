# ARKI — Aprendizaje relacional para la automejora

Fecha: 2026-10-14. Estado: `CANDIDATE_ENGINE_IMPLEMENTED / DISCOVERY_NOT_AUTOMATED / TESTS_NOT_EXECUTED`.

## Propósito

ARKI debe aprender el grafo de capacidades y sus antecedentes, no solo ordenarlas por fase. El Árbol Vivo sigue siendo la fuente visual y organizativa; este módulo no crea un segundo árbol ni un segundo motor.

`tools/maqueta-viva/arki-relational-learning.cjs` recibe declaraciones con `before`, `after`, `relation` (REQUIRES/INFORMS/FEEDBACK), y `source` con `path`, `sha` y `quote`. Valida existencia de piezas, trazabilidad declarada, duplicados y ciclos de REQUIRES. Devuelve propuestas `PROPOSED_FOR_REVIEW`, no relaciones certificadas.

**Advertencia:** un campo `source.quote` proporcionado por un actor no prueba que el documento contenga realmente esa cita. Se requiere lectura/verificación de la fuente en el SHA indicado antes de cualquier aceptación. No inferir que una frase aislada prueba necesidad técnica.

## Flujo de automejora pendiente

1. Autoinventario de tres repositorios y contratos vigentes.
2. Extracción de afirmaciones explícitas y citas localizables en archivos reales.
3. Clasificación de aristas REQUIRES/INFORMS/FEEDBACK con evaluación adversarial.
4. Verificación de fuente y competencias; revisión humana de relaciones que puedan bloquear ejecución.
5. Grafo aprobado en Árbol Vivo; propagación de dependencias, identificación de ruta crítica y déficits.
6. ADN-MC propone tres alternativas, ejecuta experimentos aislados y mide impactos (aún no implementado integralmente).
7. ACE88 verifica autorización antes de promoción; aprendizaje Delta 6.2 y reevaluación.

Pruebas locales:

```bash
node --test tools/maqueta-viva/arki-relational-learning.test.cjs
```

La suite está agregada al runner offline. **No se han ejecutado las pruebas aquí**.

El registro histórico contiene 51 elementos, 0 con antecedentes declarados. No sustituir relaciones desconocidas por listas inventadas.
