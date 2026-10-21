# ARKI — Tres alternativas en Árbol Gemelo Digital

Estado: EVALUATOR_IMPLEMENTED / REAL_SIMULATOR_NOT_CONNECTED / TESTS_NOT_EXECUTED.

Cada idea debe producir exactamente tres alternativas A/B/C con métricas simples: tiempo (ms), costo (misma unidad de baseline), calidad (0–100), riesgo (0–100), pruebas superadas/total y variación porcentual de tiempo y costo.

`tools/maqueta-viva/arki-twin-three-alternatives.cjs` evalúa datos suministrados, pero **no ejecuta simulaciones**. Diferencia HYPOTHETICAL de MEASURED y exige recibo de verificador independiente para aceptar una etiqueta MEASURED. Actualmente verifica solo la forma del recibo: no autentica criptográficamente al verificador. No convertir esta marca en prueba suficiente de ejecución real.

Tres opciones medidas pueden pasar a revisión del PO si las dependencias están en PASS, todas las pruebas pasan y riesgo <=50. No se elige ganadora ni se muta el Árbol Vivo. La decisión final requiere identidad, vinculación de idea/alternativa/revisión y autoridad ACE88 aplicable.

Ejecutar:
```bash
node --test tools/maqueta-viva/arki-twin-three-alternatives.test.cjs
```

Siguientes integraciones: conectar simulador aislado del Árbol Gemelo Digital, persistir evidencia autenticada de cada alternativa, asociar propuestas a ideas y precedencias del Árbol Vivo, mostrar tres tarjetas comparables en UI y habilitar selección humana antes de cualquier promoción. No declarar mejoras medidas sin experimentos reales.
