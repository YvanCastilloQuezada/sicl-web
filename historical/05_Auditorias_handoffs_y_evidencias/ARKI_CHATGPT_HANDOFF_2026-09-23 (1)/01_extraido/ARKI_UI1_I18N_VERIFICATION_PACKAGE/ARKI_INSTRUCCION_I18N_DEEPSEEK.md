# Instrucción adicional para DeepSeek — Selector de 8 idiomas

El contrato de UI BIM queda ampliado: debes diseñar e implementar el flujo completo del botón de cambio de idioma para ocho idiomas, no solo mencionarlo en la documentación.

## Catálogo obligatorio

`es`, `en`, `pt`, `fr`, `de`, `it`, `zh`, `ja`.

## Entrega esperada

- Contrato de interacción del botón.
- Estado seleccionado, fallback y persistencia prevista.
- Catálogo centralizado, sin strings mágicos dispersos.
- Botón visible en el shell BIM.
- Estados de carga, idioma no traducido y error.
- Test mínimo de los 8 idiomas.
- Output real de compilación y del test.
- Declaración explícita de qué cadenas están traducidas y cuáles quedan pendientes.

## Regla de honestidad

Si solo existe el catálogo y el cambio local del código, el estado será `PARTIAL` o `CONCEPTUAL`, nunca “traducción completa”. La internacionalización debe incluir posteriormente textos del gateway, shell, generador, expediente, costos, BIM, errores, tooltips, unidades, fechas, moneda y exportaciones.
